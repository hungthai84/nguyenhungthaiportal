/**
 * Centralized Google Drive Media URL helpers & file ID registry
 */

export const driveImageUrl = (id: string): string =>
  `https://lh3.googleusercontent.com/d/${id}`;

export const driveVideoUrl = (id: string): string =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export const DRIVE_BANNER_VIDEOS = {
  contact: 'https://cdn.scena.ai/project/10223/f39da3fa3116c7ee0bd89e63de2dfc10ccefe36092e8aeac2e7791c56fed53f5.mp4', // Đặt lịch.mp4
  aiAssistant: 'https://cdn.scena.ai/project/10223/c81ba72750f77882cc06ff84414c9117c0705d99efc1e6e0ad519af88a4fc731.mp4', // AI hỗ trợ Trí Nhân
  horoscope: driveVideoUrl('1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4'), // Tử Vi.mp4
  interface: driveVideoUrl('1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx'), // Giao diện.mp4
  education: driveVideoUrl('1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav'), // Học vấn.mp4
  wallpaper: driveVideoUrl('1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB'), // Hình nền.mp4
  memories: driveVideoUrl('1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B'), // Kỷ niệm.mp4
  experience: driveVideoUrl('1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn'), // Kinh nghiệm.mp4
  systems: driveVideoUrl('1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY'), // Hệ thống.mp4
  services: driveVideoUrl('1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP'), // Dịch Vụ.mp4
} as const;

export const DRIVE_SERVICE_IMAGES = {
  ecommerce: 'https://i.postimg.cc/FFDJx9jD/Thuong-mai-dien-tu.webp', // Thương mại điện tử.webp
  ewallet: 'https://i.postimg.cc/zvtbDjJV/Thanh-toan-dien-tu.webp', // Thanh toán điện tử.webp
  systemBuild: 'https://i.postimg.cc/L4NZVHzT/Xay-dung-he-thong.webp', // Xây dựng hệ thống.webp
  esports: 'https://i.postimg.cc/cC4tNjNr/The-thao-dien-tu.webp', // Thể thao điện tử.webp
  telecom: 'https://i.postimg.cc/05cJC8p7/Vien-thong-di-dong.webp', // Viễn thông di động.webp
  insurance: 'https://i.postimg.cc/2y8LfJf1/Dich-vu-bao-hiem.webp', // Dịch vụ bảo hiểm.webp
} as const;

export const DRIVE_AVATARS = {
  hungThai: driveImageUrl('1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm'), // Avata Hùng Thái.gif
  aiAssistant: driveImageUrl('1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ'), // Avata AI hỗ trợ.gif
} as const;

export const DRIVE_MEMORIES = {
  v247: [
    'https://i.postimg.cc/0NwBpWFy/V247-1.webp', // V247-1.webp
    'https://i.postimg.cc/PqwRm39x/V247-2.webp', // V247-2.webp
    'https://i.postimg.cc/QMTyp4w9/V247-3.webp', // V247-3.webp
    'https://i.postimg.cc/g0ZTvSQL/V247-4.webp', // V247-4.webp
    'https://i.postimg.cc/6Qvmdjgv/V247-5.webp', // V247-5.webp
  ],
  mobifone: [
    'https://i.postimg.cc/DwDN4kCM/Mobifone-1.webp', // Mobifone-1.webp
    'https://i.postimg.cc/wjPrR8Wr/Mobifone-2.webp', // Mobifone-2.webp
    'https://i.postimg.cc/htwYQWC6/Mobifone-3.webp', // Mobifone-3.webp
  ],
  htvc: [
    'https://i.postimg.cc/P5c7vs62/HTVC-1.webp', // HTVC-1.webp
    'https://i.postimg.cc/3x6q05LL/HTVC-2.webp', // HTVC-2.webp
    'https://i.postimg.cc/9QSkw5x1/HTVC-3.webp', // HTVC-3.webp
    'https://i.postimg.cc/Mp4Lf2s3/HTVC-4.webp', // HTVC-4.webp
  ],
  ved: [
    'https://i.postimg.cc/wvYbF5YR/VED-1.webp', // VED-1.webp
    'https://i.postimg.cc/Ls1bzCwP/VED-2.webp', // VED-2.webp
    'https://i.postimg.cc/DZ3Y5Q3b/VED-3.webp', // VED-3.webp
    'https://i.postimg.cc/JnCdK3Ck/VED-4.webp', // VED-4.webp
  ],
  prudential: [
    'https://i.postimg.cc/FKLBjW8X/Prudential-1.webp', // Prudential-1.webp
    'https://i.postimg.cc/FKLBjW84/Prudential-2.webp', // Prudential-2.webp
    'https://i.postimg.cc/Ls1bzCwm/Prudential-3.webp', // Prudential-3.webp
    'https://i.postimg.cc/9f7nG8KX/Prudential-4.webp', // Prudential-4.webp
    'https://i.postimg.cc/tgxMhSwC/Prudential-5.webp', // Prudential-5.webp
    'https://i.postimg.cc/SKMvWT3J/Prudential-6.webp', // Prudential-6.webp
    'https://i.postimg.cc/CKqQjPXR/Prudential-7.webp', // Prudential-7.webp
  ],
  momo: [
    'https://i.postimg.cc/pL7S5b0g/Momo-1.webp', // Momo-1.webp
    'https://i.postimg.cc/T3Ss5M78/Momo-2.webp', // Momo-2.webp
    'https://i.postimg.cc/9QSkw585/Momo-3.webp', // Momo-3.webp
    'https://i.postimg.cc/t4fcnQSy/Momo-4.webp', // Momo-4.webp
    'https://i.postimg.cc/QdPzKG4x/Momo-5.webp', // Momo-5.webp
    'https://i.postimg.cc/htwYQWyS/Momo-6.webp', // Momo-6.webp
    'https://i.postimg.cc/nh5W9bRL/Momo-7.webp', // Momo-7.webp
    'https://i.postimg.cc/cLjzty9H/Momo-8.webp', // Momo-8.webp
  ],
  finviet: [
    'https://i.postimg.cc/L87WgKyx/Finviet-1.webp', // Finviet-1.webp
  ],
} as const;

export const DRIVE_PROJECT_BANNERS = {
  '1.1': 'https://i.postimg.cc/LXdY8nrR/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.png',
  '1.2': 'https://i.postimg.cc/pTNhLpgM/1-2-Thiet-lap-muc-tieu-phong-ban.png',
  '1.3': 'https://i.postimg.cc/B6WLnXdJ/1-3-Nang-cao-trai-nghiem-khach-hang.png',
  '1.4': 'https://i.postimg.cc/tT0Z4YLp/1-4-Quan-ly-du-an-CSKH.png',
  '1.5': 'https://i.postimg.cc/B6x8LJ0K/1-5-Thuc-day-cai-tien-san-pham.png',
  '1.6': 'https://i.postimg.cc/HxQJcTgX/1-6-Quan-ly-khung-hoang-va-giam-khach-hang-roi-bo.png',
  '2.1': 'https://i.postimg.cc/9MG4Rchd/2-1-Chuan-hoa-quy-trinh-CSKH.png',
  '2.2': 'https://i.postimg.cc/SsWX2mhd/2-2-Toi-uu-hoa-kenh-ho-tro.png',
  '2.3': 'https://i.postimg.cc/kGq2WLJN/2-3-Trien-khai-tu-dong-hoa-(2).png',
  '2.4': 'https://i.postimg.cc/QChFcv8m/2-4-Quan-ly-chien-dich-Outbound.png',
  '2.5': 'https://i.postimg.cc/90CDysmL/2-5-Quan-ly-doi-tac-thue-ngoai-cham-soc-khach-hang.png',
  '3.1': 'https://i.postimg.cc/SRkncHST/3-1-Xay-dung-he-thong-CRM.png',
  '3.2': 'https://i.postimg.cc/rsMD57V7/3-2-Phan-tich-Bao-cao.png',
  '3.3': 'https://i.postimg.cc/vTb45CYK/3-3-Khao-sat-Danh-gia-khach-hang.jpg',
  '3.4': 'https://i.postimg.cc/2yr1ngks/3-4-Xay-dung-AI-Bot.png',
  '4.1': 'https://i.postimg.cc/5ybX8D9d/4-1-Phat-trien-dao-tao-truc-tuyen.png',
  '4.2': 'https://i.postimg.cc/cChrhTCp/4-2-Xay-dung-khung-nang-luc-va-lo-trinh-phat-trien.png',
  '5.1': 'https://i.postimg.cc/tJkYkDJ8/5-1-Thanh-lap-trung-tam-ho-tro.png',
  '6.1': 'https://i.postimg.cc/gjsns4rm/6-1-Khach-hang-la-trung-tam.png',
  '6.2': 'https://i.postimg.cc/SRdJdVjh/6-2-Quan-tri-su-thay-doi-va-khung-hoang-dich-vu.png',
  '6.3': 'https://i.postimg.cc/yxjkjnW6/6-3-Ung-dung-tri-tue-nhan-tao-nang-cao-hieu-suat-CSKH.png',
} as const;

export const DRIVE_EDUCATION_BANNERS = {
  webDesign: 'https://i.postimg.cc/4dt8YHyc/Thiet-ke-website.png', // Thiết kế website.png
  dataAnalysis: 'https://i.postimg.cc/LsGC439m/Phan-tich-du-lieu.png', // Phân tích dữ liệu.png
  seniorMgmt: 'https://i.postimg.cc/YSTn2zr9/Quan-ly-cap-cao.png', // Quản lý cấp cao.png
  riskMgmt: 'https://i.postimg.cc/767B5Jhf/Quan-ly-rui-ro.png', // Quan lý rui ro.png
  projectMgmt: 'https://i.postimg.cc/NMTNK2FM/Quan-ly-du-an.png', // Quản lý dự án.png
  middleMgmt: 'https://i.postimg.cc/25gcj7kb/Quan-ly-cap-trung.png', // Quản lý cấp trung.png
  training: 'https://i.postimg.cc/TPB72JdG/Dao-tao.png', // Đào tạo.png
  presentation: 'https://i.postimg.cc/qRnmN6q3/Thuyet-trinh.png', // Thuyết trình.png
  interview: 'https://i.postimg.cc/1zbCRrmR/Phong-van.png', // Phỏng vấn.png
  recruitment: driveImageUrl('180WJFqcuq5Qk19XqbzEnIfa-pfBL6M5r'), // Tuyển dụng.png
  itBachelor: 'https://i.postimg.cc/rp7nyNVL/Cu-nhan-CNTT.png', // Cử nhân CNTT.png
  mcsa: 'https://i.postimg.cc/0NhW50kR/MCSA.png', // MCSA.png
  ccna: 'https://i.postimg.cc/vmCq8tYR/CCNA.png', // CCNA.png
  mobifoneAgent: 'https://i.postimg.cc/gJRMxLjX/Tong-dai-vien-Mobifone.png', // Tổng đài viên Mobifone.png
} as const;

export const DRIVE_ABOUT_VIDEOS = {
  idle: driveVideoUrl('1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5'), // Man hình chờ Gioi thieu.mp4
  intro: driveVideoUrl('12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R'), // Giới thiệu vui nhộn.mp4
} as const;

export const DRIVE_SYSTEM_MEDIA = {
  aiAssistant: {
    image: 'https://i.postimg.cc/4dCD2ghv/AI-Assistant-Tro-ly-Tri-tue-Nhan-tao.png',
    video: driveVideoUrl('179Ba81_6ykQAMjp1ogyaolfPIhyz32kk'),
  },
  biDashboard: {
    image: 'https://i.postimg.cc/1txk7QNB/BI-Dashboard-Bao-cao-Phan-tich.png',
    video: driveVideoUrl('1JmFAmjRUqwNdknEfy4oonMDPodj64TdW'),
  },
  bpm: {
    image: 'https://i.postimg.cc/hjFkZB71/BPM-Quan-ly-Quy-trinh-Nghiep-vu.png',
    video: driveVideoUrl('1-e9vmijUSHcSPN-oNORtJNQw5lHICGGD'),
  },
  clp: {
    image: 'https://i.postimg.cc/fL4GqN0c/CLP-Khach-hang-Than-thiet.png',
    video: driveVideoUrl('1dvllOsJN5SBN1SeR2r6QUunJFzkdLSuO'),
  },
  crm: {
    image: 'https://i.postimg.cc/W3RBYvJH/CRM-Quan-ly-Quan-he-Khach-hang.png',
    video: driveVideoUrl('1k7n3D4HotTBkh-34wRQRU6MYad6IHbsH'),
  },
  csc: {
    image: 'https://i.postimg.cc/wvKC4psP/CSC-Trung-tam-Cham-soc-Khach-hang.png',
    video: driveVideoUrl('1fcBeTT6Fao9y_Mzfkb3bU3w0tb_kacKf'),
  },
  erp: {
    image: 'https://i.postimg.cc/Y9c5DHmT/ERP-Tai-chinh-ke-toan.png',
    video: driveVideoUrl('1yxonN-6inK6xMiRRsJEiE-WgSCaWRssV'),
  },
  hrm: {
    image: 'https://i.postimg.cc/B6xddVxh/HRM-Quan-ly-Nguon-nhan-luc.png',
    video: driveVideoUrl('1NQ3i1GT3qB8_bQ-TUoCax6fs8m1noLqY'),
  },
  lms: {
    image: 'https://i.postimg.cc/DZqttMqt/LMS-Quan-ly-Dao-tao.png',
    video: driveVideoUrl('1eF17zSBBDouSURRjL57rUon_tvlycPsi'),
  },
  office: {
    image: 'https://i.postimg.cc/XJwTTzwm/Office-Cong-cu-van-phong.png',
    video: driveVideoUrl('1VYVxFPSyVZlH8yRBpXFeWiBrkq_lDPdB'),
  },
  okr: {
    image: 'https://i.postimg.cc/Jnb992bf/OKR-Quan-ly-Muc-tieu-Ket-qua.png',
    video: driveVideoUrl('1Ma_e0nYubC0zWdwV3vuiFgKJlDi54BfJ'),
  },
  pos: {
    image: 'https://i.postimg.cc/264PPKQY/POS-Quan-ly-Ban-hang-tai-Quay.png',
    video: driveVideoUrl('1u2LeXzU83AIf_qMsOM6sYVP7xjzQ9Yr9'),
  },
  sdp: {
    image: 'https://i.postimg.cc/0QpLLBYy/SDP-Cong-lam-viec-CSKH.png',
    video: driveVideoUrl('1i3aEPWdyRSoOQCy3zIv5r7w4MjL2bpcH'),
  },
} as const;

export const DRIVE_EXPERIENCE_BANNERS = {
  mobifone: 'https://i.postimg.cc/J0f8691x/Mobifone.webp',
  v247: 'https://i.postimg.cc/zvsNt9J6/V247.webp',
  lbc: 'https://i.postimg.cc/hvknyHSr/LBC.webp',
  ved: 'https://i.postimg.cc/cCpW9Vsz/VED.webp',
  prudential: 'https://i.postimg.cc/D09hjt2Y/Prudential.webp',
  momo: 'https://i.postimg.cc/90628vWg/Momo.webp',
  finviet: 'https://i.postimg.cc/3N47ZKHb/Finviet.webp',
  opportunity: 'https://i.postimg.cc/Px871F32/Tim-Co-hoi.png',
} as const;
