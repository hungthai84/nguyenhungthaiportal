import { ProjectData } from '@/types';

export interface ProjectSpec {
  subtitleEn?: string;
  tagline?: string;
  overview: string[];
  context: {
    intro: string;
    challenges: string[];
    challengeTitles?: string[];
    conclusion: string;
  };
  objectives: {
    title: string;
    items: string[];
  }[];
  scopeItems: {
    code: string;
    title: string;
    intro: string;
    tasks: string[];
    note?: string;
    deliverable: string;
  }[];
  methodology: {
    intro: string;
    phases: {
      stage: string;
      title: string;
      desc: string;
    }[];
    outro: string;
  };
  metrics: {
    intro: string;
    table: {
      category: string;
      indicators: string;
    }[];
    outro: string;
  };
  pmRoles: {
    intro: string;
    items: {
      role: string;
      desc: string;
    }[];
  };
  expectedOutcomes: {
    intro: string;
    items: {
      dimension: string;
      desc: string;
    }[];
    outro: string;
  };
  philosophy: {
    paragraphs: string[];
    coreMessage: string;
  };
}

export const CHALLENGE_PALETTES = [
  { theme: 'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400', icon: 'alert', fourWord: 'Nghẽn quy trình' },
  { theme: 'border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400', icon: 'clock', fourWord: 'Thời gian xử lý' },
  { theme: 'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'users', fourWord: 'Kỹ năng đội ngũ' },
  { theme: 'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400', icon: 'database', fourWord: 'Dữ liệu phân tán' },
  { theme: 'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'cog', fourWord: 'Công nghệ lạc hậu' },
  { theme: 'border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400', icon: 'shield-check', fourWord: 'Kiểm soát chất lượng' },
  { theme: 'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'trending-up', fourWord: 'Chi phí vận hành' }
];

export const SCOPE_PALETTES = [
  { theme: 'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400', icon: 'clipboard' },
  { theme: 'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'workflow' },
  { theme: 'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'users' },
  { theme: 'border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400', icon: 'database' },
  { theme: 'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400', icon: 'shield-check' },
  { theme: 'border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400', icon: 'headphones' },
  { theme: 'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'award' }
];

export function getProjectDetailedSpec(project: ProjectData): ProjectSpec {
  if (project.detailedSpec) {
    return project.detailedSpec;
  }

  const star = project.star || { situation: '', approach: '', actions: [], results: [] };

  return {
    subtitleEn: project.subtitleEn || 'Executive Project Specification',
    tagline: project.tagline || 'Tối ưu hóa nguồn lực & chuẩn hóa chất lượng vận hành dịch vụ',
    overview: [
      project.description || 'Dự án trọng điểm tái cấu trúc và chuẩn hóa mô hình vận hành dịch vụ khách hàng.',
      'Định hình quy trình làm việc chuẩn SOP, kết nối các kênh giao tiếp đồng bộ và kiểm soát chất lượng bằng bộ chỉ số KPI/SLA minh bạch.'
    ],
    context: {
      intro: star.situation || 'Quy mô hệ thống mở rộng nhanh đòi hỏi sự đồng bộ cao về chất lượng dịch vụ và quy trình kiểm soát rủi ro vận hành.',
      challenges: [
        'Thiếu quy trình chuẩn hóa SOP khép kín giữa các bộ phận chuyên môn',
        'Thời gian phản hồi và xử lý phiếu yêu cầu chưa đồng đều',
        'Áp lực chuyển đổi số và tự động hóa luồng giao tiếp đa kênh Omni-channel',
        'Cần ma trận phân quyền và leo thang sự cố minh bạch'
      ],
      conclusion: 'Cần xây dựng hệ thống quy trình chuẩn SOP kết hợp hạ tầng công nghệ và đào tạo năng lực đội ngũ đồng bộ.'
    },
    objectives: [
      {
        title: 'Chuẩn hóa quy trình vận hành',
        items: [
          'Tối ưu hóa 100% các luồng xử lý phiếu yêu cầu dịch vụ',
          'Thiết lập SLA đáp ứng dưới 5 phút cho kênh tương tác trực tiếp'
        ]
      },
      {
        title: 'Nâng cao trải nghiệm khách hàng',
        items: [
          'Đạt tỷ lệ hài lòng CSAT từ 98% trở lên',
          'Giảm 40% thời gian xử lý khiếu nại phức tạp'
        ]
      },
      {
        title: 'Tự động hóa & Đo lường realtime',
        items: [
          'Triển khai báo cáo Dashboard thời gian thực',
          'Tích hợp công nghệ AI hỗ trợ nhận diện và phân loại yêu cầu'
        ]
      }
    ],
    scopeItems: [
      {
        code: `${project.code}-S1`,
        title: 'Khảo sát & Đánh giá hiện trạng',
        intro: 'Phân tích tổng thể mô hình vận hành hiện tại và nhận diện các điểm nghẽn.',
        tasks: [
          'Phỏng vấn trực tiếp các cấp quản lý và nhân sự vận hành',
          'Rà soát bộ chỉ số KPI/SLA và ma trận phân công hiện có',
          'Lập báo cáoGap Analysis đánh giá khoảng cách vận hành'
        ],
        note: 'Báo cáo được thống nhất với Ban Giám đốc trước khi triển khai các bước tiếp theo.',
        deliverable: 'Bộ hồ sơ Gap Analysis & Bảng đề xuất cải tiến'
      },
      {
        code: `${project.code}-S2`,
        title: 'Xây dựng bộ quy trình SOP',
        intro: 'Soạn thảo và ban hành bộ quy trình thao tác chuẩn khép kín.',
        tasks: [
          'Thiết kế sơ đồ luồng công việc Process Flowcharts',
          'Xây dựng ma trận phân quyền RACI và Ma trận Leo thang Escalation',
          'Chuẩn hóa kịch bản giao tiếp CSKH chuẩn mực'
        ],
        deliverable: 'Bộ tài liệu SOP Vận hành & Ma trận Escalation Matrix'
      },
      {
        code: `${project.code}-S3`,
        title: 'Đào tạo & Chuyển giao năng lực',
        intro: 'Huấn luyện đội ngũ nhân sự nắm vững quy trình và kỹ năng vận hành.',
        tasks: [
          'Tổ chức các khóa đào tạo quy trình SOP và kỹ năng xử lý tình huống',
          'Đánh giá năng lực sau đào tạo qua bài kiểm tra lý thuyết và thực hành',
          'Hướng dẫn sử dụng các công cụ công nghệ hỗ trợ'
        ],
        deliverable: '100% nhân sự hoàn thành đào tạo & đạt chứng chỉ vận hành'
      },
      {
        code: `${project.code}-S4`,
        title: 'Tích hợp hạ tầng công nghệ',
        intro: 'Cấu hình và kết nối hệ thống công nghệ tổng đài, CRM và AI.',
        tasks: [
          'Cấu hình định tuyến cuộc gọi thông minh theo kỹ năng Skill-based',
          'Tích hợp kết nối API đa kênh Omni-channel Hub',
          'Xây dựng kịch bản Bot tự động hỗ trợ tư vấn'
        ],
        deliverable: 'Hệ thống công nghệ hoàn thiện kết nối 24/7'
      }
    ],
    methodology: {
      intro: 'Lộ trình triển khai 5 giai đoạn tuân thủ nghiêm ngặt các tiêu chuẩn quản trị quốc tế COPC và ITIL.',
      phases: [
        { stage: 'Giai đoạn 1', title: 'Khảo sát & Định hướng', desc: 'Đánh giá rủi ro, phân tích nhu cầu và lập kế hoạch tổng thể.' },
        { stage: 'Giai đoạn 2', title: 'Thiết kế Quy trình', desc: 'Chuẩn hóa bộ quy trình SOP và kịch bản vận hành chi tiết.' },
        { stage: 'Giai đoạn 3', title: 'Đào tạo & Cấu hình', desc: 'Huấn luyện nhân sự và thiết lập cấu hình hệ thống công nghệ.' },
        { stage: 'Giai đoạn 4', title: 'Vận hành Thử nghiệm', desc: 'Chạy thử nghiệm Pilot, đo lường phản hồi và căn chỉnh tinh gọn.' },
        { stage: 'Giai đoạn 5', title: 'Nghiệm thu & Chuyển giao', desc: 'Bàn giao chính thức và đưa vào theo dõi kiểm soát định kỳ.' }
      ],
      outro: 'Mọi giai đoạn đều có mốc kiểm soát chất lượng Gate Review trước khi chuyển sang giai đoạn tiếp theo.'
    },
    metrics: {
      intro: 'Bộ chỉ số KPI/SLA được đo lường tự động trên hệ thống Dashboard thời gian thực.',
      table: [
        { category: 'CSAT (Customer Satisfaction)', indicators: '≥ 98% mức độ hài lòng khách hàng' },
        { category: 'FCR (First Contact Resolution)', indicators: '≥ 85% giải quyết ngay lần đầu' },
        { category: 'SLA Response Time', indicators: '< 5 phút cho tin nhắn / < 20 giây cuộc gọi' },
        { category: 'AHT (Average Handling Time)', indicators: 'Tối ưu rút ngắn 25% thời gian xử lý' }
      ],
      outro: 'Báo cáo phân tích nguyên nhân gốc rễ Root Cause Analysis được thực hiện hàng tuần.'
    },
    pmRoles: {
      intro: 'Phân nhiệm rõ ràng trách nhiệm lãnh đạo và điều phối dự án.',
      items: [
        { role: 'Lãnh đạo Dự án (Project Director)', desc: 'Chịu trách nhiệm tổng thể về chiến lược, ngân sách và phê duyệt nghiệm thu.' },
        { role: 'Quản lý Vận hành (Operations Manager)', desc: 'Trực tiếp điều phối công việc hàng ngày, giám sát tiến độ và kiểm soát chất lượng.' },
        { role: 'Chuyên gia Quy trình (SOP Specialist)', desc: 'Soạn thảo, cập nhật và tối ưu hóa các luồng quy trình thao tác chuẩn.' }
      ]
    },
    expectedOutcomes: {
      intro: 'Kết quả mang lại giá trị thiết thực và đo lường được cho tổ chức.',
      items: [
        { dimension: 'Chất lượng Dịch vụ', desc: 'Đồng bộ chất lượng giao tiếp và phục vụ khách hàng chuẩn mực.' },
        { dimension: 'Hiệu quả Chi phí', desc: 'Tối ưu hóa nguồn lực nhân sự và giảm thiểu lãng phí thời gian.' },
        { dimension: 'Khả năng Mở rộng', desc: 'Sẵn sàng nhân rộng quy mô vận hành mà không làm giảm chất lượng.' }
      ],
      outro: 'Đóng góp trực tiếp vào mục tiêu nâng cao uy tín thương hiệu và sự gắn kết khách hàng lâu dài.'
    },
    philosophy: {
      paragraphs: [
        'Một hệ thống vận hành xuất sắc không chỉ nằm ở công nghệ hiện đại, mà ở sự kết nối hài hòa giữa con người tận tâm, quy trình chuẩn mực và dữ liệu minh bạch.',
        'Sự thấu hiểu khách hàng sâu sắc là kim chỉ nam cho mọi bước cải tiến và tối ưu hóa vận hành.'
      ],
      coreMessage: 'Tận tâm phụng sự - Dẫn dắt bằng quy trình chuẩn mực và kết quả thực chiến.'
    }
  };
}
