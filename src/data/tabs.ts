export interface TabItem {
  id: number;
  name: string;
  nameEn?: string;
  shortTitle?: string;
  shortTitleEn?: string;
  color: string;
  textColor: string;
  icon: string;
  quote: string;
  quoteEn?: string;
  data: any | null;
}

export interface NeonColorData {
  neon: string;
  glow: string;
}

export const TABS_DATA: TabItem[] = [
  { id: 0, name: "Trang chủ", nameEn: "Home", shortTitleEn: "Home", color: "#FFDF25", textColor: "#713f12", icon: "fa-house-chimney", quote: "Khởi đầu mọi hành trình với sự tận tâm và khát vọng", quoteEn: "Every journey begins with dedication and aspiration", data: null },
  { id: 1, name: "Thư Ngỏ", nameEn: "Letter", shortTitleEn: "Letter", color: "#EC7D21", textColor: "#ffffff", icon: "fa-envelope-open-text", quote: "Sự chân thành là cầu nối bền chặt nhất", quoteEn: "Sincerity is the strongest bridge between people", data: { type: 'letter' } },
  { id: 2, name: "Giới thiệu", nameEn: "About", shortTitleEn: "About", color: "#E64C72", textColor: "#ffffff", icon: "user-round", quote: "Con người là tài sản quý giá nhất của tổ chức", quoteEn: "People are the most valuable asset of any organization", data: { type: 'about' } },
  { id: 3, name: "Học vấn", nameEn: "Education", shortTitleEn: "Education", color: "#1480C0", textColor: "#ffffff", icon: "fa-graduation-cap", quote: "Tri thức mở đường, tư duy định hình tương lai ♡", quoteEn: "Knowledge opens the path; mindset shapes the future ♡", data: { type: 'education' } },
  { id: 4, name: "Dịch vụ", nameEn: "Services", shortTitleEn: "Services", color: "#0D9488", textColor: "#ffffff", icon: "fa-hand-holding-heart", quote: "Giải pháp dịch vụ chuyên sâu kiến tạo trải nghiệm vượt trội ♡", quoteEn: "Specialized service solutions creating exceptional experiences ♡", data: { type: 'services' } },
  { id: 5, name: "Kinh nghiệm", nameEn: "Experience", shortTitleEn: "Experience", color: "#3BB8E6", textColor: "#ffffff", icon: "fa-business-time", quote: "Tận tâm phụng sự, dẫn dắt bằng kết quả ♡", quoteEn: "Dedicated to service, leading by measurable results ♡", data: { type: 'experience' } },
  { id: 6, name: "Kỹ năng", nameEn: "Skills", shortTitleEn: "Skills", color: "#6353B5", textColor: "#ffffff", icon: "fa-brain", quote: "Kỹ năng là nền tảng nâng tầm dịch vụ ♡", quoteEn: "Skills are the foundation that elevates service excellence ♡", data: { type: 'skills' } },
  { id: 7, name: "Dự án", nameEn: "Projects", shortTitleEn: "Projects", color: "#5DC3C8", textColor: "#ffffff", icon: "fa-diagram-project", quote: "Mỗi sản phẩm là một minh chứng của tâm huyết", quoteEn: "Every deliverable is a testament to passion and craftsmanship", data: null },
  { id: 8, name: "Hệ thống", nameEn: "Systems", shortTitleEn: "Systems", color: "#2563EB", textColor: "#ffffff", icon: "fa-server", quote: "Chuẩn hóa vận hành thông minh và hiệu quả", quoteEn: "Standardizing intelligent and high-efficiency operations", data: { type: 'systems' } },
  { id: 9, name: "Phỏng vấn", nameEn: "Interview", shortTitleEn: "Interview", color: "#A3D43A", textColor: "#1e293b", icon: "fa-microphone-lines", quote: "Giao lưu cởi mở để thấu hiểu và sẻ chia", quoteEn: "Open dialogue for mutual understanding and shared insight", data: null },
  { id: 10, name: "Tử vi", nameEn: "Horoscope", shortTitleEn: "Horoscope", color: "#F05A36", textColor: "#ffffff", icon: "fa-compass", quote: "Thuận theo tự nhiên để tâm an trí sáng", quoteEn: "Flow with nature to keep the mind serene and the vision clear", data: null },
  { id: 11, name: "Kỷ niệm", nameEn: "Memories", shortTitleEn: "Memories", color: "#A78BFA", textColor: "#ffffff", icon: "fa-camera-retro", quote: "Lưu giữ những khoảnh khắc đáng nhớ trong từng hành trình", quoteEn: "Preserving memorable milestones across every journey", data: null },
  { id: 12, name: "Liên hệ", nameEn: "Contact", shortTitleEn: "Contact", color: "#1E266D", textColor: "#ffffff", icon: "fa-address-book", quote: "Luôn luôn sẵn sàng lắng nghe và kết nối", quoteEn: "Always ready to listen and connect", data: null },
  { id: 13, name: "AI Hỗ Trợ", nameEn: "AI Support", shortTitleEn: "AI Support", color: "#0EA5E9", textColor: "#ffffff", icon: "fa-robot", quote: "Trợ lý AI thông minh đồng hành giải đáp mọi thắc mắc 24/7", quoteEn: "Smart AI assistant answering your questions 24/7", data: null },
  { id: 14, name: "Hình nền", nameEn: "Wallpaper", shortTitleEn: "Wallpaper", color: "#EC4899", textColor: "#ffffff", icon: "fa-image", quote: "Không gian trực quan mang đậm dấu ấn cá nhân ♡", quoteEn: "Visual space tailored with your personal signature ♡", data: { type: 'wallpaper' } },
  { id: 15, name: "Giao diện", nameEn: "Interface", shortTitleEn: "Interface", color: "#6366F1", textColor: "#ffffff", icon: "fa-palette", quote: "Tùy chỉnh phong cách hiển thị theo sở thích ♡", quoteEn: "Customize the display theme to match your preference ♡", data: { type: 'interface' } },
  { id: 16, name: "Tải PDF", nameEn: "Download PDF", shortTitleEn: "PDF CV", color: "#2563EB", textColor: "#ffffff", icon: "fa-file-text", quote: "Hồ sơ năng lực và kinh nghiệm công tác bản chuẩn PDF ♡", quoteEn: "Official executive profile & career dossier in PDF format ♡", data: { type: 'pdf' } }
];

// Thứ tự chính xác các trang trên thanh Menu Icon (Header): Trang chủ (0) -> ... -> Kỷ niệm (11) -> Tải PDF (16) -> Liên hệ (12)
export const MENU_ICON_PAGE_ORDER: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 12];

export const PAGE_NEON_COLORS: Record<number, NeonColorData> = {
  0: { neon: '#FFDF25', glow: 'rgba(255, 223, 37, 0.75)' },
  1: { neon: '#EC7D21', glow: 'rgba(236, 125, 33, 0.75)' },
  2: { neon: '#E64C72', glow: 'rgba(230, 76, 114, 0.75)' },
  3: { neon: '#1480C0', glow: 'rgba(20, 128, 192, 0.75)' },
  4: { neon: '#0D9488', glow: 'rgba(13, 148, 136, 0.75)' },
  5: { neon: '#3BB8E6', glow: 'rgba(59, 184, 230, 0.75)' },
  6: { neon: '#6353B5', glow: 'rgba(99, 83, 181, 0.75)' },
  7: { neon: '#5DC3C8', glow: 'rgba(93, 195, 200, 0.75)' },
  8: { neon: '#2563EB', glow: 'rgba(37, 99, 235, 0.75)' },
  9: { neon: '#A3D43A', glow: 'rgba(163, 212, 58, 0.75)' },
  10: { neon: '#F05A36', glow: 'rgba(240, 90, 54, 0.75)' },
  11: { neon: '#A78BFA', glow: 'rgba(167, 139, 250, 0.75)' },
  12: { neon: '#1E266D', glow: 'rgba(30, 38, 109, 0.75)' },
  13: { neon: '#0EA5E9', glow: 'rgba(14, 165, 233, 0.75)' },
  14: { neon: '#EC4899', glow: 'rgba(236, 72, 153, 0.75)' },
  15: { neon: '#6366F1', glow: 'rgba(99, 102, 241, 0.75)' },
  16: { neon: '#2563EB', glow: 'rgba(37, 99, 235, 0.75)' }
};
