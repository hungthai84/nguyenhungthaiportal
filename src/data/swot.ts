export interface SwotItem {
  label: string;
  percent: number;
  icon: string;
}

export interface SwotCategory {
  title: string;
  color: string;
  border: string;
  desc: string;
  items: SwotItem[];
}

export const SWOT_DATA: Record<string, SwotCategory> = {
  S: {
    title: 'Điểm Mạnh Vận Hành',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-400',
    desc: 'Những năng lực cốt lõi đã được chứng minh qua thực tiễn quản lý, vận hành và phát triển hệ thống Dịch vụ Khách hàng.',
    items: [
      { label: 'Xây dựng & Chuẩn hóa Quy trình SOP / SLA', percent: 98, icon: 'fa-file-lines' },
      { label: 'Quản trị Vận hành Contact Center Đa Kênh', percent: 96, icon: 'fa-headset' },
      { label: 'Đào tạo, Huấn luyện & Phát triển Nhân sự', percent: 94, icon: 'fa-chalkboard-user' },
      { label: 'Ứng dụng CRM, BI Dashboard & Tự động hóa', percent: 92, icon: 'fa-chart-pie' }
    ]
  },
  W: {
    title: 'Hoàn Thiện Quản Trị',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-orange-400',
    desc: 'Những khía cạnh cần liên tục hoàn thiện nhằm nâng tầm kỹ năng quản lý thực thi sang quản trị định hướng chiến lược.',
    items: [
      { label: 'Cập nhật sâu các mô hình AI Agents thế hệ mới', percent: 85, icon: 'fa-robot' },
      { label: 'Mở rộng ngôn ngữ thương mại quốc tế (TOEIC 750+)', percent: 82, icon: 'fa-globe' },
      { label: 'Chiến lược tài chính vĩ mô cho chuyển đổi số lớn', percent: 80, icon: 'fa-coins' }
    ]
  },
  O: {
    title: 'Cơ Hội Bứt Phá',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-400',
    desc: 'Những cơ hội đón đầu làn sóng số, chuyển đổi dịch vụ sang kênh thông minh và ứng dụng AI nâng cao hiệu năng.',
    items: [
      { label: 'Tích hợp Trợ lý ảo AI Voicebot & Chatbot 24/7', percent: 95, icon: 'fa-bolt' },
      { label: 'Chuyển đổi số toàn diện trung tâm hỗ trợ khách hàng', percent: 92, icon: 'fa-arrows-rotate' },
      { label: 'Nâng tầm trải nghiệm khách hàng thành tài sản số', percent: 90, icon: 'fa-crown' }
    ]
  },
  T: {
    title: 'Thách Thức Thích Ứng',
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-400',
    desc: 'Những thách thức khách quan từ môi trường kinh tế và thay đổi công nghệ đột phá tác động trực tiếp đến dịch vụ.',
    items: [
      { label: 'Tối ưu chi phí hiệu năng: Áp lực giảm chi phí vận hành nhưng phải duy trì hiệu năng cao', percent: 94, icon: 'fa-scale-balanced' },
      { label: 'Trí tuệ nhân tạo thay đổi: Tốc độ chuyển đổi AI nhanh đòi hỏi tái đào tạo nhân sự kịp thời', percent: 92, icon: 'fa-microchip' },
      { label: 'Công nghệ đổi mới thị trường: Sự xuất hiện liên tục của các công cụ số mới trên thị trường', percent: 90, icon: 'fa-bolt' },
      { label: 'Quản trị rủi ro vận hành: Rủi ro biến động nhân sự, an toàn thông tin và khủng hoảng CSKH', percent: 90, icon: 'fa-shield-exclamation' },
      { label: 'Cạnh tranh nguồn nhân lực cao: Tỷ lệ xoay dòng nhân sự ngành CSKH cao, đòi hỏi chính sách giữ chân tốt', percent: 88, icon: 'fa-users' },
      { label: 'Phối hợp công việc liên phòng: Xung đột điểm nghẽn quy trình giữa CSKH, Sản phẩm và Kinh doanh', percent: 86, icon: 'fa-network-wired' }
    ]
  }
};
