export interface SampleQuestionItem {
  id: number;
  number: number;
  categoryId: string;
  title: string;
  question: string;
  answer: string;
  sourceStatus: 'verified';
}

export interface SampleQuestionCategory {
  id: string;
  code: string;
  title: string;
  labelWithNumber: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  items: SampleQuestionItem[];
  questions: SampleQuestionItem[];
}

interface RawCategoryDef {
  id: string;
  code: string;
  title: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  questions: Array<{
    number: number;
    title: string;
    question: string;
    answer: string;
  }>;
}

const RAW_CATEGORIES: RawCategoryDef[] = [
  {
    id: 'cat-1-personal-intro',
    code: '1',
    title: 'Giới thiệu cá nhân',
    description: 'Xuất phát điểm nghề nghiệp, hành trình 22+ năm và hồ sơ năng lực',
    descriptionEn: 'Career origin, 22+ year journey, and capability portfolio',
    icon: 'user',
    color: '#EC7D21',
    questions: [
      {
        number: 1,
        title: '1. Giới thiệu bản thân & Hành trình 22 năm',
        question:
          'Chào anh Nguyễn Hùng Thái, anh có thể giới thiệu ngắn gọn về bản thân cũng như hành trình 22 năm trong lĩnh vực chăm sóc khách hàng của mình không?',
        answer:
          'Anh Nguyễn Hùng Thái (sinh năm 1984) là một chuyên gia thực chiến dày dặn với hơn 22 năm kinh nghiệm trong ngành dịch vụ và trải nghiệm khách hàng. Bắt đầu từ năm 2002, anh đã nỗ lực đi lên từ vị trí nhân viên tổng đài thế hệ đầu để tiến tới các cấp bậc quản lý tại nhiều tập đoàn lớn.',
      },
      {
        number: 2,
        title: '2. Lý do gắn bó với nghề CSKH',
        question: 'Điều gì khiến anh gắn bó lâu dài với lĩnh vực chăm sóc khách hàng đến vậy?',
        answer:
          'Anh Hùng Thái luôn có niềm đam mê sâu sắc với nghề vì trân trọng từng lời cảm ơn từ người dùng. Với anh, ngay cả những bài học từ các khách hàng chưa hài lòng đều là cơ hội quý giá để thấu hiểu, tự sửa mình và kiến tạo nên các trải nghiệm chạm đến trái tim.',
      },
      {
        number: 3,
        title: '3. Thành tựu tự hào nhất sự nghiệp',
        question: 'Thành tựu nào anh cảm thấy tự hào nhất trong sự nghiệp của mình?',
        answer:
          'Thành tựu mà anh Hùng Thái tự hào nhất không chỉ là trực tiếp giải quyết các khiếu nại khó, mà là khả năng thiết lập và chuẩn hóa thành công 100% quy trình hệ thống tại mọi đơn vị từng đi qua. Mục tiêu tối cao của anh là xây dựng nền tảng vững chắc nhằm chuyển giao năng lực, giúp đội ngũ cấp dưới vận hành hiệu quả hơn cả chính mình.',
      },
      {
        number: 4,
        title: '4. Sự đa dạng các lĩnh vực hoạt động',
        question: 'Các lĩnh vực ngành nghề anh từng tham gia và trải nghiệm đa dạng như thế nào?',
        answer:
          'Kinh nghiệm của anh Hùng Thái vô cùng đa dạng, trải dài qua 5 mô hình vận hành: Viễn thông (MobiFone, V247, LBC HTVC); Trò chơi trực tuyến & Giải trí công nghệ (Garena/VED); Thương mại điện tử (Shopee); Bảo hiểm nhân thọ (Prudential Vietnam); và Tài chính số & Ví điện tử (MoMo, Finviet).',
      },
      {
        number: 5,
        title: '5. Kênh tra cứu hồ sơ năng lực',
        question: 'Nếu muốn tìm hiểu thêm về anh (CV/Hồ sơ năng lực), chúng tôi có thể xem ở đâu?',
        answer:
          'Toàn bộ hệ sinh thái thông tin của anh Hùng Thái được đồng bộ công khai tại: Trang thông tin năng lực cá nhân nguyenhungthai.powerservice.one, Thư mục lưu trữ Hồ sơ năng lực trên Google Drive và mạng xã hội LinkedIn Nguyễn Hùng Thái.',
      },
    ],
  },
  {
    id: 'cat-2-vision-strategy',
    code: '2',
    title: 'Tầm nhìn & Chiến lược',
    description: 'Chiến lược CX, lộ trình thiết lập hệ thống và bộ chỉ số thành công',
    descriptionEn: 'CX strategy, system roadmap, and core performance metrics',
    icon: 'target',
    color: '#E64C72',
    questions: [
      {
        number: 6,
        title: '6. Mô tả chiến lược chăm sóc khách hàng',
        question: 'Anh hãy mô tả một chiến lược chăm sóc khách hàng thành công mà anh từng triển khai?',
        answer:
          'Tại Ví điện tử MoMo (2018–2021), khi người dùng bùng nổ gây quá tải, anh Hùng Thái đã dẫn dắt dự án tái cấu trúc hệ thống quản trị quan hệ khách hàng đa kênh, thành lập trung tâm hỗ trợ tập trung và hợp tác thuê ngoài vận hành. Kết quả là anh đã chuẩn hóa 100% quy trình vận hành và nâng tỷ lệ hỗ trợ cộng đồng ổn định lên 80%.',
      },
      {
        number: 7,
        title: '7. Vai trò CSKH trong vòng đời khách hàng',
        question: 'Theo anh, chăm sóc khách hàng đóng vai trò gì trong toàn bộ vòng đời khách hàng?',
        answer:
          'Anh Hùng Thái quan niệm bộ phận này không đơn thuần làm nhiệm vụ "giải quyết hậu quả". Vai trò cốt lõi là xuất hiện tại mọi điểm chạm để giữ nhịp độ hài lòng, dịch chuyển người dùng từ trạng thái "sử dụng sản phẩm" sang "tin tưởng doanh nghiệp".',
      },
      {
        number: 8,
        title: '8. Lộ trình xây dựng lại hệ thống CSKH',
        question: 'Nếu được xây lại hệ thống CSKH từ đầu, anh sẽ bắt đầu từ đâu?',
        answer:
          'Anh Hùng Thái tuân thủ lộ trình 3 giai đoạn: (1) Bắt đầu từ Quy trình & Con người để thiết lập cơ cấu chuẩn; (2) Đưa Công nghệ & Dữ liệu vào để đồng bộ; (3) Tối ưu & Tự động hóa thông qua AI.',
      },
      {
        number: 9,
        title: '9. Yếu tố quan trọng nhất khi xây dựng phòng CSKH',
        question: 'Theo anh, yếu tố quan trọng nhất khi xây dựng phòng CSKH là gì?',
        answer:
          'Yếu tố tiên quyết theo anh Hùng Thái là sự cân bằng hài hòa giữa "Xương sườn" Quy trình chắc chắn và "Trái tim" Thấu cảm của con người.',
      },
      {
        number: 10,
        title: '10. Bộ chỉ số đo lường thành công',
        question: 'Những chỉ số thành công nào anh đặc biệt quan tâm trong các chiến lược của mình?',
        answer:
          'Anh Hùng Thái quản trị hiệu suất dựa trên việc cân bằng giữa nhóm chỉ số trải nghiệm cảm xúc (CSAT, NPS, CES) và nhóm hiệu quả vận hành (FCR, SLA, AHT).',
      },
      {
        number: 11,
        title: '11. Hệ sinh thái CSKH lý tưởng tương lai',
        question: 'Anh hình dung thế nào về một “hệ sinh thái CSKH lý tưởng” trong 3–5 năm tới?',
        answer:
          'Anh Hùng Thái hình dung về một hệ sinh thái "Không ma sát". Tại đó, trí tuệ nhân tạo và dữ liệu lớn giúp doanh nghiệp dự đoán vấn đề để hỗ trợ chủ động, nhường không gian kết nối con người cho các tương tác thấu cảm chuyên sâu.',
      },
    ],
  },
  {
    id: 'cat-3-management-training',
    code: '3',
    title: 'Quản lý & Đào tạo',
    description: 'Quy mô nhân sự, phong cách dẫn dắt, coaching và lộ trình thăng tiến',
    descriptionEn: 'Team scale, leadership style, coaching, and career paths',
    icon: 'users',
    color: '#1480C0',
    questions: [
      {
        number: 12,
        title: '12. Quy mô quản lý nhân sự',
        question: 'Anh từng quản lý đội ngũ bao nhiêu nhân sự, với những cấp độ nào?',
        answer:
          'Quy mô nhân sự lớn nhất anh Hùng Thái từng điều hành là 130 người tại Garena (chi tiết 129 nhân sự trực tiếp) và 60 người nội bộ tại MoMo (cùng hàng trăm nhân sự BPO), bao gồm đủ các cấp bậc từ nhân viên đến quản lý cấp trung.',
      },
      {
        number: 13,
        title: '13. Phong cách lãnh đạo',
        question: 'Phong cách lãnh đạo của anh là gì?',
        answer:
          'Phong cách chủ đạo của anh Hùng Thái là Đồng hành và dẫn dắt. Anh tập trung xây dựng nền tảng vững chắc để trao quyền, chuyển giao năng lực thay vì quản lý vi mô.',
      },
      {
        number: 14,
        title: '14. Ưu tiên hàng đầu khi xây dựng đội nhóm',
        question: 'Khi xây dựng đội nhóm, anh ưu tiên điều gì nhất: kỹ năng, thái độ hay văn hóa dịch vụ?',
        answer:
          'Thái độ và Tư duy dịch vụ luôn là ưu tiên hàng đầu của anh Hùng Thái. Kỹ năng chuyên môn có thể đào tạo, nhưng sự đồng cảm chân thành là điều kiện tiên quyết.',
      },
      {
        number: 15,
        title: '15. Phương pháp xử lý khi nhân viên bị phàn nàn',
        question: 'Anh xử lý ra sao khi nhân viên bị khách hàng phàn nàn?',
        answer:
          'Anh Hùng Thái sẽ rà soát lại dữ liệu cuộc gọi để phân tích nguyên nhân gốc rễ, đưa ra phản hồi xây dựng để huấn luyện lại nhân viên, đồng thời vá các lỗ hổng quy trình vận hành.',
      },
      {
        number: 16,
        title: '16. Lộ trình thăng tiến nhân sự',
        question: 'Anh có kinh nghiệm thiết kế lộ trình thăng tiến cho phòng CSKH không?',
        answer:
          'Có, anh Hùng Thái đã xây dựng Khung năng lực chia 3 nhánh minh bạch: Năng lực chuyên môn, Năng lực lãnh đạo và Năng lực liên ngành.',
      },
      {
        number: 17,
        title: '17. Phương pháp truyền động lực cho đội ngũ',
        question: 'Với vai trò lãnh đạo, anh thường truyền động lực cho đội ngũ bằng cách nào?',
        answer:
          'Anh Hùng Thái định vị bộ phận của mình là "trung tâm tạo ra giá trị" cho doanh nghiệp chứ không phải nơi tiêu tốn chi phí, giúp nhân viên luôn tự hào khi giải quyết khó khăn cho khách hàng.',
      },
    ],
  },
  {
    id: 'cat-4-situation-crisis',
    code: '4',
    title: 'Tình huống & Khủng hoảng',
    description: 'Xử lý sự cố diện rộng theo STAR, khách hàng VIP và nguyên tắc đỏ',
    descriptionEn: 'STAR crisis handling, VIP escalations, and red-line principles',
    icon: 'shield-alert',
    color: '#0D9488',
    questions: [
      {
        number: 18,
        title: '18. Khủng hoảng dịch vụ tại MoMo theo mô hình STAR',
        question: 'Anh từng xử lý một cuộc khủng hoảng dịch vụ tại MoMo theo mô hình STAR như thế nào?',
        answer:
          'Tình huống (Situation): Hệ thống ví MoMo gặp lỗi diện rộng khiến lượng yêu cầu tăng đột biến. Nhiệm vụ (Task): Giải tỏa áp lực tổng đài và giữ vững uy tín thương hiệu. Hành động (Action): Kích hoạt kịch bản khẩn cấp liên phòng ban và triển khai truyền thông đa kênh minh bạch. Kết quả (Result): Giảm 70% cuộc gọi chờ và giữ chân người dùng ổn định.',
      },
      {
        number: 19,
        title: '19. Tình huống áp lực nhất từng xử lý',
        question: 'Tình huống áp lực nhất anh từng xử lý là gì?',
        answer:
          'Đó là trực tiếp đối mặt và xử lý các khiếu nại tranh chấp phức tạp giữa người mua – người bán, đi kèm kiểm soát rủi ro gian lận tài chính tại các đơn vị quy mô lớn.',
      },
      {
        number: 20,
        title: '20. Xử lý khi khách hàng VIP tức giận',
        question: 'Khi khách hàng VIP tức giận yêu cầu gặp cấp cao, anh giải quyết ra sao?',
        answer:
          'Anh Hùng Thái áp dụng quy trình 3 bước: Lắng nghe cầu thị, xuất hiện trực tiếp khẳng định thẩm quyền và đưa ra giải pháp đặc cách trong khung rủi ro cho phép.',
      },
      {
        number: 21,
        title: '21. Truyền thông khi hệ thống lỗi diện rộng',
        question: 'Trong trường hợp hệ thống lỗi diện rộng, anh truyền thông thế nào?',
        answer:
          'Anh chủ động triển khai truyền thông đa kênh minh bạch, không trốn tránh trách nhiệm và phối hợp chặt chẽ với phòng kỹ thuật để cập nhật tiến độ khắc phục.',
      },
      {
        number: 22,
        title: '22. Nguyên tắc "đỏ" khi mâu thuẫn gay gắt',
        question: 'Nguyên tắc "đỏ" anh luôn tuân thủ khi có mâu thuẫn gay gắt với khách hàng là gì?',
        answer:
          'Nguyên tắc "đỏ" của anh Hùng Thái là: "Không tranh luận đúng sai – Tập trung vào giải pháp".',
      },
      {
        number: 23,
        title: '23. Bài học lớn nhất từ khủng hoảng dịch vụ',
        question: 'Bài học lớn nhất anh rút ra từ sự cố khủng hoảng dịch vụ?',
        answer:
          'Anh Hùng Thái đúc kết: Quy trình tốt chỉ là điểm khởi đầu, sự thấu cảm kịp thời mới là thứ cứu vãn được mối quan hệ.',
      },
    ],
  },
  {
    id: 'cat-5-tech-process',
    code: '5',
    title: 'Công nghệ & Quy trình',
    description: 'Triển khai CRM, chuyển đổi số và dữ liệu khách hàng tập trung',
    descriptionEn: 'CRM systems, digital transformation, and Single Source of Truth',
    icon: 'database',
    color: '#3BB8E6',
    questions: [
      {
        number: 24,
        title: '24. Kinh nghiệm triển khai hệ thống quản trị dữ liệu',
        question: 'Anh từng triển khai hoặc cải tiến hệ thống quản trị dữ liệu nào?',
        answer:
          'Anh Hùng Thái có kinh nghiệm vận hành các hệ thống như Zoho, các công cụ Helpdesk và Larksuite. Anh cũng tự học các ngôn ngữ lập trình để hiểu sâu về mặt kỹ thuật, tối ưu hóa tích hợp hệ thống.',
      },
      {
        number: 25,
        title: '25. Quan điểm về chuyển đổi số trong CSKH',
        question: 'Quan điểm của anh về chuyển đổi số trong CSKH?',
        answer:
          'Theo anh Hùng Thái, chuyển đổi số phải bám sát triết lý: Hiệu quả – Nhân văn – Bền vững. Công nghệ giúp giải phóng con người, không phải triệt tiêu sự thấu cảm.',
      },
      {
        number: 26,
        title: '26. Mảnh ghép công nghệ quan trọng nhất',
        question: 'Với một hệ thống CSKH, "mảnh ghép công nghệ" quan trọng nhất là gì?',
        answer:
          'Đó chính là Hệ thống dữ liệu khách hàng tập trung (Single Source of Truth), giúp gom toàn bộ hành trình khách hàng về một màn hình duy nhất.',
      },
    ],
  },
  {
    id: 'cat-6-culture-empathy',
    code: '6',
    title: 'Văn hóa & Thấu cảm',
    description: 'Chỉ số hiệu suất, cá nhân hóa, VoC và giá trị cốt lõi Thấu cảm',
    descriptionEn: 'Performance metrics, personalization, VoC, and empathy culture',
    icon: 'heart',
    color: '#6353B5',
    questions: [
      {
        number: 27,
        title: '27. Áp dụng các chỉ số hiệu suất',
        question: 'Anh sử dụng các chỉ số hiệu suất nào?',
        answer:
          'Anh Hùng Thái sử dụng bộ công cụ đo lường toàn diện gồm: FCR, NPS, CSAT, CES, SLA và AHT.',
      },
      {
        number: 28,
        title: '28. Cá nhân hóa dịch vụ khi mở rộng quy mô',
        question: 'Khi mở rộng quy mô, làm sao để hệ thống vẫn cá nhân hóa?',
        answer:
          'Anh Hùng Thái kết hợp giữa Tự động hóa (AI Chatbot) để xử lý câu hỏi thường gặp và Dữ liệu hệ thống để định tuyến khách hàng VIP hoặc khiếu nại phức tạp tới chuyên viên.',
      },
      {
        number: 29,
        title: '29. Ứng dụng AI nâng cao trải nghiệm khách hàng',
        question: 'Ví dụ về dùng dữ liệu/AI để nâng trải nghiệm khách hàng?',
        answer:
          'Anh Hùng Thái từng triển khai AI Text Analytics để quét từ khóa tiêu cực/tích cực trong lịch sử tương tác, từ đó đo lường cảm xúc khách hàng một cách chủ động.',
      },
      {
        number: 30,
        title: '30. Định nghĩa về dịch vụ tuyệt hảo',
        question: 'Thế nào là “dịch vụ tuyệt hảo”?',
        answer:
          'Với anh Hùng Thái, dịch vụ tuyệt hảo đến từ sự tận tâm đúng lúc: cách doanh nghiệp giải quyết vượt kỳ vọng ngay khi khách hàng thất vọng nhất.',
      },
      {
        number: 31,
        title: '31. Đo lường cảm xúc khách hàng ngoài con số khảo sát',
        question: 'Làm sao để đo lường cảm xúc khách hàng ngoài những con số khảo sát?',
        answer:
          'Anh chú trọng lắng nghe và phân tích Tiếng nói Khách hàng (VoC) thông qua việc kết hợp công cụ quét từ khóa cảm xúc và theo dõi tần suất quay lại tương tác tích cực trên cộng đồng.',
      },
      {
        number: 32,
        title: '32. Nuôi dưỡng tư duy dịch vụ',
        question: 'Anh nuôi dưỡng “tư duy dịch vụ” bằng cách nào?',
        answer:
          'Anh đào tạo đội ngũ nguyên tắc: Lắng nghe – Hiểu sâu – Xử lý tinh tế, đồng thời bản thân người quản lý phải luôn làm gương.',
      },
      {
        number: 33,
        title: '33. Giá trị cốt lõi duy nhất',
        question: 'Giá trị cốt lõi duy nhất?',
        answer: 'Anh Hùng Thái kiên định chọn chữ "Thấu cảm".',
      },
    ],
  },
  {
    id: 'cat-7-organization-alignment',
    code: '7',
    title: 'Tổ chức & Phối hợp',
    description: 'Cơ cấu 4 nhóm, vòng lặp phản hồi sản phẩm và báo cáo C-Level',
    descriptionEn: 'Department structure, Product feedback loops, and C-Level reporting',
    icon: 'network',
    color: '#2563EB',
    questions: [
      {
        number: 34,
        title: '34. Cơ cấu tổ chức phòng CSKH',
        question: 'Anh tổ chức phòng CSKH như thế nào?',
        answer:
          'Anh Hùng Thái chia thành 4 nhóm liên kết: Tiếp nhận (Inbound), Chủ động (Outbound), Nghiệp vụ chuyên sâu và Đảm bảo chất lượng (QA & Training).',
      },
      {
        number: 35,
        title: '35. Phối hợp với phòng Kinh doanh/Sản phẩm',
        question: 'Phối hợp với Kinh doanh/Sản phẩm ra sao?',
        answer:
          'Anh thiết lập "Vòng lặp phản hồi" để dùng dữ liệu CSKH cải tiến sản phẩm và điều chỉnh kịch bản truyền thông ngay từ đầu.',
      },
      {
        number: 36,
        title: '36. Xử lý mâu thuẫn liên phòng ban',
        question: 'Xử lý mâu thuẫn giữa CSKH và các phòng ban khác?',
        answer:
          'Anh Hùng Thái dùng dữ liệu phản hồi từ khách hàng và chỉ số SLA làm trọng tài khách quan để hướng các bên tới mục tiêu chung là khách hàng.',
      },
      {
        number: 37,
        title: '37. Dự án liên phòng ban tiêu biểu',
        question: 'Anh từng tham gia dự án liên phòng ban nào?',
        answer:
          'Tiêu biểu là dự án cùng phòng Sản phẩm và Pháp lý tại MoMo nhằm định hình khung quy trình xử lý các sự cố công nghệ mới cho ví điện tử.',
      },
      {
        number: 38,
        title: '38. Cơ chế báo cáo với C-Level',
        question: 'Cơ chế báo cáo – phối hợp hiệu quả với lãnh đạo cấp cao?',
        answer:
          'Anh Hùng Thái sử dụng hệ thống Realtime Dashboard để Ban giám đốc nắm bắt tình hình trực quan và đưa ra quyết định kịp thời.',
      },
    ],
  },
  {
    id: 'cat-8-leadership-differentiation',
    code: '8',
    title: 'Lãnh đạo & Tư duy khác biệt',
    description: 'Kế hoạch 90 ngày, Value Center, dấu ấn số và lời nhắn thế hệ trẻ',
    descriptionEn: '90-day plan, Value Center mindset, digital impact, and mentorship',
    icon: 'sparkles',
    color: '#A855F7',
    questions: [
      {
        number: 39,
        title: '39. Kế hoạch 90 ngày đầu nhận nhiệm vụ',
        question: 'Kế hoạch 90 ngày đầu nhận nhiệm vụ?',
        answer:
          'Anh Hùng Thái chia làm 3 giai đoạn: 30 ngày Lắng nghe & Đánh giá; 30 ngày Chuẩn hóa & Tối ưu ngắn hạn; 30 ngày Xây nền tảng dài hạn & Automation.',
      },
      {
        number: 40,
        title: '40. Sự khác biệt trong tư duy dịch vụ',
        question: 'Tư duy dịch vụ của anh có gì khác biệt?',
        answer:
          'Anh Hùng Thái định vị CSKH là "trung tâm tạo ra giá trị", đưa dữ liệu khách hàng ngược vào để cải tiến sản phẩm và tối ưu doanh thu, thay vì chỉ quản lý vi mô để cắt giảm chi phí.',
      },
      {
        number: 41,
        title: '41. Vai trò người lãnh đạo',
        question: 'Vai trò lãnh đạo của anh?',
        answer:
          'Đó là sự kết hợp giữa Đồng hành và dẫn dắt để mỗi nhân sự có cơ hội phát triển tốt hơn cả.',
      },
      {
        number: 42,
        title: '42. Cân bằng giữa chi tiết và chiến lược',
        question: 'Sự cân bằng giữa chi tiết và tầm nhìn xa?',
        answer:
          'Anh Hùng Thái nhìn bức tranh chiến lược CX lớn lao, đồng thời cực kỳ tỉ mỉ trong chuẩn hóa từng chi tiết quy trình vận hành.',
      },
      {
        number: 43,
        title: '43. Dấu ấn chuyển đổi số nổi bật',
        question: 'Dấu ấn chuyển đổi số của anh?',
        answer:
          'Hệ thống vận hành tự động, thông minh nhưng mang đậm tính nhân văn; chuyển hóa văn hóa doanh nghiệp từ "phục vụ bị động" sang "chủ động đồng hành".',
      },
      {
        number: 44,
        title: '44. Giải quyết xung đột quy trình',
        question: 'Cách anh xử lý xung đột trong quy trình?',
        answer:
          'Anh Hùng Thái luôn ưu tiên phân tích dữ liệu, tìm ra điểm nghẽn và thỏa thuận dựa trên lợi ích khách hàng.',
      },
      {
        number: 45,
        title: '45. Định nghĩa sự thành công của nhân viên CSKH',
        question: 'Anh định nghĩa thế nào về sự thành công của một nhân viên CSKH?',
        answer:
          'Đối với anh Hùng Thái, đó là khi nhân viên không chỉ xử lý xong yêu cầu, mà còn hiểu được cảm xúc phía sau và tạo ra kết nối bền vững với khách hàng.',
      },
      {
        number: 46,
        title: '46. Tầm quan trọng của học tập liên tục',
        question: 'Anh đánh giá tầm quan trọng của việc học tập liên tục trong nghề CSKH?',
        answer:
          'Anh Hùng Thái cho rằng ngành dịch vụ thay đổi từng ngày, nên tư duy học tập liên tục (Lifelong learning) và cập nhật công nghệ là yếu tố sống còn của người lãnh đạo.',
      },
      {
        number: 47,
        title: '47. Lời nhắn nhủ cho thế hệ trẻ',
        question: 'Lời nhắn nhủ của anh tới các bạn trẻ đang bắt đầu nghề CSKH?',
        answer:
          'Anh Hùng Thái luôn nhắn nhủ: Hãy xem mỗi khiếu nại là một bài học, và sự thấu cảm chính là "vũ khí" mạnh nhất để bạn thăng tiến trong bất kỳ lĩnh vực nào.',
      },
    ],
  },
];

export const TRINHAN_SAMPLE_QUESTION_CATEGORIES: SampleQuestionCategory[] = RAW_CATEGORIES.map((cat) => {
  const items: SampleQuestionItem[] = cat.questions.map((q) => ({
    id: q.number,
    number: q.number,
    categoryId: cat.id,
    title: q.title,
    question: q.question,
    answer: q.answer,
    sourceStatus: 'verified',
  }));
  return {
    id: cat.id,
    code: cat.code,
    title: cat.title,
    labelWithNumber: `${cat.code}. ${cat.title}`,
    description: cat.description,
    descriptionEn: cat.descriptionEn,
    icon: cat.icon,
    color: cat.color,
    items,
    questions: items,
  };
});

export const TRI_NHAN_CATEGORIES = TRINHAN_SAMPLE_QUESTION_CATEGORIES;

export const ALL_SAMPLE_QUESTIONS: SampleQuestionItem[] =
  TRINHAN_SAMPLE_QUESTION_CATEGORIES.flatMap((c) => c.items);
