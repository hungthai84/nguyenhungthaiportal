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
} from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
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

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({ currentTheme = 'light-glass' }) => {
  const { showToast } = useToast();
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const { language } = useLanguage();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;
  const isDark = themeIsDark || currentTheme === 'dark-neon';

  // Subcard style aligned with active theme
  const subCardThemeStyle: React.CSSProperties = {
    ...cardSampleStyle,
    borderRadius: '14px',
    padding: '15px',
  };

  // Active Card State: 0..5 (6 distinct cards)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  // Horoscope Commentary MP3 Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State for Card 6: Kiểm Tra Công Việc
  const [selectedZodiacId, setSelectedZodiacId] = useState<string>('than');
  const [searchYearInput, setSearchYearInput] = useState<string>('1992');

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
        if (detail.slide >= 0 && detail.slide < 6) {
          setActiveCardIndex(detail.slide);
        }
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, []);

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
        SoundEngine.playTap();
        setActiveCardIndex((prev) => (prev - 1 + 6) % 6);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        SoundEngine.playTap();
        setActiveCardIndex((prev) => (prev + 1) % 6);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDropdownOpen]);

  // =========================================================================
  // DATA SETS FROM ATTACHED CODE
  // =========================================================================

  const WORK_PERSONALITY_TRAITS = [
    {
      id: 'strategic',
      title: 'Tư Duy Chiến Lược & Viễn Kiến',
      subtitle: 'Thân Cư Quan Lộc (Thìn) • Nhóm Tam Hợp Thân - Tý - Thìn',
      tag: 'Tầm Nhìn Dài Hạn',
      description:
        'Sở hữu khả năng nhìn xa trông rộng, luôn đặt mục tiêu sự nghiệp và thành tựu hệ thống lên hàng đầu. Trong công việc không thích làm theo lối mòn mà luôn tìm cách tái cấu trúc, tối ưu hóa quy trình để tạo ra giá trị bền vững.',
      highlights: ['Hoạch Định Lộ Trình 3-5 Năm', 'Tư Duy Hệ Thống Sắc Bén', 'Quyết Đoán Ở Thời Điểm Then Chốt'],
    },
    {
      id: 'depth',
      title: 'Nội Lực Sâu Sắc & Kín Kẽ',
      subtitle: 'Nạp Âm Hải Trung Kim • Vàng Trong Đáy Biển',
      tag: 'Điềm Tĩnh & Bản Lĩnh',
      description:
        'Mang bản chất của kim loại quý ẩn sâu dưới lòng đại dương: không phô trương ồn ào nhưng nội lực cực kỳ thâm hậu. Càng trong môi trường áp lực cao hoặc khủng hoảng, sự điềm tĩnh và khả năng phân tích càng phát huy tối đa.',
      highlights: ['Chịu Áp Lực Cực Tốt', 'Giữ Bí Mật & Chữ Tín Cao', 'Không Bị Dao Động Bởi Đám Đông'],
    },
    {
      id: 'execution',
      title: 'Kỷ Luật Thép & Chuẩn Mực Cao',
      subtitle: 'Cung Mệnh Quái Đoài Kim • Kim Tứ Cục',
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

  const quickYearTags = [
    { year: 1992, zodiacId: 'than', label: '1992 • Thân' },
    { year: 1988, zodiacId: 'thin', label: '1988 • Thìn' },
    { year: 1985, zodiacId: 'suu', label: '1985 • Sửu' },
    { year: 1990, zodiacId: 'ngo', label: '1990 • Ngọ' },
    { year: 1989, zodiacId: 'ty', label: '1989 • Tỵ' },
    { year: 1995, zodiacId: 'hoi', label: '1995 • Hợi' },
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-purple-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-purple-200/50 dark:border-purple-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Compass className="w-[18px] h-[18px] text-purple-600 dark:text-purple-400 animate-pulse shrink-0" />
          <h3 className="text-[17px] sm:text-[18px] font-black tracking-wide font-play text-purple-600 dark:text-purple-400">
            1. Hồ Sơ Tử Vi
          </h3>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
          Giáp Tý 1984
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Cột trái: Luận giải lá số tử vi */}
        <div className="lg:col-span-4 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-slate-900/5 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 border border-purple-200/60 dark:border-purple-800/50 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-200/40 dark:border-purple-800/40 w-full text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-purple-600 rounded-full shrink-0" />
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <h4 className="text-[15px] sm:text-[16px] font-bold text-purple-600 dark:text-purple-400 tracking-wide font-play">
                Luận giải lá số tử vi
              </h4>
            </div>
            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              1984
            </span>
          </div>

          <div className="relative my-2">
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
                  ? 'from-amber-300 via-amber-500 to-amber-600 ring-4 ring-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.65)] animate-pulse'
                  : 'from-amber-200 via-amber-400 to-amber-600 ring-2 ring-amber-300/40 hover:scale-105'
              }`}
              title="Phát / Tắt luận giải tử vi trong công việc"
            >
              <div className="w-full h-full rounded-full bg-slate-950 border-2 border-amber-300 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="w-full h-full rounded-full relative">
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
                    isAudioPlaying ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{ height: isAudioPlaying ? `${hVal}%` : '30%' }}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isAudioPlaying
                ? 'Đang phát luận giải tử vi trong công việc...'
                : 'Bấm vào để nghe luận giải tử vi trong công việc.'}
            </p>
          </div>
        </div>

        {/* Cột phải: Thông tin nhân thân chuẩn 22/06/1984 17:00 */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-purple-200/80 dark:border-purple-800/60 backdrop-blur-xl h-full flex flex-col justify-between">
            <div className="w-full flex flex-col gap-2 pb-3 border-b border-purple-200/40 dark:border-purple-800/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-400 tracking-wide font-play">
                    Nguyễn Hùng Thái (Jack Thai) — Nam Mạng
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-full text-[11px] font-bold shrink-0">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                  <span>Cung Mệnh: Tý • Thân Cư Quan Lộc (Thìn)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shrink-0">
                  Hải Trung Kim • Đoài Kim (Tây Tứ Mệnh) • Kim Tứ Cục
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Dương Lịch
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">22/06/1984 17:00 (17h)</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    (Giáp Tý • Canh Ngọ • Quý Dậu)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Âm Lịch
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">24/05/1984</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    (Năm Giáp Tý 1984)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Giờ Sinh Can Chi
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">Giờ Quý Dậu (17h - 19h)</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    (Thiên Can: Quý, Địa Chi: Dậu)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Năm Sinh (Nạp Âm)
                  </div>
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">Hải Trung Kim</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    (Vàng Ròng Đáy Biển Sâu)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-cyan-50/70 dark:bg-cyan-950/30 rounded-xl border border-cyan-200/50 dark:border-cyan-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Cung Mệnh Quái
                  </div>
                  <div className="text-xs font-black text-cyan-800 dark:text-cyan-300">Đoài Kim (Hành Kim)</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    (Tây Tứ Mệnh • Hướng Tây Bắc)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Cục Vận Hàm Số
                  </div>
                  <div className="text-xs font-black text-rose-700 dark:text-rose-300">Kim Tứ Cục (Số 4)</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-blue-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Briefcase className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-pulse shrink-0 drop-shadow-md" />
          <h3 className="text-base sm:text-lg font-black tracking-wide font-play text-blue-600 dark:text-cyan-400">
            2. Phong Cách Quản Trị
          </h3>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          4 Trụ Cột Quản Trị
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 flex-1 items-stretch">
        {WORK_PERSONALITY_TRAITS.map((trait, index) => {
          const palettes = [
            {
              bar: 'bg-sky-600',
              text: 'text-sky-700 dark:text-sky-300',
              bg: 'bg-sky-500/10',
              border: 'border-sky-500/25 dark:border-sky-500/35',
            },
            {
              bar: 'bg-violet-600',
              text: 'text-violet-700 dark:text-violet-300',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/25 dark:border-violet-500/35',
            },
            {
              bar: 'bg-emerald-600',
              text: 'text-emerald-700 dark:text-emerald-300',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/25 dark:border-emerald-500/35',
            },
            {
              bar: 'bg-amber-600',
              text: 'text-amber-700 dark:text-amber-300',
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/25 dark:border-amber-500/35',
            },
          ];
          const p = palettes[index % 4];
          return (
            <div
              key={trait.id}
              className={`p-5 rounded-2xl bg-white/90 dark:bg-slate-900/75 border ${p.border} hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3.5 backdrop-blur-md`}
            >
              <div className="space-y-2.5">
                <div className={`w-full flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b ${p.border}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-5 ${p.bar} rounded-full shrink-0`} />
                    <Sparkles className={`w-4 h-4 ${p.text} shrink-0`} />
                    <h4 className={`text-sm sm:text-[15px] font-black ${p.text} tracking-wide font-play`}>
                      {trait.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border} shrink-0`}>
                    {trait.tag}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{trait.subtitle}</div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 text-justify pt-1 leading-relaxed">
                  {trait.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap gap-2">
                {trait.highlights.map((h, hIdx) => (
                  <span
                    key={hIdx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-500/10 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-800/60"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-emerald-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-emerald-200/50 dark:border-emerald-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0 drop-shadow-md" />
          <h3 className="text-base sm:text-lg font-black tracking-wide font-play text-emerald-600 dark:text-emerald-400">
            3. Chân Dung Công Việc
          </h3>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          Lục Cung &amp; Ngũ Hành Quản Trị
        </span>
      </div>

      <div className="space-y-3.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-emerald-600 dark:bg-emerald-400 rounded-full shrink-0" />
          <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-play">
            Lục Cung Trọng Yếu (Tam Hợp Thân – Tý – Thìn)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className={`p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/75 border ${p.border} flex flex-col justify-between space-y-3.5 hover:shadow-md transition-all backdrop-blur-md`}
              >
                <div className="space-y-3">
                  <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-5 ${p.bar} rounded-full shrink-0`} />
                      <Target className={`w-4 h-4 ${p.text} shrink-0`} />
                      <h5 className={`font-black text-sm sm:text-[15px] ${p.text} font-play`}>{palace.name}</h5>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border} shrink-0`}>
                      {palace.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 text-justify leading-relaxed">
                    {palace.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {palace.stars.map((star, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          sIdx === 0
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                            : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-700/60'
                        }`}
                      >
                        ★ {star}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50">
                  {palace.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-cyan-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-200/50 dark:border-cyan-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-pulse shrink-0 drop-shadow-md" />
          <h3 className="text-base sm:text-lg font-black tracking-wide font-play text-cyan-600 dark:text-cyan-400">
            4. Kỹ Năng Ngũ Hành
          </h3>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
          5 Hành &amp; Hợp Nhất
        </span>
      </div>

      <div className="space-y-3.5 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-600 dark:bg-cyan-400 rounded-full shrink-0" />
            <h4 className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-play">
              Hệ Thống Quản Trị Đa Chiều (Kim - Thủy - Mộc - Hỏa - Thổ)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIVE_ELEMENTS_GOVERNANCE.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border ${item.theme.cardBg} ${item.theme.border} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 backdrop-blur-md`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-lg sm:text-xl font-black ${item.theme.hanziColor} leading-none select-none`}>
                      {item.hanzi}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${item.theme.badge}`}>
                      {item.palaceBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <IconComp className={`w-4 h-4 ${item.theme.iconColor} shrink-0`} />
                    <h5 className={`text-sm sm:text-[15px] font-black ${item.theme.iconColor} tracking-tight font-play`}>
                      {item.title}
                    </h5>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-950/60 border border-white/90 dark:border-slate-800/80 shadow-2xs space-y-1">
                    <div className={`text-[10px] font-black uppercase tracking-wider ${item.theme.labelColor}`}>
                      {item.boxLabel}
                    </div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                      {item.boxContent}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="px-3 py-1.5 rounded-lg bg-white/75 dark:bg-slate-950/50 border border-white/80 dark:border-slate-800/70 text-[11px] font-bold text-slate-700 dark:text-slate-300">
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-amber-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-amber-200/50 dark:border-amber-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 drop-shadow-md" />
          <h3 className="text-base sm:text-lg font-black tracking-wide font-play text-amber-600 dark:text-amber-400">
            5. Triết Lý Lãnh Đạo
          </h3>
        </div>
        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          6 Trụ Cột Triết Lý
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 items-stretch">
        {ACTION_PHILOSOPHY_CARDS.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-amber-200/70 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 backdrop-blur-md"
            >
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-[15px] font-black text-amber-600 dark:text-amber-400 leading-snug font-play">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
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
      style={subCardThemeStyle}
      className="w-full flex-1 flex flex-col justify-start gap-4 p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-purple-400/30 shadow-sm backdrop-blur-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-purple-200/50 dark:border-purple-800/50">
        <div className="flex items-center gap-2.5 text-left">
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse shrink-0 drop-shadow-md" />
          <h3 className="text-base sm:text-lg font-black tracking-wide font-play text-purple-600 dark:text-purple-400">
            6. Kiểm Tra Công Việc
          </h3>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
          Tra Cứu &amp; Đối Chế
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* CỘT TRÁI: TRA CỨU TUỔI LÀM VIỆC CHUNG */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50/50 dark:from-indigo-950/25 dark:via-purple-950/20 dark:to-slate-900/50 border border-indigo-200/70 dark:border-purple-800/40 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-indigo-200/50 dark:border-purple-800/40">
              <h4 className="text-xs sm:text-sm font-black text-indigo-900 dark:text-purple-200 uppercase tracking-wider font-play">
                Tra Cứu Tuổi Làm Việc Chung
              </h4>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-purple-700">
                Giáp Tý 1984 • Kim
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Năm Sinh Thường Gặp:</div>
              <div className="flex flex-wrap gap-2">
                {quickYearTags.map((tag) => (
                  <button
                    key={tag.year}
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedZodiacId(tag.zodiacId);
                      setSearchYearInput(tag.year.toString());
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedZodiacId === tag.zodiacId
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
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
                className="w-full pl-3.5 pr-24 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleYearSearch}
                className="absolute right-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tra Cứu</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Hoặc Chọn Nhanh 12 Con Giáp:</div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
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
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md scale-105'
                          : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                      }`}
                    >
                      <span className="text-base">{z.emoji}</span>
                      <span className="text-[11px] font-extrabold">{z.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-200/40 dark:border-purple-800/40 text-[11px] font-medium text-slate-500 dark:text-slate-400 italic text-center">
            Nhập vào một con giáp hoặc nhập năm sinh để phân tích chi tiết mức độ hòa hợp trong công việc.
          </div>
        </div>

        {/* CỘT PHẢI: KẾT QUẢ ĐỐI CHIẾU */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-indigo-50/50 to-blue-50/40 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-slate-900/60 border border-purple-200/80 dark:border-purple-800/60 flex flex-col justify-between space-y-4 shadow-sm backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-purple-200/50 dark:border-purple-800/50">
              <div className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 font-play">
                Kết Quả Đối Chiếu Với Giáp Tý 1984
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                Mệnh Kim
              </span>
            </div>

            {/* Header Con Giáp Được Chọn */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-purple-200/70 dark:border-purple-800/60 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md shrink-0">
                {zodiacIconsList.find((z) => z.id === currentMatch.id)?.emoji || '🌟'}
              </div>
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-play">
                  {currentMatch.name} ({currentMatch.yearDetail})
                </div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {currentMatch.nguHanh}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    {currentMatch.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                    {currentMatch.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
              {currentMatch.summary}
            </p>

            {/* Grid 2 Thẻ: Điểm mạnh & Điểm nghẽn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Điểm mạnh kết hợp</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  {currentMatch.pros}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Điểm nghẽn chú ý</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  {currentMatch.cons}
                </p>
              </div>
            </div>

            {/* Gợi ý điều phối */}
            <div className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-600 dark:text-purple-400 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Gợi ý điều phối</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
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

  void isDark;

  return (
    <div
      id="horoscope-page-container"
      data-element-name="Trang Tử Vi & Phong Thủy"
      data-element-type="card"
      data-section-card="true"
      data-element-page="horoscope"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card relative w-full h-full flex flex-col justify-start p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
    >
      {/* Banner trang Tử Vi - Chỉ hiển thị ở Card 1: Hồ Sơ Tử Vi */}
      {activeCardIndex === 0 && (
        <motion.section
          id="horoscope-hero-banner"
          data-element-name="Banner card"
          data-element-type="banner-card"
          data-element-page="horoscope"
          data-section-card="true"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
          style={{
            padding: '15px',
            width: '100%',
            maxWidth: '100%',
            height: '200px',
            minHeight: '200px',
            maxHeight: '200px',
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
            className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full"
          >
            <div className="flex items-center gap-2 min-w-0">
              <WebIcon
                name="compass"
                className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
                style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
              />
              <h1
                id="horoscope-hero-banner-title"
                className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] truncate"
                style={{
                  color: '#38bdf8',
                  fontSize: '22px',
                  fontWeight: 700,
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
              className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
              style={{
                color: '#ffff18',
                fontFamily: "'Italianno', cursive, sans-serif",
                fontSize: '28px',
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
            <div className="flex flex-wrap items-center gap-2">
              {/* Dropdown Menu chuyển 6 thẻ phân tích Tử vi */}
              <div className="relative inline-block text-left">
                <button
                  id="horoscope-filter-toggle-btn"
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsFilterDropdownOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
                  title="Chọn thẻ phân tích Bản đồ tử vi"
                  aria-expanded={isFilterDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon
                    name="sliders"
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:rotate-45 shrink-0"
                  />
                  <span>Thẻ phân tích</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/50 text-[10px] font-mono text-amber-900 dark:text-amber-200 font-bold truncate max-w-[140px]">
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
                      className="absolute left-0 top-[calc(100%+8px)] w-72 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-xl p-2 z-50 flex flex-col gap-1"
                    >
                      <div className="px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-white/10 mb-1">
                        Chọn thẻ tử vi &amp; quản trị
                      </div>
                      {HOROSCOPE_SLIDES.map((slide) => {
                        const isCurrent = activeCardIndex === slide.idx;
                        return (
                          <button
                            key={slide.idx}
                            type="button"
                            onClick={() => {
                              SoundEngine.playPop();
                              setActiveCardIndex(slide.idx);
                              setIsFilterDropdownOpen(false);
                              showToast(`Đã chuyển sang ${slide.label}`);
                            }}
                            className={cn(
                              'flex items-center justify-between w-full px-3 py-2 rounded-[10px] text-xs font-bold font-play text-left transition-all cursor-pointer',
                              isCurrent
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                          >
                            <span>{slide.label}</span>
                            {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 text-white" />}
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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold font-play shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Giáp Tý 1984 · Hải Trung Kim
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold font-play shadow-xs">
                Đoài (Kim) · Kim Tứ Cục
              </span>
            </div>
          </div>
        </motion.section>
      )}

      {/* Render thẻ được chọn trong 6 thẻ */}
      {HOROSCOPE_CARDS[activeCardIndex].render()}

      {/* Nút LÙI TRANG (Chevron Left) hình tròn nổi ở cạnh trái */}
      <button
        id="el-horoscope-button-prev"
        data-element-id="el-horoscope-button-prev"
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setActiveCardIndex((prev) => (prev - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length);
        }}
        title={`Lùi thẻ (${((activeCardIndex - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length}: ${HOROSCOPE_SLIDES[(activeCardIndex - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length].label})`}
        aria-label="Lùi thẻ"
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-lg"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-popup)',
          backdropFilter: 'blur(var(--bg-blur))',
          WebkitBackdropFilter: 'blur(var(--bg-blur))',
        }}
      >
        <WebIcon
          name="chevron-left"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
          style={{ color: 'var(--color-primary)' }}
        />
      </button>

      {/* Nút TỚI TRANG (Chevron Right) hình tròn nổi ở cạnh phải */}
      <button
        id="el-horoscope-button-next"
        data-element-id="el-horoscope-button-next"
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setActiveCardIndex((prev) => (prev + 1) % HOROSCOPE_CARDS.length);
        }}
        title={`Tới thẻ (${((activeCardIndex + 1) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length}: ${HOROSCOPE_SLIDES[(activeCardIndex + 1) % HOROSCOPE_CARDS.length].label})`}
        aria-label="Tới thẻ"
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-lg"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-popup)',
          backdropFilter: 'blur(var(--bg-blur))',
          WebkitBackdropFilter: 'blur(var(--bg-blur))',
        }}
      >
        <WebIcon
          name="chevron-right"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
          style={{ color: 'var(--color-primary)' }}
        />
      </button>

    </div>
  );
};