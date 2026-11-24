import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { auth } from '@/firebase';

/**
 * ============================================================================
 * CẤU HÌNH GOOGLE IDENTITY SERVICES, GOOGLE DRIVE API V3 & PICKER API
 * - CLIENT_ID: OAuth 2.0 Client ID của dự án Google Cloud (firebase-applet-config.json).
 * - APP_ID:    Google Cloud Project Number (messagingSenderId).
 * - TARGET_DRIVE_FOLDER_ID: Thư mục Google Drive gốc cần quét đệ quy.
 * ============================================================================
 */
export const CLIENT_ID: string = firebaseConfig.oAuthClientId || '';
export const API_KEY: string = firebaseConfig.apiKey || '';
export const APP_ID: string = firebaseConfig.messagingSenderId || '';
export const TARGET_DRIVE_FOLDER_ID = '1rLLAhVL4kg6gboRMJN-OZK9x7fQte93k';

export const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

export const DRIVE_PICKER_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive',
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
].join(',');

export type DriveMediaKind = 'video' | 'image' | 'other';
export type DrivePermissionStatus = 'unknown' | 'public' | 'private' | 'granting' | 'error';

export interface PickedDriveVideo {
  fileId: string;
  fileName: string;
  mimeType: string;
  mediaKind?: DriveMediaKind;
  folderId?: string;
  folderName?: string;
  folderPath?: string;
  sizeBytes?: number;
  iconUrl?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  directStreamUrl: string;
  previewIframeUrl: string;
  directImageUrl?: string;
  permissionStatus: DrivePermissionStatus;
  permissionMessage?: string;
}

export interface ScannedDriveFolderNode {
  folderId: string;
  folderName: string;
  parentFolderId: string | null;
  folderPath: string;
  depth: number;
  fileCount: number;
  videoCount: number;
  imageCount: number;
}

export interface ScannedDriveAsset extends PickedDriveVideo {
  mediaKind: DriveMediaKind;
  folderId: string;
  folderName: string;
  folderPath: string;
  directImageUrl: string;
}

export interface DriveTreeScanResult {
  rootFolderId: string;
  rootFolderName: string;
  folders: ScannedDriveFolderNode[];
  files: ScannedDriveAsset[];
  scannedAt: number;
}

// GoogleAuthProvider dùng chung Firebase `auth` (không gọi initializeApp lần nữa)
const driveProvider = new GoogleAuthProvider();
for (const scope of DRIVE_PICKER_SCOPES) {
  driveProvider.addScope(scope);
}
driveProvider.setCustomParameters({
  prompt: 'select_account',
  include_granted_scopes: 'true',
});

// CHỈ lưu access token trong bộ nhớ RAM (tuyệt đối không lưu localStorage / sessionStorage)
let cachedDriveAccessToken: string | null = null;
let isDriveSigningIn = false;

export function initDriveAuthListener(
  onAuthChange: (user: User | null, hasDriveToken: boolean) => void
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      cachedDriveAccessToken = null;
      onAuthChange(null, false);
    } else if (!isDriveSigningIn) {
      onAuthChange(firebaseUser, Boolean(cachedDriveAccessToken));
    }
  });
}

export function getCachedDriveAccessToken(): string | null {
  return cachedDriveAccessToken;
}

export function clearCachedDriveAccessToken(): void {
  cachedDriveAccessToken = null;
}

export async function signInForGoogleDrive(): Promise<{
  user: User;
  accessToken: string;
}> {
  isDriveSigningIn = true;
  try {
    const result = await signInWithPopup(auth, driveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error(
        'Không nhận được Access Token từ Google. Vui lòng thử đăng nhập lại và cấp quyền truy cập Google Drive.'
      );
    }
    cachedDriveAccessToken = credential.accessToken;
    return {
      user: result.user,
      accessToken: cachedDriveAccessToken,
    };
  } finally {
    isDriveSigningIn = false;
  }
}

export function buildDriveDirectStreamUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}

export function buildDrivePreviewIframeUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview?autoplay=1&mute=1&loop=1`;
}

export function buildDriveDirectImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}`;
}

// Tải thư viện Google Picker client-side (https://apis.google.com/js/api.js)
let pickerLoadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    gapi?: {
      load: (apiName: string, options: { callback: () => void; onerror?: () => void }) => void;
    };
    google?: {
      picker?: any;
    };
  }
}

export function loadGooglePickerApi(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Picker chỉ chạy trên trình duyệt.'));
  }
  if (window.google?.picker) {
    return Promise.resolve();
  }
  if (pickerLoadPromise) {
    return pickerLoadPromise;
  }

  pickerLoadPromise = new Promise<void>((resolve, reject) => {
    const loadPickerModule = () => {
      if (!window.gapi) {
        reject(new Error('Không thể khởi tạo Google API (gapi).'));
        return;
      }
      window.gapi.load('picker', {
        callback: () => {
          if (window.google?.picker) {
            resolve();
          } else {
            reject(new Error('Không thể tải module Google Picker.'));
          }
        },
        onerror: () => reject(new Error('Lỗi khi tải Google Picker API.')),
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://apis.google.com/js/api.js"]'
    );
    if (existingScript && window.gapi) {
      loadPickerModule();
      return;
    }

    const script = existingScript || document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = loadPickerModule;
    script.onerror = () => {
      pickerLoadPromise = null;
      reject(new Error('Không thể tải script https://apis.google.com/js/api.js.'));
    };
    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  return pickerLoadPromise;
}

export function isSupportedVideoFilename(fileName: string, mimeType?: string): boolean {
  const lower = (fileName || '').toLowerCase();
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
    return true;
  }
  if (mimeType && ['video/mp4', 'video/webm', 'video/quicktime'].includes(mimeType)) {
    return true;
  }
  return false;
}

export function isSupportedImageFilename(fileName: string, mimeType?: string): boolean {
  const lower = (fileName || '').toLowerCase();
  if (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp')
  ) {
    return true;
  }
  if (
    mimeType &&
    ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(mimeType)
  ) {
    return true;
  }
  return false;
}

export function detectDriveMediaKind(fileName: string, mimeType?: string): DriveMediaKind {
  if (isSupportedVideoFilename(fileName, mimeType)) return 'video';
  if (isSupportedImageFilename(fileName, mimeType)) return 'image';
  return 'other';
}

/**
 * Đọc đệ quy toàn bộ thư mục con và tập tin (.mp4, .webm, .mov, .png, .jpg, .webp)
 * bên trong thư mục Google Drive gốc bằng Drive API v3 (`files.list` với tham số `parents`).
 */
export async function scanDriveFolderTree(
  rootFolderId: string,
  accessToken: string
): Promise<DriveTreeScanResult> {
  const targetRootId = rootFolderId || TARGET_DRIVE_FOLDER_ID;
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };

  // 1. Lấy tên thư mục gốc
  let rootFolderName = 'Thư mục gốc Drive';
  try {
    const rootRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        targetRootId
      )}?fields=id,name,mimeType&supportsAllDrives=true`,
      { method: 'GET', headers: authHeaders }
    );
    if (rootRes.ok) {
      const rootMeta = await rootRes.json();
      if (rootMeta?.name) {
        rootFolderName = String(rootMeta.name);
      }
    } else if (rootRes.status === 401) {
      throw new Error('Phiên đăng nhập Google Drive đã hết hạn (401). Vui lòng kết nối lại.');
    } else if (rootRes.status === 404 || rootRes.status === 403) {
      const errData = await rootRes.json().catch(() => ({}));
      throw new Error(
        errData?.error?.message ||
          `Không có quyền đọc thư mục Drive ${targetRootId} (HTTP ${rootRes.status}).`
      );
    }
  } catch (err: any) {
    if (err?.message?.includes('401') || err?.message?.includes('Không có quyền')) {
      throw err;
    }
  }

  // 2. Duyệt BFS đệ quy mọi thư mục con và tập tin
  const folders: ScannedDriveFolderNode[] = [
    {
      folderId: targetRootId,
      folderName: rootFolderName,
      parentFolderId: null,
      folderPath: rootFolderName,
      depth: 0,
      fileCount: 0,
      videoCount: 0,
      imageCount: 0,
    },
  ];
  const folderMap = new Map<string, ScannedDriveFolderNode>();
  folderMap.set(targetRootId, folders[0]);

  const files: ScannedDriveAsset[] = [];
  const visitedFolderIds = new Set<string>([targetRootId]);
  const queue: Array<{ folderId: string; folderName: string; folderPath: string; depth: number }> = [
    {
      folderId: targetRootId,
      folderName: rootFolderName,
      folderPath: rootFolderName,
      depth: 0,
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    let pageToken: string | undefined;

    do {
      const escapedParentId = current.folderId.replace(/'/g, "\\'");
      const params = new URLSearchParams({
        q: `'${escapedParentId}' in parents and trashed = false`,
        pageSize: '100',
        supportsAllDrives: 'true',
        includeItemsFromAllDrives: 'true',
        orderBy: 'folder,name',
        fields:
          'nextPageToken,files(id,name,mimeType,size,iconLink,webViewLink,thumbnailLink,parents,permissions(id,type,role))',
      });
      if (pageToken) {
        params.set('pageToken', pageToken);
      }

      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
        {
          method: 'GET',
          headers: authHeaders,
        }
      );

      if (!listRes.ok) {
        const errData = await listRes.json().catch(() => ({}));
        throw new Error(
          errData?.error?.message ||
            `Lỗi Google Drive API v3 khi đọc thư mục "${current.folderName}" (HTTP ${listRes.status}).`
        );
      }

      const data = await listRes.json();
      const rawItems: any[] = Array.isArray(data?.files) ? data.files : [];

      for (const item of rawItems) {
        if (!item?.id || !item?.name) continue;
        const itemId = String(item.id);
        const itemName = String(item.name);
        const itemMime = String(item.mimeType || '');

        if (itemMime === DRIVE_FOLDER_MIME_TYPE) {
          if (!visitedFolderIds.has(itemId)) {
            visitedFolderIds.add(itemId);
            const nextDepth = current.depth + 1;
            const nextPath = `${current.folderPath} / ${itemName}`;
            const node: ScannedDriveFolderNode = {
              folderId: itemId,
              folderName: itemName,
              parentFolderId: current.folderId,
              folderPath: nextPath,
              depth: nextDepth,
              fileCount: 0,
              videoCount: 0,
              imageCount: 0,
            };
            folders.push(node);
            folderMap.set(itemId, node);
            queue.push({
              folderId: itemId,
              folderName: itemName,
              folderPath: nextPath,
              depth: nextDepth,
            });
          }
          continue;
        }

        const mediaKind = detectDriveMediaKind(itemName, itemMime);
        if (mediaKind === 'other') {
          continue;
        }

        const inlinePerms: Array<{ type?: string; role?: string }> = Array.isArray(
          item.permissions
        )
          ? item.permissions
          : [];
        const hasInlinePublic = inlinePerms.some(
          (p) =>
            p.type === 'anyone' &&
            (p.role === 'reader' || p.role === 'commenter' || p.role === 'writer')
        );

        let permissionStatus: DrivePermissionStatus = 'unknown';
        let permissionMessage = 'Chưa kiểm tra quyền chia sẻ';
        if (inlinePerms.length > 0) {
          if (hasInlinePublic) {
            permissionStatus = 'public';
            permissionMessage = 'Đã mở xem công khai (Anyone · Reader)';
          } else {
            permissionStatus = 'private';
            permissionMessage = 'Đang hạn chế (Cần cấp quyền Anyone · Reader)';
          }
        }

        const folderNode = folderMap.get(current.folderId);
        if (folderNode) {
          folderNode.fileCount += 1;
          if (mediaKind === 'video') folderNode.videoCount += 1;
          if (mediaKind === 'image') folderNode.imageCount += 1;
        }

        files.push({
          fileId: itemId,
          fileName: itemName,
          mimeType: itemMime,
          mediaKind,
          folderId: current.folderId,
          folderName: current.folderName,
          folderPath: current.folderPath,
          sizeBytes: item.size ? Number(item.size) : undefined,
          iconUrl: typeof item.iconLink === 'string' ? item.iconLink : undefined,
          thumbnailLink:
            typeof item.thumbnailLink === 'string' ? item.thumbnailLink : undefined,
          webViewLink: typeof item.webViewLink === 'string' ? item.webViewLink : undefined,
          directStreamUrl: buildDriveDirectStreamUrl(itemId),
          previewIframeUrl: buildDrivePreviewIframeUrl(itemId),
          directImageUrl: buildDriveDirectImageUrl(itemId),
          permissionStatus,
          permissionMessage,
        });
      }

      pageToken = data?.nextPageToken ? String(data.nextPageToken) : undefined;
    } while (pageToken);
  }

  return {
    rootFolderId: targetRootId,
    rootFolderName,
    folders,
    files,
    scannedAt: Date.now(),
  };
}

/**
 * Mở Google Drive Picker API (giữ song song cho phép chọn thủ công từng video/ảnh).
 */
export async function openDriveVideoPicker(
  accessToken: string,
  options?: { folderId?: string }
): Promise<PickedDriveVideo[]> {
  await loadGooglePickerApi();

  const pickerNs = window.google?.picker;
  if (!pickerNs) {
    throw new Error('Google Picker chưa sẵn sàng.');
  }

  const folderId = options?.folderId || TARGET_DRIVE_FOLDER_ID;
  const pickerOrigin =
    window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
      ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
      : window.location.origin;

  return new Promise<PickedDriveVideo[]>((resolve, reject) => {
    try {
      const folderView = new pickerNs.DocsView(pickerNs.ViewId.DOCS)
        .setParent(folderId)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setLabel('Thư mục Portfolio Drive');

      const allVideosView = new pickerNs.DocsView(pickerNs.ViewId.DOCS_VIDEOS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setMimeTypes(ALLOWED_VIDEO_MIME_TYPES)
        .setLabel('Tất cả Video (.mp4, .webm, .mov)');

      const builder = new pickerNs.PickerBuilder()
        .addView(folderView)
        .addView(allVideosView)
        .enableFeature(pickerNs.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(accessToken)
        .setOrigin(pickerOrigin)
        .setTitle('Chọn Video / Hình Ảnh từ Google Drive')
        .setCallback((data: any) => {
          if (data.action === pickerNs.Action.PICKED) {
            const docs = Array.isArray(data.docs) ? data.docs : [];
            const picked: PickedDriveVideo[] = docs
              .filter((doc: any) => doc?.id && doc?.name)
              .map((doc: any) => {
                const fileId = String(doc.id);
                const fileName = String(doc.name);
                const mimeType = String(doc.mimeType || 'video/mp4');
                return {
                  fileId,
                  fileName,
                  mimeType,
                  mediaKind: detectDriveMediaKind(fileName, mimeType),
                  folderId,
                  folderName: 'Chọn từ Picker',
                  folderPath: 'Chọn từ Picker',
                  sizeBytes: typeof doc.sizeBytes === 'number' ? doc.sizeBytes : undefined,
                  iconUrl: typeof doc.iconUrl === 'string' ? doc.iconUrl : undefined,
                  webViewLink: typeof doc.url === 'string' ? doc.url : undefined,
                  directStreamUrl: buildDriveDirectStreamUrl(fileId),
                  previewIframeUrl: buildDrivePreviewIframeUrl(fileId),
                  directImageUrl: buildDriveDirectImageUrl(fileId),
                  permissionStatus: 'unknown',
                };
              });
            resolve(picked);
          } else if (data.action === pickerNs.Action.CANCEL) {
            resolve([]);
          }
        });

      if (APP_ID) {
        builder.setAppId(APP_ID);
      }

      const picker = builder.build();
      picker.setVisible(true);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Kiểm tra xem tập tin đã có quyền xem công khai (`type: 'anyone'`, `role: 'reader'`) hay chưa (chỉ đọc).
 */
export async function checkFilePublicPermission(
  fileId: string,
  accessToken: string
): Promise<{ isPublic: boolean; error?: string }> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        fileId
      )}/permissions?fields=permissions(id,type,role)&supportsAllDrives=true`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        isPublic: false,
        error: errData?.error?.message || `HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    const permissions: Array<{ id?: string; type?: string; role?: string }> = Array.isArray(
      data?.permissions
    )
      ? data.permissions
      : [];

    const hasAnyoneReader = permissions.some(
      (p) =>
        p.type === 'anyone' &&
        (p.role === 'reader' || p.role === 'commenter' || p.role === 'writer')
    );

    return { isPublic: hasAnyoneReader };
  } catch (err: any) {
    return {
      isPublic: false,
      error: err?.message || 'Không thể kiểm tra quyền chia sẻ tập tin.',
    };
  }
}

/**
 * Cấp quyền xem công khai (`permissions.create` -> `role: 'reader'`, `type: 'anyone'`).
 * LƯU Ý: Chỉ gọi hàm này SAU KHI người dùng đã xác nhận trong hộp thoại xác nhận!
 */
export async function grantFilePublicViewerPermission(
  fileId: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        fileId
      )}/permissions?supportsAllDrives=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          errData?.error?.message ||
          `Không thể cấp quyền công khai (HTTP ${res.status}). Hãy đảm bảo bạn có quyền chia sẻ tập tin này.`,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Lỗi kết nối khi cấp quyền công khai Drive.',
    };
  }
}
