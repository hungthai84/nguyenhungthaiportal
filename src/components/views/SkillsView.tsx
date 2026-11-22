'use client';

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { WebIcon } from "@/components/ui/WebIcon";
import { cn } from "@/lib/utils";
import { SoundEngine } from "@/components/ui/SoundEngine";
import { BannerBackgroundVideo } from "@/components/common/BannerBackgroundVideo";
import { DriveAwareBannerMedia } from "@/components/common/DriveAwareBannerMedia";
import { useBannerVideo } from "@/context/BannerVideoContext";
import { 
  STRENGTHS_DATA, 
  WEAKNESSES_DATA, 
  OPPORTUNITIES_DATA, 
  THREATS_DATA, 
  LANGUAGES_DATA,
  SwotSkillItem,
} from "@/data/skills";

// Helper map to resolve icon components from strings
const getWebSkillIconName = (name: string): string => {
  const norm = (name || '').toLowerCase();
  if (norm === 'sparkles') return 'sparkles';
  if (norm === 'database') return 'database';
  if (norm === 'barchart3' || norm === 'barchart2') return 'chart';
  if (norm === 'users') return 'user-group';
  if (norm === 'workflow') return 'refresh';
  if (norm === 'shieldalert') return 'shield';
  if (norm === 'hearthandshake') return 'heart-handshake';
  if (norm === 'lightbulb') return 'lightbulb';
  if (norm === 'target') return 'target';
  if (norm === 'rocket') return 'rocket';
  if (norm === 'cpu') return 'cpu';
  if (norm === 'monitor') return 'monitor';
  if (norm === 'bot') return 'bot';
  if (norm === 'trendingup') return 'chart';
  if (norm === 'coins') return 'coins';
  if (norm === 'headphones' || norm === 'headset') return 'phone';
  if (norm === 'brain') return 'brain';
  if (norm === 'zap') return 'zap';
  if (norm === 'globe') return 'globe';
  if (norm === 'languages') return 'globe';
  if (norm === 'layers') return 'layers';
  if (norm === 'piechart') return 'chart';
  if (norm === 'shieldcheck') return 'shield';
  if (norm === 'layoutgrid') return 'grid';
  if (norm === 'compass') return 'compass';
  if (norm === 'crown') return 'award';
  if (norm === 'heart') return 'heart';
  if (norm === 'settings') return 'settings';
  if (norm === 'folderkanban') return 'briefcase';
  if (norm === 'code') return 'cpu';
  if (norm === 'scale') return 'shield';
  if (norm === 'kanban') return 'briefcase';
  if (norm === 'dollarsign') return 'coins';
  if (norm === 'network') return 'grid';
  if (norm === 'clipboard') return 'clipboard';
  if (norm === 'phone') return 'phone';
  return norm || 'sparkles';
};

// =========================================================================
// CORNER SWOT QUADRANT SECTOR SVG (CHÍNH XÁC THEO MÔ HÌNH SWOT THAM KHẢO)
// Tái hiện góc tư hình tròn gồm:
// - Vòng cung ngoài (outer concentric pastel ring)
// - Cung góc trong đặc màu (inner vibrant colored quadrant)
// - Chữ cái in hoa màu trắng (S, W, O, T)
// =========================================================================
interface SwotCornerQuadrantProps {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  letter: 'S' | 'W' | 'O' | 'T';
  innerColor: string;
  outerColor: string;
  onClick?: () => void;
  isActive?: boolean;
}

const SwotCornerQuadrant: React.FC<SwotCornerQuadrantProps> = ({
  position,
  letter,
  innerColor,
  outerColor,
}) => {
  // SVG size 130 x 130
  // R_inner = 92, R_outer = 126
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute w-20 h-20 sm:w-32 sm:h-32 z-20 select-none pointer-events-none",
        position === 'bottom-right' && "bottom-0 right-0",
        position === 'bottom-left' && "bottom-0 left-0",
        position === 'top-right' && "top-0 right-0",
        position === 'top-left' && "top-0 left-0"
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {position === 'bottom-right' && (
          // Cung góc dưới phải (cho thẻ STRENGTHS trên-trái)
          // Tâm vòng tròn đặt tại (100, 100)
          <g>
            {/* Vành ngoài màu nhạt */}
            <path
              d="M 0 100 A 100 100 0 0 1 100 0 L 100 24 A 76 76 0 0 0 24 100 Z"
              className="swot-corner-outer"
              fill={outerColor}
            />
            {/* Cung góc trong màu đậm */}
            <path
              d="M 28 100 A 72 72 0 0 1 100 28 L 100 100 Z"
              className="swot-corner-inner"
              fill={innerColor}
            />
            {/* Ký tự S */}
            <text
              x="70"
              y="74"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFFFFF"
              fontSize="30"
              fontWeight="900"
              fontFamily="var(--font-main), sans-serif"
            >
              {letter}
            </text>
          </g>
        )}

        {position === 'bottom-left' && (
          // Cung góc dưới trái (cho thẻ WEAKNESSES trên-phải)
          // Tâm vòng tròn đặt tại (0, 100)
          <g>
            {/* Vành ngoài màu nhạt */}
            <path
              d="M 0 0 A 100 100 0 0 1 100 100 L 76 100 A 76 76 0 0 0 0 24 Z"
              className="swot-corner-outer"
              fill={outerColor}
            />
            {/* Cung góc trong màu đậm */}
            <path
              d="M 0 28 A 72 72 0 0 1 72 100 L 0 100 Z"
              className="swot-corner-inner"
              fill={innerColor}
            />
            {/* Ký tự W */}
            <text
              x="30"
              y="74"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFFFFF"
              fontSize="28"
              fontWeight="900"
              fontFamily="var(--font-main), sans-serif"
            >
              {letter}
            </text>
          </g>
        )}

        {position === 'top-right' && (
          // Cung góc trên phải (cho thẻ OPPORTUNITIES dưới-trái)
          // Tâm vòng tròn đặt tại (100, 0)
          <g>
            {/* Vành ngoài màu nhạt */}
            <path
              d="M 100 100 A 100 100 0 0 1 0 0 L 24 0 A 76 76 0 0 0 100 76 Z"
              className="swot-corner-outer"
              fill={outerColor}
            />
            {/* Cung góc trong màu đậm */}
            <path
              d="M 100 72 A 72 72 0 0 1 28 0 L 100 0 Z"
              className="swot-corner-inner"
              fill={innerColor}
            />
            {/* Ký tự O */}
            <text
              x="70"
              y="30"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFFFFF"
              fontSize="30"
              fontWeight="900"
              fontFamily="var(--font-main), sans-serif"
            >
              {letter}
            </text>
          </g>
        )}

        {position === 'top-left' && (
          // Cung góc trên trái (cho thẻ THREATS dưới-phải)
          // Tâm vòng tròn đặt tại (0, 0)
          <g>
            {/* Vành ngoài màu nhạt */}
            <path
              d="M 100 0 A 100 100 0 0 1 0 100 L 0 76 A 76 76 0 0 0 76 0 Z"
              className="swot-corner-outer"
              fill={outerColor}
            />
            {/* Cung góc trong màu đậm */}
            <path
              d="M 72 0 A 72 72 0 0 1 0 72 L 0 0 Z"
              className="swot-corner-inner"
              fill={innerColor}
            />
            {/* Ký tự T */}
            <text
              x="30"
              y="30"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFFFFF"
              fontSize="30"
              fontWeight="900"
              fontFamily="var(--font-main), sans-serif"
            >
              {letter}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export interface SkillsViewProps {
  currentTheme?: any;
  embedded?: boolean;
}

export function Skills({ currentTheme, embedded = false }: SkillsViewProps = {}) {
  void currentTheme;
  const { language: lang, t } = useLanguage();
  const { bannerAssignments } = useBannerVideo();
  const driveSkillsBanner = bannerAssignments.skills;
  const isVi = lang === "vi";
  const [selectedSwot, setSelectedSwot] = useState<string | null>(null);
  const [expandedSkillIds, setExpandedSkillIds] = useState<Set<string>>(new Set());
  const [highlightedSkillId, setHighlightedSkillId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusSwotTarget = (skillId?: string) => {
    if (!skillId) return;
    setSelectedSwot(null);
    setExpandedSkillIds((prev) => {
      const next = new Set(prev);
      next.add(skillId);
      return next;
    });
    setHighlightedSkillId(skillId);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedSkillId((cur) => (cur === skillId ? null : cur));
    }, 3200);
    setTimeout(() => {
      const el = document.getElementById(`skill-item-${skillId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 140);
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('hungthai_focus_swot_skill');
      if (raw) {
        sessionStorage.removeItem('hungthai_focus_swot_skill');
        const parsed = JSON.parse(raw) as { skillId?: string };
        if (parsed?.skillId) {
          focusSwotTarget(parsed.skillId);
        }
      }
    } catch {
      // ignore storage errors
    }

    const handleFocusEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ skillId?: string }>).detail;
      if (detail?.skillId) {
        try {
          sessionStorage.removeItem('hungthai_focus_swot_skill');
        } catch {
          // ignore
        }
        focusSwotTarget(detail.skillId);
      }
    };
    window.addEventListener('app:focus-swot-skill', handleFocusEvent);
    return () => {
      window.removeEventListener('app:focus-swot-skill', handleFocusEvent);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const toggleSkillAccordion = (skillId: string) => {
    SoundEngine.playTap();
    setExpandedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Bộ lọc 14 màu chuẩn
  const swotFilterOptions = [
    { id: null, label: isVi ? "Tất cả kỹ năng" : "All Skills", badge: "#ALL", color: "text-[#1480C0]" },
    { id: "S", label: isVi ? "Thế mạnh cốt lõi" : "Core Strengths", badge: "#S", color: "text-[#1480C0]" },
    { id: "W", label: isVi ? "Khía cạnh hoàn thiện" : "Growth Areas", badge: "#W", color: "text-[#50B347]" },
    { id: "O", label: isVi ? "Cơ hội phát triển" : "Opportunities", badge: "#O", color: "text-[#EC7D21]" },
    { id: "T", label: isVi ? "Thách thức thích ứng" : "Threats & Risks", badge: "#T", color: "text-[#E64C72]" },
  ];

  // Cấu hình 4 thẻ SWOT
  const QUADRANTS: Array<{
    key: "S" | "W" | "O" | "T";
    id: string;
    elementName: string;
    icon: string;
    title: string;
    subVi: string;
    subEn: string;
    titleColor: string;
    innerColor: string;
    outerColor: string;
    descVi: string;
    descEn: string;
    bulletColor: string;
    cornerPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    data: SwotSkillItem[];
  }> = [
    {
      key: "S",
      id: "skills-management-card",
      elementName: "Thẻ kỹ năng Thế mạnh cốt lõi",
      icon: "award",
      title: isVi ? "Thế Mạnh Cốt Lõi" : "Core Operational Strengths",
      subVi: "",
      subEn: "Core Operational CX Strengths",
      descVi: "Những năng lực cốt lõi đã được chứng minh qua thực tiễn quản lý, vận hành và phát triển hệ thống Dịch vụ Khách hàng.",
      descEn: "Core competencies proven through hands-on Customer Service management, operations, and system scaling.",
      titleColor: "#1480C0",
      innerColor: "#1480C0",
      outerColor: "#BAE6FD",
      bulletColor: "#1480C0",
      cornerPosition: "bottom-right",
      data: STRENGTHS_DATA,
    },
    {
      key: "W",
      id: "skills-tech-card",
      elementName: "Thẻ kỹ năng Khía cạnh hoàn thiện",
      icon: "trending-up",
      title: isVi ? "Khía Cạnh Hoàn Thiện" : "Strategic Refinements",
      subVi: "",
      subEn: "Strategic Refinement Areas",
      descVi: "Những năng lực cần tiếp tục hoàn thiện để nâng tầm vai trò quản lý từ vận hành hiệu quả sang quản trị chiến lược và phát triển bền vững.",
      descEn: "Capabilities being refined to elevate leadership from operational efficiency to strategic governance and sustainable growth.",
      titleColor: "#50B347",
      innerColor: "#50B347",
      outerColor: "#D9F99D",
      bulletColor: "#50B347",
      cornerPosition: "bottom-left",
      data: WEAKNESSES_DATA,
    },
    {
      key: "O",
      id: "skills-ops-card",
      elementName: "Thẻ kỹ năng Cơ hội phát triển",
      icon: "rocket",
      title: isVi ? "Cơ Hội Phát Triển" : "Growth Opportunities",
      subVi: "",
      subEn: "AI & Digital Leap Opportunities",
      descVi: "Những năng lực tạo đòn bẩy để nâng cao hiệu quả vận hành, tối ưu nguồn lực và chuyển đổi mô hình Dịch vụ Khách hàng trong thời đại số.",
      descEn: "Leveraged capabilities to boost operational efficiency, optimize resources, and transform Customer Service in the digital era.",
      titleColor: "#EC7D21",
      innerColor: "#EC7D21",
      outerColor: "#FEF08A",
      bulletColor: "#EC7D21",
      cornerPosition: "top-right",
      data: OPPORTUNITIES_DATA,
    },
    {
      key: "T",
      id: "skills-leadership-card",
      elementName: "Thẻ kỹ năng Thách thức thích ứng",
      icon: "shield-alert",
      title: isVi ? "Thách Thức Thích Ứng" : "Adaptive Challenges",
      subVi: "",
      subEn: "External Pressure & Adaptation Risks",
      descVi: "Những yếu tố bên ngoài tác động trực tiếp đến chất lượng dịch vụ, nhân sự và hiệu quả vận hành, đòi hỏi khả năng thích ứng và quản trị chủ động.",
      descEn: "External factors impacting service quality, staffing, and operational efficiency that require proactive adaptation and risk governance.",
      titleColor: "#E64C72",
      innerColor: "#E64C72",
      outerColor: "#FBCFE8",
      bulletColor: "#E64C72",
      cornerPosition: "top-left",
      data: THREATS_DATA,
    },
  ];

  const skillsMainBody = (
    <div
      id="skills-main-wrapper"
      className={cn(
        "w-full flex-grow flex flex-col gap-[15px] justify-start",
        selectedSwot && "h-full flex-1 min-h-0 gap-0"
      )}
    >
        {/* Banner trang kỹ năng - Ẩn khi hiển thị chi tiết kỹ năng */}
        {!selectedSwot && (
          <motion.div
          id="skills-hero-banner"
          data-element-name="Banner card"
          data-element-type="banner-card"
          data-section-card="true"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,24px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
          style={{
            padding: "15px",
            width: "100%",
            maxWidth: "100%",
            borderRadius: "var(--radius-banner, 24px)",
          }}
        >
          {/* Lớp nền video và gradient phủ */}
          <div
            id="skills-hero-banner-bg"
            className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
          >
            {driveSkillsBanner ? (
              <DriveAwareBannerMedia
                directVideoUrl={driveSkillsBanner.directStreamUrl}
                iframeFallbackUrl={driveSkillsBanner.previewIframeUrl}
                posterUrl="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042092/K%E1%BB%B7_n%C4%83ng.png"
                title={driveSkillsBanner.fileName}
                className="rounded-[inherit]"
              />
            ) : (
              <BannerBackgroundVideo
                id="skills-hero-banner-video"
                src="https://drive.google.com/uc?export=download&id=1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx"
                poster="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042092/K%E1%BB%B7_n%C4%83ng.png"
                alt="Banner Kỹ năng cốt lõi"
              />
            )}
          </div>
          <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

          {/* Vùng Tiêu Đề: Tiêu đề bên trái, Sub tiêu đề cùng hàng nằm bên phải */}
          <div id="skills-hero-banner-header" className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
            <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: "var(--text-link, var(--color-primary))" }}>
                <WebIcon name="sparkles" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  id="skills-hero-banner-title"
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  {isVi ? "Kỹ năng cốt lõi (SWOT)" : "Core Skills (SWOT)"}
                </h1>
              </div>

              <p
                id="skills-hero-banner-quote"
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
                style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
              >
                {isVi ? '"Kỹ năng là nền tảng nâng tầm dịch vụ ♡"' : '"Skills are the foundation that elevates service ♡"'}
              </p>
            </div>

            {/* Nhóm các nút lại thành 1 filter icon bên dưới banner bên trái - Giao diện sáng */}
            <div id="skills-hero-banner-filter-row" className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto" ref={filterMenuRef}>
              <div className="relative inline-block text-left">
                <button
                  id="skills-filter-toggle-btn"
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="banner-control-pill swot-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play active:scale-95 group"
                  title={isVi ? "Bộ lọc kỹ năng" : "Skill Filter"}
                  aria-label="Bộ lọc kỹ năng"
                  aria-expanded={isFilterOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon name="sliders" className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>{isVi ? "Bộ lọc kỹ năng" : "Skill Filter"}</span>
                {selectedSwot && (
                  <span className="banner-count-pill px-2 py-0.5 rounded-full border typo-badge font-mono">
                    #{selectedSwot}
                  </span>
                )}
                <WebIcon
                  name="chevron-down"
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 shrink-0",
                    isFilterOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    id="skills-filter-dropdown"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                  >
                    {swotFilterOptions.map((opt) => {
                      const isActive = selectedSwot === opt.id;
                      return (
                        <button
                          id={`skills-filter-option-${opt.id ?? "all"}`}
                          key={opt.id ?? "all"}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-selected={isActive ? "true" : "false"}
                          onClick={() => {
                            setSelectedSwot(opt.id);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left",
                            isActive ? "shadow-2xs font-bold" : ""
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={cn(
                                "px-1.5 h-5 rounded-full flex items-center justify-center typo-badge font-mono shrink-0",
                                isActive ? "bg-white/25 text-white" : cn("bg-[var(--bg-nested-badge)]", opt.color)
                              )}
                            >
                              {opt.badge}
                            </span>
                            <span className="truncate">{opt.label}</span>
                          </span>
                          {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

              <button
                id="skills-expand-all-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  const allIds = QUADRANTS.flatMap((q) => q.data.map((d) => d.id));
                  setExpandedSkillIds((prev) => (prev.size > 0 ? new Set() : new Set(allIds)));
                }}
                className="banner-control-pill swot-control-pill h-9 inline-flex items-center gap-1.5 px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-bold font-play active:scale-95"
                title={expandedSkillIds.size > 0 ? (isVi ? "Thu gọn tất cả mô tả" : "Collapse all details") : (isVi ? "Mở rộng tất cả mô tả" : "Expand all details")}
              >
                <WebIcon name={expandedSkillIds.size > 0 ? "minimize" : "maximize-2"} className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                <span>
                  {expandedSkillIds.size > 0
                    ? isVi ? "Thu gọn mô tả" : "Collapse All"
                    : isVi ? "Mở rộng mô tả" : "Expand All"}
                </span>
              </button>
          </div>
        </motion.div>
        )}

        {/* ========================================================================= */}
        {/* LƯỚI 4 THẺ KỸ NĂNG SWOT                                                    */}
        {/* 2 CỘT x 2 HÀNG, CÁCH NHAU 15PX, 4 GÓC TẠO THÀNH ĐỒ THỊ TRÒN ĐỒNG TÂM       */}
        {/* ========================================================================= */}
        <div
          id="skills-swot-grid-wrapper"
          className={cn(
            "w-full relative",
            selectedSwot && "flex-1 min-h-0 h-full flex flex-col"
          )}
        >
          <div
            id="skills-swot-grid"
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch w-full",
              selectedSwot && "flex-1 min-h-0 h-full grid-rows-[minmax(0,1fr)]"
            )}
            style={{ gap: selectedSwot ? "0px" : "15px" }}
          >
            {QUADRANTS
              .filter((quad) => !selectedSwot || selectedSwot === quad.key)
              .map((quad, qIdx) => {
                const isSelected = selectedSwot === quad.key;

                return (
                  <motion.div
                    key={quad.key}
                    id={quad.id}
                    data-element-name={quad.elementName}
                    data-element-type="card"
                    data-section-card="true"
                    data-element-page="skills"
                    data-swot={quad.key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: qIdx * 0.05 }}
                    className={cn(
                      "swot-quadrant-card bento-card glass-card w-full relative text-[var(--text-primary)] transition-all duration-300 flex flex-col justify-between p-[15px] gap-[15px] min-h-[300px]",
                      isSelected
                        ? "md:col-span-2 h-full min-h-full flex-1 overflow-y-auto glass-scrollbar rounded-[var(--radius-main,30px)] border-0"
                        : "rounded-[14px] overflow-hidden"
                    )}
                  >
                    {/* Corner Quadrant Arc matching the exact model vector */}
                    <SwotCornerQuadrant
                      position={quad.cornerPosition}
                      letter={quad.key}
                      innerColor={quad.innerColor}
                      outerColor={quad.outerColor}
                    />

                    {/* Card Content Area */}
                    <div
                      id={`${quad.id}-content`}
                      className={cn(
                        "relative z-10 flex flex-col justify-between w-full h-full min-w-0",
                        quad.key === "S" && (isSelected ? "pr-8 sm:pr-12" : "pr-4 sm:pr-7"),
                        quad.key === "W" && (isSelected ? "pl-8 sm:pl-12" : "pl-4 sm:pl-7"),
                        quad.key === "O" && (isSelected ? "pr-8 sm:pr-12" : "pr-4 sm:pr-7"),
                        quad.key === "T" && (isSelected ? "pl-8 sm:pl-12" : "pl-4 sm:pl-7")
                      )}
                    >
                      {/* Tiêu đề & phụ đề: Thêm icon trước tiêu đề, tiêu đề 4 chữ tiếng Việt (viết Hoa chữ đầu còn lại viết thường) */}
                      <div
                        id={`${quad.id}-header`}
                        className={cn(
                          "space-y-1 mb-3 w-full flex flex-col",
                          !isSelected && (quad.key === "W" || quad.key === "T")
                            ? "text-left items-start md:text-right md:items-end"
                            : "text-left items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2.5 w-full",
                            isSelected
                              ? "justify-between"
                              : quad.key === "W" || quad.key === "T"
                              ? "justify-start text-left md:justify-end md:text-right"
                              : "justify-start text-left"
                          )}
                        >
                          <div className="card-header-sync flex items-center gap-2" style={{ color: quad.titleColor }}>
                            <WebIcon name={quad.icon} className="w-5 h-5 shrink-0" style={{ color: quad.titleColor }} />
                            <h2
                              id={`${quad.id}-title`}
                              className="swot-quadrant-title card-title-synced typo-h3 font-play tracking-tight"
                              style={{ textTransform: "none", color: quad.titleColor }}
                            >
                              {quad.title}
                            </h2>
                          </div>
                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSwot(null);
                              }}
                              className="banner-control-pill swot-control-pill px-3 py-1 rounded-full typo-button font-play transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              title={isVi ? "Hiển thị tất cả (#ALL)" : "Show all (#ALL)"}
                            >
                              <WebIcon name="cancel" className="w-3.5 h-3.5" />
                              <span>{isVi ? "Hiển thị tất cả (#ALL)" : "Show All (#ALL)"}</span>
                            </button>
                          )}
                        </div>
                        <p className={cn("swot-quadrant-desc typo-body-sm text-[var(--text-secondary)] mt-2 w-full", !isSelected && (quad.key === "W" || quad.key === "T") ? "text-left md:text-right" : "text-left")}>
                          {isVi ? quad.descVi : quad.descEn}
                        </p>
                      </div>

                      {/* Danh sách kỹ năng: Icon kỹ năng & Số thứ tự & "." & Tên kỹ năng & Thanh % & Số % & Accordion Disclosure */}
                      <ul id={`${quad.id}-list`} className="flex flex-col gap-2 list-none p-0 m-0 my-auto">
                        {quad.data.map((item, idx) => {
                          const skillIcon = getWebSkillIconName(item.iconName);
                          const formattedName = isVi ? (item.labelVi || '') : (item.labelEn || t(item.labelVi || ''));
                          const isThreat = quad.key === 'T';
                          const percentLabel = isVi
                            ? isThreat
                              ? `Mức độ tác động: ${item.percent}%`
                              : `Mức độ kỹ năng: ${item.percent}%`
                            : isThreat
                            ? `Impact Level: ${item.percent}%`
                            : `Proficiency Level: ${item.percent}%`;
                          const isExpanded = expandedSkillIds.has(item.id);
                          const itemDesc = isVi
                            ? item.descVi
                            : item.descEn || (item.descVi ? t(item.descVi) : '');

                          return (
                            <li
                              id={`skill-item-${item.id}`}
                              key={item.id}
                              role="button"
                              tabIndex={0}
                              data-subcard="true"
                              data-swot={quad.key}
                              data-expanded={isExpanded ? "true" : "false"}
                              aria-expanded={isExpanded}
                              onClick={() => toggleSkillAccordion(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleSkillAccordion(item.id);
                                }
                              }}
                              style={{
                                background: 'transparent',
                                backgroundColor: 'transparent',
                                backgroundImage: 'none',
                                boxShadow: 'none',
                                borderRadius: 'var(--radius-subcard, 16px)',
                              }}
                              className={cn(
                                "skill-swot-subcard group/item flex flex-col gap-1.5 rounded-[var(--radius-subcard,16px)] p-2.5 transition-all duration-200 cursor-pointer select-none bg-transparent",
                                !isExpanded && "active:scale-[0.995]",
                                highlightedSkillId === item.id && "ring-2 ring-cyan-500 scale-[1.01]"
                              )}
                              title={
                                isExpanded
                                  ? isVi
                                    ? "Nhấp để thu gọn mô tả kỹ năng"
                                    : "Click to collapse skill description"
                                  : isVi
                                  ? "Nhấp để xem chi tiết mô tả kỹ năng"
                                  : "Click to expand skill description"
                              }
                            >
                              <div className="flex flex-nowrap items-start sm:items-center justify-between gap-2 w-full min-w-0 bg-transparent">
                                <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 min-w-0 flex-1 bg-transparent">
                                  {/* 1. Icon kỹ năng */}
                                  <WebIcon
                                    name={skillIcon}
                                    className="swot-skill-icon w-4 h-4 shrink-0 mt-0.5 sm:mt-0 bg-transparent border-0 p-0 shadow-none"
                                    style={{ color: 'var(--swot-accent)' }}
                                  />

                                  {/* 2. Số thứ tự & "." */}
                                  <span
                                    className="swot-skill-index typo-caption font-mono font-bold shrink-0 text-left mt-0.5 sm:mt-0 bg-transparent"
                                    style={{ color: 'var(--swot-accent)' }}
                                  >
                                    {idx + 1}.
                                  </span>

                                  {/* 3. Tên kỹ năng: Luôn hiển thị đầy đủ, tự xuống dòng khi hẹp */}
                                  <span
                                    className="swot-skill-name typo-body font-semibold font-play flex-1 min-w-0 whitespace-normal break-words leading-snug text-left bg-transparent"
                                    style={{ color: 'var(--swot-accent)' }}
                                    title={formattedName}
                                  >
                                    {formattedName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5 sm:pt-0">
                                  {/* Thanh màu % tự động ẩn/hiện theo độ rộng thật của thẻ qua @container swot-card */}
                                  <div
                                    className="swot-skill-track h-2 rounded-full overflow-hidden shrink-0 shadow-inner"
                                    title={percentLabel}
                                  >
                                    <div
                                      className="swot-skill-fill h-full rounded-full transition-all duration-500"
                                      style={{ width: `${item.percent}%` }}
                                    />
                                  </div>

                                  {/* Số % đảm bảo luôn hiển thị */}
                                  <span
                                    className="swot-skill-percent typo-label font-mono font-bold shrink-0 whitespace-nowrap min-w-[3ch] text-right tabular-nums"
                                    title={percentLabel}
                                  >
                                    {item.percent}%
                                  </span>

                                  {/* Icon mũi tên Accordion (Disclosure) xoay 180 độ khi mở */}
                                  <div
                                    className="swot-skill-chevron-wrap w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ml-0.5 bg-transparent"
                                    data-expanded={isExpanded ? "true" : "false"}
                                  >
                                    <WebIcon
                                      name="chevron-down"
                                      className={cn(
                                        "swot-skill-chevron w-3.5 h-3.5 transition-transform duration-300",
                                        isExpanded ? "rotate-180" : "opacity-65 group-hover/item:opacity-100"
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Accordion (Disclosure) hiển thị mô tả kỹ năng khi click */}
                              <AnimatePresence initial={false}>
                                {isExpanded && itemDesc && (
                                  <motion.div
                                    id={`skill-disclosure-${item.id}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    className="overflow-hidden bg-transparent"
                                  >
                                    <div
                                      className="swot-skill-disclosure mt-2 pt-2 text-left flex items-start gap-2 p-2.5 rounded-[14px] bg-transparent"
                                      style={{ background: 'transparent', backgroundColor: 'transparent', boxShadow: 'none' }}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <span className="swot-skill-disclosure-label typo-label font-mono tracking-wide block opacity-85 mb-0.5">
                                          {isVi ? "Mô tả kỹ năng thực chiến" : "Practical Skill Description"}
                                        </span>
                                        <p className="swot-skill-disclosure-text typo-body-sm text-[var(--text-primary)]">
                                          {itemDesc}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NGÔN NGỮ GIAO TIẾP (COMMUNICATION LANGUAGES) - ẨN KHI BẤM NÚT S, W, T, O    */}
        {/* ========================================================================= */}
        {!selectedSwot && (
          <motion.div 
            id="skills-languages-section"
            data-element-name="Thẻ Ngôn ngữ giao tiếp"
            data-element-type="card"
            data-section-card="true"
            data-element-page="skills"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bento-card glass-card w-full p-[15px] rounded-[var(--radius-card,24px)] text-[var(--text-primary)] flex flex-col gap-[15px] text-left min-w-0 box-border"
            style={{ borderRadius: 'var(--radius-card, 24px)', padding: '15px' }}
          >
            <div id="skills-languages-header" className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3">
              <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-sky-400">
                <WebIcon name="languages" className="w-5 h-5 shrink-0" />
                <h2 id="skills-languages-title" className="card-title-synced typo-h3 font-play">
                  {isVi ? "Ngôn ngữ giao tiếp" : "Communication Languages"}
                </h2>
              </div>
            </div>

            <div id="skills-languages-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch w-full min-w-0" style={{ gap: "15px" }}>
              {LANGUAGES_DATA.map((langItem) => {
                return (
                  <div 
                    id={`skills-language-card-${langItem.id}`}
                    key={langItem.id}
                    data-subcard="true"
                    data-element-name={`Thẻ ngôn ngữ: ${langItem.nameVi}`}
                    data-element-page="skills"
                    style={{ borderRadius: 'var(--radius-subcard, 16px)', padding: '15px' }}
                    className="sub-card exp-detail-subcard w-full h-full min-w-0 flex items-center gap-[15px] p-[15px] rounded-[var(--radius-subcard,16px)] transition-all duration-300 hover:scale-[1.012] hover:shadow-md cursor-default select-none box-border"
                  >
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="stroke-current opacity-30"
                          style={{ color: 'var(--border-subcard, rgba(148, 163, 184, 0.35))' }}
                          strokeWidth="3.2"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path 
                          className={cn("skills-lang-ring-arc stroke-current", langItem.color)} 
                          strokeWidth="3.2" 
                          strokeDasharray={`${langItem.percent}, 100`} 
                          strokeLinecap="round" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <span className="about-info-value absolute typo-label font-mono font-bold whitespace-nowrap text-[var(--text-heading,var(--text-primary))]">
                        {langItem.percent}%
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 text-left flex-1">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <h3 className={cn("skills-lang-title typo-h4 subcard-header-sync subcard-title-synced font-play font-bold whitespace-normal break-words flex items-center gap-1.5", langItem.color)} data-subcard-title="true">
                          <WebIcon name="globe" className="w-4 h-4 shrink-0" />
                          <span>{isVi ? langItem.nameVi : langItem.nameEn}</span>
                        </h3>
                        {(isVi ? langItem.levelVi : langItem.levelEn) ? (
                          <span className="skills-lang-level typo-badge px-2 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-nested-badge)] text-[var(--text-secondary)] font-semibold shrink-0">
                            {isVi ? langItem.levelVi : langItem.levelEn}
                          </span>
                        ) : null}
                      </div>
                      <span className="about-info-label typo-caption text-[var(--text-secondary)] mt-0.5 font-medium">
                        {isVi ? langItem.roleVi : langItem.roleEn}
                      </span>
                      {langItem.descVi && (
                        <p className="typo-caption text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                          {isVi ? langItem.descVi : langItem.roleEn}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
  );

  if (embedded) {
    return (
      <div
        id="skills-embedded-section"
        data-element-name="Trang Kỹ Năng Cốt Lõi"
        data-element-type="section"
        data-element-page="skills"
        className="w-full min-w-0 flex flex-col justify-start font-play text-left animate-fadeIn gap-[15px] box-border"
      >
        {skillsMainBody}
      </div>
    );
  }

  return (
    <div
      id="skills-page-container"
      data-element-name="Trang Kỹ Năng Cốt Lõi"
      data-element-type="container"
      data-element-page="skills"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="skills-cards-track"
        data-element-name="Track căn giữa Kỹ Năng"
        data-element-type="container"
        data-element-page="skills"
        data-element-parent="skills-page-container"
        className="page-cards-track"
      >
        <div
          id="skills-main-card"
          data-main-card="true"
          data-layer-level="1"
          data-detail-open={selectedSwot ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Kỹ Năng"
          data-element-type="card"
          data-element-page="skills"
          data-element-parent="skills-cards-track"
          className={cn(
            "page-main-card flex flex-col justify-start rounded-[14px] overflow-x-hidden glass-scrollbar font-play text-left box-border",
            selectedSwot ? "p-0 gap-0 overflow-hidden" : "p-[15px] gap-[15px] overflow-y-auto"
          )}
        >
          {skillsMainBody}
        </div>
      </div>
    </div>
  );
}

export const SkillsView = Skills;
export default Skills;
