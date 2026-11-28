'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Maximize2 = createAnimatedIcon('maximize-2');
const Minimize2 = createAnimatedIcon('minimize-2');
const Play = createAnimatedIcon('play');
const Square = createAnimatedIcon('square');
const QrCode = createAnimatedIcon('qr-code');
const ArrowLeftRight = createAnimatedIcon('arrow-left-right');
const ExternalLink = createAnimatedIcon('external-link');
const Copy = createAnimatedIcon('copy');
const Check = createAnimatedIcon('check');
const Cpu = createAnimatedIcon('cpu');
const ShieldCheck = createAnimatedIcon('shield-check');
const Activity = createAnimatedIcon('activity');
const Users = createAnimatedIcon('users');
const Database = createAnimatedIcon('database');
const Network = createAnimatedIcon('network');
const Volume2 = createAnimatedIcon('volume-2');
const VolumeX = createAnimatedIcon('volume-x');
const Table = createAnimatedIcon('table');
const LayoutGrid = createAnimatedIcon('grid');
const ArrowRight = createAnimatedIcon('arrow-right');
const Server = createAnimatedIcon('server');
import { SYSTEMS_DATA } from '@/data/systems';
import { SystemData, SiteTheme } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn } from '@/lib/utils';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';
import { EcosystemDiagramModal } from '@/components/common/EcosystemDiagramModal';
import { useTheme } from '@/hooks/useTheme';
import { stopActiveSpeech } from '@/utils/speechVoice';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { SystemBentoCard } from './systems/SystemBentoCard';

export interface SystemsViewProps {
  currentTheme?: SiteTheme;
  onShowNotification?: (msg: string) => void;
}

const SYSTEM_FLOATING_IDLE_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/581097478f9de72616d982e302e1c8d0aab6d66cbee040430c610424c0c72a44.mp4';
const SYSTEM_FLOATING_INTRO_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/ac120a105730c378447fd67f5e8b6aeb9557b5e4e8854ac2e21148d5316f780b.mp4';

interface SystemTechSpecItem {
  database: string;
  apiProtocol: string;
  slaCommitment: string;
  isoSecurity: string;
  uptimePct: string;
  baseOnlineUsers: number;
  onlineRoleLabel: string;
  onlineRoleLabelEn: string;
  ecosystemGroup: 'cskh' | 'enterprise' | 'ai_analytics';
  ecosystemLabel: string;
  ecosystemLabelEn: string;
}

const SYSTEM_TECH_SPECS_MAP: Record<string, SystemTechSpecItem> = {
  sdp: {
    database: 'PostgreSQL 16 + Redis Cluster',
    apiProtocol: 'RESTful / GraphQL / SSO OAuth2',
    slaCommitment: '99.98% (< 12ms Latency)',
    isoSecurity: 'ISO/IEC 27001:2022 • Zero-Trust SSO',
    uptimePct: '99.98%',
    baseOnlineUsers: 340,
    onlineRoleLabel: 'Agents trực tuyến',
    onlineRoleLabelEn: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
    ecosystemLabelEn: 'Customer Operations',
  },
  csc: {
    database: 'PostgreSQL + Elasticsearch 8',
    apiProtocol: 'WebRTC / SIP Trunk / Webhook',
    slaCommitment: '99.98% (Real-time Queue)',
    isoSecurity: 'ISO/IEC 27001:2022 • TLS 1.3 / SRTP',
    uptimePct: '99.98%',
    baseOnlineUsers: 295,
    onlineRoleLabel: 'Agents trực tuyến',
    onlineRoleLabelEn: 'Agents Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
    ecosystemLabelEn: 'Customer Operations',
  },
  crm: {
    database: 'PostgreSQL + MongoDB Atlas',
    apiProtocol: 'RESTful API / Event Webhook',
    slaCommitment: '99.98% (Đồng bộ 360° < 15ms)',
    isoSecurity: 'ISO/IEC 27001:2022 • AES-256 PII Masking',
    uptimePct: '99.98%',
    baseOnlineUsers: 210,
    onlineRoleLabel: 'Nhân sự khai thác',
    onlineRoleLabelEn: 'Active Operators',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
    ecosystemLabelEn: 'Customer Operations',
  },
  clp: {
    database: 'PostgreSQL + Redis Pub/Sub',
    apiProtocol: 'RESTful / Kafka Event Stream',
    slaCommitment: '99.97% (Tích điểm tức thì)',
    isoSecurity: 'ISO/IEC 27001:2022 • Tokenization',
    uptimePct: '99.98%',
    baseOnlineUsers: 65,
    onlineRoleLabel: 'Chuyên viên VIP',
    onlineRoleLabelEn: 'Loyalty Specialists',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
    ecosystemLabelEn: 'Customer Operations',
  },
  pos: {
    database: 'PostgreSQL + SQLite Offline Sync',
    apiProtocol: 'gRPC / REST API / Payment Gateway',
    slaCommitment: '99.99% (Offline-First Sync)',
    isoSecurity: 'ISO/IEC 27001:2022 & PCI-DSS Level 1',
    uptimePct: '99.99%',
    baseOnlineUsers: 85,
    onlineRoleLabel: 'Điểm thu ngân',
    onlineRoleLabelEn: 'Cashiers Online',
    ecosystemGroup: 'cskh',
    ecosystemLabel: 'Vận hành CSKH',
    ecosystemLabelEn: 'Customer Operations',
  },
  erp: {
    database: 'Oracle DB / PostgreSQL HA',
    apiProtocol: 'REST / SOAP / EDI / Banking API',
    slaCommitment: '99.99% (ACID Financial Ledger)',
    isoSecurity: 'ISO/IEC 27001:2022 • SOC2 Type II',
    uptimePct: '99.99%',
    baseOnlineUsers: 55,
    onlineRoleLabel: 'Kế toán & Vận hành',
    onlineRoleLabelEn: 'Finance Users',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
    ecosystemLabelEn: 'Enterprise Governance',
  },
  hrm: {
    database: 'PostgreSQL + TimescaleDB',
    apiProtocol: 'RESTful API / Biometric IoT Sync',
    slaCommitment: '99.95% (Auto Payroll Engine)',
    isoSecurity: 'ISO/IEC 27001:2022 • E2E Payroll Encrypt',
    uptimePct: '99.97%',
    baseOnlineUsers: 48,
    onlineRoleLabel: 'Quản lý & HRBP',
    onlineRoleLabelEn: 'HR & Managers',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
    ecosystemLabelEn: 'Enterprise Governance',
  },
  bpm: {
    database: 'PostgreSQL + Camunda Workflow DB',
    apiProtocol: 'BPMN 2.0 REST / Webhook / gRPC',
    slaCommitment: '99.98% (Zero Bottleneck)',
    isoSecurity: 'ISO/IEC 27001:2022 • Digital Signature',
    uptimePct: '99.98%',
    baseOnlineUsers: 42,
    onlineRoleLabel: 'Cấp phê duyệt',
    onlineRoleLabelEn: 'Approvers Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
    ecosystemLabelEn: 'Enterprise Governance',
  },
  okr: {
    database: 'PostgreSQL + Graph Analytics',
    apiProtocol: 'RESTful / GraphQL KPI Sync',
    slaCommitment: '99.96% (Real-time Alignment)',
    isoSecurity: 'ISO/IEC 27001:2022 • RBAC Hierarchy',
    uptimePct: '99.98%',
    baseOnlineUsers: 35,
    onlineRoleLabel: 'Trưởng nhóm & C-Level',
    onlineRoleLabelEn: 'Leaders Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
    ecosystemLabelEn: 'Enterprise Governance',
  },
  lms: {
    database: 'PostgreSQL + S3 Media CDN',
    apiProtocol: 'xAPI / SCORM / HLS Streaming',
    slaCommitment: '99.95% (Full HD Adaptive)',
    isoSecurity: 'ISO/IEC 27001:2022 • DRM Content Guard',
    uptimePct: '99.96%',
    baseOnlineUsers: 30,
    onlineRoleLabel: 'Học viên trực tuyến',
    onlineRoleLabelEn: 'Trainees Online',
    ecosystemGroup: 'enterprise',
    ecosystemLabel: 'Quản trị doanh nghiệp',
    ecosystemLabelEn: 'Enterprise Governance',
  },
  bi: {
    database: 'ClickHouse OLAP + BigQuery',
    apiProtocol: 'WebSocket Stream / GraphQL / SQL',
    slaCommitment: '99.98% (Sub-second Query)',
    isoSecurity: 'ISO/IEC 27001:2022 • Row-Level Security',
    uptimePct: '99.98%',
    baseOnlineUsers: 20,
    onlineRoleLabel: 'Chuyên viên phân tích',
    onlineRoleLabelEn: 'Analysts Online',
    ecosystemGroup: 'ai_analytics',
    ecosystemLabel: 'Phân tích & AI',
    ecosystemLabelEn: 'AI & Analytics',
  },
  ai: {
    database: 'Vector DB (Pinecone/PGVector) + Redis',
    apiProtocol: 'LLM Streaming API / RAG Webhook',
    slaCommitment: '99.98% (24/7 < 400ms First Token)',
    isoSecurity: 'ISO/IEC 27001:2022 • Guardrails & DLP',
    uptimePct: '99.98%',
    baseOnlineUsers: 25,
    onlineRoleLabel: 'AI Agents hoạt động',
    onlineRoleLabelEn: 'AI Bots Active',
    ecosystemGroup: 'ai_analytics',
    ecosystemLabel: 'Phân tích & AI',
    ecosystemLabelEn: 'AI & Analytics',
  },
};

const SYSTEM_CONNECTIONS_MAP: Record<string, string[]> = {
  sdp: ['csc', 'crm', 'ai', 'bi'],
  csc: ['sdp', 'crm', 'bpm', 'ai'],
  crm: ['sdp', 'csc', 'clp', 'bi'],
  clp: ['crm', 'pos', 'erp', 'bi'],
  pos: ['clp', 'erp', 'crm', 'bi'],
  erp: ['pos', 'hrm', 'bpm', 'bi'],
  hrm: ['okr', 'lms', 'erp', 'bpm'],
  bpm: ['sdp', 'csc', 'erp', 'hrm'],
  okr: ['hrm', 'bi', 'sdp', 'lms'],
  lms: ['hrm', 'ai', 'okr', 'sdp'],
  bi: ['sdp', 'crm', 'erp', 'ai'],
  ai: ['sdp', 'csc', 'lms', 'bi'],
};

interface SystemDesignMeta {
  displayTitle: string;
  subtitle: string;
  shortCodeLabel: string;
  gradient: string;
  cardBgLight: string;
  cardBgDark: string;
  tintBgLight: string;
  tintBgDark: string;
  borderLight: string;
  borderDark: string;
  lightAccent: string;
  darkAccent: string;
  iconName: string;
  illustrationSrc: string;
  cardTheme: string;
  vibrantBg: string;
  isLightCard: boolean;
  videoBg: string;
  videoIsLight: boolean;
}

const SYSTEM_DESIGN_MAP: Record<string, SystemDesignMeta> = {
  sdp: {
    displayTitle: 'Cổng Dịch Vụ Số & Bàn Làm Việc Hợp Nhất',
    subtitle: 'Service Delivery Platform',
    shortCodeLabel: 'SDP',
    gradient: 'linear-gradient(135deg, #d97706 0%, #ca8a04 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 249, 195, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(113, 63, 18, 0.48) 100%)',
    tintBgLight: 'rgba(254, 249, 195, 0.62)',
    tintBgDark: 'rgba(161, 98, 7, 0.24)',
    borderLight: 'rgba(234, 179, 8, 0.42)',
    borderDark: 'rgba(250, 204, 21, 0.42)',
    lightAccent: '#a16207',
    darkAccent: '#facc15',
    iconName: 'globe',
    illustrationSrc: 'https://i.postimg.cc/L5tSWxnm/SDP-Cong-lam-viec-CSKH.webp',
    cardTheme: '#EAB308',
    vibrantBg: 'linear-gradient(135deg, #fde047 0%, #facc15 52%, #f59e0b 100%)',
    isLightCard: true,
    videoBg: '#1c1917',
    videoIsLight: false,
  },
  csc: {
    displayTitle: 'Trung Tâm Chăm Sóc Khách Hàng Đa Kênh',
    subtitle: 'Customer Service Center',
    shortCodeLabel: 'CSC',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(224, 242, 254, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(12, 74, 110, 0.54) 100%)',
    tintBgLight: 'rgba(224, 242, 254, 0.62)',
    tintBgDark: 'rgba(2, 132, 199, 0.24)',
    borderLight: 'rgba(14, 165, 233, 0.36)',
    borderDark: 'rgba(56, 189, 248, 0.38)',
    lightAccent: '#0369a1',
    darkAccent: '#38bdf8',
    iconName: 'headphones',
    illustrationSrc: 'https://i.postimg.cc/sxdyKkDf/CSC-Trung-tam-Cham-soc-Khach-hang.webp',
    cardTheme: '#0EA5E9',
    vibrantBg: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 52%, #2563eb 100%)',
    isLightCard: false,
    videoBg: '#082f49',
    videoIsLight: false,
  },
  crm: {
    displayTitle: 'Hệ Thống Quản Trị Quan Hệ Khách Hàng 360°',
    subtitle: 'Customer Relationship Management',
    shortCodeLabel: 'CRM',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(209, 250, 229, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(6, 78, 59, 0.54) 100%)',
    tintBgLight: 'rgba(209, 250, 229, 0.62)',
    tintBgDark: 'rgba(5, 150, 105, 0.24)',
    borderLight: 'rgba(16, 185, 129, 0.36)',
    borderDark: 'rgba(52, 211, 153, 0.38)',
    lightAccent: '#047857',
    darkAccent: '#34d399',
    iconName: 'users',
    illustrationSrc: 'https://i.postimg.cc/SRFqVBNS/CRM-Quan-ly-Quan-he-Khach-hang.webp',
    cardTheme: '#10B981',
    vibrantBg: 'linear-gradient(135deg, #059669 0%, #10b981 52%, #047857 100%)',
    isLightCard: false,
    videoBg: '#064e3b',
    videoIsLight: false,
  },
  clp: {
    displayTitle: 'Hệ Thống Chăm Sóc Khách Hàng Thân Thiết',
    subtitle: 'Customer Loyalty Program',
    shortCodeLabel: 'CLP',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 228, 230, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(136, 19, 55, 0.54) 100%)',
    tintBgLight: 'rgba(255, 228, 230, 0.62)',
    tintBgDark: 'rgba(225, 29, 72, 0.24)',
    borderLight: 'rgba(244, 63, 94, 0.36)',
    borderDark: 'rgba(251, 113, 133, 0.38)',
    lightAccent: '#be123c',
    darkAccent: '#fb7185',
    iconName: 'gift',
    illustrationSrc: 'https://i.postimg.cc/0jRxZT21/CLP-Khach-hang-Than-thiet.webp',
    cardTheme: '#F43F5E',
    vibrantBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 52%, #be185d 100%)',
    isLightCard: false,
    videoBg: '#4c0519',
    videoIsLight: false,
  },
  pos: {
    displayTitle: 'Hệ Thống Quản Lý Bán Hàng & Thanh Toán Tại Quầy',
    subtitle: 'Point of Sale Management',
    shortCodeLabel: 'POS',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(207, 250, 254, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(22, 78, 99, 0.54) 100%)',
    tintBgLight: 'rgba(207, 250, 254, 0.62)',
    tintBgDark: 'rgba(8, 145, 178, 0.24)',
    borderLight: 'rgba(6, 182, 212, 0.36)',
    borderDark: 'rgba(34, 211, 238, 0.38)',
    lightAccent: '#0e7490',
    darkAccent: '#22d3ee',
    iconName: 'shopping-cart',
    illustrationSrc: 'https://i.postimg.cc/5yBJrs6M/POS-Quan-ly-Ban-hang-tai-Quay.webp',
    cardTheme: '#06B6D4',
    vibrantBg: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 52%, #0369a1 100%)',
    isLightCard: false,
    videoBg: '#083344',
    videoIsLight: false,
  },
  erp: {
    displayTitle: 'Hệ Thống Hoạch Định Nguồn Lực Doanh Nghiệp',
    subtitle: 'Enterprise Resource Planning',
    shortCodeLabel: 'ERP',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(204, 251, 241, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(19, 78, 74, 0.54) 100%)',
    tintBgLight: 'rgba(204, 251, 241, 0.62)',
    tintBgDark: 'rgba(13, 148, 136, 0.24)',
    borderLight: 'rgba(20, 184, 166, 0.36)',
    borderDark: 'rgba(45, 212, 191, 0.38)',
    lightAccent: '#0f766e',
    darkAccent: '#2dd4bf',
    iconName: 'chart',
    illustrationSrc: 'https://i.postimg.cc/Fz5mGMs9/ERP-Tai-chinh-ke-toan.webp',
    cardTheme: '#14B8A6',
    vibrantBg: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 52%, #0d9488 100%)',
    isLightCard: false,
    videoBg: '#134e4a',
    videoIsLight: false,
  },
  hrm: {
    displayTitle: 'Hệ Thống Quản Trị Nguồn Nhân Lực Toàn Diện',
    subtitle: 'Human Resource Management',
    shortCodeLabel: 'HRM',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 237, 213, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(124, 45, 18, 0.54) 100%)',
    tintBgLight: 'rgba(255, 237, 213, 0.62)',
    tintBgDark: 'rgba(234, 88, 12, 0.24)',
    borderLight: 'rgba(249, 115, 22, 0.36)',
    borderDark: 'rgba(251, 146, 60, 0.38)',
    lightAccent: '#c2410c',
    darkAccent: '#fb923c',
    iconName: 'briefcase',
    illustrationSrc: 'https://i.postimg.cc/MH7wL9Xh/HRM-Quan-ly-Nguon-nhan-luc.webp',
    cardTheme: '#F97316',
    vibrantBg: 'linear-gradient(135deg, #ea580c 0%, #f97316 52%, #c2410c 100%)',
    isLightCard: false,
    videoBg: '#431407',
    videoIsLight: false,
  },
  bpm: {
    displayTitle: 'Hệ Thống Số Hóa & Tự Động Hóa Quy Trình',
    subtitle: 'Business Process Management',
    shortCodeLabel: 'BPM',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(237, 233, 254, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(76, 29, 149, 0.54) 100%)',
    tintBgLight: 'rgba(237, 233, 254, 0.62)',
    tintBgDark: 'rgba(124, 58, 237, 0.24)',
    borderLight: 'rgba(139, 92, 246, 0.36)',
    borderDark: 'rgba(167, 139, 250, 0.38)',
    lightAccent: '#6d28d9',
    darkAccent: '#c084fc',
    iconName: 'file-text',
    illustrationSrc: 'https://i.postimg.cc/6qJwzk5J/BPM-Quan-ly-Quy-trinh-Nghiep-vu.webp',
    cardTheme: '#8B5CF6',
    vibrantBg: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 52%, #4f46e5 100%)',
    isLightCard: false,
    videoBg: '#2e1065',
    videoIsLight: false,
  },
  okr: {
    displayTitle: 'Hệ Thống Quản Trị Mục Tiêu & Kết Quả Then Chốt',
    subtitle: 'Objectives & Key Results',
    shortCodeLabel: 'OKR',
    gradient: 'linear-gradient(135deg, #65a30d 0%, #15803d 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(220, 252, 231, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(20, 83, 45, 0.54) 100%)',
    tintBgLight: 'rgba(220, 252, 231, 0.62)',
    tintBgDark: 'rgba(22, 163, 74, 0.24)',
    borderLight: 'rgba(34, 197, 94, 0.36)',
    borderDark: 'rgba(74, 222, 128, 0.38)',
    lightAccent: '#15803d',
    darkAccent: '#4ade80',
    iconName: 'target',
    illustrationSrc: 'https://i.postimg.cc/BbT3zmXf/OKR-Quan-ly-Muc-tieu-Ket-qua.webp',
    cardTheme: '#22C55E',
    vibrantBg: 'linear-gradient(135deg, #15803d 0%, #22c55e 52%, #166534 100%)',
    isLightCard: false,
    videoBg: '#052e16',
    videoIsLight: false,
  },
  lms: {
    displayTitle: 'Hệ Thống Quản Lý Đào Tạo Trực Tuyến',
    subtitle: 'Learning Management System',
    shortCodeLabel: 'LMS',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(219, 234, 254, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 58, 138, 0.54) 100%)',
    tintBgLight: 'rgba(219, 234, 254, 0.62)',
    tintBgDark: 'rgba(37, 99, 235, 0.24)',
    borderLight: 'rgba(59, 130, 246, 0.36)',
    borderDark: 'rgba(96, 165, 250, 0.38)',
    lightAccent: '#1d4ed8',
    darkAccent: '#60a5fa',
    iconName: 'graduation',
    illustrationSrc: 'https://i.postimg.cc/kGQCHTB3/LMS-Quan-ly-Dao-tao.webp',
    cardTheme: '#2563EB',
    vibrantBg: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 52%, #1e40af 100%)',
    isLightCard: false,
    videoBg: '#172554',
    videoIsLight: false,
  },
  bi: {
    displayTitle: 'Hệ Thống Báo Cáo & Phân Tích Dữ Liệu',
    subtitle: 'Business Intelligence Dashboard',
    shortCodeLabel: 'BI',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(243, 232, 255, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(88, 28, 135, 0.54) 100%)',
    tintBgLight: 'rgba(243, 232, 255, 0.62)',
    tintBgDark: 'rgba(147, 51, 234, 0.24)',
    borderLight: 'rgba(168, 85, 247, 0.36)',
    borderDark: 'rgba(192, 132, 252, 0.38)',
    lightAccent: '#7e22ce',
    darkAccent: '#d8b4fe',
    iconName: 'trending',
    illustrationSrc: 'https://i.postimg.cc/Y0Kk85q7/BI-Dashboard-Bao-cao-Phan-tich.webp',
    cardTheme: '#9333EA',
    vibrantBg: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 52%, #6b21a8 100%)',
    isLightCard: false,
    videoBg: '#3b0764',
    videoIsLight: false,
  },
  ai: {
    displayTitle: 'Trợ Lý Trí Tuệ Nhân Tạo Đa Nhiệm 24/7',
    subtitle: 'Artificial Intelligence Assistant',
    shortCodeLabel: 'AI',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.90) 0%, rgba(224, 231, 255, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(49, 46, 129, 0.56) 100%)',
    tintBgLight: 'rgba(224, 231, 255, 0.62)',
    tintBgDark: 'rgba(79, 70, 229, 0.24)',
    borderLight: 'rgba(99, 102, 241, 0.36)',
    borderDark: 'rgba(129, 140, 248, 0.38)',
    lightAccent: '#4338ca',
    darkAccent: '#818cf8',
    iconName: 'robot',
    illustrationSrc: 'https://i.postimg.cc/D0kF59yK/AI-Assistant-Tro-ly-Tri-tue-Nhan-tao.webp',
    cardTheme: '#4F46E5',
    vibrantBg: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 52%, #0284c7 100%)',
    isLightCard: false,
    videoBg: '#1e1b4b',
    videoIsLight: false,
  },
};

const SYSTEM_VI_SIX_WORD_NAMES: Record<string, string> = {
  sdp: 'Cổng làm việc dịch vụ số',
  csc: 'Trung tâm chăm sóc đa kênh',
  crm: 'Quản trị quan hệ khách hàng',
  clp: 'Chương trình khách hàng thân thiết',
  pos: 'Quản lý bán hàng tại quầy',
  erp: 'Hoạch định nguồn lực doanh nghiệp',
  hrm: 'Quản trị nguồn lực nhân sự',
  bpm: 'Số hóa quy trình làm việc',
  okr: 'Quản trị mục tiêu kết quả',
  lms: 'Hệ thống đào tạo trực tuyến',
  bi: 'Báo cáo phân tích dữ liệu',
  ai: 'Trợ lý trí tuệ nhân tạo',
};

const REFERENCE_GRID_ORDER = [
  'csc',
  'sdp',
  'okr',
  'bpm',
  'ai',
  'hrm',
  'crm',
  'clp',
  'pos',
  'erp',
  'lms',
  'bi',
];

function getRealtimeFlowDescription(
  sysA: SystemData,
  sysB: SystemData,
  isEn = false
): {
  protocol: string;
  latency: string;
  payloadSummary: string;
} {
  const pairKey = [sysA.id, sysB.id].sort().join('-');
  const presetMap: Record<
    string,
    { protocol: string; latency: string; vi: string; en: string }
  > = {
    'crm-sdp': {
      protocol: 'RESTful API + Webhook 2 chiều',
      latency: '11ms',
      vi: 'Đồng bộ tức thì Hồ sơ Khách hàng 360°, lịch sử tương tác đa kênh, hạng thẻ và Ticket đang xử lý ngay trên màn hình Single Agent Workspace.',
      en: 'Instantly syncs 360° customer profiles, omnichannel history, VIP tiers, and active tickets into Single Agent Workspace.',
    },
    'csc-sdp': {
      protocol: 'WebRTC + SIP Trunk + WebSocket',
      latency: '9ms',
      vi: 'Tích hợp trực tiếp cuộc gọi VoIP, định tuyến ACD thông minh, ghi âm và cảnh báo SLA thời gian thực về bàn làm việc SDP.',
      en: 'Streams live VoIP call states, smart ACD routing, call recordings, and SLA alerts directly to SDP.',
    },
    'crm-csc': {
      protocol: 'Webhook Stream + CTI Screen-Pop',
      latency: '14ms',
      vi: 'Tự động bật Pop-up định danh khách hàng ngay khi đổ chuông và lưu đồng bộ nhật ký cuộc gọi / phiếu ghi vào CRM.',
      en: 'Triggers automatic customer Screen-Pop on incoming calls and logs all interactions back into CRM.',
    },
    'erp-pos': {
      protocol: 'gRPC + Kafka Event Bus',
      latency: '18ms',
      vi: 'Khấu trừ tồn kho tức thì ngay khi xuất hóa đơn POS, tự động hạch toán doanh thu và công nợ về sổ cái ERP.',
      en: 'Deducts live inventory on POS checkout and automatically posts revenue ledger entries into ERP.',
    },
    'ai-sdp': {
      protocol: 'SSE Streaming + RAG Vector API',
      latency: '16ms',
      vi: 'Trợ lý AI lắng nghe ngữ cảnh hội thoại trên SDP để gợi ý câu trả lời chuẩn SOP, tóm tắt phiếu ghi và tra cứu tri thức 24/7.',
      en: 'AI Copilot listens to live SDP context to recommend SOP responses, summarize tickets, and search knowledge 24/7.',
    },
    'crm-clp': {
      protocol: 'REST API + Redis Pub/Sub',
      latency: '12ms',
      vi: 'Cập nhật điểm thưởng Loyalty, hạng thành viên VIP và kho Voucher khả dụng theo thời gian thực.',
      en: 'Updates loyalty points, VIP tiers, and eligible vouchers in real time across customer journeys.',
    },
    'hrm-okr': {
      protocol: 'GraphQL Sync + OAuth2',
      latency: '19ms',
      vi: 'Liên kết kết quả hoàn thành OKR/KPI cá nhân và phòng ban trực tiếp với đánh giá năng lực và thưởng hiệu suất HRM.',
      en: 'Links individual and team OKR attainment directly to HRM performance reviews and incentive payouts.',
    },
    'bi-sdp': {
      protocol: 'ClickHouse Stream + WebSocket',
      latency: '15ms',
      vi: 'Thu thập toàn bộ luồng sự kiện vận hành từ SDP để kết xuất biểu đồ Real-time Wallboard (AHT, CSAT, FCR, SLA).',
      en: 'Captures live operational telemetry from SDP to power real-time AHT, CSAT, FCR, and SLA dashboards.',
    },
  };

  if (presetMap[pairKey]) {
    const match = presetMap[pairKey];
    return {
      protocol: match.protocol,
      latency: match.latency,
      payloadSummary: isEn ? match.en : match.vi,
    };
  }

  return {
    protocol: 'Enterprise Service Bus (REST / Kafka)',
    latency: '14ms',
    payloadSummary: isEn
      ? `Bi-directional real-time data synchronization between ${sysA.abbr} and ${sysB.abbr} via TLS 1.3 API Gateway.`
      : `Đồng bộ dữ liệu hai chiều thời gian thực giữa ${sysA.abbr} (${sysA.nameVi}) và ${sysB.abbr} (${sysB.nameVi}) qua API Gateway chuẩn TLS 1.3.`,
  };
}

export const SystemsView: React.FC<SystemsViewProps> = ({ currentTheme }) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark, cardStyle } = useTheme();

  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-iridescent-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-flat-soft-ui';
  const isLight = !isDark;
  const isLeatherTheme = cardStyle === 'cowhide-leather' || cardStyle === 'walnut-wood';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isEcosystemDiagramOpen, setIsEcosystemDiagramOpen] = useState<boolean>(false);
  const systemsBannerVideo = getDefaultBannerVideoConfig('systems');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // FLIP Morph Expansion State (giống ServicesView)
  const [expandedSystem, setExpandedSystem] = useState<SystemData | null>(null);
  const [originSystemId, setOriginSystemId] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState<'idle' | 'entering' | 'open' | 'closing'>('idle');
  const [isGridDimmed, setIsGridDimmed] = useState<boolean>(false);
  const [morphRect, setMorphRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [wrapperMinHeight, setWrapperMinHeight] = useState<number | undefined>(undefined);
  const [isBannerHiddenForExpand, setIsBannerHiddenForExpand] = useState<boolean>(false);

  // Level 1 Full-Card Video & Bento 4x In-Grid Expansion
  const [activeCardDemoId, setActiveCardDemoId] = useState<string | null>(null);
  const [expandedBentoId, setExpandedBentoId] = useState<string | null>(null);

  // Level 2 Expanded Card Interactive Tools: Video Sound, Comparison Mode, QR Quick Access
  const [isExpandedVideoMuted, setIsExpandedVideoMuted] = useState<boolean>(true);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareTargetId, setCompareTargetId] = useState<string>('crm');
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedQrUrl, setCopiedQrUrl] = useState<boolean>(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Floating Intro Video Circle + 9-Card Stage
  const circleVideoRef = useRef<HTMLVideoElement>(null);
  const introStageVideoRef = useRef<HTMLVideoElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [isIntroStageMuted, setIsIntroStageMuted] = useState<boolean>(false);
  const [nineCardBoxSize, setNineCardBoxSize] = useState<{ width: number; height: number } | null>(null);

  // Refs for layout measurement & timers
  const systemsMainRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const expandedCardRef = useRef<HTMLDivElement | null>(null);
  const expandedBodyRef = useRef<HTMLDivElement | null>(null);
  const expandedVideoRef = useRef<HTMLVideoElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const animTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setIsExpandedVideoMuted(getSavedMutedPref(true));
    const handleAudioPref = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        setIsExpandedVideoMuted(customEvent.detail.muted);
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, handleAudioPref);
    return () => {
      window.removeEventListener(AUDIO_PREF_EVENT, handleAudioPref);
      stopActiveSpeech();
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const getSystemCategory = (id: string): string => {
    if (['sdp', 'csc', 'crm', 'clp', 'pos'].includes(id)) return 'cskh';
    if (['erp', 'hrm', 'bpm', 'okr', 'lms'].includes(id)) return 'enterprise';
    if (['bi', 'ai'].includes(id)) return 'ai_analytics';
    return 'cskh';
  };

  const ecosystemSegments = useMemo(
    () => [
      {
        id: 'all',
        label: isEn ? 'All 12 Systems' : 'Tất cả phân hệ',
        count: 12,
      },
      {
        id: 'cskh',
        label: isEn ? 'Customer Ops (CSKH)' : 'Vận hành CSKH',
        count: 5,
      },
      {
        id: 'enterprise',
        label: isEn ? 'Enterprise Management' : 'Quản trị doanh nghiệp',
        count: 5,
      },
      {
        id: 'ai_analytics',
        label: isEn ? 'AI & Analytics' : 'Phân tích & AI',
        count: 2,
      },
    ],
    [isEn]
  );

  const filteredSystems = useMemo(() => {
    let list = [...SYSTEMS_DATA];
    if (activeCategory === 'all' && !searchQuery.trim()) {
      return list;
    }
    if (activeCategory !== 'all') {
      list = list.filter((item) => getSystemCategory(item.id) === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const matchVi =
          (item.nameVi || item.name || '').toLowerCase().includes(q) ||
          (item.descVi || item.description || '').toLowerCase().includes(q);
        const matchEn =
          (item.nameEn || item.name || '').toLowerCase().includes(q) ||
          (item.descEn || item.description || '').toLowerCase().includes(q);
        const matchCode =
          (item.abbr || item.code || '').toLowerCase().includes(q) ||
          (item.fullName || item.name || '').toLowerCase().includes(q) ||
          (item.metrics || '').toLowerCase().includes(q);
        return matchVi || matchEn || matchCode;
      });
    }
    return list;
  }, [activeCategory, searchQuery]);

  const orderedAllSystems = useMemo(() => {
    const copy = [...SYSTEMS_DATA];
    copy.sort((a, b) => {
      const idxA = REFERENCE_GRID_ORDER.indexOf(a.id);
      const idxB = REFERENCE_GRID_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
    return copy;
  }, []);

  const getAccentColor = useCallback(
    (id: string) => {
      if (cardStyle === 'walnut-wood') {
        return '#F5C478';
      }
      if (isLeatherTheme) {
        return '#FDE68A';
      }
      const meta = SYSTEM_DESIGN_MAP[id] || SYSTEM_DESIGN_MAP.sdp;
      return isLight ? meta.lightAccent : meta.darkAccent;
    },
    [isLeatherTheme, cardStyle, isLight]
  );

  const computeTargetBounds = useCallback(() => {
    const hostEl = systemsMainRef.current || cardsWrapperRef.current;
    if (!hostEl) return null;

    const computedStyle = typeof window !== 'undefined' ? window.getComputedStyle(hostEl) : null;
    const padX = computedStyle ? parseFloat(computedStyle.paddingLeft || '15') : 15;
    const padY = computedStyle ? parseFloat(computedStyle.paddingTop || '15') : 15;
    const insetX = Number.isFinite(padX) && padX >= 0 ? padX : 15;
    const insetY = Number.isFinite(padY) && padY >= 0 ? padY : 15;
    return {
      top: insetY,
      left: insetX,
      width: Math.max(240, hostEl.clientWidth - insetX * 2),
      height: Math.max(240, hostEl.clientHeight - insetY * 2),
      needsWrapperMinHeight: undefined,
    };
  }, []);

  const openExpandedSystem = useCallback(
    (sys: SystemData, explicitEl?: HTMLElement | null) => {
      clearTimers();
      SoundEngine.playTechChimeExpand();
      setIsCircleVideoPlaying(false);
      setActiveCardDemoId(null);
      setViewMode('grid');

      const defaultConnections = SYSTEM_CONNECTIONS_MAP[sys.id] || ['sdp', 'crm'];
      const defaultCompare = defaultConnections.find((cId) => cId !== sys.id) || (sys.id === 'sdp' ? 'crm' : 'sdp');
      setCompareTargetId(defaultCompare);
      setSelectedConnectionId(defaultConnections[0] || null);
      setIsCompareOpen(false);
      setIsQrOpen(false);

      const hostEl = systemsMainRef.current || cardsWrapperRef.current;
      const originEl = explicitEl || cardRefs.current[sys.id];
      const targetBounds = computeTargetBounds();

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setOriginSystemId(sys.id);
      setExpandedSystem(sys);

      if (prefersReducedMotion || !hostEl || !originEl || !targetBounds) {
        setIsBannerHiddenForExpand(true);
        if (targetBounds) {
          setMorphRect({
            top: targetBounds.top,
            left: targetBounds.left,
            width: targetBounds.width,
            height: targetBounds.height,
          });
          setWrapperMinHeight(undefined);
        }
        setAnimPhase('open');
        setIsGridDimmed(true);
        return;
      }

      const hostRect = hostEl.getBoundingClientRect();
      const cardRect = originEl.getBoundingClientRect();

      setWrapperMinHeight(undefined);
      setIsBannerHiddenForExpand(true);
      setAnimPhase('entering');
      setMorphRect({
        top: cardRect.top - hostRect.top,
        left: cardRect.left - hostRect.left,
        width: cardRect.width,
        height: cardRect.height,
      });

      rafRef.current = window.requestAnimationFrame(() => {
        if (expandedCardRef.current) {
          void expandedCardRef.current.offsetHeight;
        }
        const liveBounds = computeTargetBounds() || targetBounds;
        rafRef.current = window.requestAnimationFrame(() => {
          setIsGridDimmed(true);
          setAnimPhase('open');
          setMorphRect({
            top: liveBounds.top,
            left: liveBounds.left,
            width: liveBounds.width,
            height: liveBounds.height,
          });
        });
      });
    },
    [clearTimers, computeTargetBounds]
  );

  const closeExpandedSystem = useCallback(() => {
    if (!expandedSystem || animPhase === 'idle' || animPhase === 'closing') return;
    clearTimers();
    SoundEngine.playTechChimeCollapse();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hostEl = systemsMainRef.current || cardsWrapperRef.current;
    const targetId = originSystemId || expandedSystem.id;

    setIsGridDimmed(false);
    setIsCompareOpen(false);
    setIsQrOpen(false);
    setIsBannerHiddenForExpand(false);

    if (prefersReducedMotion || !hostEl) {
      setExpandedSystem(null);
      setOriginSystemId(null);
      setAnimPhase('idle');
      setMorphRect(null);
      setWrapperMinHeight(undefined);
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const originEl = cardRefs.current[targetId];
      if (!originEl) {
        setExpandedSystem(null);
        setOriginSystemId(null);
        setAnimPhase('idle');
        setMorphRect(null);
        setWrapperMinHeight(undefined);
        return;
      }
      const hostRect = hostEl.getBoundingClientRect();
      const cardRect = originEl.getBoundingClientRect();

      setAnimPhase('closing');
      setMorphRect({
        top: cardRect.top - hostRect.top,
        left: cardRect.left - hostRect.left,
        width: cardRect.width,
        height: cardRect.height,
      });

      animTimerRef.current = window.setTimeout(() => {
        setExpandedSystem(null);
        setOriginSystemId(null);
        setAnimPhase('idle');
        setMorphRect(null);
        setWrapperMinHeight(undefined);
      }, 720);
    });
  }, [expandedSystem, animPhase, clearTimers, originSystemId]);

  const switchExpandedSystem = useCallback((sys: SystemData) => {
    SoundEngine.playTap();
    setExpandedSystem(sys);
    setOriginSystemId(sys.id);
    const conns = SYSTEM_CONNECTIONS_MAP[sys.id] || ['sdp', 'crm'];
    setSelectedConnectionId(conns[0] || null);
    setCompareTargetId((prev) => (prev === sys.id ? conns[0] || (sys.id === 'sdp' ? 'crm' : 'sdp') : prev));
    if (expandedBodyRef.current) {
      expandedBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Live resize observer sync while expanded card is open
  useEffect(() => {
    const hostEl = systemsMainRef.current || cardsWrapperRef.current;
    if (!hostEl || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (animPhase !== 'open') return;
      const bounds = computeTargetBounds();
      if (!bounds) return;
      setMorphRect({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      });
      setWrapperMinHeight(undefined);
    });

    observer.observe(hostEl);
    return () => observer.disconnect();
  }, [animPhase, computeTargetBounds]);

  // Auto-play demo video cleanly when expanded system changes
  useEffect(() => {
    if (!expandedSystem?.videoUrl) return;
    const video = expandedVideoRef.current;
    if (video) {
      video.muted = isExpandedVideoMuted;
      video.play().catch(() => {});
    }
  }, [expandedSystem?.id, expandedSystem?.videoUrl, isExpandedVideoMuted]);

  // Generate dynamic QR Code when QR panel is opened or expanded system switches
  useEffect(() => {
    if (!isQrOpen || !expandedSystem) return;
    const targetUrl =
      expandedSystem.url ||
      (typeof window !== 'undefined' ? window.location.href : 'https://powerservice.one');
    let active = true;
    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [isQrOpen, expandedSystem]);

  // Floating intro circle video helpers
  const measureNineCardsBox = useCallback((): { width: number; height: number } | null => {
    const gridEl = cardsGridRef.current || cardsWrapperRef.current;
    if (!gridEl) return null;
    const gridRect = gridEl.getBoundingClientRect();
    if (gridRect.width <= 0) return null;

    const firstCardKey = Object.keys(cardRefs.current).find((k) => cardRefs.current[k]);
    const firstCardEl = firstCardKey ? cardRefs.current[firstCardKey] : null;
    const cardRect = firstCardEl?.getBoundingClientRect();

    const cols =
      gridRect.width >= 960 ? 3 : gridRect.width >= 600 ? 2 : 1;
    const targetCols = Math.min(3, cols);
    const targetRows = Math.ceil(9 / targetCols);

    const singleCardW =
      cardRect && cardRect.width > 0
        ? cardRect.width
        : (gridRect.width - Math.max(0, cols - 1) * 15) / cols;
    const singleCardH = cardRect && cardRect.height > 0 ? cardRect.height : 196;

    const rawW = targetCols * singleCardW + Math.max(0, targetCols - 1) * 15;
    const rawH = targetRows * singleCardH + Math.max(0, targetRows - 1) * 15;

    return {
      width: Math.min(Math.round(gridRect.width), Math.max(300, Math.round(rawW))),
      height: Math.max(260, Math.round(rawH)),
    };
  }, []);

  useEffect(() => {
    if (!isCircleVideoPlaying) return;
    const video = introStageVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    setIsIntroStageMuted(false);
    const p = video.play();
    if (p !== undefined) {
      p.catch(() => {
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
    showToast(isEn ? 'Closed intro video' : 'Đã đóng video giới thiệu — Hiển thị lại 12 hệ thống');
  }, [isEn, showToast]);

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
    if (expandedSystem) {
      setExpandedSystem(null);
      setOriginSystemId(null);
      setAnimPhase('idle');
      setMorphRect(null);
      setIsGridDimmed(false);
    }
    const measured = measureNineCardsBox();
    if (measured) setNineCardBoxSize(measured);
    setViewMode('grid');
    setIsCircleVideoPlaying(true);
    showToast(isEn ? 'Playing systems intro video' : 'Đang phát video giới thiệu 12 hệ thống 🔊');
  }, [isCircleVideoPlaying, handleCloseIntroVideo, expandedSystem, measureNineCardsBox, isEn, showToast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  const handleToggleBentoCard = useCallback((id: string) => {
    setExpandedBentoId((prev) => (prev === id ? null : id));
  }, []);

  const handleCollapseBentoCard = useCallback(() => {
    setExpandedBentoId(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      } else if (isEcosystemDiagramOpen) {
        setIsEcosystemDiagramOpen(false);
      } else if (isQrOpen) {
        setIsQrOpen(false);
      } else if (isCompareOpen) {
        setIsCompareOpen(false);
      } else if (expandedBentoId) {
        setExpandedBentoId(null);
      } else if (expandedSystem) {
        closeExpandedSystem();
      } else if (activeCardDemoId) {
        setActiveCardDemoId(null);
      } else if (isCircleVideoPlaying) {
        handleCloseIntroVideo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isFilterDropdownOpen,
    isEcosystemDiagramOpen,
    isQrOpen,
    isCompareOpen,
    expandedBentoId,
    expandedSystem,
    closeExpandedSystem,
    activeCardDemoId,
    isCircleVideoPlaying,
    handleCloseIntroVideo,
  ]);

  const handleOpenExternalUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url || url === '#') {
      showToast(
        isEn
          ? 'BI Dashboard API integration is being finalized.'
          : 'Hệ thống BI Dashboard đang hoàn thiện tích hợp API thời gian thực!'
      );
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPortalUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedQrUrl(true);
      showToast(isEn ? 'System URL copied!' : 'Đã sao chép đường dẫn truy cập hệ thống!');
      window.setTimeout(() => setCopiedQrUrl(false), 1800);
    } catch {
      showToast(isEn ? 'Unable to copy URL' : 'Không thể sao chép liên kết lúc này');
    }
  };

  const expandedMeta = expandedSystem
    ? SYSTEM_DESIGN_MAP[expandedSystem.id] || SYSTEM_DESIGN_MAP.sdp
    : null;
  const expandedTech = expandedSystem
    ? SYSTEM_TECH_SPECS_MAP[expandedSystem.id] || SYSTEM_TECH_SPECS_MAP.sdp
    : null;
  const expandedAccent = expandedSystem ? getAccentColor(expandedSystem.id) : '#0284c7';
  const compareTargetSystem = useMemo(
    () => orderedAllSystems.find((s) => s.id === compareTargetId) || orderedAllSystems[0],
    [orderedAllSystems, compareTargetId]
  );

  return (
    <div
      id="systems-page-container"
      data-element-name="Trang Hệ Thống Vận Hành"
      data-element-type="container"
      data-element-page="systems"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border"
    >
      <div
        id="systems-cards-track"
        data-element-name="Track căn giữa Hệ Thống"
        data-element-type="container"
        data-element-page="systems"
        data-element-parent="systems-page-container"
        className="page-cards-track"
      >
        <div
          id="systems-main-card"
          ref={systemsMainRef}
          data-main-card="true"
          data-floating-surface="main"
          data-detail-open={expandedSystem || isCircleVideoPlaying ? 'true' : 'false'}
          data-detail-overlay={expandedSystem ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Hệ Thống Vận Hành"
          data-element-type="card"
          data-element-page="systems"
          data-element-parent="systems-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play select-none text-left box-border"
          style={{
            padding: '15px',
            gap: '0px',
            borderRadius: 'var(--radius-main, 14px)',
          }}
        >
          <div
            id="systems-main-scroll-viewport"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-center justify-start gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
          {/* 1. HERO BANNER ĐẦU TRANG HỆ THỐNG (Tạm ẩn khi mở rộng thẻ hệ thống) */}
          {!isCircleVideoPlaying && !isBannerHiddenForExpand && (
          <motion.section
            id="systems-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="systems"
            data-section-card="true"
            data-has-compact-menu="true"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300 box-border"
            style={{
              padding: '15px',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              borderRadius: 'var(--radius-banner, 14px)',
            }}
          >
            <div
              className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
            >
              <VideoBanner
                videoId={systemsBannerVideo.videoId}
                title={systemsBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            {/* Vùng Tiêu Đề Banner */}
            <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div
                className="card-header-sync flex items-center gap-2 min-w-0"
                style={{ color: 'var(--text-link, var(--color-primary))' }}
              >
                <WebIcon name="cpu" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  {isEn ? 'Enterprise operating systems' : 'Hệ thống vận hành'}
                </h1>
              </div>
              <p
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[58%]"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                  fontWeight: 600,
                  fontStyle: 'normal',
                }}
              >
                &quot;Hệ thống thông minh, vận hành tinh gọn và đồng bộ ♡&quot;
              </p>

              <CompactBannerMenu
                id="systems-compact-menu-btn"
                label={isEn ? 'Controls' : 'Điều khiển'}
                ariaLabel={isEn ? 'System search, filters and view mode' : 'Tìm kiếm, bộ lọc phân hệ và sơ đồ'}
                activeCount={(activeCategory !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0)}
              >
                {(closeMenu) => (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Search' : 'Tìm kiếm'}
                      </span>
                      <div className="relative w-full">
                        <WebIcon
                          name="search"
                          className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (expandedSystem) closeExpandedSystem();
                          }}
                          placeholder={isEn ? 'Search systems...' : 'Tìm hệ thống...'}
                          className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-play focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                          >
                            <WebIcon name="cancel" className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'View mode' : 'Dạng hiển thị'}
                      </span>
                      <div className="banner-control-pill w-full inline-flex items-center gap-1 p-0.5 rounded-full">
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            if (expandedSystem) closeExpandedSystem();
                            setIsCircleVideoPlaying(false);
                            setViewMode('grid');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'grid'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'grid' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Grid' : 'Dạng lưới'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            if (expandedSystem) closeExpandedSystem();
                            setIsCircleVideoPlaying(false);
                            setViewMode('matrix');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'matrix'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'matrix' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <Table className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Matrix' : 'Ma trận'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'System segment' : 'Bộ lọc phân hệ'}
                      </span>
                      {ecosystemSegments.map((seg) => {
                        const isActive = activeCategory === seg.id;
                        return (
                          <button
                            key={seg.id}
                            type="button"
                            data-selected={isActive ? 'true' : undefined}
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveCategory(seg.id);
                              if (expandedSystem) closeExpandedSystem();
                              setIsCircleVideoPlaying(false);
                              closeMenu();
                            }}
                            className={cn(
                              'theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                              isActive ? 'shadow-xs font-bold' : ''
                            )}
                          >
                            <span>{seg.label}</span>
                            {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--border-subcard)]">
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTechChimeExpand();
                          setIsEcosystemDiagramOpen(true);
                          closeMenu();
                        }}
                        className="banner-primary-cta h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                      >
                        <WebIcon name="git-merge" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'Architecture' : 'Sơ đồ hệ thống'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleToggleCircleVideo();
                          closeMenu();
                        }}
                        className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                      >
                        <WebIcon name={isCircleVideoPlaying ? 'cancel' : 'play'} className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isCircleVideoPlaying
                            ? isEn
                              ? 'Close intro video'
                              : 'Đóng video giới thiệu'
                            : isEn
                              ? 'Watch intro video'
                              : 'Video giới thiệu'}
                        </span>
                      </button>

                      {expandedSystem && (
                        <button
                          type="button"
                          onClick={() => {
                            closeExpandedSystem();
                            closeMenu();
                          }}
                          className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                        >
                          <Minimize2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Back to 12 Systems' : 'Quay lại 12 thẻ'}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </CompactBannerMenu>
            </div>

            {/* Bộ điều khiển dưới banner */}
            <div
              id="systems-hero-banner-controls"
              className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full"
              ref={filterDropdownRef}
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                {/* Bộ lọc phân hệ */}
                <div className="relative inline-block text-left">
                  <button
                    id="systems-filter-toggle-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterDropdownOpen((prev) => !prev);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group"
                    title={isEn ? 'System Filter' : 'Bộ lọc phân hệ'}
                    aria-label={isEn ? 'System Filter' : 'Bộ lọc phân hệ'}
                    aria-expanded={isFilterDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <WebIcon name="sliders" className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>{isEn ? 'System Filter' : 'Bộ lọc phân hệ'}</span>
                    {activeCategory !== 'all' && (
                      <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono">
                        {ecosystemSegments.find((s) => s.id === activeCategory)?.label}
                      </span>
                    )}
                    <WebIcon
                      name="chevron-down"
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
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
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14.5rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
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
                                if (expandedSystem) closeExpandedSystem();
                                setIsCircleVideoPlaying(false);
                                setIsFilterDropdownOpen(false);
                              }}
                              className={cn(
                                'theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                                isActive ? 'shadow-xs font-bold' : ''
                              )}
                            >
                              <span>{seg.label}</span>
                              {isActive && <span className="w-2 h-2 rounded-full bg-current" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sơ đồ hệ thống */}
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTechChimeExpand();
                    setIsEcosystemDiagramOpen(true);
                  }}
                  className="banner-primary-cta h-9 inline-flex items-center gap-1.5 px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-play"
                  title={isEn ? 'System Architecture Diagram' : 'Mở Sơ đồ liên kết hệ thống'}
                >
                  <WebIcon name="git-merge" className="w-3.5 h-3.5 text-current shrink-0" />
                  <span>{isEn ? 'Architecture' : 'Sơ đồ hệ thống'}</span>
                </button>

                {/* Chuyển chế độ Lưới / Bảng ma trận */}
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    if (expandedSystem) closeExpandedSystem();
                    setIsCircleVideoPlaying(false);
                    setViewMode((prev) => (prev === 'grid' ? 'matrix' : 'grid'));
                  }}
                  className="banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full transition-colors cursor-pointer typo-button font-play"
                  title={
                    viewMode === 'grid'
                      ? isEn
                        ? 'Switch to Matrix Table'
                        : 'Xem bảng ma trận kỹ thuật 12 hệ thống'
                      : isEn
                        ? 'Switch to Card Grid'
                        : 'Quay về lưới 12 thẻ hệ thống'
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <Table className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="hidden sm:inline">{isEn ? 'Matrix' : 'Ma trận'}</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="hidden sm:inline">{isEn ? 'Grid' : 'Dạng lưới'}</span>
                    </>
                  )}
                </button>

                {expandedSystem && (
                  <button
                    type="button"
                    onClick={closeExpandedSystem}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-button font-play cursor-pointer transition"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back to 12 Systems' : 'Quay lại 12 thẻ'}</span>
                  </button>
                )}
              </div>

              {/* Tìm kiếm + Badge số lượng + Video tròn giới thiệu */}
              <div className="flex items-center gap-2 ml-auto shrink-0 max-w-full">
                <div className="relative w-32 sm:w-44 md:w-48">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="systems-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (expandedSystem) closeExpandedSystem();
                    }}
                    placeholder={isEn ? 'Search systems...' : 'Tìm hệ thống...'}
                    aria-label={isEn ? 'Search systems' : 'Tìm kiếm hệ thống'}
                    className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-body font-normal font-play focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div
                  id="systems-intro-video-circle-btn"
                  role="button"
                  tabIndex={0}
                  onClick={handleToggleCircleVideo}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleCircleVideo();
                    }
                  }}
                  aria-label={
                    isCircleVideoPlaying
                      ? isEn
                        ? 'Close intro video'
                        : 'Đóng video giới thiệu hệ thống'
                      : isEn
                        ? 'Watch intro video'
                        : 'Xem video giới thiệu hệ thống'
                  }
                  title={
                    isCircleVideoPlaying
                      ? isEn
                        ? 'Close intro video'
                        : 'Đóng video giới thiệu hệ thống'
                      : isEn
                        ? 'Watch intro video'
                        : 'Xem video giới thiệu hệ thống'
                  }
                  className={cn(
                    'video-play-btn video-play-btn--systems relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full aspect-square p-0.5 flex items-center justify-center cursor-pointer transition-all duration-300 group',
                    isCircleVideoPlaying ? 'is-playing ring-4 ring-[var(--color-primary)]/45' : ''
                  )}
                >
                  <div
                    className="relative w-full h-full rounded-full overflow-hidden border"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-card)',
                    }}
                  >
                    <DualLayerVideoPlayer
                      video1Id=""
                      video2Id=""
                      video1Src={SYSTEM_FLOATING_IDLE_VIDEO_URL}
                      video2Src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      className="absolute inset-0 z-0 pointer-events-none"
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
                        style={
                          isCircleVideoPlaying
                            ? { background: '#E11D48', borderColor: 'rgba(255,255,255,0.75)' }
                            : {
                                background: 'var(--bg-button-primary)',
                                color: 'var(--text-button-primary, #FFFFFF)',
                                borderColor: 'rgba(255,255,255,0.72)',
                              }
                        }
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${
                          isCircleVideoPlaying ? 'text-white' : ''
                        }`}
                      >
                        <WebIcon
                          name={isCircleVideoPlaying ? 'cancel' : 'play'}
                          className={cn(
                            'w-3.5 h-3.5',
                            !isCircleVideoPlaying && 'ml-0.5'
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          )}

          {/* 2. VÙNG HIỂN THỊ CHÍNH (VIDEO GIỚI THIỆU / BẢNG MA TRẬN / 12 THẺ + FLIP MORPH EXPANSION) */}
          {isCircleVideoPlaying ? (
            <motion.div
              id="systems-intro-video-stage-wrap"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex-1 w-full h-full min-h-0 flex items-stretch justify-center p-0"
            >
              <div
                id="systems-intro-video-stage"
                data-element-type="card"
                data-section-card="true"
                className="bento-card glass-card w-full h-full flex flex-col rounded-[var(--radius-main,14px)] overflow-hidden border-0 shadow-2xl bg-black relative"
                style={{ borderRadius: 'var(--radius-main, 14px)' }}
              >
                <div className="relative w-full h-full flex-1 bg-black rounded-[inherit] overflow-hidden">
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const v = introStageVideoRef.current;
                        if (!v) return;
                        const nextMuted = !v.muted;
                        v.muted = nextMuted;
                        setIsIntroStageMuted(nextMuted);
                        showToast(
                          nextMuted ? 'Đã tắt âm thanh video' : 'Đã bật âm thanh video 🔊'
                        );
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 backdrop-blur-md border border-white/20 text-white typo-button font-play transition cursor-pointer shadow-md"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Close Video' : 'Đóng video'}</span>
                    </button>
                  </div>

                  <video
                    ref={introStageVideoRef}
                    src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                    controls={false}
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    muted={isIntroStageMuted}
                    onEnded={() => setIsCircleVideoPlaying(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 18%',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      filter: 'contrast(1.08) saturate(1.1) brightness(1.04)',
                    }}
                    className="absolute inset-0 w-full h-full object-cover bg-black rounded-[inherit] banner-video-sharp"
                  />
                </div>
              </div>
            </motion.div>
          ) : filteredSystems.length === 0 ? (
            <div className="theme-muted-surface text-center py-14 px-4 rounded-[14px] backdrop-blur-md flex flex-col items-center justify-center flex-1 shadow-xs">
              <div
                className="w-12 h-12 rounded-[14px] bg-indigo-500/15 flex items-center justify-center mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                <WebIcon name="search" className="w-6 h-6" />
              </div>
              <p
                className="typo-h3 font-play"
                style={{ color: 'var(--text-heading, var(--text-primary))' }}
              >
                {isEn ? 'No matching systems found' : 'Không tìm thấy hệ thống phù hợp'}
              </p>
              <p className="typo-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {isEn
                  ? 'Try searching CRM, ERP, LMS, AI, or SLA...'
                  : 'Hãy thử nhập từ khóa khác như "CRM", "ERP", "LMS" hoặc "CSKH"...'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="mt-4 px-5 py-2 rounded-full typo-button hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                {isEn ? 'Show All 12 Systems' : 'Xem lại tất cả 12 hệ thống'}
              </button>
            </div>
          ) : viewMode === 'matrix' ? (
            /* CHẾ ĐỘ XEM BẢNG MA TRẬN KỸ THUẬT 12 PHÂN HỆ */
            <div className="flex-1 min-h-0 overflow-auto glass-scrollbar no-scrollbar">
              <table className="theme-table w-full text-left border-collapse min-w-[780px] rounded-[14px] overflow-hidden">
                <thead
                  className="sticky top-0 z-20 backdrop-blur-md border-b typo-caption font-semibold font-mono tracking-wider"
                  style={{ borderColor: 'var(--border-table)' }}
                >
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">{isEn ? 'System' : 'Phân hệ'}</th>
                    <th className="py-2.5 px-2.5 font-semibold">{isEn ? 'Group' : 'Nhóm'}</th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-sky-500" />
                        <span>{isEn ? 'Database' : 'Cơ sở dữ liệu'}</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Network className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{isEn ? 'API Protocol' : 'Giao thức API'}</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">SLA</th>
                    <th className="py-2.5 px-2.5 font-semibold">ISO 27001</th>
                    <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Portal' : 'Truy cập'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y typo-body-sm" style={{ borderColor: 'var(--border-table)' }}>
                  {filteredSystems.map((item) => {
                    const meta = SYSTEM_DESIGN_MAP[item.id] || SYSTEM_DESIGN_MAP.sdp;
                    const tech = SYSTEM_TECH_SPECS_MAP[item.id] || SYSTEM_TECH_SPECS_MAP.sdp;
                    const accent = getAccentColor(item.id);
                    return (
                      <tr
                        key={item.id}
                        tabIndex={0}
                        onClick={() => openExpandedSystem(item)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openExpandedSystem(item);
                          }
                        }}
                        className="hover:bg-sky-500/10 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <WebIcon
                              name={meta.iconName}
                              className="w-[18px] h-[18px] shrink-0"
                              style={{ color: accent }}
                            />
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="px-1.5 py-0.5 rounded typo-badge font-mono font-bold"
                                style={{
                                  background: isLight ? meta.tintBgLight : meta.tintBgDark,
                                  color: accent,
                                }}
                              >
                                {item.abbr}
                              </span>
                              <span className="font-semibold text-[var(--text-primary)] truncate">
                                {isEn ? item.nameEn : item.nameVi}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className="px-2 py-0.5 rounded-full typo-badge border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)]">
                            {isEn ? tech.ecosystemLabelEn : tech.ecosystemLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 font-mono typo-caption font-semibold text-[var(--text-primary)]">
                          {tech.database}
                        </td>
                        <td className="py-2.5 px-2.5 font-mono typo-caption font-semibold text-[var(--color-primary)]">
                          {tech.apiProtocol}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className="px-2 py-0.5 rounded-full typo-badge font-mono bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {tech.slaCommitment}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 typo-caption font-semibold text-[var(--text-primary)]">
                          {tech.isoSecurity}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {item.url ? (
                            <button
                              type="button"
                              onClick={(e) => handleOpenExternalUrl(e, item.url)}
                              className="px-3 py-1 rounded-full typo-badge text-white inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                              style={{ background: meta.gradient }}
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="typo-badge text-amber-600 dark:text-amber-300 font-semibold">
                              {isEn ? 'Integrating' : 'Đang tích hợp'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* LƯỚI BENTO STUDIO 12 THẺ HỆ THỐNG (TỰ ĐỘNG BUNG RỘNG 4X TRONG LƯỚI + HOVER VIDEO NỀN TRẮNG) */
            <div
              id="systems-cards-wrapper"
              ref={cardsWrapperRef}
              className="relative w-full flex flex-col"
              style={wrapperMinHeight ? { minHeight: `${wrapperMinHeight}px` } : undefined}
            >
              <div
                id="systems-cards-grid"
                ref={cardsGridRef}
                data-system-bento-grid="true"
                className={cn(
                  'sys-bento-studio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grid-flow-dense items-start w-full min-w-0',
                  isGridDimmed && 'grid-dimmed'
                )}
              >
                {filteredSystems.map((item) => (
                  <SystemBentoCard
                    key={item.id}
                    sys={item}
                    isEn={isEn}
                    isExpanded={expandedBentoId === item.id}
                    onToggleExpand={handleToggleBentoCard}
                    onCollapse={handleCollapseBentoCard}
                    showToast={showToast}
                    cardRef={(el) => {
                      cardRefs.current[item.id] = el;
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          </div>

          {/* CẤP 2: THẺ MỞ RỘNG FLIP MORPH CHI TIẾT HỆ THỐNG (PHỦ TOÀN BỘ THẺ CHÍNH) */}
          {expandedSystem && expandedMeta && expandedTech && morphRect && (
            <div
              id="systems-expanded-card"
              ref={expandedCardRef}
              data-element-type="card"
              role="region"
              aria-label={
                isEn
                  ? expandedSystem.nameEn || expandedSystem.name
                  : expandedSystem.nameVi || expandedSystem.name
              }
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'system-card-tile system-theme-card bento-card glass-card',
                animPhase === 'entering'
                  ? ''
                  : animPhase === 'open'
                    ? 'is-animating is-open'
                    : animPhase === 'closing'
                      ? 'is-animating is-closing'
                      : ''
              )}
              style={{
                top: `${morphRect.top}px`,
                left: `${morphRect.left}px`,
                width: `${morphRect.width}px`,
                height: `${morphRect.height}px`,
                borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
                zIndex: 50,
              }}
            >
                  {/* Header Expanded Card */}
                  <div
                    className="expanded-detail-content shrink-0 px-4 sm:px-5 py-3 border-b border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-3"
                    style={{
                      background: 'var(--bg-subcard, var(--surface-tertiary-bg, transparent))',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        style={{ borderRadius: 'var(--radius-card, 14px)' }}
                        className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center overflow-hidden border-0 shadow-none"
                      >
                        <img
                          src={expandedMeta.illustrationSrc || expandedSystem.imageUrl}
                          alt={expandedSystem.nameVi}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="relative z-10 w-full h-full object-contain rounded-[inherit] select-none border-0 shadow-none"
                        />
                      </div>

                      <div className="card-header-sync flex items-center gap-2 min-w-0 flex-1" style={{ color: expandedAccent }}>
                        <WebIcon name={expandedMeta.iconName} className="w-5 h-5 shrink-0" style={{ color: expandedAccent }} />
                        <h2
                          className="typo-h4 sm:typo-h3 card-title-synced font-play font-bold tracking-tight truncate m-0"
                          data-card-title="true"
                          style={{ color: expandedAccent }}
                        >
                          {isEn
                            ? expandedSystem.nameEn || expandedSystem.name
                            : expandedSystem.nameVi || expandedSystem.name}
                        </h2>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
                      {expandedSystem.url && (
                        <button
                          type="button"
                          onClick={(e) => handleOpenExternalUrl(e, expandedSystem.url)}
                          className="banner-control-pill inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full typo-button font-play cursor-pointer transition"
                          title={expandedSystem.url}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">
                            {isEn ? 'Open Live' : 'Mở cổng Live'}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={closeExpandedSystem}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full typo-button font-play font-semibold text-white cursor-pointer transition hover:opacity-95 shadow-sm"
                        style={{ background: expandedMeta.gradient }}
                        aria-label={isEn ? 'Minimize details' : 'Thu nhỏ chi tiết hệ thống'}
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Minimize' : 'Thu nhỏ'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Expanded Card — Responsive Bento Grid (Mobile 1 col / Tablet 2 cols / Desktop 4 cols) */}
                  <div
                    ref={expandedBodyRef}
                    className="expanded-detail-content flex-1 min-h-0 overflow-y-auto glass-scrollbar p-[15px]"
                  >
                    <div className="sys-bento-grid">
                      {/* BENTO TILE 1 (Full Row): 4 Chỉ Số KPI Trọng Tâm */}
                      <div
                        data-subcard="true"
                        className="sys-bento-tile md:col-span-2 lg:col-span-4 gap-3"
                      >
                        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                          <div className="sys-bento-subtile p-3 gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 w-full">
                              <Activity
                                className="w-4 h-4 shrink-0"
                                style={{ color: expandedAccent }}
                              />
                              <div
                                className="typo-body-sm sm:typo-body font-bold leading-tight truncate min-w-0 flex-1"
                                style={{ color: expandedAccent }}
                                title={expandedSystem.metrics}
                              >
                                {expandedSystem.metrics}
                              </div>
                            </div>
                            <span className="typo-caption text-[var(--text-secondary)] truncate w-full">
                              {isEn ? 'Core Performance' : 'Hiệu năng cốt lõi'}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 w-full">
                              <Server
                                className="w-4 h-4 shrink-0"
                                style={{ color: expandedAccent }}
                              />
                              <div
                                className="typo-body-sm sm:typo-body font-bold leading-tight truncate min-w-0 flex-1"
                                style={{ color: expandedAccent }}
                                title={expandedTech.slaCommitment}
                              >
                                {expandedTech.slaCommitment}
                              </div>
                            </div>
                            <span className="typo-caption text-[var(--text-secondary)] truncate w-full">
                              {isEn ? 'SLA Commitment' : 'Cam kết SLA'}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 w-full">
                              <Users
                                className="w-4 h-4 shrink-0"
                                style={{ color: expandedAccent }}
                              />
                              <div
                                className="typo-body-sm sm:typo-body font-bold leading-tight truncate min-w-0 flex-1"
                                style={{ color: expandedAccent }}
                              >
                                ~{expandedTech.baseOnlineUsers}+{' '}
                                {isEn
                                  ? expandedTech.onlineRoleLabelEn
                                  : expandedTech.onlineRoleLabel}
                              </div>
                            </div>
                            <span className="typo-caption text-[var(--text-secondary)] truncate w-full">
                              {isEn ? 'Active Concurrency' : 'Quy mô trực tuyến'}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 w-full">
                              <ShieldCheck
                                className="w-4 h-4 shrink-0"
                                style={{ color: expandedAccent }}
                              />
                              <div
                                className="typo-body-sm sm:typo-body font-bold leading-tight truncate min-w-0 flex-1"
                                style={{ color: expandedAccent }}
                                title={expandedTech.isoSecurity}
                              >
                                {expandedTech.isoSecurity}
                              </div>
                            </div>
                            <span className="typo-caption text-[var(--text-secondary)] truncate w-full">
                              {isEn ? 'Security Compliance' : 'Chuẩn bảo mật'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* OPTIONAL DRAWER BENTO TILE: QR Truy cập nhanh */}
                      {isQrOpen && (
                        <div
                          data-subcard="true"
                          className="sys-bento-tile md:col-span-2 lg:col-span-4 gap-3.5 sm:flex-row sm:items-center"
                          style={{
                            borderColor: isLeatherTheme
                              ? 'var(--border-subcard)'
                              : isLight
                                ? expandedMeta.borderLight
                                : expandedMeta.borderDark,
                          }}
                        >
                          <div
                            className="w-28 h-28 rounded-[var(--radius-subcard,14px)] bg-white p-1.5 border shrink-0 flex items-center justify-center shadow-xs"
                            style={{ borderColor: 'var(--border-subcard, rgba(148, 163, 184, 0.35))' }}
                          >
                            {qrDataUrl ? (
                              <img
                                src={qrDataUrl}
                                alt={`QR ${expandedSystem.abbr}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <QrCode className="w-10 h-10 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-2 text-left">
                            <div className="flex items-center justify-between gap-2 w-full">
                              <h3
                                className="typo-h4 subcard-header-sync subcard-title-synced font-bold m-0 text-[var(--text-primary)] flex items-center gap-2"
                                data-subcard-title="true"
                              >
                                <QrCode className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                                <span>
                                  {isEn
                                    ? `Quick QR Portal Access — ${expandedSystem.abbr}`
                                    : `Mã QR truy cập nhanh — ${expandedSystem.abbr}`}
                                </span>
                              </h3>
                              <button
                                type="button"
                                onClick={() => setIsQrOpen(false)}
                                className="typo-caption font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                              >
                                {isEn ? 'Close' : 'Đóng'}
                              </button>
                            </div>
                            <p className="typo-caption text-[var(--text-secondary)] m-0">
                              {expandedSystem.url
                                ? isEn
                                  ? 'Scan on mobile/tablet to launch the live system portal directly.'
                                  : 'Quét bằng điện thoại hoặc máy tính bảng để mở trực tiếp cổng vận hành hệ thống.'
                                : isEn
                                  ? 'BI Dashboard live domain is under final integration; QR links to the Systems Hub.'
                                  : 'Cổng BI Dashboard đang hoàn thiện tích hợp API; mã QR liên kết tới trang Hệ sinh thái.'}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <code className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subcard)] typo-caption font-mono text-[var(--text-primary)] truncate max-w-full">
                                {expandedSystem.url || 'https://powerservice.one (Systems Hub)'}
                              </code>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyPortalUrl(
                                    expandedSystem.url || window.location.href
                                  )
                                }
                                className="sys-bento-action-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-bold border border-[var(--border-subcard)] bg-[var(--bg-card)] hover:bg-[var(--bg-subcard)] cursor-pointer"
                              >
                                {copiedQrUrl ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>
                                  {copiedQrUrl ? (isEn ? 'Copied' : 'Đã chép') : isEn ? 'Copy URL' : 'Sao chép'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* OPTIONAL DRAWER BENTO TILE: So sánh song song */}
                      {isCompareOpen && compareTargetSystem && (() => {
                        const targetTech =
                          SYSTEM_TECH_SPECS_MAP[compareTargetSystem.id] || SYSTEM_TECH_SPECS_MAP.sdp;
                        const pairFlow = getRealtimeFlowDescription(
                          expandedSystem,
                          compareTargetSystem,
                          isEn
                        );
                        return (
                          <div
                            data-subcard="true"
                            className="sys-bento-tile md:col-span-2 lg:col-span-4 gap-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                              <div className="subcard-header-sync flex items-center gap-2" style={{ color: expandedAccent }}>
                                <ArrowLeftRight className="w-4 h-4 shrink-0" style={{ color: expandedAccent }} />
                                <h3 className="typo-h4 subcard-title-synced font-bold m-0 text-[var(--text-primary)]" data-subcard-title="true">
                                  {isEn
                                    ? `Side-by-Side Comparison: ${expandedSystem.abbr} vs ${compareTargetSystem.abbr}`
                                    : `So sánh trực tiếp: ${expandedSystem.abbr} ⇄ ${compareTargetSystem.abbr}`}
                                </h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsCompareOpen(false)}
                                className="typo-caption font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                              >
                                {isEn ? 'Hide Compare' : 'Ẩn so sánh'}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap w-full">
                              <span className="typo-caption text-[var(--text-secondary)] mr-1">
                                {isEn ? 'Compare with:' : 'Chọn phân hệ đối chiếu:'}
                              </span>
                              {orderedAllSystems
                                .filter((s) => s.id !== expandedSystem.id)
                                .map((cand) => {
                                  const isTarget = cand.id === compareTargetSystem.id;
                                  return (
                                    <button
                                      key={cand.id}
                                      type="button"
                                      onClick={() => {
                                        SoundEngine.playTap();
                                        setCompareTargetId(cand.id);
                                      }}
                                      className={cn(
                                        'sys-bento-action-btn px-2.5 py-0.5 rounded-full typo-badge font-bold border cursor-pointer',
                                        isTarget
                                          ? 'text-white border-transparent shadow-xs'
                                          : 'bg-[var(--bg-card)]/80 border-[var(--border-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                      )}
                                      style={
                                        isTarget
                                          ? {
                                              background:
                                                SYSTEM_DESIGN_MAP[cand.id]?.gradient ||
                                                expandedMeta.gradient,
                                            }
                                          : undefined
                                      }
                                    >
                                      {cand.abbr}
                                    </button>
                                  );
                                })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full items-stretch">
                              <div className="sys-bento-subtile p-3 gap-1.5">
                                <span className="typo-body-sm font-bold" style={{ color: expandedAccent }}>
                                  {expandedSystem.abbr} — {isEn ? expandedSystem.nameEn : expandedSystem.nameVi}
                                </span>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>{isEn ? 'Metrics:' : 'Hiệu năng:'}</strong> {expandedSystem.metrics}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>DB:</strong> {expandedTech.database}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>API:</strong> {expandedTech.apiProtocol}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>ISO:</strong> {expandedTech.isoSecurity}
                                </div>
                              </div>

                              <div className="sys-bento-subtile p-3 gap-1.5">
                                <div className="flex items-center justify-between gap-2 w-full">
                                  <span
                                    className="typo-body-sm font-bold"
                                    style={{ color: getAccentColor(compareTargetSystem.id) }}
                                  >
                                    {compareTargetSystem.abbr} —{' '}
                                    {isEn ? compareTargetSystem.nameEn : compareTargetSystem.nameVi}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => switchExpandedSystem(compareTargetSystem)}
                                    className="typo-badge font-bold text-[var(--color-primary)] hover:underline cursor-pointer shrink-0"
                                  >
                                    {isEn ? 'Switch →' : 'Mở thẻ này →'}
                                  </button>
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>{isEn ? 'Metrics:' : 'Hiệu năng:'}</strong> {compareTargetSystem.metrics}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>DB:</strong> {targetTech.database}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>API:</strong> {targetTech.apiProtocol}
                                </div>
                                <div className="typo-caption text-[var(--text-secondary)]">
                                  <strong>ISO:</strong> {targetTech.isoSecurity}
                                </div>
                              </div>
                            </div>

                            <div className="sys-bento-subtile p-3 gap-1 w-full">
                              <div className="flex items-center justify-between gap-2 flex-wrap w-full">
                                <span className="typo-caption font-bold text-[var(--text-primary)]">
                                  {isEn ? 'Real-Time Data Bridge:' : 'Cơ chế đồng bộ dữ liệu trực tiếp:'}{' '}
                                  <span style={{ color: expandedAccent }}>{pairFlow.protocol}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full typo-badge font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                  Latency ~{pairFlow.latency}
                                </span>
                              </div>
                              <p className="typo-caption text-[var(--text-secondary)] m-0 leading-relaxed">
                                {pairFlow.payloadSummary}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* BENTO TILE 2 (Hero Overview & Live Media: Mẫu Thẻ 1 & 3 Bento Studio) */}
                      <div
                        id="system-detail-overview-card"
                        data-subcard="true"
                        className="sys-bento-tile sys-bento-tile--media md:col-span-2 lg:col-span-2 gap-3.5 justify-between relative overflow-hidden"
                      >
                        {/* Bento Studio glowing ambient orb */}
                        <div
                          className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-25"
                          style={{ backgroundColor: expandedAccent }}
                        />

                        <div className="w-full flex flex-col gap-3 min-w-0 relative z-10">
                          <div className="w-full flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)]">
                            <h3
                              className="typo-h4 subcard-header-sync subcard-title-synced font-play font-bold m-0 flex items-center gap-2"
                              data-subcard-title="true"
                              style={{ color: expandedAccent }}
                            >
                              <WebIcon name={expandedMeta.iconName} className="w-4 h-4 shrink-0" style={{ color: expandedAccent }} />
                              <span>{isEn ? 'System Overview' : 'Tổng quan phân hệ'}</span>
                            </h3>
                            <span className="typo-badge font-mono text-[var(--text-muted)] truncate max-w-[180px]">
                              {expandedSystem.abbr}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start w-full min-w-0">
                            {(expandedSystem.videoUrl ||
                              expandedMeta.illustrationSrc ||
                              expandedSystem.imageUrl) && (
                              <div
                                data-media-card={expandedSystem.videoUrl ? 'video' : 'image'}
                                className={cn(
                                  'sys-bento-media-frame sm:col-span-5 relative aspect-video p-1 box-border rounded-xl overflow-hidden shadow-md border border-white/10',
                                  expandedSystem.videoUrl ? 'bg-black' : 'bg-[var(--bg-card)]'
                                )}
                              >
                                {expandedSystem.videoUrl ? (
                                  <>
                                    <video
                                      ref={expandedVideoRef}
                                      src={expandedSystem.videoUrl}
                                      poster={
                                        expandedMeta.illustrationSrc ||
                                        expandedSystem.imageUrl ||
                                        undefined
                                      }
                                      autoPlay
                                      loop
                                      muted={isExpandedVideoMuted}
                                      playsInline
                                      preload="metadata"
                                      controls={false}
                                      disablePictureInPicture
                                      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                                      onLoadedMetadata={(e) => {
                                        const v = e.currentTarget;
                                        v.controls = false;
                                        v.disablePictureInPicture = true;
                                        (v as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
                                      }}
                                      onError={(e) => {
                                        const v = e.currentTarget;
                                        const m = v.src.match(/[?&]id=([^&#]+)/i);
                                        if (m?.[1] && v.dataset.driveAltTried !== m[1]) {
                                          v.dataset.driveAltTried = m[1];
                                          v.src = `https://drive.usercontent.google.com/download?id=${m[1]}&export=download&confirm=t`;
                                          v.play().catch(() => {});
                                        }
                                      }}
                                      onEnded={(e) => {
                                        const v = e.currentTarget;
                                        v.currentTime = 0;
                                        v.play().catch(() => {});
                                      }}
                                      style={{
                                        objectFit: 'cover',
                                        transform: 'translateZ(0)',
                                        backfaceVisibility: 'hidden',
                                        filter: 'contrast(1.08) saturate(1.1) brightness(1.04)',
                                      }}
                                      className="w-full h-full min-w-full min-h-full object-cover rounded-[inherit] pointer-events-none banner-video-sharp"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = !isExpandedVideoMuted;
                                        setIsExpandedVideoMuted(next);
                                        saveMutedPref(next);
                                        if (expandedVideoRef.current) {
                                          expandedVideoRef.current.muted = next;
                                        }
                                      }}
                                      aria-label={
                                        isExpandedVideoMuted
                                          ? isEn
                                            ? 'Unmute demo video'
                                            : 'Bật âm thanh'
                                          : isEn
                                            ? 'Mute demo video'
                                            : 'Tắt âm thanh'
                                      }
                                      className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white border border-white/25 flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                    >
                                      {isExpandedVideoMuted ? (
                                        <VolumeX className="w-3.5 h-3.5" />
                                      ) : (
                                        <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                                      )}
                                    </button>
                                  </>
                                ) : (
                                  <img
                                    src={expandedMeta.illustrationSrc || expandedSystem.imageUrl}
                                    alt={expandedSystem.nameVi}
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain rounded-[inherit] p-0 border-0 shadow-none"
                                  />
                                )}
                              </div>
                            )}

                            <p
                              className={cn(
                                'typo-body-sm text-[var(--text-primary)] leading-relaxed m-0 min-w-0',
                                expandedSystem.videoUrl ||
                                  expandedMeta.illustrationSrc ||
                                  expandedSystem.imageUrl
                                  ? 'sm:col-span-7'
                                  : 'sm:col-span-12'
                              )}
                            >
                              {isEn
                                ? expandedSystem.descEn || expandedSystem.description
                                : expandedSystem.descVi || expandedSystem.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-full typo-badge font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subcard)] truncate">
                          {expandedSystem.fullName}
                        </div>
                      </div>

                      {/* BENTO TILE 3 (Technical Stack 2x2 Sub-Cards: 1 col tablet / 2 cols desktop) */}
                      <div
                        data-subcard="true"
                        className="sys-bento-tile md:col-span-1 lg:col-span-2 gap-3 justify-between"
                      >
                        <div className="subcard-header-sync w-full flex items-center gap-2 pb-2 border-b border-[var(--border-subcard)]" style={{ color: expandedAccent }}>
                          <Server className="w-4 h-4 shrink-0" style={{ color: expandedAccent }} />
                          <h3
                            className="typo-h4 subcard-title-synced font-play font-bold m-0"
                            data-subcard-title="true"
                            style={{ color: expandedAccent }}
                          >
                            {isEn ? 'Technical Architecture' : 'Hạ tầng kỹ thuật'}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full flex-1">
                          <div className="sys-bento-subtile p-3 gap-1">
                            <span className="typo-label font-mono text-[var(--text-secondary)]">
                              {isEn ? 'Database Stack' : 'Cơ sở dữ liệu (DB)'}
                            </span>
                            <span className="typo-body-sm font-bold text-[var(--text-primary)] break-words">
                              {expandedTech.database}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <span className="typo-label font-mono text-[var(--text-secondary)]">
                              {isEn ? 'API & Streaming Protocol' : 'Giao thức API kết nối'}
                            </span>
                            <span className="typo-body-sm font-bold text-[var(--color-primary)] break-words">
                              {expandedTech.apiProtocol}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <span className="typo-label font-mono text-[var(--text-secondary)]">
                              {isEn ? 'Service Level & Availability' : 'Cam kết chất lượng (SLA)'}
                            </span>
                            <span className="typo-body-sm font-bold text-emerald-700 dark:text-emerald-300 break-words">
                              {expandedTech.slaCommitment}
                            </span>
                          </div>

                          <div className="sys-bento-subtile p-3 gap-1">
                            <span className="typo-label font-mono text-[var(--text-secondary)]">
                              {isEn ? 'Compliance & Encryption' : 'Bảo mật & Tuân thủ ISO'}
                            </span>
                            <span className="typo-body-sm font-bold text-[var(--text-primary)] break-words">
                              {expandedTech.isoSecurity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BENTO TILE 4 (Core Capabilities & Features Sub-Cards: 1 col tablet / 2 cols desktop) */}
                      <div
                        id="system-detail-features-card"
                        data-subcard="true"
                        className="sys-bento-tile md:col-span-1 lg:col-span-2 gap-3"
                      >
                        <div className="subcard-header-sync w-full flex items-center gap-2 pb-2 border-b border-[var(--border-subcard)]" style={{ color: expandedAccent }}>
                          <Activity className="w-4 h-4 shrink-0" style={{ color: expandedAccent }} />
                          <h3 className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]" data-subcard-title="true">
                            {isEn ? 'Core Capabilities & Features' : 'Tính năng trọng tâm'}
                          </h3>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full m-0 p-0 list-none">
                          {(expandedSystem.featuresVi || expandedSystem.features || []).map(
                            (feat, fIdx) => (
                              <li
                                key={fIdx}
                                className="sys-bento-subtile p-2.5 flex-row items-start gap-2.5 typo-body-sm text-[var(--text-primary)] leading-relaxed"
                              >
                                <span
                                  className="w-5 h-5 rounded-full text-white typo-badge font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                                  style={{ background: expandedMeta.gradient }}
                                >
                                  {fIdx + 1}
                                </span>
                                <span className="min-w-0 flex-1">{feat}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* BENTO TILE 5 (Connected Systems + Omnichannel Architecture Hub: 2 cols tablet / 2 cols desktop) */}
                      <div
                        id="system-detail-connections-card"
                        data-subcard="true"
                        className="sys-bento-tile md:col-span-2 lg:col-span-2 gap-3 justify-between"
                      >
                        <div className="w-full flex flex-col gap-3 min-w-0">
                          <div className="w-full flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[var(--border-subcard)]">
                            <div className="subcard-header-sync flex items-center gap-2" style={{ color: expandedAccent }}>
                              <Network className="w-4 h-4 shrink-0" style={{ color: expandedAccent }} />
                              <h3 className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]" data-subcard-title="true">
                                {isEn ? 'Connected Systems & Ecosystem' : 'Hệ thống liên thông & Kiến trúc ESB'}
                              </h3>
                            </div>
                            <span className="typo-caption text-[var(--text-muted)]">
                              {isEn
                                ? 'Click to inspect sync or jump'
                                : 'Chọn để xem luồng dữ liệu'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 w-full">
                            {(SYSTEM_CONNECTIONS_MAP[expandedSystem.id] || ['sdp', 'crm']).map(
                              (connId) => {
                                const connSys = orderedAllSystems.find((s) => s.id === connId);
                                if (!connSys) return null;
                                const isSel = selectedConnectionId === connId;
                                const connMeta = SYSTEM_DESIGN_MAP[connId] || SYSTEM_DESIGN_MAP.sdp;
                                return (
                                  <button
                                    key={connId}
                                    type="button"
                                    onClick={() => {
                                      SoundEngine.playTap();
                                      setSelectedConnectionId(connId);
                                    }}
                                    className={cn(
                                      'sys-bento-action-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-caption font-bold border cursor-pointer',
                                      isSel
                                        ? 'text-white border-transparent shadow-sm'
                                        : 'bg-[var(--bg-card)]/85 border-[var(--border-subcard)] text-[var(--text-primary)] hover:border-[var(--color-primary)]/50'
                                    )}
                                    style={isSel ? { background: connMeta.gradient } : undefined}
                                  >
                                    <WebIcon name={connMeta.iconName} className="w-3.5 h-3.5 shrink-0" />
                                    <span>{connSys.abbr}</span>
                                  </button>
                                );
                              }
                            )}
                          </div>

                          {selectedConnectionId &&
                            (() => {
                              const connTarget = orderedAllSystems.find(
                                (s) => s.id === selectedConnectionId
                              );
                              if (!connTarget) return null;
                              const flow = getRealtimeFlowDescription(
                                expandedSystem,
                                connTarget,
                                isEn
                              );
                              return (
                                <div className="sys-bento-subtile p-3 gap-1.5 w-full">
                                  <div className="flex items-center justify-between gap-2 flex-wrap w-full">
                                    <span className="typo-caption font-bold text-[var(--text-primary)]">
                                      {expandedSystem.abbr} ⇄ {connTarget.abbr} ·{' '}
                                      <span style={{ color: expandedAccent }}>
                                        {flow.protocol}
                                      </span>{' '}
                                      ({flow.latency})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => switchExpandedSystem(connTarget)}
                                      className="sys-bento-action-btn inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full typo-badge font-bold text-white cursor-pointer hover:brightness-110"
                                      style={{
                                        background:
                                          SYSTEM_DESIGN_MAP[connTarget.id]?.gradient ||
                                          expandedMeta.gradient,
                                      }}
                                    >
                                      <span>
                                        {isEn
                                          ? `Open ${connTarget.abbr}`
                                          : `Xem ${connTarget.abbr}`}
                                      </span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="typo-caption text-[var(--text-secondary)] m-0 leading-relaxed">
                                    {flow.payloadSummary}
                                  </p>
                                </div>
                              );
                            })()}

                          <div
                            className="sys-bento-subtile p-3 gap-1 w-full"
                            style={{
                              backgroundColor: isLeatherTheme
                                ? undefined
                                : isLight
                                  ? expandedMeta.tintBgLight
                                  : expandedMeta.tintBgDark,
                              borderColor: isLeatherTheme
                                ? 'var(--border-subcard)'
                                : isLight
                                  ? expandedMeta.borderLight
                                  : expandedMeta.borderDark,
                            }}
                          >
                            <div className="subcard-header-sync flex items-center gap-2" style={{ color: expandedAccent }}>
                              <WebIcon name="git-merge" className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                              <span className="typo-caption font-bold" style={{ color: expandedAccent }}>
                                {isEn ? 'Omnichannel Architecture' : 'Kiến trúc kết nối toàn hệ sinh thái'}
                              </span>
                            </div>
                            <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                              {isEn
                                ? `${expandedSystem.abbr} operates inside the ${expandedTech.ecosystemLabelEn} layer, exchanging real-time telemetry with 11 companion modules.`
                                : `${expandedSystem.abbr} vận hành trong phân hệ ${expandedTech.ecosystemLabel}, liên thông dữ liệu thời gian thực với 11 phân hệ còn lại qua Enterprise Service Bus.`}
                            </p>
                          </div>
                        </div>

                        <div className="w-full flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subcard)]/70">
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playTechChimeExpand();
                              setIsEcosystemDiagramOpen(true);
                            }}
                            className="sys-bento-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-caption font-bold text-white shadow-sm cursor-pointer hover:brightness-110"
                            style={{ background: expandedMeta.gradient }}
                          >
                            <WebIcon name="git-merge" className="w-3.5 h-3.5 text-white" />
                            <span>
                              {isEn ? 'Open Full Diagram' : 'Xem sơ đồ toàn hệ thống'}
                            </span>
                          </button>

                          {expandedSystem.url && (
                            <button
                              type="button"
                              onClick={(e) => handleOpenExternalUrl(e, expandedSystem.url)}
                              className="sys-bento-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-caption font-bold border border-[var(--border-subcard)] bg-[var(--bg-card)]/85 text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card)]"
                            >
                              <span>{isEn ? 'Launch Website' : 'Truy cập Website'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>

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
