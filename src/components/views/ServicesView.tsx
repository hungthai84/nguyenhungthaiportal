'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/domains';
import { DomainData, SiteTheme } from '@/types';
import { TechStackExplorerModal } from '@/components/domains/TechStackExplorerModal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { formatCardTitle, formatSentenceFourWords } from '@/lib/utils';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';

export interface ServicesViewProps {
  currentTheme?: SiteTheme;
}

// Database chứa thông tin chuyên môn chi tiết từ file đính kèm
const SERVICES_DATA_DETAILS: Record<string, {
  num: string;
  title: string;
  kicker: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  tag1: string;
  tag2: string;
  brandMark: string;
  summary: string;
  metrics: { val: string; label: string }[];
  overview: string;
  architecture: string[];
  role: string;
  technologies: string[];
  partners: string[];
}> = {
  '01': {
    num: "01 / 06",
    title: "Viễn thông & Hạ tầng số",
    kicker: "Carrier-Grade Architecture",
    description: "Kiến trúc mạng lõi, hệ thống tính cước thời gian thực (OCS) và nền tảng VAS băng thông rộng.",
    accent: "#1480C0",
    accentSoft: "#EAF5FB",
    accentDeep: "#145B86",
    tag1: "OCS 50M+ Thuê bao",
    tag2: "High Availability 99.999%",
    brandMark: "TEL",
    summary: "Thiết kế và vận hành các hệ thống viễn thông lõi quy mô lớn, phục vụ hàng chục triệu thuê bao đồng thời với độ sẵn sàng tuyệt đối.",
    metrics: [
      { val: "50M+", label: "Thuê bao hoạt động" },
      { val: "99.999%", label: "Độ sẵn sàng hệ thống" },
      { val: "< 10ms", label: "Độ trễ xử lý OCS" },
      { val: "24/7", label: "Giám sát & Vận hành" }
    ],
    overview: "Giải pháp hạ tầng viễn thông tích hợp hệ thống Online Charging System (OCS), Policy Control (PCRF/PCF) và VAS Gateway hiệu suất cao, đáp ứng tiêu chuẩn khắt khe của nhà mạng viễn thông hàng đầu.",
    architecture: [
      "Distributed Micro-services trên nền tảng Kubernetes Enterprise",
      "In-memory caching cluster với Redis Enterprise và Hazelcast",
      "Hệ thống phân tích log thời gian thực bằng Elastic & Kafka",
      "Bảo mật tầng mạng chống DDoS và mã hóa dữ liệu đầu cuối"
    ],
    role: "Trực tiếp định hướng kiến trúc tổng thể, tối ưu hóa băng thông truyền dẫn và đồng bộ hóa dữ liệu giữa các trung tâm dữ liệu (Active-Active Datacenter).",
    technologies: ["C++", "Golang", "Java Spring Boot", "Kafka", "Oracle DB", "Redis", "Kubernetes", "Docker", "Diameter Protocol", "VoIP"],
    partners: ["Viettel", "VNPT", "MobiFone", "Ericsson", "Nokia"]
  },
  '02': {
    num: "02 / 06",
    title: "Thương mại Điện tử & Bán lẻ",
    kicker: "High-Traffic Omni-Channel",
    description: "Hệ thống Omni-channel, quản lý kho thông minh và nền tảng flashsale chịu tải cao.",
    accent: "#EC7D21",
    accentSoft: "#FFF3E8",
    accentDeep: "#A84F0E",
    tag1: "100k+ TPS Flashsale",
    tag2: "Realtime Inventory",
    brandMark: "COM",
    summary: "Xây dựng hệ thống sàn thương mại điện tử và chuỗi bán lẻ đa kênh với khả năng chịu tải hàng trăm nghìn giao dịch mỗi giây trong các đợt flashsale lớn.",
    metrics: [
      { val: "100k+", label: "TPS Flashsale peak" },
      { val: "99.98%", label: "Tỷ lệ đơn hàng thành công" },
      { val: "0ms", label: "Đồng bộ kho thực tế" },
      { val: "3x", label: "Tăng trưởng tốc độ tải trang" }
    ],
    overview: "Hệ thống kiến trúc hướng sự kiện (Event-driven Architecture) kết hợp CQRS Pattern giúp tách biệt tối đa luồng đọc và ghi dữ liệu trong các chiến dịch mua sắm quy mô quốc gia.",
    architecture: [
      "Distributed Locking cho hệ thống giới hạn sản phẩm flashsale",
      "Event Sourcing qua Apache Kafka đảm bảo không thất lạc giao dịch",
      "Elasticsearch cluster tối ưu hóa tìm kiếm sản phẩm hàng triệu bản ghi",
      "CDN Edge Computing giảm tải 80% request đến máy chủ gốc"
    ],
    role: "Chủ trì thiết kế hệ thống xử lý đặt hàng đồng thời, giải quyết triệt để bài toán quá tải kho hàng và phân phối tải tự động.",
    technologies: ["Node.js", "Golang", "PostgreSQL", "MongoDB", "Kafka", "Redis", "Elasticsearch", "AWS CloudFront", "Docker"],
    partners: ["Shopee", "Lazada", "Tiki", "Central Retail", "VinMart"]
  },
  '03': {
    num: "03 / 06",
    title: "Bảo hiểm & InsurTech",
    kicker: "Digital Insurance Transformation",
    description: "Số hóa quy trình thẩm định, quản lý hợp đồng điện tử tự động và cổng bồi thường thông minh.",
    accent: "#E64C72",
    accentSoft: "#FFF0F3",
    accentDeep: "#A92F50",
    tag1: "Xử lý HĐ Tự động",
    tag2: "Bảo mật Chuẩn quốc tế",
    brandMark: "INS",
    summary: "Đổi mới quy trình bảo hiểm truyền thống bằng nền tảng số hóa toàn diện từ khâu định giá, phát hành hợp đồng đến tự động hóa bồi thường.",
    metrics: [
      { val: "-60%", label: "Thời gian phát hành hợp đồng" },
      { val: "100%", label: "Số hóa quy trình ký số" },
      { val: "AI", label: "Thẩm định bồi thường tự động" },
      { val: "24/7", label: "Cổng thông tin khách hàng" }
    ],
    overview: "Nền tảng InsurTech tích hợp AI OCR trích xuất thông tin giấy tờ tự động, engine tính phí bảo hiểm linh hoạt theo thời gian thực và kết nối đa kênh thanh toán bảo hiểm.",
    architecture: [
      "Micro-frontend architecture cho portal đại lý và khách hàng",
      "AI/ML pipeline tích hợp OCR & phát hiện gian lận bảo hiểm",
      "Hệ thống ký số HSM tập trung đạt chuẩn pháp lý",
      "Blockchain ledger lưu trữ chứng thư bảo hiểm minh bạch"
    ],
    role: "Kiến trúc sư giải pháp chuyển đổi số, chuẩn hóa API kết nối với các đối tác tái bảo hiểm và cơ quan quản lý nhà nước.",
    technologies: ["Java", "Python AI", "ReactJS", "PostgreSQL", "Docker", "Kubernetes", "HSM Sign", "RESTful API", "OAuth2"],
    partners: ["Bảo Việt", "Dai-ichi Life", "Prudential", "Manulife", "PTI"]
  },
  '04': {
    num: "04 / 06",
    title: "Thể thao Điện tử & Gaming",
    kicker: "Low-Latency Live Ecosystem",
    description: "Nền tảng giải đấu trực tuyến quy mô lớn, hệ thống matchmaking và streaming độ trễ cực thấp.",
    accent: "#6353B5",
    accentSoft: "#F1EFFB",
    accentDeep: "#40358A",
    tag1: "Low Latency Streaming",
    tag2: "Tournament Automation",
    brandMark: "ESP",
    summary: "Phát triển hạ tầng tổ chức giải đấu thể thao điện tử quy mô lớn, hệ thống matchmaking thông minh và truyền hình trực tiếp độ trễ thấp.",
    metrics: [
      { val: "< 1s", label: "Độ trễ streaming trực tiếp" },
      { val: "50k+", label: "Người chơi trực tuyến đồng thời" },
      { val: "99.9%", label: "Độ ổn định máy chủ game" },
      { val: "Auto", label: "Ghép cặp trận đấu tự động" }
    ],
    overview: "Hệ sinh thái e-sports tích hợp quản lý giải đấu, thống kê chỉ số ingame thời gian thực qua API nhà phát hành và hệ thống tương tác khán giả tương tác cao.",
    architecture: [
      "WebSocket cluster quản lý kết nối thời gian thực cho hàng vạn người xem",
      "Matchmaking microservice tối ưu Elo rating và ping khu vực",
      "Video streaming pipeline tối ưu hóa WebRTC & HLS",
      "Distributed database cho bảng xếp hạng và profile game thủ"
    ],
    role: "Thiết kế hạ tầng mạng và server xử lý thời gian thực, đảm bảo không có độ trễ trong các trận đấu quan trọng.",
    technologies: ["Node.js", "Golang", "WebSocket", "WebRTC", "Redis", "PostgreSQL", "Docker", "AWS MediaLive", "React"],
    partners: ["Garena", "Riot Games", "VNGGames", "ESL", "Vietnam Esports"]
  },
  '05': {
    num: "05 / 06",
    title: "Cổng thanh toán & Ví điện tử",
    kicker: "Secure Financial Switching",
    description: "Hạ tầng thanh toán đạt chuẩn PCI-DSS, tích hợp đa ngân hàng và AI chống gian lận giao dịch.",
    accent: "#3BB8E6",
    accentSoft: "#EAF8FD",
    accentDeep: "#16799F",
    tag1: "PCI-DSS Level 1",
    tag2: "Realtime Fraud Detection",
    brandMark: "PAY",
    summary: "Xây dựng cổng thanh toán trung gian và ví điện tử đạt chuẩn bảo mật quốc tế PCI-DSS Level 1, xử lý hàng triệu giao dịch an toàn mỗi ngày.",
    metrics: [
      { val: "PCI-DSS", label: "Chuẩn bảo mật cấp độ cao nhất" },
      { val: "< 2s", label: "Thời gian hoàn tất giao dịch" },
      { val: "99.99%", label: "Thông suốt kết nối ngân hàng" },
      { val: "AI", label: "Chống gian lận thời gian thực" }
    ],
    overview: "Hệ thống chuyển mạch tài chính kết nối trực tiếp NAPAS, các ngân hàng lớn và cổng thanh toán quốc tế với cơ chế mã hóa tokenization tuyệt đối an toàn.",
    architecture: [
      "Core Payment Engine xử lý giao dịch bất đồng bộ qua message queue",
      "HSM (Hardware Security Module) mã hóa thông tin thẻ và giao dịch",
      "AI Fraud Detection chấm điểm rủi ro giao dịch trong 50ms",
      "Báo cáo tài chính tự động chuẩn hóa theo chuẩn kế toán"
    ],
    role: "Trực tiếp thiết kế sơ đồ luồng tiền (fund flow), kiến trúc an toàn thông tin và giải pháp tích hợp đa ngân hàng.",
    technologies: ["Java Spring Boot", "Golang", "Oracle DB", "Kafka", "HSM Hardware", "Docker", "ISO 8583", "gRPC"],
    partners: ["NAPAS", "MoMo", "ZaloPay", "Vietcombank", "Techcombank", "Visa / Mastercard"]
  },
  '06': {
    num: "06 / 06",
    title: "Hệ thống Doanh nghiệp & Cloud",
    kicker: "Enterprise Cloud & Microservices",
    description: "Kiến trúc Microservices, Kubernetes đa vùng và tối ưu hóa chi phí hạ tầng Cloud Enterprise.",
    accent: "#50B347",
    accentSoft: "#EFF9ED",
    accentDeep: "#28752C",
    tag1: "Kubernetes Multi-region",
    tag2: "Cloud Cost Optimization",
    brandMark: "SYS",
    summary: "Tư vấn và triển khai kiến trúc Microservices, tự động hóa quy trình CI/CD và tối ưu chi phí vận hành hạ tầng Cloud cho các tập đoàn lớn.",
    metrics: [
      { val: "-35%", label: "Chi phí vận hành Cloud" },
      { val: "Zero", label: "Downtime khi deploy phiên bản" },
      { val: "100%", label: "Tự động hóa CI/CD pipeline" },
      { val: "Multi", label: "Cloud Strategy (AWS / Azure)" }
    ],
    overview: "Giải pháp chuyển đổi hạ tầng từ Monolithic sang Kubernetes native, kết hợp giám sát tập trung và tự động scale tài nguyên theo tải thực tế.",
    architecture: [
      "Kubernetes multi-cluster management với ArgoCD & Helm",
      "Observability stack hoàn chỉnh (Prometheus, Grafana, Jaeger)",
      "Infrastructure as Code (IaC) với Terraform & Ansible",
      "Zero Trust Network Architecture bảo mật nội bộ doanh nghiệp"
    ],
    role: "Kiến trúc sư trưởng hệ thống hạ tầng, dẫn dắt đội ngũ DevOps và chuẩn hóa quy trình phát triển phần mềm an toàn (DevSecOps).",
    technologies: ["Kubernetes", "Docker", "Terraform", "AWS", "Azure", "Prometheus", "Grafana", "ArgoCD", "Golang", "Linux"],
    partners: ["AWS", "Microsoft Azure", "Google Cloud", "FPT Telecom", "CMC Telecom"]
  }
};

export const ServicesView: React.FC<ServicesViewProps> = ({ currentTheme = 'light-glass' }) => {
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;
  const isDark = themeIsDark || currentTheme === 'dark-neon';
  const isLight = !isDark;

  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(null);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isFilterOpen) {
        setIsFilterOpen(false);
      } else if (selectedDomain && !isTechModalOpen) {
        setSelectedDomain(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen, selectedDomain, isTechModalOpen]);

  // Danh sách bộ lọc phân hệ dịch vụ (6.1 - 6.6)
  const filterCategories = [
    { id: 'ALL', label: isEn ? 'All Services (6)' : 'Tất cả dịch vụ (6)', icon: 'grid' },
    { id: '01', label: isEn ? '6.1 · Telecom Services' : '6.1 · Dịch vụ viễn thông', icon: 'phone' },
    { id: '02', label: isEn ? '6.2 · E-Commerce' : '6.2 · Thương mại điện tử', icon: 'shopping-cart' },
    { id: '03', label: isEn ? '6.3 · Finance & Insurance' : '6.3 · Tài chính bảo hiểm', icon: 'shield-check' },
    { id: '04', label: isEn ? '6.4 · Esports & Gaming' : '6.4 · Thể thao điện tử', icon: 'gamepad-2' },
    { id: '05', label: isEn ? '6.5 · Digital Payments' : '6.5 · Thanh toán điện tử', icon: 'credit-card' },
    { id: '06', label: isEn ? '6.6 · System Architecture' : '6.6 · Xây dựng hệ thống', icon: 'layers' },
  ];

  const filteredDomains =
    activeCategory === 'ALL'
      ? DOMAINS_DATA
      : DOMAINS_DATA.filter((d) => d.id === activeCategory);

  const handleOpenDetail = (domain: DomainData) => {
    SoundEngine.playTap();
    setSelectedDomain(domain);
  };

  // Bộ cấu hình màu sắc & hình ảnh dịch vụ cho 6 thẻ (6.1 - 6.6)
  const getCardVisualConfig = (id: string) => {
    switch (id) {
      case '01': // 6.1. Dịch vụ viễn thông - Blue / Sky
        return {
          accentColor: isLight ? '#0284c7' : '#38bdf8',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f0f7fe 0%, #ddf0fd 30%, #c4e2fa 65%, #beddf9 100%)'
            : 'linear-gradient(135deg, rgba(12, 74, 110, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#93c5fd]/90 hover:border-[#38bdf8]'
            : 'border-sky-400/45 hover:border-sky-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(190, 221, 249, 0.95) 0%, rgba(196, 226, 250, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#0284c7]' : 'text-sky-300',
          pillBg: isLight
            ? 'bg-sky-100/90 border-sky-200/90 text-[#0369a1]'
            : 'bg-sky-950/80 border-sky-500/40 text-sky-200',
          arrowBg: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          arrowShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
          illustrationSrc: 'https://i.ibb.co/4RYYfBvx/D-ch-v-vi-n-th-ng-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_9y00s39y00s39y00.png',
          pillText: 'SLA > 98% · CSAT 96,5% · 24/7/365',
        };
      case '02': // 6.2. Thương mại điện tử - Orange / Warm Amber
        return {
          accentColor: isLight ? '#ea580c' : '#fb923c',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fffcf7 0%, #fef1e2 30%, #fccc9b 65%, #fbd2a6 100%)'
            : 'linear-gradient(135deg, rgba(124, 45, 18, 0.52) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#fdba74]/90 hover:border-[#fb923c]'
            : 'border-orange-400/45 hover:border-orange-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(251, 210, 166, 0.95) 0%, rgba(252, 204, 155, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#ea580c]' : 'text-orange-300',
          pillBg: isLight
            ? 'bg-orange-100/80 border-orange-200/90 text-[#c2410c]'
            : 'bg-orange-950/80 border-orange-500/40 text-orange-200',
          arrowBg: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
          arrowShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542367/Th%C6%B0%C6%A1ng_m%E1%BA%A1i_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069235/Gemini_Generated_Image_6g07kh6g07kh6g07.png',
          pillText: 'Chat < 30s · CSAT 96,5% · Mega-Sale',
        };
      case '03': // 6.3. Tài chính bảo hiểm - Rose / Ruby
        return {
          accentColor: isLight ? '#e11d48' : '#fb7185',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fff7f6 0%, #feeae5 30%, #fdd8cf 65%, #f9b3b1 100%)'
            : 'linear-gradient(135deg, rgba(136, 19, 55, 0.52) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#fca5a5]/90 hover:border-[#f43f5e]'
            : 'border-rose-400/45 hover:border-rose-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(253, 216, 207, 0.95) 0%, rgba(249, 179, 177, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#e11d48]' : 'text-rose-300',
          pillBg: isLight
            ? 'bg-rose-100/80 border-rose-200/90 text-[#be123c]'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200',
          arrowBg: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
          arrowShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542365/D%E1%BB%8Bch_v%E1%BB%A5_b%E1%BA%A3o_hi%E1%BB%83m-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069237/Gemini_Generated_Image_r1a3t4r1a3t4r1a3.png',
          pillText: 'FCR > 92% · SLA 95% · Retention +15%',
        };
      case '04': // 6.4. Thể thao điện tử - Purple / Violet
        return {
          accentColor: isLight ? '#7c3aed' : '#c084fc',
          cardBg: isLight
            ? 'linear-gradient(135deg, #faf8fe 0%, #ede8fe 30%, #d9d0fb 65%, #c5b5f9 100%)'
            : 'linear-gradient(135deg, rgba(88, 28, 135, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#c4b5fd]/90 hover:border-[#a855f7]'
            : 'border-purple-400/45 hover:border-purple-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(217, 208, 251, 0.95) 0%, rgba(157, 126, 243, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#7c3aed]' : 'text-purple-300',
          pillBg: isLight
            ? 'bg-purple-100/80 border-purple-200/90 text-[#5b21b6]'
            : 'bg-purple-950/80 border-purple-500/40 text-purple-200',
          arrowBg: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          arrowShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542366/Game_eSports-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069238/Gemini_Generated_Image_s1e5xks1e5xks1e5.png',
          pillText: '> 50.000 Ticket/ngày · CSAT 96%',
        };
      case '05': // 6.5. Thanh toán điện tử - Indigo / Royal Blue
        return {
          accentColor: isLight ? '#4f46e5' : '#818cf8',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f3f7fe 0%, #e0ebfd 30%, #c1d8fb 65%, #9ec1f7 100%)'
            : 'linear-gradient(135deg, rgba(49, 46, 129, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#a5b4fc]/90 hover:border-[#6366f1]'
            : 'border-indigo-400/45 hover:border-indigo-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(193, 216, 251, 0.95) 0%, rgba(158, 193, 247, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#4338ca]' : 'text-indigo-300',
          pillBg: isLight
            ? 'bg-indigo-100/80 border-indigo-200/90 text-[#3730a3]'
            : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200',
          arrowBg: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
          arrowShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542372/Thanh_to%C3%A1n_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069234/Gemini_Generated_Image_3b9s6n3b9s6n3b9s.png',
          pillText: 'RPA 90 giây · CSAT 98,2% · SLA 98,6%',
        };
      case '06': // 6.6. Xây dựng hệ thống - Mint / Teal Emerald
      default:
        return {
          accentColor: isLight ? '#059669' : '#34d399',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f3fbfa 0%, #dff4f2 30%, #b1dfdd 65%, #abd9d6 100%)'
            : 'linear-gradient(135deg, rgba(6, 78, 59, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#6ee7b7]/90 hover:border-[#10b981]'
            : 'border-emerald-400/45 hover:border-emerald-300',
          ambientGlow:
            'radial-gradient(circle at 75% 50%, rgba(171, 217, 214, 0.95) 0%, rgba(177, 223, 221, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#059669]' : 'text-emerald-300',
          pillBg: isLight
            ? 'bg-emerald-100/80 border-emerald-200/90 text-[#047857]'
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
          arrowBg: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
          arrowShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542368/X%C3%A2y_d%E1%BB%B1ng_h%E1%BB%87_th%E1%BB%91ng-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_i12r2fi12r2fi12r.png',
          pillText: '100% SOP/KPI · Onboarding -65% · Hiệu suất +40%',
        };
    }
  };

  return (
    <div
      id="services-page-container"
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="card"
      data-section-card="true"
      data-element-page="services"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card w-full h-full flex flex-col justify-between p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
    >
      {/* 1. HERO BANNER ĐẦU TRANG DỊCH VỤ */}
      {!selectedDomain && (
        <motion.div
          data-element-type="section"
          data-section-card="true"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
          style={{ padding: '15px', width: '100%', maxWidth: '100%', height: '200px', minHeight: '200px', maxHeight: '200px', borderRadius: '14px' }}
        >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #0f172a 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794041058/Gemini_Generated_Image_lpt3fplpt3fplpt3.png"
            alt="Banner Dịch vụ trọng tâm"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-110 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/75 via-[#0B1220]/25 to-[#0B1220]/55 pointer-events-none" />
        </div>

        {/* Vùng Tiêu Đề */}
        <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <WebIcon
              name="layers"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
            />
            <h1
              className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
              style={{
                color: '#38bdf8',
                fontSize: '22px',
                fontWeight: 700,
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Dịch vụ trọng tâm
            </h1>
          </div>
          <p
            className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;{DOMAINS_INTRO.quote} ♡&quot;
          </p>
        </div>

        {/* Nhóm các nút lại thành 1 filter icon ở bên dưới banner bên trái */}
        <div className="relative z-30 flex items-center justify-between mt-auto pt-2 gap-2" ref={filterMenuRef}>
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
              title="Bộ lọc dịch vụ"
              aria-expanded={isFilterOpen}
              aria-haspopup="listbox"
            >
              <WebIcon
                name="sliders"
                className="w-4 h-4 text-teal-700 dark:text-teal-400 transition-transform group-hover:rotate-45 shrink-0"
              />
              <span>Bộ lọc dịch vụ</span>
              {activeCategory !== 'ALL' && (
                <span className="px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-500/50 text-[10px] font-mono text-teal-900 dark:text-teal-200 font-bold">
                  {DOMAINS_DATA.find((d) => d.id === activeCategory)?.serviceCode || activeCategory}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={`w-3.5 h-3.5 text-teal-700 dark:text-teal-400 transition-transform duration-200 shrink-0 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  id="services-filter-dropdown"
                  role="listbox"
                  style={{ background: 'var(--bg-popup)' }}
                  className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 rounded-[14px] bg-white/98 dark:bg-[#111827]/96 border border-teal-200 dark:border-[#334155] shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-2xl py-2 px-2 z-50 flex flex-col gap-1 text-slate-800 dark:text-[#E2E8F0]"
                >
                  {filterCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          SoundEngine.playTap();
                          if (cat.id === 'ALL') {
                            setActiveCategory('ALL');
                            setSelectedDomain(null);
                          } else {
                            setActiveCategory(cat.id);
                            const found = DOMAINS_DATA.find((d) => d.id === cat.id);
                            if (found) setSelectedDomain(found);
                          }
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left ${
                          isActive
                            ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-400/50 shadow-xs'
                            : 'text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <WebIcon name={cat.icon} className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </span>
                        {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300 shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="h-[1px] bg-slate-200 dark:bg-[#334155] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterOpen(false);
                      setIsTechModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play text-cyan-800 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 transition-all cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <WebIcon name="cpu" className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="truncate">Hệ Sinh Thái Công Nghệ</span>
                    </span>
                    <WebIcon name="chevron-right" className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedDomain && (
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setSelectedDomain(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-slate-900 dark:text-[#F8FAFC] border border-teal-300 dark:border-teal-500/50 shadow-md text-xs font-bold font-play cursor-pointer transition active:scale-95"
            >
              <WebIcon name="chevron-left" className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Quay lại 6 thẻ dịch vụ</span>
            </button>
          )}
        </div>
      </motion.div>
      )}

      {/* 2. VÙNG NỘI DUNG: KHI CHƯA CHỌN -> 6 THẺ DẠNG 3 CỘT 2 HÀNG; KHI CLICK XEM CHI TIẾT -> THẺ CHI TIẾT BẰNG KÍCH THƯỚC 6 THẺ CỘNG & VIEW 3 CỘT 2 HÀNG */}
      <div className="w-full flex-1 min-h-0 flex flex-col justify-between">
        {!selectedDomain ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch w-full flex-1" style={{ gap: '15px' }}>
            {filteredDomains.map((domain, idx) => {
              const cfg = getCardVisualConfig(domain.id);
              const bullets = (domain.details || domain.experienceItems || []).slice(0, 3);
              const rawServiceImg = domain.customIllustrationUrl || cfg.illustrationSrc;
              const serviceImage = rawServiceImg;

              return (
                <motion.div
                  key={domain.id}
                  id={domain.id === '01' ? 'service-card-telecom' : domain.id === '02' ? 'service-card-ecommerce' : domain.id === '03' ? 'service-card-insurance' : domain.id === '05' ? 'service-card-ewallet' : domain.id === '04' ? 'service-card-esports' : 'service-card-cx-ops'}
                  data-element-type="card"
                  data-section-card="true"
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: idx * 0.04 }}
                  onClick={() => handleOpenDetail(domain)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenDetail(domain);
                    }
                  }}
                  style={{
                    ...cardSampleStyle,
                    borderRadius: '14px',
                    padding: '15px',
                  }}
                  className="service-card bento-card glass-card layered-card group relative rounded-[14px] p-[15px] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[230px] shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div
                    className="service-ambient-glow absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-75"
                    style={{ background: cfg.ambientGlow }}
                  />

                  {/* 1. TOP: Tiêu đề tên dịch vụ và icon dịch vụ */}
                  <div className="service-divider relative z-20 flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className="shrink-0 flex items-center justify-center bg-transparent border-0 p-0 shadow-none"
                        style={{ color: cfg.accentColor }}
                      >
                        <WebIcon name={domain.icon?.toLowerCase() || 'briefcase'} className="w-[18px] h-[18px] stroke-[2.2]" style={{ width: '18px', height: '18px', color: cfg.accentColor }} />
                      </span>
                      <h3
                        className="service-title-text text-[18px] font-bold font-play leading-snug tracking-tight transition-colors truncate"
                        style={{ fontSize: '18px', fontWeight: 700, color: cfg.accentColor }}
                        title={domain.titleEn && language === 'en' ? domain.titleEn : domain.title}
                      >
                        {language === 'en' && domain.titleEn ? domain.titleEn : domain.title}
                      </h3>
                    </div>
                  </div>

                  {/* 2. CENTER: Chứa mô tả và hình dịch vụ */}
                  <div className="relative z-20 flex flex-col sm:flex-row items-center gap-3 py-2.5 flex-1 min-h-0">
                    <div className="flex-1 min-w-0">
                      <p
                        id={`service-card-desc-${domain.id}`}
                        className={`card-body-text font-play font-normal text-[14px] sm:text-[15px] leading-relaxed line-clamp-4 ${
                          isLight ? 'text-[#334155]' : 'text-[#E2E8F0]'
                        }`}
                        style={{
                          lineHeight: 'var(--lh-body)',
                          fontWeight: 400,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        title={(language === 'en' && domain.subtitleEn ? domain.subtitleEn : domain.subtitle) || domain.desc || domain.professionalMessage}
                      >
                        {(language === 'en' && domain.subtitleEn ? domain.subtitleEn : domain.subtitle) || domain.desc || domain.professionalMessage}
                      </p>
                    </div>
                    <div className="w-24 h-20 sm:w-28 sm:h-24 shrink-0 flex items-center justify-center relative bg-transparent">
                      <motion.img
                        src={serviceImage}
                        alt={domain.title}
                        onError={(e) => {
                          if (e.currentTarget.src !== cfg.fallbackIllustration) {
                            e.currentTarget.src = cfg.fallbackIllustration;
                          }
                        }}
                        className="w-full h-full object-contain bg-transparent drop-shadow-[0_8px_14px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* 3. BOTTOM: Logo công ty nền trong suốt, căn giữa gọn gàng */}
                  <div className="service-divider relative z-20 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-center shrink-0">
                    {domain.companyLogos && domain.companyLogos.length > 0 ? (
                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        {domain.companyLogos
                          .slice(0, 5)
                          .map((partner, pIdx) => (
                          <div
                            key={pIdx}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-transparent border-0 p-0 shadow-none flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110"
                            title={partner.name}
                          >
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-contain bg-transparent"
                              onError={(e) => {
                                if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                                  e.currentTarget.src = partner.fallbackLogo;
                                } else {
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10.5px] font-mono font-bold opacity-70">
                        {cfg.pillText}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 3. KHUNG XEM CHI TIẾT DỊCH VỤ: TÍCH HỢP DATA CHI TIẾT TỪ CODE ĐĨNH KÈM */
          (() => {
            const cfg = getCardVisualConfig(selectedDomain.id);
            const detailInfo = SERVICES_DATA_DETAILS[selectedDomain.id] || SERVICES_DATA_DETAILS['01'];
            const serviceImage = selectedDomain.customIllustrationUrl || cfg.illustrationSrc;
            const primaryCompany = selectedDomain.companies?.[0] || selectedDomain.companyLogos?.[0]?.name || detailInfo.partners[0] || 'Power Service';
            const primaryLogo = selectedDomain.companyLogos?.[0]?.logo || 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842335/Kinh%20nghi%E1%BB%87m/Logo_PowerService.png';

            return (
              <motion.div
                id={`services-detail-panel-${selectedDomain.id}`}
                key={`services-detail-${selectedDomain.id}`}
                layoutId={`services-card-${selectedDomain.id}`}
                data-element-type="card"
                data-section-card="true"
                initial={{ opacity: 0.95, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className={`bento-card glass-card w-full h-full min-h-0 overflow-y-auto max-h-full rounded-[14px] p-4 sm:p-5 gap-3.5 sm:gap-4 relative flex flex-col justify-between text-left font-play transition-all duration-300 ${
                  isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'
                }`}
                style={{
                  ...cardSampleStyle,
                  borderRadius: '14px',
                }}
              >
                {/* 1. TOP HEADER BAR: Icon + Kicker + Title + Summary + Close Button */}
                <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-200/80 dark:border-white/10 shrink-0">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className="shrink-0 flex items-center justify-center bg-transparent border-0 p-0 shadow-none"
                        style={{ color: detailInfo.accent }}
                      >
                        <WebIcon name={selectedDomain.icon?.toLowerCase() || 'shield-check'} className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2]" style={{ width: '1.5em', height: '1.5em' }} />
                      </div>
                      <h2
                        className="text-xl sm:text-2xl md:text-3xl font-black font-play tracking-tight min-w-0"
                        style={{ color: detailInfo.accent }}
                        title={isEn && selectedDomain.titleEn ? selectedDomain.titleEn : selectedDomain.title}
                      >
                        {formatSentenceFourWords(isEn && selectedDomain.titleEn ? selectedDomain.titleEn : selectedDomain.title)}
                      </h2>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#334155] dark:text-[#E2E8F0] max-w-3xl leading-relaxed font-semibold">
                      {detailInfo.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedDomain(null);
                    }}
                    aria-label="Đóng chi tiết"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    title="Đóng chi tiết"
                  >
                    <span className="text-xs font-black">✕</span>
                    <span className="hidden sm:inline">Đóng lại</span>
                  </button>
                </div>

                {/* 2. KEY METRICS GRID (4 columns) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1 shrink-0">
                  {detailInfo.metrics.map((m, idx) => {
                    const topColors = ['#FFDF25', '#E64C72', '#3BB8E6', '#A78BFA'];
                    return (
                      <div 
                        key={idx}
                        data-subcard="true"
                        className="exp-detail-subcard relative overflow-hidden p-3 sm:p-4 rounded-[14px] shadow-xs flex flex-col justify-between"
                      >
                        <div 
                          className="absolute top-0 left-0 right-0 h-1.5" 
                          style={{ backgroundColor: topColors[idx % 4] }}
                        />
                        <span 
                          className="block text-xl sm:text-2xl font-black tracking-tight font-play mt-1"
                          style={{ color: cardStyle === 'cowhide-leather' ? '#FDE68A' : detailInfo.accent }}
                        >
                          {m.val}
                        </span>
                        <span className="block mt-1 text-[11px] text-slate-600 dark:text-slate-200 font-bold leading-snug font-play">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 3. TOP INFO CARDS (Partners & Role) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0">
                  {/* Partners Card */}
                  <div data-subcard="true" className="exp-detail-subcard p-4 rounded-[14px] flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold mb-2.5 font-play" style={{ color: '#0d9488' }}>
                      <WebIcon name="users" className="w-4.5 h-4.5 shrink-0 text-teal-600 dark:text-teal-300" style={{ color: '#0d9488' }} />
                      <span className="text-[15px] sm:text-[16px] font-bold font-play" style={{ color: '#0d9488' }}>Đối tác tiêu biểu</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedDomain.companyLogos && selectedDomain.companyLogos.length > 0 ? (
                        selectedDomain.companyLogos.map((partner, i) => (
                          <div
                            key={i}
                            data-subcard="true"
                            className="exp-detail-subcard !px-2.5 !py-1.5 min-h-[38px] rounded-[12px] shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight select-none"
                            title={partner.name}
                          >
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-6 h-6 sm:w-7 sm:h-7 object-contain bg-transparent shrink-0"
                              onError={(e) => {
                                if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                                  e.currentTarget.src = partner.fallbackLogo;
                                } else {
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                            <span>{partner.name}</span>
                          </div>
                        ))
                      ) : (
                        detailInfo.partners.map((p, i) => (
                          <div
                            key={i}
                            data-subcard="true"
                            className="exp-detail-subcard !px-3 !py-1.5 min-h-[36px] rounded-[12px] shadow-sm flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-100 text-center leading-tight select-none"
                            title={p}
                          >
                            <span>{p}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Role Card */}
                  <div data-subcard="true" className="exp-detail-subcard p-4 rounded-[14px] flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold mb-2 font-play" style={{ color: '#9333ea' }}>
                      <WebIcon name="award" className="w-4.5 h-4.5 shrink-0 text-purple-600 dark:text-purple-300" style={{ color: '#9333ea' }} />
                      <span className="text-[15px] sm:text-[16px] font-bold font-play" style={{ color: '#9333ea' }}>Vai trò chuyên môn</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-semibold font-play">
                      {detailInfo.role}
                    </p>
                  </div>
                </div>

                {/* 4. MAIN TECHNICAL COLUMNS (Solution, Architecture & Tech Stack) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0">
                  {/* Left Column (2 cols): Solution & Architecture */}
                  <div className="lg:col-span-2 space-y-3">
                    <div data-subcard="true" className="exp-detail-subcard p-4 rounded-[14px]">
                      <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold mb-2 font-play" style={{ color: '#0284c7' }}>
                        <WebIcon name="activity" className="w-4.5 h-4.5 shrink-0 text-sky-600 dark:text-sky-300" style={{ color: '#0284c7' }} />
                        <span className="text-[15px] sm:text-[16px] font-bold font-play" style={{ color: '#0284c7' }}>Tổng quan giải pháp</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-medium font-play">
                        {detailInfo.overview}
                      </p>
                    </div>

                    <div data-subcard="true" className="exp-detail-subcard p-4 rounded-[14px]">
                      <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold mb-2.5 font-play" style={{ color: '#ea580c' }}>
                        <WebIcon name="cpu" className="w-4.5 h-4.5 shrink-0 text-orange-600 dark:text-orange-300" style={{ color: '#ea580c' }} />
                        <span className="text-[15px] sm:text-[16px] font-bold font-play" style={{ color: '#ea580c' }}>Kiến trúc cốt lõi</span>
                      </div>
                      <ul className="space-y-2">
                        {detailInfo.architecture.map((arch, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-100 leading-normal font-medium font-play">
                            <span 
                              className="w-2 h-2 rounded-full mt-1 shrink-0" 
                              style={{ backgroundColor: cardStyle === 'cowhide-leather' ? '#FDE68A' : detailInfo.accent }}
                            />
                            <span>{arch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column (1 col): Tech Stack Tags */}
                  <div className="lg:col-span-1">
                    <div data-subcard="true" className="exp-detail-subcard h-full p-4 rounded-[14px] flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold mb-3 font-play" style={{ color: '#059669' }}>
                        <WebIcon name="settings" className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-emerald-300" style={{ color: '#059669' }} />
                        <span className="text-[15px] sm:text-[16px] font-bold font-play" style={{ color: '#059669' }}>Công nghệ sử dụng</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 my-auto">
                        {detailInfo.technologies.map((tech, i) => {
                          const tagAccents = [
                            '#FFDF25', '#EC7D21', '#E64C72', '#DD4E9E', 
                            '#6353B5', '#1480C0', '#3BB8E6', '#5DC3C8', 
                            '#50B347', '#A3D43A', '#A78BFA'
                          ];
                          const tagColor = tagAccents[i % tagAccents.length];
                          return (
                            <span 
                              key={i} 
                              className="px-2.5 py-1 rounded-[14px] text-[10.5px] font-bold border font-play"
                              style={{ 
                                color: cardStyle === 'cowhide-leather' ? '#FFF8DC' : tagColor === '#FFDF25' ? '#B45309' : tagColor,
                                backgroundColor: cardStyle === 'cowhide-leather' ? 'rgba(61, 33, 11, 0.72)' : `${tagColor}18`,
                                borderColor: cardStyle === 'cowhide-leather' ? 'rgba(245, 222, 179, 0.4)' : `${tagColor}35`
                              }}
                            >
                              {tech}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()
        )}
      </div>

      {/* 4. MODAL KHÁM PHÁ TECH STACK */}
      <TechStackExplorerModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
    </div>
  );
};

export default ServicesView;
