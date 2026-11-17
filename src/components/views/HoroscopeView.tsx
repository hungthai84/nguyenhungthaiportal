'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  Sparkles,
  User,
  Star,
  Calendar,
  Moon,
  Clock,
  ShieldCheck,
  Hash,
  Briefcase,
  Target,
  Layers,
  Award,
  Users,
  Search,
  Check,
  CheckCircle2,
  Settings,
  Droplet,
  Sprout,
  Flame,
  Landmark,
  AlertTriangle,
  Play,
  Pause,
  Headphones,
  Cpu,
  RotateCw,
} from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';
import { stopActiveSpeech } from '@/utils/speechVoice';

const HOROSCOPE_AVATAR_IMAGE_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794233300/T%E1%BB%AD_vi_avata.png';
const HOROSCOPE_COMMENTARY_MP3_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794233344/Postcard_t%E1%BB%AD_vi.mp3';

export interface HoroscopeViewProps {
  currentTheme?: string;
}

export const HOROSCOPE_SLIDES = [
  { idx: 0, label: '01. Hồ sơ tử vi', shortLabel: 'Hồ sơ tử vi', rawTitle: 'Hồ sơ tử vi' },
  { idx: 1, label: '02. Phong Cách Quản Trị', shortLabel: 'Phong Cách Quản Trị', rawTitle: 'Phong Cách Quản Trị' },
  { idx: 2, label: '03. Chân dung công việc', shortLabel: 'Chân dung công việc', rawTitle: 'Chân dung công việc' },
  { idx: 3, label: '04. Kỹ Năng Ngũ Hành', shortLabel: 'Kỹ Năng Ngũ Hành', rawTitle: 'Kỹ Năng Ngũ Hành' },
  { idx: 4, label: '05. Triết Lý Lãnh Đạo', shortLabel: 'Triết Lý Lãnh Đạo', rawTitle: 'Triết Lý Lãnh Đạo' },
  { idx: 5, label: '06. Kiểm tra công việc', shortLabel: 'Kiểm tra công việc', rawTitle: 'Kiểm tra công việc' },
];

export interface CompassLuckyDirection {
  direction: string;
  degree: number;
  starName: string;
  element: string;
  elementBadge: string;
  meaning: string;
  accent: string;
  badgeBg: string;
}

export const COMPASS_LUCKY_DIRECTIONS: CompassLuckyDirection[] = [
  {
    direction: 'Tây Bắc',
    degree: 315,
    starName: 'Sinh Khí',
    element: 'Kim',
    elementBadge: 'Đại Cát',
    meaning: 'Tài lộc hanh thông · Sự nghiệp thăng hoa · Vạn sự như ý',
    accent: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    direction: 'Tây Nam',
    degree: 225,
    starName: 'Thiên Y',
    element: 'Thổ',
    elementBadge: 'Thượng Cát',
    meaning: 'Quý nhân phù trợ · Sức khỏe khang an · Tâm trí an định',
    accent: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    direction: 'Đông Bắc',
    degree: 45,
    starName: 'Diên Niên',
    element: 'Thổ',
    elementBadge: 'Thượng Cát',
    meaning: 'Hòa khí sinh tài · Đội ngũ gắn kết · Quan hệ bền chặt',
    accent: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    direction: 'Tây',
    degree: 270,
    starName: 'Phục Vị',
    element: 'Kim',
    elementBadge: 'Trung Cát',
    meaning: 'Củng cố nội lực · Bản lĩnh kiên định · Vững vàng trước biến cố',
    accent: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
];

export interface DepartmentSynergy {
  id: string;
  name: string;
  shortName: string;
  element: string;
  elementSymbol: string;
  matchScore: number;
  matchGrade: string;
  relationType: string;
  relationDesc: string;
  iconName: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeBg: string;
  leadershipSynergy: string;
  pros: string;
  cons: string;
  strategy: string;
  kpis: string[];
}

export const DEPARTMENT_FENGSHUI_MATRIX: DepartmentSynergy[] = [
  {
    id: 'cskh',
    name: 'Chăm Sóc Khách Hàng & Trải Nghiệm (CSKH & CX)',
    shortName: 'CSKH & Trải Nghiệm CX',
    element: 'Hành Mộc & Thủy (Nuôi dưỡng & Thấu cảm)',
    elementSymbol: '木 / 水',
    matchScore: 92,
    matchGrade: 'Xuất Sắc · Hòa Hợp Tâm Thức',
    relationType: 'Thủy dưỡng tâm · Kim rèn chuẩn mực',
    relationDesc:
      'Sử dụng sự thấu cảm (Thủy) làm mềm lòng khách hàng và kỷ luật (Kim) uốn nắn chuẩn mực dịch vụ hoàn hảo.',
    iconName: 'headset',
    accentColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-300/80 dark:border-purple-600/40',
    bgGradient: 'from-purple-500/15 via-indigo-500/10 to-transparent',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    leadershipSynergy:
      'Trọng tâm sự nghiệp 22+ năm của anh Thái. Lãnh đạo bằng sự lắng nghe đa chiều, thấu hiểu áp lực nhân viên tuyến đầu và trao quyền xử lý sự cố ngay tại điểm chạm đầu tiên (First Contact Resolution).',
    pros: 'Nhân viên gắn kết cao, tỷ lệ nghỉ việc thấp (Low Agent Turnover < 4%), dịch vụ đồng nhất đa kênh và chỉ số CSAT/NPS luôn duy trì trên 95%.',
    cons: 'Cần tránh việc nhân sự bị quá tải cảm xúc khi xử lý khách hàng khó tính kéo dài; cần phân bổ thời gian nghỉ ngơi hợp lý.',
    strategy:
      'Chuẩn hóa kịch bản đa kênh (Omnichannel SOP), tổ chức huấn luyện tâm lý tiếp xúc định kỳ và áp dụng cơ chế khen thưởng nóng cho các ca xử lý xuất sắc.',
    kpis: ['CSAT ≥ 96%', 'NPS ≥ 75', 'FCR ≥ 88%', 'Attrition < 4%'],
  },
  {
    id: 'tech',
    name: 'Kỹ Thuật & Công Nghệ (IT / System / AI)',
    shortName: 'Kỹ Thuật & Công Nghệ',
    element: 'Hành Thủy & Kim (Logic & Dữ liệu)',
    elementSymbol: '水 / 金',
    matchScore: 96,
    matchGrade: 'Tuyệt Đỉnh · Kim Sinh Thủy Hoàn Hảo',
    relationType: 'Kim sinh Thủy tương sinh đại cát',
    relationDesc:
      'Bản mệnh Kim sinh Thủy tạo dòng chảy công nghệ thông suốt. Anh Thái nói chung ngôn ngữ logic, định lượng và kiến trúc dữ liệu với khối Tech.',
    iconName: 'cpu',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-300/80 dark:border-cyan-600/40',
    bgGradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    leadershipSynergy:
      'Chuyển hóa xuất sắc các bài toán vận hành phức tạp thành Product Backlog và User Stories chi tiết, giúp đội ngũ Kỹ thuật xây dựng các giải pháp CRM, AI Bot và Omnichannel đúng trúng nhu cầu.',
    pros: 'Hệ thống Contact Center và Helpdesk vận hành mượt mà, tự động hóa cao, giảm thiểu lỗi kỹ thuật và bảo đảm thời gian hoạt động 99.9% uptime.',
    cons: 'Đòi hỏi dữ liệu đầu vào cực kỳ chuẩn mực; có thể phát sinh tranh luận kỹ thuật sâu nếu thiếu khung kiểm thử chấp nhận (UAT criteria) rõ ràng.',
    strategy:
      'Triển khai mô hình Agile Sprint 2 tuần; phân quyền tích hợp API linh hoạt và duy trì cơ chế đánh giá định kỳ giữa đội Tech và đội Vận hành dịch vụ.',
    kpis: ['Uptime 99.9%', 'API Latency < 120ms', 'Bug Resolution < 2h', 'Automation 40%+'],
  },
  {
    id: 'ops',
    name: 'Vận Hành & Đảm Bảo Chất Lượng (Operations / QA)',
    shortName: 'Vận Hành & QA Chuẩn Hóa',
    element: 'Hành Thổ & Kim (Vững chãi & Kỷ luật)',
    elementSymbol: '土 / 金',
    matchScore: 94,
    matchGrade: 'Mẫu Mực · Thổ Sinh Kim Bền Vững',
    relationType: 'Thổ dưỡng Kim vững như bàn thạch',
    relationDesc:
      'Nền tảng Thổ vững chắc bồi đắp cho kỷ luật Kim, tạo hệ thống vận hành có tính lặp lại cao, chuẩn COPC/ISO và kiểm soát rủi ro triệt để.',
    iconName: 'settings',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-300/80 dark:border-emerald-600/40',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    leadershipSynergy:
      'Phối hợp nhịp nhàng theo các chuẩn quản trị COPC, ISO và Six Sigma. Anh Thái truyền cảm hứng bằng nguyên tắc đo lường minh bạch, quản trị dựa trên dữ liệu thực chứng và triết lý Kaizen cải tiến liên tục.',
    pros: 'Hệ thống vận hành chính xác như đồng hồ Thụy Sĩ, định mức năng suất (AHT/CPH) được kiểm soát chặt chẽ, chi phí phục vụ (Cost-to-Serve) giảm thiểu đáng kể.',
    cons: 'Cần tránh rập khuôn máy móc theo quy trình giấy tờ khi xử lý các tình huống khiếu nại phát sinh ngoại lệ chưa từng có tiền lệ.',
    strategy:
      'Áp dụng bộ tiêu chí chấm điểm chất lượng cuộc gọi (QA Scorecard) đa chiều, khuyến khích sáng kiến tinh gọn quy trình từ nhân viên và số hóa 100% báo cáo.',
    kpis: ['QA Score ≥ 95%', 'SLA Compliance ≥ 98%', 'Cost-to-Serve -18%', 'FCR ≥ 88%'],
  },
  {
    id: 'sales',
    name: 'Kinh Doanh & Phát Triển (Sales & BizDev)',
    shortName: 'Kinh Doanh & Bán Hàng',
    element: 'Hành Hỏa & Kim (Nhiệt huyết & Mục tiêu)',
    elementSymbol: '火 / 金',
    matchScore: 88,
    matchGrade: 'Mạnh Mẽ · Hỏa Luyện Kim Thành Khí',
    relationType: 'Lửa thử vàng · Áp lực tạo kim cương',
    relationDesc:
      'Năng lượng Hỏa nhiệt huyết của khối Sales được định hướng bởi kỷ luật Kim, biến các mục tiêu doanh thu thách thức thành kết quả bền vững.',
    iconName: 'briefcase',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-300/80 dark:border-amber-600/40',
    bgGradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    leadershipSynergy:
      'Anh Thái đóng vai trò là "hậu phương vững chắc" cho Sales: biến lời hứa bán hàng thành trải nghiệm dịch vụ thực tế xuất sắc, kích thích khách hàng mua lại và giới thiệu khách hàng mới.',
    pros: 'Nâng tỷ lệ giữ chân khách hàng (Customer Retention) lên mức kỷ lục, biến khách hàng thành đại sứ thương hiệu và giảm áp lực chi phí tìm khách mới (CAC).',
    cons: 'Có thể phát sinh xung đột giữa tốc độ chốt hợp đồng nhanh của Sales và tiêu chuẩn thẩm định dịch vụ nghiêm ngặt của bộ phận vận hành.',
    strategy:
      'Tổ chức giao ban tuần định kỳ giữa Sales và CSKH, gắn KPI hoa hồng với tỷ lệ duy trì dịch vụ sau bán và chuẩn hóa cam kết SLA trước khi ký kết hợp đồng.',
    kpis: ['Retention Rate ≥ 92%', 'Repeat Order +25%', 'CAC Recovery < 3m', 'Promoters 70%+'],
  },
];

export const HoroscopeView: React.FC<HoroscopeViewProps> = () => {
  const { showToast } = useToast();
  const { language } = useLanguage();

  // Horoscope Full Card 100% Transparent Style applied across all 6 cards
  const horoscopeFullCardTransparentStyle: React.CSSProperties = {
    background: 'transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none',
    border: 'none',
    outline: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    height: '100%',
    maxHeight: '100%',
    minHeight: '100%',
    flex: '1 1 auto',
    alignSelf: 'stretch',
    margin: '0px',
    padding: '0px',
    boxSizing: 'border-box',
  };

  const transparentLogoStyle: React.CSSProperties = {
    background: 'transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none',
    border: 'none',
    padding: '0px',
  };

  const transparentGridContainerStyle: React.CSSProperties = {
    background: 'transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none',
    border: 'none',
    outline: 'none',
    padding: '0px',
  };

  const subCardPaddingStyle: React.CSSProperties = {
    padding: '15px',
  };

  const transparentSubCardStyle: React.CSSProperties = {
    background: 'transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none',
    border: 'none',
    outline: 'none',
    padding: '15px',
  };

  // Active Card State: 0..5 (6 distinct cards) & Slide Direction
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

  // Horoscope Commentary MP3 Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State for Card 6: Kiểm Tra Công Việc (12 Con Giáp Lookup)
  const [selectedZodiacId, setSelectedZodiacId] = useState<string>('than');
  const [searchYearInput, setSearchYearInput] = useState<string>('1992');

  // State for Micro Compass Rotator in Card 1
  const [compassLuckyIdx, setCompassLuckyIdx] = useState<number>(0);
  const [isCompassSpinning, setIsCompassSpinning] = useState<boolean>(false);

  const spinCompass = useCallback(() => {
    SoundEngine.playTap();
    setIsCompassSpinning(true);
    setCompassLuckyIdx((prev) => (prev + 1) % COMPASS_LUCKY_DIRECTIONS.length);
    setTimeout(() => {
      setIsCompassSpinning(false);
    }, 600);
  }, []);

  const activeLuckyDirection = COMPASS_LUCKY_DIRECTIONS[compassLuckyIdx] || COMPASS_LUCKY_DIRECTIONS[0];

  const stopHoroscopeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
  }, []);

  const toggleAudio = useCallback(() => {
    SoundEngine.playTap();
    if (isAudioPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsAudioPlaying(false);
      showToast(language === 'en' ? 'Horoscope commentary paused' : 'Đã tắt luận giải lá số tử vi');
      return;
    }

    stopActiveSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (!audioRef.current) {
      const audio = new Audio(HOROSCOPE_COMMENTARY_MP3_URL);
      audio.preload = 'auto';
      audio.onended = () => {
        setIsAudioPlaying(false);
      };
      audio.onerror = () => {
        setIsAudioPlaying(false);
        showToast(language === 'en' ? 'Unable to load audio file' : 'Không thể tải tệp âm thanh luận giải');
      };
      audioRef.current = audio;
    }

    audioRef.current
      .play()
      .then(() => {
        setIsAudioPlaying(true);
        showToast(
          language === 'en'
            ? 'Playing career horoscope commentary 🔊'
            : 'Đang phát luận giải tử vi trong công việc 🔊'
        );
      })
      .catch(() => {
        setIsAudioPlaying(false);
        showToast(language === 'en' ? 'Unable to play audio' : 'Không thể phát âm thanh luận giải');
      });
  }, [isAudioPlaying, language, showToast]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Sync active slide changes with parent App.tsx
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 10, slide: activeCardIndex },
      })
    );
  }, [activeCardIndex]);

  // Listen to external slide change events from App.tsx (e.g. footer navigation)
  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.tabIndex === 10 && typeof detail.slide === 'number') {
        if (detail.slide >= 0 && detail.slide < 6 && detail.slide !== activeCardIndex) {
          setSlideDirection(detail.slide > activeCardIndex ? 'next' : 'prev');
          setActiveCardIndex(detail.slide);
        }
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [activeCardIndex]);

  void stopHoroscopeAudio;

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  const handlePrevHoroscopeCard = useCallback(() => {
    SoundEngine.playTap();
    setSlideDirection('prev');
    setActiveCardIndex((prev) => (prev - 1 + 6) % 6);
  }, []);

  const handleNextHoroscopeCard = useCallback(() => {
    SoundEngine.playTap();
    setSlideDirection('next');
    setActiveCardIndex((prev) => (prev + 1) % 6);
  }, []);

  // Keyboard navigation Left/Right through 6 cards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevHoroscopeCard();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextHoroscopeCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDropdownOpen, handlePrevHoroscopeCard, handleNextHoroscopeCard]);

  // =========================================================================
  // DATA SETS FROM ATTACHED CODE
  // =========================================================================

  const WORK_PERSONALITY_TRAITS = [
    {
      id: 'strategic',
      title: 'Tư Duy Chiến Lược & Viễn Kiến',
      subtitle: 'Nhóm Tam Hợp Thân - Tý - Thìn',
      tag: 'Tầm Nhìn Dài Hạn',
      description:
        'Sở hữu khả năng nhìn xa trông rộng, luôn đặt mục tiêu sự nghiệp và thành tựu hệ thống lên hàng đầu. Trong công việc không thích làm theo lối mòn mà luôn tìm cách tái cấu trúc, tối ưu hóa quy trình để tạo ra giá trị bền vững.',
      highlights: ['Hoạch Định Lộ Trình 3-5 Năm', 'Tư Duy Hệ Thống Sắc Bén', 'Quyết Đoán Ở Thời Điểm Then Chốt'],
    },
    {
      id: 'depth',
      title: 'Nội Lực Sâu Sắc & Kín Kẽ',
      subtitle: 'Vàng Trong Đáy Biển',
      tag: 'Điềm Tĩnh & Bản Lĩnh',
      description:
        'Mang bản chất của kim loại quý ẩn sâu dưới lòng đại dương: không phô trương ồn ào nhưng nội lực cực kỳ thâm hậu. Càng trong môi trường áp lực cao hoặc khủng hoảng, sự điềm tĩnh và khả năng phân tích càng phát huy tối đa.',
      highlights: ['Chịu Áp Lực Cực Tốt', 'Giữ Bí Mật & Chữ Tín Cao', 'Không Bị Dao Động Bởi Đám Đông'],
    },
    {
      id: 'execution',
      title: 'Kỷ Luật Thép & Chuẩn Mực Cao',
      subtitle: 'Kim Tứ Cục',
      tag: 'Chính Xác & Minh Bạch',
      description:
        'Đề cao tính nguyên tắc, rõ ràng trong phân quyền và minh bạch trong đánh giá hiệu suất (KPI/OKR). Làm việc có đầu có đuôi, yêu cầu chất lượng đầu ra đạt độ tinh xảo cao nhất.',
      highlights: ['Quản Trị Bằng Dữ Liệu & Quy Chuẩn', 'Trách Nhiệm Đến Cùng', 'Tối Ưu Nguồn Lực Tinh Gọn'],
    },
    {
      id: 'diplomacy',
      title: 'Đắc Nhân Tâm & Thu Phục Hiền Tài',
      subtitle: 'Thiên Can Giáp Mộc • Thủy Hỏa Ký Tế',
      tag: 'Lãnh Đạo Truyền Cảm Hứng',
      description:
        'Biết cách lắng nghe, thấu hiểu tâm lý cộng sự và đối tác. Thay vì áp đặt quyền lực cứng nhắc, thường dùng lý lẽ thuyết phục và tạo không gian để nhân sự chủ động phát huy sở trường.',
      highlights: ['Giao Tiếp Khéo Léo, Sắc Sảo', 'Xây Dựng Đội Ngũ Trung Thành', 'Kết Nối Đối Tác Chiến Lược'],
    },
  ];

  const SIX_CORE_PALACES = [
    {
      id: 'menh',
      name: 'Cung Mệnh (Tý)',
      tag: 'Bản Mệnh Chi Lực',
      description:
        'Chủ về trí tuệ mưu lược, tư duy nhạy bén và tính cách điềm tĩnh, trọng chữ Tín. Khí chất điềm đạm, có tài quy tụ lòng người và năng lực điều hành tổng thể.',
      stars: ['Hải Trung Kim', 'Thiên Phủ', 'Hóa Khoa'],
      bullets: ['Tư duy chiến lược dài hạn', 'Chính trực & trọng danh dự', 'Điềm đạm trước áp lực lớn'],
    },
    {
      id: 'quan',
      name: 'Cung Quan Lộc (Thìn)',
      tag: 'Sự Nghiệp Vận Hành',
      description:
        'Sự nghiệp gắn liền với quản trị hệ thống, dịch vụ quy mô lớn, công nghệ và chuyển đổi số. Càng dấn thân phụng sự khách hàng càng tỏa sáng rực rỡ.',
      stars: ['Thái Âm', 'Văn Xương', 'Thiên Khôi'],
      bullets: ['Vận hành Contact Center 150+', 'Kiến trúc CRM & AI Bot', '22 năm cống hiến thực chiến'],
    },
    {
      id: 'tai',
      name: 'Cung Tài Bạch (Thân)',
      tag: 'Tài Lộc Thực Chiến',
      description:
        'Tài lộc cộng chắc từ năng lực điều hành thực chiến và tối ưu hóa chi phí vận hành (Cost-to-Serve), tạo ra giá trị thặng dư bền vững cho tổ chức.',
      stars: ['Thiên Đồng', 'Lộc Tồn', 'Hóa Lộc'],
      bullets: ['Tối ưu chi phí vận hành', 'Quản trị ngân sách minh bạch', 'Đầu tư giá trị bền vững'],
    },
    {
      id: 'thien_di',
      name: 'Cung Thiên Di (Ngọ)',
      tag: 'Ngoại Giao & Mở Rộng',
      description:
        'Ra ngoài có nhiều quý nhân tương trợ, thích ứng nhanh với môi trường đa văn hóa, tập đoàn đa quốc gia và các thị trường công nghệ chuyển biến liên tục.',
      stars: ['Thất Sát', 'Thiên Mã', 'Quý Nhân'],
      bullets: ['Hòa nhập tập đoàn lớn', 'Kết nối đối tác chiến lược', 'Linh hoạt ứng biến thời cuộc'],
    },
    {
      id: 'no_boc',
      name: 'Cung Nô Bộc (Tỵ)',
      tag: 'Đội Ngũ Nhân Sự',
      description:
        'Đội ngũ cấp dưới đoàn kết, tôn trọng kỷ luật và luôn được truyền cảm hứng qua phong cách lãnh đạo thấu cảm (Empathetic Leadership).',
      stars: ['Tả Phù', 'Hữu Bật', 'Thiên Đức'],
      bullets: ['Lãnh đạo truyền cảm hứng', 'Đào tạo đội ngũ kế thừa', 'Giữ chân nhân tài (Low Churn)'],
    },
    {
      id: 'phuc_duc',
      name: 'Cung Phúc Đức (Dần)',
      tag: 'Phúc Khí & Đạo Tâm',
      description:
        'Gốc rễ phúc đức vững bền, tâm niệm luôn đặt đạo đức nghề nghiệp và lòng nhân ái lên hàng đầu. Biến nguy thành an qua mọi giai đoạn thử thách.',
      stars: ['Thiên Phúc', 'Thiên Quan', 'Long Trì'],
      bullets: ['Tâm sáng – Vận thông', 'Bình diện trước biến động', 'Lan tỏa năng lượng tích cực'],
    },
  ];

  const FIVE_ELEMENTS_GOVERNANCE = [
    {
      hanzi: '金',
      palaceBadge: 'Cung Quan Lộc',
      icon: Settings,
      title: 'Kim • Quy Trình & Chuẩn Hóa',
      desc: 'Thiết lập khung chuẩn mực vận hành, đảm bảo kỷ luật và kiểm soát chất lượng bằng dữ liệu.',
      boxLabel: 'TRỌNG TÂM QUẢN TRỊ:',
      boxContent: 'SOP, KPI, SLA, Quality Assurance & Tuân Thủ',
      footer: 'Phong Cách: Kỷ Luật & Chính Trực',
      theme: {
        cardBg:
          'bg-gradient-to-br from-sky-50/95 via-blue-50/80 to-indigo-50/60 dark:from-sky-950/50 dark:via-slate-900/85 dark:to-blue-950/40',
        border: 'border-sky-200/80 dark:border-sky-500/35 hover:border-sky-400 dark:hover:border-sky-400/70',
        hanziColor: 'text-sky-600 dark:text-sky-400',
        badge: 'bg-white/90 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/50',
        iconColor: 'text-sky-600 dark:text-sky-300',
        labelColor: 'text-sky-600 dark:text-sky-400',
        bottomBar: 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500',
      },
    },
    {
      hanzi: '水',
      palaceBadge: 'Cung Thiên Di',
      icon: Droplet,
      title: 'Thủy • Công Nghệ & Tự Động',
      desc: 'Tận dụng CRM, AI và Omnichannel để tối ưu hóa quy trình, loại bỏ điểm nghẽn và nâng cao năng suất.',
      boxLabel: 'TRỌNG TÂM QUẢN TRỊ:',
      boxContent: 'CRM, AI Gen, Omnichannel, Data Analytics',
      footer: 'Phong Cách: Nhạy Bén Số & Tinh Gọn',
      theme: {
        cardBg:
          'bg-gradient-to-br from-cyan-50/95 via-teal-50/80 to-emerald-50/60 dark:from-cyan-950/50 dark:via-slate-900/85 dark:to-teal-950/40',
        border: 'border-cyan-200/80 dark:border-cyan-500/35 hover:border-cyan-400 dark:hover:border-cyan-400/70',
        hanziColor: 'text-teal-600 dark:text-cyan-400',
        badge: 'bg-white/90 dark:bg-cyan-950/80 text-teal-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-700/50',
        iconColor: 'text-teal-600 dark:text-cyan-300',
        labelColor: 'text-teal-600 dark:text-cyan-400',
        bottomBar: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500',
      },
    },
    {
      hanzi: '木',
      palaceBadge: 'Cung Nô Bộc',
      icon: Sprout,
      title: 'Mộc • Con Người & Phát Triển',
      desc: 'Lãnh đạo bằng sự thấu cảm, huấn luyện đội ngũ kế thừa và xây dựng văn hóa gắn kết bền chặt.',
      boxLabel: 'TRỌNG TÂM QUẢN TRỊ:',
      boxContent: 'Training, Coaching 1-on-1, Talent Succession',
      footer: 'Phong Cách: Thấu Cảm & Phát Triển',
      theme: {
        cardBg:
          'bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-lime-50/60 dark:from-emerald-950/50 dark:via-slate-900/85 dark:to-green-950/40',
        border: 'border-emerald-200/80 dark:border-emerald-500/35 hover:border-emerald-400 dark:hover:border-emerald-400/70',
        hanziColor: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-white/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-700/50',
        iconColor: 'text-emerald-600 dark:text-emerald-300',
        labelColor: 'text-emerald-600 dark:text-emerald-400',
        bottomBar: 'bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400',
      },
    },
    {
      hanzi: '火',
      palaceBadge: 'Cung Mệnh',
      icon: Flame,
      title: 'Hỏa • Trải Nghiệm Khách Hàng',
      desc: 'Lấy khách hàng làm trọng tâm, phản hồi nhanh chóng và chuyển hóa khiếu nại thành cơ hội gắn kết.',
      boxLabel: 'TRỌNG TÂM QUẢN TRỊ:',
      boxContent: 'CSAT, NPS, FCR, Customer Journey Mapping',
      footer: 'Phong Cách: Quyết Đoán & Tận Tâm',
      theme: {
        cardBg:
          'bg-gradient-to-br from-rose-50/95 via-pink-50/80 to-fuchsia-50/60 dark:from-rose-950/50 dark:via-slate-900/85 dark:to-pink-950/40',
        border: 'border-rose-200/80 dark:border-rose-500/35 hover:border-rose-400 dark:hover:border-rose-400/70',
        hanziColor: 'text-rose-500 dark:text-rose-400',
        badge: 'bg-white/90 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border-rose-200/80 dark:border-rose-700/50',
        iconColor: 'text-rose-600 dark:text-rose-300',
        labelColor: 'text-rose-600 dark:text-rose-400',
        bottomBar: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500',
      },
    },
    {
      hanzi: '土',
      palaceBadge: 'Tài Bạch • Phúc Đức',
      icon: Landmark,
      title: 'Thổ • Tài Chính & Nền Tảng',
      desc: 'Tối ưu chi phí phục vụ (Cost-to-Serve), quản trị rủi ro và giữ vững tính liên tục của hệ thống.',
      boxLabel: 'TRỌNG TÂM QUẢN TRỊ:',
      boxContent: 'Cost-to-Serve, BCP, Security & Risk Management',
      footer: 'Phong Cách: Điềm Tĩnh & Bền Vững',
      theme: {
        cardBg:
          'bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-yellow-50/60 dark:from-amber-950/50 dark:via-slate-900/85 dark:to-orange-950/40',
        border: 'border-amber-200/80 dark:border-amber-500/35 hover:border-amber-400 dark:hover:border-amber-400/70',
        hanziColor: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-white/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-700/50',
        iconColor: 'text-amber-600 dark:text-amber-300',
        labelColor: 'text-amber-600 dark:text-amber-400',
        bottomBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
      },
    },
    {
      hanzi: '合',
      palaceBadge: 'Ngũ Hành Toàn Diện',
      icon: Sparkles,
      title: 'Mô Hình Điều Hành Tích Hợp',
      desc: 'Quy trình (Kim) tạo chuẩn mực · Công nghệ (Thủy) tạo hiệu suất · Con người (Mộc) tạo nội lực · Trải nghiệm (Hỏa) tạo giá trị · Nền tảng (Thổ) tạo sự trường tồn.',
      boxLabel: 'TRIẾT LÝ CỐT LÕI:',
      boxContent: 'Thuận Tự Nhiên Để Quản Trị Bền Vững & Chuẩn Hóa Xuất Sắc',
      footer: 'Đồng Bộ 5 Trụ Cột Vận Hành',
      theme: {
        cardBg:
          'bg-gradient-to-br from-purple-50/95 via-indigo-50/80 to-violet-50/60 dark:from-purple-950/50 dark:via-slate-900/85 dark:to-indigo-950/40',
        border: 'border-purple-200/80 dark:border-purple-500/35 hover:border-purple-400 dark:hover:border-purple-400/70',
        hanziColor: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-white/90 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-700/50',
        iconColor: 'text-purple-600 dark:text-purple-300',
        labelColor: 'text-purple-600 dark:text-purple-400',
        bottomBar: 'bg-gradient-to-r from-sky-500 via-teal-500 to-purple-600',
      },
    },
  ];

  const ACTION_PHILOSOPHY_CARDS = [
    {
      title: 'Tư Duy Bằng Chiến Lược',
      icon: Target,
      desc: 'Xây dựng tầm nhìn dài hạn, định hình mô hình vận hành bền vững và dự báo chuẩn xác các xu thế chuyển dịch thị trường.',
    },
    {
      title: 'Dẫn Dắt Bằng Dữ Liệu',
      icon: Target,
      desc: 'Mọi quyết định, cải tiến và tối ưu hóa quy trình đều dựa trên số liệu thực chứng minh bạch, khách quan và khoa học.',
    },
    {
      title: 'Thấu Cảm Bằng Trái Tim',
      icon: Target,
      desc: 'Đặt trải nghiệm khách hàng và giá trị con người làm trọng tâm, lắng nghe đa chiều và thấu hiểu sâu sắc từng điểm chạm.',
    },
    {
      title: 'Lấy Chân Lý Làm Gốc',
      icon: Compass,
      desc: 'Mọi quyết sách đều dựa trên sự thật khách quan, dữ liệu minh bạch và giá trị đạo đức bền vững.',
    },
    {
      title: 'Lấy Hành Động Làm Đường',
      icon: Sparkles,
      desc: 'Không dừng lại ở lý thuyết suông; kiên trì thực thi, tối ưu từng quy trình và từng điểm chạm mỗi ngày.',
    },
    {
      title: 'Lấy Kết Quả Làm Thước Đo',
      icon: Award,
      desc: 'Đo lường thành công bằng sự hài lòng của khách hàng (CSAT), hiệu quả chi phí (Cost-to-Serve) và sự trưởng thành của đội ngũ.',
    },
  ];

  const ZODIAC_WORK_MATCHES = [
    {
      id: 'than',
      name: 'Tuổi Thân',
      yearDetail: '1992 • Nhâm Thân',
      nguHanh: 'Ngũ hành: Đồng hành Kim (Cộng hưởng, cùng tần số)',
      badge: 'Tam Hợp • Đổi Mới & Trí Tuệ',
      role: 'Vai trò: Công nghệ & Giải pháp thông minh',
      summary:
        'Thuộc bộ Tam Hợp (Thân – Tý – Thìn). Thân nổi bật với sự thông minh, tháo vát và thích ứng cực nhanh với công nghệ mới, là cộng sự đắc lực trong chuyển đổi số của Giáp Tý.',
      pros: 'Sự sáng tạo linh hoạt của Thân kết hợp với tư duy bài bản của Tý giúp biến ý tưởng công nghệ (CRM, AI) thành hệ thống vận hành thực tế.',
      cons: 'Thân thích sự mới mẻ nên đôi khi giảm hứng thú với các công việc duy trì sự ổn định đi lặp lại.',
      advice: 'Giao cho Thân phụ trách các dự án đổi mới, cải tiến mô hình; Tý hỗ trợ chuẩn hóa quy trình chuyển giao.',
    },
    {
      id: 'thin',
      name: 'Tuổi Thìn',
      yearDetail: '1988 • Mậu Thìn',
      nguHanh: 'Ngũ hành: Tam Hợp Thủy Cục (Đại cát, vượng sự nghiệp)',
      badge: 'Tam Hợp • Vĩ Mô & Uy Quyền',
      role: 'Vai trò: Hoạch định chiến lược & Mở rộng quy mô',
      summary:
        'Thìn và Tý nằm trong Tam Hợp Thủy cục tối cao. Sự uy quyền và tầm nhìn vĩ mô của Thìn bổ trợ tuyệt vời cho sự mưu lược của Tý.',
      pros: 'Tạo sức mạnh tổng lực trong việc hoạch định chiến lược dài hạn và điều hành các hệ thống quy mô lớn.',
      cons: 'Cả hai đều có cái tôi lớn trong tư duy, cần thống nhất mục tiêu chung để tránh tranh luận định hướng.',
      advice: 'Thìn đứng đầu các sáng kiến mở rộng thị trường, Tý kiểm soát vận hành cốt lõi.',
    },
    {
      id: 'suu',
      name: 'Tuổi Sửu',
      yearDetail: '1985 • Ất Sửu',
      nguHanh: 'Ngũ hành: Lục Hợp Quý Nhân (Bổ khuyết xuất sắc)',
      badge: 'Lục Hợp • Vững Chãi & Kỷ Luật',
      role: 'Vai trò: Tài chính, Kiểm toán & Vận hành',
      summary:
        'Tý – Sửu Lục Hợp tạo nên sự gắn kết vững bền. Sự cẩn trọng, bền bỉ của Sửu kết hợp cùng sự nhạy bén của Tý.',
      pros: 'Quản trị tài chính minh bạch, kiểm soát rủi ro cực tốt và tối ưu hóa chi phí (Cost-to-Serve).',
      cons: 'Sửu hơi thận trọng, có thể làm chậm tốc độ nếu Tý muốn bứt phá nhanh.',
      advice: 'Cặp đôi hoàn hảo cho ban điều hành kiểm soát chất lượng và tuân thủ SOP.',
    },
    {
      id: 'ngo',
      name: 'Tuổi Ngọ',
      yearDetail: '1990 • Canh Ngọ',
      nguHanh: 'Ngũ hành: Tương Xung (Thủy khắc Hỏa)',
      badge: 'Tương Xung • Tốc Độ & Linh Hoạt',
      role: 'Vai trò: Kinh doanh tuyến đầu & Đối ngoại',
      summary:
        'Tý – Ngọ xung khắc trực diện. Một bên trầm tĩnh chiến lược, một bên phóng khoáng tốc độ cao.',
      pros: 'Nếu phân định rạch ròi không gian làm việc, Ngọ mang lại nguồn năng lượng bùng nổ cho kinh doanh.',
      cons: 'Dễ xảy ra bất đồng quan điểm trong cách vận hành chi tiết.',
      advice: 'Tôn trọng thế mạnh của nhau, Ngọ đánh bắt thị trường, Tý hậu thuẫn hệ thống.',
    },
    {
      id: 'ty',
      name: 'Tuổi Tỵ',
      yearDetail: '1989 • Kỷ Tỵ',
      nguHanh: 'Ngũ hành: Tương Sinh (Kim - Hỏa/Thổ cân bằng)',
      badge: 'Bình Hòa • Uyển Chuyển & Khéo Léo',
      role: 'Vai trò: Ngoại giao & Đàm phán',
      summary:
        'Sự sắc sảo, uyển chuyển của tuổi Tỵ kết hợp ăn ý với sự điềm đạm của Giáp Tý trong các mối quan hệ đối ngoại.',
      pros: 'Giải quyết các vấn đề khủng hoảng và đàm phán hợp đồng lớn rất uyển chuyển.',
      cons: 'Cần sự minh bạch thông tin để duy trì lòng tin tuyệt đối.',
      advice: 'Phù hợp giao phó các công việc đòi hỏi sự khéo léo và quan hệ đối tác.',
    },
    {
      id: 'hoi',
      name: 'Tuổi Hợi',
      yearDetail: '1995 • Ất Hợi',
      nguHanh: 'Ngũ hành: Kim sinh Thủy (Tương sinh thuận lợi)',
      badge: 'Tương Sinh • Nhân Văn & Gắn Kết',
      role: 'Vai trò: Chăm sóc khách hàng & Nhân sự',
      summary: 'Hợi mang tính Thủy thuần hòa, rất hợp với nạp âm Hải Trung Kim của Giáp Tý.',
      pros: 'Xây dựng văn hóa đội ngũ gắn kết, thấu cảm và chăm sóc khách hàng xuất sắc (CSAT cao).',
      cons: 'Thiếu sự quyết đoán mạnh mẽ trong các quyết định cắt giảm nhân sự.',
      advice: 'Hợi phụ trách trải nghiệm con người và CSX, Tý định hướng chiến lược.',
    },
  ];

  const zodiacIconsList = [
    { id: 'ty', name: 'Tý', emoji: '🐀' },
    { id: 'suu', name: 'Sửu', emoji: '🐂' },
    { id: 'dan', name: 'Dần', emoji: '🐅' },
    { id: 'mao', name: 'Mão', emoji: '🐇' },
    { id: 'thin', name: 'Thìn', emoji: '🐉' },
    { id: 'ty_snake', name: 'Tỵ', emoji: '🐍' },
    { id: 'ngo', name: 'Ngọ', emoji: '🐎' },
    { id: 'mui', name: 'Mùi', emoji: '🐐' },
    { id: 'than', name: 'Thân', emoji: '🐒' },
    { id: 'dau', name: 'Dậu', emoji: '🐓' },
    { id: 'tuat', name: 'Tuất', emoji: '🐕' },
    { id: 'hoi', name: 'Hợi', emoji: '🐖' },
  ];

  const handleYearSearch = () => {
    const val = searchYearInput.trim();
    if (!val) return;
    SoundEngine.playTap();
    const found = ZODIAC_WORK_MATCHES.find((z) => z.yearDetail.includes(val));
    if (found) {
      setSelectedZodiacId(found.id);
      showToast(`Đã tìm thấy thông tin cho năm ${val}`);
    } else {
      const yearNum = parseInt(val, 10);
      if (!isNaN(yearNum)) {
        const order = ['than', 'dau', 'tuat', 'hoi', 'ty', 'suu', 'dan', 'mao', 'thin', 'ty_snake', 'ngo', 'mui'];
        const targetId = order[yearNum % 12];
        const match = ZODIAC_WORK_MATCHES.find((z) => z.id === targetId) || ZODIAC_WORK_MATCHES[0];
        setSelectedZodiacId(match.id);
        showToast(`Năm ${yearNum} quy đổi sang ${match.name}`);
      } else {
        showToast('Vui lòng nhập năm hợp lệ (VD: 1992)');
      }
    }
  };

  const currentMatch = useMemo(() => {
    return ZODIAC_WORK_MATCHES.find((z) => z.id === selectedZodiacId) || ZODIAC_WORK_MATCHES[0];
  }, [selectedZodiacId]);

  // =========================================================================
  // CARD 1: 1. HỒ SƠ TỬ VI
  // =========================================================================
  const renderCard1HoSoTuVi = () => (
    <div
      id="horoscope-card-profile"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full min-w-0 max-w-full min-h-full h-auto flex-1 shrink-0 self-stretch flex flex-col justify-start gap-[15px] p-0 m-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      {/* Banner trang Tử Vi - Đưa vào trong Thẻ 1: Hồ Sơ Tử Vi */}
      <motion.section
        id="horoscope-hero-banner"
        data-element-name="Banner card"
        data-element-type="banner-card"
        data-element-page="horoscope"
        data-section-card="true"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="banner-card hero-banner w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-visible relative shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30"
        style={{
          padding: '15px',
          width: '100%',
          maxWidth: '100%',
          borderRadius: '14px',
        }}
      >
        {/* Lớp nền hình ảnh và gradient phủ */}
        <div
          id="horoscope-hero-banner-bg"
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #0f172a 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            id="horoscope-hero-banner-img"
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591948/T%E1%BB%AD_vi.png"
            alt="Banner Bản đồ tử vi & Phong thủy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
        </div>

        {/* Vùng Tiêu Đề: Icon và Tiêu đề bên trái, Sub tiêu đề cùng hàng nằm bên phải */}
        <div
          id="horoscope-hero-banner-header"
          className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full"
        >
          <div className="flex items-center gap-2 min-w-0">
            <WebIcon
              name="compass"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
            />
            <h1
              id="horoscope-hero-banner-title"
              className="typo-h1 font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] truncate"
              style={{
                color: '#38bdf8',
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Bản đồ tử vi &amp; Phong thủy
            </h1>
          </div>

          <p
            id="horoscope-hero-banner-quote"
            className="font-handwriting font-italianno not-italic text-[20px] sm:text-[24px] lg:text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left sm:text-right sm:ml-auto whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis max-w-full sm:max-w-[65%]"
            style={{
              color: '#ffff18',
              fontFamily: "'Italianno', cursive, sans-serif",
              fontWeight: 700,
              fontStyle: 'normal',
            }}
          >
            &quot;Thuận theo tự nhiên để tâm an trí sáng ♡&quot;
          </p>
        </div>

        {/* Vùng Điều Khiển Dưới Banner: Bộ lọc danh mục chuyển 6 thẻ + Badges */}
        <div
          id="horoscope-hero-banner-controls"
          className="relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto"
          ref={filterMenuRef}
        >
          <div className="flex flex-wrap items-center gap-2 max-w-full min-w-0">
            {/* Dropdown Menu chuyển 6 thẻ phân tích Tử vi */}
            <div className="relative inline-block text-left max-w-full min-w-0">
              <button
                id="horoscope-filter-toggle-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setIsFilterDropdownOpen((prev) => !prev);
                }}
                className="banner-control-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer typo-button font-play active:scale-95 group max-w-full min-w-0"
                title="Bộ lọc"
                aria-label="Bộ lọc thẻ phân tích Bản đồ tử vi"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon
                  name="sliders"
                  className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:rotate-45 shrink-0"
                />
                <span className="shrink-0">Bộ lọc</span>
                <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono truncate max-w-[140px]">
                  {HOROSCOPE_SLIDES[activeCardIndex]?.label || HOROSCOPE_SLIDES[0].label}
                </span>
                <WebIcon
                  name="chevron-down"
                  className={cn(
                    'w-3.5 h-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 shrink-0',
                    isFilterDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    id="horoscope-filter-listbox"
                    data-element-type="card"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    className="banner-dropdown-menu dropdown-menu-enter absolute left-0 top-[calc(100%+8px)] w-72 max-w-[calc(100vw-3rem)] rounded-[14px] p-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-2.5 py-1 typo-label text-[var(--text-muted)] tracking-wider border-b border-[var(--border-subcard)] mb-1">
                      Bộ lọc thẻ phân tích
                    </div>
                    {HOROSCOPE_SLIDES.map((slide) => {
                      const isCurrent = activeCardIndex === slide.idx;
                      return (
                        <button
                          key={slide.idx}
                          type="button"
                          data-selected={isCurrent ? 'true' : 'false'}
                          onClick={() => {
                            SoundEngine.playPop();
                            setSlideDirection(slide.idx >= activeCardIndex ? 'next' : 'prev');
                            setActiveCardIndex(slide.idx);
                            setIsFilterDropdownOpen(false);
                            showToast(`Đã chuyển sang ${slide.label}`);
                          }}
                          className="theme-dropdown-option flex items-center justify-between w-full px-3 py-2 rounded-[14px] typo-nav font-play text-left transition-all cursor-pointer"
                        >
                          <span>{slide.label}</span>
                          {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Badges thông tin bản mệnh nhanh */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Giáp Tý 1984 · Hải Trung Kim
            </span>
            <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
              Đoài (Kim) · Kim Tứ Cục
            </span>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[var(--border-subcard)] min-w-0">
        <div className="card-header-sync flex items-center gap-2.5 text-left min-w-0">
          <Compass className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 animate-pulse shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-purple-600 dark:text-purple-400">
            1. Hồ Sơ Tử Vi
          </h3>
        </div>
        <span className="typo-badge px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shrink-0">
          Giáp Tý 1984
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch flex-1 w-full min-w-0">
        {/* Cột trái: Luận giải lá số tử vi */}
        <div data-subcard="true" style={subCardPaddingStyle} className="sub-card lg:col-span-4 w-full min-w-0 rounded-[14px] p-[15px] flex flex-col items-center justify-between text-center space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-200/40 dark:border-purple-800/40 w-full text-left min-w-0">
            <div className="subcard-header-sync flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <span className="w-2 h-4 bg-purple-600 rounded-full shrink-0" />
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <h4 className="typo-h4 subcard-title-synced text-purple-600 dark:text-purple-400 tracking-wide font-play" data-subcard-title="true">
                Luận giải lá số tử vi
              </h4>
            </div>
            <span className="typo-badge font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              1984
            </span>
          </div>

          <div className="relative my-2">
            {/* Vòng hào quang đứt nét xoay đồng bộ khi đang phát luận giải */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-1.5 rounded-full border-2 border-dashed border-amber-400/85 transition-opacity duration-500 animate-[spin_12s_linear_infinite] ${
                isAudioPlaying
                  ? 'opacity-100 [animation-play-state:running]'
                  : 'opacity-0 [animation-play-state:paused]'
              }`}
            />
            <div
              onClick={toggleAudio}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAudio();
                }
              }}
              role="button"
              tabIndex={0}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2.5 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-500 group relative bg-gradient-to-br ${
                isAudioPlaying
                  ? 'from-amber-300 via-amber-500 to-amber-600 ring-4 ring-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.65)]'
                  : 'from-amber-200 via-amber-400 to-amber-600 ring-2 ring-amber-300/40 hover:scale-105'
              }`}
              title="Phát / Tắt luận giải tử vi trong công việc"
            >
              <div className="w-full h-full rounded-full bg-slate-950 border-2 border-amber-300 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div
                  className={`w-full h-full rounded-full relative animate-[spin_10s_linear_infinite] will-change-transform ${
                    isAudioPlaying
                      ? '[animation-play-state:running]'
                      : '[animation-play-state:paused]'
                  }`}
                >
                  <img
                    src={HOROSCOPE_AVATAR_IMAGE_URL}
                    alt="Luận giải lá số tử vi"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/30 rounded-full flex items-center justify-center transition-opacity group-hover:bg-slate-950/45">
                  <div
                    className={`p-3 rounded-full text-white shadow-xl backdrop-blur-sm border border-white/50 transition-all ${
                      isAudioPlaying
                        ? 'bg-amber-500 scale-110 shadow-amber-500/50 ring-2 ring-white'
                        : 'bg-black/70 group-hover:scale-110'
                    }`}
                  >
                    {isAudioPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 h-3.5">
              {[30, 70, 100, 60, 90, 50, 80, 40].map((hVal, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isAudioPlaying ? 'bg-amber-500 animate-pulse' : 'bg-[var(--pillar-progress-track,rgba(148,163,184,0.35))]'
                  }`}
                  style={{ height: isAudioPlaying ? `${hVal}%` : '30%' }}
                />
              ))}
            </div>
            <p className="typo-body-sm font-semibold text-[var(--text-primary)]">
              {isAudioPlaying
                ? 'Đang phát luận giải tử vi trong công việc...'
                : 'Bấm vào để nghe luận giải tử vi trong công việc.'}
            </p>
          </div>
        </div>

        {/* Cột phải: Thông tin nhân thân chuẩn 22/06/1984 17:00 */}
        <div className="lg:col-span-8 w-full min-w-0 flex flex-col justify-between gap-[15px]">
          <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 flex-1 space-y-4 p-[15px] rounded-[14px] h-full flex flex-col justify-between">
            <div className="w-full flex flex-col gap-2 pb-3 border-b border-[var(--border-subcard)] min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                <div className="subcard-header-sync flex items-center gap-2 min-w-0 text-purple-600 dark:text-purple-400">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <h4 className="typo-h4 subcard-title-synced text-purple-600 dark:text-purple-400 tracking-wide font-play min-w-0 break-words" data-subcard-title="true">
                    Nguyễn Hùng Thái
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] w-full min-w-0">
              <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5">
                <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-400">
                  <Moon className="w-4 h-4 shrink-0" />
                  <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-purple-600 dark:text-purple-400 truncate m-0" data-subcard-title="true">
                    Ngày sinh dương lịch
                  </h5>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-[var(--text-primary)] break-words">22/06/1984 17:00 (17h)</div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Giáp Tý • Canh Ngọ • Quý Dậu)
                  </div>
                </div>
              </div>

              <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5">
                <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-400">
                  <Moon className="w-4 h-4 shrink-0" />
                  <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-purple-600 dark:text-purple-400 truncate m-0" data-subcard-title="true">
                    Ngày sinh âm lịch
                  </h5>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-[var(--text-primary)] break-words">24/05/1984</div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Năm Giáp Tý 1984)
                  </div>
                </div>
              </div>

              <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5">
                <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-amber-600 dark:text-amber-400 truncate m-0" data-subcard-title="true">
                    Giờ sinh can chi
                  </h5>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-[var(--text-primary)] break-words">Giờ Quý Dậu (17h - 19h)</div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Thiên Can: Quý, Địa Chi: Dậu)
                  </div>
                </div>
              </div>

              <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5">
                <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 truncate m-0" data-subcard-title="true">
                    Năm sinh nạp âm
                  </h5>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-emerald-700 dark:text-emerald-300 break-words">Hải Trung Kim</div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Vàng Ròng Đáy Biển Sâu)
                  </div>
                </div>
              </div>

              <div
                data-subcard="true"
                style={subCardPaddingStyle}
                role="button"
                tabIndex={0}
                onClick={spinCompass}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    spinCompass();
                  }
                }}
                title="Bấm để xoay la bàn bát quái (4 hướng cát khí: Tây Bắc, Tây Nam, Đông Bắc, Tây)"
                className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5 cursor-pointer hover:border-cyan-400/60 hover:shadow-sm transition-all group relative overflow-hidden select-none"
              >
                <div className="flex items-center justify-between gap-1.5 min-w-0">
                  <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-cyan-600 dark:text-cyan-400">
                    <span
                      className="inline-flex items-center justify-center shrink-0 transition-transform duration-700 ease-out"
                      style={{
                        transform: `rotate(${activeLuckyDirection.degree}deg)`,
                      }}
                    >
                      <Compass className={`w-4 h-4 transition-transform duration-500 ${isCompassSpinning ? 'animate-spin' : 'group-hover:rotate-45'}`} />
                    </span>
                    <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-cyan-600 dark:text-cyan-400 truncate m-0" data-subcard-title="true">
                      Cung mệnh la bàn
                    </h5>
                  </div>
                  <span className="typo-badge px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shrink-0 tabular-nums">
                    {activeLuckyDirection.degree}°
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-cyan-700 dark:text-cyan-300 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span>Đoài Kim (Hành Kim)</span>
                    <span className="text-[11px] opacity-75">· {activeLuckyDirection.direction} ({activeLuckyDirection.starName})</span>
                  </div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Tây Tứ Mệnh • Hướng {activeLuckyDirection.direction} - {activeLuckyDirection.elementBadge})
                  </div>
                </div>
              </div>

              <div data-subcard="true" style={subCardPaddingStyle} className="sub-card w-full min-w-0 p-[15px] rounded-[14px] flex flex-col justify-between gap-1.5">
                <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-rose-600 dark:text-rose-400">
                  <Hash className="w-4 h-4 shrink-0" />
                  <h5 className="typo-label subcard-title-synced font-play font-semibold tracking-wide text-rose-600 dark:text-rose-400 truncate m-0" data-subcard-title="true">
                    Cục vận hàm số
                  </h5>
                </div>
                <div className="min-w-0">
                  <div className="typo-h5 text-rose-700 dark:text-rose-300 break-words">Kim Tứ Cục (Số 4)</div>
                  <div className="typo-caption text-[var(--text-secondary)] break-words">
                    (Khởi Đại Vận Năm 4 Tuổi)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 2: 2. PHONG CÁCH QUẢN TRỊ
  // =========================================================================
  const renderCard2PhongCachQuanTri = () => (
    <div
      id="horoscope-card-management-style"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full max-w-full h-full min-h-full flex-1 flex flex-col justify-start gap-[15px] p-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subcard)]">
        <div className="card-header-sync flex items-center gap-2.5 text-left">
          <Briefcase style={transparentLogoStyle} className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-pulse shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-blue-600 dark:text-cyan-400">
            2. Phong Cách Quản Trị
          </h3>
        </div>
        <span className="typo-badge px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          4 Trụ Cột Quản Trị
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[15px] w-full min-w-0 flex-1 items-stretch">
        {WORK_PERSONALITY_TRAITS.map((trait, index) => {
          const palettes = [
            { bar: 'bg-sky-600', text: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/25' },
            { bar: 'bg-violet-600', text: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-500/25' },
            { bar: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
            { bar: 'bg-amber-600', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
          ];
          const p = palettes[index % 4];
          return (
            <div
              key={trait.id}
              data-subcard="true"
              style={transparentSubCardStyle}
              className="sub-card p-[15px] rounded-[14px] border border-[var(--border-subcard)] transition-all duration-300 flex flex-col justify-between space-y-3 bg-[var(--bg-subcard)]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)]">
                  <div className="subcard-header-sync flex items-center gap-2">
                    <span className={`w-1.5 h-4 ${p.bar} rounded-full shrink-0`} />
                    <h5 className={`typo-h5 subcard-title-synced ${p.text} font-play`} data-subcard-title="true">{trait.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border} typo-badge shrink-0`}>
                    {trait.tag}
                  </span>
                </div>
                <div className="typo-caption font-semibold text-[var(--text-secondary)]">{trait.subtitle}</div>
                <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                  {trait.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--border-subcard)] flex flex-wrap gap-1.5">
                {trait.highlights.map((h, hIdx) => (
                  <span key={hIdx} className="project-detail-chip px-2 py-0.5 rounded-full typo-badge flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // =========================================================================
  // CARD 3: 3. CHÂN DUNG CÔNG VIỆC
  // =========================================================================
  const renderCard3ChanDungCongViec = () => (
    <div
      id="horoscope-card-career-portrait"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full max-w-full h-full min-h-full flex-1 flex flex-col justify-start gap-[15px] p-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-emerald-200/50 dark:border-emerald-800/50">
        <div className="card-header-sync flex items-center gap-2.5 text-left">
          <Target style={transparentLogoStyle} className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-emerald-600 dark:text-emerald-400">
            3. Chân Dung Công Việc
          </h3>
        </div>
        <span className="typo-badge px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          Lục Cung &amp; Ngũ Hành Quản Trị
        </span>
      </div>

      <div className="flex flex-col gap-[15px] flex-1">
        <div className="subcard-header-sync flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-4 bg-emerald-600 dark:bg-emerald-400 rounded-full shrink-0" />
          <h4 className="typo-h4 subcard-title-synced text-emerald-600 dark:text-emerald-400 tracking-wider font-play" data-subcard-title="true">
            Lục Cung Trọng Yếu (Tam Hợp Thân – Tý – Thìn)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px]" style={transparentGridContainerStyle}>
          {SIX_CORE_PALACES.map((palace, index) => {
            const palettes = [
              {
                bar: 'bg-rose-600',
                text: 'text-rose-700 dark:text-rose-300',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/25 dark:border-rose-500/35',
              },
              {
                bar: 'bg-amber-600',
                text: 'text-amber-700 dark:text-amber-300',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/25 dark:border-amber-500/35',
              },
              {
                bar: 'bg-emerald-600',
                text: 'text-emerald-700 dark:text-emerald-300',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/25 dark:border-emerald-500/35',
              },
              {
                bar: 'bg-cyan-600',
                text: 'text-cyan-700 dark:text-cyan-300',
                bg: 'bg-cyan-500/10',
                border: 'border-cyan-500/25 dark:border-cyan-500/35',
              },
              {
                bar: 'bg-indigo-600',
                text: 'text-indigo-700 dark:text-indigo-300',
                bg: 'bg-indigo-500/10',
                border: 'border-indigo-500/25 dark:border-indigo-500/35',
              },
              {
                bar: 'bg-fuchsia-600',
                text: 'text-fuchsia-700 dark:text-fuchsia-300',
                bg: 'bg-fuchsia-500/10',
                border: 'border-fuchsia-500/25 dark:border-fuchsia-500/35',
              },
            ];
            const p = palettes[index % 6];
            return (
              <div
                key={palace.id}
                data-subcard="true"
                style={transparentSubCardStyle}
                className="sub-card p-[15px] rounded-[14px] flex flex-col justify-between space-y-3.5 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-2">
                      <span className={`w-1.5 h-5 ${p.bar} rounded-full shrink-0`} />
                      <Target className={`w-4 h-4 ${p.text} shrink-0`} />
                      <h5 className={`typo-h5 subcard-title-synced ${p.text} font-play`} data-subcard-title="true">{palace.name}</h5>
                    </div>
                    <span className={`typo-badge px-2.5 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border} shrink-0`}>
                      {palace.tag}
                    </span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                    {palace.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {palace.stars.map((star, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2.5 py-0.5 rounded-full typo-badge border ${
                          sIdx === 0
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                            : 'project-detail-chip'
                        }`}
                      >
                        ★ {star}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-2.5 border-t border-[var(--border-subcard)]">
                  {palace.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 typo-body-sm text-[var(--text-primary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 4: 4. KỸ NĂNG NGŨ HÀNH
  // =========================================================================
  const renderCard4KyNangNguHanh = () => (
    <div
      id="horoscope-card-five-elements"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full max-w-full h-full min-h-full flex-1 flex flex-col justify-start gap-[15px] p-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-200/50 dark:border-cyan-800/50">
        <div className="card-header-sync flex items-center gap-2.5 text-left">
          <Layers style={transparentLogoStyle} className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-pulse shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-cyan-600 dark:text-cyan-400">
            4. Kỹ Năng Ngũ Hành
          </h3>
        </div>
        <span className="typo-badge px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
          5 Hành &amp; Hợp Nhất
        </span>
      </div>

      <div className="flex flex-col gap-[15px] flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="subcard-header-sync flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <span className="w-1.5 h-4 bg-cyan-600 dark:bg-cyan-400 rounded-full shrink-0" />
            <h4 className="typo-h4 subcard-title-synced text-cyan-600 dark:text-cyan-400 tracking-wider font-play" data-subcard-title="true">
              Hệ Thống Quản Trị Đa Chiều (Kim - Thủy - Mộc - Hỏa - Thổ)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-[15px] items-stretch">
          {FIVE_ELEMENTS_GOVERNANCE.map((item, idx) => {
            const IconComp = item.icon;
            const spanClass = idx < 3 ? 'md:col-span-2' : 'md:col-span-3';
            return (
              <div
                key={idx}
                data-subcard="true"
                style={transparentSubCardStyle}
                className={`sub-card p-[15px] rounded-[14px] transition-all duration-300 flex flex-col justify-between space-y-4 ${spanClass}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`typo-h3 font-bold ${item.theme.hanziColor} leading-none select-none`}>
                      {item.hanzi}
                    </span>
                    <span className="project-detail-chip typo-badge px-2.5 py-0.5 rounded-full">
                      {item.palaceBadge}
                    </span>
                  </div>

                  <div className="subcard-header-sync flex items-center gap-2 pt-0.5">
                    <IconComp style={transparentLogoStyle} className={`w-4 h-4 ${item.theme.iconColor} shrink-0`} />
                    <h5 className={`typo-h5 subcard-title-synced ${item.theme.iconColor} tracking-tight font-play`} data-subcard-title="true">
                      {item.title}
                    </h5>
                  </div>

                  <p className="typo-body-sm text-[var(--text-primary)]">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="project-detail-chip p-3 rounded-[14px] space-y-1">
                    <div className={`typo-label tracking-wider ${item.theme.labelColor}`}>
                      {item.boxLabel}
                    </div>
                    <div className="typo-body-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {item.boxContent}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="project-detail-chip px-3 py-1.5 rounded-[14px] typo-caption font-semibold">
                      {item.footer}
                    </div>
                    <div className={`h-1 w-full rounded-full ${item.theme.bottomBar}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 5: 5. TRIẾT LÝ LÃNH ĐẠO
  // =========================================================================
  const renderCard5TrietLyLanhDao = () => (
    <div
      id="horoscope-card-leadership-philosophy"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full max-w-full h-full min-h-full flex-1 flex flex-col justify-start gap-[15px] p-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subcard)]">
        <div className="card-header-sync flex items-center gap-2.5 text-left">
          <Award style={transparentLogoStyle} className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-amber-600 dark:text-amber-400">
            5. Triết Lý Lãnh Đạo
          </h3>
        </div>
        <span className="typo-badge px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          6 Trụ Cột Triết Lý
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] flex-1 items-stretch">
        {ACTION_PHILOSOPHY_CARDS.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              data-subcard="true"
              style={transparentSubCardStyle}
              className="sub-card p-[15px] rounded-[14px] transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                <div style={transparentLogoStyle} className="w-10 h-10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="typo-h4 subcard-title-synced text-amber-600 dark:text-amber-400 leading-snug font-play" data-subcard-title="true">
                    {card.title}
                  </h4>
                  <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // =========================================================================
  // CARD 6: 6. KIỂM TRA CÔNG VIỆC
  // =========================================================================
  const renderCard6KiemTraCongViec = () => (
    <div
      id="horoscope-card-work-synergy-check"
      data-element-type="card"
      data-section-card="true"
      style={horoscopeFullCardTransparentStyle}
      className="bento-card glass-card w-full max-w-full h-full min-h-full flex-1 flex flex-col justify-start gap-[15px] p-0 rounded-[14px] bg-transparent border-0 shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-purple-200/50 dark:border-purple-800/50">
        <div className="card-header-sync flex items-center gap-2.5 text-left">
          <Users style={transparentLogoStyle} className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse shrink-0" />
          <h3 className="card-title-synced typo-h3 tracking-wide font-play text-purple-600 dark:text-purple-400">
            6. Kiểm Tra Công Việc
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="typo-badge px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            Tra Cứu 12 Con Giáp
          </span>
        </div>
      </div>

      {/* TRA CỨU 12 CON GIÁP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch flex-1">
          {/* CỘT TRÁI: TRA CỨU TUỔI LÀM VIỆC CHUNG */}
          <div data-subcard="true" style={transparentSubCardStyle} className="sub-card lg:col-span-6 p-[15px] rounded-[14px] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[var(--border-subcard)]">
                <h4 className="typo-h4 subcard-title-synced text-indigo-600 dark:text-purple-200 tracking-wider font-play" data-subcard-title="true">
                  Tra Cứu Tuổi Làm Việc Chung
                </h4>
                <span className="px-2.5 py-1 rounded-full typo-badge bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40">
                  Giáp Tý 1984 • Kim
                </span>
              </div>

              {/* Input Tra Cứu */}
              <div className="relative flex items-center pt-1">
                <input
                  type="text"
                  value={searchYearInput}
                  onChange={(e) => setSearchYearInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleYearSearch();
                  }}
                  placeholder="Nhập năm (VD: 1992)"
                  className="theme-input w-full pl-3.5 pr-24 py-2.5 rounded-[14px] typo-input font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleYearSearch}
                  style={{ background: 'var(--bg-button-primary)', color: '#FFFFFF' }}
                  className="absolute right-1 px-4 py-1.5 rounded-[14px] typo-button flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Tra Cứu</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div className="typo-label font-semibold text-[var(--text-secondary)]">Hoặc Chọn Nhanh 12 Con Giáp:</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {zodiacIconsList.map((z) => {
                    const matchObj = ZODIAC_WORK_MATCHES.find((item) => item.id === z.id) || ZODIAC_WORK_MATCHES[0];
                    const isSel = selectedZodiacId === z.id;
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setSelectedZodiacId(z.id);
                          setSearchYearInput(matchObj.yearDetail.split('•')[0].trim());
                        }}
                        style={{
                          borderRadius: '14px',
                          ...(isSel
                            ? { background: 'var(--bg-button-primary)', color: '#FFFFFF', borderColor: 'transparent' }
                            : { background: 'var(--bg-subcard)', color: 'var(--text-primary)', borderColor: 'var(--border-subcard)' }),
                        }}
                        className={`p-2.5 !rounded-[14px] border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSel ? 'shadow-md scale-105' : ''
                        }`}
                      >
                        <span className="typo-h5 leading-none">{z.emoji}</span>
                        <span className="typo-label font-bold">{z.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subcard)] typo-caption text-[var(--text-secondary)] italic text-center">
              Nhập vào một con giáp hoặc nhập năm sinh để phân tích chi tiết mức độ hòa hợp trong công việc.
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ ĐỐI CHIẾU */}
          <div data-subcard="true" style={transparentSubCardStyle} className="sub-card lg:col-span-6 p-[15px] rounded-[14px] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[var(--border-subcard)]">
                <div className="typo-h4 tracking-wider text-purple-600 dark:text-purple-300 font-play">
                  Kết Quả Đối Chiếu Với Giáp Tý 1984
                </div>
                <span className="px-3 py-1 rounded-full typo-badge bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-400/40">
                  Mệnh Kim
                </span>
              </div>

              {/* Header Con Giáp Được Chọn */}
              <div className="project-detail-chip flex items-start gap-3.5 p-3.5 rounded-[14px]">
                <div style={transparentLogoStyle} className="w-12 h-12 flex items-center justify-center text-purple-600 dark:text-purple-300 typo-h3 shrink-0">
                  {zodiacIconsList.find((z) => z.id === currentMatch.id)?.emoji || '🌟'}
                </div>
                <div className="space-y-1">
                  <div className="typo-h4 text-[var(--text-heading)] font-play">
                    {currentMatch.name} ({currentMatch.yearDetail})
                  </div>
                  <div className="typo-caption font-semibold text-indigo-600 dark:text-indigo-400">
                    {currentMatch.nguHanh}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full typo-badge bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {currentMatch.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full typo-badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                      {currentMatch.role}
                    </span>
                  </div>
                </div>
              </div>

              <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                {currentMatch.summary}
              </p>

              {/* Grid 2 Thẻ: Điểm mạnh & Điểm nghẽn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] pt-1">
                <div className="project-detail-chip p-3.5 rounded-[14px] space-y-2">
                  <div className="flex items-center gap-1.5 typo-h5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Điểm mạnh kết hợp</span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                    {currentMatch.pros}
                  </p>
                </div>

                <div className="project-detail-chip p-3.5 rounded-[14px] space-y-2">
                  <div className="flex items-center gap-1.5 typo-h5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Điểm nghẽn chú ý</span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                    {currentMatch.cons}
                  </p>
                </div>
              </div>

              {/* Gợi ý điều phối */}
              <div className="project-detail-chip p-3.5 rounded-[14px] space-y-1.5">
                <div className="flex items-center gap-1.5 typo-h5 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Gợi ý điều phối</span>
                </div>
                <p className="typo-body-sm text-[var(--text-primary)] text-justify">
                  {currentMatch.advice}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  // 6 Cards Mapping
  const HOROSCOPE_CARDS = [
    { id: 0, title: 'Hồ sơ tử vi', icon: 'compass', render: renderCard1HoSoTuVi },
    { id: 1, title: 'Phong Cách Quản Trị', icon: 'shield-check', render: renderCard2PhongCachQuanTri },
    { id: 2, title: 'Chân dung công việc', icon: 'briefcase', render: renderCard3ChanDungCongViec },
    { id: 3, title: 'Kỹ Năng Ngũ Hành', icon: 'sparkles', render: renderCard4KyNangNguHanh },
    { id: 4, title: 'Triết Lý Lãnh Đạo', icon: 'award', render: renderCard5TrietLyLanhDao },
    { id: 5, title: 'Kiểm tra công việc', icon: 'search', render: renderCard6KiemTraCongViec },
  ];

  return (
    <div
      id="horoscope-page-container"
      data-element-name="Trang Tử Vi & Phong Thủy"
      data-element-type="card"
      data-section-card="true"
      data-element-page="horoscope"
      onWheel={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('.overflow-x-auto')) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 18) {
          const now = Date.now();
          if (now - lastWheelTimeRef.current < 320) return;
          lastWheelTimeRef.current = now;
          if (e.deltaX > 0) {
            handleNextHoroscopeCard();
          } else {
            handlePrevHoroscopeCard();
          }
        }
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('.overflow-x-auto, button, input, select, textarea')) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touchStartRef.current) return;
        const diffX = touchStartRef.current.x - e.changedTouches[0].clientX;
        const diffY = touchStartRef.current.y - e.changedTouches[0].clientY;
        touchStartRef.current = null;
        if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
          if (diffX > 0) {
            handleNextHoroscopeCard();
          } else {
            handlePrevHoroscopeCard();
          }
        }
      }}
      className="group/horoscope main-card bento-card glass-card relative w-full min-w-0 h-full min-h-0 mx-auto flex flex-col justify-start p-[25px] gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px] box-border"
    >
      {/* Render thẻ được chọn trong 6 thẻ kèm hiệu ứng trượt ngang mượt mà */}
      <div className="w-full flex-1 min-h-0 flex flex-col overflow-x-clip">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCardIndex}
            initial={{ opacity: 0, x: slideDirection === 'next' ? 56 : -56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'next' ? -56 : 56 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 min-h-0 flex flex-col"
          >
            {HOROSCOPE_CARDS[activeCardIndex].render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nút LÙI TRANG (Chevron Left) hình tròn nổi ở cạnh trái kèm hiệu ứng cuộn ngang */}
      <button
        id="el-horoscope-button-prev"
        data-element-id="el-horoscope-button-prev"
        type="button"
        onClick={handlePrevHoroscopeCard}
        title={`Lùi thẻ (${((activeCardIndex - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length}: ${HOROSCOPE_SLIDES[(activeCardIndex - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length].label})`}
        aria-label="Lùi thẻ"
        className="nav-arrow-btn theme-prev-next-btn absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center opacity-90 sm:opacity-55 sm:group-hover/horoscope:opacity-100 hover:!opacity-100 sm:-translate-x-1 sm:group-hover/horoscope:translate-x-0 hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(56,189,248,0.35)] cursor-pointer group pointer-events-auto"
      >
        <WebIcon
          name="chevron-left"
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:scale-110"
        />
      </button>

      {/* Nút TỚI TRANG (Chevron Right) hình tròn nổi ở cạnh phải kèm hiệu ứng cuộn ngang */}
      <button
        id="el-horoscope-button-next"
        data-element-id="el-horoscope-button-next"
        type="button"
        onClick={handleNextHoroscopeCard}
        title={`Tới thẻ (${((activeCardIndex + 1) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length}: ${HOROSCOPE_SLIDES[(activeCardIndex + 1) % HOROSCOPE_CARDS.length].label})`}
        aria-label="Tới thẻ"
        className="nav-arrow-btn theme-prev-next-btn absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center opacity-90 sm:opacity-55 sm:group-hover/horoscope:opacity-100 hover:!opacity-100 sm:translate-x-1 sm:group-hover/horoscope:translate-x-0 hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(56,189,248,0.35)] cursor-pointer group pointer-events-auto"
      >
        <WebIcon
          name="chevron-right"
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110"
        />
      </button>

    </div>
  );
};