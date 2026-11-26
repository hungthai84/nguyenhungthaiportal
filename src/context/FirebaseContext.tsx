import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BLUEPRINT_LIMITS,
  OperationType,
  auth,
  clampString,
  db,
  googleProvider,
  handleFirestoreError,
  sanitizeFirestoreId,
  sanitizeInquiryTags,
} from '@/firebase';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, LanguagePreference } from '@/context/LanguageContext';
import { VALID_CARD_STYLES, normalizeCardStyle } from '@/config/ui/cardStyles';
import { WallpaperPreset, WallpaperType, WALLPAPER_PRESETS_LIST, parseCssStringToStyle } from '@/data/wallpapers';

export type InquiryTopic = 'recruitment' | 'cx_advisory' | 'project_collab' | 'other';
export type InquiryStatus = 'submitted' | 'archived';

export interface CloudInquiryItem {
  id: string;
  authorId: string;
  senderName: string;
  organization: string;
  topic: InquiryTopic;
  message: string;
  tags: string[];
  status: InquiryStatus;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface SubmitInquiryInput {
  senderName: string;
  organization: string;
  topic: InquiryTopic;
  message: string;
  tags: string[];
}

export interface FirebaseContextType {
  user: User | null;
  authReady: boolean;
  isSigningIn: boolean;
  cloudWallpapers: WallpaperPreset[];
  inquiries: CloudInquiryItem[];
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  saveCloudWallpaper: (wp: WallpaperPreset) => Promise<void>;
  deleteCloudWallpaper: (wallpaperId: string) => Promise<void>;
  submitInquiry: (input: SubmitInquiryInput) => Promise<string>;
  updateInquiryContent: (inquiryId: string, patch: SubmitInquiryInput) => Promise<void>;
  archiveInquiry: (inquiryId: string) => Promise<void>;
  deleteInquiry: (inquiryId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

function timestampToMs(ts: unknown): number {
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts && typeof (ts as { toMillis?: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis();
  }
  return Date.now();
}

function isTimestampLike(value: unknown): boolean {
  return (
    value instanceof Timestamp ||
    (Boolean(value) && typeof (value as { toMillis?: unknown }).toMillis === 'function')
  );
}

function isPermissionDeniedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: unknown }).code;
  const message = (error as { message?: unknown }).message;
  return (
    code === 'permission-denied' ||
    (typeof message === 'string' && message.toLowerCase().includes('missing or insufficient permissions'))
  );
}

const USER_PREF_REQUIRED_KEYS = [
  'uid',
  'displayName',
  'photoUrl',
  'cardStyle',
  'surfaceDepth',
  'autoTimeTheme',
  'language',
  'activeWallpaperId',
  'createdAt',
  'updatedAt',
] as const;

const USER_PREF_ALLOWED_KEYS = new Set<string>([
  ...USER_PREF_REQUIRED_KEYS,
  'layerDepth',
]);

function isValidExistingUserDoc(data: Record<string, unknown> | undefined, expectedUid: string): boolean {
  if (!data) return false;
  const keys = Object.keys(data);
  if (!USER_PREF_REQUIRED_KEYS.every((k) => k in data)) return false;
  if (!keys.every((k) => USER_PREF_ALLOWED_KEYS.has(k))) return false;
  if (typeof data.uid !== 'string' || data.uid !== expectedUid || !BLUEPRINT_LIMITS.ID_REGEX.test(data.uid)) {
    return false;
  }
  if (typeof data.displayName !== 'string' || data.displayName.length < 1 || data.displayName.length > BLUEPRINT_LIMITS.DISPLAY_NAME_MAX) {
    return false;
  }
  if (typeof data.photoUrl !== 'string' || data.photoUrl.length > BLUEPRINT_LIMITS.PHOTO_URL_MAX) {
    return false;
  }
  if (typeof data.cardStyle !== 'string' || !VALID_CARD_STYLES.includes(data.cardStyle as any)) {
    return false;
  }
  if (data.surfaceDepth !== 'flat' && data.surfaceDepth !== 'depth') {
    return false;
  }
  if ('layerDepth' in data) {
    if (
      typeof data.layerDepth !== 'number' ||
      !Number.isInteger(data.layerDepth) ||
      data.layerDepth < 0 ||
      data.layerDepth > 200
    ) {
      return false;
    }
  }
  if (typeof data.autoTimeTheme !== 'boolean') return false;
  if (data.language !== 'auto' && data.language !== 'vi' && data.language !== 'en') return false;
  if (
    typeof data.activeWallpaperId !== 'string' ||
    data.activeWallpaperId.length < 1 ||
    data.activeWallpaperId.length > BLUEPRINT_LIMITS.ID_MAX_LEN ||
    !BLUEPRINT_LIMITS.ID_REGEX.test(data.activeWallpaperId)
  ) {
    return false;
  }
  if (!isTimestampLike(data.createdAt) || !isTimestampLike(data.updatedAt)) return false;
  return true;
}

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [cloudWallpapers, setCloudWallpapers] = useState<WallpaperPreset[]>([]);
  const [inquiries, setInquiries] = useState<CloudInquiryItem[]>([]);

  const {
    cardStyle,
    setCardStyle,
    surfaceDepth,
    autoTimeTheme,
    setAutoTimeTheme,
    activeWallpaper,
    setWallpaper,
  } = useTheme();
  const { language, setLanguageMode } = useLanguage();

  const isHydratingFromCloudRef = useRef<boolean>(false);
  const userDocReadyUidRef = useRef<string | null>(null);
  const latestUiRef = useRef({
    cardStyle,
    surfaceDepth,
    autoTimeTheme,
    language,
    activeWallpaperId: activeWallpaper?.id || 'custom-wp-1788112774646',
  });
  latestUiRef.current = {
    cardStyle,
    surfaceDepth,
    autoTimeTheme,
    language,
    activeWallpaperId: activeWallpaper?.id || 'custom-wp-1788112774646',
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
      if (!firebaseUser) {
        userDocReadyUidRef.current = null;
        setCloudWallpapers([]);
        setInquiries([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Ensure /users/{uid} exists or hydrate local UI state on sign-in
  useEffect(() => {
    if (!authReady || !user) return;
    let cancelled = false;
    const userPath = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);

    const buildFreshDocPayload = (
      safeName: string,
      safePhoto: string,
      safeWpId: string
    ) => {
      const ui = latestUiRef.current;
      const normalizedCardStyle = normalizeCardStyle(ui.cardStyle);
      const safeSurfaceDepth = ui.surfaceDepth === 'flat' ? 'flat' : 'depth';
      const safeLanguage = ui.language === 'en' ? 'en' : 'vi';
      return {
        uid: user.uid,
        displayName: safeName,
        photoUrl: safePhoto,
        cardStyle: normalizedCardStyle,
        surfaceDepth: safeSurfaceDepth,
        autoTimeTheme: Boolean(ui.autoTimeTheme),
        language: safeLanguage,
        activeWallpaperId: safeWpId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
    };

    const createFreshUserDoc = async (safeName: string, safePhoto: string, safeWpId: string) => {
      await setDoc(userRef, buildFreshDocPayload(safeName, safePhoto, safeWpId));
    };

    const bootstrapUserDoc = async () => {
      let snap;
      try {
        snap = await getDoc(userRef);
      } catch (readError) {
        if (!cancelled) {
          console.warn(`Firestore read skipped for ${userPath}; using local preferences.`, readError);
        }
        return;
      }
      if (cancelled) return;

      const safeName = clampString(user.displayName || user.email || 'Member', BLUEPRINT_LIMITS.DISPLAY_NAME_MAX, 'Member');
      const safePhoto = clampString(user.photoURL, BLUEPRINT_LIMITS.PHOTO_URL_MAX, '');
      const safeWpId = sanitizeFirestoreId(latestUiRef.current.activeWallpaperId, 'theme-bg');

      try {
        if (!snap.exists()) {
          if (!user.emailVerified) {
            return;
          }
          await createFreshUserDoc(safeName, safePhoto, safeWpId);
        } else {
          const data = snap.data() as Record<string, unknown>;
          isHydratingFromCloudRef.current = true;
          try {
            if (typeof data.cardStyle === 'string' && VALID_CARD_STYLES.includes(data.cardStyle as any)) {
              const normalized = normalizeCardStyle(data.cardStyle);
              if (normalized !== latestUiRef.current.cardStyle) {
                setCardStyle(normalized);
              }
            }
            if (typeof data.autoTimeTheme === 'boolean' && data.autoTimeTheme !== latestUiRef.current.autoTimeTheme) {
              setAutoTimeTheme(data.autoTimeTheme);
            }
            if (data.language === 'vi' || data.language === 'en' || data.language === 'auto') {
              setLanguageMode(data.language as LanguagePreference);
            }
            if (typeof data.activeWallpaperId === 'string' && data.activeWallpaperId.trim()) {
              const preset = WALLPAPER_PRESETS_LIST.find((w) => w.id === data.activeWallpaperId);
              if (preset && preset.id !== latestUiRef.current.activeWallpaperId) {
                setWallpaper(preset);
              }
            }
          } finally {
            setTimeout(() => {
              isHydratingFromCloudRef.current = false;
            }, 250);
          }

          if (user.emailVerified) {
            if (!isValidExistingUserDoc(data, user.uid)) {
              // Migrate legacy/incomplete user preference document cleanly
              await deleteDoc(userRef);
              if (cancelled) return;
              await createFreshUserDoc(safeName, safePhoto, safeWpId);
            } else if (data.displayName !== safeName || data.photoUrl !== safePhoto) {
              await updateDoc(userRef, {
                displayName: safeName,
                photoUrl: safePhoto,
                updatedAt: serverTimestamp(),
              });
            }
          }
        }
        if (!cancelled) {
          userDocReadyUidRef.current = user.uid;
        }
      } catch (error) {
        if (!cancelled) {
          userDocReadyUidRef.current = null;
          console.warn(
            `Firestore preference bootstrap fallback (${userPath}):`,
            error instanceof Error ? error.message : String(error)
          );
        }
      }
    };

    void bootstrapUserDoc();
    return () => {
      cancelled = true;
    };
  }, [authReady, user, setCardStyle, setAutoTimeTheme, setLanguageMode, setWallpaper]);

  // Persist UI preference updates to /users/{uid} (Action 2 affectedKeys) when signed in
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) return;
    if (userDocReadyUidRef.current !== user.uid) return;
    if (isHydratingFromCloudRef.current) return;

    const userPath = `users/${user.uid}`;
    const timer = setTimeout(() => {
      const safeWpId = sanitizeFirestoreId(activeWallpaper?.id || 'custom-wp-1788112774646', 'theme-bg');
      const prefPayload: Record<string, unknown> = {
        cardStyle: normalizeCardStyle(cardStyle),
        surfaceDepth: surfaceDepth === 'flat' ? 'flat' : 'depth',
        autoTimeTheme: Boolean(autoTimeTheme),
        language: language === 'en' ? 'en' : 'vi',
        activeWallpaperId: safeWpId,
        updatedAt: serverTimestamp(),
      };

      updateDoc(doc(db, 'users', user.uid), prefPayload).catch((error) => {
        console.warn(
          `Firestore preference sync skipped (${userPath}):`,
          error instanceof Error ? error.message : String(error)
        );
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [authReady, user, cardStyle, surfaceDepth, autoTimeTheme, language, activeWallpaper?.id]);

  // Live listener for user's custom wallpapers (/users/{uid}/wallpapers)
  useEffect(() => {
    if (!authReady || !user) return;
    const wallpapersPath = `users/${user.uid}/wallpapers`;
    const q = query(
      collection(db, 'users', user.uid, 'wallpapers'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: WallpaperPreset[] = snapshot.docs
          .map((docSnap) => {
            const d = docSnap.data();
            const wpType = (d.wallpaperType || 'image') as WallpaperType;
            const wpVal = typeof d.value === 'string' ? d.value : '';
            const previewStyle: React.CSSProperties =
              wpType === 'image'
                ? {
                    backgroundImage: `url('${wpVal}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : wpType === 'css' || wpType === 'gradient'
                  ? parseCssStringToStyle(wpVal)
                  : {};
            return {
              id: docSnap.id,
              name: typeof d.name === 'string' ? d.name : 'Custom Wallpaper',
              type: wpType,
              value: wpVal,
              bg: wpType === 'image' ? `url('${wpVal}') center/cover no-repeat` : wpVal,
              previewStyle,
              isCustom: true,
              createdAt: timestampToMs(d.createdAt),
            };
          })
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCloudWallpapers(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, wallpapersPath);
      }
    );

    return () => unsubscribe();
  }, [authReady, user]);

  // Live listener for signed-in user's own inquiries (/inquiries)
  useEffect(() => {
    if (!authReady || !user) return;
    const inquiriesPath = 'inquiries';
    const q = query(
      collection(db, 'inquiries'),
      where('authorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CloudInquiryItem[] = snapshot.docs
          .map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              authorId: String(d.authorId || ''),
              senderName: String(d.senderName || ''),
              organization: String(d.organization || ''),
              topic: (d.topic || 'other') as InquiryTopic,
              message: String(d.message || ''),
              tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
              status: (d.status || 'submitted') as InquiryStatus,
              createdAtMs: timestampToMs(d.createdAt),
              updatedAtMs: timestampToMs(d.updatedAt),
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setInquiries(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, inquiriesPath);
      }
    );

    return () => unsubscribe();
  }, [authReady, user]);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return null;
      }
      if (error?.code === 'auth/unauthorized-domain') {
        console.warn('Firebase Auth: Unauthorized domain for Google sign-in. Falling back to anonymous auth.');
        try {
          const anonResult = await signInAnonymously(auth);
          return anonResult.user;
        } catch (anonErr) {
          console.error('Anonymous auth fallback failed:', anonErr);
        }
      }
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await signOut(auth);
  }, []);

  const saveCloudWallpaper = useCallback(
    async (wp: WallpaperPreset): Promise<void> => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const wpId = sanitizeFirestoreId(wp.id, 'custom-wp');
      const path = `users/${uid}/wallpapers/${wpId}`;
      const allowedType: WallpaperType = ['image', 'video', 'css', 'gradient', 'webgl'].includes(wp.type)
        ? wp.type
        : 'image';
      const safeName = clampString(wp.name, BLUEPRINT_LIMITS.WALLPAPER_NAME_MAX, 'Custom Wallpaper');
      const safeValue = clampString(wp.value || wp.bg, BLUEPRINT_LIMITS.WALLPAPER_VALUE_MAX, 'none');

      try {
        const wpRef = doc(db, 'users', uid, 'wallpapers', wpId);
        const existingSnap = await getDoc(wpRef);
        if (existingSnap.exists()) {
          await updateDoc(wpRef, {
            name: safeName,
            wallpaperType: allowedType,
            value: safeValue,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(wpRef, {
            ownerId: uid,
            name: safeName,
            wallpaperType: allowedType,
            value: safeValue,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    []
  );

  const deleteCloudWallpaper = useCallback(async (wallpaperId: string): Promise<void> => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const wpId = sanitizeFirestoreId(wallpaperId, 'custom-wp');
    const path = `users/${uid}/wallpapers/${wpId}`;
    try {
      await deleteDoc(doc(db, 'users', uid, 'wallpapers', wpId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const submitInquiry = useCallback(async (input: SubmitInquiryInput): Promise<string> => {
    if (!auth.currentUser) {
      throw new Error('Authentication required to submit an inquiry.');
    }
    const uid = auth.currentUser.uid;
    const inquiryId = sanitizeFirestoreId(`inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, 'inq');
    const path = `inquiries/${inquiryId}`;

    const allowedTopic: InquiryTopic = ['recruitment', 'cx_advisory', 'project_collab', 'other'].includes(input.topic)
      ? input.topic
      : 'other';
    const safeSenderName = clampString(input.senderName, BLUEPRINT_LIMITS.SENDER_NAME_MAX, 'Visitor');
    const safeOrg = clampString(input.organization, BLUEPRINT_LIMITS.ORGANIZATION_MAX, '');
    const safeMsg = clampString(input.message, BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MAX, '');
    if (safeMsg.length < BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN) {
      throw new Error(`Inquiry message must be at least ${BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN} characters.`);
    }
    const safeTags = sanitizeInquiryTags(input.tags || []);

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), {
        authorId: uid,
        senderName: safeSenderName,
        organization: safeOrg,
        topic: allowedTopic,
        message: safeMsg,
        tags: safeTags,
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return inquiryId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, []);

  const updateInquiryContent = useCallback(
    async (inquiryId: string, patch: SubmitInquiryInput): Promise<void> => {
      if (!auth.currentUser) return;
      const safeId = sanitizeFirestoreId(inquiryId, 'inq');
      const path = `inquiries/${safeId}`;
      const allowedTopic: InquiryTopic = ['recruitment', 'cx_advisory', 'project_collab', 'other'].includes(patch.topic)
        ? patch.topic
        : 'other';
      const safeSenderName = clampString(patch.senderName, BLUEPRINT_LIMITS.SENDER_NAME_MAX, 'Visitor');
      const safeOrg = clampString(patch.organization, BLUEPRINT_LIMITS.ORGANIZATION_MAX, '');
      const safeMsg = clampString(patch.message, BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MAX, '');
      if (safeMsg.length < BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN) {
        throw new Error(`Inquiry message must be at least ${BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN} characters.`);
      }
      const safeTags = sanitizeInquiryTags(patch.tags || []);

      try {
        await updateDoc(doc(db, 'inquiries', safeId), {
          senderName: safeSenderName,
          organization: safeOrg,
          topic: allowedTopic,
          message: safeMsg,
          tags: safeTags,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    []
  );

  const archiveInquiry = useCallback(async (inquiryId: string): Promise<void> => {
    if (!auth.currentUser) return;
    const safeId = sanitizeFirestoreId(inquiryId, 'inq');
    const path = `inquiries/${safeId}`;
    try {
      await updateDoc(doc(db, 'inquiries', safeId), {
        status: 'archived',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const deleteInquiry = useCallback(async (inquiryId: string): Promise<void> => {
    if (!auth.currentUser) return;
    const safeId = sanitizeFirestoreId(inquiryId, 'inq');
    const path = `inquiries/${safeId}`;
    try {
      await deleteDoc(doc(db, 'inquiries', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const value = useMemo<FirebaseContextType>(
    () => ({
      user,
      authReady,
      isSigningIn,
      cloudWallpapers,
      inquiries,
      signInWithGoogle,
      logout,
      saveCloudWallpaper,
      deleteCloudWallpaper,
      submitInquiry,
      updateInquiryContent,
      archiveInquiry,
      deleteInquiry,
    }),
    [
      user,
      authReady,
      isSigningIn,
      cloudWallpapers,
      inquiries,
      signInWithGoogle,
      logout,
      saveCloudWallpaper,
      deleteCloudWallpaper,
      submitInquiry,
      updateInquiryContent,
      archiveInquiry,
      deleteInquiry,
    ]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = (): FirebaseContextType => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
};
