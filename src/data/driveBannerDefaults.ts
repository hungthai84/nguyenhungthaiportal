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
 * Danh sách 11 video banner chính thức từ Google Drive
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
    fileName: 'Dịch vụ.mp4',
    fileId: '1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP',
    matchedKeyword: 'Dịch vụ',
    previewUrl: 'https://drive.google.com/file/d/1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP/preview',
  },
  {
    pageKey: 'projects',
    fileName: 'Dự án.mp4',
    fileId: '1Hj-mzRUy2Z_XX4pXEVfCMIwpHV9KYL2U',
    matchedKeyword: 'Dự án',
    previewUrl: 'https://drive.google.com/file/d/1Hj-mzRUy2Z_XX4pXEVfCMIwpHV9KYL2U/preview',
  },
  {
    pageKey: 'skills',
    fileName: 'Kỹ năng.mp4',
    fileId: '1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx',
    matchedKeyword: 'Kỹ năng',
    previewUrl: 'https://drive.google.com/file/d/1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx/preview',
  },
];

export const VIDEO_BANNER_CONFIG: Record<
  | 'contact'
  | 'horoscope'
  | 'interface'
  | 'education'
  | 'wallpaper'
  | 'memories'
  | 'experience'
  | 'systems'
  | 'services'
  | 'projects'
  | 'skills',
  { videoId: string; title: string; previewUrl: string }
> = {
  contact: {
    videoId: '1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP',
    title: 'Video Banner Đặt lịch',
    previewUrl: 'https://drive.google.com/file/d/1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP/preview',
  },
  horoscope: {
    videoId: '1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4',
    title: 'Video Banner Tử Vi',
    previewUrl: 'https://drive.google.com/file/d/1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4/preview',
  },
  interface: {
    videoId: '1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx',
    title: 'Video Banner Giao diện',
    previewUrl: 'https://drive.google.com/file/d/1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx/preview',
  },
  education: {
    videoId: '1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav',
    title: 'Video Banner Học vấn',
    previewUrl: 'https://drive.google.com/file/d/1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav/preview',
  },
  wallpaper: {
    videoId: '1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB',
    title: 'Video Banner Hình nền',
    previewUrl: 'https://drive.google.com/file/d/1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB/preview',
  },
  memories: {
    videoId: '1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B',
    title: 'Video Banner Kỷ niệm',
    previewUrl: 'https://drive.google.com/file/d/1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B/preview',
  },
  experience: {
    videoId: '1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn',
    title: 'Video Banner Kinh nghiệm',
    previewUrl: 'https://drive.google.com/file/d/1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn/preview',
  },
  systems: {
    videoId: '1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY',
    title: 'Video Banner Hệ thống',
    previewUrl: 'https://drive.google.com/file/d/1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY/preview',
  },
  services: {
    videoId: '1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP',
    title: 'Video Banner Dịch vụ',
    previewUrl: 'https://drive.google.com/file/d/1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP/preview',
  },
  projects: {
    videoId: '1Hj-mzRUy2Z_XX4pXEVfCMIwpHV9KYL2U',
    title: 'Video Banner Dự án',
    previewUrl: 'https://drive.google.com/file/d/1Hj-mzRUy2Z_XX4pXEVfCMIwpHV9KYL2U/preview',
  },
  skills: {
    videoId: '1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx',
    title: 'Video Banner Kỹ năng',
    previewUrl: 'https://drive.google.com/file/d/1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx/preview',
  },
};

export type ManagedVideoBannerKey = keyof typeof VIDEO_BANNER_CONFIG;

export const getDefaultBannerVideoConfig = (pageKey: ManagedVideoBannerKey) =>
  VIDEO_BANNER_CONFIG[pageKey];

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
