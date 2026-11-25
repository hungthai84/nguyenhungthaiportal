/**
 * Centralized Google Drive Media URL helpers & file ID registry
 */

export const driveImageUrl = (id: string): string =>
  `https://lh3.googleusercontent.com/d/${id}`;

export const driveVideoUrl = (id: string): string =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export const DRIVE_BANNER_VIDEOS = {
  contact: 'https://cdn.scena.ai/project/10223/f39da3fa3116c7ee0bd89e63de2dfc10ccefe36092e8aeac2e7791c56fed53f5.mp4', // Đặt lịch.mp4
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
  ecommerce: 'https://i.postimg.cc/bNHwQm4j/Thuong-mai-dien-tu.png', // Thương mại điện tử.png
  ewallet: 'https://i.postimg.cc/rFCwSf3j/Thanh-toan-dien-tu.png', // Thanh toán điện tử.png
  systemBuild: 'https://i.postimg.cc/QxkdpfvL/Xay-dung-he-thong.png', // Xây dựng hệ thống.png
  esports: 'https://i.postimg.cc/Nf7j1dSk/The-thao-dien-tu.png', // Thể thao điện tử.png
  telecom: 'https://i.postimg.cc/5Nq2wsTG/Vien-thong-di-dong.png', // Viễn thông di động.png
  insurance: 'https://i.postimg.cc/RVQZcgyT/Dich-vu-bao-hiem.png', // Dịch vụ bảo hiểm.png
} as const;

export const DRIVE_AVATARS = {
  hungThai: driveImageUrl('1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm'), // Avata Hùng Thái.gif
  aiAssistant: driveImageUrl('1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ'), // Avata AI hỗ trợ.gif
} as const;

export const DRIVE_MEMORIES = {
  v247: [
    'https://i.postimg.cc/pdJDDm21/V247-1.jpg', // V247-1.jpg
    'https://i.postimg.cc/rpk101Lr/V247-2.jpg', // V247-2.jpg
    'https://i.postimg.cc/GmYPmM6R/V247-3.jpg', // V247-3.jpg
    'https://i.postimg.cc/Wbx6jRWS/V247-4.jpg', // V247-4.jpg
    'https://i.postimg.cc/LX4jvm54/V247-5.jpg', // V247-5.jpg
  ],
  mobifone: [
    'https://i.postimg.cc/65KtCY32/Mobifone-1.webp', // Mobifone-1.webp
    'https://i.postimg.cc/DwyhM017/Mobifone-2.webp', // Mobifone-2.webp
    'https://i.postimg.cc/FHWv5vx3/Mobifone-3.webp', // Mobifone-3.webp
  ],
  htvc: [
    'https://i.postimg.cc/yx4BQTyG/HTVC-1.webp', // HTVC-1.webp
    'https://i.postimg.cc/66nB7D9x/HTVC-2.webp', // HTVC-2.webp
    'https://i.postimg.cc/LXZ23WLf/HTVC-3.webp', // HTVC-3.webp
    'https://i.postimg.cc/TYcG0gLk/HTVC-4.webp', // HTVC-4.webp
  ],
  ved: [
    'https://i.postimg.cc/tCq8XfJ5/VED-1.webp', // VED-1.webp
    'https://i.postimg.cc/mkRJ1pwT/VED-2.webp', // VED-2.webp
    'https://i.postimg.cc/zG3MhgnH/VED-3.webp', // VED-3.webp
    'https://i.postimg.cc/nc3gMkQt/VED-4.webp', // VED-4.webp
  ],
  prudential: [
    'https://i.postimg.cc/K8zX5Vyz/Prudential-1.webp', // Prudential-1.webp
    'https://i.postimg.cc/T3HzN9Rc/Prudential-2.webp', // Prudential-2.webp
    'https://i.postimg.cc/nLj6yDrf/Prudential-3.webp', // Prudential-3.webp
    'https://i.postimg.cc/W4BQT1qF/Prudential-4.webp', // Prudential-4.webp
    'https://i.postimg.cc/gJ31Jb3M/Prudential-5.webp', // Prudential-5.webp
    'https://i.postimg.cc/kGcZQN1K/Prudential-6.webp', // Prudential-6.webp
    'https://i.postimg.cc/v8LpwMYT/Prudential-7.webp', // Prudential-7.webp
  ],
  momo: [
    'https://i.postimg.cc/JnJCkkC5/Momo-1.webp', // Momo-1.webp
    'https://i.postimg.cc/6Q8XBPHS/Momo-2.webp', // Momo-2.webp
    'https://i.postimg.cc/rp7Ls93p/Momo-3.webp', // Momo-3.webp
    'https://i.postimg.cc/PJjsz5ts/Momo-4.webp', // Momo-4.webp
    'https://i.postimg.cc/Y26w2Y3p/Momo-5.webp', // Momo-5.webp
    'https://i.postimg.cc/j24V8Y5W/Momo-6.webp', // Momo-6.webp
    'https://i.postimg.cc/QxSG1Dww/Momo-7.webp', // Momo-7.webp
    'https://i.postimg.cc/fTMQVy2Y/Momo-8.webp', // Momo-8.webp
  ],
  finviet: [
    'https://i.postimg.cc/4y6Grh8x/Finviet-1.webp', // Finviet-1.webp
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
  mobifone: 'https://i.postimg.cc/k5HZ6dyk/Mobifone.png', // Mobifone.png
  v247: 'https://i.postimg.cc/63GPC1jz/v247.png', // v247.png
  lbc: 'https://i.postimg.cc/cJzjgNmq/LBC.png', // LBC.png
  ved: 'https://i.postimg.cc/Fz5Bpg8S/VED.png', // VED.png
  prudential: 'https://i.postimg.cc/4dh0pFL9/Prudentinal.png', // Prudentinal.png
  momo: 'https://i.postimg.cc/25tJbfxM/Momo.png', // Momo.png
  finviet: 'https://i.postimg.cc/6QPS2Nhb/Finviet.png', // Finviet.png
  opportunity: 'https://i.postimg.cc/Px871F32/Tim-Co-hoi.png', // Tìm Cơ hội.png
} as const;
