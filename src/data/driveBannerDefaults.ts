import type { BannerPageKey } from '@/utils/bannerVideoMatcher';
import {
  buildDriveDirectImageUrl,
  buildDriveDirectStreamUrl,
  buildDrivePreviewIframeUrl,
  type PickedDriveVideo,
} from '@/services/googleDriveBannerService';

export interface DriveBannerDefaultEntry extends PickedDriveVideo {
  assignedPage: BannerPageKey;
  matchedKeyword: string;
  matchConfidence: 'auto';
  addedAt: number;
}

interface RawDriveBannerLinkItem {
  pageKey: BannerPageKey;
  fileName: string;
  fileId: string;
  matchedKeyword: string;
  previewUrl: string;
}

/**
 * Danh sách 9 video banner chính thức từ Google Drive
 * (Thư mục `Video Banner` — `Website Hung Thai CV database`).
 */
const DRIVE_VIDEO_BANNER_SEED_LIST: RawDriveBannerLinkItem[] = [
  {
    pageKey: 'contact',
    fileName: 'Đặt lịch.mp4',
    fileId: '1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP',
    matchedKeyword: 'Đặt lịch',
    previewUrl: 'https://drive.google.com/file/d/1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP/preview',
  },
  {
    pageKey: 'horoscope',
    fileName: 'Tử Vi.mp4',
    fileId: '1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4',
    matchedKeyword: 'Tử Vi',
    previewUrl: 'https://drive.google.com/file/d/1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4/preview',
  },
  {
    pageKey: 'interface',
    fileName: 'Giao diện.mp4',
    fileId: '1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx',
    matchedKeyword: 'Giao diện',
    previewUrl: 'https://drive.google.com/file/d/1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx/preview',
  },
  {
    pageKey: 'education',
    fileName: 'Học vấn.mp4',
    fileId: '1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav',
    matchedKeyword: 'Học vấn',
    previewUrl: 'https://drive.google.com/file/d/1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav/preview',
  },
  {
    pageKey: 'wallpaper',
    fileName: 'Hình nền.mp4',
    fileId: '1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB',
    matchedKeyword: 'Hình nền',
    previewUrl: 'https://drive.google.com/file/d/1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB/preview',
  },
  {
    pageKey: 'memories',
    fileName: 'Kỷ niệm.mp4',
    fileId: '1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B',
    matchedKeyword: 'Kỷ niệm',
    previewUrl: 'https://drive.google.com/file/d/1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B/preview',
  },
  {
    pageKey: 'experience',
    fileName: 'Kinh nghiệm.mp4',
    fileId: '1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn',
    matchedKeyword: 'Kinh nghiệm',
    previewUrl: 'https://drive.google.com/file/d/1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn/preview',
  },
  {
    pageKey: 'systems',
    fileName: 'Hệ thống.mp4',
    fileId: '1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY',
    matchedKeyword: 'Hệ thống',
    previewUrl: 'https://drive.google.com/file/d/1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY/preview',
  },
  {
    pageKey: 'services',
    fileName: 'Dịch Vụ.mp4',
    fileId: '1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP',
    matchedKeyword: 'Dịch Vụ',
    previewUrl: 'https://drive.google.com/file/d/1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP/preview',
  },
];

const DEFAULT_SEED_TIMESTAMP = 1795204136000;

export const DEFAULT_DRIVE_BANNER_ASSIGNMENTS: Partial<
  Record<BannerPageKey, DriveBannerDefaultEntry>
> = DRIVE_VIDEO_BANNER_SEED_LIST.reduce(
  (acc, item) => {
    acc[item.pageKey] = {
      fileId: item.fileId,
      fileName: item.fileName,
      mimeType: 'video/mp4',
      mediaKind: 'video',
      folderId: '1rLLAhVL4kg6gboRMJN-OZK9x7fQte93k',
      folderName: 'Video Banner',
      folderPath: 'Website Hung Thai CV database / Video Banner',
      webViewLink: item.previewUrl,
      directStreamUrl: buildDriveDirectStreamUrl(item.fileId),
      previewIframeUrl: buildDrivePreviewIframeUrl(item.fileId),
      directImageUrl: buildDriveDirectImageUrl(item.fileId),
      permissionStatus: 'public',
      permissionMessage: 'Liên kết Google Drive mặc định đã cấu hình sẵn',
      assignedPage: item.pageKey,
      matchedKeyword: item.matchedKeyword,
      matchConfidence: 'auto',
      addedAt: DEFAULT_SEED_TIMESTAMP,
    };
    return acc;
  },
  {} as Partial<Record<BannerPageKey, DriveBannerDefaultEntry>>
);
