import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  BannerPageKey,
  FolderRoleType,
  ServiceDomainKey,
  classifyDriveAssetTwoTier,
  classifyVideoFilename,
} from '@/utils/bannerVideoMatcher';
import {
  DriveTreeScanResult,
  PickedDriveVideo,
  ScannedDriveAsset,
  ScannedDriveFolderNode,
  buildDriveDirectImageUrl,
} from '@/services/googleDriveBannerService';
import { DEFAULT_DRIVE_BANNER_ASSIGNMENTS, type DriveBannerDefaultEntry } from '@/data/driveBannerDefaults';

const DRIVE_PICKED_VIDEOS_STORAGE_KEY = 'hungthai_drive_banner_videos_v1';
const DRIVE_BANNER_MAP_STORAGE_KEY = 'hungthai_drive_banner_map_v1';
const DRIVE_BANNER_SEED_VERSION_KEY = 'hungthai_drive_banner_links_v3';
const DRIVE_SERVICE_MAP_STORAGE_KEY = 'hungthai_drive_service_map_v1';
const DRIVE_SCAN_FOLDERS_STORAGE_KEY = 'hungthai_drive_scan_folders_v1';
const DRIVE_SCAN_ASSETS_STORAGE_KEY = 'hungthai_drive_scan_assets_v1';
const DRIVE_LAST_SYNC_STORAGE_KEY = 'hungthai_drive_last_sync_v1';

export interface DriveBannerItem extends PickedDriveVideo {
  assignedPage: BannerPageKey | null;
  matchedKeyword: string | null;
  matchConfidence: 'auto' | 'manual-required' | 'manual';
  addedAt: number;
}

export interface DriveServiceImageItem extends ScannedDriveAsset {
  assignedServiceId: ServiceDomainKey | null;
  matchedKeyword: string | null;
  matchConfidence: 'auto' | 'manual-required' | 'manual';
  addedAt: number;
}

export interface DriveScannedAssetItem extends ScannedDriveAsset {
  folderRole: FolderRoleType;
  assignedPage: BannerPageKey | null;
  assignedServiceId: ServiceDomainKey | null;
  matchedKeyword: string | null;
  matchConfidence: 'auto' | 'manual-required' | 'manual';
  addedAt: number;
}

export type BannerAssignmentsMap = Partial<Record<BannerPageKey, DriveBannerItem>>;
export type ServiceAssignmentsMap = Partial<Record<ServiceDomainKey, DriveServiceImageItem>>;

export type AssetAssignmentTarget =
  | { kind: 'banner'; pageKey: BannerPageKey }
  | { kind: 'service'; serviceId: ServiceDomainKey }
  | null;

interface BannerVideoContextValue {
  pickedVideos: DriveBannerItem[];
  scannedFolders: ScannedDriveFolderNode[];
  scannedAssets: DriveScannedAssetItem[];
  bannerAssignments: BannerAssignmentsMap;
  serviceAssignments: ServiceAssignmentsMap;
  lastSyncedAt: number | null;
  isStudioModalOpen: boolean;
  openStudioModal: (initialPage?: BannerPageKey) => void;
  closeStudioModal: () => void;
  studioInitialPage: BannerPageKey;
  addOrUpdatePickedVideos: (videos: PickedDriveVideo[]) => DriveBannerItem[];
  syncDriveScanResult: (scanResult: DriveTreeScanResult) => {
    totalFiles: number;
    matchedBanners: number;
    matchedServices: number;
    unmatchedCount: number;
  };
  assignVideoToPage: (fileId: string, pageKey: BannerPageKey | null) => void;
  assignAssetTarget: (fileId: string, target: AssetAssignmentTarget) => void;
  updateVideoPermissionStatus: (
    fileId: string,
    status: PickedDriveVideo['permissionStatus'],
    message?: string
  ) => void;
  clearPageAssignment: (pageKey: BannerPageKey) => void;
  clearServiceAssignment: (serviceId: ServiceDomainKey) => void;
  removePickedVideo: (fileId: string) => void;
}

const BannerVideoContext = createContext<BannerVideoContextValue | undefined>(undefined);

function readJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getInitialBannerAssignments(): BannerAssignmentsMap {
  const defaults: BannerAssignmentsMap = { ...DEFAULT_DRIVE_BANNER_ASSIGNMENTS };
  if (typeof window === 'undefined') return defaults;

  const stored = readJsonStorage<BannerAssignmentsMap>(DRIVE_BANNER_MAP_STORAGE_KEY, {});
  const seededFlag = localStorage.getItem(DRIVE_BANNER_SEED_VERSION_KEY);

  // Nạp mặc định 9 liên kết Google Drive [Video Banner] khi chưa từng đồng bộ bản mới
  if (!seededFlag) {
    try {
      localStorage.setItem(DRIVE_BANNER_SEED_VERSION_KEY, 'applied');
    } catch {
      // ignore storage errors
    }
    const merged: BannerAssignmentsMap = { ...stored, ...defaults };
    // Gỡ liên kết Hình nền.mp4 cũ trên 'home' nếu từng tự khớp nhầm trước đây
    if (merged.home?.fileName === 'Hình nền.mp4') {
      delete merged.home;
    }
    return merged;
  }

  return Object.keys(stored).length > 0 ? stored : defaults;
}

export const BannerVideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pickedVideos, setPickedVideos] = useState<DriveBannerItem[]>(() => {
    const data = readJsonStorage<DriveBannerItem[]>(DRIVE_PICKED_VIDEOS_STORAGE_KEY, []);
    const defaultsList = Object.values(DEFAULT_DRIVE_BANNER_ASSIGNMENTS).filter(
      (item): item is DriveBannerDefaultEntry => Boolean(item)
    );
    if (Array.isArray(data) && data.length > 0) {
      const existingPages = new Set(data.map((d) => d.assignedPage).filter(Boolean));
      const missingDefaults = defaultsList.filter((d) => !existingPages.has(d.assignedPage));
      return missingDefaults.length > 0 ? [...data, ...missingDefaults] : data;
    }
    return defaultsList;
  });
  const [scannedFolders, setScannedFolders] = useState<ScannedDriveFolderNode[]>(() => {
    const data = readJsonStorage<ScannedDriveFolderNode[]>(DRIVE_SCAN_FOLDERS_STORAGE_KEY, []);
    return Array.isArray(data) ? data : [];
  });
  const [scannedAssets, setScannedAssets] = useState<DriveScannedAssetItem[]>(() => {
    const data = readJsonStorage<DriveScannedAssetItem[]>(DRIVE_SCAN_ASSETS_STORAGE_KEY, []);
    return Array.isArray(data) ? data : [];
  });
  const [bannerAssignments, setBannerAssignments] = useState<BannerAssignmentsMap>(() =>
    getInitialBannerAssignments()
  );
  const [serviceAssignments, setServiceAssignments] = useState<ServiceAssignmentsMap>(() => {
    const rawMap = readJsonStorage<ServiceAssignmentsMap>(DRIVE_SERVICE_MAP_STORAGE_KEY, {});
    if (!rawMap || typeof rawMap !== 'object') return {};
    const legacyUrls = new Set([
      'https://i.postimg.cc/5Nq2wsTG/Vien-thong-di-dong.png',
      'https://i.postimg.cc/qR6yt2CS/Thuong-mai-dien-tu.gif',
      'https://i.postimg.cc/6qsRCTdz/Tai-chinh-bao-hiem.gif',
      'https://i.postimg.cc/3NMp2Wgn/The-thao-dien-tu.gif',
      'https://i.postimg.cc/C5yDbdjN/Thanh-toan-dien-tu.gif',
      'https://i.postimg.cc/C5yDbdjP/Xay-dung-he-thong.gif',
    ]);
    const cleaned: ServiceAssignmentsMap = {};
    (Object.keys(rawMap) as ServiceDomainKey[]).forEach((key) => {
      const item = rawMap[key];
      if (item && (!item.directImageUrl || !legacyUrls.has(item.directImageUrl))) {
        cleaned[key] = item;
      }
    });
    return cleaned;
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => {
    const raw = readJsonStorage<number | null>(DRIVE_LAST_SYNC_STORAGE_KEY, null);
    return typeof raw === 'number' ? raw : null;
  });

  const [isStudioModalOpen, setIsStudioModalOpen] = useState<boolean>(false);
  const [studioInitialPage, setStudioInitialPage] = useState<BannerPageKey>('wallpaper');

  useEffect(() => {
    try {
      localStorage.setItem(DRIVE_PICKED_VIDEOS_STORAGE_KEY, JSON.stringify(pickedVideos));
    } catch {
      // ignore storage quota errors
    }
  }, [pickedVideos]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVE_SCAN_FOLDERS_STORAGE_KEY, JSON.stringify(scannedFolders));
    } catch {
      // ignore storage quota errors
    }
  }, [scannedFolders]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVE_SCAN_ASSETS_STORAGE_KEY, JSON.stringify(scannedAssets));
    } catch {
      // ignore storage quota errors
    }
  }, [scannedAssets]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVE_BANNER_MAP_STORAGE_KEY, JSON.stringify(bannerAssignments));
    } catch {
      // ignore storage quota errors
    }
  }, [bannerAssignments]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVE_SERVICE_MAP_STORAGE_KEY, JSON.stringify(serviceAssignments));
    } catch {
      // ignore storage quota errors
    }
  }, [serviceAssignments]);

  useEffect(() => {
    try {
      if (lastSyncedAt !== null) {
        localStorage.setItem(DRIVE_LAST_SYNC_STORAGE_KEY, JSON.stringify(lastSyncedAt));
      }
    } catch {
      // ignore
    }
  }, [lastSyncedAt]);

  const openStudioModal = useCallback((initialPage?: BannerPageKey) => {
    if (initialPage) {
      setStudioInitialPage(initialPage);
    }
    setIsStudioModalOpen(true);
  }, []);

  const closeStudioModal = useCallback(() => {
    setIsStudioModalOpen(false);
  }, []);

  const addOrUpdatePickedVideos = useCallback((videos: PickedDriveVideo[]): DriveBannerItem[] => {
    const now = Date.now();
    const processed: DriveBannerItem[] = videos.map((v) => {
      const match = classifyVideoFilename(v.fileName);
      return {
        ...v,
        assignedPage: match.pageKey,
        matchedKeyword: match.matchedKeyword,
        matchConfidence: match.confidence,
        addedAt: now,
      };
    });

    setPickedVideos((prev) => {
      const map = new Map<string, DriveBannerItem>();
      processed.forEach((item) => map.set(item.fileId, item));
      prev.forEach((item) => {
        if (!map.has(item.fileId)) {
          map.set(item.fileId, item);
        }
      });
      return Array.from(map.values());
    });

    setScannedAssets((prev) => {
      const map = new Map<string, DriveScannedAssetItem>();
      prev.forEach((a) => map.set(a.fileId, a));
      processed.forEach((item) => {
        if (!map.has(item.fileId)) {
          map.set(item.fileId, {
            ...item,
            mediaKind: item.mediaKind || 'video',
            folderId: item.folderId || 'picker',
            folderName: item.folderName || 'Chọn qua Picker',
            folderPath: item.folderPath || 'Chọn qua Picker',
            directImageUrl: item.directImageUrl || buildDriveDirectImageUrl(item.fileId),
            folderRole: item.assignedPage ? 'banner-video' : 'dynamic',
            assignedPage: item.assignedPage,
            assignedServiceId: null,
            matchedKeyword: item.matchedKeyword,
            matchConfidence: item.matchConfidence,
            addedAt: now,
          });
        }
      });
      return Array.from(map.values());
    });

    setBannerAssignments((prev) => {
      const next = { ...prev };
      processed.forEach((item) => {
        if (item.assignedPage) {
          next[item.assignedPage] = item;
        }
      });
      return next;
    });

    return processed;
  }, []);

  const syncDriveScanResult = useCallback((scanResult: DriveTreeScanResult) => {
    const now = scanResult.scannedAt || Date.now();
    const nextScannedAssets: DriveScannedAssetItem[] = scanResult.files.map((file) => {
      const match = classifyDriveAssetTwoTier({
        fileName: file.fileName,
        folderName: file.folderName,
        mediaKind: file.mediaKind,
      });
      return {
        ...file,
        folderRole: match.folderRole,
        assignedPage: match.pageKey,
        assignedServiceId: match.serviceId,
        matchedKeyword: match.matchedKeyword,
        matchConfidence: match.confidence,
        addedAt: now,
      };
    });

    setScannedFolders(scanResult.folders);
    setScannedAssets(nextScannedAssets);
    setLastSyncedAt(now);

    // Cập nhật pickedVideos cho các file video
    const videoItems: DriveBannerItem[] = nextScannedAssets
      .filter((a) => a.mediaKind === 'video')
      .map((a) => ({
        ...a,
        assignedPage: a.assignedPage,
        matchedKeyword: a.matchedKeyword,
        matchConfidence: a.matchConfidence,
        addedAt: now,
      }));

    setPickedVideos((prev) => {
      const map = new Map<string, DriveBannerItem>();
      videoItems.forEach((v) => map.set(v.fileId, v));
      // Giữ lại các video được chọn thủ công ngoài cây thư mục nếu không trùng fileId
      prev.forEach((p) => {
        if (!map.has(p.fileId) && p.folderId === 'picker') {
          map.set(p.fileId, p);
        }
      });
      return Array.from(map.values());
    });

    // Tự động ánh xạ Banner 9+ trang
    const nextBanners: BannerAssignmentsMap = {};
    nextScannedAssets.forEach((asset) => {
      if (asset.assignedPage) {
        nextBanners[asset.assignedPage] = {
          ...asset,
          assignedPage: asset.assignedPage,
          matchedKeyword: asset.matchedKeyword,
          matchConfidence: asset.matchConfidence,
          addedAt: now,
        };
      }
    });
    setBannerAssignments((prev) => ({ ...prev, ...nextBanners }));

    // Tự động ánh xạ 6 Thẻ Dịch Vụ Bento
    const nextServices: ServiceAssignmentsMap = {};
    nextScannedAssets.forEach((asset) => {
      if (asset.assignedServiceId) {
        nextServices[asset.assignedServiceId] = {
          ...asset,
          assignedServiceId: asset.assignedServiceId,
          matchedKeyword: asset.matchedKeyword,
          matchConfidence: asset.matchConfidence,
          addedAt: now,
        };
      }
    });
    setServiceAssignments((prev) => ({ ...prev, ...nextServices }));

    const matchedBanners = nextScannedAssets.filter((a) => Boolean(a.assignedPage)).length;
    const matchedServices = nextScannedAssets.filter((a) => Boolean(a.assignedServiceId)).length;
    const unmatchedCount = nextScannedAssets.filter(
      (a) => !a.assignedPage && !a.assignedServiceId
    ).length;

    return {
      totalFiles: nextScannedAssets.length,
      matchedBanners,
      matchedServices,
      unmatchedCount,
    };
  }, []);

  const assignAssetTarget = useCallback((fileId: string, target: AssetAssignmentTarget) => {
    let matchedAsset: DriveScannedAssetItem | null = null;

    setScannedAssets((prev) =>
      prev.map((item) => {
        if (item.fileId !== fileId) return item;
        const updated: DriveScannedAssetItem = {
          ...item,
          assignedPage: target?.kind === 'banner' ? target.pageKey : null,
          assignedServiceId: target?.kind === 'service' ? target.serviceId : null,
          matchConfidence: target ? 'manual' : 'manual-required',
        };
        matchedAsset = updated;
        return updated;
      })
    );

    setPickedVideos((prev) =>
      prev.map((item) => {
        if (item.fileId !== fileId) return item;
        const nextPage = target?.kind === 'banner' ? target.pageKey : null;
        return {
          ...item,
          assignedPage: nextPage,
          matchConfidence: nextPage ? 'manual' : 'manual-required',
        };
      })
    );

    setBannerAssignments((prev) => {
      const next = { ...prev };
      (Object.keys(next) as BannerPageKey[]).forEach((k) => {
        if (next[k]?.fileId === fileId && (target?.kind !== 'banner' || target.pageKey !== k)) {
          delete next[k];
        }
      });
      if (target?.kind === 'banner' && matchedAsset) {
        next[target.pageKey] = {
          ...matchedAsset,
          assignedPage: target.pageKey,
          matchConfidence: 'manual',
        };
      }
      return next;
    });

    setServiceAssignments((prev) => {
      const next = { ...prev };
      (Object.keys(next) as ServiceDomainKey[]).forEach((k) => {
        if (next[k]?.fileId === fileId && (target?.kind !== 'service' || target.serviceId !== k)) {
          delete next[k];
        }
      });
      if (target?.kind === 'service' && matchedAsset) {
        next[target.serviceId] = {
          ...matchedAsset,
          assignedServiceId: target.serviceId,
          matchConfidence: 'manual',
        };
      }
      return next;
    });
  }, []);

  const assignVideoToPage = useCallback(
    (fileId: string, pageKey: BannerPageKey | null) => {
      assignAssetTarget(fileId, pageKey ? { kind: 'banner', pageKey } : null);
    },
    [assignAssetTarget]
  );

  const updateVideoPermissionStatus = useCallback(
    (fileId: string, status: PickedDriveVideo['permissionStatus'], message?: string) => {
      setPickedVideos((prev) =>
        prev.map((item) =>
          item.fileId === fileId
            ? { ...item, permissionStatus: status, permissionMessage: message }
            : item
        )
      );
      setScannedAssets((prev) =>
        prev.map((item) =>
          item.fileId === fileId
            ? { ...item, permissionStatus: status, permissionMessage: message }
            : item
        )
      );
      setBannerAssignments((prev) => {
        const next = { ...prev };
        let changed = false;
        (Object.keys(next) as BannerPageKey[]).forEach((k) => {
          const item = next[k];
          if (item && item.fileId === fileId) {
            next[k] = {
              ...item,
              permissionStatus: status,
              permissionMessage: message,
            };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
      setServiceAssignments((prev) => {
        const next = { ...prev };
        let changed = false;
        (Object.keys(next) as ServiceDomainKey[]).forEach((k) => {
          const item = next[k];
          if (item && item.fileId === fileId) {
            next[k] = {
              ...item,
              permissionStatus: status,
              permissionMessage: message,
            };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    },
    []
  );

  const clearPageAssignment = useCallback((pageKey: BannerPageKey) => {
    setBannerAssignments((prev) => {
      const next = { ...prev };
      delete next[pageKey];
      return next;
    });
  }, []);

  const clearServiceAssignment = useCallback((serviceId: ServiceDomainKey) => {
    setServiceAssignments((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  }, []);

  const removePickedVideo = useCallback((fileId: string) => {
    setPickedVideos((prev) => prev.filter((item) => item.fileId !== fileId));
    setScannedAssets((prev) => prev.filter((item) => item.fileId !== fileId));
    setBannerAssignments((prev) => {
      const next = { ...prev };
      (Object.keys(next) as BannerPageKey[]).forEach((k) => {
        if (next[k]?.fileId === fileId) {
          delete next[k];
        }
      });
      return next;
    });
    setServiceAssignments((prev) => {
      const next = { ...prev };
      (Object.keys(next) as ServiceDomainKey[]).forEach((k) => {
        if (next[k]?.fileId === fileId) {
          delete next[k];
        }
      });
      return next;
    });
  }, []);

  const value = useMemo<BannerVideoContextValue>(
    () => ({
      pickedVideos,
      scannedFolders,
      scannedAssets,
      bannerAssignments,
      serviceAssignments,
      lastSyncedAt,
      isStudioModalOpen,
      openStudioModal,
      closeStudioModal,
      studioInitialPage,
      addOrUpdatePickedVideos,
      syncDriveScanResult,
      assignVideoToPage,
      assignAssetTarget,
      updateVideoPermissionStatus,
      clearPageAssignment,
      clearServiceAssignment,
      removePickedVideo,
    }),
    [
      pickedVideos,
      scannedFolders,
      scannedAssets,
      bannerAssignments,
      serviceAssignments,
      lastSyncedAt,
      isStudioModalOpen,
      openStudioModal,
      closeStudioModal,
      studioInitialPage,
      addOrUpdatePickedVideos,
      syncDriveScanResult,
      assignVideoToPage,
      assignAssetTarget,
      updateVideoPermissionStatus,
      clearPageAssignment,
      clearServiceAssignment,
      removePickedVideo,
    ]
  );

  return <BannerVideoContext.Provider value={value}>{children}</BannerVideoContext.Provider>;
};

export function useBannerVideo(): BannerVideoContextValue {
  const ctx = useContext(BannerVideoContext);
  if (!ctx) {
    throw new Error('useBannerVideo must be used within a BannerVideoProvider');
  }
  return ctx;
}
