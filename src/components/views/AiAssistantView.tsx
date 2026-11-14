'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { SiteTheme } from '@/types';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import {
  AssistantVoiceLanguage,
  speakSiteText,
  stopActiveSpeech,
  DEFAULT_PUCK_VOICE_PERSONA,
  ENGLISH_PUCK_VOICE_PERSONA,
} from '@/utils/speechVoice';

export interface QaItem {
  id: number;
  title: string;
  question: string;
  answer: string;
}

export interface QaCategory {
  code: string;
  title: string;
  icon: string;
  color: string;
  items: QaItem[];
}

export const TRI_NHAN_CATEGORIES: QaCategory[] = [
  {
    code: '1',
    title: '1. Giới thiệu cá nhân',
    icon: 'user',
    color: '#EC7D21',
    items: [
      {
        id: 1,
        title: '1. Giới thiệu bản thân & Hành trình 22 năm',
        question:
          'Chào anh Nguyễn Hùng Thái, anh có thể giới thiệu ngắn gọn về bản thân cũng như hành trình 22 năm trong lĩnh vực chăm sóc khách hàng của mình không?',
        answer:
          'Trí Nhân xin được giới thiệu: Anh Nguyễn Hùng Thái (sinh năm 1984) là một chuyên gia thực chiến dày dặn với hơn 22 năm kinh nghiệm trong ngành dịch vụ và trải nghiệm khách hàng. Bắt đầu từ năm 2002, anh đã nỗ lực đi lên từ vị trí nhân viên tổng đài thế hệ đầu để tiến tới các cấp bậc quản lý tại nhiều tập đoàn lớn.',
      },
      {
        id: 2,
        title: '2. Lý do gắn bó với nghề CSKH',
        question: 'Điều gì khiến anh gắn bó lâu dài với lĩnh vực chăm sóc khách hàng đến vậy?',
        answer:
          'Anh Hùng Thái luôn có niềm đam mê sâu sắc với nghề vì trân trọng từng lời cảm ơn từ người dùng. Với anh, ngay cả những bài học từ các khách hàng chưa hài lòng đều là cơ hội quý giá để thấu hiểu, tự sửa mình và kiến tạo nên các trải nghiệm chạm đến trái tim.',
      },
      {
        id: 3,
        title: '3. Thành tựu tự hào nhất sự nghiệp',
        question: 'Thành tựu nào anh cảm thấy tự hào nhất trong sự nghiệp của mình?',
        answer:
          'Thành tựu mà anh Hùng Thái tự hào nhất không chỉ là trực tiếp giải quyết các khiếu nại khó, mà là khả năng thiết lập và chuẩn hóa thành công 100% quy trình hệ thống tại mọi đơn vị từng đi qua. Mục tiêu tối cao của anh là xây dựng nền tảng vững chắc nhằm chuyển giao năng lực, giúp đội ngũ cấp dưới vận hành hiệu quả hơn cả chính mình.',
      },
      {
        id: 4,
        title: '4. Sự đa dạng các lĩnh vực hoạt động',
        question: 'Các lĩnh vực ngành nghề anh từng tham gia và trải nghiệm đa dạng như thế nào?',
        answer:
          'Kinh nghiệm của anh Hùng Thái vô cùng đa dạng, trải dài qua 5 mô hình vận hành: Viễn thông (Mobifone, V247); Trò chơi trực tuyến & Giải trí công nghệ (Garena/VED); Thương mại điện tử (Shopee); Bảo hiểm nhân thọ (Prudential Vietnam); và Tài chính số & Ví điện tử (MoMo, Finviet).',
      },
      {
        id: 5,
        title: '5. Kênh tra cứu hồ sơ năng lực',
        question: 'Nếu muốn tìm hiểu thêm về anh (CV/Hồ sơ năng lực), chúng tôi có thể xem ở đâu?',
        answer:
          'Toàn bộ hệ sinh thái thông tin của anh Hùng Thái được đồng bộ công khai tại: Trang thông tin năng lực cá nhân nguyenhungthai.powerservice.one, Thư mục lưu trữ Hồ sơ năng lực trên Google Drive và mạng xã hội Linkedin Nguyễn Hùng Thái.',
      },
    ],
  },
  {
    code: '2',
    title: '2. Tầm nhìn & Chiến lược',
    icon: 'target',
    color: '#E64C72',
    items: [
      {
        id: 6,
        title: '6. Mô tả chiến lược chăm sóc khách hàng',
        question: 'Anh hãy mô tả một chiến lược chăm sóc khách hàng thành công mà anh từng triển khai?',
        answer:
          'Tại Ví điện tử MoMo (2018-2021), khi người dùng bùng nổ gây quá tải, anh Hùng Thái đã dẫn dắt dự án tái cấu trúc hệ thống quản trị quan hệ khách hàng đa kênh, thành lập trung tâm hỗ trợ tập trung và hợp tác thuê ngoài vận hành. Kết quả là anh đã chuẩn hóa 100% quy trình vận hành và nâng tỷ lệ hỗ trợ cộng đồng ổn định lên 80%.',
      },
      {
        id: 7,
        title: '7. Vai trò CSKH trong vòng đời khách hàng',
        question: 'Theo anh, chăm sóc khách hàng đóng vai trò gì trong toàn bộ vòng đời khách hàng?',
        answer:
          'Anh Hùng Thái quan niệm bộ phận này không đơn thuần làm nhiệm vụ "giải quyết hậu quả". Vai trò cốt lõi là xuất hiện tại mọi điểm chạm để giữ nhịp độ hài lòng, dịch chuyển người dùng từ trạng thái "sử dụng sản phẩm" sang "tin tưởng doanh nghiệp".',
      },
      {
        id: 8,
        title: '8. Lộ trình xây dựng lại hệ thống CSKH',
        question: 'Nếu được xây lại hệ thống CSKH từ đầu, anh sẽ bắt đầu từ đâu?',
        answer:
          'Anh Hùng Thái tuân thủ lộ trình 3 giai đoạn: (1) Bắt đầu từ Quy trình & Con người để thiết lập cơ cấu chuẩn; (2) Đưa Công nghệ & Dữ liệu vào để đồng bộ; (3) Tối ưu & Tự động hóa thông qua AI.',
      },
      {
        id: 9,
        title: '9. Yếu tố quan trọng nhất khi xây dựng phòng CSKH',
        question: 'Theo anh, yếu tố quan trọng nhất khi xây dựng phòng CSKH là gì?',
        answer:
          'Yếu tố tiên quyết theo anh Hùng Thái là sự cân bằng hài hòa giữa "Xương sườn" Quy trình chắc chắn và "Trái tim" Thấu cảm của con người.',
      },
      {
        id: 10,
        title: '10. Bộ chỉ số đo lường thành công',
        question: 'Những chỉ số thành công nào anh đặc biệt quan tâm trong các chiến lược của mình?',
        answer:
          'Anh Hùng Thái quản trị hiệu suất dựa trên việc cân bằng giữa nhóm chỉ số trải nghiệm cảm xúc (CSAT, NPS, CES) và nhóm hiệu quả vận hành (FCR, SLA, AHT).',
      },
      {
        id: 11,
        title: '11. Hệ sinh thái CSKH lý tưởng tương lai',
        question: 'Anh hình dung thế nào về một “hệ sinh thái CSKH lý tưởng” trong 3–5 năm tới?',
        answer:
          'Anh Hùng Thái hình dung về một hệ sinh thái "Không ma sát". Tại đó, trí tuệ nhân tạo và dữ liệu lớn giúp doanh nghiệp dự đoán vấn đề để hỗ trợ chủ động, nhường không gian kết nối con người cho các tương tác thấu cảm chuyên sâu.',
      },
    ],
  },
  {
    code: '3',
    title: '3. Quản lý & Đào tạo',
    icon: 'users',
    color: '#1480C0',
    items: [
      {
        id: 12,
        title: '12. Quy mô quản lý nhân sự',
        question: 'Anh từng quản lý đội ngũ bao nhiêu nhân sự, với những cấp độ nào?',
        answer:
          'Quy mô nhân sự lớn nhất anh Hùng Thái từng điều hành là 130 người tại Garena và 60 người tại MoMo, bao gồm đủ các cấp bậc từ nhân viên đến quản lý cấp trung.',
      },
      {
        id: 13,
        title: '13. Phong cách lãnh đạo',
        question: 'Phong cách lãnh đạo của anh là gì?',
        answer:
          'Phong cách chủ đạo của anh Hùng Thái là Đồng hành và dẫn dắt. Anh tập trung xây dựng nền tảng vững chắc để trao quyền, chuyển giao năng lực thay vì quản lý vi mô.',
      },
      {
        id: 14,
        title: '14. Ưu tiên hàng đầu khi xây dựng đội nhóm',
        question: 'Khi xây dựng đội nhóm, anh ưu tiên điều gì nhất: kỹ năng, thái độ hay văn hóa dịch vụ?',
        answer:
          'Thái độ và Tư duy dịch vụ luôn là ưu tiên hàng đầu của anh Hùng Thái. Kỹ năng chuyên môn có thể đào tạo, nhưng sự đồng cảm chân thành là điều kiện tiên quyết.',
      },
      {
        id: 15,
        title: '15. Phương pháp xử lý khi nhân viên bị phàn nàn',
        question: 'Anh xử lý ra sao khi nhân viên bị khách hàng phàn nàn?',
        answer:
          'Anh Hùng Thái sẽ rà soát lại dữ liệu cuộc gọi để phân tích nguyên nhân gốc rễ, đưa ra phản hồi xây dựng để huấn luyện lại nhân viên, đồng thời vá các lỗ hổng quy trình vận hành.',
      },
      {
        id: 16,
        title: '16. Lộ trình thăng tiến nhân sự',
        question: 'Anh có kinh nghiệm thiết kế lộ trình thăng tiến cho phòng CSKH không?',
        answer:
          'Có, anh Hùng Thái đã xây dựng Khung năng lực chia 3 nhánh minh bạch: Năng lực chuyên môn, Năng lực lãnh đạo và Năng lực liên ngành.',
      },
      {
        id: 17,
        title: '17. Phương pháp truyền động lực cho đội ngũ',
        question: 'Với vai trò lãnh đạo, anh thường truyền động lực cho đội ngũ bằng cách nào?',
        answer:
          'Anh Hùng Thái định vị bộ phận của mình là "trung tâm tạo ra giá trị" cho doanh nghiệp chứ không phải nơi tiêu tốn chi phí, giúp nhân viên luôn tự hào khi giải quyết khó khăn cho khách hàng.',
      },
    ],
  },
  {
    code: '4',
    title: '4. Tình huống & Khủng hoảng',
    icon: 'shield-alert',
    color: '#0D9488',
    items: [
      {
        id: 18,
        title: '18. Khủng hoảng dịch vụ theo mô hình STAR',
        question: 'Anh có thể chia sẻ cách xử lý một cuộc khủng hoảng dịch vụ theo mô hình STAR không?',
        answer:
          'Tình huống: MoMo lỗi diện rộng. Nhiệm vụ: Giải tỏa áp lực tổng đài và giữ uy tín. Hành động: Kịch bản khẩn cấp liên phòng ban, truyền thông đa kênh. Kết quả: Giảm 70% cuộc gọi chờ, giữ chân người dùng.',
      },
      {
        id: 19,
        title: '19. Tình huống áp lực nhất từng xử lý',
        question: 'Tình huống áp lực nhất anh từng xử lý là gì?',
        answer:
          'Đó là trực tiếp đối mặt và xử lý các khiếu nại tranh chấp phức tạp giữa người mua - người bán, đi kèm kiểm soát rủi ro gian lận tài chính tại các đơn vị quy mô lớn.',
      },
      {
        id: 20,
        title: '20. Xử lý khi khách hàng VIP tức giận',
        question: 'Khi khách hàng VIP tức giận yêu cầu gặp cấp cao, anh giải quyết ra sao?',
        answer:
          'Anh Hùng Thái áp dụng quy trình 3 bước: Lắng nghe cầu thị, xuất hiện trực tiếp khẳng định thẩm quyền và đưa ra giải pháp đặc cách trong khung rủi ro cho phép.',
      },
      {
        id: 21,
        title: '21. Truyền thông khi hệ thống lỗi diện rộng',
        question: 'Trong trường hợp hệ thống lỗi diện rộng, anh truyền thông thế nào?',
        answer:
          'Anh chủ động triển khai truyền thông đa kênh minh bạch, không trốn tránh trách nhiệm và phối hợp chặt chẽ với phòng kỹ thuật để cập nhật tiến độ khắc phục.',
      },
      {
        id: 22,
        title: '22. Nguyên tắc "đỏ" khi mâu thuẫn gay gắt',
        question: 'Nguyên tắc "đỏ" anh luôn tuân thủ khi có mâu thuẫn gay gắt với khách hàng là gì?',
        answer:
          'Nguyên tắc "đỏ" của anh Hùng Thái là: "Không tranh luận đúng sai – Tập trung vào giải pháp".',
      },
      {
        id: 23,
        title: '23. Bài học lớn nhất từ khủng hoảng dịch vụ',
        question: 'Bài học lớn nhất anh rút ra từ sự cố khủng hoảng dịch vụ?',
        answer:
          'Anh Hùng Thái đúc kết: Quy trình tốt chỉ là điểm khởi đầu, sự thấu cảm kịp thời mới là thứ cứu vãn được mối quan hệ.',
      },
    ],
  },
  {
    code: '5',
    title: '5. Công nghệ & Quy trình',
    icon: 'database',
    color: '#3BB8E6',
    items: [
      {
        id: 24,
        title: '24. Kinh nghiệm triển khai hệ thống quản trị dữ liệu',
        question: 'Anh từng triển khai hoặc cải tiến hệ thống quản trị dữ liệu nào?',
        answer:
          'Anh Hùng Thái có kinh nghiệm vận hành các hệ thống như Zoho, các công cụ Helpdesk và Larksuite. Anh cũng tự học các ngôn ngữ lập trình để hiểu sâu về mặt kỹ thuật, tối ưu hóa tích hợp hệ thống.',
      },
      {
        id: 25,
        title: '25. Quan điểm về chuyển đổi số trong CSKH',
        question: 'Quan điểm của anh về chuyển đổi số trong CSKH?',
        answer:
          'Theo anh Hùng Thái, chuyển đổi số phải bám sát triết lý: Hiệu quả – Nhân văn – Bền vững. Công nghệ giúp giải phóng con người, không phải triệt tiêu sự thấu cảm.',
      },
      {
        id: 26,
        title: '26. Mảnh ghép công nghệ quan trọng nhất',
        question: 'Với một hệ thống CSKH, "mảnh ghép công nghệ" quan trọng nhất là gì?',
        answer:
          'Đó chính là Hệ thống dữ liệu khách hàng tập trung (Single Source of Truth), giúp gom toàn bộ hành trình khách hàng về một màn hình duy nhất.',
      },
    ],
  },
  {
    code: '6',
    title: '6. Văn hóa & Thấu cảm',
    icon: 'heart',
    color: '#6353B5',
    items: [
      {
        id: 31,
        title: '31. Đo lường cảm xúc khách hàng ngoài con số khảo sát',
        question: 'Làm sao để đo lường cảm xúc khách hàng ngoài những con số khảo sát?',
        answer:
          'Anh chú trọng lắng nghe và phân tích Tiếng nói Khách hàng (VoC) thông qua việc kết hợp công cụ quét từ khóa cảm xúc và theo dõi tần suất quay lại tương tác tích cực trên cộng đồng.',
      },
      {
        id: 27,
        title: '27. Áp dụng các chỉ số hiệu suất',
        question: 'Anh sử dụng các chỉ số hiệu suất nào?',
        answer:
          'Anh sử dụng bộ công cụ toàn diện: FCR, NPS, CSAT, CES, SLA và AHT.',
      },
      {
        id: 28,
        title: '28. Cá nhân hóa dịch vụ khi mở rộng quy mô',
        question: 'Khi mở rộng quy mô, làm sao để hệ thống vẫn cá nhân hóa?',
        answer:
          'Anh Hùng Thái kết hợp giữa Tự động hóa (AI Chatbot) để xử lý câu hỏi thường gặp và Dữ liệu hệ thống để định tuyến khách hàng VIP/khiếu nại phức tạp tới chuyên viên.',
      },
      {
        id: 29,
        title: '29. Ứng dụng AI nâng cao trải nghiệm khách hàng',
        question: 'Ví dụ về dùng dữ liệu/AI để nâng trải nghiệm khách hàng?',
        answer:
          'Anh Hùng Thái từng triển khai AI Text Analytics để quét từ khóa tiêu cực/tích cực trong lịch sử tương tác, từ đó đo lường cảm xúc khách hàng một cách chủ động.',
      },
      {
        id: 30,
        title: '30. Định nghĩa về dịch vụ tuyệt hảo',
        question: 'Thế nào là “dịch vụ tuyệt hảo”?',
        answer:
          'Với anh Hùng Thái, dịch vụ tuyệt hảo đến từ sự tận tâm đúng lúc: cách doanh nghiệp giải quyết vượt kỳ vọng ngay khi khách hàng thất vọng nhất.',
      },
      {
        id: 32,
        title: '32. Nuôi dưỡng tư duy dịch vụ',
        question: 'Anh nuôi dưỡng “tư duy dịch vụ” bằng cách nào?',
        answer:
          'Anh đào tạo đội ngũ nguyên tắc: Lắng nghe - Hiểu sâu - Xử lý tinh tế, đồng thời bản thân người quản lý phải luôn làm gương.',
      },
      {
        id: 33,
        title: '33. Giá trị cốt lõi duy nhất',
        question: 'Giá trị cốt lõi duy nhất?',
        answer:
          'Anh Hùng Thái kiên định chọn chữ "THẤU CẢM".',
      },
    ],
  },
  {
    code: '7',
    title: '7. Tổ chức & Phối hợp',
    icon: 'network',
    color: '#2563EB',
    items: [
      {
        id: 34,
        title: '34. Cơ cấu tổ chức phòng CSKH',
        question: 'Anh tổ chức phòng CSKH như thế nào?',
        answer:
          'Anh Hùng Thái chia thành 4 nhóm liên kết: Tiếp nhận (Inbound), Chủ động (Outbound), Nghiệp vụ chuyên sâu và Đảm bảo chất lượng (QA & Training).',
      },
      {
        id: 35,
        title: '35. Phối hợp với phòng Kinh doanh/Sản phẩm',
        question: 'Phối hợp với Kinh doanh/Sản phẩm ra sao?',
        answer:
          'Anh thiết lập "Vòng lặp phản hồi" để dùng dữ liệu CSKH cải tiến sản phẩm và điều chỉnh kịch bản truyền thông ngay từ đầu.',
      },
      {
        id: 36,
        title: '36. Xử lý mâu thuẫn liên phòng ban',
        question: 'Xử lý mâu thuẫn giữa CSKH và các phòng ban khác?',
        answer:
          'Anh Hùng Thái dùng dữ liệu phản hồi từ khách hàng và chỉ số SLA làm trọng tài khách quan để hướng các bên tới mục tiêu chung là khách hàng.',
      },
      {
        id: 37,
        title: '37. Dự án liên phòng ban tiêu biểu',
        question: 'Anh từng tham gia dự án liên phòng ban nào?',
        answer:
          'Tiêu biểu là dự án cùng phòng Sản phẩm và Pháp lý tại MoMo nhằm định hình khung quy trình xử lý các sự cố công nghệ mới cho ví điện tử.',
      },
      {
        id: 38,
        title: '38. Cơ chế báo cáo với C-Level',
        question: 'Cơ chế báo cáo – phối hợp hiệu quả với lãnh đạo cấp cao?',
        answer:
          'Anh Hùng Thái sử dụng hệ thống Realtime Dashboard để Ban giám đốc nắm bắt tình hình trực quan và đưa ra quyết định kịp thời.',
      },
    ],
  },
  {
    code: '8',
    title: '8. Lãnh đạo & Tư duy khác biệt',
    icon: 'sparkles',
    color: '#A855F7',
    items: [
      {
        id: 39,
        title: '39. Kế hoạch 90 ngày đầu nhận nhiệm vụ',
        question: 'Kế hoạch 90 ngày đầu nhận nhiệm vụ?',
        answer:
          'Anh Hùng Thái chia làm 3 giai đoạn: 30 ngày Lắng nghe & Đánh giá; 30 ngày Chuẩn hóa & Tối ưu ngắn hạn; 30 ngày Xây nền tảng dài hạn & Automation.',
      },
      {
        id: 40,
        title: '40. Sự khác biệt trong tư duy dịch vụ',
        question: 'Tư duy dịch vụ của anh có gì khác biệt?',
        answer:
          'Anh Hùng Thái định vị CSKH là "trung tâm tạo ra giá trị", đưa dữ liệu khách hàng ngược vào để cải tiến sản phẩm và tối ưu doanh thu, thay vì chỉ quản lý vi mô để cắt giảm chi phí.',
      },
      {
        id: 41,
        title: '41. Vai trò người lãnh đạo',
        question: 'Vai trò lãnh đạo của anh?',
        answer:
          'Đó là sự kết hợp giữa Đồng hành và dẫn dắt để mỗi nhân sự có cơ hội phát triển tốt hơn cả.',
      },
      {
        id: 42,
        title: '42. Cân bằng giữa chi tiết và chiến lược',
        question: 'Sự cân bằng giữa chi tiết và tầm nhìn xa?',
        answer:
          'Anh Hùng Thái nhìn bức tranh chiến lược CX lớn lao, đồng thời cực kỳ tỉ mỉ trong chuẩn hóa từng chi tiết quy trình vận hành.',
      },
      {
        id: 43,
        title: '43. Dấu ấn chuyển đổi số nổi bật',
        question: 'Dấu ấn chuyển đổi số của anh?',
        answer:
          'Hệ thống vận hành tự động, thông minh nhưng mang đậm tính nhân văn; chuyển hóa văn hóa doanh nghiệp từ "phục vụ bị động" sang "chủ động đồng hành".',
      },
      {
        id: 44,
        title: '44. Giải quyết xung đột quy trình',
        question: 'Cách anh xử lý xung đột trong quy trình?',
        answer:
          'Anh Hùng Thái luôn ưu tiên phân tích dữ liệu, tìm ra điểm nghẽn và thỏa thuận dựa trên lợi ích khách hàng.',
      },
      {
        id: 45,
        title: '45. Định nghĩa sự thành công của nhân viên CSKH',
        question: 'Anh định nghĩa thế nào về sự thành công của một nhân viên CSKH?',
        answer:
          'Đối với anh Hùng Thái, đó là khi nhân viên không chỉ xử lý xong yêu cầu, mà còn hiểu được cảm xúc phía sau và tạo ra kết nối bền vững với khách hàng.',
      },
      {
        id: 46,
        title: '46. Tầm quan trọng của học tập liên tục',
        question: 'Anh đánh giá tầm quan trọng của việc học tập liên tục trong nghề CSKH?',
        answer:
          'Anh Hùng Thái cho rằng ngành dịch vụ thay đổi từng ngày, nên tư duy học tập liên tục (Lifelong learning) và cập nhật công nghệ là yếu tố sống còn của người lãnh đạo.',
      },
      {
        id: 47,
        title: '47. Lời nhắn nhủ cho thế hệ trẻ',
        question: 'Lời nhắn nhủ của anh tới các bạn trẻ đang bắt đầu nghề CSKH?',
        answer:
          'Anh Hùng Thái luôn nhắn nhủ: Hãy xem mỗi khiếu nại là một bài học, và sự thấu cảm chính là "vũ khí" mạnh nhất để bạn thăng tiến trong bất kỳ lĩnh vực nào.',
      },
    ],
  },
];

const ALL_QA_ITEMS: QaItem[] = TRI_NHAN_CATEGORIES.flatMap((c) => c.items);

interface MenuLevel1Group {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  categoryCodes: string[];
}

const MENU_LEVEL1_GROUPS: MenuLevel1Group[] = [
  {
    id: 'grp-profile-strategy',
    label: '1. Hồ sơ & Chiến lược',
    subtitle: 'Giới thiệu cá nhân, Tầm nhìn CX',
    icon: 'user',
    color: '#EC7D21',
    categoryCodes: ['1', '2'],
  },
  {
    id: 'grp-team-crisis',
    label: '2. Đội ngũ & Khủng hoảng',
    subtitle: 'Quản lý, Đào tạo, Xử lý sự cố & Phối hợp',
    icon: 'users',
    color: '#1480C0',
    categoryCodes: ['3', '4', '7'],
  },
  {
    id: 'grp-tech-culture',
    label: '3. Công nghệ & Lãnh đạo',
    subtitle: 'Quy trình số, Văn hóa thấu cảm & Tư duy',
    icon: 'sparkles',
    color: '#A855F7',
    categoryCodes: ['5', '6', '8'],
  },
];

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  title?: string;
}

const INITIAL_GREETING_TEXT =
  'Chào Anh Chị em là Trí Nhân, AI hỗ trợ về thông tin anh Hùng Thái , Anh chị có thể hỏi hoặc dùng câu hỏi mẫu bên dưới. Xin cám ơn.';

const INITIAL_GREETING_TEXT_EN =
  'Hello! I am Tri Nhan, the AI assistant for Mr. Nguyen Hung Thai. You can ask any question or browse the 3-level question menu below. Thank you!';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    title: 'Trí Nhân • AI Hỗ Trợ',
    text: INITIAL_GREETING_TEXT,
  },
];

export interface AiAssistantViewProps {
  currentTheme?: SiteTheme;
  onSelectTab?: (index: number) => void;
  onShowNotification?: (msg: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onShowNotification,
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const { cardStyle } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cleanCardStyle } = rawCardStyle as any;
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Menu Drop Top 3 cấp (Cấp 1: Nhóm chủ đề -> Cấp 2: 8 Danh mục -> Cấp 3: Câu hỏi chi tiết)
  const [isCategoryDropTopOpen, setIsCategoryDropTopOpen] = useState<boolean>(false);
  const [selectedCenterCategory, setSelectedCenterCategory] = useState<QaCategory | null>(null);
  const [activeMenuLevel1Id, setActiveMenuLevel1Id] = useState<string>(MENU_LEVEL1_GROUPS[0].id);
  const [activeMenuLevel2Code, setActiveMenuLevel2Code] = useState<string>(TRI_NHAN_CATEGORIES[0].code);
  const [mobileMenuStep, setMobileMenuStep] = useState<1 | 2 | 3>(1);

  // Trạng thái giọng đọc AI Puck Nam giới (Hỗ trợ Tiếng Việt Miền Nam Việt Nam & Tiếng Anh)
  const [voiceLanguage, setVoiceLanguage] = useState<AssistantVoiceLanguage>(language);
  const [isAutoVoiceEnabled, setIsAutoVoiceEnabled] = useState<boolean>(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    setVoiceLanguage(language);
  }, [language]);

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const dropTopMenuRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const [syncedBannerHeight, setSyncedBannerHeight] = useState<number | null>(null);

  const showToast = (msg: string) => {
    if (onShowNotification) onShowNotification(msg);
  };

  useEffect(() => {
    const syncHeight = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 1024) {
        setSyncedBannerHeight(null);
        return;
      }
      if (chatCardRef.current) {
        const h = Math.round(chatCardRef.current.getBoundingClientRect().height);
        if (h > 0) setSyncedBannerHeight(h);
      }
    };

    syncHeight();
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => syncHeight()) : null;
    if (observer && chatCardRef.current) {
      observer.observe(chatCardRef.current);
    }
    window.addEventListener('resize', syncHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Đóng menu drop top khi click ra ngoài hoặc bấm Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropTopMenuRef.current && !dropTopMenuRef.current.contains(e.target as Node)) {
        setIsCategoryDropTopOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCenterCategory) {
          setSelectedCenterCategory(null);
          return;
        }
        if (isCategoryDropTopOpen) {
          setIsCategoryDropTopOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCenterCategory, isCategoryDropTopOpen]);

  // Dừng giọng đọc khi rời trang
  useEffect(() => {
    return () => {
      stopActiveSpeech();
    };
  }, []);

  const speakWithPuckVoice = (
    msgId: string,
    textToRead: string,
    overrideLang?: AssistantVoiceLanguage
  ) => {
    if (speakingMessageId === msgId && !overrideLang) {
      stopActiveSpeech();
      setSpeakingMessageId(null);
      return;
    }
    const targetLang = overrideLang || voiceLanguage;
    const persona =
      targetLang === 'en' ? ENGLISH_PUCK_VOICE_PERSONA : DEFAULT_PUCK_VOICE_PERSONA;

    const actualText =
      msgId === 'msg-welcome' && targetLang === 'en'
        ? INITIAL_GREETING_TEXT_EN
        : textToRead;

    setSpeakingMessageId(msgId);
    speakSiteText(actualText, {
      lang: targetLang,
      useGeminiTts: true,
      speakingStyle: 'puck',
      voiceName: persona.voiceName,
      pitch: persona.pitch,
      rate: persona.rate,
      onStart: () => setSpeakingMessageId(msgId),
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const translateAnswerIfEnglish = async (text: string): Promise<string> => {
    if (voiceLanguage !== 'en') return text;
    try {
      const resp = await fetch('/api/assistant/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'en' }),
      });
      if (!resp.ok) return text;
      const data = (await resp.json()) as { translatedText?: string };
      return data.translatedText?.trim() || text;
    } catch {
      return text;
    }
  };

  const handleChangeVoiceLanguage = (nextLang: AssistantVoiceLanguage) => {
    SoundEngine.playTap();
    stopActiveSpeech();
    setSpeakingMessageId(null);
    setVoiceLanguage(nextLang);
    showToast(
      nextLang === 'vi'
        ? '🔊 Giọng Puck Nam giới • Tiếng Việt (Miền Nam Việt Nam)'
        : '🔊 Puck Male Voice • English'
    );
  };

  const findBestAnswerForQuery = (query: string): { title?: string; answer: string } => {
    const norm = query.toLowerCase().trim();

    // 1. Khớp chính xác câu hỏi hoặc tiêu đề trong 47 câu hỏi
    const exactMatch = ALL_QA_ITEMS.find(
      (item) =>
        item.question.toLowerCase() === norm ||
        item.title.toLowerCase() === norm ||
        norm.includes(item.question.toLowerCase())
    );
    if (exactMatch) {
      return { title: exactMatch.title, answer: exactMatch.answer };
    }

    // 2. Khớp theo số thứ tự câu hỏi (VD: "câu 1", "18")
    const numMatch = norm.match(/^(?:câu\s*)?(\d{1,2})$/);
    if (numMatch) {
      const idNum = parseInt(numMatch[1], 10);
      const byId = ALL_QA_ITEMS.find((item) => item.id === idNum);
      if (byId) return { title: byId.title, answer: byId.answer };
    }

    // 3. Khớp từ khóa thông minh trên 47 câu hỏi của Trí Nhân
    let bestItem: QaItem | null = null;
    let bestScore = 0;
    const words = norm.split(/\s+/).filter((w) => w.length > 2);

    for (const item of ALL_QA_ITEMS) {
      const haystack = `${item.title} ${item.question} ${item.answer}`.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (haystack.includes(w)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    if (bestItem && bestScore >= 2) {
      return { title: bestItem.title, answer: bestItem.answer };
    }

    return {
      title: 'Trí Nhân chia sẻ về anh Nguyễn Hùng Thái',
      answer:
        'Dạ Trí Nhân xin chia sẻ cùng Anh Chị: Anh Nguyễn Hùng Thái (sinh năm 1984) có hơn 22 năm kinh nghiệm thực chiến quản trị Dịch vụ & Trải nghiệm Khách hàng (CX) tại MobiFone, V247, HTVC, Garena/Shopee (VED), Prudential Việt Nam, Ví MoMo và Finviet. Anh Chị có thể bấm vào biểu tượng Menu danh mục câu hỏi (8 nhóm chủ đề từ 1 đến 8) ngay trước ô nhập tin nhắn để chọn câu hỏi chi tiết nha! Xin cám ơn Anh Chị.',
    };
  };

  const handleSelectQuestionItem = (item: QaItem) => {
    SoundEngine.playTap();
    setSelectedCenterCategory(null);
    setIsCategoryDropTopOpen(false);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      title: item.title,
      text: item.question,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    setTimeout(async () => {
      const finalAnswer = await translateAnswerIfEnglish(item.answer);
      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        title:
          voiceLanguage === 'en'
            ? `Tri Nhan • ${item.title}`
            : `Trí Nhân trả lời • ${item.title}`,
        text: finalAnswer,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
      showToast(
        isEn
          ? `✓ Tri Nhan answered: ${t(item.title)}`
          : `✓ Trí Nhân đã trả lời: ${item.title}`
      );

      if (isAutoVoiceEnabled) {
        speakWithPuckVoice(aiMsgId, finalAnswer, voiceLanguage);
      }
    }, 320);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;
    SoundEngine.playTap();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    setTimeout(async () => {
      const matched = findBestAnswerForQuery(text);
      const finalAnswer = await translateAnswerIfEnglish(matched.answer);
      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        title: matched.title
          ? voiceLanguage === 'en'
            ? `Tri Nhan • ${t(matched.title)}`
            : `Trí Nhân trả lời • ${matched.title}`
          : isEn
          ? 'Tri Nhan • AI Assistant'
          : 'Trí Nhân • AI Hỗ Trợ',
        text: finalAnswer,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
      showToast(isEn ? '✓ Tri Nhan answered your question!' : '✓ Trí Nhân đã giải đáp câu hỏi!');

      if (isAutoVoiceEnabled) {
        speakWithPuckVoice(aiMsgId, finalAnswer, voiceLanguage);
      }
    }, 360);
  };

  return (
    <div
      id="ai-assistant-page-container"
      data-element-name="Trang Trợ lý AI Hỗ trợ Trí Nhân"
      data-element-type="container"
      data-element-page="ai-assistant"
      data-element-parent="global-content-viewport"
      className="w-full h-full max-h-full flex flex-col lg:flex-row p-[15px] gap-[15px] overflow-y-auto lg:overflow-hidden font-play text-left animate-fadeIn flex-1 min-h-0 box-border justify-center"
    >
       {/* 1. HERO BANNER TRỢ LÝ AI TRÍ NHÂN (DẠNG DỌC CHIẾM 25% CHIỀU NGANG, CHIỀU CAO BẰNG KHUNG CHAT) */}
      <section
        id="ai-assistant-hero-banner"
        data-element-name="Banner Trợ lý AI Trí Nhân"
        data-element-type="banner-card"
        data-section-card="true"
        data-element-page="ai-assistant"
        data-element-parent="ai-assistant-page-container"
        className="banner-card hero-banner w-full min-h-[170px] lg:min-h-0 lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] lg:flex-[0_0_400px] lg:self-stretch rounded-[14px] relative overflow-hidden border border-white/80 dark:border-white/20 shadow-xl text-white z-30 flex flex-col justify-between p-[15px] box-border"
        style={{
          padding: '15px',
          borderRadius: '14px',
          boxSizing: 'border-box',
          ...(syncedBannerHeight
            ? {
                height: `${syncedBannerHeight}px`,
                minHeight: `${syncedBannerHeight}px`,
                maxHeight: `${syncedBannerHeight}px`,
              }
            : {}),
        }}
      >
        {/* Nền video banner trực tiếp từ Cloudinary */}
        <div id="ai-assistant-banner-video-wrap" className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]">
          <video
            id="ai-assistant-banner-video"
            src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div id="ai-assistant-banner-overlay" className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
        </div>

        {/* Hàng trên: Icon + Tiêu đề, Câu nói nằm ngay dưới tiêu đề */}
        <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
          <div className="flex items-center gap-2 shrink-0" style={{ color: '#c084fc' }}>
            <WebIcon
              name="bot"
              className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#c084fc]"
              style={{ color: '#c084fc', width: '18px', height: '18px', fontSize: '18px' }}
            />
            <h1
              id="ai-assistant-banner-h1"
              className="text-[18px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#c084fc] whitespace-nowrap"
              style={{
                color: '#c084fc',
                fontSize: '18px',
                fontWeight: 700,
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              AI Hỗ Trợ • Trí Nhân
            </h1>
          </div>
          <p
            id="ai-assistant-banner-quote"
            className="font-handwriting font-italianno not-italic text-[18px] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left w-full whitespace-normal leading-snug"
            style={{ color: '#c084fc', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '18px', fontWeight: 400, fontStyle: 'normal' }}
          >
            &quot;Trí Nhân đồng hành giải đáp thông tin anh Hùng Thái 24/7 ♡&quot;
          </p>
        </div>
      </section>

      {/* 2. CHAT INTERFACE CHÍNH BÊN CẠNH BANNER (CHIẾM 80% CHIỀU NGANG) */}
      <div
        ref={chatCardRef}
        id="ai-assistant-chat-container"
        data-element-name="Khung trò chuyện Trợ lý AI Trí Nhân"
        data-element-type="card"
        data-section-card="true"
        data-element-page="ai-assistant"
        data-element-parent="ai-assistant-page-container"
        className="bento-card glass-card min-w-0 min-h-0 flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-[14px] shadow-xl backdrop-blur-xl gap-[15px] overflow-hidden relative"
      style={{
        ...cleanCardStyle,
        flex: '1 1 auto',
        minWidth: 0,
        maxWidth: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        alignSelf: 'stretch',
        padding: '15px',
        gap: '15px',
        borderRadius: '14px',
        boxSizing: 'border-box',
      }}
    >

        {/* VÙNG HIỂN THỊ TIN NHẮN CHAT */}
        <div
          id="ai-assistant-messages-viewport"
          className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1 text-xs sm:text-sm min-h-0"
        >
          {messages.map((m) => {
            const displayTitle =
              m.id === 'msg-welcome' && isEn
                ? 'Tri Nhan • AI Assistant'
                : m.title;
            const displayText =
              m.id === 'msg-welcome' && isEn
                ? INITIAL_GREETING_TEXT_EN
                : m.text;
            return (
            <div
              key={m.id}
              id={`ai-chat-msg-${m.id}`}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                data-element-type={m.sender === 'ai' ? 'card' : undefined}
                className={`max-w-[90%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-[14px] leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none font-medium'
                    : 'ai-assistant-bubble bento-card glass-card bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-none border border-purple-200/80 dark:border-purple-900/60 shadow-xs'
                }`}
              >
                {displayTitle && (
                  <div
                    className={`flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b text-[16px] font-bold ${
                      m.sender === 'user'
                        ? 'border-white/20 text-purple-100'
                        : 'border-purple-200/70 dark:border-purple-800/60 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    <span>{displayTitle}</span>
                    {m.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakWithPuckVoice(m.id, displayText)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600/15 hover:bg-purple-600/25 text-purple-700 dark:text-purple-200 text-[12px] font-bold cursor-pointer transition shrink-0"
                        title={
                          voiceLanguage === 'en'
                            ? 'Play with Puck Male Voice (English)'
                            : 'Đọc bằng giọng Puck Nam giới (Miền Nam Việt Nam)'
                        }
                      >
                        <WebIcon name={speakingMessageId === m.id ? 'pause' : 'volume'} className="w-3.5 h-3.5" />
                        <span>
                          {speakingMessageId === m.id
                            ? isEn
                              ? 'Stop'
                              : 'Dừng đọc'
                            : voiceLanguage === 'en'
                            ? 'Read (Puck)'
                            : 'Đọc giọng Puck'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
                <p className="text-[15px] sm:text-[15px] leading-relaxed">{displayText}</p>
              </div>
            </div>
            );
          })}

          {isLoading && (
            <div id="ai-assistant-loading-indicator" className="flex justify-start">
              <div className="ai-assistant-bubble bento-card glass-card bg-slate-100 dark:bg-slate-800 p-3 rounded-[14px] text-slate-600 dark:text-slate-300 flex items-center gap-2 text-[15px] font-bold font-play">
                <WebIcon name="bot" className="w-5 h-5 text-purple-600 animate-spin" />
                <span>
                  {isEn
                    ? 'Tri Nhan is compiling insights about Mr. Nguyen Hung Thai...'
                    : 'Trí Nhân đang tổng hợp thông tin về anh Hùng Thái...'}
                </span>
              </div>
            </div>
          )}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* DROP CENTER LIST: KHI CHỌN VÀO 1 TRONG 8 DANH MỤC SẼ HIỂN THỊ DANH SÁCH CÂU HỎI CỦA MỤC ĐÓ Ở CHÍNH GIỮA */}
        {selectedCenterCategory && (
          <div
            id="ai-assistant-center-questions-overlay"
            className="absolute inset-0 z-40 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedCenterCategory(null)}
          >
            <div
              id="ai-assistant-center-questions-modal"
              role="dialog"
              aria-modal="true"
              aria-label={selectedCenterCategory.title}
              data-element-type="card"
              data-section-card="true"
              onClick={(e) => e.stopPropagation()}
              className="bento-card glass-card w-full max-w-2xl max-h-[82%] rounded-[14px] shadow-2xl flex flex-col overflow-hidden"
              style={{ ...cleanCardStyle, borderRadius: '14px' }}
            >
              {/* Header của Drop Center List */}
              <div
                id="ai-assistant-center-questions-header"
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 shrink-0 border-b border-slate-200/80 dark:border-white/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <WebIcon
                    name={selectedCenterCategory.icon}
                    className="w-[18px] h-[18px] shrink-0"
                    style={{ color: selectedCenterCategory.color }}
                  />
                  <div className="min-w-0">
                    <h3
                      className="text-[17px] sm:text-[18px] font-bold font-play truncate"
                      style={{ color: selectedCenterCategory.color }}
                    >
                      {selectedCenterCategory.title}
                    </h3>
                    <p className="text-[12px] text-slate-600 dark:text-slate-300">
                      Chọn câu hỏi bên dưới để Trí Nhân giải đáp ngay ({selectedCenterCategory.items.length} câu hỏi)
                    </p>
                  </div>
                </div>

                <button
                  id="ai-assistant-center-questions-close"
                  type="button"
                  onClick={() => setSelectedCenterCategory(null)}
                  className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
                >
                  <WebIcon name="cancel" className="w-3.5 h-3.5" />
                  <span>Đóng</span>
                </button>
              </div>

              {/* Danh sách câu hỏi trong mục */}
              <div
                id="ai-assistant-center-questions-list"
                className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5"
              >
                {selectedCenterCategory.items.map((qItem) => (
                  <button
                    key={qItem.id}
                    id={`ai-center-question-btn-${qItem.id}`}
                    type="button"
                    data-subcard="true"
                    onClick={() => handleSelectQuestionItem(qItem)}
                    className="exp-detail-subcard w-full text-left p-3 rounded-[14px] hover:border-purple-400 transition flex flex-col gap-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[15px] sm:text-[16px] font-bold font-play"
                        style={{ color: selectedCenterCategory.color }}
                      >
                        {qItem.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-900/70 text-purple-700 dark:text-purple-200 shrink-0">
                        Hỏi Trí Nhân ➔
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-snug">
                      <strong className="text-slate-800 dark:text-slate-200">Câu hỏi:</strong> {qItem.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FORM Ô NHẬP TIN NHẮN + ICON MENU DROP TOP 3 CẤP (8 DANH MỤC CÂU HỎI) TRƯỚC KHUNG NHẬP TEXT */}
        <form
          id="ai-assistant-input-form"
          data-element-name="Biểu mẫu nhập câu hỏi Trợ lý AI Trí Nhân"
          data-element-type="control"
          data-element-page="ai-assistant"
          data-element-parent="ai-assistant-chat-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5 pt-1 relative"
        >
          {/* MENU 3 CẤP LEVEL CHO NÚT 8 DANH MỤC CÂU HỎI */}
          <div ref={dropTopMenuRef} id="ai-assistant-droptop-wrapper" className="shrink-0">
            <button
              id="ai-assistant-droptop-menu-btn"
              data-element-name="Nút Menu 3 cấp 8 danh mục câu hỏi"
              data-element-type="button"
              data-element-page="ai-assistant"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsCategoryDropTopOpen((prev) => {
                  const next = !prev;
                  if (next) setMobileMenuStep(1);
                  return next;
                });
              }}
              className="h-10 px-3.5 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95 border border-purple-400/40"
              title="Mở Menu List 3 cấp (Nhóm chủ đề > 8 Danh mục > 47 Câu hỏi)"
              aria-expanded={isCategoryDropTopOpen}
            >
              <WebIcon name="grid" className="w-4 h-4 text-yellow-300 shrink-0" />
              <span className="hidden sm:inline">8 Danh mục câu hỏi</span>
              <WebIcon
                name="chevron-up"
                className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${
                  isCategoryDropTopOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* MENU LIST 3 CẤP TUẦN TỰ (CHỌN -> CẤP 1 -> BẤM CẤP 1 RA CẤP 2 -> BẤM CẤP 2 RA CẤP 3) */}
            {isCategoryDropTopOpen && (() => {
              const activeLevel1Group =
                MENU_LEVEL1_GROUPS.find((g) => g.id === activeMenuLevel1Id) || MENU_LEVEL1_GROUPS[0];
              const level2Categories = TRI_NHAN_CATEGORIES.filter((c) =>
                activeLevel1Group.categoryCodes.includes(c.code)
              );
              const activeLevel2Category =
                level2Categories.find((c) => c.code === activeMenuLevel2Code) ||
                level2Categories[0] ||
                TRI_NHAN_CATEGORIES[0];

              return (
                <div
                  id="ai-assistant-droptop-menu-list"
                  data-element-type="card"
                  data-section-card="true"
                  className="bento-card glass-card absolute left-0 right-0 bottom-[calc(100%+10px)] w-full max-w-[680px] rounded-[14px] shadow-[0_18px_45px_rgba(15,23,42,0.28)] p-3 z-50 flex flex-col gap-2.5 animate-fadeIn overflow-hidden"
                  style={{ ...cleanCardStyle, borderRadius: '14px' }}
                >
                  {/* Header thanh điều hướng Breadcrumb 3 cấp */}
                  <div className="px-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold font-play min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setMobileMenuStep(1);
                        }}
                        className={`px-2 py-0.5 rounded-full cursor-pointer transition shrink-0 ${
                          mobileMenuStep === 1
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900'
                        }`}
                      >
                        Cấp 1: Chủ đề
                      </button>

                      {mobileMenuStep >= 2 && (
                        <>
                          <span className="text-slate-400">/</span>
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playTap();
                              setMobileMenuStep(2);
                            }}
                            className={`truncate max-w-[160px] px-2 py-0.5 rounded-full cursor-pointer transition ${
                              mobileMenuStep === 2
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            Cấp 2: {activeLevel1Group.label}
                          </button>
                        </>
                      )}

                      {mobileMenuStep === 3 && (
                        <>
                          <span className="text-slate-400">/</span>
                          <span className="truncate max-w-[180px] px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            Cấp 3: {activeLevel2Category.title} ({activeLevel2Category.items.length})
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {mobileMenuStep > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setMobileMenuStep((s) => (s === 3 ? 2 : 1));
                          }}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-800 dark:text-purple-200 transition cursor-pointer"
                        >
                          ← Quay lại cấp {mobileMenuStep - 1}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropTopOpen(false)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>

                  {/* Nội dung hiển thị tuần tự từng cấp (Cấp 1 -> Cấp 2 -> Cấp 3) */}
                  <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                    <div className="px-1.5 py-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {mobileMenuStep === 1
                        ? 'Danh sách cấp 1 • Chọn nhóm chủ đề'
                        : mobileMenuStep === 2
                        ? `Danh sách cấp 2 • Chọn danh mục (${activeLevel1Group.label})`
                        : `Danh sách cấp 3 • Chọn câu hỏi (${activeLevel2Category.title})`}
                    </div>

                    {mobileMenuStep === 1 &&
                      MENU_LEVEL1_GROUPS.map((grp) => {
                        const grpCount = TRI_NHAN_CATEGORIES.filter((c) =>
                          grp.categoryCodes.includes(c.code)
                        ).reduce((acc, c) => acc + c.items.length, 0);

                        return (
                          <button
                            key={grp.id}
                            id={`ai-menu-l1-${grp.id}`}
                            type="button"
                            data-subcard="true"
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveMenuLevel1Id(grp.id);
                              if (!grp.categoryCodes.includes(activeMenuLevel2Code)) {
                                setActiveMenuLevel2Code(grp.categoryCodes[0]);
                              }
                              setMobileMenuStep(2);
                            }}
                            className="exp-detail-subcard w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-[12px] hover:border-purple-400 text-[15px] sm:text-[16px] font-bold cursor-pointer text-left transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <WebIcon name={grp.icon} className="w-[16px] h-[16px] shrink-0" style={{ color: grp.color }} />
                              <div className="min-w-0">
                                <div className="font-bold truncate" style={{ color: grp.color }}>{grp.label}</div>
                                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                  {grp.categoryCodes.length} danh mục • {grpCount} câu hỏi
                                </div>
                              </div>
                            </div>
                            <WebIcon name="chevron-right" className="w-4 h-4 shrink-0" style={{ color: grp.color }} />
                          </button>
                        );
                      })}

                    {mobileMenuStep === 2 &&
                      level2Categories.map((cat) => (
                        <button
                          key={cat.code}
                          id={`ai-droptop-item-${cat.code.replace('.', '-')}`}
                          type="button"
                          data-subcard="true"
                          onClick={() => {
                            SoundEngine.playTap();
                            setActiveMenuLevel2Code(cat.code);
                            setMobileMenuStep(3);
                          }}
                          className="exp-detail-subcard w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-[12px] hover:border-indigo-400 text-[15px] sm:text-[16px] font-bold cursor-pointer text-left transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <WebIcon name={cat.icon} className="w-[16px] h-[16px] shrink-0" style={{ color: cat.color }} />
                            <span className="truncate" style={{ color: cat.color }}>{cat.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                              {cat.items.length} câu
                            </span>
                            <WebIcon name="chevron-right" className="w-4 h-4" style={{ color: cat.color }} />
                          </div>
                        </button>
                      ))}

                    {mobileMenuStep === 3 &&
                      activeLevel2Category.items.map((qItem) => (
                        <button
                          key={qItem.id}
                          id={`ai-menu-l3-q-${qItem.id}`}
                          type="button"
                          data-subcard="true"
                          onClick={() => handleSelectQuestionItem(qItem)}
                          className="exp-detail-subcard w-full p-2.5 rounded-[12px] text-left hover:border-purple-400 transition cursor-pointer flex flex-col gap-0.5 group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-[15px] sm:text-[16px] font-bold font-play truncate"
                              style={{ color: activeLevel2Category.color }}
                            >
                              {qItem.title}
                            </span>
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 shrink-0">
                              Hỏi ➔
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                            {qItem.question}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <input
            id="ai-assistant-input-text"
            data-element-name="Ô nhập nội dung câu hỏi AI Trí Nhân"
            data-element-type="control"
            data-element-page="ai-assistant"
            data-element-parent="ai-assistant-input-form"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isEn
                ? 'Ask Tri Nhan about Mr. Nguyen Hung Thai or pick a question category...'
                : 'Hỏi Trí Nhân về anh Nguyễn Hùng Thái hoặc chọn mục câu hỏi bên trái...'
            }
            className="flex-1 h-10 px-4 rounded-full border border-purple-300 dark:border-[#334155] bg-white/95 dark:bg-[#111827] text-xs sm:text-sm focus:outline-none focus:border-purple-600 text-[#334155] dark:text-[#E2E8F0] shadow-inner"
          />
          <button
            id="ai-assistant-submit-button"
            data-element-name="Nút gửi câu hỏi AI Trí Nhân"
            data-element-type="button"
            data-element-page="ai-assistant"
            data-element-parent="ai-assistant-input-form"
            type="submit"
            className="h-10 px-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition active:scale-95 flex items-center gap-2 shrink-0 border border-white/20"
          >
            <span>{isEn ? 'Send' : 'Gửi câu hỏi'}</span>
            <WebIcon name="send" className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistantView;
