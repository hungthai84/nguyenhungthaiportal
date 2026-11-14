export interface TabItem {
  id: number;
  name: string;
  color: string;
  textColor: string;
  icon: string;
  quote: string;
  data: any | null;
}

export interface NeonColorData {
  neon: string;
  glow: string;
}

export const TABS_DATA: TabItem[] = [
  { id: 0, name: "Trang chủ", color: "#FFDF25", textColor: "#713f12", icon: "fa-house-chimney", quote: "Khởi đầu mọi hành trình với sự tận tâm và khát vọng", data: null },
  { id: 1, name: "Thư Ngỏ", color: "#EC7D21", textColor: "#ffffff", icon: "fa-envelope-open-text", quote: "Sự chân thành là cầu nối bền chặt nhất", data: { type: 'letter' } },
  { id: 2, name: "Giới thiệu", color: "#E64C72", textColor: "#ffffff", icon: "user-round", quote: "Con người là tài sản quý giá nhất của tổ chức", data: { type: 'about' } },
  { id: 3, name: "Học vấn", color: "#1480C0", textColor: "#ffffff", icon: "fa-graduation-cap", quote: "Tri thức mở đường, tư duy định hình tương lai ♡", data: { type: 'education' } },
  { id: 4, name: "Dịch vụ", color: "#0D9488", textColor: "#ffffff", icon: "fa-hand-holding-heart", quote: "Giải pháp dịch vụ chuyên sâu kiến tạo trải nghiệm vượt trội ♡", data: { type: 'services' } },
  { id: 5, name: "Kinh nghiệm", color: "#3BB8E6", textColor: "#ffffff", icon: "fa-business-time", quote: "Tận tâm phụng sự, dẫn dắt bằng kết quả ♡", data: { type: 'experience' } },
  { id: 6, name: "Kỹ năng", color: "#6353B5", textColor: "#ffffff", icon: "fa-brain", quote: "Kỹ năng là nền tảng nâng tầm dịch vụ ♡", data: { type: 'skills' } },
  { id: 7, name: "Dự án", color: "#5DC3C8", textColor: "#ffffff", icon: "fa-diagram-project", quote: "Mỗi sản phẩm là một minh chứng của tâm huyết", data: null },
  { id: 8, name: "Hệ thống", color: "#2563EB", textColor: "#ffffff", icon: "fa-server", quote: "Chuẩn hóa vận hành thông minh và hiệu quả", data: { type: 'systems' } },
  { id: 9, name: "Phỏng vấn", color: "#A3D43A", textColor: "#1e293b", icon: "fa-microphone-lines", quote: "Giao lưu cởi mở để thấu hiểu và sẻ chia", data: null },
  { id: 10, name: "Tử vi", color: "#F05A36", textColor: "#ffffff", icon: "fa-compass", quote: "Thuận theo tự nhiên để tâm an trí sáng", data: null },
  { id: 11, name: "Kỷ niệm", color: "#A78BFA", textColor: "#ffffff", icon: "fa-camera-retro", quote: "Lưu giữ những khoảnh khắc đáng nhớ trong từng hành trình", data: null },
  { id: 12, name: "Liên hệ", color: "#1E266D", textColor: "#ffffff", icon: "fa-address-book", quote: "Luôn luôn sẵn sàng lắng nghe và kết nối", data: null },
  { id: 13, name: "AI Hỗ Trợ", color: "#A855F7", textColor: "#ffffff", icon: "fa-robot", quote: "Trợ lý AI thông minh đồng hành giải đáp mọi thắc mắc 24/7", data: null },
  { id: 14, name: "Hình nền", color: "#EC4899", textColor: "#ffffff", icon: "fa-image", quote: "Không gian trực quan mang đậm dấu ấn cá nhân ♡", data: { type: 'wallpaper' } },
  { id: 15, name: "Giao diện", color: "#6366F1", textColor: "#ffffff", icon: "fa-palette", quote: "Tùy chỉnh phong cách hiển thị theo sở thích ♡", data: { type: 'interface' } },
  { id: 16, name: "Tải PDF", color: "#2563EB", textColor: "#ffffff", icon: "fa-file-text", quote: "Hồ sơ năng lực và kinh nghiệm công tác bản chuẩn PDF ♡", data: { type: 'pdf' } }
];

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
  13: { neon: '#A855F7', glow: 'rgba(168, 85, 247, 0.75)' },
  14: { neon: '#EC4899', glow: 'rgba(236, 72, 153, 0.75)' },
  15: { neon: '#6366F1', glow: 'rgba(99, 102, 241, 0.75)' },
  16: { neon: '#2563EB', glow: 'rgba(37, 99, 235, 0.75)' }
};
