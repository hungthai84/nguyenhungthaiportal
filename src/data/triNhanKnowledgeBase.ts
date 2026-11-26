import {
  ALL_SAMPLE_QUESTIONS,
  type SampleQuestionItem,
  TRINHAN_SAMPLE_QUESTION_CATEGORIES,
} from './aiSampleQuestions.ts';
import { PROJECTS_DATA } from './projects';

export const TRI_NHAN_FALLBACK_MISSING_VI =
  'Trí Nhân hiện chưa có đủ thông tin xác thực trong hồ sơ đang được cung cấp để trả lời chính xác nội dung này. Bạn có thể tham khảo thêm hồ sơ năng lực của anh Nguyễn Hùng Thái hoặc gửi câu hỏi cụ thể hơn để Trí Nhân hỗ trợ.';

export const TRI_NHAN_FALLBACK_MISSING_EN =
  'Tri Nhan does not currently have enough verified information in the provided portfolio profile to answer this accurately. You can explore Mr. Nguyen Hung Thai’s full capability portfolio or ask a more specific question for Tri Nhan to assist.';

const PORTFOLIO_VERIFIED_FACTS = `
HỒ SƠ NĂNG LỰC CHÍNH THỨC CỦA ANH NGUYỄN HÙNG THÁI (NGUỒN XÁC THỰC TỪ WEBSITE PORTFOLIO):

1. Thông tin cá nhân & định vị:
- Họ và tên: Nguyễn Hùng Thái (sinh ngày 22/06/1984, tuổi Giáp Tý).
- Nơi ở hiện tại: Quận 7, TP. Hồ Chí Minh; Quê quán: TP. Mỹ Tho, Tỉnh Tiền Giang.
- Vị trí mục tiêu & định vị: Trưởng phòng Dịch vụ Khách hàng (Head of CS) / Giám đốc Trải nghiệm Khách hàng (CX / CS Director) / Chuyên gia Vận hành Contact Center & Chuyển đổi số.
- Kinh nghiệm: Hơn 22 năm kinh nghiệm thực chiến (bắt đầu từ năm 2002–2003 đến nay 2026+) tại 8+ môi trường doanh nghiệp hàng đầu.
- Kênh liên hệ chính thức: Email hungthai84@gmail.com | Điện thoại & Zalo: +84 0909097882 | LinkedIn: linkedin.com/in/hungthai84 | Website: nguyenhungthai.powerservice.one.
- Triết lý phụng sự: "Hiệu quả – Nhân văn – Bền vững", cân bằng giữa Quy trình chuẩn (SOP/KPI/SLA) và sự Thấu cảm con người; chuyển dịch CSKH từ trung tâm chi phí (Cost Center) thành trung tâm tạo giá trị (Value Center).
- Giá trị cốt lõi duy nhất: "Thấu cảm".

2. Lịch sử công tác & quy mô thực chiến:
- 2003 – 2007 (bắt đầu từ 2002): Công ty Viễn thông MobiFone – Nhân viên CSKH (12 nhân sự nhóm). Học bài bản nghiệp vụ tổng đài viễn thông, xử lý khiếu nại, Outbound khảo sát, hướng dẫn nhân viên mới, đạt Chứng nhận Tổng đài viên xuất sắc MobiFone.
- 2007 – 2011: Công ty Viễn Liên V247 (Viễn thông quốc tế Hoa Kỳ - VN) – Giám sát Chăm sóc Khách hàng (12 nhân sự trực tiếp). Vận hành đa kênh 24/7 (Email, Fax, Phone, Live Chat), QA Call Scoring, cam kết SLA >= 95%–98%.
- 2011 – 2013: Công ty CPTT Băng Rộng Cuộc Sống LBC (LBC HTVC Cable TV) – Trưởng phòng Dịch vụ Khách hàng (12 nhân sự trực tiếp). Lần đầu đảm nhiệm vai trò Trưởng phòng CSKH toàn diện: chuẩn hóa SOP 100%, khảo sát CSAT 92%, kiểm soát ngân sách phòng ban, phối hợp Marketing chăm sóc VIP.
- 2013 – 2016: Công ty Cổ phần Việt Nam eSport (VED, Garena, GCafe, Shopee, AirPay/ShopeePay) – Trưởng phòng CSKH. Điều hành bộ máy lớn nhất ~130 nhân sự (chi tiết 129 nhân sự trực tiếp, gồm >80 nhân sự Game Support, CSKH, Fraud), xử lý >50.000 ticket/ngày, phản hồi Chat/Ticket < 30 giây, CSAT 96%. Khởi tạo nền tảng CSKH giai đoạn đầu cho Shopee, AirPay, GCafe, Liên Minh Huyền Thoại, Liên Quân Mobile; kiến trúc CRM nội bộ Garena Customer Desk.
- 2016 – 2018: Công ty Bảo hiểm Nhân thọ Prudential Vietnam – Trưởng phòng Call Center (12 nhân sự trực tiếp + >40 chuyên viên tư vấn). Quản lý Call Center trên nền tảng AS400, tiên phong quy trình tư vấn Video Call, kết nối E-commerce, hoàn thiện BCP ứng phó sự cố, rút ngắn 45% thời gian xử lý yêu cầu hợp đồng, đạt FCR > 92%, SLA 95%, tăng Retention 15%.
- 2018 – 2021: Công ty Cổ phần Mservice (Ví điện tử MoMo) – Trưởng phòng CSKH. Điều hành 60 nhân sự nội bộ + hàng trăm/hơn 150 nhân sự BPO (như Mắt Bão), phục vụ >30 triệu người dùng ví. Chuẩn hóa SOP 100%, CSAT/NPS đạt 98.2%, SLA BPO 98.6%, xử lý khủng hoảng hệ thống (giảm 70% cuộc gọi chờ), ứng dụng RPA rút ngắn thời gian hoàn tiền từ 48 giờ xuống ~90 giây.
- 2023 – 2024: Công ty Cổ phần Công nghệ Finviet (Ví điện tử ECO) – Trưởng phòng CSKH (17 nhân sự trực tiếp). Thiết lập mô hình CSKH Omnichannel, triển khai AI Bot CSKH 24/7, kiểm soát gian lận tài chính và tra soát giao dịch.
- 2026+ đến hiện tại: Sẵn sàng cho thử thách Trưởng phòng CSKH (Head of CX / CS Director), dẫn dắt CX Strategy 2026+, Generative AI, RAG, Automation CRM và hệ sinh thái Power Service (12 hệ thống: SDP, ERP, CRM, HRM, BPM, OKR, CLP, LMS, CSC, BI Dashboard, AI Assistant, POS).

3. Học vấn & Chứng chỉ (14 văn bằng/chứng chỉ):
- Cử nhân Công nghệ Thông tin – Trường ĐH Công nghệ Sài Gòn (STU, 2007).
- Quản trị mạng Cisco CCNA (Nhất Nghệ, 2006) & Quản trị máy chủ MCSA (Nhất Nghệ, 2005).
- Nghiệp vụ Tổng đài xuất sắc MobiFone (2007).
- Bộ 4 chứng nhận VietnamWorks (2013): Kỹ năng Đào tạo, Kỹ năng Thuyết trình, Kỹ năng Phỏng vấn (BEI/STAR), Kỹ năng Tuyển dụng.
- Dale Carnegie & VED: Quản lý Cấp trung (2014) & Quản lý Cấp cao (2015).
- Prudential Vietnam: Quản lý Dự án (2016), Quản trị Rủi ro (2017), Phân tích Dữ liệu (2019).
- Tự học & thực hành 2026: Thiết kế Web hiện đại, UI/UX Responsive & AI Agent Workflows.

4. Năng lực & Chỉ số nổi bật:
- Chỉ số cảm xúc & trải nghiệm: CSAT, NPS, CES (CSAT đạt 96%–99% tùy giai đoạn).
- Chỉ số hiệu quả vận hành: FCR (>92%), SLA (>95%–98.6%), AHT, RPA hoàn tiền ~90 giây, thời gian chờ Chat < 30 giây.
- Ngôn ngữ: Tiếng Việt (bản xứ), Tiếng Anh (giao tiếp văn phòng 60%), kết hợp công cụ dịch thuật & trợ lý AI thời gian thực.
`.trim();

function buildProjectsKnowledgeBlock(): string {
  return PROJECTS_DATA.map((proj) => {
    const actions = (proj.star?.actions || [])
      .map((a) => `    + ${a.step} - ${a.title}: ${a.desc}`)
      .join('\n');
    const results = (proj.star?.results || [])
      .map((r) => `    + ${r}`)
      .join('\n');
    return `[Dự án ${proj.code || proj.number}: ${proj.title}]
  - Nhóm: ${proj.groupTitle} | Vai trò của anh Nguyễn Hùng Thái: ${proj.role}
  - Tóm tắt: ${proj.description}
  - Bối cảnh & Thách thức: ${proj.star?.situation || ''}
  - Phương pháp tiếp cận: ${proj.star?.approach || ''}
  - Các bước thực hiện chính:
${actions}
  - Kết quả đạt được:
${results}`;
  }).join('\n\n');
}

function buildQaReferenceBlock(): string {
  return TRINHAN_SAMPLE_QUESTION_CATEGORIES.map((cat) => {
    const itemsText = cat.items
      .map((item) => `  - Câu ${item.number}: Hỏi: "${item.question}" | Đáp: ${item.answer}`)
      .join('\n');
    return `[Chủ đề ${cat.code}: ${cat.title}]\n${itemsText}`;
  }).join('\n\n');
}

export function buildTriNhanSystemPrompt(language: 'vi' | 'en' = 'vi'): string {
  const qaBlock = buildQaReferenceBlock();
  const projectsBlock = buildProjectsKnowledgeBlock();
  const langDirective =
    language === 'en'
      ? 'Respond in clear, natural, professional English. Always keep proper names unchanged (Trí Nhân, Nguyễn Hùng Thái, MobiFone, V247, LBC, HTVC, Garena, VED, Shopee, Prudential Vietnam, MoMo, Finviet, Ví ECO, Power Service).'
      : 'Trả lời bằng tiếng Việt tự nhiên, lịch sự, chuyên nghiệp và truyền cảm hứng. Không dùng các đoạn tiêu đề hoặc từ khóa viết hoa toàn bộ (tránh lạm dụng chữ IN HOA toàn bộ).';

  return `
Bạn tên là **Trí Nhân** – Trợ lý AI chính thức trên website Portfolio cá nhân của anh **Nguyễn Hùng Thái**.

VAI TRÒ & XƯNG HÔ (BẮT BUỘC TUYỆT ĐỐI):
1. Bạn là AI đại diện giới thiệu và chia sẻ thông tin về anh Nguyễn Hùng Thái cho khách tham quan, nhà tuyển dụng hoặc đối tác.
2. Khi nói về bản thân AI: luôn xưng là **"Trí Nhân"** (không xưng là anh Thái).
3. Khi nhắc đến anh Nguyễn Hùng Thái: luôn dùng **ngôi thứ ba** ("anh Nguyễn Hùng Thái", "anh Hùng Thái", hoặc "anh Thái"). Tuyệt đối KHÔNG viết "Tôi từng làm ở MobiFone" hay "Kinh nghiệm của tôi là..." (chỉ dùng ngôi thứ nhất của anh nếu trích dẫn nguyên văn câu nói trong dấu ngoặc kép kèm dẫn nguồn).

PHONG CÁCH TRẢ LỜI:
- Thân thiện, điềm đạm, chuyên nghiệp, am hiểu sâu sắc về Quản trị Trải nghiệm Khách hàng (CX), Dịch vụ Khách hàng (CSKH), Contact Center, CRM và AI/Tự động hóa.
- Mở đầu linh hoạt theo đúng ngữ cảnh câu hỏi (không lặp lại cùng một câu chào máy móc ở mỗi lượt).
- Trình bày mạch lạc, dễ đọc trên màn hình chat: đoạn ngắn gọn, gạch đầu dòng rõ ý khi cần liệt kê, nhấn mạnh ý chính bằng **in đậm** vừa phải.
- Nếu là câu hỏi về dự án thực chiến hoặc xử lý tình huống/khủng hoảng (như khủng hoảng tại MoMo, triển khai RPA, CRM, AI Bot...), hãy trình bày rõ ràng theo 4 bước **Mô hình STAR**: Tình huống (Situation), Nhiệm vụ (Task), Hành động (Action), Kết quả (Result).
- Tận dụng lịch sử hội thoại để hiểu câu hỏi nối tiếp (follow-up) của người dùng.
- ${langDirective}

NGUYÊN TẮC TRUNG THỰC & CHỐNG BỊA ĐẶT (TUYỆT ĐỐI):
- CHỈ sử dụng các sự kiện, số liệu, tên công ty, chức danh, năm công tác, chứng chỉ và quan điểm có trong phần DỮ LIỆU XÁC THỰC dưới đây.
- KHÔNG ĐƯỢC tự bịa thêm tên công ty, dự án, giải thưởng, chứng chỉ, bằng cấp, số liệu hoặc thông tin cá nhân ngoài tài liệu.
- Nếu câu hỏi nằm ngoài dữ liệu được cung cấp hoặc hỏi thông tin chưa có xác thực (ví dụ: mức lương mong muốn cụ thể, địa chỉ nhà riêng chi tiết, tên dự án không có trong hồ sơ, câu hỏi không liên quan tới hồ sơ năng lực...), hãy trả lời thẳng thắn, lịch sự:
  "${language === 'en' ? TRI_NHAN_FALLBACK_MISSING_EN : TRI_NHAN_FALLBACK_MISSING_VI}"

${PORTFOLIO_VERIFIED_FACTS}

HỆ THỐNG 21 DỰ ÁN THỰC CHIẾN CHÍNH THỨC CỦA ANH NGUYỄN HÙNG THÁI:
${projectsBlock}

BỘ 47 CÂU HỎI – TRẢ LỜI CHUYÊN SÂU CHÍNH THỨC:
${qaBlock}
`.trim();
}

export interface VerifiedFallbackResult {
  reply: string;
  matchedTitle?: string;
  matchedQuestionId?: number;
}

function normalizeVietnamese(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function findVerifiedFallbackAnswer(
  query: string,
  language: 'vi' | 'en' = 'vi'
): VerifiedFallbackResult {
  const raw = query.trim();
  const norm = raw.toLowerCase();
  const normAscii = normalizeVietnamese(raw);

  // 1. Exact or near-exact match against the 47 verified questions
  const exact = ALL_SAMPLE_QUESTIONS.find(
    (item) =>
      item.question.toLowerCase() === norm ||
      item.title.toLowerCase() === norm ||
      norm.includes(item.question.toLowerCase()) ||
      normalizeVietnamese(item.question) === normAscii
  );
  if (exact) {
    return {
      matchedQuestionId: exact.id,
      matchedTitle: exact.title,
      reply: `Trí Nhân xin chia sẻ thông tin về **${exact.title.replace(/^\d+\.\s*/, '')}** của anh Nguyễn Hùng Thái:\n\n${exact.answer}`,
    };
  }

  // 2. Match explicit question number ("câu 18", "18")
  const numMatch = norm.match(/^(?:câu\s*|question\s*|#)?(\d{1,2})$/i);
  if (numMatch) {
    const idNum = Number.parseInt(numMatch[1], 10);
    const byId = ALL_SAMPLE_QUESTIONS.find((item) => item.id === idNum);
    if (byId) {
      return {
        matchedQuestionId: byId.id,
        matchedTitle: byId.title,
        reply: `Trí Nhân xin gửi nội dung **Câu ${byId.number}: ${byId.question}**\n\n${byId.answer}`,
      };
    }
  }

  // 3. Keyword scoring over 47 Q&As
  const tokens = normAscii
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  let bestItem: SampleQuestionItem | null = null;
  let bestScore = 0;

  for (const item of ALL_SAMPLE_QUESTIONS) {
    const haystack = normalizeVietnamese(`${item.title} ${item.question} ${item.answer}`);
    let score = 0;
    for (const tok of tokens) {
      if (haystack.includes(tok)) {
        score += tok.length >= 4 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore >= 4) {
    return {
      matchedQuestionId: bestItem.id,
      matchedTitle: bestItem.title,
      reply: `Theo hồ sơ năng lực của anh Nguyễn Hùng Thái, Trí Nhân xin chia sẻ:\n\n${bestItem.answer}`,
    };
  }

  // 4. In-depth Project Query Matching (21 projects in PROJECTS_DATA)
  // Check exact project code match like "1.1", "dự án 1.1", "p1_1", "4.3", "dự án rpa", "dự án crm", etc.
  const codeMatch = norm.match(/(?:dự án|project|code|mã)?\s*([1-5]\.[1-6])/i);
  const targetCode = codeMatch ? codeMatch[1] : null;

  let matchedProject = targetCode
    ? PROJECTS_DATA.find((p) => p.code === targetCode || p.number === targetCode)
    : null;

  if (!matchedProject) {
    // Keyword-based project matching
    if (normAscii.includes('rpa') || normAscii.includes('hoan tien') || normAscii.includes('tu dong hoa')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p2_3') || null;
    } else if (normAscii.includes('crm') || normAscii.includes('ho so 360')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p4_1') || null;
    } else if (normAscii.includes('cjm') || normAscii.includes('hanh trinh khach hang')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p3_1') || null;
    } else if (normAscii.includes('voc') || normAscii.includes('tieng noi khach hang') || normAscii.includes('phan hoi')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p3_3') || null;
    } else if (normAscii.includes('chatbot') || normAscii.includes('chat bot') || normAscii.includes('ai bot') || normAscii.includes('voicebot')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p4_4') || null;
    } else if (normAscii.includes('bpo') || normAscii.includes('doi tac bpo')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p2_4') || null;
    } else if (normAscii.includes('visual sop') || normAscii.includes('chuan hoa sop')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p2_1') || null;
    } else if (normAscii.includes('academy') || normAscii.includes('dao tao truc tuyen') || normAscii.includes('lms')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p5_1') || null;
    } else if (normAscii.includes('copc') || normAscii.includes('customer centric') || normAscii.includes('van hoa phung su')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p5_4') || null;
    } else if (normAscii.includes('omnichannel') || normAscii.includes('da kenh')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p2_2') || null;
    } else if (normAscii.includes('okr') || normAscii.includes('kpi phong')) {
      matchedProject = PROJECTS_DATA.find((p) => p.id === 'p1_2') || null;
    }
  }

  if (matchedProject) {
    const p = matchedProject;
    const actionsList = (p.star?.actions || [])
      .map((a) => `- **${a.step} · ${a.title}**: ${a.desc}`)
      .join('\n');
    const resultsList = (p.star?.results || [])
      .map((r) => `- ✓ ${r}`)
      .join('\n');

    const replyVi = `Trí Nhân xin chia sẻ thông tin chuyên sâu về **Dự án ${p.code || p.number}: ${p.title}** của anh Nguyễn Hùng Thái:

- **Nhóm dự án**: ${p.groupTitle}
- **Vai trò của anh Thái**: ${p.role}
- **Mục tiêu cốt lõi**: ${p.tagline || p.description}

### 1. Bối cảnh & Thách thức (Situation)
${p.star?.situation || p.description}

### 2. Phương pháp tiếp cận & Kiến trúc (Approach)
${p.star?.approach || 'Áp dụng quản trị dữ liệu, chuẩn hóa quy trình và lấy trải nghiệm khách hàng làm trung tâm.'}

### 3. Các hạng mục hành động chính (Actions)
${actionsList}

### 4. Kết quả đạt được (Results)
${resultsList}

> *Bạn có thể xem bản đồ tư duy (Mindmap) và sơ đồ kiến trúc trực quan của dự án này tại **Mục Thực chiến (Tab 7)** trên thanh menu!*`;

    const replyEn = `Tri Nhan is delighted to provide in-depth details on **Project ${p.code || p.number}: ${p.title}** by Mr. Nguyen Hung Thai:

- **Project Group**: ${p.groupTitle}
- **Role**: ${p.role}
- **Core Value**: ${p.tagline || p.description}

### 1. Situation & Challenges
${p.star?.situation || p.description}

### 2. Approach & Architecture
${p.star?.approach || 'Data-driven governance, SOP standardization, and customer-centric design.'}

### 3. Key Actions
${actionsList}

### 4. Achievements & Results
${resultsList}

> *You can also inspect the visual Mindmap and detailed architecture in the **Projects View (Tab 7)**!*`;

    return {
      matchedTitle: `Dự án ${p.code || p.number} · ${p.title}`,
      reply: language === 'en' ? replyEn : replyVi,
    };
  }

  // General project overview inquiry
  if (
    normAscii.includes('du an') ||
    normAscii.includes('projects') ||
    normAscii.includes('thuc chien')
  ) {
    const summaryVi = `Trí Nhân xin chia sẻ hệ thống **21 Dự án thực chiến tiêu biểu** được đúc kết qua hơn 22 năm quản trị CSKH & CX của anh Nguyễn Hùng Thái:

1. **Chiến lược & Cấu trúc Vận hành** (Dự án 1.1 – 1.3): Xây dựng phòng CSKH chuyên nghiệp, Thiết lập OKR/KPI phòng ban, Quản trị dự án cải tiến.
2. **Chuẩn hóa Quy trình & Vận hành Xuất sắc** (Dự án 2.1 – 2.5): Visual SOP chuẩn hóa, Kênh Omnichannel, Tự động hóa RPA MoMo, Quản trị đối tác BPO, Ứng phó khủng hoảng.
3. **Thiết kế Trải nghiệm Khách hàng - CX** (Dự án 3.1 – 3.5): Bản đồ hành trình CJM, Phân tích tiếng nói khách hàng VoC, Kiểm soát rời bỏ, Đo lường CSAT/NPS/CES, Văn hóa Customer-Centric.
4. **Công nghệ, Dữ liệu & AI** (Dự án 4.1 – 4.5): Nền tảng CRM 360°, Báo cáo phân tích BI, RPA tự động hóa hoàn tiền, Chatbot AI Bot 24/7, AI Copilot & Auto-QA.
5. **Đào tạo, Phát triển & Hệ sinh thái** (Dự án 5.1 – 5.3): CS Academy, Khung năng lực ASK, Trung tâm hỗ trợ tự phục vụ.

Bạn có thể hỏi chi tiết bất kỳ dự án nào (ví dụ: *"Dự án 1.1"*, *"Dự án RPA"*, *"Dự án CRM"* hoặc *"Dự án VoC"*) để Trí Nhân giải thích cụ thể theo mô hình STAR nhé!`;

    const summaryEn = `Tri Nhan is pleased to introduce Mr. Nguyen Hung Thai’s **21 practical flagship projects** across 5 strategic pillars:
1. **Strategy & Operations Structure** (1.1 - 1.3)
2. **SOP & Operational Excellence** (2.1 - 2.5)
3. **Customer Experience (CX) Design** (3.1 - 3.5)
4. **Tech, Data & AI Systems** (4.1 - 4.5)
5. **CS Academy & Service Culture** (5.1 - 5.3)

Feel free to ask about any specific project (e.g., *"Project 1.1"*, *"RPA project"*, *"CRM platform"* or *"VoC project"*) for complete STAR case studies!`;

    return {
      matchedTitle: 'Hệ thống 21 Dự án Thực chiến',
      reply: language === 'en' ? summaryEn : summaryVi,
    };
  }

  // 5. Verified profile summary fallback for general introduction/contact queries
  if (
    normAscii.includes('lien he') ||
    normAscii.includes('email') ||
    normAscii.includes('zalo') ||
    normAscii.includes('so dien thoai') ||
    normAscii.includes('contact')
  ) {
    return {
      matchedTitle: 'Thông tin liên hệ anh Nguyễn Hùng Thái',
      reply:
        language === 'en'
          ? 'You can connect directly with Mr. Nguyen Hung Thai via Email: **hungthai84@gmail.com**, Phone & Zalo: **+84 0909097882**, LinkedIn: **linkedin.com/in/hungthai84**, or explore his portfolio at **nguyenhungthai.powerservice.one**.'
          : 'Bạn có thể kết nối trực tiếp với anh Nguyễn Hùng Thái qua:\n- Email: **hungthai84@gmail.com**\n- Điện thoại & Zalo: **+84 0909097882**\n- LinkedIn: **linkedin.com/in/hungthai84**\n- Website chính thức: **nguyenhungthai.powerservice.one**',
    };
  }

  if (
    normAscii.includes('hung thai') ||
    normAscii.includes('kinh nghiem') ||
    normAscii.includes('momo') ||
    normAscii.includes('garena') ||
    normAscii.includes('shopee') ||
    normAscii.includes('prudential') ||
    normAscii.includes('mobifone') ||
    normAscii.includes('finviet') ||
    normAscii.includes('cskh')
  ) {
    return {
      matchedTitle: 'Tổng quan hồ sơ anh Nguyễn Hùng Thái',
      reply:
        language === 'en'
          ? 'Tri Nhan is pleased to share: Mr. Nguyen Hung Thai (born 1984) has **22+ years of practical leadership experience** in Customer Experience & Contact Center Operations across **MobiFone, V247, LBC HTVC, VED (Garena/Shopee), Prudential Vietnam, MoMo, and Finviet (ECO Wallet)**, leading teams up to **130 internal staff and 150+ BPO seats**.'
          : 'Trí Nhân xin chia sẻ tổng quan về anh Nguyễn Hùng Thái: Anh sinh năm 1984 và có hơn **22 năm kinh nghiệm thực chiến** quản trị Dịch vụ & Trải nghiệm Khách hàng (CX) qua các đơn vị **MobiFone, V247, LBC HTVC, VED (Garena/Shopee), Prudential Việt Nam, Ví MoMo và Finviet (Ví ECO)**, từng điều hành quy mô tới **130 nhân sự nội bộ và hơn 150 vị trí BPO**.\n\nBạn có thể nhấn nút **Danh mục** ở góc trái khung nhập để chọn nhanh chủ đề hoặc hỏi cụ thể hơn về từng giai đoạn nhé!',
    };
  }

  // 6. Honest fallback when question is outside verified scope
  return {
    reply: language === 'en' ? TRI_NHAN_FALLBACK_MISSING_EN : TRI_NHAN_FALLBACK_MISSING_VI,
  };
}
