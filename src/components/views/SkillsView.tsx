'use client';

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { WebIcon } from "@/components/ui/WebIcon";
import { cn } from "@/lib/utils";
import { SoundEngine } from "@/components/ui/SoundEngine";
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
  onClick,
  isActive,
}) => {
  // SVG size 130 x 130
  // R_inner = 92, R_outer = 126
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!!isActive}
      aria-label={`Lọc nhóm SWOT ${letter}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "absolute w-20 h-20 sm:w-32 sm:h-32 z-20 cursor-pointer select-none transition-transform duration-300 hover:scale-105",
        position === 'bottom-right' && "bottom-0 right-0",
        position === 'bottom-left' && "bottom-0 left-0",
        position === 'top-right' && "top-0 right-0",
        position === 'top-left' && "top-0 left-0"
      )}
      title={`Bộ chỉ số SWOT: ${letter}`}
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
}

export function Skills({ currentTheme }: SkillsViewProps = {}) {
  void currentTheme;
  const { language: lang, t } = useLanguage();
  const isVi = lang === "vi";
  const [selectedSwot, setSelectedSwot] = useState<string | null>(null);
  const [expandedSkillIds, setExpandedSkillIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

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
    { id: null, label: isVi ? "Tất cả năng lực (#SWOT)" : "All Competencies (#SWOT)", badge: "#ALL", color: "text-[#1480C0]" },
    { id: "S", label: isVi ? "#S · Điểm mạnh (Strengths)" : "#S · Core Strengths", badge: "#S", color: "text-[#1480C0]" },
    { id: "W", label: isVi ? "#W · Hoàn thiện (Weaknesses)" : "#W · Growth Areas", badge: "#W", color: "text-[#50B347]" },
    { id: "O", label: isVi ? "#O · Cơ hội (Opportunities)" : "#O · Opportunities", badge: "#O", color: "text-[#EC7D21]" },
    { id: "T", label: isVi ? "#T · Thách thức (Threats)" : "#T · Threats & Risks", badge: "#T", color: "text-[#E64C72]" },
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
      title: isVi ? "Thế mạnh cốt lõi" : "Core Operational Strengths",
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
      icon: "target",
      title: isVi ? "Khía cạnh hoàn thiện" : "Strategic Refinements",
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
      title: isVi ? "Cơ hội phát triển" : "Growth Opportunities",
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
      icon: "shield",
      title: isVi ? "Thách thức thích ứng" : "Adaptive Challenges",
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

  return (
    <div
      id="skills-page-container"
      data-element-name="Trang Kỹ Năng Cốt Lõi"
      data-element-type="container"
      data-element-page="skills"
      className="w-full h-full flex flex-col justify-between p-[15px] overflow-y-auto glass-scrollbar font-play text-left animate-fadeIn gap-[15px]"
    >
      <div id="skills-main-wrapper" className="w-full flex-grow flex flex-col gap-[15px] justify-start">
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
          className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
          style={{ padding: "15px", width: "100%", maxWidth: "100%", height: "200px", minHeight: "200px", maxHeight: "200px", borderRadius: "14px" }}
        >
          {/* Lớp nền hình ảnh và gradient phủ */}
          <div
            id="skills-hero-banner-bg"
            className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #082f49 0%, #0369a1 50%, #0f172a 100%)",
              borderRadius: "14px",
            }}
          >
            <img
              id="skills-hero-banner-img"
              src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042092/K%E1%BB%B7_n%C4%83ng.png"
              alt="Banner Kỹ năng cốt lõi"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
          </div>

          {/* Vùng Tiêu Đề: Icon và Tiêu đề bên trái, Sub tiêu đề cùng hàng nằm bên phải */}
          <div id="skills-hero-banner-header" className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            <div className="flex items-center gap-2 shrink-0">
              <WebIcon
                name="brain"
                className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
                style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
              />
                <h1
                  id="skills-hero-banner-title"
                  className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
                  style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  {isVi ? "Kỹ năng cốt lõi (SWOT)" : "Core Skills (SWOT)"}
                </h1>
              </div>

              <p
                id="skills-hero-banner-quote"
                className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
                style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
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
                  className="swot-control-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-slate-800 dark:text-[#E2E8F0] border border-slate-200/90 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
                  title={isVi ? "Bộ lọc năng lực" : "Skill Filter"}
                  aria-expanded={isFilterOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon name="sliders" className="w-4 h-4 text-[#1480C0] dark:text-sky-400 transition-transform group-hover:rotate-45 shrink-0" />
                  <span>{isVi ? "Bộ lọc năng lực" : "Skill Filter"}</span>
                {selectedSwot && (
                  <span className="px-2 py-0.2 rounded-full bg-sky-100 dark:bg-sky-900/70 border border-sky-300 dark:border-sky-600/60 text-[10px] font-mono text-sky-900 dark:text-sky-200 font-bold">
                    #{selectedSwot}
                  </span>
                )}
                <WebIcon
                  name="chevron-down"
                  className={cn(
                    "w-3.5 h-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200 shrink-0",
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
                    style={{ background: 'var(--bg-popup)' }}
                    className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 rounded-[14px] text-[#334155] dark:text-[#E2E8F0] border border-slate-200 dark:border-[#334155] shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-2xl py-2 px-2 z-50 flex flex-col gap-1"
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
                          onClick={() => {
                            setSelectedSwot(opt.id);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left",
                            isActive
                              ? "bg-slate-100 dark:bg-sky-900/50 text-slate-900 dark:text-white border border-slate-300 dark:border-sky-500/50 shadow-2xs font-bold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium"
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black bg-slate-100 dark:bg-slate-800 shrink-0",
                                opt.color
                              )}
                            >
                              {opt.badge}
                            </span>
                            <span className="truncate">{opt.label}</span>
                          </span>
                          {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
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
                className="swot-control-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-slate-800 dark:text-[#E2E8F0] border border-slate-200/90 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all cursor-pointer text-xs font-bold font-play active:scale-95"
                title={expandedSkillIds.size > 0 ? (isVi ? "Thu gọn tất cả mô tả" : "Collapse all details") : (isVi ? "Mở rộng tất cả mô tả" : "Expand all details")}
              >
                <WebIcon name={expandedSkillIds.size > 0 ? "minimize" : "maximize-2"} className="w-3.5 h-3.5 text-[#1480C0] dark:text-sky-400 shrink-0" />
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
        <div id="skills-swot-grid-wrapper" className="w-full relative">
          <div
            id="skills-swot-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch w-full"
            style={{ gap: "15px" }}
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
                      "swot-quadrant-card bento-card glass-card w-full rounded-[14px] relative text-[#334155] dark:text-[#E2E8F0] transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 sm:p-6 min-h-[300px]",
                      isSelected && "md:col-span-2 ring-2 ring-cyan-500"
                    )}
                  >
                    {/* Corner Quadrant Arc matching the exact model vector */}
                    <SwotCornerQuadrant
                      position={quad.cornerPosition}
                      letter={quad.key}
                      innerColor={quad.innerColor}
                      outerColor={quad.outerColor}
                      onClick={() => setSelectedSwot(selectedSwot === quad.key ? null : quad.key)}
                      isActive={isSelected}
                    />

                    {/* Card Content Area */}
                    <div
                      id={`${quad.id}-content`}
                      className={cn(
                        "relative z-10 flex flex-col justify-between w-full h-full",
                        quad.key === "S" && (isSelected ? "pr-12 sm:pr-20" : "pr-8 sm:pr-14 md:pr-18"),
                        quad.key === "W" && (isSelected ? "pl-12 sm:pl-20" : "pl-8 sm:pl-14 md:pl-18"),
                        quad.key === "O" && (isSelected ? "pr-12 sm:pr-20" : "pr-8 sm:pr-14 md:pr-18"),
                        quad.key === "T" && (isSelected ? "pl-12 sm:pl-20" : "pl-8 sm:pl-14 md:pl-18")
                      )}
                    >
                      {/* Tiêu đề & phụ đề: Thêm icon trước tiêu đề, tiêu đề 4 chữ tiếng Việt (viết Hoa chữ đầu còn lại viết thường) */}
                      <div
                        id={`${quad.id}-header`}
                        className={cn(
                          "space-y-1 mb-3 w-full flex flex-col",
                          !isSelected && (quad.key === "W" || quad.key === "T")
                            ? "text-right items-end"
                            : "text-left items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2.5 w-full",
                            isSelected
                              ? "justify-between"
                              : quad.key === "W" || quad.key === "T"
                              ? "justify-end text-right"
                              : "justify-start text-left"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <WebIcon
                              name={quad.icon}
                              className="swot-quadrant-icon w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                              style={{ width: '18px', height: '18px' }}
                            />
                            <h2
                              id={`${quad.id}-title`}
                              className="swot-quadrant-title text-[18px] font-bold font-play tracking-tight leading-tight"
                              style={{ fontSize: '18px', fontWeight: 700, textTransform: "none" }}
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
                              className="swot-control-pill px-3 py-1 rounded-full text-xs font-bold font-play border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              title={isVi ? "Hiển thị tất cả (#ALL)" : "Show all (#ALL)"}
                            >
                              <WebIcon name="cancel" className="w-3.5 h-3.5" />
                              <span>{isVi ? "Hiển thị tất cả (#ALL)" : "Show All (#ALL)"}</span>
                            </button>
                          )}
                        </div>
                        <p className={cn("swot-quadrant-desc text-[13px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed w-full", !isSelected && (quad.key === "W" || quad.key === "T") ? "text-right" : "text-left")}>
                          {isVi ? quad.descVi : quad.descEn}
                        </p>
                      </div>

                      {/* Danh sách kỹ năng: Số thứ tự & "." & Icon kỹ năng & Tên kỹ năng & Thanh % & Số % & Accordion Disclosure (Hiển thị 1 dòng) */}
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
                              className={cn(
                                "skill-swot-subcard group/item flex flex-col gap-1.5 rounded-[12px] p-2.5 transition-all duration-200 cursor-pointer select-none",
                                isExpanded
                                  ? "shadow-xs"
                                  : "hover:shadow-xs active:scale-[0.995]"
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
                              <div className="flex flex-nowrap items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                  {/* Số thứ tự & "." */}
                                  <span className="swot-skill-index text-xs sm:text-[13px] font-mono font-black shrink-0 w-4 sm:w-5 text-right">
                                    {idx + 1}.
                                  </span>

                                  {/* Icon kỹ năng */}
                                  <WebIcon
                                    name={skillIcon}
                                    className="swot-skill-icon w-4 h-4 shrink-0"
                                  />

                                  {/* Tên kỹ năng: 1 dòng, truncate khi quá dài */}
                                  <span
                                    className="swot-skill-name text-[14px] sm:text-[15px] font-bold leading-snug font-play flex-1 min-w-0 truncate"
                                    title={formattedName}
                                  >
                                    {formattedName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                  {/* Thanh màu % hiển thị khi kích thước đảm bảo hiển thị được */}
                                  <div
                                    className={cn(
                                      "swot-skill-track h-2 rounded-full overflow-hidden shrink-0 shadow-inner",
                                      isSelected ? "block w-20 sm:w-28" : "hidden sm:block w-16 lg:w-20"
                                    )}
                                    title={percentLabel}
                                  >
                                    <div
                                      className="swot-skill-fill h-full rounded-full transition-all duration-500"
                                      style={{ width: `${item.percent}%` }}
                                    />
                                  </div>

                                  {/* Số % đảm bảo luôn hiển thị */}
                                  <span
                                    className="swot-skill-percent text-[11px] sm:text-xs font-mono font-black shrink-0 w-8 sm:w-9 text-right"
                                    title={percentLabel}
                                  >
                                    {item.percent}%
                                  </span>

                                  {/* Icon mũi tên Accordion (Disclosure) xoay 180 độ khi mở */}
                                  <div
                                    className="swot-skill-chevron-wrap w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ml-0.5"
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
                                    className="overflow-hidden"
                                  >
                                    <div className="swot-skill-disclosure mt-2 pt-2 text-left flex items-start gap-2 p-2.5 rounded-[10px]">
                                      <WebIcon
                                        name="info"
                                        className="swot-skill-icon w-4 h-4 shrink-0 mt-0.5 opacity-90"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <span className="swot-skill-disclosure-label text-[11px] font-mono font-bold tracking-wide block opacity-85 mb-0.5">
                                          {isVi ? "Mô tả kỹ năng thực chiến" : "Practical Skill Description"}
                                        </span>
                                        <p className="swot-skill-disclosure-text text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
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
            className="bento-card glass-card w-full p-5 sm:p-6 rounded-[14px] text-[#334155] dark:text-[#E2E8F0] flex flex-col gap-4 text-left"
            style={{ borderRadius: '14px' }}
          >
            <div id="skills-languages-header" className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/15 pb-3">
              <div className="flex items-center gap-2 text-[#1480C0] dark:text-sky-400">
                <WebIcon name="globe" className="w-5 h-5 text-[#1480C0] dark:text-sky-400" />
                <h2 id="skills-languages-title" className="text-[18px] font-bold font-play text-[#1480C0] dark:text-sky-400" style={{ fontSize: '18px', fontWeight: 700 }}>
                  {isVi ? "Ngôn ngữ giao tiếp" : "Communication Languages"}
                </h2>
              </div>
            </div>

            <div id="skills-languages-grid" className="grid grid-cols-1 md:grid-cols-3 gap-[15px] items-stretch w-full" style={{ gap: "15px" }}>
              {LANGUAGES_DATA.map((langItem) => {
                return (
                  <div 
                    id={`skills-language-card-${langItem.id}`}
                    key={langItem.id}
                    data-subcard="true"
                    data-element-name={`Thẻ ngôn ngữ: ${langItem.nameVi}`}
                    data-element-page="skills"
                    className="exp-detail-subcard w-full h-full min-w-0 flex items-center gap-4 p-4 rounded-[12px] transition-all duration-300 hover:scale-[1.012] hover:shadow-md"
                  >
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200/80 dark:text-slate-700/80 stroke-current" strokeWidth="3.2" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path 
                          className={cn("stroke-current", langItem.color)} 
                          strokeWidth="3.2" 
                          strokeDasharray={`${langItem.percent}, 100`} 
                          strokeLinecap="round" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <span className="about-info-value absolute text-xs font-mono font-black text-slate-800 dark:text-[#F8FAFC]">
                        {langItem.percent}%
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 text-left">
                      <h3 className={cn("font-bold text-base font-play", langItem.color)}>
                        {isVi ? langItem.nameVi : langItem.nameEn}
                      </h3>
                      <span className="about-info-label text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isVi ? langItem.roleVi : langItem.roleEn}
                      </span>
                      {(isVi ? langItem.levelVi : langItem.levelEn) && langItem.id !== "ai" && langItem.id !== "vi" && (
                        <span className={cn("text-xs font-bold mt-1", langItem.color)}>
                          {isVi ? langItem.levelVi : langItem.levelEn}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const SkillsView = Skills;
export default Skills;
