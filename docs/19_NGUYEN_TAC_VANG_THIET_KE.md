# 19 Nguyên Tắc Vàng Thiết Kế Website & Responsive Thích Ứng Theo Không Gian

## Phần I. Bộ 18 Nguyên Tắc Thiết Kế Nền Tảng

1. **Bảo Toàn 100% Dữ Liệu Gốc (Data Integrity):** Mọi nội dung văn bản, số liệu, tên công ty, chức danh, năm làm việc, liên kết và thông tin dự án được bảo toàn nguyên vẹn.
2. **Tách Bạch Dữ Liệu Khỏi Giao Diện (Data First):** Dữ liệu nằm tại tầng `/data`, component tại `/components`, kiểu tại `/styles` và cấu hình tại `/config`.
3. **Thống Nhất Hệ Thống Thiết Kế (Design System):** Sử dụng thống nhất hệ biến CSS Design Tokens cho màu sắc, bo góc, bóng đổ, chữ viết và khoảng cách.
4. **Phân Cấp Lớp Bề Mặt Rõ Ràng (Layered Surface Architecture):** Phân biệt rõ Lớp 1 (Header / Main Card / Footer), Lớp 2 (Thẻ nội dung chính / Bento Card), và Lớp 3 (Thẻ con / Sub-card).
5. **Thẻ Nội Dung Đầy Đủ Phân Cấp (Card Hierarchy):** Mỗi thẻ có biểu tượng ngữ nghĩa, tiêu đề rõ ràng, mô tả súc tích, chỉ số nổi bật, điểm nhấn thị giác và trạng thái tương tác.
6. **Hệ Chữ Dễ Đọc & Đầy Đủ Dấu Tiếng Việt (Typography):** Sử dụng font hiện đại, phân cấp rõ từ tiêu đề lớn đến nội dung chi tiết, không lạm dụng toàn bộ chữ viết hoa.
7. **Hệ Biểu Tượng Đồng Nhất (Icon Consistency):** Sử dụng vector icon nhất quán về nét và kích thước, gắn đúng ngữ nghĩa chức năng.
8. **Chuyển Động Tinh Tế Có Mục Đích (Motion With Purpose):** Thời lượng mặc định 180–300ms, mượt mà, không gây giật lag, tôn trọng `prefers-reduced-motion: reduce` và không làm chuyển động chữ hoặc số liệu.
9. **Vi Tương Tác Mạch Lạc (Micro-Interactions):** Phản hồi đầy đủ cho hover, focus-visible, active, loading, success và error.
10. **Khả Năng Tiếp Cận (Accessibility & WCAG AA):** Đảm bảo HTML ngữ nghĩa, thuộc tính ARIA chuẩn, điều hướng bàn phím, vòng focus rõ ràng và độ tương phản đạt chuẩn.
11. **Hiệu Năng Tối Ưu (Performance):** Tối ưu tải chậm hình ảnh/video, tránh render thừa, tận dụng GPU compositing cho hiệu ứng chuyển động.
12. **Kiến Trúc Component Tái Sử Dụng (Modular Components):** Chia nhỏ component dùng chung, tránh lặp code CSS hoặc trộn logic quá lớn.
13. **Mốc Thời Gian & Thẻ Kinh Nghiệm Rõ Ràng:** Trình bày rõ năm, công ty, chức danh, mô tả và tự động chuyển đổi giữa trình bày ngang và dọc.
14. **Trình Bày Kỹ Năng & Chỉ Số Minh Bạch:** Số liệu hiệu suất và điểm nhấn được làm nổi bật, đúng nhãn ngữ nghĩa, không gây hiểu nhầm.
15. **Đa Phương Tiện Tương Thích (Media Readiness):** Video, hình ảnh và thẻ dự án có tỷ lệ hợp lý, không méo, không vỡ khung và có ảnh dự phòng.
16. **Hệ Thống Đa Giao Diện Độc Lập (Multi-Theme Architecture):** Mỗi giao diện hoạt động qua bộ Token thống nhất, chuyển đổi đồng bộ từ nền đến nút bấm và hộp thoại.
17. **Đồng Bộ Chế Độ Sáng / Tối Hoàn Chỉnh:** Khi đổi Light/Dark, toàn bộ Header, Footer, Main Card, Sub-card, biểu tượng và popup cập nhật đồng nhất.
18. **Bền Vững & Dễ Bảo Trì:** Ưu tiên cập nhật ở lớp Token và component dùng chung, tránh xung đột CSS cục bộ.

---

## Phần II. Nguyên Tắc 19 — Responsive Thích Ứng Theo Không Gian (Space-Adaptive Responsive Design)

**Tuyên bố nguyên tắc:** Giao diện phải thích ứng với diện tích hiển thị thực tế, không phải chỉ thích ứng với tên thiết bị.

### Năm Yêu Cầu Cốt Lõi

1. **Màn hình rộng:** Tận dụng chiều ngang để trình bày thoáng đãng nhưng cân đối, không kéo giãn thẻ hay chữ mất tỷ lệ.
2. **Màn hình trung bình:** Chủ động tổ chức lại số cột, điều chỉnh kích thước thẻ, khoảng cách và padding khi không gian thu hẹp, ưu tiên khả năng đọc.
3. **Màn hình nhỏ:** Chuyển cấu trúc sang chiều dọc, ưu tiên nội dung trọng tâm, thẻ chiếm trọn chiều rộng khả dụng và tối ưu thao tác chạm.
4. **Toàn vẹn không gian hiển thị:** Không để nội dung bị ép, bị cắt, tràn viền, chồng lấn hay xuất hiện thanh cuộn ngang ngoài ý muốn.
5. **Bảo toàn nhận diện:** Giữ nguyên nhận diện màu sắc, phong cách Liquid Glass UI và 100% nội dung chức năng trên mọi kích thước hiển thị.

### Hệ Thống Responsive 4 Cấp Độ Tham Chiếu

1. **Large Desktop (từ 1600px trở lên):** Khung hiển thị mở rộng cân đối quanh ngưỡng chuẩn (`1250px–1440px`), bố cục đa cột thoáng, không tạo khoảng trống thừa.
2. **Desktop / Laptop (1200px–1599px):** Ưu tiên lưới 3 cột khi đủ diện tích (`@container main-card >= 1050px`), thanh điều hướng và thanh công cụ không chen chúc.
3. **Tablet (768px–1199px):** Tự động chuyển 3 cột xuống 2 cột (`@container main-card 600px–959px` và vùng chuyển tiếp `960px–1049px`), tiêu đề xuống dòng tự nhiên, tối ưu lề và khoảng cách.
4. **Mobile (dưới 768px):** Lưới chính chuyển thành 1 cột chiếm 100% chiều rộng khả dụng (`@container main-card < 600px`), điều hướng cuộn/menu thu gọn, khoảng cách đồng bộ `10px` giữa Header – Main Card – Footer, nút chạm đạt tối thiểu chuẩn thao tác ngón tay.

---

## Phần III. Ghi Chú & Quy Tắc Thực Thi Bắt Buộc

- **Phạm vi áp dụng mặc định cho mọi yêu cầu:** Khi chat và lệnh yêu cầu mà **không xác định giao diện cụ thể** thì mặc định **thực thi đồng bộ cho TẤT CẢ các giao diện** trong hệ thống (bao gồm cả các giao diện mới thêm về sau).

