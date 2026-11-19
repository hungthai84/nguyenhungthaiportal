'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEMS_DATA } from '@/data/systems';
import { SystemData, SiteTheme } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn, formatCardTitle } from '@/lib/utils';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';
import { DataFlowMatrixModal } from '@/components/ui/DataFlowMatrixModal';
import { EcosystemDiagramModal } from '@/components/common/EcosystemDiagramModal';
import { useTheme } from '@/hooks/useTheme';
import { speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';
import { useLanguage } from '@/context/LanguageContext';

export interface SystemsViewProps {
  currentTheme?: SiteTheme;
  onShowNotification?: (msg: string) => void;
}

// Video nút nổi giới thiệu Trang Hệ Thống (Video 1: Màn hình chờ | Video 2: Video giới thiệu hệ thống)
const SYSTEM_FLOATING_IDLE_VIDEO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794639666/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_h%E1%BB%87_th%E1%BB%91ng_gi%E1%BB%9Bi_thi%E1%BB%87u.mp4';
const SYSTEM_FLOATING_INTRO_VIDEO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794639693/Video_gi%E1%BB%9Bi_thi%E1%BB%87u_h%E1%BB%87_th%E1%BB%91ng.mp4';

// Full-card video player: Khi rê chuột vào thẻ hệ thống sẽ hiển thị video toàn thẻ hệ thống, video hiển thị rõ ràng không hiển thị gì khác ngoài video
interface FullCardVideoPlayerProps {
  videoUrl: string;
  isHovered: boolean;
}

const FullCardVideoPlayer: React.FC<FullCardVideoPlayerProps> = ({ videoUrl, isHovered }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div
      className={`absolute inset-0 z-40 w-full h-full rounded-[14px] overflow-hidden bg-black transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover rounded-[14px]"
      />
    </div>
  );
};

// Thông số kỹ thuật chi tiết cho Chế Độ Xem Bảng Ma Trận Tính Năng (Compact Comparison Matrix View) & Live Health Pulse
interface SystemTechSpecItem {
  database: string;
  apiProtocol: string;
  slaCommitment: string;
  isoSecurity: string;
  uptimePct: string;
  baseOnlineUsers: number;
  onlineRoleLabel: string;
  ecosystemGroup: 'cskh' | 'enterprise' | 'ai_analytics';
  ecosystemLabel: string;
}

const SYSTEM_TECH_SPECS_MAP: Record<string, SystemTechSpecItem> = {
  sdp: {
    database: 'PostgreSQL 16 + Redis Cluster',
    apiProtocol: 'RESTful / GraphQL / SSO OAuth2',
    slaCommitment: '99.98% (< 12ms Latency)',
    isoSecurity: 'ISO/IEC 27001:2022 • Zero-Trust SSO',
    uptimePct: '99.98%',
    baseOnlineUsers: 340,
    onlineRoleLabel: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
  },
  csc: {
    database: 'PostgreSQL + Elasticsearch 8',
    apiProtocol: 'WebRTC / SIP Trunk / Webhook',
    slaCommitment: '99.98% (Real-time Queue)',
    isoSecurity: 'ISO/IEC 27001:2022 • TLS 1.3 / SRTP',
    uptimePct: '99.98%',
    baseOnlineUsers: 295,
    onlineRoleLabel: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
  },
  crm: {
    database: 'PostgreSQL + MongoDB Atlas',
    apiProtocol: 'RESTful API / Event Webhook',
    slaCommitment: '99.98% (Đồng bộ 360° < 15ms)',
    isoSecurity: 'ISO/IEC 27001:2022 • AES-256 PII Masking',
    uptimePct: '99.98%',
    baseOnlineUsers: 210,
    onlineRoleLabel: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
  },
  clp: {
    database: 'PostgreSQL + Redis Pub/Sub',
    apiProtocol: 'RESTful / Kafka Event Stream',
    slaCommitment: '99.97% (Tích điểm tức thì)',
    isoSecurity: 'ISO/IEC 27001:2022 • Tokenization',
    uptimePct: '99.98%',
    baseOnlineUsers: 65,
    onlineRoleLabel: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
  },
  pos: {
    database: 'PostgreSQL + SQLite Offline Sync',
    apiProtocol: 'gRPC / REST API / Payment Gateway',
    slaCommitment: '99.99% (Offline-First Sync)',
    isoSecurity: 'ISO/IEC 27001:2022 & PCI-DSS Level 1',
    uptimePct: '99.99%',
    baseOnlineUsers: 85,
    onlineRoleLabel: 'Cashiers Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
  },
  erp: {
    database: 'Oracle DB / PostgreSQL HA',
    apiProtocol: 'REST / SOAP / EDI / Banking API',
    slaCommitment: '99.99% (ACID Financial Ledger)',
    isoSecurity: 'ISO/IEC 27001:2022 • SOC2 Type II',
    uptimePct: '99.99%',
    baseOnlineUsers: 55,
    onlineRoleLabel: 'Users Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
  },
  hrm: {
    database: 'PostgreSQL + TimescaleDB',
    apiProtocol: 'RESTful API / Biometric IoT Sync',
    slaCommitment: '99.95% (Auto Payroll Engine)',
    isoSecurity: 'ISO/IEC 27001:2022 • E2E Payroll Encrypt',
    uptimePct: '99.97%',
    baseOnlineUsers: 48,
    onlineRoleLabel: 'HR/Managers',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
  },
  bpm: {
    database: 'PostgreSQL + Camunda Workflow DB',
    apiProtocol: 'BPMN 2.0 REST / Webhook / gRPC',
    slaCommitment: '99.98% (Zero Bottleneck)',
    isoSecurity: 'ISO/IEC 27001:2022 • Digital Signature',
    uptimePct: '99.98%',
    baseOnlineUsers: 42,
    onlineRoleLabel: 'Approvers Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
  },
  okr: {
    database: 'PostgreSQL + Graph Analytics',
    apiProtocol: 'RESTful / GraphQL KPI Sync',
    slaCommitment: '99.96% (Real-time Alignment)',
    isoSecurity: 'ISO/IEC 27001:2022 • RBAC Hierarchy',
    uptimePct: '99.98%',
    baseOnlineUsers: 35,
    onlineRoleLabel: 'Leaders Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
  },
  lms: {
    database: 'PostgreSQL + S3 Media CDN',
    apiProtocol: 'xAPI / SCORM / HLS Streaming',
    slaCommitment: '99.95% (Full HD Adaptive)',
    isoSecurity: 'ISO/IEC 27001:2022 • DRM Content Guard',
    uptimePct: '99.96%',
    baseOnlineUsers: 30,
    onlineRoleLabel: 'Trainees Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
  },
  bi: {
    database: 'ClickHouse OLAP + BigQuery',
    apiProtocol: 'WebSocket Stream / GraphQL / SQL',
    slaCommitment: '99.98% (Sub-second Query)',
    isoSecurity: 'ISO/IEC 27001:2022 • Row-Level Security',
    uptimePct: '99.98%',
    baseOnlineUsers: 20,
    onlineRoleLabel: 'Analysts Online',
    ecosystemGroup: 'ai_analytics',
    ecosystemLabel: 'Phân tích & AI',
  },
  ai: {
    database: 'Vector DB (Pinecone/PGVector) + Redis',
    apiProtocol: 'LLM Streaming API / RAG Webhook',
    slaCommitment: '99.98% (24/7 < 400ms First Token)',
    isoSecurity: 'ISO/IEC 27001:2022 • Guardrails & DLP',
    uptimePct: '99.98%',
    baseOnlineUsers: 25,
    onlineRoleLabel: 'AI Bots Active',
    ecosystemGroup: 'ai_analytics',
    ecosystemLabel: 'Phân tích & AI',
  },
};

// Mô tả cơ chế đồng bộ thời gian thực giữa 2 hệ thống bất kỳ trên Interactive Data Flow Canvas
function getRealtimeFlowDescription(sysA: SystemData, sysB: SystemData): {
  protocol: string;
  latency: string;
  payloadSummary: string;
} {
  const pairKey = [sysA.id, sysB.id].sort().join('-');
  const presetMap: Record<string, { protocol: string; latency: string; payloadSummary: string }> = {
    'crm-sdp': {
      protocol: 'RESTful API + Event Webhook 2 chiều',
      latency: '11ms',
      payloadSummary:
        'Đồng bộ tức thì Hồ sơ Khách hàng 360°, Lịch sử tương tác đa kênh, Hạng thẻ thành viên và Ticket đang xử lý ngay trên màn hình Single Agent Workspace.',
    },
    'csc-sdp': {
      protocol: 'WebRTC + SIP Trunk + WebSocket',
      latency: '9ms',
      payloadSummary:
        'Tích hợp trực tiếp trạng thái cuộc gọi VoIP, định tuyến ACD thông minh, ghi âm cuộc gọi và cảnh báo SLA thời gian thực về bàn làm việc SDP.',
    },
    'crm-csc': {
      protocol: 'Webhook Event Stream + CTI Pop-up',
      latency: '14ms',
      payloadSummary:
        'Tự động bật Pop-up thông tin định danh khách hàng (Screen-Pop) ngay khi đổ chuông và tự động lưu nhật ký cuộc gọi/phiếu ghi vào CRM.',
    },
    'erp-pos': {
      protocol: 'gRPC + Message Queue (Kafka)',
      latency: '18ms',
      payloadSummary:
        'Khấu trừ tồn kho thời gian thực ngay khi xuất hóa đơn tại quầy POS, tự động hạch toán bút toán doanh thu và công nợ vào sổ cái ERP.',
    },
    'ai-sdp': {
      protocol: 'SSE Streaming + RAG Vector API',
      latency: '16ms',
      payloadSummary:
        'Trợ lý AI lắng nghe ngữ cảnh hội thoại trên SDP để gợi ý câu trả lời chuẩn SOP (Agent Assist), tóm tắt phiếu ghi tự động và tra cứu tri thức 24/7.',
    },
    'crm-clp': {
      protocol: 'REST API + Redis Pub/Sub',
      latency: '12ms',
      payloadSummary:
        'Cập nhật điểm thưởng Loyalty, hạng thành viên VIP và danh sách Voucher khả dụng của khách hàng theo thời gian thực.',
    },
    'hrm-okr': {
      protocol: 'GraphQL Sync + OAuth2',
      latency: '19ms',
      payloadSummary:
        'Liên kết kết quả hoàn thành mục tiêu OKR/KPI cá nhân và phòng ban trực tiếp với hệ thống đánh giá năng lực và tính thưởng hiệu suất HRM.',
    },
    'bi-sdp': {
      protocol: 'ClickHouse Stream + WebSocket',
      latency: '15ms',
      payloadSummary:
        'Thu thập toàn bộ luồng sự kiện vận hành từ SDP để kết xuất lên biểu đồ Real-time Wallboard (AHT, CSAT, FCR, SLA).',
    },
  };

  if (presetMap[pairKey]) {
    return presetMap[pairKey];
  }

  return {
    protocol: 'Enterprise Service Bus (REST / Webhook / Kafka)',
    latency: '14ms',
    payloadSummary: `Đồng bộ dữ liệu hai chiều thời gian thực giữa ${sysA.abbr} (${sysA.nameVi}) và ${sysB.abbr} (${sysB.nameVi}) thông qua cổng API Gateway chuẩn mã hóa TLS 1.3.`,
};
}

// Bảng tiêu đề tiếng Việt chuẩn hóa đúng 4 chữ cho 12 hệ thống (trang chi tiết)
const SYSTEM_4_WORDS_TITLE: Record<string, string> = {
  sdp: 'Cổng làm việc CSKH',
  erp: 'Quản trị tài chính',
  crm: 'Quản trị khách hàng',
  hrm: 'Quản lý nhân lực',
  bpm: 'Quy trình nghiệp vụ',
  okr: 'Mục tiêu kết quả',
  clp: 'Khách hàng thân thiết',
  lms: 'Đào tạo trực tuyến',
  csc: 'Chăm sóc khách hàng',
  bi: 'Báo cáo phân tích',
  ai: 'Trợ lý nhân tạo',
  pos: 'Bán hàng thanh toán',
};

const SYSTEM_ACCENT_KEY_MAP: Record<string, string> = {
  sdp: 'amber',
  csc: 'sky',
  crm: 'emerald',
  clp: 'rose',
  pos: 'orange',
  erp: 'amber',
  hrm: 'orange',
  bpm: 'purple',
  okr: 'green',
  lms: 'blue',
  bi: 'violet',
  ai: 'cyan',
  office: 'blue',
};

export const SystemsView: React.FC<SystemsViewProps> = ({ currentTheme, onShowNotification }) => {
  const { showToast } = useToast();
  const { language, t, translateText } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark, cardStyle } = useTheme();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<SystemData | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFloatingVideo2Open, setIsFloatingVideo2Open] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isEcosystemDiagramOpen, setIsEcosystemDiagramOpen] = useState<boolean>(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [benchmarkScale, setBenchmarkScale] = useState<Record<string, number>>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredImgId, setHoveredImgId] = useState<string | null>(null);

  // Floating Circle Video & 9-Card Stage Intro Player (Trang Hệ Thống)
  const circleVideoRef = useRef<HTMLVideoElement>(null);
  const introStageVideoRef = useRef<HTMLVideoElement>(null);
  const cardsGridContainerRef = useRef<HTMLDivElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [isIntroStageMuted, setIsIntroStageMuted] = useState<boolean>(false);
  const [nineCardBoxSize, setNineCardBoxSize] = useState<{ width: number; height: number } | null>(null);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const measureNineCardsBox = useCallback((): { width: number; height: number } | null => {
    const gridEl = cardsGridContainerRef.current || systemsGridRef.current;
    if (!gridEl) return null;
    const gridRect = gridEl.getBoundingClientRect();
    if (gridRect.width <= 0) return null;

    const firstCardKey = Object.keys(cardElementRefs.current).find((k) => cardElementRefs.current[k]);
    const firstCardEl = firstCardKey ? cardElementRefs.current[firstCardKey] : null;
    const cardRect = firstCardEl?.getBoundingClientRect();

    const cols =
      typeof window !== 'undefined'
        ? window.innerWidth >= 1280
          ? 4
          : window.innerWidth >= 1024
            ? 3
            : window.innerWidth >= 640
              ? 2
              : 1
        : 4;
    const targetCols = Math.min(3, cols);
    const targetRows = Math.ceil(9 / targetCols);

    const singleCardW =
      cardRect && cardRect.width > 0
        ? cardRect.width
        : (gridRect.width - Math.max(0, cols - 1) * 15) / cols;
    const singleCardH = cardRect && cardRect.height > 0 ? cardRect.height : 170;

    const rawW = targetCols * singleCardW + Math.max(0, targetCols - 1) * 15;
    const rawH = targetRows * singleCardH + Math.max(0, targetRows - 1) * 15;

    const targetWidth = Math.min(Math.round(gridRect.width), Math.max(300, Math.round(rawW)));
    const targetHeight = Math.max(240, Math.round(rawH));

    return { width: targetWidth, height: targetHeight };
  }, []);

  useEffect(() => {
    if (!isCircleVideoPlaying) return;
    const video = introStageVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    setIsIntroStageMuted(false);
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (introStageVideoRef.current) {
          introStageVideoRef.current.muted = true;
          setIsIntroStageMuted(true);
          introStageVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isCircleVideoPlaying]);

  const handleCloseIntroVideo = useCallback(() => {
    SoundEngine.playTap();
    if (introStageVideoRef.current) {
      introStageVideoRef.current.pause();
      introStageVideoRef.current.currentTime = 0;
    }
    setIsCircleVideoPlaying(false);
    showToast('Đã đóng video giới thiệu — Hiển thị lại các thẻ hệ thống');
  }, [showToast]);

  const handleToggleCircleVideo = useCallback(() => {
    SoundEngine.playTap();
    if (isCircleVideoPlaying) {
      handleCloseIntroVideo();
      return;
    }

    stopActiveSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const measured = measureNineCardsBox();
    if (measured) {
      setNineCardBoxSize(measured);
    }
    setExpandedSystemId(null);
    setSelectedSystem(null);
    setIsCircleVideoPlaying(true);
    showToast('Đang phát video giới thiệu hệ thống 🔊');
  }, [isCircleVideoPlaying, handleCloseIntroVideo, measureNineCardsBox, showToast]);

  const handleIntroVideoEnded = useCallback(() => {
    setIsCircleVideoPlaying(false);
    showToast('Đã phát xong video giới thiệu hệ thống');
  }, [showToast]);

  // Bảng ánh xạ 12 thẻ hệ thống chuẩn hóa theo bảng màu Bento đa sắc trang Giới Thiệu (Bento Palette)
  const SYSTEM_DESIGN_MAP: Record<
    string,
    {
      displayTitle: string;
      subtitle: string;
      gradient: string;
      lightBg: string;
      lightBorder: string;
      lightAccent: string;
      darkAccent: string;
      iconName: string;
      illustrationSrc: string;
      cardTheme: string;
    }
  > = {
    sdp: {
      displayTitle: 'Cổng Dịch Vụ Số & Bàn Làm Việc Hợp Nhất',
      subtitle: 'Service Delivery Platform',
      gradient: 'linear-gradient(135deg, #FFDF25 0%, #EAB308 100%)',
      lightBg: 'linear-gradient(135deg, rgba(255, 253, 235, 0.95) 0%, rgba(254, 249, 195, 0.88) 100%)',
      lightBorder: '#FFDF25',
      lightAccent: '#854d0e',
      darkAccent: '#FFDF25',
      iconName: 'globe',
      illustrationSrc: 'https://i.ibb.co/1fb35MSh/SDP-C-ng-l-m-vi-c-CSKH.png',
      cardTheme: '#FFDF25',
    },
    csc: {
      displayTitle: 'Trung Tâm Chăm Sóc Khách Hàng Đa Kênh',
      subtitle: 'Customer Service Center',
      gradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
      lightBg: 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(186, 230, 253, 0.88) 100%)',
      lightBorder: '#38BDF8',
      lightAccent: '#0284C7',
      darkAccent: '#38BDF8',
      iconName: 'headphones',
      illustrationSrc: 'https://i.ibb.co/p6CQLKDg/CSC-Trung-t-m-Ch-m-s-c-Kh-ch-h-ng.png',
      cardTheme: '#38BDF8',
    },
    crm: {
      displayTitle: 'Hệ Thống Quản Trị Quan Hệ Khách Hàng 360°',
      subtitle: 'Customer Relationship Management',
      gradient: 'linear-gradient(135deg, #10B981 0%, #00C49F 100%)',
      lightBg: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(167, 243, 208, 0.88) 100%)',
      lightBorder: '#10B981',
      lightAccent: '#00C49F',
      darkAccent: '#10B981',
      iconName: 'users',
      illustrationSrc: 'https://i.ibb.co/ZpzdS7g2/CRM-Qu-n-l-Quan-h-Kh-ch-h-ng.png',
      cardTheme: '#10B981',
    },
    clp: {
      displayTitle: 'Hệ Thống Chăm Sóc Khách Hàng Thân Thiết',
      subtitle: 'Customer Loyalty Program',
      gradient: 'linear-gradient(135deg, #FF5C8D 0%, #F43F5E 100%)',
      lightBg: 'linear-gradient(135deg, rgba(255, 241, 242, 0.95) 0%, rgba(254, 205, 211, 0.88) 100%)',
      lightBorder: '#FF5C8D',
      lightAccent: '#F43F5E',
      darkAccent: '#FF5C8D',
      iconName: 'gift',
      illustrationSrc: 'https://i.ibb.co/0jLTkKZG/CLP-Kh-ch-h-ng-Th-n-thi-t.png',
      cardTheme: '#FF5C8D',
    },
    pos: {
      displayTitle: 'Hệ Thống Quản Lý Bán Hàng & Thanh Toán Tại Quầy',
      subtitle: 'Point of Sale Management',
      gradient: 'linear-gradient(135deg, #ED9B48 0%, #D97706 100%)',
      lightBg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.88) 100%)',
      lightBorder: '#ED9B48',
      lightAccent: '#ED9B48',
      darkAccent: '#ED9B48',
      iconName: 'shopping-cart',
      illustrationSrc: 'https://i.ibb.co/1tqgwmgq/POS-Qu-n-l-B-n-h-ng-t-i-Qu-y.png',
      cardTheme: '#ED9B48',
    },
    erp: {
      displayTitle: 'Hệ Thống Hoạch Định Nguồn Lực Doanh Nghiệp',
      subtitle: 'Enterprise Resource Planning',
      gradient: 'linear-gradient(135deg, #F4B84C 0%, #EAB308 100%)',
      lightBg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.88) 100%)',
      lightBorder: '#F4B84C',
      lightAccent: '#F4B84C',
      darkAccent: '#F4B84C',
      iconName: 'chart',
      illustrationSrc: 'https://i.ibb.co/HTWGjNzS/ERP-T-i-ch-nh-k-to-n.png',
      cardTheme: '#F4B84C',
    },
    hrm: {
      displayTitle: 'Hệ Thống Quản Trị Nguồn Nhân Lực Toàn Diện',
      subtitle: 'Human Resource Management',
      gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      lightBg: 'linear-gradient(135deg, rgba(255, 247, 237, 0.95) 0%, rgba(254, 215, 170, 0.88) 100%)',
      lightBorder: '#F97316',
      lightAccent: '#C2410C',
      darkAccent: '#F97316',
      iconName: 'briefcase',
      illustrationSrc: 'https://i.ibb.co/TjXJQZk/HRM-Qu-n-l-Ngu-n-nh-n-l-c.png',
      cardTheme: '#F97316',
    },
    bpm: {
      displayTitle: 'Hệ Thống Số Hóa & Tự Động Hóa Quy Trình',
      subtitle: 'Business Process Management',
      gradient: 'linear-gradient(135deg, #7E57C2 0%, #9575CD 100%)',
      lightBg: 'linear-gradient(135deg, rgba(245, 243, 255, 0.95) 0%, rgba(221, 214, 254, 0.88) 100%)',
      lightBorder: '#7E57C2',
      lightAccent: '#7E57C2',
      darkAccent: '#9575CD',
      iconName: 'file-text',
      illustrationSrc: 'https://i.ibb.co/PsbZP2Rt/BPM-Qu-n-l-Quy-tr-nh-Nghi-p-v.png',
      cardTheme: '#7E57C2',
    },
    okr: {
      displayTitle: 'Hệ Thống Quản Trị Mục Tiêu & Kết Quả Then Chốt',
      subtitle: 'Objectives & Key Results',
      gradient: 'linear-gradient(135deg, #50B347 0%, #15803D 100%)',
      lightBg: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(187, 247, 208, 0.88) 100%)',
      lightBorder: '#50B347',
      lightAccent: '#15803d',
      darkAccent: '#50B347',
      iconName: 'target',
      illustrationSrc: 'https://i.ibb.co/SwNpks2H/OKR-Qu-n-l-M-c-ti-u-K-t-qu.png',
      cardTheme: '#50B347',
    },
    lms: {
      displayTitle: 'Hệ Thống Quản Lý Đào Tạo Trực Tuyến',
      subtitle: 'Learning Management System',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      lightBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(191, 219, 254, 0.88) 100%)',
      lightBorder: '#2563EB',
      lightAccent: '#1D4ED8',
      darkAccent: '#2563EB',
      iconName: 'graduation',
      illustrationSrc: 'https://i.ibb.co/6JtKW8bR/LMS-Qu-n-l-o-t-o.png',
      cardTheme: '#2563EB',
    },
    bi: {
      displayTitle: 'Hệ Thống Báo Cáo & Phân Tích Dữ Liệu',
      subtitle: 'Business Intelligence Dashboard',
      gradient: 'linear-gradient(135deg, #8A5CF6 0%, #7C3AED 100%)',
      lightBg: 'linear-gradient(135deg, rgba(245, 243, 255, 0.95) 0%, rgba(221, 214, 254, 0.88) 100%)',
      lightBorder: '#8A5CF6',
      lightAccent: '#7C3AED',
      darkAccent: '#8A5CF6',
      iconName: 'trending',
      illustrationSrc: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793064652/BI_Dashboard_-_B%C3%A1o_c%C3%A1o_Ph%C3%A2n_t%C3%ADch.png',
      cardTheme: '#8A5CF6',
    },
    ai: {
      displayTitle: 'Trợ Lý Trí Tuệ Nhân Tạo Đa Nhiệm 24/7',
      subtitle: 'Artificial Intelligence Assistant',
      gradient: 'linear-gradient(135deg, #00A3FF 0%, #0080FF 100%)',
      lightBg: 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(186, 230, 253, 0.88) 100%)',
      lightBorder: '#00A3FF',
      lightAccent: '#0080FF',
      darkAccent: '#00A3FF',
      iconName: 'robot',
      illustrationSrc: 'https://i.ibb.co/pSBJ5s3/AI-Assistant-Tr-l-Tr-tu-Nh-n-t-o.png',
      cardTheme: '#00A3FF',
    },
    office: {
      displayTitle: 'Công cụ văn phòng & Hiệu suất',
      subtitle: 'Office Tools & Productivity Suite',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      lightBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(191, 219, 254, 0.88) 100%)',
      lightBorder: '#60A5FA',
      lightAccent: '#1D4ED8',
      darkAccent: '#60A5FA',
      iconName: 'briefcase',
      illustrationSrc: 'https://i.ibb.co/HcXVvHR/Office-C-ng-c-v-n-ph-ng.png',
      cardTheme: '#60A5FA',
    },
  };

  const REFERENCE_GRID_ORDER = [
    'csc', 'sdp', 'okr',
    'bpm', 'ai', 'hrm',
    'crm', 'clp', 'pos',
    'erp', 'lms', 'bi',
  ];

  // Trạng thái mở rộng chi tiết thẻ hệ thống có kích thước bằng 12 thẻ cộng lại (Full Grid Expansion)
  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(null);
  const expandedVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!expandedSystemId) return;
    const video = expandedVideoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [expandedSystemId]);

  const handleToggleExpandCard = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedSystemId === id) {
      SoundEngine.playTechChimeCollapse();
      setExpandedSystemId(null);
    } else {
      SoundEngine.playTechChimeExpand();
      setExpandedSystemId(id);
    }
  };

  const handleCollapseSystem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTechChimeCollapse();
    setExpandedSystemId(null);
  };

  // Đóng menu Drop Top khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);
  const isDark =
    themeIsDark ||
    currentTheme === 'light-multicolor-glass-dark' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'dark-ice-blue-neu';

  useEffect(() => {
    return () => {
      stopActiveSpeech();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selectedSystem) {
        setSelectedSystem(null);
        return;
      }
      if (isVideoModalOpen) {
        setIsVideoModalOpen(false);
        return;
      }
      if (isAuthorModalOpen) {
        setIsAuthorModalOpen(false);
        return;
      }
      if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
        return;
      }
      if (expandedSystemId) {
        setExpandedSystemId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedSystem,
    isVideoModalOpen,
    isAuthorModalOpen,
    isFilterDropdownOpen,
    expandedSystemId,
  ]);

  const handleFlipToggle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      SoundEngine.playCardFlip();
    } catch {
      SoundEngine.playTap();
    }
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const VIDEO_1_URL =
    'https://cdn.scena.ai/project/8606/581097478f9de72616d982e302e1c8d0aab6d66cbee040430c610424c0c72a44.mp4';
  const VIDEO_2_URL =
    'https://cdn.scena.ai/project/8606/ac120a105730c378447fd67f5e8b6aeb9557b5e4e8854ac2e21148d5316f780b.mp4';

  const [activeBannerVideo, setActiveBannerVideo] = useState<string>(VIDEO_1_URL);

  // 2. Ghi nhớ trạng thái âm thanh người dùng (Audio Preference Storage)
  const [isBannerMuted, setIsBannerMuted] = useState<boolean>(true);

  useEffect(() => {
    setIsBannerMuted(getSavedMutedPref(true));
  }, []);

  // 1. Bộ đếm thời lượng nghe trực quan (Audio Duration Pill)
  const [videoElapsed, setVideoElapsed] = useState<number>(0);
  const VIDEO_2_TOTAL_SECONDS = 105; // 01:45
  const videoTimeLeft = Math.max(0, VIDEO_2_TOTAL_SECONDS - videoElapsed);

  // 3. Chế độ xem thu nhỏ góc màn hình (Picture-in-Picture Mini Player)
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const [isPipDismissed, setIsPipDismissed] = useState<boolean>(false);
  const systemsGridRef = useRef<HTMLDivElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  // Helper format mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Đồng bộ lưu & khôi phục trạng thái âm thanh qua CustomEvent và storage
  useEffect(() => {
    const handleAudioPref = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        setIsBannerMuted(customEvent.detail.muted);
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, handleAudioPref);
    return () => window.removeEventListener(AUDIO_PREF_EVENT, handleAudioPref);
  }, []);

  // Timer đếm ngược khi đang phát Video 2 (Giới thiệu bản thân)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeBannerVideo === VIDEO_2_URL) {
      interval = setInterval(() => {
        setVideoElapsed((prev) => {
          if (prev >= VIDEO_2_TOTAL_SECONDS) {
            // Khi video kết thúc, tự động quay về Video 1
            setActiveBannerVideo(VIDEO_1_URL);
            setIsPipActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setVideoElapsed(0);
      setIsPipActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBannerVideo]);

  // Xử lý bật / tắt âm thanh có lưu preference
  const toggleBannerMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextMuted = !isBannerMuted;
    setIsBannerMuted(nextMuted);
    saveMutedPref(nextMuted);
    showToast(nextMuted ? 'Đã tắt âm thanh video' : 'Đã mở âm thanh video 🔊');
  };

  // Bắt sự kiện cuộn container hệ thống để tự động kích hoạt PiP Mini Player & cập nhật đường truyền luồng dữ liệu
  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (activeBannerVideo === VIDEO_2_URL && !isPipDismissed) {
      if (target.scrollTop > 130) {
        setIsPipActive(true);
      } else if (target.scrollTop < 40) {
        setIsPipActive(false);
      }
    }
    if (isFlowCanvasActive) {
      recalculateFlowCoords();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Chế độ xem: 'grid' (Dạng thẻ 3D) | 'matrix' (Bảng Ma Trận Tính Năng 12 phần mềm)
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  // 5. Live Health Pulse Badge: Giả lập biến thiên nhẹ số lượng Agents Online quanh mốc 1,250 Agents Online
  const [liveAgentDelta, setLiveAgentDelta] = useState<number>(0);
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      const randomShift = Math.floor(Math.random() * 15) - 7; // -7 đến +7
      setLiveAgentDelta(randomShift);
    }, 3200);
    return () => clearInterval(pulseTimer);
  }, []);
  const totalAgentsOnline = 1250 + liveAgentDelta;

  // 2. Bộ Lọc Phân Hệ Tác Nghiệp Bằng Icon (Ecosystem Filter Segment) với icon chủ đề phát sáng
  const ecosystemSegments = [
    {
      id: 'all',
      label: 'Tất cả',
      codesLabel: '12 Phân hệ',
      count: 12,
      icon: 'layers',
      glowStyle: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.85))',
      activeGradient: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
      iconTextClass: 'text-sky-500 dark:text-cyan-400',
    },
    {
      id: 'cskh',
      label: 'Vận hành CSKH',
      codesLabel: 'SDP, CSC, CRM, CLP, POS',
      count: 5,
      icon: 'headphones',
      glowStyle: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.9))',
      activeGradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
      iconTextClass: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'enterprise',
      label: 'Quản trị doanh nghiệp',
      codesLabel: 'ERP, HRM, BPM, OKR, LMS',
      count: 5,
      icon: 'briefcase',
      glowStyle: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.9))',
      activeGradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      iconTextClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'ai_analytics',
      label: 'Phân tích & AI',
      codesLabel: 'BI, AI Assistant',
      count: 2,
      icon: 'robot',
      glowStyle: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.9))',
      activeGradient: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      iconTextClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    },
  ];

  // Helper mapping cho Ecosystem Filter Segment
  const getSystemCategory = (id: string): string => {
    if (['sdp', 'csc', 'crm', 'clp', 'pos'].includes(id)) return 'cskh';
    if (['erp', 'hrm', 'bpm', 'okr', 'lms'].includes(id)) return 'enterprise';
    if (['bi', 'ai'].includes(id)) return 'ai_analytics';
    return 'cskh';
  };

  // 3. Mô Phỏng Luồng Dữ Liệu Tương Tác Giữa Các Hệ Thống (Interactive Data Flow Canvas trên lưới thẻ)
  const [isFlowCanvasActive, setIsFlowCanvasActive] = useState<boolean>(false);
  const [flowPairIds, setFlowPairIds] = useState<string[]>(['crm', 'sdp']);
  const cardElementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flowSvgCoords, setFlowSvgCoords] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cx1: number;
    cy1: number;
    cx2: number;
    cy2: number;
    midX: number;
    midY: number;
    width: number;
    height: number;
  } | null>(null);

  const handleSelectSystemForFlow = useCallback(
    (sysId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      SoundEngine.playTap();
      if (!isFlowCanvasActive) {
        setIsFlowCanvasActive(true);
      }
      setFlowPairIds((prev) => {
        if (prev.includes(sysId)) {
          // Nếu đang chọn thì bỏ chọn (giữ lại thẻ còn lại)
          return prev.filter((id) => id !== sysId);
        }
        if (prev.length < 2) {
          const next = [...prev, sysId];
          if (next.length === 2) {
            const sA = SYSTEMS_DATA.find((s: SystemData) => s.id === next[0]);
            const sB = SYSTEMS_DATA.find((s: SystemData) => s.id === next[1]);
            if (sA && sB) {
              showToast(`⚡ Đã thiết lập đường truyền dữ liệu thời gian thực: ${sA.abbr} ⇄ ${sB.abbr}`);
            }
          }
          return next;
        }
        // Nếu đã có 2 hệ thống, lấy hệ thống thứ 2 ghép với hệ thống vừa click
        const next = [prev[1], sysId];
        const sA = SYSTEMS_DATA.find((s: SystemData) => s.id === next[0]);
        const sB = SYSTEMS_DATA.find((s: SystemData) => s.id === next[1]);
        if (sA && sB) {
          showToast(`⚡ Đã chuyển đường truyền đồng bộ sang: ${sA.abbr} ⇄ ${sB.abbr}`);
        }
        return next;
      });
    },
    [isFlowCanvasActive, showToast]
  );

  // Tính toán tọa độ đường truyền SVG nối giữa 2 thẻ hệ thống được chọn trên lưới
  const recalculateFlowCoords = useCallback(() => {
    if (!isFlowCanvasActive || viewMode !== 'grid' || flowPairIds.length !== 2) {
      setFlowSvgCoords(null);
      return;
    }
    const container = systemsGridRef.current;
    const elA = cardElementRefs.current[flowPairIds[0]];
    const elB = cardElementRefs.current[flowPairIds[1]];
    if (!container || !elA || !elB) {
      setFlowSvgCoords(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();

    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const x1 = rectA.left - containerRect.left + scrollLeft + rectA.width / 2;
    const y1 = rectA.top - containerRect.top + scrollTop + rectA.height / 2;
    const x2 = rectB.left - containerRect.left + scrollLeft + rectB.width / 2;
    const y2 = rectB.top - containerRect.top + scrollTop + rectB.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    // Tạo độ cong Bézier mềm mại giữa 2 thẻ
    const curveOffset = Math.min(90, Math.max(36, Math.hypot(dx, dy) * 0.22));
    const cx1 = x1 + dx * 0.35;
    const cy1 = y1 - curveOffset;
    const cx2 = x1 + dx * 0.65;
    const cy2 = y2 - curveOffset;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - curveOffset * 0.65;

    setFlowSvgCoords({
      x1,
      y1,
      x2,
      y2,
      cx1,
      cy1,
      cx2,
      cy2,
      midX,
      midY,
      width: Math.max(container.scrollWidth, container.clientWidth),
      height: Math.max(container.scrollHeight, container.clientHeight),
    });
  }, [isFlowCanvasActive, viewMode, flowPairIds]);

  const filteredSystems = useMemo(() => {
    let list = [...SYSTEMS_DATA];
    if (activeCategory === 'all' && !searchQuery.trim()) {
      list.sort((a, b) => {
        const idxA = REFERENCE_GRID_ORDER.indexOf(a.id);
        const idxB = REFERENCE_GRID_ORDER.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return 0;
      });
      return list;
    }
    if (activeCategory !== 'all') {
      list = list.filter((item) => getSystemCategory(item.id) === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const matchVi = (item.nameVi || item.name || '').toLowerCase().includes(q) || (item.descVi || item.description || '').toLowerCase().includes(q);
        const matchEn = (item.nameEn || item.name || '').toLowerCase().includes(q) || (item.descEn || item.description || '').toLowerCase().includes(q);
        const matchCode = (item.abbr || item.code || '').toLowerCase().includes(q) || (item.fullName || item.name || '').toLowerCase().includes(q);
        return matchVi || matchEn || matchCode;
      });
    }
    return list;
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      recalculateFlowCoords();
    }, 60);
    window.addEventListener('resize', recalculateFlowCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', recalculateFlowCoords);
    };
  }, [recalculateFlowCoords, filteredSystems, expandedSystemId]);

  const connectedFlowSystems = useMemo(() => {
    if (flowPairIds.length !== 2) return null;
    const sysA = SYSTEMS_DATA.find((s: SystemData) => s.id === flowPairIds[0]);
    const sysB = SYSTEMS_DATA.find((s: SystemData) => s.id === flowPairIds[1]);
    if (!sysA || !sysB) return null;
    return {
      sysA,
      sysB,
      flowMeta: getRealtimeFlowDescription(sysA, sysB),
    };
  }, [flowPairIds]);

  const expandedSystem = useMemo(
    () => filteredSystems.find((s) => s.id === expandedSystemId) || null,
    [filteredSystems, expandedSystemId]
  );

  const expandedConfig = useMemo(() => {
    if (!expandedSystem) return null;
    return (
      SYSTEM_DESIGN_MAP[expandedSystem.id] || {
        displayTitle: formatCardTitle(expandedSystem.nameVi || expandedSystem.name || ''),
        subtitle: expandedSystem.descVi || expandedSystem.description || '',
        gradient: expandedSystem.gradient,
        lightBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.92) 0%, rgba(219, 234, 254, 0.82) 100%)',
        lightBorder: 'rgba(96, 165, 250, 0.55)',
        lightAccent: '#1d4ed8',
        darkAccent: '#60a5fa',
        iconName: systemIconMap[expandedSystem.id] || 'cog',
        illustrationSrc: expandedSystem.imageUrl || '',
        cardTheme: expandedSystem.themeColor || '#3B72E2',
      }
    );
  }, [expandedSystem]);

  const handleCardClick = (item: SystemData) => {
    if (item.id === 'bi' || !item.url) {
      showToast('Hệ thống BI Dashboard đang được hoàn thiện tích hợp kết nối API thời gian thực!');
      setSelectedSystem(item);
      return;
    }
    setSelectedSystem(item);
  };

  const handleOpenUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết Cổng Hệ Thống vào clipboard!');
    } else {
      showToast('Chia sẻ liên kết thành công!');
    }
  };

  // Format date string for live clock
  const formattedTime = currentTime ? currentTime.toTimeString().split(' ')[0] : '--:--:--';
  const dayNames =
    language === 'en'
      ? ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      : ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
  const monthNamesEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDate = currentTime
    ? language === 'en'
      ? `${dayNames[currentTime.getDay()]}, ${currentTime.getDate()} ${monthNamesEn[currentTime.getMonth()]}`
      : `${dayNames[currentTime.getDay()]}, ${currentTime.getDate()} THG ${currentTime.getMonth() + 1}`
    : '--';

  // Icon mapping for each system
  const systemIconMap: Record<string, string> = {
    sdp: 'server',
    erp: 'database',
    crm: 'users',
    hrm: 'user-check',
    bpm: 'workflow',
    okr: 'target',
    clp: 'award',
    lms: 'graduation-cap',
    csc: 'headset',
    bi: 'bar-chart',
    ai: 'bot',
    pos: 'shopping-cart',
  };

  return (
    <div
      id="systems-page-container"
      onClick={() => {
        if (expandedSystemId) {
          handleCollapseSystem();
        }
      }}
      data-element-name="Trang Hệ Thống Vận Hành"
      data-element-type="container"
      data-element-page="systems"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="systems-cards-track"
        data-element-name="Track căn giữa Hệ Thống"
        data-element-type="container"
        data-element-page="systems"
        data-element-parent="systems-page-container"
        className="page-cards-track"
        style={{
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <div
          id="systems-main-card"
          ref={systemsGridRef}
          onScroll={handleGridScroll}
          data-main-card="true"
          data-element-name="Thẻ chính Trang Hệ Thống Vận Hành"
          data-element-type="card"
          data-element-page="systems"
          data-element-parent="systems-cards-track"
          className="page-main-card flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* 100% Matching Animation CSS Rules */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes icon-floating {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-5px) rotate(2deg) scale(1.07);
          }
        }

        .animated-service-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: icon-floating 3.2s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.28));
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .system-item:hover .animated-service-icon {
          transform: scale(1.15) translateY(-3px);
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.4));
        }

        .system-flip-wrap {
          perspective: 1000px;
          min-height: 110px;
          height: 100%;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
          box-shadow: none !important;
        }

        .system-flip-wrap:hover {
          transform: translateY(-2px);
        }

        .system-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 110px;
          transition: transform 0.65s cubic-bezier(0.34, 1.35, 0.64, 1);
          transform-style: preserve-3d;
          border-radius: 14px;
          box-shadow: none !important;
        }

        .system-flip-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .system-flip-front,
        .system-flip-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          min-height: 110px;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }

        .system-flip-front {
          z-index: 2;
          transform: rotateY(0deg) !important;
        }

        .system-flip-back {
          transform: rotateY(180deg) !important;
          z-index: 1;
        }

        .system-item {
          border-radius: 14px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }

        .system-item:hover {
          /* Không áp dụng transform translateY lên system-item vì nó là mặt thẻ lật 3D - Nâng thẻ đã được xử lý an toàn tại .system-flip-wrap:hover */
        }

        @keyframes ring-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }

        .video-circle-halo {
          animation: ring-pulse 2.2s infinite;
        }

        @keyframes clp-ripple-wave {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          30% {
            opacity: 0.9;
          }
          65% {
            opacity: 0.35;
          }
          100% {
            transform: scale(38);
            opacity: 0;
          }
        }

        @keyframes clp-ring-pulse {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          45% {
            opacity: 0.8;
          }
          100% {
            transform: scale(32);
            opacity: 0;
          }
        }

        .clp-ripple-active .clp-wave-1 {
          animation: clp-ripple-wave 0.85s cubic-bezier(0.12, 0.8, 0.25, 1) forwards;
        }

        .clp-ripple-active .clp-wave-2 {
          animation: clp-ring-pulse 1.05s cubic-bezier(0.12, 0.8, 0.25, 1) 0.1s forwards;
        }

        .clp-ripple-active .clp-wave-3 {
          animation: clp-ring-pulse 1.25s cubic-bezier(0.12, 0.8, 0.25, 1) 0.2s forwards;
        }
      `,
        }}
      />


        {/* BANNER HỆ THỐNG: Format đồng bộ chuẩn banner Hình Nền (h-200px, p-[15px], bo cong 14px) */}
        {!expandedSystemId && (
          <motion.section
            id="systems-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="systems"
            data-section-card="true"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
            style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: '14px' }}
          >
            <div
              className="project-detail-banner-media absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
              style={{
                borderRadius: '14px',
              }}
            >
              <img
                src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591946/H%E1%BB%87_th%E1%BB%91ng.png"
                alt="Banner Hệ thống"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[14px] z-0" />

            <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full">
              <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                <WebIcon
                  name="network"
                  className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ width: '22px', height: '22px' }}
                />
                <h1
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  Hệ thống vận hành
                </h1>
              </div>
              <p
                className="typo-h3 font-handwriting font-italianno not-italic font-bold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[60%]"
                style={{ color: 'var(--text-secondary)', fontFamily: "'Italianno', cursive, sans-serif", fontWeight: 700, fontStyle: 'normal' }}
              >
                &quot;Hệ thống thông minh, vận hành tinh gọn và đồng bộ ♡&quot;
              </p>
            </div>

            <div
              id="systems-hero-banner-controls"
              className="relative z-30 flex flex-wrap items-end justify-between gap-2.5 mt-auto w-full"
              ref={filterDropdownRef}
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <div className="relative inline-block text-left">
                  <button
                    id="systems-filter-toggle-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterDropdownOpen((prev) => !prev);
                    }}
                    className="banner-control-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer typo-button font-play active:scale-95 group"
                    title={isEn ? 'Filter' : 'Bộ lọc'}
                    aria-label="Bộ lọc hệ thống"
                    aria-expanded={isFilterDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] transition-transform group-hover:rotate-45 shrink-0" />
                    <span>{isEn ? 'Filter' : 'Bộ lọc'}</span>
                    {activeCategory !== 'all' && (
                      <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono">
                        {ecosystemSegments.find((s) => s.id === activeCategory)?.label}
                      </span>
                    )}
                    <WebIcon
                      name="chevron-down"
                      className={cn(
                        'w-3.5 h-3.5 text-[var(--text-primary)] transition-transform duration-200 shrink-0',
                        isFilterDropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <motion.div
                        id="systems-filter-listbox"
                        data-element-type="card"
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        role="listbox"
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                      >
                        {ecosystemSegments.map((seg) => {
                          const isActive = activeCategory === seg.id;
                          return (
                            <button
                              key={seg.id}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              data-selected={isActive ? 'true' : undefined}
                              onClick={() => {
                                SoundEngine.playTap();
                                setActiveCategory(seg.id);
                                setExpandedSystemId(null);
                                setIsCircleVideoPlaying(false);
                                setIsFilterDropdownOpen(false);
                              }}
                              className={cn(
                                'theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                                isActive
                                  ? 'shadow-xs font-bold'
                                  : ''
                              )}
                            >
                              <span>{seg.label} ({seg.count})</span>
                              {isActive && <span className="w-2 h-2 rounded-full bg-current" />}
                            </button>
                          );
                        })}

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* NÚT SƠ ĐỒ HỆ THỐNG */}
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTechChimeExpand();
                    setIsEcosystemDiagramOpen(true);
                  }}
                  className="banner-primary-cta inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.6)] border border-blue-300/40 backdrop-blur-md transition-all cursor-pointer typo-button font-play active:scale-95 group"
                  title="Mở Sơ đồ hệ thống"
                >
                  <WebIcon name="git-merge" className="w-4 h-4 text-white shrink-0" />
                  <span>Sơ đồ hệ thống</span>
                </button>
              </div>

              {/* CỤM TÌM KIẾM & VIDEO GIỚI THIỆU NẰM BÊN PHẢI GÓC DƯỚI BANNER */}
              <div className="flex items-center gap-2 ml-auto shrink-0 max-w-full">
                <div className="relative w-36 sm:w-44 md:w-48">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="systems-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEn ? 'Search systems...' : 'Tìm hệ thống...'}
                    aria-label={isEn ? 'Search systems' : 'Tìm kiếm hệ thống'}
                    className="banner-search-input w-full pl-8 pr-7 py-1.5 rounded-full typo-input font-play focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="banner-count-pill px-2.5 py-1.5 rounded-full typo-badge font-mono font-bold shrink-0">
                  {filteredSystems.length}/{SYSTEMS_DATA.length}
                </span>

                {/* NÚT HÌNH TRÒN PHÁT VIDEO GIỚI THIỆU NẰM BÊN PHẢI BANNER */}
                <button
                  id="systems-intro-video-circle-btn"
                  type="button"
                  onClick={handleToggleCircleVideo}
                  aria-label={isCircleVideoPlaying ? 'Đóng video giới thiệu hệ thống' : 'Xem video giới thiệu hệ thống'}
                  title={isCircleVideoPlaying ? 'Đóng video giới thiệu hệ thống' : 'Xem video giới thiệu hệ thống'}
                  className={cn(
                    'video-play-btn video-play-btn--systems relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full aspect-square p-0.5 flex items-center justify-center cursor-pointer transition-all duration-300 group active:scale-95 video-circle-halo',
                    isCircleVideoPlaying ? 'is-playing ring-4 ring-rose-400/60' : ''
                  )}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border border-white/60">
                    <video
                      ref={circleVideoRef}
                      src={SYSTEM_FLOATING_IDLE_VIDEO_URL}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center rounded-full pointer-events-none scale-[1.06]"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300',
                        isCircleVideoPlaying
                          ? 'bg-slate-950/45 group-hover:bg-slate-950/60'
                          : 'bg-slate-950/20 group-hover:bg-slate-950/40'
                      )}
                    >
                      <span
                        className={cn(
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white border border-white/60 shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110',
                          isCircleVideoPlaying
                            ? 'bg-rose-600/90'
                            : 'bg-black/60'
                        )}
                      >
                        <WebIcon
                          name={isCircleVideoPlaying ? 'cancel' : 'play'}
                          className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 text-white', !isCircleVideoPlaying && 'ml-0.5')}
                        />
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.section>
        )}


          {isCircleVideoPlaying ? (
            <motion.div
              id="systems-intro-video-stage-wrap"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex-1 w-full min-h-[260px] flex items-center justify-center py-1"
            >
              <div
                id="systems-intro-video-stage"
                data-element-type="card"
                data-section-card="true"
                className="bento-card glass-card w-full flex flex-col rounded-[14px] overflow-hidden border border-slate-300/80 dark:border-white/20 shadow-2xl bg-black relative"
                style={
                  nineCardBoxSize
                    ? {
                        width: `${nineCardBoxSize.width}px`,
                        height: `${nineCardBoxSize.height}px`,
                        maxWidth: '100%',
                        borderRadius: '14px',
                      }
                    : { borderRadius: '14px', minHeight: '420px' }
                }
              >
                <div className="relative w-full h-full flex-1 bg-black rounded-[14px] overflow-hidden">
                  {/* Floating Controls Inside Top-Right */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const v = introStageVideoRef.current;
                        if (!v) return;
                        const nextMuted = !v.muted;
                        v.muted = nextMuted;
                        setIsIntroStageMuted(nextMuted);
                        showToast(nextMuted ? 'Đã tắt âm thanh video' : 'Đã bật âm thanh video 🔊');
                      }}
                      title={isIntroStageMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                    >
                      <WebIcon
                        name={isIntroStageMuted ? 'volume-x' : 'volume-2'}
                        className="w-4 h-4 text-cyan-300"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseIntroVideo}
                      title="Đóng video và hiện lại 12 thẻ hệ thống"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 backdrop-blur-md border border-white/20 text-white typo-button font-play transition cursor-pointer shadow-md active:scale-95"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                      <span>Đóng video</span>
                    </button>
                  </div>

                  <video
                    ref={introStageVideoRef}
                    src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                    controls
                    autoPlay
                    playsInline
                    muted={isIntroStageMuted}
                    onEnded={handleIntroVideoEnded}
                    className="w-full h-full object-cover bg-black rounded-[14px]"
                  >
                    Trình duyệt của bạn không hỗ trợ phát video HTML5.
                  </video>
                </div>
              </div>
            </motion.div>
          ) : filteredSystems.length === 0 ? (
            <div className="theme-muted-surface text-center py-16 px-4 rounded-[14px] backdrop-blur-md flex flex-col items-center justify-center flex-1 shadow-xs">
              <div className="w-12 h-12 rounded-[14px] bg-indigo-500/15 flex items-center justify-center mb-2" style={{ color: 'var(--color-primary)' }}>
                <WebIcon name="search" className="w-6 h-6" />
              </div>
              <p className="typo-h3 font-play" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                Không tìm thấy hệ thống phù hợp
              </p>
              <p className="typo-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Hãy thử nhập từ khóa khác như &quot;CRM&quot;, &quot;ERP&quot;, &quot;LMS&quot; hoặc &quot;CSKH&quot;...
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                style={{ background: 'var(--bg-button-primary)' }}
                className="mt-4 px-5 py-2 rounded-full typo-button text-white hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                Xem lại tất cả 12 hệ thống
              </button>
            </div>
          ) : viewMode === 'matrix' ? (
            /* 4. CHẾ ĐỘ XEM THẺ DẠNG BẢNG MA TRẬN TÍNH NĂNG (COMPACT COMPARISON MATRIX VIEW) */
            <div className="flex-1 min-h-0 overflow-auto horizontal-scroll-smooth">
              <table className="theme-table w-full text-left border-collapse min-w-[780px] rounded-[14px] overflow-hidden">
                <thead className="sticky top-0 z-20 backdrop-blur-md border-b typo-caption font-semibold font-mono tracking-wider" style={{ borderColor: 'var(--border-table)' }}>
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Phân hệ (12)</th>
                    <th className="py-2.5 px-2.5 font-semibold">Nhóm tác nghiệp</th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="database" className="w-3 h-3 text-sky-500" />
                        <span>Cơ sở dữ liệu (DB)</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="zap" className="w-3 h-3 text-indigo-500" />
                        <span>API kết nối</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">Cam kết SLA</th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="shield" className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Chuẩn ISO 27001</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y typo-body-sm" style={{ borderColor: 'var(--border-table)' }}>
                  {filteredSystems.map((item) => {
                    const config = SYSTEM_DESIGN_MAP[item.id] || {
                      displayTitle: formatCardTitle(item.nameVi || item.name || ''),
                      iconName: systemIconMap[item.id] || 'cog',
                      cardTheme: item.themeColor || '#3B72E2',
                      lightAccent: '#1d4ed8',
                      darkAccent: '#60a5fa',
                      gradient: item.gradient,
                    };
                    const tech = SYSTEM_TECH_SPECS_MAP[item.id] || SYSTEM_TECH_SPECS_MAP.sdp;

                    return (
                      <tr
                        key={item.id}
                        tabIndex={0}
                        onClick={() => handleCardClick(item)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick(item);
                          }
                        }}
                        className="hover:bg-sky-500/10 transition-colors cursor-pointer"
                      >
                        {/* Cột 1: Mã & Tên 4 chữ */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <WebIcon name={config.iconName} className="w-[18px] h-[18px] shrink-0" style={{ color: isDark ? config.darkAccent : config.lightAccent, width: '18px', height: '18px' }} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="px-1.5 py-0.5 rounded typo-badge font-mono"
                                  style={{ background: 'var(--bg-button-secondary)', color: 'var(--text-link, var(--color-primary))' }}
                                >
                                  {item.abbr}
                                </span>
                                <span className="font-semibold font-play truncate" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                                  {config.displayTitle}
                                </span>
                              </div>
                              <p className="typo-label truncate max-w-[190px]" style={{ color: 'var(--text-muted)' }}>
                                {item.fullName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Nhóm phân hệ */}
                        <td className="py-2 px-2.5">
                          <span
                            className="px-2 py-0.5 rounded-full typo-badge border"
                            style={{
                              background: 'var(--bg-button-secondary)',
                              color: 'var(--text-link, var(--color-primary))',
                              borderColor: 'var(--border-subcard)',
                            }}
                          >
                            {tech.ecosystemLabel}
                          </span>
                        </td>

                        {/* Cột 3: Cơ sở dữ liệu */}
                        <td className="py-2 px-2.5 font-mono typo-caption font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {tech.database}
                        </td>

                        {/* Cột 4: API kết nối */}
                        <td className="py-2 px-2.5 font-mono typo-caption font-semibold" style={{ color: 'var(--accent-cyan, var(--color-primary))' }}>
                          {tech.apiProtocol}
                        </td>

                        {/* Cột 5: Cam kết SLA */}
                        <td className="py-2 px-2.5">
                          <span className="px-2 py-0.5 rounded-[14px] typo-badge font-mono bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {tech.slaCommitment}
                          </span>
                        </td>

                        {/* Cột 6: Tiêu chuẩn an toàn thông tin ISO 27001 */}
                        <td className="py-2 px-2.5">
                          <span className="inline-flex items-center gap-1 typo-caption font-semibold" style={{ color: 'var(--text-primary)' }}>
                            <WebIcon name="shield" className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{tech.isoSecurity}</span>
                          </span>
                        </td>

                        {/* Cột 7: Nút mở cổng */}
                        <td className="py-2 px-3 text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            {item.url && (
                              <button
                                type="button"
                                onClick={(e) => handleOpenUrl(e, item.url)}
                                className="px-3 py-1 rounded-[14px] typo-badge text-white shadow-2xs inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                                style={{ background: config.gradient }}
                              >
                                <span>Website</span>
                                <WebIcon name="external-link" className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              ref={cardsGridContainerRef}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] items-stretch p-0 bg-transparent typo-body relative grid-flow-row-dense"
              style={{ padding: 0, background: 'transparent' }}
            >
              {(expandedSystemId
                ? filteredSystems.filter((item) => item.id === expandedSystemId)
                : filteredSystems
              ).map((item) => {
                const isFlipped = !!flippedCardIds[item.id];
                const isExpanded = expandedSystemId === item.id;
                const config = SYSTEM_DESIGN_MAP[item.id] || {
                  displayTitle: item.nameVi || item.name || '',
                  subtitle: item.descVi || item.description || '',
                  gradient: item.gradient,
                  lightBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.92) 0%, rgba(219, 234, 254, 0.82) 100%)',
                  lightBorder: 'rgba(96, 165, 250, 0.55)',
                  lightAccent: '#1d4ed8',
                  darkAccent: '#60a5fa',
                  iconName: systemIconMap[item.id] || 'cog',
                  illustrationSrc: '',
                  cardTheme: item.themeColor || '#3B72E2',
                };
                const tech = SYSTEM_TECH_SPECS_MAP[item.id] || SYSTEM_TECH_SPECS_MAP.sdp;

                const isVividDarkFace = true;
                const isImgHovered = hoveredImgId === item.id;
                const systemTitle4Words = SYSTEM_4_WORDS_TITLE[item.id] || item.nameVi;
                const sysAccentKey = SYSTEM_ACCENT_KEY_MAP[item.id] || 'sky';
                const sysAccentColor =
                  cardStyle === 'cowhide-leather'
                    ? '#FDE68A'
                    : cardStyle === 'black-cowhide-leather'
                      ? '#E2E8F0'
                      : cardStyle === 'light-cowhide-leather'
                        ? '#0F172A'
                        : isDark
                          ? config.darkAccent
                          : config.lightAccent;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      cardElementRefs.current[item.id] = el;
                    }}
                    className={`system-flip-wrap ${
                      isExpanded
                        ? 'col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 z-25 min-h-[360px]'
                        : 'col-span-1 row-span-1 z-1'
                    } transition-all duration-500 ease-out`}
                  >
                    {isExpanded ? (
                      /* THẺ MỞ RỘNG: BENTO RESPONSIVE GRID CARD */
                      <article
                        id={`system-expanded-card-${item.id}`}
                        data-element-type="card"
                        data-section-card="true"
                        onClick={(e) => e.stopPropagation()}
                        className="system-item bento-card glass-card layered-card relative w-full min-h-[360px] h-full rounded-[14px] overflow-hidden p-4 sm:p-5 flex flex-col justify-between gap-3 select-none border transition-all duration-500 backdrop-blur-xl"
                        style={{
                          borderRadius: '14px',
                        }}
                      >
                        {/* Tiêu đề card chi tiết hệ thống & Nút X đóng */}
                        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subcard)] shrink-0">
                          <div className="card-header-sync flex items-center gap-2.5 min-w-0" style={{ color: sysAccentColor }}>
                            <WebIcon
                              name={config.iconName}
                              className="w-5 h-5 shrink-0"
                              style={{ color: sysAccentColor }}
                            />
                            <h3
                              className="typo-h3 card-title-synced font-play font-bold truncate m-0"
                              data-card-title="true"
                              style={{ color: sysAccentColor }}
                              title={`Chi tiết hệ thống: ${item.abbr} — ${item.nameVi || item.name}`}
                            >
                              Chi tiết hệ thống: {item.abbr} — {item.nameVi || item.name}
                            </h3>
                          </div>
                        </div>

                        {/* Thân Thẻ Mở Rộng: Bento Responsive Grid Card (12 cột thống nhất) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 flex-1 min-h-0 text-left items-stretch">
                          {/* BENTO CARD 1 (12/12): Thông tin hệ thống (gồm Tên hệ thống, Tên viết tắt, Tên viết tắt tiếng Anh, video & Mô tả hệ thống) */}
                          <div
                            id={`system-detail-overview-${item.id}`}
                            className="sm:col-span-2 md:col-span-12 flex flex-col gap-3 min-w-0"
                          >
                            <div
                              className="subcard-header-sync flex items-center gap-2 min-w-0"
                              data-subcard-accent="indigo"
                            >
                              <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                              <h4
                                className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                data-subcard-title="true"
                              >
                                Thông tin hệ thống
                              </h4>
                            </div>

                            {/* 3 Thẻ thông tin định danh hệ thống nằm gọn trong thẻ Thông tin hệ thống */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-stretch min-w-0">
                              {/* Tên hệ thống (4/12) */}
                              <div data-subcard="true" className="exp-detail-subcard sm:col-span-1 md:col-span-4 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                                <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="sky">
                                  <WebIcon name={config.iconName} className="w-4 h-4 shrink-0" />
                                  <h4
                                    className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                    data-subcard-title="true"
                                  >
                                    Tên hệ thống
                                  </h4>
                                </div>
                                <span className="typo-body-sm font-semibold text-[var(--text-primary)] block break-words">
                                  {item.nameVi || item.name}
                                </span>
                              </div>

                              {/* Tên viết tắt (3/12) */}
                              <div data-subcard="true" className="exp-detail-subcard sm:col-span-1 md:col-span-3 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                                <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="amber">
                                  <WebIcon name="file-text" className="w-4 h-4 shrink-0" />
                                  <h4
                                    className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                    data-subcard-title="true"
                                  >
                                    Tên viết tắt
                                  </h4>
                                </div>
                                <span
                                  className="typo-h4 font-bold font-mono block break-words"
                                  style={{ color: sysAccentColor }}
                                >
                                  {item.abbr}
                                </span>
                              </div>

                              {/* Tên viết tắt tiếng Anh (5/12) */}
                              <div data-subcard="true" className="exp-detail-subcard sm:col-span-2 md:col-span-5 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                                <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="violet">
                                  <WebIcon name="globe" className="w-4 h-4 shrink-0" />
                                  <h4
                                    className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                    data-subcard-title="true"
                                  >
                                    Tên viết tắt tiếng Anh
                                  </h4>
                                </div>
                                <span className="typo-body-sm font-semibold text-[var(--text-primary)] block break-words">
                                  {item.nameEn || item.fullName?.split('—')[0]?.split('-')[0]?.trim() || item.abbr}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-[15px] items-stretch min-w-0">
                              {(item.videoUrl || config.illustrationSrc || item.imageUrl) && (
                                <div
                                  id={`system-detail-media-${item.id}`}
                                  className={`md:col-span-5 relative w-full aspect-video rounded-[14px] overflow-hidden min-w-0 ${
                                    item.videoUrl ? 'bg-black' : 'bg-transparent'
                                  }`}
                                >
                                  {item.videoUrl ? (
                                    <video
                                      ref={expandedVideoRef}
                                      src={item.videoUrl}
                                      poster={config.illustrationSrc || item.imageUrl || undefined}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      preload="auto"
                                      className="w-full h-full object-cover rounded-[14px] pointer-events-none select-none"
                                    >
                                      Trình duyệt của bạn không hỗ trợ phát video HTML5.
                                    </video>
                                  ) : (
                                    <img
                                      src={config.illustrationSrc || item.imageUrl}
                                      alt={item.nameVi}
                                      className="w-full h-full object-contain rounded-[14px] bg-transparent p-2"
                                    />
                                  )}
                                </div>
                              )}
                              <div
                                id={`system-detail-desc-${item.id}`}
                                data-subcard="true"
                                className={`exp-detail-subcard p-[15px] rounded-[14px] flex flex-col justify-start gap-2.5 h-full min-w-0 ${
                                  item.videoUrl || config.illustrationSrc || item.imageUrl
                                    ? 'md:col-span-7'
                                    : 'md:col-span-12'
                                }`}
                              >
                                <div
                                  className="subcard-header-sync flex items-center gap-2 min-w-0 pb-2 border-b border-[var(--border-subcard)]"
                                  data-subcard-accent="blue"
                                >
                                  <WebIcon name="file-text" className="w-4 h-4 shrink-0" />
                                  <h4
                                    className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                    data-subcard-title="true"
                                  >
                                    Mô tả hệ thống
                                  </h4>
                                </div>
                                <p className="typo-body-sm sm:typo-body text-[var(--text-primary)] leading-relaxed break-words m-0">
                                  {item.descVi}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* BENTO CARD 6 (7/12): Danh sách tính năng (dạng list) */}
                          {item.featuresVi && item.featuresVi.length > 0 && (
                            <div
                              id={`system-detail-features-${item.id}`}
                              data-subcard="true"
                              className="exp-detail-subcard sm:col-span-2 md:col-span-7 p-[15px] rounded-[14px] flex flex-col gap-2.5 min-w-0"
                            >
                              <div
                                className="subcard-header-sync flex items-center gap-2 min-w-0 pb-2 border-b border-[var(--border-subcard)]"
                                data-subcard-accent="emerald"
                              >
                                <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                                <h4
                                  className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                  data-subcard-title="true"
                                >
                                  Danh sách tính năng
                                </h4>
                              </div>
                              <ul className="flex flex-col gap-2 list-none p-0 m-0 w-full">
                                {item.featuresVi.map((feat: string, fIdx: number) => (
                                  <li
                                    key={fIdx}
                                    className="flex items-start gap-2.5 py-2 border-b border-[var(--border-subcard)] last:border-b-0 text-[var(--text-primary)] min-w-0"
                                  >
                                    <span
                                      className="w-6 h-6 rounded-full text-white font-mono typo-badge flex items-center justify-center shrink-0 mt-0.5"
                                      style={{ backgroundColor: config.lightAccent }}
                                    >
                                      {fIdx + 1}
                                    </span>
                                    <span className="typo-body-sm text-[var(--text-primary)] break-words min-w-0 flex-1 leading-relaxed">
                                      {feat}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* BENTO CARD 7 (5/12): Hạ tầng kỹ thuật */}
                          <div
                            id={`system-detail-specs-${item.id}`}
                            data-subcard="true"
                            className={`exp-detail-subcard sm:col-span-2 ${
                              item.featuresVi && item.featuresVi.length > 0
                                ? 'md:col-span-5'
                                : 'md:col-span-12'
                            } flex flex-col justify-between p-4 rounded-[14px] min-w-0`}
                          >
                            <div className="space-y-2.5 min-w-0">
                              <div
                                className="subcard-header-sync flex items-center gap-2 min-w-0"
                                data-subcard-accent="cyan"
                              >
                                <WebIcon name="database" className="w-4 h-4 shrink-0" />
                                <h4
                                  className="typo-h4 subcard-title-synced font-play m-0 break-words"
                                  data-subcard-title="true"
                                >
                                  Hạ tầng kỹ thuật
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 typo-body-sm">
                                <div data-subcard="true" className="exp-detail-subcard p-2.5 rounded-[14px] min-w-0">
                                  <span className="typo-label text-[var(--text-secondary)] block font-mono">Dữ liệu (DB)</span>
                                  <span className="font-semibold text-[var(--text-primary)] mt-0.5 block break-words">{tech.database}</span>
                                </div>
                                <div data-subcard="true" className="exp-detail-subcard p-2.5 rounded-[14px] min-w-0">
                                  <span className="typo-label text-[var(--text-secondary)] block font-mono">Giao thức</span>
                                  <span className="font-semibold text-[var(--text-primary)] mt-0.5 block break-words">{tech.apiProtocol}</span>
                                </div>
                                <div data-subcard="true" className="exp-detail-subcard p-2.5 rounded-[14px] min-w-0">
                                  <span className="typo-label text-[var(--text-secondary)] block font-mono">Bảo mật</span>
                                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5 block break-words">{tech.isoSecurity}</span>
                                </div>
                                <div data-subcard="true" className="exp-detail-subcard p-2.5 rounded-[14px] min-w-0">
                                  <span className="typo-label text-[var(--text-secondary)] block font-mono">Phân hệ</span>
                                  <span className="font-semibold text-amber-700 dark:text-amber-300 mt-0.5 block break-words">{tech.ecosystemLabel}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ) : (
                      /* THẺ HỆ THỐNG BÌNH THƯỜNG:
                         Top: Tên đầy đủ tiếng Việt
                         Center: Bên trái (Tiêu đề viết tắt + Tiêu đề phụ dưới tiêu đề chính hiển thị tên đầy đủ) | Bên phải (Hình của hệ thống)
                         Bottom: null */
                      <div className={`system-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
                        {/* MẶT TRƯỚC (FRONT) - CHIỀU DÀI 3 KHU VỰC: TRÁI 10% BÁM SÁT BÊN TRÁI, CENTER flex-1, PHẢI 30% */}
                        <article
                          id={`systems-card-${item.id}`}
                          data-element-type="card"
                          data-section-card="true"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            handleToggleExpandCard(item.id, e);
                          }}
                          onKeyDown={(e) => {
                            if (e.target !== e.currentTarget) return;
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleToggleExpandCard(item.id);
                            }
                          }}
                          onMouseEnter={() => setHoveredCardId(item.id)}
                          onMouseLeave={() => {
                            setHoveredCardId(null);
                            setHoveredImgId(null);
                          }}
                          title={`Nhấp để mở rộng chi tiết thẻ: ${item.nameVi} (${item.abbr})`}
                           className="system-flip-front system-item bento-card glass-card layered-card cursor-pointer relative overflow-hidden p-3 sm:p-3.5 flex flex-row items-center justify-between gap-3 select-none rounded-[14px] group transition-all duration-300 border min-h-[110px] h-full hover:-translate-y-0.5 hover:shadow-md"
                          style={{
                            borderRadius: '14px',
                            '--system-theme-color': config.cardTheme,
                            '--system-theme-glow': `${config.cardTheme}35`,
                          } as any}
                        >
                          {item.videoUrl && (
                            <FullCardVideoPlayer
                              videoUrl={item.videoUrl}
                              isHovered={isImgHovered}
                            />
                          )}

                          {/* KHU VỰC NỘI DUNG: HÀNG 1 ICON & TÊN VIẾT TẮT | HÀNG 2 ICON & TÊN ĐẦY ĐỦ THEO NGÔN NGỮ (TIẾNG ANH / TIẾNG VIỆT) */}
                          <div
                            id="el-p8-div-100"
                            className={`flex-1 min-w-0 z-20 flex flex-col justify-center gap-1.5 text-left transition-opacity duration-200 ${
                              isImgHovered && item.videoUrl ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                          >
                            {/* Hàng 1 : Icon & Tên viết tắt */}
                            <div className="card-header-sync flex items-center gap-1.5 min-w-0" style={{ color: sysAccentColor }}>
                              <WebIcon
                                name={config.iconName}
                                className="w-[18px] h-[18px] shrink-0 stroke-[2.4]"
                                style={{ color: sysAccentColor, width: '18px', height: '18px' }}
                              />
                              <h3
                                className="card-title card-title-synced typo-h3 font-play truncate m-0 p-0"
                                data-card-title="true"
                                style={{ color: sysAccentColor }}
                                title={item.abbr}
                              >
                                {item.abbr}
                              </h3>
                            </div>

                            {/* Hàng 2 : Icon & Tên hệ thống theo ngôn ngữ (EN: Tên đầy đủ tiếng Anh | VI: Tên hệ thống tiếng Việt) */}
                            {(() => {
                              const localizedSubTitle =
                                language === 'en'
                                  ? item.nameEn || item.fullName || item.name || ''
                                  : item.nameVi || item.name || '';
                              return (
                                <div
                                  className="flex items-center gap-1.5 min-w-0 typo-body-sm font-semibold font-play text-[var(--text-heading,var(--text-primary))]"
                                  title={localizedSubTitle}
                                >
                                  <WebIcon
                                    name={language === 'en' ? 'layers' : 'globe'}
                                    className="w-3.5 h-3.5 shrink-0 opacity-85"
                                    style={{ color: sysAccentColor }}
                                  />
                                  <span className="truncate min-w-0">
                                    {localizedSubTitle}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* KHU VỰC PHẢI (CHIỀU DÀI CHIẾM 30%): HÌNH HỆ THỐNG */}
                          <div
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setHoveredImgId(item.id);
                            }}
                            title={`Hình hệ thống ${item.abbr}`}
                            className={`w-[30%] min-w-[75px] max-w-[130px] h-[85px] shrink-0 z-20 rounded-[14px] overflow-hidden flex items-center justify-center bg-transparent group/img cursor-pointer transition-all duration-300 border-0 shadow-none relative ${
                              isImgHovered && item.videoUrl ? 'opacity-0' : 'opacity-100'
                            }`}
                            style={{
                              color: isDark ? config.darkAccent : config.lightAccent,
                              background: 'transparent',
                            }}
                          >
                            {(config.illustrationSrc || item.imageUrl) ? (
                              <img
                                src={config.illustrationSrc || item.imageUrl}
                                alt={systemTitle4Words}
                                className="w-full h-full object-contain bg-transparent select-none pointer-events-none"
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <WebIcon
                                name={config.iconName}
                                className="w-6 h-6 stroke-[1.8]"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                              />
                            )}
                          </div>
                        </article>

                        {/* MẶT SAU (BACK) - KÍCH THƯỚC ĐỒNG NHẤT 90PX */}
                        <article
                          id={`system-card-back-${item.id}`}
                          data-element-type="card"
                          data-section-card="true"
                          onClick={(e) => handleFlipToggle(item.id, e)}
                          className="system-flip-back system-item bento-card glass-card layered-card cursor-pointer relative overflow-hidden p-3 flex flex-col justify-between select-none border rounded-[14px] min-h-[110px] h-full"
                          style={{
                            borderRadius: '14px',
                          }}
                        >

                          <div className="flex items-center justify-between gap-1 pb-1 border-b" style={{ borderColor: 'var(--border-subcard)' }}>
                            <span
                              className="typo-label font-mono tracking-tight truncate"
                              style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                            >
                              {item.abbr} — Hiệu Quả ROI
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleFlipToggle(item.id, e)}
                              className="theme-modal-close flex items-center gap-1 typo-badge px-2 py-0.5 rounded-full shrink-0 transition cursor-pointer shadow-2xs"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Quay lại</span>
                            </button>
                          </div>

                          <p className="typo-caption line-clamp-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {item.descVi}
                          </p>

                          <div className="flex items-center justify-between gap-2 typo-badge font-mono text-emerald-600 dark:text-emerald-400 pt-0.5 border-t border-slate-200/60 dark:border-white/10">
                            <span className="truncate">SLA: {tech.slaCommitment}</span>
                            <span className="truncate">{tech.isoSecurity}</span>
                          </div>
                        </article>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* VIDEO PLAYER LIGHTBOX MODAL (PHÁT LINK MP4 - ĐỒNG BỘ SÁNG & TỐI) */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Video Giới Thiệu Hệ Thống Vận Hành"
            onClick={(e) => e.stopPropagation()}
            className="theme-modal-card rounded-[14px] max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-left"
          >
            {/* Video Header */}
            <div className="theme-modal-header p-3.5 sm:p-4 flex items-center justify-between">
              <div className="subcard-header-sync flex items-center gap-2.5" style={{ color: 'var(--color-primary)' }}>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3" /></svg>
                </div>
                <div>
                  <h4 className="typo-popup-title subcard-title-synced tracking-wide font-play" data-subcard-title="true" style={{ color: 'var(--color-primary)' }}>
                    Video Giới Thiệu Hệ Thống Vận Hành
                  </h4>
                  <p className="typo-caption" style={{ color: 'var(--text-secondary)' }}>PowerService Enterprise Digital Architecture</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="theme-modal-close w-8 h-8 rounded-full flex items-center justify-center text-sm transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* HTML5 MP4 Video Player Frame */}
            <div className="relative w-full aspect-video bg-black rounded-[14px] overflow-hidden flex items-center justify-center">
              <video
                key={activeBannerVideo}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain rounded-[14px]"
                poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              >
                <source src={activeBannerVideo} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ phát video HTML5.
              </video>
            </div>

            {/* Video Footer */}
            <div className="theme-modal-footer p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBannerVideo(VIDEO_1_URL)}
                  data-selected={activeBannerVideo === VIDEO_1_URL ? 'true' : undefined}
                  style={
                    activeBannerVideo === VIDEO_1_URL
                      ? { background: 'var(--bg-button-primary)', color: '#FFFFFF' }
                      : undefined
                  }
                  className={`px-3 py-1 rounded-full typo-button transition cursor-pointer ${
                    activeBannerVideo === VIDEO_1_URL
                      ? 'shadow-xs'
                      : 'theme-modal-close'
                  }`}
                >
                  Video 1 (Hệ thống)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBannerVideo(VIDEO_2_URL)}
                  className={`px-3 py-1 rounded-full typo-button transition cursor-pointer ${
                    activeBannerVideo === VIDEO_2_URL
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'theme-modal-close'
                  }`}
                >
                  Video 2 (Giới thiệu bản thân)
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="theme-modal-close px-4 py-1.5 rounded-full typo-button transition cursor-pointer"
              >
                Đóng Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM DETAIL MODAL (KÍCH THƯỚC BẰNG THẺ CHÍNH VỚI PADDING 25PX Ở MỌI KÍCH THƯỚC) */}
      {selectedSystem && (
        <div
          onClick={() => setSelectedSystem(null)}
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-[15px] overflow-y-auto"
        >
          <div
            id={`system-detail-modal-${selectedSystem.id}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Chi tiết hệ thống ${selectedSystem.nameVi}`}
            data-element-type="card"
            data-section-card="true"
            onClick={(e) => e.stopPropagation()}
            className="theme-modal-card rounded-[14px] overflow-hidden shadow-2xl flex flex-col relative z-50 text-left"
            style={{ width: '100%', height: '100%', padding: '15px' }}
          >
            {/* Tiêu đề card chi tiết modal hệ thống & Nút X đóng */}
            {(() => {
              const headerConfig = SYSTEM_DESIGN_MAP[selectedSystem.id];
              const headerIcon = headerConfig?.iconName || systemIconMap[selectedSystem.id] || 'cog';
              const headerColor =
                cardStyle === 'cowhide-leather'
                  ? '#FDE68A'
                  : cardStyle === 'black-cowhide-leather'
                    ? '#E2E8F0'
                    : cardStyle === 'light-cowhide-leather'
                      ? '#0F172A'
                      : isDark
                        ? headerConfig?.darkAccent || '#60a5fa'
                        : headerConfig?.lightAccent || '#1d4ed8';
              return (
                <div className="flex items-center justify-between gap-3 px-3 sm:px-5 pt-2 pb-3 border-b border-[var(--border-subcard)] shrink-0">
                  <div className="card-header-sync flex items-center gap-2.5 min-w-0 flex-1" style={{ color: headerColor }}>
                    <WebIcon
                      name={headerIcon}
                      className="w-5 h-5 shrink-0"
                      style={{ color: headerColor }}
                    />
                    <h3
                      className="typo-h3 card-title-synced font-play font-bold truncate m-0"
                      data-card-title="true"
                      style={{ color: headerColor }}
                      title={`Chi tiết hệ thống: ${selectedSystem.abbr} — ${selectedSystem.nameVi || selectedSystem.name}`}
                    >
                      Chi tiết hệ thống: {selectedSystem.abbr} — {selectedSystem.nameVi || selectedSystem.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedSystem(null);
                    }}
                    className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:bg-[var(--bg-button-primary)] hover:text-white text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                    title={isEn ? "Close details" : "Đóng chi tiết"}
                    aria-label={isEn ? "Close details" : "Đóng chi tiết hệ thống"}
                  >
                    <WebIcon name="x" className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}

            {/* Modal Body with Bento Responsive Grid */}
            <div className="p-3 sm:p-5 space-y-4 max-h-[78vh] overflow-y-auto glass-scrollbar rounded-[14px] font-play flex-1">
              {(() => {
                const modalConfig = SYSTEM_DESIGN_MAP[selectedSystem.id];
                const specInfo = SYSTEM_TECH_SPECS_MAP[selectedSystem.id] || {
                  database: 'PostgreSQL HA + Redis Cluster',
                  apiProtocol: 'RESTful API / gRPC / Webhook',
                  slaCommitment: '99.98% SLA Uptime',
                  isoSecurity: 'ISO/IEC 27001:2022 • Zero-Trust',
                  uptimePct: '99.98%',
                  baseOnlineUsers: 120,
                  onlineRoleLabel: 'Active Users',
                  ecosystemGroup: 'cskh',
                  ecosystemLabel: 'Vận hành CSKH',
                };

                const modalIconName = modalConfig?.iconName || systemIconMap[selectedSystem.id] || 'cog';

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-[15px] items-stretch text-left">
                    {/* BENTO CARD 1 (12/12): Thông tin hệ thống (gồm Tên hệ thống, Tên viết tắt, Tên viết tắt tiếng Anh, video & Mô tả hệ thống) */}
                    <div data-subcard="true" className="exp-detail-subcard sm:col-span-2 md:col-span-12 p-4 rounded-[14px] flex flex-col gap-3 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="indigo">
                        <WebIcon name="layers" className="w-[18px] h-[18px] shrink-0" />
                        <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                          Thông tin hệ thống
                        </h4>
                      </div>

                      {/* 3 Thẻ thông tin định danh hệ thống bên trong Thông tin hệ thống */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-stretch min-w-0">
                        {/* Tên hệ thống (4/12) */}
                        <div data-subcard="true" className="exp-detail-subcard sm:col-span-1 md:col-span-4 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                          <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="sky">
                            <WebIcon name={modalIconName} className="w-[18px] h-[18px] shrink-0" />
                            <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                              Tên hệ thống
                            </h4>
                          </div>
                          <span className="typo-body-sm font-semibold text-[var(--text-primary)] block break-words">
                            {selectedSystem.nameVi || selectedSystem.name}
                          </span>
                        </div>

                        {/* Tên viết tắt (3/12) */}
                        <div data-subcard="true" className="exp-detail-subcard sm:col-span-1 md:col-span-3 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                          <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="amber">
                            <WebIcon name="file-text" className="w-[18px] h-[18px] shrink-0" />
                            <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                              Tên viết tắt
                            </h4>
                          </div>
                          <span className="typo-h4 font-bold text-sky-700 dark:text-[#67E8F9] font-mono block break-words">
                            {selectedSystem.abbr}
                          </span>
                        </div>

                        {/* Tên viết tắt tiếng Anh (5/12) */}
                        <div data-subcard="true" className="exp-detail-subcard sm:col-span-2 md:col-span-5 p-3.5 rounded-[14px] min-w-0 flex flex-col justify-between gap-1.5">
                          <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="violet">
                            <WebIcon name="globe" className="w-[18px] h-[18px] shrink-0" />
                            <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                              Tên viết tắt tiếng Anh
                            </h4>
                          </div>
                          <span className="typo-body-sm font-semibold text-[var(--text-primary)] block break-words">
                            {selectedSystem.nameEn || selectedSystem.fullName?.split('—')[0]?.split('-')[0]?.trim() || selectedSystem.abbr}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-[15px] items-stretch min-w-0">
                        {(selectedSystem.videoUrl || modalConfig?.illustrationSrc || selectedSystem.imageUrl) && (
                          <div
                            id={`system-modal-media-${selectedSystem.id}`}
                            className={`md:col-span-5 relative w-full aspect-video rounded-[14px] overflow-hidden min-w-0 ${
                              selectedSystem.videoUrl ? 'bg-black' : 'bg-transparent'
                            }`}
                          >
                            {selectedSystem.videoUrl ? (
                              <video
                                src={selectedSystem.videoUrl}
                                poster={modalConfig?.illustrationSrc || selectedSystem.imageUrl || undefined}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover rounded-[14px] pointer-events-none select-none"
                              >
                                Trình duyệt của bạn không hỗ trợ phát video HTML5.
                              </video>
                            ) : (
                              <img
                                src={modalConfig?.illustrationSrc || selectedSystem.imageUrl}
                                alt={selectedSystem.nameVi}
                                className="w-full h-full object-contain rounded-[14px] bg-transparent p-2"
                              />
                            )}
                          </div>
                        )}
                        <div
                          id={`system-modal-desc-${selectedSystem.id}`}
                          data-subcard="true"
                          className={`exp-detail-subcard p-[15px] rounded-[14px] flex flex-col justify-start gap-2.5 h-full min-w-0 ${
                            selectedSystem.videoUrl || modalConfig?.illustrationSrc || selectedSystem.imageUrl
                              ? 'md:col-span-7'
                              : 'md:col-span-12'
                          }`}
                        >
                          <div
                            className="subcard-header-sync flex items-center gap-2 min-w-0 pb-2 border-b border-[var(--border-subcard)]"
                            data-subcard-accent="blue"
                          >
                            <WebIcon name="file-text" className="w-4 h-4 shrink-0" />
                            <h4
                              className="typo-h4 subcard-title-synced font-play m-0 break-words"
                              data-subcard-title="true"
                            >
                              Mô tả hệ thống
                            </h4>
                          </div>
                          <p className="typo-body-sm sm:typo-body text-[var(--text-primary)] leading-relaxed break-words m-0">
                            {selectedSystem.description || selectedSystem.descEn || selectedSystem.descVi}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BENTO CARD 6 (7/12): Danh sách tính năng (dạng list) */}
                    <div id="systems-workflow-card" data-subcard="true" className="exp-detail-subcard sm:col-span-2 md:col-span-7 p-[15px] rounded-[14px] shadow-md space-y-3 h-full min-w-0">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)]">
                        <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="emerald">
                          <WebIcon name="sparkles" className="w-[18px] h-[18px] shrink-0" />
                          <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                            Danh sách tính năng
                          </h4>
                        </div>
                      </div>

                      <ul className="flex flex-col gap-2 list-none p-0 m-0 w-full">
                        {(selectedSystem.featuresVi || selectedSystem.features || []).map((feat: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 py-2 border-b border-[var(--border-subcard)] last:border-b-0 typo-body-sm text-[var(--text-primary)] min-w-0"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                              <WebIcon name="check" className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="break-words min-w-0 flex-1 leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* BENTO CARD 7 (5/12): Hạ tầng kỹ thuật */}
                    <div id="systems-tech-card" data-subcard="true" className="exp-detail-subcard sm:col-span-2 md:col-span-5 p-[15px] rounded-[14px] shadow-md flex flex-col gap-[15px] h-full min-w-0">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)]">
                        <div className="subcard-header-sync flex items-center gap-2 min-w-0" data-subcard-accent="purple">
                          <WebIcon name="cpu" className="w-[18px] h-[18px] shrink-0" />
                          <h4 className="typo-h4 subcard-title-synced font-play m-0 break-words" data-subcard-title="true">
                            Hạ tầng kỹ thuật
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-col gap-[15px] typo-body-sm">
                        <div data-subcard="true" className="exp-detail-subcard p-[15px] rounded-[14px] flex items-center justify-between gap-[15px] min-w-0">
                          <span className="text-[var(--text-secondary)] font-medium">Cơ sở dữ liệu:</span>
                          <span className="font-semibold text-sky-700 dark:text-[#67E8F9] font-mono text-right break-words">{specInfo.database}</span>
                        </div>

                        <div data-subcard="true" className="exp-detail-subcard p-[15px] rounded-[14px] flex items-center justify-between gap-[15px] min-w-0">
                          <span className="text-[var(--text-secondary)] font-medium">Giao thức API:</span>
                          <span className="font-semibold text-purple-700 dark:text-purple-300 font-mono text-right break-words">{specInfo.apiProtocol}</span>
                        </div>

                        <div data-subcard="true" className="exp-detail-subcard p-[15px] rounded-[14px] flex items-center justify-between gap-[15px] min-w-0">
                          <span className="text-[var(--text-secondary)] font-medium">Cam kết SLA:</span>
                          <span className="font-semibold text-emerald-700 dark:text-[#6EE7B7] font-mono text-right break-words">{specInfo.slaCommitment}</span>
                        </div>

                        <div data-subcard="true" className="exp-detail-subcard p-[15px] rounded-[14px] flex items-center justify-between gap-[15px] min-w-0">
                          <span className="text-[var(--text-secondary)] font-medium">Bảo mật ISO:</span>
                          <span className="font-semibold text-amber-700 dark:text-[#FCD34D] font-mono text-right break-words">{specInfo.isoSecurity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="theme-modal-footer p-4 flex items-center justify-between gap-3">
              <span className="typo-caption flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedSystem.id === 'bi' ? 'bg-amber-400' : 'bg-emerald-500 dark:bg-emerald-400'
                  }`}
                />
                <span>
                  {selectedSystem.id === 'bi'
                    ? 'Đang hoàn thiện kết nối API'
                    : 'Cổng hoạt động chính thức'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSystem(null)}
                  className="theme-modal-close px-4 py-2 rounded-full typo-button transition cursor-pointer"
                >
                  Đóng
                </button>

                {selectedSystem.url && selectedSystem.url !== '#' && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenUrl(e, selectedSystem.url)}
                    className="px-4 py-2 rounded-full typo-button text-white flex items-center gap-1.5 shadow-md transition cursor-pointer hover:brightness-110 active:scale-95"
                    style={{
                      background:
                        SYSTEM_DESIGN_MAP[selectedSystem.id]?.gradient || selectedSystem.gradient,
                    }}
                  >
                    <span>Mở Website Cổng Vận Hành</span>
                    <WebIcon name="external-link" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTHOR ARCHITECT INFO MODAL */}
      {isAuthorModalOpen && (
        <div
          onClick={() => setIsAuthorModalOpen(false)}
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Kiến Trúc Sư Hệ Thống CX/CSKH"
            onClick={(e) => e.stopPropagation()}
            className="theme-modal-card rounded-[14px] max-w-md w-full p-6 text-center shadow-2xl relative"
          >
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-indigo-500/30 mb-3 shadow-md">
              <img
                src="https://i.ibb.co/RT3jX4Mv/H-ng-Th-i-Avata-Gif.gif"
                alt="Kiến Trúc Sư"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="typo-popup-title font-play" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
              Kiến Trúc Sư Hệ Thống CX/CSKH
            </h3>
            <p className="typo-label mb-3" style={{ color: 'var(--text-link, var(--color-primary))' }}>
              PowerService Enterprise Suite
            </p>
            <p className="typo-body mb-4" style={{ color: 'var(--text-secondary)' }}>
              Hệ sinh thái gồm 12 phân hệ tích hợp toàn diện, chuẩn hóa dữ liệu tập trung theo mô hình Omnichannel, tự động hóa quy trình nghiệp vụ và tích hợp Trợ lý Trí tuệ Nhân tạo 24/7.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthorModalOpen(false)}
              style={{ background: 'var(--bg-button-primary)' }}
              className="px-5 py-2 rounded-full typo-button text-white hover:opacity-90 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* 3. Chế độ xem thu nhỏ góc màn hình (Picture-in-Picture Mini Player) */}
      {isPipActive && !isPipDismissed && activeBannerVideo === VIDEO_2_URL && (
        <aside
          role="complementary"
          aria-label="Cửa sổ thu nhỏ thuyết minh video"
          className="theme-pip-player fixed bottom-5 right-5 z-50 w-72 sm:w-80 rounded-[14px] overflow-hidden shadow-2xl transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header thanh PiP */}
          <div className="theme-pip-header flex items-center justify-between px-3.5 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.5s_infinite]" />
                <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-[pulse_0.35s_infinite]" />
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.6s_infinite]" />
              </span>
              <span className="typo-badge font-play truncate" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                Đang phát thuyết minh
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (systemsGridRef.current) {
                    systemsGridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  setIsPipActive(false);
                }}
                className="theme-modal-close p-1 rounded-[14px] transition cursor-pointer"
                title="Cuộn về video chính"
              >
                <WebIcon name="maximize" className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsPipDismissed(true)}
                className="theme-modal-close p-1 rounded-[14px] transition cursor-pointer"
                title="Tạm ẩn cửa sổ mini"
              >
                <WebIcon name="cancel" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video preview nhỏ */}
          <div className="relative aspect-video bg-black rounded-[14px] overflow-hidden group">
            <video
              ref={pipVideoRef}
              src={VIDEO_2_URL}
              autoPlay
              playsInline
              loop
              muted={isBannerMuted}
              className="w-full h-full object-cover rounded-[14px] pointer-events-none"
            />
            {/* Overlay badge thời gian */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs typo-badge font-mono text-rose-300 border border-white/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{formatCountdown(videoTimeLeft)}</span>
            </div>
          </div>

          {/* Footer nút điều khiển PiP */}
          <div className="theme-pip-footer p-2.5 flex items-center justify-between gap-2">
            {/* Nút Loa */}
            <button
              type="button"
              onClick={(e) => toggleBannerMute(e)}
              className="theme-modal-close p-2 rounded-[14px] transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
              title={isBannerMuted ? 'Mở âm thanh' : 'Tắt âm thanh'}
            >
              {isBannerMuted ? (
                <WebIcon name="volume-x" className="w-4 h-4" />
              ) : (
                <WebIcon name="volume-2" className="w-4 h-4 text-emerald-400" sparkle />
              )}
            </button>

            {/* Nút Dừng nghe */}
            <button
              type="button"
              onClick={() => {
                setActiveBannerVideo(VIDEO_1_URL);
                setIsBannerMuted(true);
                saveMutedPref(true);
                setIsPipActive(false);
                showToast('Đã dừng nghe — Quay về Video Hệ thống');
              }}
              className="flex-1 px-3 py-1.5 rounded-[14px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white typo-button font-play flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
            >
              <WebIcon name="cancel" className="w-3.5 h-3.5" />
              <span>Dừng nghe</span>
            </button>
          </div>
        </aside>
      )}

      {/* SƠ ĐỒ LIÊN KẾT HỆ THỐNG MODAL */}
      <EcosystemDiagramModal
        isOpen={isEcosystemDiagramOpen}
        onClose={() => setIsEcosystemDiagramOpen(false)}
        onShowNotification={showToast}
      />

    </div>
  );
};

export default SystemsView;
