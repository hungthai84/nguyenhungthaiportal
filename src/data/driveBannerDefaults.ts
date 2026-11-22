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
  | 'skills'
  | 'aiAssistant',
  { videoId: string; title: string; previewUrl: string }
> = {
  contact: {
    videoId: '1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP',
    title: 'Video Banner Đặt lịch',
    previewUrl: 'https://drive.google.com/file/d/1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP/preview',
  },
  horoscope: {
    videoId: 'https://cdn.scena.ai/project/10223/93137f897eb5f97382f02d64e99ca0270133bea596646ca5f574e96e80aab770.mp4',
    title: 'Video Banner Tử Vi',
    previewUrl: 'https://cdn.scena.ai/project/10223/93137f897eb5f97382f02d64e99ca0270133bea596646ca5f574e96e80aab770.mp4',
  },
  interface: {
    videoId: 'https://cdn.scena.ai/project/10223/13eee325b1e14c3b5496ca67e6bf5a3558a5ff156c17f40045f15f82d9e29391.mp4',
    title: 'Video Banner Giao diện',
    previewUrl: 'https://cdn.scena.ai/project/10223/13eee325b1e14c3b5496ca67e6bf5a3558a5ff156c17f40045f15f82d9e29391.mp4',
  },
  education: {
    videoId: 'https://cdn.scena.ai/project/10223/3b21c889ee1a2e472ff083f353aacceecbaf898663debad53a46736097ec4df1.mp4',
    title: 'Video Banner Học vấn',
    previewUrl: 'https://cdn.scena.ai/project/10223/3b21c889ee1a2e472ff083f353aacceecbaf898663debad53a46736097ec4df1.mp4',
  },
  wallpaper: {
    videoId: 'https://cdn.scena.ai/project/10223/f05fad8258c2979cd5d67217df4e4258a6f7da100249899f7bfd535a17e29cee.mp4',
    title: 'Video Banner Hình nền',
    previewUrl: 'https://cdn.scena.ai/project/10223/f05fad8258c2979cd5d67217df4e4258a6f7da100249899f7bfd535a17e29cee.mp4',
  },
  memories: {
    videoId: 'https://cdn.scena.ai/project/10223/623a65aeff2baa4f3c3dd477737d31d9d1b6da96a011e9a34e8707268e60202f.mp4',
    title: 'Video Banner Kỷ niệm',
    previewUrl: 'https://cdn.scena.ai/project/10223/623a65aeff2baa4f3c3dd477737d31d9d1b6da96a011e9a34e8707268e60202f.mp4',
  },
  experience: {
    videoId: '1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn',
    title: 'Video Banner Kinh nghiệm',
    previewUrl: 'https://drive.google.com/file/d/1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn/preview',
  },
  systems: {
    videoId: 'https://cdn.scena.ai/project/10223/0bd6e45854837053445e091d7cf58d9045dc25df8904024321fdba07c557447c.mp4',
    title: 'Video Banner Hệ thống',
    previewUrl: 'https://cdn.scena.ai/project/10223/0bd6e45854837053445e091d7cf58d9045dc25df8904024321fdba07c557447c.mp4',
  },
  services: {
    videoId: 'https://cdn.scena.ai/project/10223/f3a9f7acb4f23d90f7ad166286a0f41384d667aa1bf72e6803e0c6a9468c4c4f.mp4',
    title: 'Video Banner Dịch vụ',
    previewUrl: 'https://cdn.scena.ai/project/10223/f3a9f7acb4f23d90f7ad166286a0f41384d667aa1bf72e6803e0c6a9468c4c4f.mp4',
  },
  projects: {
    videoId: 'https://cdn.scena.ai/project/10223/4acb98f87ccd8420e92440c96d0d0d1a21ecb4efb212fdee490e43811ae8128e.mp4',
    title: 'Video Banner Dự án',
    previewUrl: 'https://cdn.scena.ai/project/10223/4acb98f87ccd8420e92440c96d0d0d1a21ecb4efb212fdee490e43811ae8128e.mp4',
  },
  skills: {
    videoId: 'https://cdn.scena.ai/project/10223/f05fad8258c2979cd5d67217df4e4258a6f7da100249899f7bfd535a17e29cee.mp4',
    title: 'Video Banner Kỹ năng',
    previewUrl: 'https://cdn.scena.ai/project/10223/f05fad8258c2979cd5d67217df4e4258a6f7da100249899f7bfd535a17e29cee.mp4',
  },
  aiAssistant: {
    videoId: 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4',
    title: 'Video Banner AI hỗ trợ',
    previewUrl: 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4',
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
