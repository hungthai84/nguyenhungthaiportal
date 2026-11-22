'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { Modal } from '@/components/ui/Modal';
import { DriveAwareBannerMedia } from '@/components/common/DriveAwareBannerMedia';
import { useTheme } from '@/hooks/useTheme';
import {
  AssetAssignmentTarget,
  DriveScannedAssetItem,
  useBannerVideo,
} from '@/context/BannerVideoContext';
import {
  BANNER_PAGES,
  BANNER_PAGE_MAP,
  BannerPageKey,
  PRIMARY_9_BANNER_PAGE_KEYS,
  SERVICE_DOMAINS_META,
  SERVICE_DOMAIN_MAP,
  ServiceDomainKey,
  classifyFolderRole,
  generateBannerSnippetCode,
  generateFullWebsiteExportCode,
} from '@/utils/bannerVideoMatcher';
import {
  APP_ID,
  CLIENT_ID,
  PickedDriveVideo,
  TARGET_DRIVE_FOLDER_ID,
  checkFilePublicPermission,
  clearCachedDriveAccessToken,
  getCachedDriveAccessToken,
  grantFilePublicViewerPermission,
  initDriveAuthListener,
  openDriveVideoPicker,
  scanDriveFolderTree,
  signInForGoogleDrive,
} from '@/services/googleDriveBannerService';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface DriveBannerStudioProps {
  initialPage?: BannerPageKey;
  onNavigateTab?: (tabIndex: number) => void;
  onShowNotification?: (msg: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

type ExportCodeScope = 'full-website' | 'current-banner';

export const DriveBannerStudio: React.FC<DriveBannerStudioProps> = ({
  initialPage = 'home',
  onNavigateTab,
  onShowNotification,
  onClose,
}) => {
  const { isDark, colorSchemeMode, setColorSchemeMode } = useTheme();
  const {
    scannedFolders,
    scannedAssets,
    bannerAssignments,
    serviceAssignments,
    lastSyncedAt,
    addOrUpdatePickedVideos,
    syncDriveScanResult,
    assignAssetTarget,
    updateVideoPermissionStatus,
    clearPageAssignment,
    clearServiceAssignment,
    removePickedVideo,
  } = useBannerVideo();

  const [driveUserEmail, setDriveUserEmail] = useState<string | null>(null);
  const [driveUserName, setDriveUserName] = useState<string | null>(null);
  const [hasDriveToken, setHasDriveToken] = useState<boolean>(() =>
    Boolean(getCachedDriveAccessToken())
  );
  const [isConnectingGoogle, setIsConnectingGoogle] = useState<boolean>(false);
  const [isScanningDrive, setIsScanningDrive] = useState<boolean>(false);
  const [isPickingFiles, setIsPickingFiles] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'info' | 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Hộp thoại xác nhận cấp quyền công khai Drive (bắt buộc trước permissions.create)
  const [pendingPermissionFiles, setPendingPermissionFiles] = useState<
    Array<Pick<PickedDriveVideo, 'fileId' | 'fileName'>>
  >([]);
  const [isGrantingPermissions, setIsGrantingPermissions] = useState<boolean>(false);

  // Điều hướng nhanh & Live Preview
  const [activePreviewPage, setActivePreviewPage] = useState<BannerPageKey>(initialPage);
  const [showExtendedPages, setShowExtendedPages] = useState<boolean>(false);
  const [previewRenderMode, setPreviewRenderMode] = useState<'auto' | 'iframe'>('auto');
  const [activeStreamStatus, setActiveStreamStatus] = useState<'video' | 'iframe' | 'poster'>('video');
  const [isFullscreen100vh, setIsFullscreen100vh] = useState<boolean>(false);

  // Bộ lọc cây thư mục & Mapping Inspector
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState<string>('');

  // Khung xuất & Sao chép Code Website
  const [exportScope, setExportScope] = useState<ExportCodeScope>('full-website');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    setActivePreviewPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    const unsub = initDriveAuthListener((user, tokenReady) => {
      if (user) {
        setDriveUserEmail(user.email);
        setDriveUserName(user.displayName);
      } else {
        setDriveUserEmail(null);
        setDriveUserName(null);
      }
      setHasDriveToken(tokenReady);
    });
    return () => unsub();
  }, []);

  const ensureDriveToken = useCallback(async (): Promise<string | null> => {
    const existing = getCachedDriveAccessToken();
    if (existing) {
      setHasDriveToken(true);
      return existing;
    }
    setIsConnectingGoogle(true);
    setStatusBanner(null);
    try {
      const { user, accessToken } = await signInForGoogleDrive();
      setDriveUserEmail(user.email);
      setDriveUserName(user.displayName);
      setHasDriveToken(true);
      return accessToken;
    } catch (err: any) {
      const msg =
        err?.code === 'auth/popup-closed-by-user'
          ? 'Bạn đã đóng cửa sổ đăng nhập Google.'
          : err?.message || 'Không thể đăng nhập Google để kết nối Drive.';
      setStatusBanner({ type: 'error', text: msg });
      return null;
    } finally {
      setIsConnectingGoogle(false);
    }
  }, []);

  /**
   * Kiểm tra quyền công khai (`Anyone - Reader`) của danh sách file mà không tự động mutate quyền.
   */
  const inspectPermissionsForAssets = useCallback(
    async (
      files: Array<{ fileId: string; fileName: string; permissionStatus?: string }>,
      token: string
    ) => {
      const needPublicGrant: Array<{ fileId: string; fileName: string }> = [];

      for (const file of files) {
        if (file.permissionStatus === 'public') {
          continue;
        }
        const check = await checkFilePublicPermission(file.fileId, token);
        if (check.isPublic) {
          updateVideoPermissionStatus(file.fileId, 'public', 'Đã mở xem công khai (Anyone · Reader)');
        } else {
          updateVideoPermissionStatus(
            file.fileId,
            'private',
            check.error
              ? `Chưa xác nhận công khai (${check.error})`
              : 'Đang hạn chế (Cần cấp quyền Anyone · Reader để nhúng web)'
          );
          needPublicGrant.push({ fileId: file.fileId, fileName: file.fileName });
        }
      }

      if (needPublicGrant.length > 0) {
        setPendingPermissionFiles(needPublicGrant);
      }
    },
    [updateVideoPermissionStatus]
  );

  /**
   * Quét đệ quy cấu trúc thư mục & tập tin trong thư mục Drive gốc bằng Drive API v3 (`files.list`)
   */
  const handleSyncDriveRecursive = async () => {
    SoundEngine.playTap();
    setStatusBanner(null);

    const token = await ensureDriveToken();
    if (!token) return;

    setIsScanningDrive(true);
    try {
      const scanResult = await scanDriveFolderTree(TARGET_DRIVE_FOLDER_ID, token);
      const summary = syncDriveScanResult(scanResult);

      setSelectedFolderId('all');

      setStatusBanner({
        type: 'success',
        text: `Đã đồng bộ đệ quy ${scanResult.folders.length} thư mục & ${summary.totalFiles} tập tin từ Google Drive (${summary.matchedBanners} Banner trang · ${summary.matchedServices} Thẻ Dịch vụ · ${summary.unmatchedCount} tập tin chờ gán/thư mục động).`,
      });
      onShowNotification?.(
        `✓ Đồng bộ Drive thành công: ${summary.matchedBanners} Banner & ${summary.matchedServices} Dịch vụ`
      );

      // Kiểm tra các file chưa xác định quyền công khai
      const filesToInspect = scanResult.files.filter((f) => f.permissionStatus !== 'public');
      if (filesToInspect.length > 0) {
        await inspectPermissionsForAssets(filesToInspect, token);
      }
    } catch (err: any) {
      const msg = err?.message || 'Không thể quét đệ quy thư mục Google Drive.';
      if (String(msg).toLowerCase().includes('token') || String(msg).includes('401')) {
        clearCachedDriveAccessToken();
        setHasDriveToken(false);
      }
      setStatusBanner({ type: 'error', text: msg });
    } finally {
      setIsScanningDrive(false);
    }
  };

  /**
   * Chọn thủ công qua Google Drive Picker API (giữ song song cùng quét đệ quy)
   */
  const handleOpenGooglePicker = async () => {
    SoundEngine.playTap();
    setStatusBanner(null);

    const token = await ensureDriveToken();
    if (!token) return;

    setIsPickingFiles(true);
    try {
      const picked = await openDriveVideoPicker(token, { folderId: TARGET_DRIVE_FOLDER_ID });
      if (picked.length === 0) {
        setStatusBanner({
          type: 'info',
          text: 'Chưa có tập tin nào được chọn từ Google Picker.',
        });
        return;
      }

      const processed = addOrUpdatePickedVideos(picked);
      const matchedCount = processed.filter((item) => item.assignedPage !== null).length;
      const firstMatched = processed.find((item) => item.assignedPage !== null);
      if (firstMatched?.assignedPage) {
        setActivePreviewPage(firstMatched.assignedPage);
      }

      setStatusBanner({
        type: 'success',
        text: `Đã chọn ${processed.length} tập tin qua Picker (${matchedCount} tự khớp Banner). Đang kiểm tra quyền công khai...`,
      });
      onShowNotification?.(`✓ Đã nhận ${processed.length} tập tin từ Google Drive`);

      await inspectPermissionsForAssets(processed, token);
    } catch (err: any) {
      const msg = err?.message || 'Không thể mở Google Drive Picker.';
      if (String(msg).toLowerCase().includes('token') || String(msg).includes('401')) {
        clearCachedDriveAccessToken();
        setHasDriveToken(false);
      }
      setStatusBanner({ type: 'error', text: msg });
    } finally {
      setIsPickingFiles(false);
    }
  };

  const handleConfirmGrantPublicPermissions = async () => {
    if (pendingPermissionFiles.length === 0) return;
    const token = await ensureDriveToken();
    if (!token) return;

    setIsGrantingPermissions(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of pendingPermissionFiles) {
      updateVideoPermissionStatus(file.fileId, 'granting', 'Đang cấp quyền công khai...');
      const res = await grantFilePublicViewerPermission(file.fileId, token);
      if (res.success) {
        successCount++;
        updateVideoPermissionStatus(file.fileId, 'public', 'Đã cấp quyền Anyone · Reader');
      } else {
        failCount++;
        updateVideoPermissionStatus(file.fileId, 'error', res.error || 'Không thể cấp quyền');
      }
    }

    setIsGrantingPermissions(false);
    setPendingPermissionFiles([]);

    if (failCount === 0) {
      setStatusBanner({
        type: 'success',
        text: `✓ Đã cấp quyền xem công khai (Anyone · Reader) cho ${successCount} tập tin thành công!`,
      });
    } else {
      setStatusBanner({
        type: 'warning',
        text: `Đã cấp quyền ${successCount} tập tin, ${failCount} tập tin chưa thể đổi quyền (hệ thống tự dùng phương án dự phòng).`,
      });
    }
  };

  // Thống kê nhanh
  const stats = useMemo(() => {
    const matchedBannerCount = PRIMARY_9_BANNER_PAGE_KEYS.filter((k) =>
      Boolean(bannerAssignments[k])
    ).length;
    const matchedServiceCount = SERVICE_DOMAINS_META.filter((s) =>
      Boolean(serviceAssignments[s.id])
    ).length;
    const privateAssets = scannedAssets.filter(
      (a) => a.permissionStatus === 'private' || a.permissionStatus === 'unknown'
    );
    const dynamicFolders = scannedFolders.filter(
      (f) => f.depth > 0 && classifyFolderRole(f.folderName) === 'dynamic'
    );

    return {
      folderCount: scannedFolders.length,
      assetCount: scannedAssets.length,
      matchedBannerCount,
      matchedServiceCount,
      privateAssets,
      dynamicFolders,
    };
  }, [scannedFolders, scannedAssets, bannerAssignments, serviceAssignments]);

  // Danh sách tập tin hiển thị trong Mapping Inspector theo thư mục & từ khóa tìm kiếm
  const filteredAssets = useMemo(() => {
    const q = assetSearchQuery.trim().toLowerCase();
    return scannedAssets.filter((asset) => {
      if (selectedFolderId !== 'all' && asset.folderId !== selectedFolderId) {
        return false;
      }
      if (q) {
        return (
          asset.fileName.toLowerCase().includes(q) ||
          asset.folderName.toLowerCase().includes(q) ||
          asset.fileId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [scannedAssets, selectedFolderId, assetSearchQuery]);

  const visibleNavigationPages = useMemo(() => {
    const keys = showExtendedPages
      ? BANNER_PAGES.map((p) => p.key)
      : PRIMARY_9_BANNER_PAGE_KEYS;
    return keys.map((k) => BANNER_PAGE_MAP[k]);
  }, [showExtendedPages]);

  const activePageMeta = BANNER_PAGE_MAP[activePreviewPage];
  const activeAssignedVideo = bannerAssignments[activePreviewPage] || null;

  // Code Export (Toàn bộ Website vs Trang hiện tại)
  const exportedCode = useMemo(() => {
    if (exportScope === 'full-website') {
      return generateFullWebsiteExportCode({
        bannerAssignments,
        serviceAssignments,
      });
    }
    const fileId = activeAssignedVideo?.fileId || 'YOUR_GOOGLE_DRIVE_FILE_ID';
    const fileName = activeAssignedVideo?.fileName || activePageMeta.expectedFilename;
    return generateBannerSnippetCode({
      pageKey: activePreviewPage,
      fileId,
      fileName,
      directStreamUrl:
        activeAssignedVideo?.directStreamUrl ||
        `https://drive.google.com/uc?export=download&id=${fileId}`,
      previewIframeUrl:
        activeAssignedVideo?.previewIframeUrl ||
        `https://drive.google.com/file/d/${fileId}/preview?autoplay=1&mute=1&loop=1`,
      posterUrl: activePageMeta.posterUrl,
    });
  }, [
    exportScope,
    bannerAssignments,
    serviceAssignments,
    activePreviewPage,
    activeAssignedVideo,
    activePageMeta,
  ]);

  const handleCopyWebsiteCode = async () => {
    SoundEngine.playPop();
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopiedCode(true);
      onShowNotification?.(
        exportScope === 'full-website'
          ? '✓ Đã xuất & sao chép toàn bộ mã nguồn Website đồng bộ Drive!'
          : `✓ Đã sao chép mã nguồn Banner ${activePageMeta.shortLabelVi}!`
      );
      window.setTimeout(() => setCopiedCode(false), 2400);
    } catch {
      setStatusBanner({
        type: 'warning',
        text: 'Trình duyệt chặn Clipboard API — hãy chọn và sao chép thủ công trong khung mã nguồn.',
      });
    }
  };

  const getDropdownValueForAsset = (asset: DriveScannedAssetItem): string => {
    if (asset.assignedPage) return `banner:${asset.assignedPage}`;
    if (asset.assignedServiceId) return `service:${asset.assignedServiceId}`;
    return '';
  };

  const handleDropdownAssignChange = (asset: DriveScannedAssetItem, rawValue: string) => {
    SoundEngine.playTap();
    if (!rawValue) {
      assignAssetTarget(asset.fileId, null);
      return;
    }
    const [kind, id] = rawValue.split(':');
    let target: AssetAssignmentTarget = null;
    if (kind === 'banner' && id) {
      const pageKey = id as BannerPageKey;
      target = { kind: 'banner', pageKey };
      setActivePreviewPage(pageKey);
      onShowNotification?.(
        `✓ Đã gán "${asset.fileName}" làm Video Nền cho ${BANNER_PAGE_MAP[pageKey].shortLabelVi}`
      );
    } else if (kind === 'service' && id) {
      const serviceId = id as ServiceDomainKey;
      target = { kind: 'service', serviceId };
      onShowNotification?.(
        `✓ Đã gán "${asset.fileName}" cho thẻ Dịch Vụ "${SERVICE_DOMAIN_MAP[serviceId].titleVi}"`
      );
    }
    assignAssetTarget(asset.fileId, target);
  };

  return (
    <div
      id="drive-banner-studio-root"
      className="w-full flex flex-col gap-[15px] font-play text-left text-[var(--text-primary)]"
    >
      {/* 1. THANH ĐIỀU KHIỂN ĐỒNG BỘ GOOGLE DRIVE ĐỆ QUY & GIAO DIỆN */}
      <section
        className="sub-card rounded-[16px] p-[15px] border backdrop-blur-md flex flex-col gap-3"
        style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[999px] text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                <WebIcon name="folder-tree" className="w-3.5 h-3.5" />
                <span>Drive Recursive Auto-Sync</span>
              </span>
              <a
                href={`https://drive.google.com/drive/folders/${TARGET_DRIVE_FOLDER_ID}?usp=sharing`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] text-xs font-medium bg-black/5 dark:bg-white/10 hover:underline truncate max-w-[280px]"
                title="Mở thư mục Google Drive gốc"
              >
                <WebIcon name="folder" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Root ID: {TARGET_DRIVE_FOLDER_ID.slice(0, 14)}…</span>
              </a>
              {lastSyncedAt && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] text-[11px] font-semibold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                  <WebIcon name="clock" className="w-3 h-3" />
                  <span>
                    Đồng bộ lúc {new Date(lastSyncedAt).toLocaleTimeString('vi-VN')}
                  </span>
                </span>
              )}
            </div>

            <h2
              className="typo-h4 font-bold tracking-tight card-header-sync card-title-synced flex items-center gap-2"
              data-card-title="true"
            >
              <WebIcon name="sparkles" className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>Hệ Thống Quét Đệ Quy Google Drive &amp; Ánh Xạ Tự Động 2 Tầng</span>
            </h2>
            <p className="typo-caption" style={{ color: 'var(--text-secondary)' }}>
              Tự động đọc toàn bộ thư mục con &amp; tập tin · Tầng 1 nhận diện vai trò{' '}
              <strong>Video Banner</strong> / <strong>Dịch Vụ</strong> /{' '}
              <strong>Thư mục động</strong> · Tầng 2 nhúng trực tiếp vào 9 Banner trang &amp; 6 Thẻ
              Bento Dịch vụ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Chuyển đổi Light / Dark tự động theo hệ thống (prefers-color-scheme) */}
            <div
              role="group"
              aria-label="Chế độ Sáng / Tối"
              className="inline-flex items-center p-1 rounded-[999px] border gap-0.5"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
            >
              {(
                [
                  { id: 'system', label: 'Hệ thống', icon: 'monitor' },
                  { id: 'light', label: 'Sáng', icon: 'sun' },
                  { id: 'dark', label: 'Tối', icon: 'moon' },
                ] as const
              ).map((mode) => {
                const active = colorSchemeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setColorSchemeMode(mode.id);
                    }}
                    className={`px-2.5 py-1 rounded-[999px] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <WebIcon name={mode.icon} className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-[999px] border flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                style={{ borderColor: 'var(--border-subcard)' }}
                aria-label="Đóng"
              >
                <WebIcon name="x" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hàng nút thao tác Google Sign-in, Đồng bộ Đệ quy & Picker */}
        <div
          className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t"
          style={{ borderColor: 'var(--border-subcard)' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {!hasDriveToken ? (
              <button
                type="button"
                disabled={isConnectingGoogle}
                onClick={() => void ensureDriveToken()}
                className="inline-flex items-center gap-2.5 h-10 px-4 rounded-[999px] bg-white text-[#1f1f1f] border border-[#747775] hover:bg-[#f8fafd] shadow-xs font-medium text-sm cursor-pointer disabled:opacity-60 transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isConnectingGoogle ? 'Đang kết nối Google...' : 'Sign in with Google'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 h-10 px-3.5 rounded-[999px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[190px]">
                  {driveUserEmail || driveUserName || 'Google Drive Ready'}
                </span>
              </div>
            )}

            {/* Nút quét đệ quy Drive v3 */}
            <button
              id="drive-recursive-sync-btn"
              type="button"
              disabled={isConnectingGoogle || isScanningDrive}
              onClick={() => void handleSyncDriveRecursive()}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-[999px] bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#EC4899] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
            >
              <WebIcon
                name="refresh-cw"
                className={`w-4 h-4 shrink-0 ${isScanningDrive ? 'animate-spin' : ''}`}
              />
              <span>
                {isScanningDrive ? 'Đang quét đệ quy Drive...' : 'Làm mới / Đồng bộ từ Drive'}
              </span>
            </button>

            {/* Nút Picker thủ công bổ sung */}
            <button
              id="drive-picker-open-btn"
              type="button"
              disabled={isConnectingGoogle || isPickingFiles}
              onClick={() => void handleOpenGooglePicker()}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[999px] border font-bold text-xs hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer disabled:opacity-60"
              style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-card)' }}
            >
              <WebIcon name="upload-cloud" className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{isPickingFiles ? 'Đang mở Picker...' : 'Chọn qua Google Picker'}</span>
            </button>

            {/* Nút cấp quyền công khai hàng loạt nếu có file private */}
            {stats.privateAssets.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setPendingPermissionFiles(
                    stats.privateAssets.map((a) => ({
                      fileId: a.fileId,
                      fileName: a.fileName,
                    }))
                  );
                }}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[999px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold text-xs hover:bg-amber-500/25 cursor-pointer transition"
              >
                <WebIcon name="shield-alert" className="w-4 h-4 shrink-0" />
                <span>Cấp quyền công khai ({stats.privateAssets.length})</span>
              </button>
            )}
          </div>

          {/* Nút Xuất & Sao chép Code Website */}
          <button
            id="export-copy-website-code-btn"
            type="button"
            onClick={() => void handleCopyWebsiteCode()}
            className={`inline-flex items-center gap-2 h-10 px-5 rounded-[999px] text-xs sm:text-sm font-bold shadow cursor-pointer transition ${
              copiedCode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90'
            }`}
          >
            <WebIcon name={copiedCode ? 'check' : 'code'} className="w-4 h-4 shrink-0" />
            <span>{copiedCode ? 'Đã sao chép Code Website!' : 'Xuất & Sao chép Code Website'}</span>
          </button>
        </div>

        {/* Chỉ số tóm tắt nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div
            className="rounded-[16px] px-3 py-2 border flex items-center justify-between gap-2"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Thư mục đã quét
            </span>
            <span className="text-sm font-bold tabular-nums">{stats.folderCount}</span>
          </div>
          <div
            className="rounded-[16px] px-3 py-2 border flex items-center justify-between gap-2"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Banner Trang khớp
            </span>
            <span className="text-sm font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
              {stats.matchedBannerCount}/9
            </span>
          </div>
          <div
            className="rounded-[16px] px-3 py-2 border flex items-center justify-between gap-2"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Ảnh Dịch vụ Bento
            </span>
            <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.matchedServiceCount}/6
            </span>
          </div>
          <div
            className="rounded-[16px] px-3 py-2 border flex items-center justify-between gap-2"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Thư mục mở rộng
            </span>
            <span className="text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {stats.dynamicFolders.length}
            </span>
          </div>
        </div>

        {/* Status Notification */}
        {statusBanner && (
          <div
            className={`px-3.5 py-2.5 rounded-[16px] text-xs font-medium flex items-center justify-between gap-2 border ${
              statusBanner.type === 'success'
                ? 'bg-emerald-500/12 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : statusBanner.type === 'error'
                  ? 'bg-rose-500/12 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : statusBanner.type === 'warning'
                    ? 'bg-amber-500/12 border-amber-500/30 text-amber-800 dark:text-amber-300'
                    : 'bg-sky-500/12 border-sky-500/30 text-sky-700 dark:text-sky-300'
            }`}
          >
            <span>{statusBanner.text}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
              aria-label="Đóng thông báo"
            >
              <WebIcon name="x" className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* 2. THANH ĐIỀU HƯỚNG NHANH 9 TRANG WEBSITE + LIVE PREVIEW HERO BANNER */}
      <section
        className="sub-card rounded-[16px] p-[15px] border backdrop-blur-md flex flex-col gap-3"
        style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            className="typo-h5 font-bold subcard-header-sync subcard-title-synced flex items-center gap-2"
            data-subcard-title="true"
          >
            <WebIcon name="layout-grid" className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Điều Hướng Nhanh 9 Trang &amp; Xem Trước Video Nền Banner</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExtendedPages((prev) => !prev)}
              className="px-3 py-1 rounded-[999px] text-[11px] font-bold border cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-card)' }}
            >
              {showExtendedPages ? 'Thu gọn 9 trang chính' : '+ Trang Chủ, Giới Thiệu & Dự Án'}
            </button>

            <div
              className="inline-flex items-center p-0.5 rounded-[999px] border text-[11px] font-bold"
              style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-card)' }}
            >
              {(
                [
                  { id: 'auto', label: 'HTML5 <video>' },
                  { id: 'iframe', label: 'Fallback <iframe>' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPreviewRenderMode(m.id)}
                  className={`px-2.5 py-1 rounded-[999px] cursor-pointer transition ${
                    previewRenderMode === m.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFullscreen100vh(true);
              }}
              className="px-3 py-1 rounded-[999px] text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1 cursor-pointer transition"
            >
              <WebIcon name="maximize-2" className="w-3.5 h-3.5" />
              <span>Xem trước 100vh</span>
            </button>
          </div>
        </div>

        {/* 9 Pill Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleNavigationPages.map((page) => {
            const isSelected = activePreviewPage === page.key;
            const hasAssigned = Boolean(bannerAssignments[page.key]);
            return (
              <button
                key={page.key}
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setActivePreviewPage(page.key);
                }}
                className={`px-3.5 py-1.5 rounded-[999px] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#EC4899] text-white border-transparent shadow-sm'
                    : 'border-[var(--border-subcard)] hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    hasAssigned ? 'bg-emerald-400' : 'bg-slate-400/50'
                  }`}
                />
                <span>{page.shortLabelVi}</span>
              </button>
            );
          })}
        </div>

        {/* Khung Preview Hero Banner */}
        <div className="relative w-full min-h-[300px] sm:min-h-[360px] rounded-[16px] overflow-hidden border border-white/20 shadow-xl flex items-center justify-center p-5">
          {activeAssignedVideo ? (
            <div className="absolute inset-0 z-0">
              <DriveAwareBannerMedia
                directVideoUrl={activeAssignedVideo.directStreamUrl}
                iframeFallbackUrl={activeAssignedVideo.previewIframeUrl}
                posterUrl={activePageMeta.posterUrl}
                title={activeAssignedVideo.fileName}
                forceIframeFallback={previewRenderMode === 'iframe'}
                onModeChange={setActiveStreamStatus}
              />
            </div>
          ) : (
            <img
              src={activePageMeta.posterUrl}
              alt={activePageMeta.previewTitleVi}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}

          {/* Gradient Overlay đảm bảo tương phản */}
          <div
            className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-t ${
              isDark
                ? 'from-slate-950/80 via-slate-900/40 to-slate-950/25'
                : 'from-slate-950/65 via-slate-900/30 to-slate-900/15'
            }`}
          />

          {/* Huy hiệu trạng thái nguồn phát */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
            <span className="px-3 py-1 rounded-[999px] bg-black/55 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
              {activeAssignedVideo
                ? `${activeAssignedVideo.fileName} · ${
                    activeStreamStatus === 'iframe'
                      ? 'Iframe Fallback'
                      : activeStreamStatus === 'poster'
                        ? 'Poster Fallback'
                        : 'HTML5 Stream'
                  }`
                : `Chờ đồng bộ "${activePageMeta.expectedFilename}" (Đang dùng Poster)`}
            </span>
          </div>

          {/* Nút thao tác góc trên phải */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {activeAssignedVideo && (
              <button
                type="button"
                onClick={() => {
                  clearPageAssignment(activePreviewPage);
                  onShowNotification?.(`Đã gỡ video Drive khỏi ${activePageMeta.shortLabelVi}`);
                }}
                className="px-3 py-1 rounded-[999px] bg-black/55 hover:bg-rose-600/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 cursor-pointer transition"
              >
                Khôi phục gốc
              </button>
            )}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPageFlip();
                  onNavigateTab(activePageMeta.tabIndex);
                  onClose?.();
                }}
                className="px-3.5 py-1 rounded-[999px] bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold shadow cursor-pointer inline-flex items-center gap-1 transition"
              >
                <span>Mở trên trang thật</span>
                <WebIcon name="arrow-up-right" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card Glassmorphism trung tâm (bo góc 16px, nút bo 999px) */}
          <div className="relative z-20 max-w-xl w-full rounded-[16px] bg-white/15 dark:bg-slate-950/45 backdrop-blur-md border border-white/30 dark:border-white/15 p-5 sm:p-6 text-center shadow-2xl">
            <span className="inline-block px-3 py-1 rounded-[999px] text-[11px] font-bold bg-white/20 text-white border border-white/25 mb-2.5">
              {activePageMeta.labelVi}
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug drop-shadow-sm inline-flex items-center justify-center gap-2">
              <WebIcon name="sparkles" className="w-5 h-5 text-white shrink-0" />
              <span>{activePageMeta.previewTitleVi}</span>
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/90 leading-relaxed">
              {activePageMeta.previewSubtitleVi}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) {
                    onNavigateTab(activePageMeta.tabIndex);
                    onClose?.();
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-[999px] bg-gradient-to-r ${activePageMeta.accentGradient} text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition cursor-pointer`}
              >
                <span>{activePageMeta.ctaLabelVi}</span>
                <WebIcon name="chevron-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAPPING INSPECTOR (CHIA 2 CỘT: CÂY THƯ MỤC DRIVE <-> TRẠNG THÁI ÁNH XẠ & DROPDOWN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px]">
        {/* Cột Trái: Cây Thư Mục Google Drive Đệ Quy */}
        <section
          className="lg:col-span-5 sub-card rounded-[16px] p-[15px] border backdrop-blur-md flex flex-col gap-3 min-h-[300px]"
          style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3
              className="typo-h5 font-bold subcard-header-sync subcard-title-synced flex items-center gap-2"
              data-subcard-title="true"
            >
              <WebIcon name="folder-open" className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Cây Thư Mục Google Drive ({scannedFolders.length})</span>
            </h3>
            <span className="typo-caption" style={{ color: 'var(--text-muted)' }}>
              Tự mở rộng thư mục mới
            </span>
          </div>

          {scannedFolders.length === 0 ? (
            <div
              className="flex-1 rounded-[16px] border border-dashed p-5 flex flex-col items-center justify-center text-center gap-2.5"
              style={{ borderColor: 'var(--border-subcard)' }}
            >
              <div className="w-11 h-11 rounded-full bg-indigo-500/12 text-indigo-500 flex items-center justify-center">
                <WebIcon name="folder-search" className="w-5 h-5" />
              </div>
              <p className="typo-body-sm font-bold">Chưa quét cây thư mục Google Drive</p>
              <p className="typo-caption max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                Nhấn <strong>&ldquo;Làm mới / Đồng bộ từ Drive&rdquo;</strong> để tự động đọc đệ quy
                thư mục <code className="font-mono">Video Banner</code>,{' '}
                <code className="font-mono">Dịch Vụ</code> và mọi thư mục con mới tạo.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-[440px] overflow-y-auto glass-scrollbar pr-1">
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setSelectedFolderId('all');
                }}
                className={`w-full px-3 py-2.5 rounded-[16px] border text-left flex items-center justify-between gap-2 cursor-pointer transition ${
                  selectedFolderId === 'all'
                    ? 'bg-indigo-600 text-white border-transparent shadow-sm'
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                style={
                  selectedFolderId === 'all'
                    ? undefined
                    : { background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }
                }
              >
                <span className="inline-flex items-center gap-2 text-xs font-bold">
                  <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                  <span>Tất cả thư mục &amp; tập tin</span>
                </span>
                <span className="px-2 py-0.5 rounded-[999px] text-[11px] font-bold bg-black/15 dark:bg-white/15 tabular-nums">
                  {scannedAssets.length}
                </span>
              </button>

              {scannedFolders.map((folder) => {
                const role = classifyFolderRole(folder.folderName);
                const isSelected = selectedFolderId === folder.folderId;
                const roleBadge =
                  folder.depth === 0
                    ? { label: 'Thư mục gốc', cls: 'bg-slate-500/15 text-slate-600 dark:text-slate-300' }
                    : role === 'banner-video'
                      ? { label: 'Tầng 1: Video Banner', cls: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' }
                      : role === 'service-image'
                        ? { label: 'Tầng 1: Ảnh Dịch Vụ', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' }
                        : { label: 'Thư mục mở rộng', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' };

                return (
                  <button
                    key={folder.folderId}
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedFolderId(folder.folderId);
                    }}
                    style={{
                      marginLeft: `${Math.min(folder.depth, 3) * 10}px`,
                      ...(isSelected
                        ? {}
                        : { background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }),
                    }}
                    className={`px-3 py-2.5 rounded-[16px] border text-left flex flex-col gap-1.5 cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-xs'
                        : 'hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold min-w-0">
                        <WebIcon
                          name={folder.depth === 0 ? 'hard-drive' : 'folder'}
                          className={`w-4 h-4 shrink-0 ${
                            role === 'banner-video'
                              ? 'text-indigo-500'
                              : role === 'service-image'
                                ? 'text-emerald-500'
                                : 'text-amber-500'
                          }`}
                        />
                        <span className="truncate">{folder.folderName}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-[999px] text-[10px] font-bold bg-black/5 dark:bg-white/10 shrink-0 tabular-nums">
                        {folder.fileCount} file
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-[999px] font-bold ${roleBadge.cls}`}>
                        {roleBadge.label}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {folder.videoCount} video · {folder.imageCount} ảnh
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Cột Phải: Mapping Inspector & Dropdown Gán Thủ Công */}
        <section
          className="lg:col-span-7 sub-card rounded-[16px] p-[15px] border backdrop-blur-md flex flex-col gap-3"
          style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3
              className="typo-h5 font-bold subcard-header-sync subcard-title-synced flex items-center gap-2"
              data-subcard-title="true"
            >
              <WebIcon name="git-branch" className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Mapping Inspector · Đối Chiếu &amp; Gán Trang ({filteredAssets.length})</span>
            </h3>

            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <WebIcon
                name="search"
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
              />
              <input
                type="text"
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
                placeholder="Lọc tên file, thư mục..."
                className="w-full h-8 pl-8 pr-3 rounded-[999px] text-xs border focus:outline-none"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-subcard)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {filteredAssets.length === 0 ? (
            <div
              className="flex-1 rounded-[16px] border border-dashed p-6 flex flex-col items-center justify-center text-center gap-2"
              style={{ borderColor: 'var(--border-subcard)' }}
            >
              <WebIcon name="inbox" className="w-6 h-6 opacity-50" />
              <p className="typo-body-sm font-bold">Chưa có tập tin nào trong mục đang chọn</p>
              <p className="typo-caption max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Khi bạn đồng bộ Drive, toàn bộ file <code className="font-mono">.mp4</code>,{' '}
                <code className="font-mono">.webm</code>, <code className="font-mono">.mov</code>{' '}
                và <code className="font-mono">.png</code>, <code className="font-mono">.jpg</code>,{' '}
                <code className="font-mono">.webp</code> sẽ hiển thị tại đây cùng trạng thái khớp 2
                tầng.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[440px] overflow-y-auto glass-scrollbar pr-1">
              {filteredAssets.map((asset) => {
                const matchedBanner = asset.assignedPage
                  ? BANNER_PAGE_MAP[asset.assignedPage]
                  : null;
                const matchedService = asset.assignedServiceId
                  ? SERVICE_DOMAIN_MAP[asset.assignedServiceId]
                  : null;
                const isUnassigned = !matchedBanner && !matchedService;

                return (
                  <div
                    key={asset.fileId}
                    className="rounded-[16px] p-3 border flex flex-col gap-2 transition"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: isUnassigned
                        ? 'rgba(245, 158, 11, 0.5)'
                        : 'var(--border-subcard)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {asset.mediaKind === 'image' ? (
                          <img
                            src={asset.directImageUrl}
                            alt={asset.fileName}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-[12px] object-cover border border-white/15 shrink-0 bg-slate-800"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-[12px] bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
                            <WebIcon name="film" className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm truncate" title={asset.fileName}>
                            {asset.fileName}
                          </div>
                          <div
                            className="text-[11px] flex flex-wrap items-center gap-1.5"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <WebIcon name="folder" className="w-3 h-3 text-amber-500" />
                              <span>{asset.folderName}</span>
                            </span>
                            <span>·</span>
                            <span className="font-mono opacity-80">
                              {asset.fileId.slice(0, 10)}…
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePickedVideo(asset.fileId)}
                        className="w-7 h-7 rounded-[999px] flex items-center justify-center hover:bg-rose-500/15 text-rose-500 cursor-pointer shrink-0"
                        title="Xóa khỏi danh sách hiển thị"
                      >
                        <WebIcon name="trash-2" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Nhãn kết quả khớp 2 tầng + Quyền công khai */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {matchedBanner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                          <WebIcon name="video" className="w-3 h-3" />
                          <span>
                            {asset.matchConfidence === 'auto' ? 'Tự khớp' : 'Đã gán'} → Banner{' '}
                            {matchedBanner.shortLabelVi}
                          </span>
                        </span>
                      ) : matchedService ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          <WebIcon name="image" className="w-3 h-3" />
                          <span>
                            {asset.matchConfidence === 'auto' ? 'Tự khớp' : 'Đã gán'} → Thẻ{' '}
                            {matchedService.titleVi}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          <WebIcon name="alert-circle" className="w-3 h-3" />
                          <span>
                            {asset.folderRole === 'dynamic'
                              ? `Thư mục mở rộng (${asset.folderName})`
                              : 'Chưa khớp — Chọn vị trí thủ công'}
                          </span>
                        </span>
                      )}

                      {asset.permissionStatus === 'public' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300">
                          <WebIcon name="globe" className="w-3 h-3" />
                          <span>Công khai (Reader)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setPendingPermissionFiles([
                              { fileId: asset.fileId, fileName: asset.fileName },
                            ]);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 cursor-pointer"
                          title={asset.permissionMessage || 'Nhấn để cấp quyền xem công khai'}
                        >
                          <WebIcon name="lock" className="w-3 h-3" />
                          <span>
                            {asset.permissionStatus === 'granting'
                              ? 'Đang cấp quyền...'
                              : 'Cấp quyền công khai'}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Dropdown gán thủ công vào bất kỳ Banner Trang hoặc Thẻ Dịch Vụ */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <select
                        aria-label={`Phân loại trang/thẻ cho ${asset.fileName}`}
                        value={getDropdownValueForAsset(asset)}
                        onChange={(e) => handleDropdownAssignChange(asset, e.target.value)}
                        className="flex-1 min-w-[200px] h-8 px-3 rounded-[999px] text-xs font-semibold border cursor-pointer focus:outline-none"
                        style={{
                          background: 'var(--bg-subcard)',
                          borderColor: 'var(--border-subcard)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <option value="">-- Chọn vị trí nhúng trên Website --</option>
                        <optgroup label="Video Nền Banner (9+ Trang)">
                          {BANNER_PAGES.map((p) => (
                            <option key={p.key} value={`banner:${p.key}`}>
                              Banner · {p.labelVi}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="6 Thẻ Dịch Vụ Bento Grid">
                          {SERVICE_DOMAINS_META.map((svc) => (
                            <option key={svc.id} value={`service:${svc.id}`}>
                              Dịch vụ ({svc.id}) · {svc.titleVi}
                            </option>
                          ))}
                        </optgroup>
                      </select>

                      {asset.assignedPage && (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setActivePreviewPage(asset.assignedPage!);
                          }}
                          className="h-8 px-3.5 rounded-[999px] text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shrink-0"
                        >
                          Xem Banner
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 4. BENTO GRID 6 THẺ DỊCH VỤ ĐỒNG BỘ TỪ THƯ MỤC [DỊCH VỤ] */}
      <section
        className="sub-card rounded-[16px] p-[15px] border backdrop-blur-md flex flex-col gap-3"
        style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            className="typo-h5 font-bold subcard-header-sync subcard-title-synced flex items-center gap-2"
            data-subcard-title="true"
          >
            <WebIcon name="grid" className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Bento Grid 6 Lĩnh Vực Dịch Vụ (Đồng bộ Thư mục &ldquo;Dịch Vụ&rdquo;)</span>
          </h3>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => {
                SoundEngine.playPageFlip();
                onNavigateTab(4);
                onClose?.();
              }}
              className="px-3.5 py-1.5 rounded-[999px] text-xs font-bold border hover:bg-black/5 dark:hover:bg-white/10 inline-flex items-center gap-1 cursor-pointer"
              style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-card)' }}
            >
              <span>Mở Trang Dịch Vụ thật</span>
              <WebIcon name="arrow-up-right" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICE_DOMAINS_META.map((svc) => {
            const assigned = serviceAssignments[svc.id];
            const imageUrl = assigned?.directImageUrl || svc.defaultImageUrl;

            return (
              <article
                key={svc.id}
                className="rounded-[16px] p-3.5 border flex flex-col gap-2.5 transition"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: assigned ? 'rgba(16, 185, 129, 0.55)' : 'var(--border-subcard)',
                }}
              >
                <div className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden bg-slate-900/15 dark:bg-slate-900/60 border border-white/10">
                  <img
                    src={imageUrl}
                    alt={svc.titleVi}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-[999px] text-[10px] font-bold backdrop-blur-md ${
                      assigned
                        ? 'bg-emerald-600/85 text-white'
                        : 'bg-black/55 text-white/90'
                    }`}
                  >
                    {assigned ? `Drive: ${assigned.fileName}` : `Mẫu: ${svc.expectedFilename}`}
                  </span>
                  {assigned && (
                    <button
                      type="button"
                      onClick={() => clearServiceAssignment(svc.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-[999px] bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                      title="Khôi phục ảnh mặc định"
                    >
                      <WebIcon name="rotate-ccw" className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <h4
                    className="typo-body-sm font-bold subcard-header-sync subcard-title-synced flex items-center gap-1.5"
                    data-subcard-title="true"
                  >
                    <WebIcon name="layers" className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{svc.titleVi}</span>
                  </h4>
                  <p
                    className="text-xs mt-0.5 line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {svc.taglineVi}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. KHUNG XUẤT & SAO CHÉP CODE WEBSITE HOÀN CHỈNH */}
      <section
        className="sub-card rounded-[16px] border backdrop-blur-md overflow-hidden flex flex-col"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
      >
        <div
          className="px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2"
          style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-subcard)' }}
        >
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h3
              className="typo-body-sm font-bold subcard-header-sync subcard-title-synced flex items-center gap-2"
              data-subcard-title="true"
            >
              <WebIcon name="code-2" className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Mã Nguồn Nhúng Website Tự Động (Font Play · Glassmorphism 16px · Bento)</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center p-0.5 rounded-[999px] border text-[11px] font-bold"
              style={{ borderColor: 'var(--border-subcard)', background: 'var(--bg-card)' }}
            >
              <button
                type="button"
                onClick={() => setExportScope('full-website')}
                className={`px-3 py-1 rounded-[999px] cursor-pointer transition ${
                  exportScope === 'full-website'
                    ? 'bg-indigo-600 text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                Toàn bộ Website (9 Banner + 6 Dịch vụ)
              </button>
              <button
                type="button"
                onClick={() => setExportScope('current-banner')}
                className={`px-3 py-1 rounded-[999px] cursor-pointer transition ${
                  exportScope === 'current-banner'
                    ? 'bg-indigo-600 text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                Banner {activePageMeta.shortLabelVi}
              </button>
            </div>

            <button
              type="button"
              onClick={() => void handleCopyWebsiteCode()}
              className={`px-4 py-1.5 rounded-[999px] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition ${
                copiedCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <WebIcon name={copiedCode ? 'check' : 'copy'} className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Đã sao chép!' : 'Sao chép Code'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 text-[11px] sm:text-xs font-mono leading-relaxed overflow-x-auto max-h-[280px] glass-scrollbar bg-slate-950 text-slate-100 m-0">
          <code>{exportedCode}</code>
        </pre>
      </section>

      {/* OVERLAY XEM TRƯỚC BANNER TOÀN MÀN HÌNH 100VH */}
      {isFullscreen100vh && (
        <div className="fixed inset-0 z-[120] w-screen h-[100vh] bg-slate-950 flex items-center justify-center font-play">
          {activeAssignedVideo ? (
            <div className="absolute inset-0 z-0">
              <DriveAwareBannerMedia
                directVideoUrl={activeAssignedVideo.directStreamUrl}
                iframeFallbackUrl={activeAssignedVideo.previewIframeUrl}
                posterUrl={activePageMeta.posterUrl}
                title={activeAssignedVideo.fileName}
                forceIframeFallback={previewRenderMode === 'iframe'}
              />
            </div>
          ) : (
            <img
              src={activePageMeta.posterUrl}
              alt={activePageMeta.previewTitleVi}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-950/30 z-10 pointer-events-none" />

          {/* Thanh điều hướng nhanh 9 trang trên chế độ 100vh */}
          <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {PRIMARY_9_BANNER_PAGE_KEYS.map((key) => {
                const page = BANNER_PAGE_MAP[key];
                const isSelected = activePreviewPage === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePreviewPage(key)}
                    className={`px-3 py-1 rounded-[999px] text-xs font-bold backdrop-blur-md border cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-transparent shadow'
                        : 'bg-black/45 text-white/90 border-white/20 hover:bg-black/70'
                    }`}
                  >
                    {page.shortLabelVi}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen100vh(false)}
              className="px-4 py-1.5 rounded-[999px] bg-white text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-lg cursor-pointer hover:bg-slate-100"
            >
              <WebIcon name="minimize-2" className="w-4 h-4" />
              <span>Thoát 100vh</span>
            </button>
          </div>

          <div className="relative z-20 max-w-2xl w-full mx-4 rounded-[16px] bg-white/15 dark:bg-slate-950/50 backdrop-blur-md border border-white/30 p-7 text-center shadow-2xl">
            <span className="inline-block px-3.5 py-1 rounded-[999px] text-xs font-bold bg-white/20 text-white border border-white/25 mb-3">
              {activePageMeta.labelVi}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {activePageMeta.previewTitleVi}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-white/90 leading-relaxed">
              {activePageMeta.previewSubtitleVi}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen100vh(false);
                  if (onNavigateTab) {
                    onNavigateTab(activePageMeta.tabIndex);
                    onClose?.();
                  }
                }}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-[999px] bg-gradient-to-r ${activePageMeta.accentGradient} text-white text-sm font-bold shadow-xl cursor-pointer hover:brightness-110`}
              >
                <span>{activePageMeta.ctaLabelVi}</span>
                <WebIcon name="arrow-up-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HỘP THOẠI XÁC NHẬN CẤP QUYỀN CÔNG KHAI DRIVE (BẮT BUỘC TRƯỚC KHI MUTATE PERMISSIONS) */}
      <Modal
        isOpen={pendingPermissionFiles.length > 0}
        onClose={() => {
          if (!isGrantingPermissions) setPendingPermissionFiles([]);
        }}
        title="Xác nhận cấp quyền xem công khai Google Drive"
        icon={<WebIcon name="shield-check" className="w-5 h-5 text-indigo-500" />}
        maxWidth="lg"
      >
        <div className="space-y-4 font-play text-left">
          <p className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
            Để video nền và hình ảnh dịch vụ hiển thị mượt mà trên mọi trình duyệt của khách truy
            cập mà không gặp lỗi <strong>403 Forbidden</strong>, ứng dụng sẽ cập nhật quyền chia sẻ
            của <strong>{pendingPermissionFiles.length} tập tin</strong> sau thành{' '}
            <em>&ldquo;Bất kỳ ai có liên kết đều có thể xem&rdquo;</em> (
            <code className="font-mono">role: &apos;reader&apos;, type: &apos;anyone&apos;</code>):
          </p>

          <ul
            className="max-h-48 overflow-y-auto rounded-[16px] border p-3 space-y-1.5"
            style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
          >
            {pendingPermissionFiles.map((f) => (
              <li key={f.fileId} className="text-xs flex items-center justify-between gap-2">
                <span className="font-bold truncate">{f.fileName}</span>
                <span className="font-mono opacity-70 shrink-0">{f.fileId.slice(0, 10)}…</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isGrantingPermissions}
              onClick={() => setPendingPermissionFiles([])}
              className="px-4 py-2 rounded-[999px] text-xs font-bold border cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
              style={{ borderColor: 'var(--border-subcard)' }}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={isGrantingPermissions}
              onClick={() => void handleConfirmGrantPublicPermissions()}
              className="px-5 py-2 rounded-[999px] text-xs font-bold bg-gradient-to-r from-[#1480C0] to-[#6353B5] text-white shadow cursor-pointer hover:brightness-110 disabled:opacity-60"
            >
              {isGrantingPermissions ? 'Đang cấp quyền...' : 'Xác nhận cấp quyền công khai'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
