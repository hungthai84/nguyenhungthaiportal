/**
 * Centralized Google Drive Media URL helpers & file ID registry
 */

export const driveImageUrl = (id: string): string =>
  `https://lh3.googleusercontent.com/d/${id}`;

export const driveVideoUrl = (id: string): string =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export const DRIVE_BANNER_VIDEOS = {
  contact: driveVideoUrl('1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP'), // Đặt lịch.mp4
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
  ecommerce: driveImageUrl('1szhpY7ClmC9DLMhLw4M-On2bKC_L27Mz'), // Thương mại điện tử.png
  ewallet: driveImageUrl('1hxfswQ7LzGpdFCddUOFoHiK29EBWuk67'), // Thanh toán điện tử.png
  systemBuild: driveImageUrl('1RuoLQ4l2n8LNiVv6ntj251Y_1E6cLIpk'), // Xây dựng hệ thống.png
  esports: driveImageUrl('1N9hGfjN9XABOs43QqxZNRhlC5_LZsy1Q'), // Thể thao điện tử.png
  telecom: driveImageUrl('1EZTKZuFTA5EjI56gGwEQ_4pdjfg-hBZE'), // Viễn thông di động.png
  insurance: driveImageUrl('1j1HNT64M4jaAtvUaUUHAEUxlgr1WLfH7'), // Dịch vụ bảo hiểm.png
} as const;

export const DRIVE_AVATARS = {
  hungThai: driveImageUrl('1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm'), // Avata Hùng Thái.gif
  aiAssistant: driveImageUrl('1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ'), // Avata AI hỗ trợ.gif
} as const;

export const DRIVE_MEMORIES = {
  v247: [
    driveImageUrl('1DgWVcyCEnDi770McVZhhwyDBV1LhRl8X'), // V247-1.jpg
    driveImageUrl('12bQvnk4LruhQTpHCmawl4TmBRYt7mRRi'), // V247-2.jpg
    driveImageUrl('1ZitvrUOcnC_1gAuKR1x7tTPzczvNJwZO'), // V247-3.jpg
    driveImageUrl('1OCv0D3cntyUkwik6zayW2VtBd1b82pAy'), // V247-4.jpg
    driveImageUrl('1Q3h9s042LZvCA20ScaF34R3325ok7-vd'), // V247-5.jpg
  ],
  mobifone: [
    driveImageUrl('1tCS7CfQ0JcW15zBrsPvRNXeutRiny9KP'), // Mobifone-1.webp
    driveImageUrl('1QyleM8ZFzrg-mSWnhAA3PxnNJC164niD'), // Mobifone-2.webp
    driveImageUrl('1DW6FHQ0YNpNyzqeIKwq06cKO3939jlo0'), // Mobifone-3.webp
  ],
  htvc: [
    driveImageUrl('1aJ3oF39pQZTyt2trGNJn26Dq-ZGxStdF'), // HTVC-1.webp
    driveImageUrl('15p8jeRF48fTCTlIT8uUck8tA1PEWiX49'), // HTVC-2.webp
    driveImageUrl('1P5FDRXckIB-DlPFb8YFPdIdePwH_vh68'), // HTVC-3.webp
    driveImageUrl('1MPAZevjTFhCRsLWCg8ie58DCm9pXlgI_'), // HTVC-4.webp
  ],
  ved: [
    driveImageUrl('1-dntd-9-OIRl48Q69EqxCmlQqWOw9jjp'), // VED-1.webp
    driveImageUrl('1a7Vx6M6o2gRtJ6dROnf9MkXRXv0MxOTN'), // VED-2.webp
    driveImageUrl('1UbpO4tv3ZC1RlqImsBN6r4fbatnt72Wz'), // VED-3.webp
    driveImageUrl('1JzUv9dEwODdrNnQBEnbyMTxCHNK8nX-A'), // VED-4.webp
  ],
  prudential: [
    driveImageUrl('1x4T_zVMRY-cs6LVIS-DuAhP5d1XM22ls'), // Prudential-1.webp
    driveImageUrl('1A6In5vjzz4TsflkY6RjliUM8N-bw2Xmq'), // Prudential-2.webp
    driveImageUrl('1IBaxp_w-Ut5QRoEtVTC8P6ezfHnBKGnt'), // Prudential-3.webp
    driveImageUrl('1rKF9o9hXjb5up9FtyBgXGb5DAj75_FPe'), // Prudential-4.webp
    driveImageUrl('1wxGydK0Jya1bRlRHaHITJb7jOHvFHFdS'), // Prudential-5.webp
    driveImageUrl('1E5H3FsifSeBqdfJCSaDsoauYvLhui2ih'), // Prudential-6.webp
    driveImageUrl('1g5UeRleGEUvLPRzq0Fiwhs5kTiLokdLd'), // Prudential-7.webp
  ],
  momo: [
    driveImageUrl('16Jo1hAgKSu8iJWXiNvtcZd3ggCt4g1W_'), // Momo-1.webp
    driveImageUrl('1x3Apf8QhM689R83XJ6ilZYFlbQX61iQW'), // Momo-2.webp
    driveImageUrl('1DFVr5IkvCYbzYwFom5toqdVZdb5QujXh'), // Momo-3.webp
    driveImageUrl('1RWXEKRF98INSezWUs_YfjjD7npaPK-qJ'), // Momo-4.webp
    driveImageUrl('1OnxiZPdc2rdjuNObKynyDtfudJpVpRaW'), // Momo-5.webp
    driveImageUrl('1cFC6p0gNRJoicoMRnj2g0d1HLHaFaXFu'), // Momo-6.webp
    driveImageUrl('12EJR5oNKQKj_Omr0abNezJroPBAWCqKA'), // Momo-7.webp
    driveImageUrl('1Kyr1j4IByCtO7i0VFiXAwDp6m-uxW1Hh'), // Momo-8.webp
  ],
  finviet: [
    driveImageUrl('1uNayd52pUhAqXWTfYbyQInY25zD4Tg4a'), // Finviet-1.webp
  ],
} as const;

export const DRIVE_PROJECT_BANNERS = {
  '1.1': driveImageUrl('1idi7Ljxt3SlD8io3yIXN823qkCjmxQGv'),
  '1.2': driveImageUrl('1gxj_0izu0yQSuZXlEBFrDCHK75Zqykx0'),
  '1.3': driveImageUrl('1e0Oo1yNKQWJgCxIZfqpAnbZ-wHV3Xa2c'),
  '1.4': driveImageUrl('1HU4eNMMrhZLw5f82EghLztUXiOC3BNcy'),
  '1.5': driveImageUrl('19vlcJ_sRkh-H9wWn3zsMnSMsyJoBu1Il'),
  '1.6': driveImageUrl('1QQJWbw4Ysw8_Xj3Zo5pIOli3YqtigX5r'),
  '2.1': driveImageUrl('192THDLvQaHtJVFAT2GYxfirfbX-w7Gfs'),
  '2.2': driveImageUrl('1oj9ml7FNZl21Ye5qY_cnUuQ-SGeElo0y'),
  '2.3': driveImageUrl('1RqBnHWXVpj8fseeSmlnRvlv8dGpgM55y'),
  '2.4': driveImageUrl('1Wo1g3ht16kZKovN8OBXUL3CJ-BbXNOYj'),
  '2.5': driveImageUrl('1PFmwHDS4Lu-yKxunts6xp9PShxgcWiNW'),
  '3.1': driveImageUrl('1s0iJoRD2_9_9DbrgAmIM7lY2qxgk63GO'),
  '3.2': driveImageUrl('1ilPz9Y8JeMtuPAtRif0De8DIaIWqFlsA'),
  '3.3': driveImageUrl('1omxermozpnwDRahy8yHDpBJ0yrPpK8PJ'),
  '3.4': driveImageUrl('1ykTpxRrgnhGOUBDAv7f-_tEzoaJm2AZJ'),
  '4.1': driveImageUrl('1_ywo-wgWjADotWPTREb3yswj6qSC0j-B'),
  '4.2': driveImageUrl('1TThpm_UUhxsWzM7N1jhSNMHIgTg-KBAH'),
  '5.1': driveImageUrl('1FpTtnORo5RZtBmaY21YxF_bdm-MyEqTI'),
  '6.1': driveImageUrl('18KRBnFWPc9oPbiv2fUxKpEcpmodZACDM'),
  '6.2': driveImageUrl('1SQecc8riLUTRwdd6wv_Mr7OpmFeaTKMB'),
  '6.3': driveImageUrl('1DjS312PhAPMEdwptdhToDo-946vow9dP'),
} as const;

export const DRIVE_EDUCATION_BANNERS = {
  webDesign: driveImageUrl('1Ln25-tPm-HgA_rBlfVIJfrw3qPCI_h7p'), // Thiết kế website.png
  dataAnalysis: driveImageUrl('1_Y7ZKywau6Gnj8riTsYnN6eP-J95sEqM'), // Phân tích dữ liệu.png
  seniorMgmt: driveImageUrl('1S4Zjbvc5I9-CweSC0uG9wfyuFK6_E23v'), // Quản lý cấp cao.png
  riskMgmt: driveImageUrl('1bd7HOaRJi5LI-9vNNYMRvzFGfzlg_3Vv'), // Quan lý rui ro.png
  projectMgmt: driveImageUrl('1cJI_fElnQtlMghz_J0tChzzgxmUoXGWJ'), // Quản lý dự án.png
  middleMgmt: driveImageUrl('12zw9joYktTse1gx_IHtZMsVzYAGXDAxu'), // Quản lý cấp trung.png
  training: driveImageUrl('1y71nbmxwE-Sp_eNnvf3YyoCsUUrWwDQb'), // Đào tạo.png
  presentation: driveImageUrl('1iBwxHGSei5P8O9jUkY71oCEzLofJv4Kb'), // Thuyết trình.png
  interview: driveImageUrl('1r_6zEKN6G0lnG6AwVvOd2m0RwTf30XOO'), // Phỏng vấn.png
  recruitment: driveImageUrl('180WJFqcuq5Qk19XqbzEnIfa-pfBL6M5r'), // Tuyển dụng.png
  itBachelor: driveImageUrl('1XzUpOgdR62UyIHBDjvp5YrsLMqSSTkhV'), // Cử nhân CNTT.png
  mcsa: driveImageUrl('1rGdH6SH173jDC57cDOzc3AiLg5TGAX2S'), // MCSA.png
  ccna: driveImageUrl('16nznDnT7x4W3fdjuJiIENKtkfhQVSIKr'), // CCNA.png
  mobifoneAgent: driveImageUrl('1kZI5SLvvotudF4CgmsJyX-fPTwdDF3Bc'), // Tổng đài viên Mobifone.png
} as const;

export const DRIVE_ABOUT_VIDEOS = {
  idle: driveVideoUrl('1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5'), // Man hình chờ Gioi thieu.mp4
  intro: driveVideoUrl('12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R'), // Giới thiệu vui nhộn.mp4
} as const;

export const DRIVE_SYSTEM_MEDIA = {
  aiAssistant: {
    image: driveImageUrl('1KYjQYOTnsbDqiQ2T8Gm5F7Mra_eRH2ln'),
    video: driveVideoUrl('179Ba81_6ykQAMjp1ogyaolfPIhyz32kk'),
  },
  biDashboard: {
    image: driveImageUrl('10EuOHcVkQ8iuDovIVCZCLf1S0iS_4O_L'),
    video: driveVideoUrl('1JmFAmjRUqwNdknEfy4oonMDPodj64TdW'),
  },
  bpm: {
    image: driveImageUrl('1UGN6bAdd_B5gkn56rl9ymm3C61VESuLd'),
    video: driveVideoUrl('1-e9vmijUSHcSPN-oNORtJNQw5lHICGGD'),
  },
  clp: {
    image: driveImageUrl('1fOKwCICmG8PCy6EYoNkG64C5nQUsShyT'),
    video: driveVideoUrl('1dvllOsJN5SBN1SeR2r6QUunJFzkdLSuO'),
  },
  crm: {
    image: driveImageUrl('13Dtp99V1A4HXoChWsZEp9UK-TGsEKDxy'),
    video: driveVideoUrl('1k7n3D4HotTBkh-34wRQRU6MYad6IHbsH'),
  },
  csc: {
    image: driveImageUrl('1r0Pl_hzX7DILkQyIj9Fv0kNuoja1x9lS'),
    video: driveVideoUrl('1fcBeTT6Fao9y_Mzfkb3bU3w0tb_kacKf'),
  },
  erp: {
    image: driveImageUrl('17pVP6aKtDX3Czvox2qmtoJ3aamgYWah6'),
    video: driveVideoUrl('1yxonN-6inK6xMiRRsJEiE-WgSCaWRssV'),
  },
  hrm: {
    image: driveImageUrl('1xpG5XkjxgYeV1OK1-u82x3PmH7A-Y69k'),
    video: driveVideoUrl('1NQ3i1GT3qB8_bQ-TUoCax6fs8m1noLqY'),
  },
  lms: {
    image: driveImageUrl('1nlAazLnCH8_fYSXns1gX0tJpDbnXYPrL'),
    video: driveVideoUrl('1eF17zSBBDouSURRjL57rUon_tvlycPsi'),
  },
  office: {
    image: driveImageUrl('1wlrI7XtZ-phAJbghkXEeUfY6G6hEGNGW'),
    video: driveVideoUrl('1VYVxFPSyVZlH8yRBpXFeWiBrkq_lDPdB'),
  },
  okr: {
    image: driveImageUrl('11HTbjVNXWn_Q9l79qZVXneM0RJhqn_U8'),
    video: driveVideoUrl('1Ma_e0nYubC0zWdwV3vuiFgKJlDi54BfJ'),
  },
  pos: {
    image: driveImageUrl('1IKzIg6pkzYQhqIu0eumxYctIkZvYm6vq'),
    video: driveVideoUrl('1u2LeXzU83AIf_qMsOM6sYVP7xjzQ9Yr9'),
  },
  sdp: {
    image: driveImageUrl('1_zCMxIls3Se9t1z6Ydpdqi0ghcRZDa_a'),
    video: driveVideoUrl('1i3aEPWdyRSoOQCy3zIv5r7w4MjL2bpcH'),
  },
} as const;

export const DRIVE_EXPERIENCE_BANNERS = {
  mobifone: driveImageUrl('1azpkD4Ad6OUJp7citmcgcNs7s6QQC2Pg'), // Mobifone.png
  v247: driveImageUrl('13tTPp7aC0DG6EaDkiM88Ww0fJh7BKIeZ'), // v247.png
  lbc: driveImageUrl('1Wz0QIetqBztZyicB64DeTUkBnI8VL5oz'), // LBC.png
  ved: driveImageUrl('1WT9e-MjtmVI6Bh08N3WHkcuRS6t4DCt-'), // VED.png
  prudential: driveImageUrl('1lNVdky6MGEQQoEVQKh8XvuMuj5P2E73E'), // Prudentinal.png
  momo: driveImageUrl('1V5zSWnvUgDCRrRms6kEx5CcTEGaqqjyf'), // Momo.png
  finviet: driveImageUrl('1voNgAImCZt9-3Vv7wvYT3w2ERcivkKe7'), // Finviet.png
  opportunity: driveImageUrl('158wilsTkcBzQ76BwuwOXnw_KahKuPHSD'), // Tìm Cơ hội.png
} as const;
