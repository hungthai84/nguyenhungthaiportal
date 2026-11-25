import type { ProjectData } from '@/types';

/**
 * Bộ ánh xạ Hình Dự Án theo Cloudinary folder "Dự án / Banner card"
 * Dựa vào tên hình / tên dự án để lấy đúng Banner thẻ cho toàn bộ 20 dự án
 */
export const CLOUDINARY_PROJECT_BANNER_FOLDER =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/D%E1%BB%B1%20%C3%A1n/Banner%20card';

export interface ProjectCloudinaryBannerEntry {
  projectId: string;
  code: string;
  imageName: string;
  folderUrl: string;
  verifiedDirectUrl: string;
}

export const CLOUDINARY_PROJECT_BANNER_BY_NAME: ProjectCloudinaryBannerEntry[] = [
  {
    projectId: 'p1_1',
    code: '1.1',
    imageName: '1.1._Xây_dựng_Phòng_Dịch_vụ_Khách_hàng.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.1._X%C3%A2y_d%E1%BB%B1ng_Ph%C3%B2ng_D%E1%BB%8Bch_v%E1%BB%A5_Kh%C3%A1ch_h%C3%A0ng.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/LXdY8nrR/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.png',
  },
  {
    projectId: 'p1_2',
    code: '1.2',
    imageName: '1.2._Thiết_lập_mục_tiêu_phòng_ban.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.2._Thi%E1%BA%BFt_l%E1%BA%ADp_m%E1%BB%A5c_ti%C3%AAu_ph%C3%B2ng_ban.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/pTNhLpgM/1-2-Thiet-lap-muc-tieu-phong-ban.png',
  },
  {
    projectId: 'p2_1',
    code: '2.1',
    imageName: '2.1._Chuẩn_hóa_quy_trình_CSKH.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/2.1._Chu%E1%BA%A9n_h%C3%B3a_quy_tr%C3%ACnh_CSKH.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/9MG4Rchd/2-1-Chuan-hoa-quy-trinh-CSKH.png',
  },
  {
    projectId: 'p2_2',
    code: '2.2',
    imageName: '2.2._Tối_ưu_hóa_kênh_hỗ_trợ.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/2.2._T%E1%BB%91i_%C6%B0u_h%C3%B3a_k%C3%AAnh_h%E1%BB%97_tr%E1%BB%A3.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/SsWX2mhd/2-2-Toi-uu-hoa-kenh-ho-tro.png',
  },
  {
    projectId: 'p2_3',
    code: '2.3',
    imageName: '2.3._Triển_khai_tự_động_hóa_2.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/2.3._Tri%E1%BB%83n_khai_t%E1%BB%B1_%C4%91%E1%BB%99ng_h%C3%B3a_2.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/kGq2WLJN/2-3-Trien-khai-tu-dong-hoa-(2).png',
  },
  {
    projectId: 'p2_4',
    code: '2.4',
    imageName: '2.4._Quản_lý_chiến_dịch_Outbound.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/2.4._Qu%E1%BA%A3n_l%C3%BD_chi%E1%BA%BFn_d%E1%BB%8Bch_Outbound.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/QChFcv8m/2-4-Quan-ly-chien-dich-Outbound.png',
  },
  {
    projectId: 'p3_1',
    code: '3.1',
    imageName: '1.3._Nâng_cao_trải_nghiệm_khách_hàng.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.3._N%C3%A2ng_cao_tr%E1%BA%A3i_nghi%E1%BB%87m_kh%C3%A1ch_h%C3%A0ng.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/B6WLnXdJ/1-3-Nang-cao-trai-nghiem-khach-hang.png',
  },
  {
    projectId: 'p3_2',
    code: '3.2',
    imageName: '1.4._Quản_lý_dự_án_CSKH.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.4._Qu%E1%BA%A3n_l%C3%BD_d%E1%BB%B1_%C3%A1n_CSKH.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/tT0Z4YLp/1-4-Quan-ly-du-an-CSKH.png',
  },
  {
    projectId: 'p3_3',
    code: '3.3',
    imageName: '1.5._Thúc_đẩy_cải_tiến_sản_phẩm.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.5._Th%C3%BAc_%C4%91%E1%BA%A9y_c%E1%BA%A3i_ti%E1%BA%BFn_s%E1%BA%A3n_ph%E1%BA%A9m.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/B6x8LJ0K/1-5-Thuc-day-cai-tien-san-pham.png',
  },
  {
    projectId: 'p3_4',
    code: '3.4',
    imageName: '1.6_Quản_lý_khủng_hoảng_và_giảm_khách_hàng_rời_bỏ.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/1.6_Qu%E1%BA%A3n_l%C3%BD_kh%E1%BB%A7ng_ho%E1%BA%A3ng_v%C3%A0_gi%E1%BA%A3m_kh%C3%A1ch_h%C3%A0ng_r%E1%BB%9Di_b%E1%BB%8F.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/HxQJcTgX/1-6-Quan-ly-khung-hoang-va-giam-khach-hang-roi-bo.png',
  },
  {
    projectId: 'p4_1',
    code: '4.1',
    imageName: '3.1._Xây_dựng_hệ_thống_CRM.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/3.1._X%C3%A2y_d%E1%BB%B1ng_h%E1%BB%87_th%E1%BB%91ng_CRM.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/SRkncHST/3-1-Xay-dung-he-thong-CRM.png',
  },
  {
    projectId: 'p4_2',
    code: '4.2',
    imageName: '3.2._Phân_tích_Báo_cáo.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/3.2._Ph%C3%A2n_t%C3%ADch_B%C3%A1o_c%C3%A1o.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/rsMD57V7/3-2-Phan-tich-Bao-cao.png',
  },
  {
    projectId: 'p4_3',
    code: '4.3',
    imageName: '3.3._Khảo_sát_Đánh_giá_khách_hàng.jpg',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/3.3._Kh%E1%BA%A3o_s%C3%A1t_%C4%90%C3%A1nh_gi%C3%A1_kh%C3%A1ch_h%C3%A0ng.jpg`,
    verifiedDirectUrl:
      'https://i.postimg.cc/vTb45CYK/3-3-Khao-sat-Danh-gia-khach-hang.jpg',
  },
  {
    projectId: 'p4_4',
    code: '4.4',
    imageName: '3.4._Xây_dựng_AI_Bot.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/3.4._X%C3%A2y_d%E1%BB%B1ng_AI_Bot.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/2yr1ngks/3-4-Xay-dung-AI-Bot.png',
  },
  {
    projectId: 'p5_1',
    code: '5.1',
    imageName: '4.1._Phát_triển_đào_tạo_trực_tuyến.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/4.1._Ph%C3%A1t_tri%E1%BB%83n_%C4%91%C3%A0o_t%E1%BA%A1o_tr%E1%BB%B1c_tuy%E1%BA%BFn.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/5ybX8D9d/4-1-Phat-trien-dao-tao-truc-tuyen.png',
  },
  {
    projectId: 'p5_2',
    code: '5.2',
    imageName: '4.2_Xây_dựng_khung_năng_lực_và_lộ_trình_phát_triển.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/4.2_X%C3%A2y_d%E1%BB%B1ng_khung_n%C4%83ng_l%E1%BB%B1c_v%C3%A0_l%E1%BB%99_tr%C3%ACnh_ph%C3%A1t_tri%E1%BB%83n.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/cChrhTCp/4-2-Xay-dung-khung-nang-luc-va-lo-trinh-phat-trien.png',
  },
  {
    projectId: 'p5_3',
    code: '5.3',
    imageName: '5.1._Thành_lập_trung_tâm_hỗ_trợ.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/5.1._Th%C3%A0nh_l%E1%BA%ADp_trung_t%C3%A2m_h%E1%BB%97_tr%E1%BB%A3.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/tJkYkDJ8/5-1-Thanh-lap-trung-tam-ho-tro.png',
  },
  {
    projectId: 'p5_4',
    code: '5.4',
    imageName: '6.1._Khách_hàng_là_trung_tâm.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/6.1._Kh%C3%A1ch_h%C3%A0ng_l%C3%A0_trung_t%C3%A2m.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/gjsns4rm/6-1-Khach-hang-la-trung-tam.png',
  },
  {
    projectId: 'p5_5',
    code: '5.5',
    imageName: '6.2_Quản_trị_sự_thay_đổi_và_khủng_hoảng_dịch_vụ.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/6.2_Qu%E1%BA%A3n_tr%E1%BB%8B_s%E1%BB%B1_thay_%C4%91%E1%BB%95i_v%C3%A0_kh%E1%BB%A7ng_ho%E1%BA%A3ng_d%E1%BB%8Bch_v%E1%BB%A5.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/SRdJdVjh/6-2-Quan-tri-su-thay-doi-va-khung-hoang-dich-vu.png',
  },
  {
    projectId: 'p5_6',
    code: '5.6',
    imageName: '6.3_Ứng_dụng_trí_tuệ_nhân_tạo_nâng_cao_hiệu_suất_CSKH.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/6.3_%E1%BB%A8ng_d%E1%BB%A5ng_tr%C3%AD_tu%E1%BB%87_nh%C3%A2n_t%E1%BA%A1o_n%C3%A2ng_cao_hi%E1%BB%87u_su%E1%BA%A5t_CSKH.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/yxjkjnW6/6-3-Ung-dung-tri-tue-nhan-tao-nang-cao-hieu-suat-CSKH.png',
  },
  {
    projectId: 'p2_5',
    code: '2.5',
    imageName: '2.5_Quản_lý_đối_tác_thuê_ngoài_chăm_sóc_khách_hàng.png',
    folderUrl: `${CLOUDINARY_PROJECT_BANNER_FOLDER}/2.5_Qu%E1%BA%A3n_l%C3%BD_%C4%91%E1%BB%91i_t%C3%A1c_thu%C3%AA_ngo%C3%A0i_ch%C4%83m_s%C3%B3c_kh%C3%A1ch_h%C3%A0ng.png`,
    verifiedDirectUrl:
      'https://i.postimg.cc/90CDysmL/2-5-Quan-ly-doi-tac-thue-ngoai-cham-soc-khach-hang.png',
  },
];

export function getProjectCloudinaryBanner(proj: ProjectData): {
  primaryUrl: string;
  folderUrl: string;
  fallbackUrl: string;
  imageName: string;
} {
  const normTitle = proj.title.toLowerCase().replace(/[\s_.-]+/g, ' ');
  const matched =
    CLOUDINARY_PROJECT_BANNER_BY_NAME.find(
      (entry) => entry.projectId === proj.id || entry.code === proj.code
    ) ||
    CLOUDINARY_PROJECT_BANNER_BY_NAME.find((entry) => {
      const cleanName = entry.imageName
        .replace(/\.(png|jpg|jpeg|webp)$/i, '')
        .replace(/^[\d._\s]+/, '')
        .toLowerCase()
        .replace(/_/g, ' ');
      return cleanName && normTitle.includes(cleanName);
    });

  if (matched) {
    return {
      primaryUrl: matched.verifiedDirectUrl,
      folderUrl: matched.folderUrl,
      fallbackUrl: proj.mindmap || matched.verifiedDirectUrl,
      imageName: matched.imageName,
    };
  }

  const defaultFallback =
    'https://i.postimg.cc/LXdY8nrR/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.png';

  return {
    primaryUrl: proj.image || proj.mindmap || defaultFallback,
    folderUrl: proj.image || proj.mindmap || defaultFallback,
    fallbackUrl: proj.mindmap || proj.image || defaultFallback,
    imageName: `${proj.code}_${proj.title}.png`,
  };
}
