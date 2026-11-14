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
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
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

// Bảng tiêu đề tiếng Việt chuẩn hóa đúng 6 chữ cho 12 hệ thống
const SYSTEM_6_WORDS_TITLE: Record<string, string> = {
  sdp: 'Cổng dịch vụ làm việc CSKH',
  erp: 'Quản trị tài chính kế toán',
  crm: 'Quản lý quan hệ khách hàng',
  hrm: 'Quản lý nguồn nhân lực số',
  bpm: 'Quản lý quy trình nghiệp vụ',
  okr: 'Quản lý mục tiêu kết quả',
  clp: 'Chăm sóc khách hàng thân thiết',
  lms: 'Quản lý đào tạo trực tuyến',
  csc: 'Trung tâm chăm sóc khách hàng',
  bi: 'Hệ thống báo cáo phân tích',
  ai: 'Trợ lý trí tuệ nhân tạo',
  pos: 'Quản lý bán hàng thanh toán',
};

export const SystemsView: React.FC<SystemsViewProps> = ({ currentTheme, onShowNotification }) => {
  const { showToast } = useToast();
  const { language, t, translateText } = useLanguage();
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<SystemData | null>(null);
  const [postcardSystem, setPostcardSystem] = useState<SystemData | null>(null);
  const [isPostcardSpeaking, setIsPostcardSpeaking] = useState<boolean>(false);
  const [isPostcardVoiceLoading, setIsPostcardVoiceLoading] = useState<boolean>(false);
  const postcardSessionRef = useRef<number>(0);
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

  // Floating Circle Video & 6-Card Stage Intro Player (Trang Hệ Thống)
  const circleVideoRef = useRef<HTMLVideoElement>(null);
  const introStageVideoRef = useRef<HTMLVideoElement>(null);
  const cardsGridContainerRef = useRef<HTMLDivElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [isIntroStageMuted, setIsIntroStageMuted] = useState<boolean>(false);
  const [sixCardBoxSize, setSixCardBoxSize] = useState<{ width: number; height: number } | null>(null);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const measureSixCardsBox = useCallback((): { width: number; height: number } | null => {
    const gridEl = cardsGridContainerRef.current || systemsGridRef.current;
    if (!gridEl) return null;
    const gridRect = gridEl.getBoundingClientRect();
    if (gridRect.width <= 0) return null;

    const firstCardKey = Object.keys(cardElementRefs.current).find((k) => cardElementRefs.current[k]);
    const firstCardEl = firstCardKey ? cardElementRefs.current[firstCardKey] : null;
    const cardRect = firstCardEl?.getBoundingClientRect();

    const singleCardW = cardRect && cardRect.width > 0 ? cardRect.width : gridRect.width / 4;
    const singleCardH = cardRect && cardRect.height > 0 ? cardRect.height : 140;
    const sixCardsArea = 6 * singleCardW * singleCardH + 15 * singleCardH * 2;

    let targetWidth = Math.round(Math.sqrt((sixCardsArea * 16) / 9));
    targetWidth = Math.min(Math.round(gridRect.width), Math.max(320, targetWidth));
    let targetHeight = Math.round((targetWidth * 9) / 16);

    const maxAvailHeight = Math.max(gridRect.height, singleCardH * 3 + 30);
    if (targetHeight > maxAvailHeight && maxAvailHeight >= 240) {
      targetHeight = Math.round(maxAvailHeight);
      targetWidth = Math.round((targetHeight * 16) / 9);
    }

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

    const measured = measureSixCardsBox();
    if (measured) {
      setSixCardBoxSize(measured);
    }
    setExpandedSystemId(null);
    setSelectedSystem(null);
    setIsCircleVideoPlaying(true);
    showToast('Đang phát video giới thiệu hệ thống 🔊');
  }, [isCircleVideoPlaying, handleCloseIntroVideo, measureSixCardsBox, showToast]);

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
  const [isExpandedVideoMuted, setIsExpandedVideoMuted] = useState<boolean>(true);
  const [isExpandedVideoPlaying, setIsExpandedVideoPlaying] = useState<boolean>(true);
  const expandedVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleToggleExpandCard = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedSystemId === id) {
      SoundEngine.playTechChimeCollapse();
      setExpandedSystemId(null);
    } else {
      SoundEngine.playTechChimeExpand();
      setExpandedSystemId(id);
      setIsExpandedVideoPlaying(true);
    }
  };

  const handleExpandSystem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTechChimeExpand();
    setExpandedSystemId(id);
    setIsExpandedVideoPlaying(true);
  };

  const handleCollapseSystem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTechChimeCollapse();
    setExpandedSystemId(null);
  };

  const handleToggleExpandedVideoPlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = expandedVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsExpandedVideoPlaying(true);
    } else {
      video.pause();
      setIsExpandedVideoPlaying(false);
    }
  };

  const handleToggleExpandedVideoMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = expandedVideoRef.current;
    if (!video) return;
    const nextMuted = !isExpandedVideoMuted;
    setIsExpandedVideoMuted(nextMuted);
    video.muted = nextMuted;
    showToast(nextMuted ? 'Đã tắt âm thanh video chi tiết' : 'Đã bật âm thanh video chi tiết 🔊');
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
  const isDark = themeIsDark || currentTheme === 'dark-neon';

  const buildSystemPostcardNarration = useCallback(
    (item: SystemData): string => {
      const spec = SYSTEM_TECH_SPECS_MAP[item.id] || SYSTEM_TECH_SPECS_MAP.sdp;
      const featuresList =
        language === 'en'
          ? (item.featuresEn && item.featuresEn.length > 0
              ? item.featuresEn
              : (item.featuresVi || item.features || []).map((f) => translateText(f)))
          : item.featuresVi || item.features || [];
      const topFeatures = featuresList.slice(0, 3).join('. ');

      if (language === 'en') {
        const name = item.nameEn || item.name || item.abbr;
        const overview = item.descEn || translateText(item.descVi || item.description || '');
        return `Hello, I am Tri Nhan, AI Support Assistant for Nguyen Hung Thai. Introducing the ${name} system, abbreviated ${item.abbr}. ${overview} Technical commitment: ${spec.slaCommitment}, ${spec.uptimePct} uptime, ${spec.isoSecurity}. Key highlights: ${topFeatures}.`;
      }

      const name = item.nameVi || item.name || item.abbr;
      const overview = item.descVi || item.description || '';
      return `Xin chào, tôi là Trí Nhân, Trợ lý AI hỗ trợ của chuyên gia Nguyễn Hùng Thái. Xin giới thiệu hệ thống ${name}, mã phân hệ ${item.abbr}. ${overview} Cam kết vận hành: ${spec.slaCommitment}, độ ổn định ${spec.uptimePct}, chuẩn bảo mật ${spec.isoSecurity}. Điểm nổi bật: ${topFeatures}.`;
    },
    [language, translateText]
  );

  const speakSystemPostcard = useCallback(
    (item: SystemData) => {
      postcardSessionRef.current += 1;
      const sessionId = postcardSessionRef.current;
      stopActiveSpeech();
      setIsPostcardVoiceLoading(true);
      setIsPostcardSpeaking(false);

      const narration = buildSystemPostcardNarration(item);
      speakSiteText(narration, {
        lang: language,
        useGeminiTts: true,
        rate: 1.0,
        onStart: () => {
          if (postcardSessionRef.current !== sessionId) return;
          setIsPostcardVoiceLoading(false);
          setIsPostcardSpeaking(true);
          showToast(
            t(
              `🎧 Trợ lý AI Trí Nhân đang giới thiệu hệ thống ${item.abbr}`,
              `🎧 AI Assistant Tri Nhan is presenting ${item.abbr}`
            )
          );
        },
        onEnd: () => {
          if (postcardSessionRef.current !== sessionId) return;
          setIsPostcardVoiceLoading(false);
          setIsPostcardSpeaking(false);
        },
        onError: () => {
          if (postcardSessionRef.current !== sessionId) return;
          setIsPostcardVoiceLoading(false);
          setIsPostcardSpeaking(false);
          showToast(
            t(
              '⚠️ Không thể phát âm thanh thuyết minh AI',
              '⚠️ Unable to play AI voice narration'
            )
          );
        },
      });
    },
    [buildSystemPostcardNarration, language, showToast, t]
  );

  const handleOpenSystemPostcard = useCallback(
    (item: SystemData, e?: React.MouseEvent) => {
      e?.stopPropagation();
      SoundEngine.playTechChimeExpand();
      setPostcardSystem(item);
      speakSystemPostcard(item);
    },
    [speakSystemPostcard]
  );

  const handleStopPostcardVoice = useCallback(() => {
    postcardSessionRef.current += 1;
    stopActiveSpeech();
    setIsPostcardVoiceLoading(false);
    setIsPostcardSpeaking(false);
  }, []);

  const handleCloseSystemPostcard = useCallback(() => {
    handleStopPostcardVoice();
    setPostcardSystem(null);
  }, [handleStopPostcardVoice]);

  useEffect(() => {
    return () => {
      stopActiveSpeech();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (postcardSystem) {
        handleCloseSystemPostcard();
        return;
      }
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    postcardSystem,
    selectedSystem,
    isVideoModalOpen,
    isAuthorModalOpen,
    isFilterDropdownOpen,
    handleCloseSystemPostcard,
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
      label: 'Tất cả hệ thống',
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

  const systemStatusBadge: Record<string, { text: string; dotColor: string }> = {
    sdp: { text: 'Trực tuyến', dotColor: 'bg-emerald-400' },
    erp: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    crm: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    hrm: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    bpm: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    okr: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    clp: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    lms: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    csc: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
    bi: { text: 'Đang tích hợp API', dotColor: 'bg-amber-400' },
    ai: { text: 'AI Trực Tuyến', dotColor: 'bg-fuchsia-400' },
    pos: { text: 'Hoạt động', dotColor: 'bg-emerald-400' },
  };

  return (
    <div
      id="systems-page-container"
      ref={systemsGridRef}
      onScroll={handleGridScroll}
      data-element-name="Trang Hệ Thống Vận Hành"
      data-element-type="card"
      data-section-card="true"
      data-element-page="systems"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card relative w-full h-full max-h-full flex flex-col justify-between p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
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
            className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-hidden relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
            style={{ padding: '15px', width: '100%', maxWidth: '100%', height: '200px', minHeight: '200px', maxHeight: '200px', borderRadius: '14px' }}
          >
            <div
              className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0f172a 100%)',
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
                className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <WebIcon
                  name="network"
                  className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
                  style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
                />
                <h1
                  className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
                  style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  Hệ thống vận hành
                </h1>
              </div>
              <p
                className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
                style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
              >
                &quot;Hệ thống thông minh, vận hành tinh gọn và đồng bộ ♡&quot;
              </p>
            </div>

            <div className="relative z-30 flex flex-wrap items-center justify-start gap-2.5 mt-auto" ref={filterDropdownRef}>
              {/* NÚT SƠ ĐỒ LIÊN KẾT HỆ THỐNG */}
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTechChimeExpand();
                  setIsEcosystemDiagramOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.6)] border border-blue-300/40 backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
                title="Mở Sơ đồ liên kết 12 Phân hệ PowerService"
              >
                <WebIcon name="git-merge" className="w-4 h-4 text-white animate-pulse shrink-0" />
                <span>Sơ đồ liên kết</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                  12 Phân hệ
                </span>
              </button>

              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsFilterDropdownOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
                  title="Bộ lọc hệ thống"
                  aria-expanded={isFilterDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon name="sliders" className="w-4 h-4 text-orange-700 dark:text-orange-400 transition-transform group-hover:rotate-45 shrink-0" />
                  <span>Bộ lọc hệ thống</span>
                  {activeCategory !== 'all' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-300 dark:border-orange-500/50 text-[10px] font-mono text-orange-900 dark:text-orange-200 font-bold">
                      {ecosystemSegments.find((s) => s.id === activeCategory)?.label}
                    </span>
                  )}
                  <WebIcon
                    name="chevron-down"
                    className={cn(
                      'w-3.5 h-3.5 text-orange-700 dark:text-orange-400 transition-transform duration-200 shrink-0',
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
                      className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 rounded-[14px] bg-white/98 dark:bg-[#111827]/96 border border-orange-200 dark:border-[#334155] shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-2xl py-2 px-2 z-50 flex flex-col gap-1 text-slate-800 dark:text-[#E2E8F0]"
                    >
                      {ecosystemSegments.map((seg) => {
                        const isActive = activeCategory === seg.id;
                        return (
                          <button
                            key={seg.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveCategory(seg.id);
                              setExpandedSystemId(null);
                              setIsCircleVideoPlaying(false);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center justify-between px-3 py-2 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left',
                              isActive
                                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-400/50 shadow-xs'
                                : 'text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium'
                            )}
                          >
                            <span>{seg.label} ({seg.count})</span>
                            {isActive && <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />}
                          </button>
                        );
                      })}

                    </motion.div>
                  )}
                </AnimatePresence>
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
                className="bento-card glass-card w-full max-w-[740px] flex flex-col rounded-[14px] overflow-hidden border border-slate-300/80 dark:border-white/20 shadow-2xl bg-slate-950/95 backdrop-blur-xl"
                style={
                  sixCardBoxSize
                    ? {
                        width: `${sixCardBoxSize.width}px`,
                        maxWidth: '100%',
                        borderRadius: '14px',
                      }
                    : { borderRadius: '14px' }
                }
              >
                <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-900/90 border-b border-white/10 text-white shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    <span className="text-xs sm:text-sm font-bold font-play text-cyan-300 truncate">
                      Video giới thiệu hệ thống vận hành
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-play transition cursor-pointer shadow-sm active:scale-95"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                      <span>Đóng video</span>
                    </button>
                  </div>
                </div>

                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <video
                    ref={introStageVideoRef}
                    src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                    controls
                    autoPlay
                    playsInline
                    muted={isIntroStageMuted}
                    onEnded={handleIntroVideoEnded}
                    className="w-full h-full object-contain bg-black"
                  >
                    Trình duyệt của bạn không hỗ trợ phát video HTML5.
                  </video>
                </div>
              </div>
            </motion.div>
          ) : filteredSystems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/75 dark:bg-slate-900/70 rounded-[14px] border border-slate-200/90 dark:border-white/15 backdrop-blur-md flex flex-col items-center justify-center flex-1 shadow-xs">
              <div className="w-12 h-12 rounded-[14px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                <WebIcon name="search" className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-slate-800 dark:text-white font-play">
                Không tìm thấy hệ thống phù hợp
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hãy thử nhập từ khóa khác như &quot;CRM&quot;, &quot;ERP&quot;, &quot;LMS&quot; hoặc &quot;CSKH&quot;...
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 rounded-full text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm"
              >
                Xem lại tất cả 12 hệ thống
              </button>
            </div>
          ) : viewMode === 'matrix' ? (
            /* 4. CHẾ ĐỘ XEM THẺ DẠNG BẢNG MA TRẬN TÍNH NĂNG (COMPACT COMPARISON MATRIX VIEW) */
            <div className="flex-1 min-h-0 overflow-auto glass-scrollbar">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/15 text-[10.5px] font-mono tracking-wider text-[#475569] dark:text-[#67E8F9]">
                  <tr>
                    <th className="py-2.5 px-3 font-black">Phân hệ (12)</th>
                    <th className="py-2.5 px-2.5 font-black">Nhóm tác nghiệp</th>
                    <th className="py-2.5 px-2.5 font-black">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="database" className="w-3 h-3 text-sky-500" />
                        <span>Cơ sở dữ liệu (DB)</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-black">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="zap" className="w-3 h-3 text-indigo-500" />
                        <span>API kết nối</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-black">Cam kết SLA</th>
                    <th className="py-2.5 px-2.5 font-black">
                      <span className="inline-flex items-center gap-1">
                        <WebIcon name="shield" className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Chuẩn ISO 27001</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 font-black text-right">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/10 text-xs">
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
                        onClick={() => handleCardClick(item)}
                        className="hover:bg-sky-50/70 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {/* Cột 1: Mã & Tên 4 chữ */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <WebIcon name={config.iconName} className="w-[18px] h-[18px] shrink-0" style={{ color: isDark ? config.darkAccent : config.lightAccent, width: '18px', height: '18px' }} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-black bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-cyan-300">
                                  {item.abbr}
                                </span>
                                <span className="font-bold font-play text-slate-800 dark:text-white truncate">
                                  {config.displayTitle}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                                {item.fullName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Nhóm phân hệ */}
                        <td className="py-2 px-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-500/30">
                            {tech.ecosystemLabel}
                          </span>
                        </td>

                        {/* Cột 3: Cơ sở dữ liệu */}
                        <td className="py-2 px-2.5 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                          {tech.database}
                        </td>

                        {/* Cột 4: API kết nối */}
                        <td className="py-2 px-2.5 font-mono text-[11px] text-sky-700 dark:text-cyan-300 font-semibold">
                          {tech.apiProtocol}
                        </td>

                        {/* Cột 5: Cam kết SLA */}
                        <td className="py-2 px-2.5">
                          <span className="px-2 py-0.5 rounded-[14px] text-[10.5px] font-mono font-bold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {tech.slaCommitment}
                          </span>
                        </td>

                        {/* Cột 6: Tiêu chuẩn an toàn thông tin ISO 27001 */}
                        <td className="py-2 px-2.5">
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-700 dark:text-slate-200">
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
                                className="px-3 py-1 rounded-[14px] text-[10px] font-bold text-white shadow-2xs inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
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
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] items-stretch p-0 bg-transparent text-[15px] relative grid-flow-row-dense"
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
                const systemTitle6Words = SYSTEM_6_WORDS_TITLE[item.id] || item.nameVi;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      cardElementRefs.current[item.id] = el;
                    }}
                    className={`system-flip-wrap ${
                      isExpanded
                        ? 'col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-3 row-span-3 z-25 min-h-[340px]'
                        : 'col-span-1 row-span-1 z-1'
                    } transition-all duration-500 ease-out`}
                  >
                    {isExpanded ? (
                      /* THẺ MỞ RỘNG: Kích thước tinh chỉnh 1/2 chiều cao */
                      <article
                        id={`system-expanded-card-${item.id}`}
                        data-element-type="card"
                        data-section-card="true"
                        onClick={(e) => e.stopPropagation()}
                        className="system-item bento-card glass-card layered-card relative w-full min-h-[340px] h-full rounded-[14px] overflow-hidden p-[15px] flex flex-col justify-between select-none border transition-all duration-500 backdrop-blur-xl"
                        style={{
                          ...cardSampleStyle,
                          borderRadius: '14px',
                          padding: '15px',
                        }}
                      >
                        {/* Header Thẻ Mở Rộng: Tiêu đề, Huy hiệu bảo mật, SLA, Cụm nút tác vụ */}
                        <div className="flex flex-wrap items-center justify-between gap-[15px] pb-[15px] border-b border-black/10 dark:border-white/20 shrink-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <WebIcon name={config.iconName} className="w-[18px] h-[18px] shrink-0" style={{ color: isDark ? config.darkAccent : config.lightAccent, width: '18px', height: '18px' }} />
                            <span
                              className="px-2.5 py-0.5 rounded-[14px] text-xs font-mono font-black text-white border border-white/25 tracking-wider"
                              style={{ backgroundColor: config.lightAccent }}
                            >
                              {item.abbr}
                            </span>
                            <h3
                               className="card-title text-[18px] font-bold sm:text-xl"
                               style={{ color: isDark ? config.darkAccent : config.lightAccent, fontSize: '18px' }}
                             >
                               {item.nameVi}
                             </h3>
                          </div>

                            {/* Nút Mở Postcard & Nghe AI Trí Nhân giới thiệu */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenSystemPostcard(item, e)}
                              className="bento-card px-3.5 py-1.5 rounded-[14px] text-xs font-bold text-indigo-700 dark:text-cyan-300 shadow-sm transition flex items-center gap-1.5 cursor-pointer bg-indigo-50/90 dark:bg-indigo-950/60 hover:brightness-105 border border-indigo-300/70 dark:border-cyan-400/35 active:scale-95"
                              title={t(
                                `Mở Postcard giới thiệu hệ thống ${item.abbr} & nghe giọng AI`,
                                `Open ${item.abbr} intro postcard & play AI voice`
                              )}
                            >
                              <WebIcon name="volume-2" className="w-3.5 h-3.5" />
                              <span>{t('Postcard & Giọng AI', 'AI Voice Postcard')}</span>
                            </button>

                            {/* Nút 1: Mở hệ thống ở tab khác */}
                            {item.url && item.url !== '#' && (
                              <button
                                type="button"
                                onClick={(e) => handleOpenUrl(e, item.url)}
                                className="bento-card px-3.5 py-1.5 rounded-[14px] text-xs font-bold text-slate-800 dark:text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer bg-white/85 dark:bg-white/15 hover:brightness-105 border border-slate-300/70 dark:border-white/25 active:scale-95"
                                title={t(`Mở hệ thống ${item.abbr} ở tab khác`, `Open ${item.abbr} in new tab`)}
                              >
                                <span>{t('Mở tab mới', 'Open Tab')}</span>
                                <WebIcon name="external-link" className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Nút đóng thẻ chi tiết */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleExpandCard(item.id, e)}
                              title="Đóng chi tiết hệ thống"
                              className="px-3.5 py-1.5 rounded-[14px] text-xs font-bold font-play flex items-center gap-1.5 border border-rose-400/50 bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-sm active:scale-95 shrink-0"
                            >
                              <WebIcon name="minimize" className="w-3.5 h-3.5" />
                              <span>Đóng chi tiết</span>
                            </button>
                          </div>

                        {/* Thân Thẻ Mở Rộng: Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-[15px] py-[15px] flex-1 min-h-0 text-left items-stretch">
                          {/* Cột 1 (4/12): Media & Status */}
                          <div
                            id={`system-detail-media-${item.id}`}
                            data-element-type="card"
                            className="bento-card glass-card md:col-span-5 lg:col-span-4 flex flex-col justify-between rounded-[14px] overflow-hidden border border-slate-300/70 dark:border-white/20 p-[15px] shadow-sm bg-white/50 dark:bg-slate-900/50"
                            style={{ borderRadius: '14px' }}
                          >
                            <div>
                              <h4 className="text-[16px] font-bold mb-[15px]" style={{ color: isDark ? config.darkAccent : config.lightAccent }}>
                                Mô tả hệ thống
                              </h4>
                              {item.videoUrl && (
                                <div className="relative aspect-video w-full rounded-[14px] overflow-hidden bg-black shadow-md border border-white/10 shrink-0 mb-3">
                                  <video
                                    ref={expandedVideoRef}
                                    src={item.videoUrl}
                                    autoPlay
                                    loop
                                    muted={isExpandedVideoMuted}
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleExpandedVideoMute(e)}
                                    title={
                                      isExpandedVideoMuted
                                        ? 'Nhấp bật âm thanh thuyết minh'
                                        : 'Tắt âm thanh thuyết minh'
                                    }
                                    className="play-video-card-btn absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition cursor-pointer bg-black/60 text-white border-white/25"
                                  >
                                    {isExpandedVideoMuted ? (
                                      <WebIcon name="volume-x" className="w-4 h-4" />
                                    ) : (
                                      <WebIcon name="volume-2" className="w-4 h-4 sparkle" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="my-[15px] flex-1 flex flex-col items-center justify-center p-4 rounded-[14px] border border-slate-200/70 dark:border-white/15 bg-white/30 dark:bg-black/20" style={{ borderRadius: '14px' }}>
                                <WebIcon name={config.iconName} className="w-12 h-12 text-white" style={{ color: isDark ? config.darkAccent : config.lightAccent }} />
                              <span
                                className="text-[16px] font-bold font-play mt-1 text-center"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                              >
                                {item.abbr} — {item.nameVi}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-300 font-medium text-center mt-0.5">
                                {item.fullName}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-black/10 dark:border-white/15 flex items-center justify-between text-[15px] text-slate-700 dark:text-slate-200">
                              <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{systemStatusBadge[item.id]?.text || 'Trực tuyến'}</span>
                              </span>
                              <span className="font-bold text-sky-700 dark:text-cyan-300">
                                SLA: {tech.slaCommitment}
                              </span>
                            </div>
                          </div>

                          {/* Cột 2 (5/12): Overview & Features */}
                          <div className="md:col-span-7 lg:col-span-5 flex flex-col justify-between space-y-[15px]">
                            <div
                              id={`system-detail-overview-${item.id}`}
                              data-element-type="card"
                              className="bento-card glass-card p-[15px] rounded-[14px] border border-slate-300/80 dark:border-[#334155] backdrop-blur-md bg-white/70 dark:bg-[#111827]/85 shadow-2xs"
                              style={{ borderRadius: '14px' }}
                            >
                              <h4
                                className="text-[16px] font-bold mb-[10px]"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                              >
                                Mô tả kiến trúc
                              </h4>
                              <p className="text-[15px] text-slate-800 dark:text-[#E2E8F0] leading-relaxed font-medium">
                                {item.descVi}
                              </p>
                            </div>

                            {item.featuresVi && item.featuresVi.length > 0 && (
                              <div
                                id={`system-detail-features-${item.id}`}
                                data-element-type="card"
                                className="bento-card glass-card p-[15px] rounded-[14px] border border-slate-300/80 dark:border-[#334155] backdrop-blur-md flex-1 flex flex-col bg-white/70 dark:bg-[#111827]/85 shadow-2xs"
                                style={{ borderRadius: '14px' }}
                              >
                                <h4
                                  className="text-[16px] font-bold mb-[15px]"
                                  style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                                >
                                  Tính năng cốt lõi
                                </h4>
                                <ul className="grid grid-cols-1 gap-[15px] text-[15px]">
                                  {item.featuresVi.map((feat: string, fIdx: number) => (
                                    <li
                                      key={fIdx}
                                      className="flex items-start gap-2.5 p-[10px] rounded-[14px] border border-slate-200/90 dark:border-[#334155] text-slate-800 dark:text-[#E2E8F0] leading-snug bg-white/80 dark:bg-[#1F2937]/80 shadow-2xs"
                                    >
                                      <span
                                        className="w-6 h-6 rounded-full text-white font-mono text-[12px] font-black flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: config.lightAccent }}
                                      >
                                        {fIdx + 1}
                                      </span>
                                      <span className="font-semibold text-[15px] text-slate-800 dark:text-[#F8FAFC]">{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Cột 3 (3/12): Tech Specs */}
                          <div
                            id={`system-detail-specs-${item.id}`}
                            data-element-type="card"
                            className="bento-card glass-card md:col-span-12 lg:col-span-3 flex flex-col justify-between p-[15px] rounded-[14px] border border-slate-300/80 dark:border-[#334155] backdrop-blur-md bg-white/70 dark:bg-[#111827]/85 shadow-2xs"
                            style={{ borderRadius: '14px' }}
                          >
                            <div className="space-y-[15px]">
                              <h4
                                className="text-[16px] font-bold flex items-center gap-1.5"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                              >
                                <WebIcon name="database" className="w-4 h-4" />
                                <span>Hạ tầng kỹ thuật</span>
                              </h4>
                              <div className="space-y-[10px] text-[15px]">
                                <div className="bento-card p-[12px] rounded-[14px] border border-slate-200/90 dark:border-[#334155] bg-white/80 dark:bg-[#1F2937]/80 shadow-2xs">
                                  <span className="text-[12px] text-slate-600 dark:text-[#94A3B8] block font-mono font-medium">Dữ liệu (DB):</span>
                                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-0.5 block">{tech.database}</span>
                                </div>
                                <div className="bento-card p-[12px] rounded-[14px] border border-slate-200/90 dark:border-[#334155] bg-white/80 dark:bg-[#1F2937]/80 shadow-2xs">
                                  <span className="text-[12px] text-slate-600 dark:text-[#94A3B8] block font-mono font-medium">Giao thức:</span>
                                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-0.5 block">{tech.apiProtocol}</span>
                                </div>
                                <div className="bento-card p-[12px] rounded-[14px] border border-slate-200/90 dark:border-[#334155] bg-white/80 dark:bg-[#1F2937]/80 shadow-2xs">
                                  <span className="text-[12px] text-slate-600 dark:text-[#94A3B8] block font-mono font-medium">Bảo mật:</span>
                                  <span className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 block">{tech.isoSecurity}</span>
                                </div>
                                <div className="bento-card p-[12px] rounded-[14px] border border-slate-200/90 dark:border-[#334155] bg-white/80 dark:bg-[#1F2937]/80 shadow-2xs">
                                  <span className="text-[12px] text-slate-600 dark:text-[#94A3B8] block font-mono font-medium">Phân hệ:</span>
                                  <span className="font-bold text-amber-700 dark:text-amber-300 mt-0.5 block">{tech.ecosystemLabel}</span>
                                </div>
                              </div>
                            </div>


                          </div>
                        </div>

                        {/* Footer Thao Tác Thẻ Mở Rộng */}
                        <div className="flex items-center justify-between pt-[15px] border-t border-black/10 dark:border-white/20 shrink-0 text-[15px]">
                          <span className="text-slate-600 dark:text-slate-300 font-mono text-[12px]">
                            ✓ Đang hiển thị chi tiết {item.abbr}
                          </span>
                          <div className="flex items-center gap-2">
                            {item.url && item.url !== '#' && (
                              <button
                                type="button"
                                onClick={(e) => handleOpenUrl(e, item.url)}
                                className="bento-card px-4 py-1.5 rounded-[14px] text-xs font-bold text-slate-800 dark:text-white border border-slate-300/80 dark:border-white/25 shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95 bg-white/50 dark:bg-white/10"
                              >
                                <span>Truy cập Cổng Vận Hành</span>
                                <WebIcon name="external-link" className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleToggleExpandCard(item.id, e)}
                              className="px-4 py-1.5 rounded-[14px] text-xs font-bold border border-rose-400/50 bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
                            >
                              Đóng chi tiết
                            </button>
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
                          onClick={(e) => {
                            handleToggleExpandCard(item.id, e);
                          }}
                          onMouseEnter={() => setHoveredCardId(item.id)}
                          onMouseLeave={() => {
                            setHoveredCardId(null);
                            setHoveredImgId(null);
                          }}
                          title={`Nhấp để mở rộng chi tiết thẻ: ${item.nameVi} (${item.abbr})`}
                          className="system-flip-front system-item bento-card glass-card layered-card cursor-pointer relative overflow-hidden py-2.5 pr-2.5 pl-0 sm:py-3 sm:pr-3 sm:pl-0 flex flex-row items-center justify-between gap-2.5 select-none rounded-[14px] group transition-all duration-300 border min-h-[110px] h-full hover:-translate-y-0.5 hover:shadow-md"
                          style={{
                            ...cardSampleStyle,
                            background: 'var(--bg-card)',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '14px',
                            borderColor: 'var(--border-color)',
                            boxShadow: 'var(--shadow-card)',
                            backdropFilter: 'blur(var(--bg-blur))',
                            WebkitBackdropFilter: 'blur(var(--bg-blur))',
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

                          {/* KHU VỰC TRÁI (CHIỀU DÀI CHIẾM 10%): NHÓM NÚT MỞ TRANG VÀ NÚT SPEAK BÁM SÁT BÊN TRÁI */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`w-[10%] min-w-[36px] max-w-[44px] self-center h-fit shrink-0 z-30 flex flex-col items-center justify-center gap-1.5 py-1.5 px-1 rounded-l-none rounded-tr-[12px] rounded-br-[12px] border-l-0 border-t border-r border-b border-slate-300/80 dark:border-white/20 backdrop-blur-md transition-all duration-300 scale-[0.96] origin-left hover:scale-[0.94] ${
                              isImgHovered && item.videoUrl ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                            style={{
                              background: 'var(--bg-card)',
                              borderColor: 'var(--border-color)',
                              boxShadow: isDark
                                ? 'inset 3px 3px 8px rgba(0, 0, 0, 0.88), inset -1px -1px 2px rgba(255, 255, 255, 0.12), 0 1px 0 rgba(255, 255, 255, 0.1)'
                                : 'inset 3px 3px 7px rgba(15, 23, 42, 0.34), inset -1px -1px 3px rgba(255, 255, 255, 0.55), 0 1px 0 rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            {/* Nút Mở Trang */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                SoundEngine.playTap();
                                if (item.url && item.url !== '#') {
                                  window.open(item.url, '_blank', 'noopener,noreferrer');
                                } else {
                                  showToast(`Hệ thống ${item.abbr} (${item.nameVi}) đang được bảo mật API nội bộ!`);
                                }
                              }}
                              title={`Mở trang hệ thống ${item.abbr} (${item.nameVi})`}
                              className="w-6.5 h-6.5 rounded-[7px] flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-indigo-600 dark:hover:text-cyan-300 bg-white/60 dark:bg-white/15 hover:bg-white dark:hover:bg-white/30 active:scale-90 transition-all cursor-pointer border border-white/30 shadow-xs"
                            >
                              <WebIcon name="external-link" className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Speak — Mở Postcard giới thiệu hệ thống & đọc bằng giọng AI hỗ trợ */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenSystemPostcard(item, e)}
                              title={t(
                                `Mở Postcard giới thiệu ${item.abbr} với giọng đọc AI Trí Nhân`,
                                `Open ${item.abbr} Intro Postcard with AI Support Voice`
                              )}
                              aria-label={t(
                                `Mở Postcard giới thiệu ${item.abbr} với giọng đọc AI`,
                                `Open ${item.abbr} Intro Postcard with AI Voice`
                              )}
                              className="w-6.5 h-6.5 rounded-[7px] flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-indigo-600 dark:hover:text-cyan-300 bg-white/60 dark:bg-white/15 hover:bg-white dark:hover:bg-white/30 active:scale-90 transition-all cursor-pointer border border-white/30 shadow-xs"
                            >
                              <WebIcon name="volume-2" className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* KHU VỰC CENTER: HÀNG 1 ICON & TÊN VIẾT TẮT | HÀNG 2 SUB TIÊU ĐỀ TIẾNG ANH | HÀNG 3 TÊN TIẾNG VIỆT */}
                          <div
                            id="el-p8-div-100"
                            className={`flex-1 min-w-0 z-20 flex flex-col justify-center gap-0.5 px-1 text-left transition-opacity duration-200 ${
                              isImgHovered && item.videoUrl ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                          >
                            {/* Hàng 1 : Icon & Tên viết tắt */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              <WebIcon
                                name={config.iconName}
                                className="w-4 h-4 shrink-0 stroke-[2.4]"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent, width: '16px', height: '16px' }}
                              />
                              <h3
                                className="card-title text-[15px] sm:text-[16px] font-extrabold font-play leading-tight truncate m-0 p-0"
                                style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                                title={item.abbr}
                              >
                                {item.abbr}
                              </h3>
                            </div>

                            {/* Hàng 2 : Sub tiêu đề tên tiếng Anh đầy đủ */}
                            <div
                              className="text-[15px] sm:text-[16px] font-bold font-play text-slate-700 dark:text-slate-200 truncate leading-snug"
                              title={item.nameEn || item.name || ''}
                            >
                              {item.nameEn || item.name || ''}
                            </div>

                            {/* Hàng 3 : Tên tiếng Việt đầy đủ */}
                            <div
                              className="text-[15px] sm:text-[16px] font-bold font-play text-slate-900 dark:text-slate-100 truncate leading-snug"
                              title={item.nameVi || item.name || ''}
                            >
                              {item.nameVi || item.name || ''}
                            </div>
                          </div>

                          {/* KHU VỰC PHẢI (CHIỀU DÀI CHIẾM 30%): HÌNH HỆ THỐNG */}
                          <div
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setHoveredImgId(item.id);
                            }}
                            title={`Hình hệ thống ${item.abbr}`}
                            className={`w-[30%] min-w-[75px] max-w-[130px] h-[85px] shrink-0 z-20 rounded-[10px] overflow-hidden flex items-center justify-center bg-transparent group/img cursor-pointer transition-all duration-300 shadow-2xs border border-white/20 relative ${
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
                                alt={systemTitle6Words}
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
                          className="system-flip-back system-item bento-card glass-card layered-card cursor-pointer relative overflow-hidden p-2 pl-9 sm:pl-9 flex flex-col justify-between select-none border rounded-[14px] min-h-[90px] h-[90px]"
                          style={{
                            ...cardSampleStyle,
                            borderRadius: '14px',
                          }}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 rounded-r-[10px] border-r border-y border-slate-300/60 dark:border-white/25 bg-slate-900/10 dark:bg-black/35 backdrop-blur-sm transition-all shadow-xs"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                SoundEngine.playTap();
                                if (item.url && item.url !== '#') {
                                  window.open(item.url, '_blank', 'noopener,noreferrer');
                                } else {
                                  showToast(`Hệ thống ${item.abbr} (${config.displayTitle}) đang được bảo mật API nội bộ!`);
                                }
                              }}
                              title={`Nút 1: Mở hệ thống ${item.abbr} ở tab khác`}
                              className="w-4.5 h-4.5 rounded-[8px] flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-indigo-600 dark:hover:text-white bg-transparent hover:bg-black/10 dark:hover:bg-white/25 active:scale-90 transition-all cursor-pointer"
                            >
                              <WebIcon name="external-link" className="w-2.5 h-2.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleExpandCard(item.id, e);
                              }}
                              title={`Nút 2: Mở chi tiết thẻ (${item.abbr})`}
                              className="w-4.5 h-4.5 rounded-[8px] flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-indigo-600 dark:hover:text-white bg-transparent hover:bg-black/10 dark:hover:bg-white/25 active:scale-90 transition-all cursor-pointer"
                            >
                              <WebIcon name="maximize-2" className="w-2.5 h-2.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFlipToggle(item.id, e);
                              }}
                              title={`Nút 3: Quay về mặt trước (${item.abbr})`}
                              className="w-4.5 h-4.5 rounded-[8px] flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-indigo-600 dark:hover:text-white bg-transparent hover:bg-black/10 dark:hover:bg-white/25 active:scale-90 transition-all cursor-pointer"
                            >
                              <WebIcon name="rotate-cw" className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1 pb-1 border-b border-black/10 dark:border-white/15">
                            <span
                              className="text-[12px] font-bold font-mono tracking-tight"
                              style={{ color: isDark ? config.darkAccent : config.lightAccent }}
                            >
                              {item.abbr} — Hiệu Quả ROI
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleFlipToggle(item.id, e)}
                              className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 transition border cursor-pointer bg-white/90 dark:bg-[#111827]/90 hover:bg-slate-100 dark:hover:bg-[#1F2937] text-slate-700 dark:text-[#E2E8F0] border-slate-200/90 dark:border-[#334155] shadow-2xs"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Quay lại</span>
                            </button>
                          </div>

                          <p className="text-[10.5px] leading-tight line-clamp-1 font-medium text-slate-700 dark:text-slate-200">
                            {item.descVi}
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 pt-0.5 border-t border-slate-200/60 dark:border-white/10">
                            <span>SLA: {tech.slaCommitment}</span>
                            <span>{tech.isoSecurity}</span>
                          </div>
                        </article>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}


      {/* VIDEO PLAYER LIGHTBOX MODAL (PHÁT LINK MP4 - ĐỒNG BỘ SÁNG & TỐI) */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 bg-[#0B1220]/75 dark:bg-[#0B1220]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-[#111827]/95 border border-[#CBD5E1] dark:border-[#334155] rounded-[14px] max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-left backdrop-blur-xl"
          >
            {/* Video Header */}
            <div className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-400/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-wide font-play">
                    Video Giới Thiệu Hệ Thống Vận Hành
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">PowerService Enterprise Digital Architecture</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-sm transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* HTML5 MP4 Video Player Frame */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <video
                key={activeBannerVideo}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              >
                <source src={activeBannerVideo} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ phát video HTML5.
              </video>
            </div>

            {/* Video Footer */}
            <div className="p-3 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBannerVideo(VIDEO_1_URL)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeBannerVideo === VIDEO_1_URL
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Video 1 (Hệ thống)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBannerVideo(VIDEO_2_URL)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeBannerVideo === VIDEO_2_URL
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Video 2 (Giới thiệu bản thân)
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition cursor-pointer"
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
          className="fixed inset-0 bg-[#0B1220]/75 dark:bg-[#0B1220]/80 backdrop-blur-md z-50 flex items-center justify-center p-[15px] overflow-y-auto"
        >
          <div
            id={`system-detail-modal-${selectedSystem.id}`}
            data-element-type="card"
            data-section-card="true"
            onClick={(e) => e.stopPropagation()}
            className="bento-card glass-card border border-slate-200/90 dark:border-white/15 rounded-[14px] overflow-hidden shadow-2xl flex flex-col relative z-50 text-left backdrop-blur-xl bg-transparent"
            style={{ width: '100%', height: '100%', padding: '15px', background: 'transparent' }}
          >
            {/* Modal Body with 3 Distinct Cards */}
            <div className="p-3 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto glass-scrollbar font-play bg-white/95 dark:bg-[#0B1220]/95">
              {(() => {
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

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-start">
                    {/* 1. THẺ THÔNG TIN HỆ THỐNG */}
                    <div id="systems-admin-card" className="lg:col-span-12 p-4 rounded-[14px] bg-white/95 dark:bg-[#111827]/95 text-slate-900 dark:text-[#F8FAFC] border border-sky-200 dark:border-sky-500/40 shadow-md space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                          <WebIcon name="info" className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <h4 className="text-base font-bold font-play text-sky-700 dark:text-sky-300">
                            Thẻ Thông Tin Hệ Thống
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[11px] font-mono font-bold border border-sky-300 dark:border-sky-400/30">
                          {specInfo.ecosystemLabel}
                        </span>
                      </div>

                      {/* Video Mô Tả Hệ Thống */}
                      {selectedSystem.videoUrl && (
                        <div className="rounded-[12px] overflow-hidden border border-slate-200 dark:border-[#334155] bg-[#0B1220] shadow-lg my-2">
                          <div className="px-3 py-1.5 bg-slate-900 dark:bg-[#111827] border-b border-white/10 flex items-center justify-between text-white text-[11px] font-bold">
                            <span className="flex items-center gap-2 text-cyan-300">
                              <WebIcon name="play" className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Video Thuyết Minh Mô Tả Hệ Thống {selectedSystem.abbr}</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Cloudinary MP4 HD
                            </span>
                          </div>
                          <div className="relative w-full aspect-video bg-[#0B1220] flex items-center justify-center max-h-[280px]">
                            <video
                              key={selectedSystem.videoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-contain max-h-[280px]"
                            >
                              <source src={selectedSystem.videoUrl} type="video/mp4" />
                              Trình duyệt của bạn không hỗ trợ video HTML5.
                            </video>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[15px] text-xs">
                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/85 border border-slate-200 dark:border-[#334155]">
                          <span className="text-[10.5px] font-bold text-slate-500 dark:text-[#94A3B8] block">Tên hệ thống:</span>
                          <span className="font-bold text-slate-900 dark:text-[#F8FAFC] text-[13.5px]">{selectedSystem.nameVi || selectedSystem.name}</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/85 border border-slate-200 dark:border-[#334155]">
                          <span className="text-[10.5px] font-bold text-slate-500 dark:text-[#94A3B8] block">Tên viết tắt &amp; Đầy đủ:</span>
                          <span className="font-bold text-sky-700 dark:text-[#67E8F9] text-[13px] font-mono">{selectedSystem.abbr} — {selectedSystem.fullName}</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/85 border border-slate-200 dark:border-[#334155]">
                          <span className="text-[10.5px] font-bold text-slate-500 dark:text-[#94A3B8] block">Tiêu chuẩn Bảo mật:</span>
                          <span className="font-bold text-emerald-700 dark:text-[#6EE7B7] text-[12.5px] flex items-center gap-1 mt-0.5">
                            <WebIcon name="shield" className="w-3.5 h-3.5 text-emerald-600 dark:text-[#6EE7B7] shrink-0" />
                            <span>{specInfo.isoSecurity}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/75 border border-slate-200 dark:border-[#334155]">
                        <span className="text-[11px] font-bold text-sky-700 dark:text-[#7DD3FC] block mb-1">Mô tả hệ thống chi tiết:</span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-[#E2E8F0] leading-relaxed font-medium">
                          {selectedSystem.descVi}
                        </p>
                      </div>

                      {selectedSystem.url && selectedSystem.url !== '#' && (
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-[12px] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30">
                          <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200 truncate min-w-0">
                            <WebIcon name="external-link" className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                            <span className="truncate">Cổng truy cập: <strong>{selectedSystem.url}</strong></span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleOpenUrl(e, selectedSystem.url)}
                            className="px-3 py-1 rounded-[12px] text-xs font-bold bg-sky-600 hover:bg-sky-700 dark:bg-[#67E8F9] dark:hover:bg-cyan-300 text-white dark:text-[#0B1220] transition cursor-pointer shrink-0 active:scale-95"
                          >
                            Truy cập ngay
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. THẺ TÍNH NĂNG CỐT LÕI */}
                    <div id="systems-workflow-card" className="lg:col-span-6 p-4 rounded-[14px] bg-white/95 dark:bg-[#111827]/95 text-slate-900 dark:text-[#F8FAFC] border border-emerald-200 dark:border-emerald-500/40 shadow-md space-y-3 h-full">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <WebIcon name="sparkles" className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <h4 className="text-base font-bold font-play text-emerald-700 dark:text-emerald-300">
                            Thẻ Tính Năng Cốt Lõi
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold border border-emerald-300 dark:border-emerald-400/30">
                          Ưu điểm nghiệp vụ
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {(selectedSystem.featuresVi || selectedSystem.features || []).map((feat: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-[#E2E8F0] p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155]"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                              <WebIcon name="check" className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="font-medium leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. THẺ HẠ TẦNG KỸ THUẬT */}
                    <div id="systems-tech-card" className="lg:col-span-6 p-4 rounded-[14px] bg-white/95 dark:bg-[#111827]/95 text-slate-900 dark:text-[#F8FAFC] border border-purple-200 dark:border-purple-500/40 shadow-md space-y-3 h-full">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          <WebIcon name="cpu" className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <h4 className="text-base font-bold font-play text-purple-700 dark:text-purple-300">
                            Thẻ Hạ Tầng Kỹ Thuật
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-bold border border-purple-300 dark:border-purple-400/30">
                          Architecture &amp; DB
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
                          <span className="text-slate-600 dark:text-[#94A3B8] font-medium">Cơ sở dữ liệu (Database):</span>
                          <span className="font-bold text-sky-700 dark:text-[#67E8F9] font-mono text-right">{specInfo.database}</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
                          <span className="text-slate-600 dark:text-[#94A3B8] font-medium">Giao thức kết nối API:</span>
                          <span className="font-bold text-purple-700 dark:text-purple-300 font-mono text-right">{specInfo.apiProtocol}</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
                          <span className="text-slate-600 dark:text-[#94A3B8] font-medium">Cam kết SLA &amp; Độ trễ:</span>
                          <span className="font-bold text-emerald-700 dark:text-[#6EE7B7] font-mono text-right">{specInfo.slaCommitment}</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
                          <span className="text-slate-600 dark:text-[#94A3B8] font-medium">Tỷ lệ Uptime hoạt động:</span>
                          <span className="font-bold text-amber-700 dark:text-[#FCD34D] font-mono text-right">{specInfo.uptimePct} Continuous</span>
                        </div>

                        <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937]/80 border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
                          <span className="text-slate-600 dark:text-[#94A3B8] font-medium">Tải kết nối trực tuyến ({specInfo.onlineRoleLabel}):</span>
                          <span className="font-bold text-emerald-700 dark:text-[#6EE7B7] font-mono text-right">~{specInfo.baseOnlineUsers} Concurrent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium text-slate-600 dark:text-[#94A3B8] flex items-center gap-1.5">
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
                  className="px-4 py-2 rounded-[14px] text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] bg-slate-200 hover:bg-slate-300 dark:bg-[#1F2937] dark:hover:bg-[#334155] transition cursor-pointer"
                >
                  Đóng
                </button>

                {selectedSystem.url && selectedSystem.url !== '#' && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenUrl(e, selectedSystem.url)}
                    className="px-4 py-2 rounded-[14px] text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition cursor-pointer hover:brightness-110 active:scale-95"
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
          className="fixed inset-0 bg-[#0B1220]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#334155] rounded-[14px] max-w-md w-full p-6 text-center shadow-2xl relative"
          >
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-indigo-500/30 mb-3 shadow-md">
              <img
                src="https://i.ibb.co/RT3jX4Mv/H-ng-Th-i-Avata-Gif.gif"
                alt="Kiến Trúc Sư"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-[#F8FAFC] font-play">
              Kiến Trúc Sư Hệ Thống CX/CSKH
            </h3>
            <p className="text-xs text-[#4338CA] dark:text-[#A5B4FC] font-semibold mb-3">
              PowerService Enterprise Suite
            </p>
            <p className="text-xs text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-4">
              Hệ sinh thái gồm 12 phân hệ tích hợp toàn diện, chuẩn hóa dữ liệu tập trung theo mô hình Omnichannel, tự động hóa quy trình nghiệp vụ và tích hợp Trợ lý Trí tuệ Nhân tạo 24/7.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthorModalOpen(false)}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#1E1B4B] dark:bg-indigo-600 hover:opacity-90 transition cursor-pointer"
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
          className="fixed bottom-5 right-5 z-50 w-72 sm:w-80 rounded-[14px] overflow-hidden shadow-2xl border border-indigo-400/40 bg-[#111827]/95 backdrop-blur-xl text-[#F8FAFC] transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header thanh PiP */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-[#1E1B4B]/95 via-[#111827]/95 to-[#0B1220]/95 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.5s_infinite]" />
                <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-[pulse_0.35s_infinite]" />
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.6s_infinite]" />
              </span>
              <span className="text-[11.5px] font-bold font-play text-indigo-200 truncate">
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
                className="p-1 rounded-[14px] text-[#94A3B8] hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Cuộn về video chính"
              >
                <WebIcon name="maximize" className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsPipDismissed(true)}
                className="p-1 rounded-[14px] text-[#94A3B8] hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Tạm ẩn cửa sổ mini"
              >
                <WebIcon name="cancel" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video preview nhỏ */}
          <div className="relative aspect-video bg-black overflow-hidden group">
            <video
              ref={pipVideoRef}
              src={VIDEO_2_URL}
              autoPlay
              playsInline
              loop
              muted={isBannerMuted}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay badge thời gian */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-mono font-bold text-rose-300 border border-white/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{formatCountdown(videoTimeLeft)}</span>
            </div>
          </div>

          {/* Footer nút điều khiển PiP */}
          <div className="p-2.5 flex items-center justify-between gap-2 bg-slate-900/90 border-t border-white/10">
            {/* Nút Loa */}
            <button
              type="button"
              onClick={(e) => toggleBannerMute(e)}
              className="p-2 rounded-[14px] bg-white/10 hover:bg-white/20 text-white transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
              title={isBannerMuted ? 'Mở âm thanh' : 'Tắt âm thanh'}
            >
              {isBannerMuted ? (
                <WebIcon name="volume-x" className="w-4 h-4 text-slate-300" />
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
              className="flex-1 px-3 py-1.5 rounded-[14px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold font-play flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
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

      {/* POSTCARD GIỚI THIỆU HỆ THỐNG & GIỌNG ĐỌC AI HỖ TRỢ TRÍ NHÂN */}
      <AnimatePresence>
        {postcardSystem && (() => {
          const pcConfig = SYSTEM_DESIGN_MAP[postcardSystem.id] || {
            displayTitle: formatCardTitle(postcardSystem.nameVi || postcardSystem.name || ''),
            subtitle: postcardSystem.nameEn || postcardSystem.descVi || '',
            gradient: postcardSystem.gradient,
            lightBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.88) 100%)',
            lightBorder: 'rgba(96, 165, 250, 0.55)',
            lightAccent: '#1d4ed8',
            darkAccent: '#60a5fa',
            iconName: systemIconMap[postcardSystem.id] || 'cog',
            illustrationSrc: postcardSystem.imageUrl || '',
            cardTheme: postcardSystem.themeColor || '#3B72E2',
          };
          const pcSpec = SYSTEM_TECH_SPECS_MAP[postcardSystem.id] || SYSTEM_TECH_SPECS_MAP.sdp;
          const pcTitle =
            language === 'en'
              ? postcardSystem.nameEn || postcardSystem.name || postcardSystem.abbr
              : postcardSystem.nameVi || postcardSystem.name || postcardSystem.abbr;
          const pcSub =
            language === 'en'
              ? `${postcardSystem.abbr} · ${postcardSystem.nameVi || ''}`
              : `${postcardSystem.abbr} · ${postcardSystem.nameEn || pcConfig.subtitle}`;
          const pcDesc =
            language === 'en'
              ? postcardSystem.descEn || translateText(postcardSystem.descVi || postcardSystem.description || '')
              : postcardSystem.descVi || postcardSystem.description || '';
          const pcFeatures =
            language === 'en'
              ? postcardSystem.featuresEn && postcardSystem.featuresEn.length > 0
                ? postcardSystem.featuresEn
                : (postcardSystem.featuresVi || postcardSystem.features || []).map((f) => translateText(f))
              : postcardSystem.featuresVi || postcardSystem.features || [];
          const pcNarration = buildSystemPostcardNarration(postcardSystem);
          const pcAccent = isDark ? pcConfig.darkAccent : pcConfig.lightAccent;

          return (
            <motion.div
              key={`system-postcard-${postcardSystem.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseSystemPostcard}
              role="dialog"
              aria-modal="true"
              aria-labelledby="system-postcard-title"
              className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            >
              <motion.article
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bento-card glass-card w-full max-w-2xl rounded-[14px] overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-[#0F172A]/95 text-slate-900 dark:text-slate-100 shadow-2xl font-play flex flex-col max-h-[90vh]"
                style={{ borderRadius: '14px' }}
              >
                {/* Postcard Top Editorial Accent Strip */}
                <div className="h-1.5 w-full shrink-0" style={{ background: pcConfig.gradient }} />

                {/* Postcard Header */}
                <div className="p-[15px] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
                      style={{ color: pcAccent }}
                    >
                      <WebIcon name={pcConfig.iconName} className="w-5 h-5" style={{ color: pcAccent }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono font-bold tracking-wider uppercase block text-slate-500 dark:text-slate-400">
                        {t('Postcard Giới Thiệu Hệ Thống', 'System Introduction Postcard')}
                      </span>
                      <h3
                        id="system-postcard-title"
                        className="text-base sm:text-lg font-bold truncate leading-tight"
                        style={{ color: pcAccent }}
                      >
                        {pcTitle}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {pcSub}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseSystemPostcard}
                    aria-label={t('Đóng postcard', 'Close postcard')}
                    className="w-8 h-8 rounded-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0"
                  >
                    <WebIcon name="cancel" className="w-4 h-4" />
                  </button>
                </div>

                {/* Postcard Body */}
                <div className="p-[15px] overflow-y-auto glass-scrollbar space-y-[15px]">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-[15px] items-stretch">
                    {/* Left Visual Stamp Panel */}
                    <div className="md:col-span-5 rounded-[14px] p-[15px] border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-900/80 flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="font-bold" style={{ color: pcAccent }}>
                          {postcardSystem.abbr}
                        </span>
                        <span>{pcSpec.uptimePct} SLA</span>
                      </div>

                      <div className="w-full h-36 sm:h-40 flex items-center justify-center overflow-hidden bg-transparent">
                        {(pcConfig.illustrationSrc || postcardSystem.imageUrl) ? (
                          <img
                            src={pcConfig.illustrationSrc || postcardSystem.imageUrl}
                            alt={pcTitle}
                            className="max-w-full max-h-full w-auto h-full object-contain bg-transparent select-none"
                          />
                        ) : (
                          <WebIcon name={pcConfig.iconName} className="w-14 h-14" style={{ color: pcAccent }} />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">
                            {t('Bảo mật', 'Security')}
                          </span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate block">
                            ISO 27001
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">
                            {t('Cam kết', 'Latency')}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {pcSpec.slaCommitment.split('(')[0].trim()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Postcard Editorial Content */}
                    <div className="md:col-span-7 flex flex-col justify-between gap-3">
                      <div className="rounded-[14px] p-[15px] border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/60 space-y-2.5 flex-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {t('Tổng quan hệ thống', 'System Overview')}
                        </div>
                        <p className="text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-200 font-medium break-words">
                          {pcDesc}
                        </p>

                        {pcFeatures.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {t('Tính năng trọng tâm', 'Core Capabilities')}
                            </div>
                            <ul className="space-y-1.5 list-none p-0 m-0">
                              {pcFeatures.slice(0, 3).map((feat: string, fIdx: number) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-snug"
                                >
                                  <WebIcon
                                    name="check"
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
                                  />
                                  <span className="break-words">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Support Voice Script & Player Panel */}
                  <div className="rounded-[14px] p-[15px] border border-indigo-200/90 dark:border-indigo-500/35 bg-indigo-50/75 dark:bg-indigo-950/35 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-[9px] bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <WebIcon name="bot" className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block truncate">
                            {t('Giọng đọc AI Hỗ trợ Trí Nhân', 'Tri Nhan AI Support Voice')}
                          </span>
                          <span className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 block">
                            {isPostcardVoiceLoading
                              ? t('Đang tổng hợp giọng nói AI...', 'Synthesizing AI voice...')
                              : isPostcardSpeaking
                              ? t('Đang phát thuyết minh giới thiệu', 'Playing system introduction')
                              : t('Sẵn sàng phát lại thuyết minh', 'Ready to replay narration')}
                          </span>
                        </div>
                      </div>

                      {isPostcardSpeaking && (
                        <div className="flex items-end gap-0.5 h-4 px-2" aria-hidden="true">
                          <span className="w-1 h-2.5 bg-indigo-600 dark:bg-cyan-400 rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-indigo-500 dark:bg-cyan-300 rounded-full animate-pulse" />
                          <span className="w-1 h-3 bg-indigo-600 dark:bg-cyan-400 rounded-full animate-pulse" />
                          <span className="w-1 h-2 bg-indigo-500 dark:bg-cyan-300 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-[10px] border border-indigo-100 dark:border-indigo-500/20 break-words">
                      &ldquo;{pcNarration}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Postcard Footer Controls */}
                <div className="p-[15px] border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakSystemPostcard(postcardSystem)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-xs font-bold text-white shadow-sm transition cursor-pointer hover:brightness-110 active:scale-95"
                      style={{ background: pcConfig.gradient }}
                    >
                      <WebIcon name="volume-2" className="w-3.5 h-3.5" />
                      <span>
                        {isPostcardSpeaking
                          ? t('Đọc lại từ đầu', 'Replay AI Voice')
                          : t('Nghe AI giới thiệu', 'Play AI Voice')}
                      </span>
                    </button>

                    {(isPostcardSpeaking || isPostcardVoiceLoading) && (
                      <button
                        type="button"
                        onClick={handleStopPostcardVoice}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer active:scale-95"
                      >
                        <WebIcon name="volume-x" className="w-3.5 h-3.5" />
                        <span>{t('Dừng đọc', 'Stop Voice')}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const targetId = postcardSystem.id;
                        handleCloseSystemPostcard();
                        setExpandedSystemId(targetId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300/80 dark:border-slate-600 transition cursor-pointer"
                    >
                      <WebIcon name="maximize-2" className="w-3.5 h-3.5" />
                      <span>{t('Chi tiết kỹ thuật', 'Full Specs')}</span>
                    </button>

                    {postcardSystem.url && postcardSystem.url !== '#' && (
                      <button
                        type="button"
                        onClick={(e) => handleOpenUrl(e, postcardSystem.url)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-xs font-bold bg-slate-900 dark:bg-cyan-400 text-white dark:text-slate-950 hover:opacity-90 transition cursor-pointer"
                      >
                        <span>{t('Mở hệ thống', 'Open Portal')}</span>
                        <WebIcon name="external-link" className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* VÒNG TRÒN NỔI AVATAR VIDEO VÀ BONG BÓNG LỜI NHẮC Ở GÓC TRÊN BÊN PHẢI      */}
      {/* ========================================================================= */}
      {isClientMounted && (
        <div
          className="fixed top-[78px] sm:top-[88px] right-3 sm:right-6 md:right-8 z-50 flex items-center gap-2 sm:gap-3 select-none pointer-events-auto max-w-[calc(100vw-24px)]"
          role="region"
          aria-label="Video Giới Thiệu Hệ Thống Nổi"
        >
          {/* Bong bóng tin nhắn xanh dương bên trái với đuôi nhọn hướng sang vòng tròn avatar */}
          <div
            onClick={handleToggleCircleVideo}
            className="hidden sm:flex cursor-pointer group/bubble relative items-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 sm:px-5 py-2 sm:py-3 rounded-[14px] shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-blue-300/40"
            title={
              isCircleVideoPlaying
                ? 'Bấm để đóng video và hiện lại các thẻ hệ thống'
                : 'Bấm vào để xem video giới thiệu hệ thống!'
            }
          >
            <p className="text-[12.5px] sm:text-[14px] font-bold font-play leading-snug tracking-tight text-white m-0 text-left">
              {isCircleVideoPlaying ? (
                <>
                  Đang phát giới thiệu<br />Bấm để quay lại thẻ!
                </>
              ) : (
                <>
                  Bấm vào để xem video<br />giới thiệu hệ thống!
                </>
              )}
            </p>

            {/* Đuôi nhọn của bubble hướng về avatar (bên phải) */}
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[7px] sm:border-y-[8px] border-y-transparent border-l-[9px] sm:border-l-[10px] border-l-[#2563eb] pointer-events-none drop-shadow-xs"
            />
          </div>

          {/* Vòng tròn Avatar video chờ (Video 1) phát sáng rực rỡ & nút Play/Close đè ở chính giữa cạnh dưới */}
          <div className="relative group/circle cursor-pointer" onClick={handleToggleCircleVideo}>
            {/* Vòng sáng Laser Glow Aura bao quanh phát sáng & chuyển động */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-80 blur-md animate-pulse pointer-events-none" />

            {/* Vòng tròn avatar video chờ (Video 1) lấp đầy 100% */}
            <div
              className={cn(
                "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 group-hover/circle:scale-110 border-[3px] shadow-[0_0_25px_rgba(6,182,212,0.8),0_0_45px_rgba(37,99,235,0.6)]",
                isCircleVideoPlaying
                  ? "border-cyan-300 ring-4 ring-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.95),0_0_60px_rgba(37,99,235,0.8)]"
                  : "border-blue-400 dark:border-cyan-400 hover:border-cyan-300"
              )}
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {/* Video 1: Màn hình chờ hệ thống giới thiệu */}
              <video
                ref={circleVideoRef}
                src={SYSTEM_FLOATING_IDLE_VIDEO_URL}
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none scale-[1.08] rounded-full"
              />

              {/* Tag trạng thái nhỏ khi Video 2 đang phát */}
              {isCircleVideoPlaying && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-xs text-[8px] sm:text-[9px] font-mono text-cyan-300 font-bold border border-cyan-400/50 pointer-events-none shadow-xs whitespace-nowrap z-10">
                  Đang phát 🔊
                </div>
              )}
            </div>

            {/* Nút Play / Đóng hình tròn màu đỏ NẰM CHÍNH GIỮA CẠNH DƯỚI HÌNH TRÒN */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCircleVideo();
              }}
              className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(239,68,68,0.7),0_0_14px_rgba(239,68,68,0.9)] border-2 border-white dark:border-slate-900 transition-all duration-300 z-20 cursor-pointer group-hover/circle:scale-110"
              title={isCircleVideoPlaying ? "Đóng video & hiện lại thẻ hệ thống" : "Xem video giới thiệu hệ thống"}
            >
              {isCircleVideoPlaying ? (
                <WebIcon name="cancel" className="w-4 h-4 text-white" />
              ) : (
                <WebIcon name="play" className="w-4 h-4 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SystemsView;
