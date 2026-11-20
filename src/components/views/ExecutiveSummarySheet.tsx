'use client';

import React, { useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { ABOUT_PROFILE_STATS, SERVICE_PHILOSOPHY_VALUES } from '@/data/about';
import { DOMAINS_DATA } from '@/data/domains';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { STRENGTHS_DATA, WEAKNESSES_DATA, OPPORTUNITIES_DATA, THREATS_DATA, LANGUAGES_DATA } from '@/data/skills';
import { ENTERPRISE_SYSTEMS_LIST } from '@/data/systems';

export interface ExecutiveSummarySheetProps {
  onShowNotification?: (msg: string) => void;
}

type InfographicThemeStyle = 'light' | 'dark';

const AVATAR_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  let curY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && line) {
      lineCount += 1;
      if (lineCount >= maxLines) {
        ctx.fillText(`${line}...`, x, curY);
        return curY + lineHeight;
      }
      ctx.fillText(line, x, curY);
      line = words[i];
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, curY);
    curY += lineHeight;
  }
  return curY;
}

function loadCorsImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => resolve(null), 4000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

export const ExecutiveSummarySheet: React.FC<ExecutiveSummarySheetProps> = ({
  onShowNotification,
}) => {
  const [exportTheme, setExportTheme] = useState<InfographicThemeStyle>('light');
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);

  const milestones = Object.values(EXPERIENCE_MILESTONES);

  const handleCopySummaryText = async () => {
    SoundEngine.playTap();
    const textSummary = [
      'Nguyễn Hùng Thái — Chuyên Gia Vận Hành CSKH & Chuyển Đổi Số (CX & Operations Director)',
      '• Thăng tiến cấp bậc: Nhân viên CSKH (2002) → Giám sát (2007) → Trưởng phòng quy mô nhỏ (2011) → Trưởng phòng quản lý cấp cao 129–150+ nhân sự (2013–2026+)',
      '• Đa lĩnh vực (8+ tập đoàn): Viễn thông & HTVC, Game/eSports (Garena), TMĐT (Shopee), Ví điện tử (AirPay, MoMo, Ví ECO), Bảo hiểm (Prudential), Công nghệ AI/CX',
      '• 4 Kỹ năng trọng tâm: Quản lý đội ngũ · Chuẩn hóa quy trình · Đào tạo kế thừa · Xây dựng hệ thống (12 phân hệ: SDP, ERP, CRM, HRM, OKR, BPM, CMS, VOC, LMS, BI, RPA, KMS)',
      '• Chỉ số nổi bật: 22+ năm kinh nghiệm | CSAT 98.2% - 99% | Vận hành AI CRM & BPO đa kênh 24/7',
      '• Liên hệ: hungthai84@gmail.com | Hotline/Zalo: +84 0909097882 | Web: https://nguyenhungthai.powerservice.one',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(textSummary);
      onShowNotification?.('✓ Đã sao chép tóm tắt Executive Summary sẵn sàng dán lên Zalo / LinkedIn!');
    } catch {
      onShowNotification?.('Đã tạo tóm tắt năng lực thành công.');
    }
  };

  const handleExportInfographicPng = async () => {
    SoundEngine.playTap();
    setIsGeneratingPng(true);
    try {
      const W = 1600;
      const H = 2260;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onShowNotification?.('Trình duyệt không hỗ trợ xuất ảnh Canvas.');
        setIsGeneratingPng(false);
        return;
      }

      const isDarkSheet = exportTheme === 'dark';
      const palette = isDarkSheet
        ? {
            bg1: '#070D1F',
            bg2: '#0F172A',
            card: '#111C33',
            subcard: '#172542',
            border: 'rgba(148, 163, 184, 0.25)',
            title: '#FFFFFF',
            text: '#E2E8F0',
            muted: '#94A3B8',
            accent: '#38BDF8',
            track: 'rgba(255,255,255,0.14)',
          }
        : {
            bg1: '#EFF6FF',
            bg2: '#F8FAFC',
            card: '#FFFFFF',
            subcard: '#F1F5F9',
            border: '#CBD5E1',
            title: '#0F172A',
            text: '#1E293B',
            muted: '#475569',
            accent: '#0284C7',
            track: '#E2E8F0',
          };

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, palette.bg1);
      bgGrad.addColorStop(1, palette.bg2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle decorative glow circles
      ctx.save();
      ctx.globalAlpha = isDarkSheet ? 0.16 : 0.12;
      ctx.fillStyle = '#0EA5E9';
      ctx.beginPath();
      ctx.arc(140, 180, 260, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8B5CF6';
      ctx.beginPath();
      ctx.arc(1460, 2060, 300, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const margin = 56;
      const contentW = W - margin * 2;

      // 1. HEADER BANNER CARD
      drawRoundedRect(ctx, margin, 48, contentW, 290, 24);
      ctx.fillStyle = palette.card;
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Avatar or crisp monogram circle
      const avatarImg = await loadCorsImage(AVATAR_URL);
      const avX = margin + 36;
      const avY = 88;
      const avSize = 200;
      ctx.save();
      drawRoundedRect(ctx, avX, avY, avSize, avSize, 24);
      ctx.clip();
      if (avatarImg) {
        ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
      } else {
        const avGrad = ctx.createLinearGradient(avX, avY, avX + avSize, avY + avSize);
        avGrad.addColorStop(0, '#0284C7');
        avGrad.addColorStop(1, '#4F46E5');
        ctx.fillStyle = avGrad;
        ctx.fillRect(avX, avY, avSize, avSize);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 74px Play, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HT', avX + avSize / 2, avY + avSize / 2 + 26);
        ctx.textAlign = 'left';
      }
      ctx.restore();

      const infoX = avX + avSize + 36;
      ctx.fillStyle = palette.accent;
      ctx.font = 'bold 20px Play, sans-serif';
      ctx.fillText('One-Page Executive Summary Sheet · Hồ sơ Năng lực Quản trị', infoX, 114);

      ctx.fillStyle = palette.title;
      ctx.font = 'bold 50px Play, sans-serif';
      ctx.fillText('Nguyễn Hùng Thái', infoX, 174);

      ctx.fillStyle = palette.text;
      ctx.font = 'bold 25px Play, sans-serif';
      ctx.fillText('Chuyên Gia Vận Hành CSKH & Chuyển Đổi Số · CX & Operations Director', infoX, 218);

      ctx.fillStyle = palette.muted;
      ctx.font = '21px Play, sans-serif';
      ctx.fillText(
        'Email: hungthai84@gmail.com   •   Hotline/Zalo: +84 0909097882   •   TP. Hồ Chí Minh',
        infoX,
        264
      );
      ctx.fillStyle = palette.accent;
      ctx.font = 'bold 20px Play, sans-serif';
      ctx.fillText(
        'Portal: https://nguyenhungthai.powerservice.one   •   linkedin.com/in/hungthai84',
        infoX,
        304
      );

      // 2. KPI STRIP (4 cards)
      const kpiY = 364;
      const kpiGap = 20;
      const kpiW = (contentW - kpiGap * 3) / 4;
      ABOUT_PROFILE_STATS.forEach((stat, idx) => {
        const kx = margin + idx * (kpiW + kpiGap);
        drawRoundedRect(ctx, kx, kpiY, kpiW, 138, 20);
        ctx.fillStyle = palette.card;
        ctx.fill();
        ctx.strokeStyle = palette.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = stat.color;
        ctx.font = 'bold 48px Play, sans-serif';
        ctx.fillText(stat.metric, kx + 24, kpiY + 64);

        ctx.fillStyle = palette.title;
        ctx.font = 'bold 21px Play, sans-serif';
        ctx.fillText(stat.labelVi, kx + 24, kpiY + 100);

        if (stat.unitVi) {
          ctx.fillStyle = palette.muted;
          ctx.font = '17px Play, sans-serif';
          ctx.fillText(stat.unitVi, kx + 24, kpiY + 124);
        }
      });

      // 3. THREE PILLARS BAR
      const philY = 528;
      const philGap = 20;
      const philW = (contentW - philGap * 2) / 3;
      const philColors = ['#2563EB', '#E11D48', '#059669'];
      SERVICE_PHILOSOPHY_VALUES.forEach((val, idx) => {
        const px = margin + idx * (philW + philGap);
        drawRoundedRect(ctx, px, philY, philW, 128, 20);
        ctx.fillStyle = palette.card;
        ctx.fill();
        ctx.strokeStyle = palette.border;
        ctx.stroke();

        ctx.fillStyle = philColors[idx % philColors.length];
        ctx.font = 'bold 24px Play, sans-serif';
        ctx.fillText(val.titleVi, px + 22, philY + 42);

        ctx.fillStyle = palette.text;
        ctx.font = '19px Play, sans-serif';
        wrapCanvasText(ctx, val.descVi, px + 22, philY + 76, philW - 44, 26, 2);
      });

      // 4. TWO COLUMN BODY: LEFT (CAREER 2002-2026) | RIGHT (6 CORE DOMAINS)
      const bodyY = 682;
      const colGap = 24;
      const leftW = Math.round(contentW * 0.56);
      const rightW = contentW - leftW - colGap;
      const bodyH = 660;

      // Left Card: Career Milestones
      drawRoundedRect(ctx, margin, bodyY, leftW, bodyH, 22);
      ctx.fillStyle = palette.card;
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.stroke();

      ctx.fillStyle = palette.accent;
      ctx.font = 'bold 26px Play, sans-serif';
      ctx.fillText('Hành trình Lãnh đạo & Vận hành (2002 – 2026+)', margin + 28, bodyY + 46);

      milestones.forEach((m, idx) => {
        const rowY = bodyY + 76 + idx * 71;
        drawRoundedRect(ctx, margin + 24, rowY, leftW - 48, 60, 14);
        ctx.fillStyle = palette.subcard;
        ctx.fill();

        ctx.fillStyle = m.hexColor || '#0284C7';
        ctx.font = 'bold 19px Play, sans-serif';
        ctx.fillText(`${m.period} · ${m.company}`, margin + 40, rowY + 26);

        ctx.fillStyle = palette.text;
        ctx.font = '17px Play, sans-serif';
        const roleLine = `${m.roleVi}${m.headcount ? ` · ${m.headcount} nhân sự` : ''}`;
        ctx.fillText(roleLine.slice(0, 74), margin + 40, rowY + 49);
      });

      // Right Card: 6 Core Domains
      const rightX = margin + leftW + colGap;
      drawRoundedRect(ctx, rightX, bodyY, rightW, bodyH, 22);
      ctx.fillStyle = palette.card;
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 26px Play, sans-serif';
      ctx.fillText('6 Lĩnh vực Chuyên môn Cốt lõi', rightX + 28, bodyY + 46);

      const domainColors = ['#0284C7', '#EA580C', '#E11D48', '#7C3AED', '#4F46E5', '#059669'];
      DOMAINS_DATA.forEach((d, idx) => {
        const dy = bodyY + 76 + idx * 94;
        drawRoundedRect(ctx, rightX + 24, dy, rightW - 48, 82, 14);
        ctx.fillStyle = palette.subcard;
        ctx.fill();

        ctx.fillStyle = domainColors[idx % domainColors.length];
        ctx.font = 'bold 19px Play, sans-serif';
        ctx.fillText(`${d.id}. ${d.title}`, rightX + 38, dy + 28);

        ctx.fillStyle = palette.muted;
        ctx.font = '16px Play, sans-serif';
        wrapCanvasText(ctx, d.typicalRolesLine || d.subtitle, rightX + 38, dy + 54, rightW - 76, 22, 2);
      });

      // 5. SWOT MATRIX + LANGUAGES (y = 1368, h = 470)
      const swotY = 1368;
      const swotH = 470;
      drawRoundedRect(ctx, margin, swotY, contentW, swotH, 22);
      ctx.fillStyle = palette.card;
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.stroke();

      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 26px Play, sans-serif';
      ctx.fillText('Ma trận Năng lực SWOT & Ngoại ngữ Điều hành', margin + 28, swotY + 46);

      const swotGroups = [
        { title: 'Thế mạnh cốt lõi (S)', data: STRENGTHS_DATA, color: '#0284C7', isThreat: false },
        { title: 'Khía cạnh hoàn thiện (W)', data: WEAKNESSES_DATA, color: '#16A34A', isThreat: false },
        { title: 'Cơ hội phát triển (O)', data: OPPORTUNITIES_DATA, color: '#EA580C', isThreat: false },
        { title: 'Thách thức thích ứng (T)', data: THREATS_DATA, color: '#E11D48', isThreat: true },
      ];
      const swGap = 18;
      const swW = (contentW - 56 - swGap * 3) / 4;

      swotGroups.forEach((grp, gIdx) => {
        const gx = margin + 28 + gIdx * (swW + swGap);
        const gy = swotY + 70;
        drawRoundedRect(ctx, gx, gy, swW, 290, 16);
        ctx.fillStyle = palette.subcard;
        ctx.fill();

        ctx.fillStyle = grp.color;
        ctx.font = 'bold 19px Play, sans-serif';
        ctx.fillText(grp.title, gx + 16, gy + 30);

        grp.data.forEach((sk, sIdx) => {
          const sy = gy + 54 + sIdx * 58;
          ctx.fillStyle = palette.text;
          ctx.font = 'bold 15px Play, sans-serif';
          const shortLabel = sk.labelVi.length > 23 ? `${sk.labelVi.slice(0, 22)}…` : sk.labelVi;
          ctx.fillText(shortLabel, gx + 16, sy + 14);

          ctx.fillStyle = grp.color;
          ctx.textAlign = 'right';
          ctx.font = 'bold 14px Play, sans-serif';
          ctx.fillText(grp.isThreat ? `Tác động ${sk.percent}%` : `${sk.percent}%`, gx + swW - 16, sy + 14);
          ctx.textAlign = 'left';

          // Track bar
          drawRoundedRect(ctx, gx + 16, sy + 24, swW - 32, 9, 5);
          ctx.fillStyle = palette.track;
          ctx.fill();

          drawRoundedRect(
            ctx,
            gx + 16,
            sy + 24,
            Math.max(12, Math.round(((swW - 32) * sk.percent) / 100)),
            9,
            5
          );
          ctx.fillStyle = grp.color;
          ctx.fill();
        });
      });

      // Languages bar inside SWOT bottom
      const langY = swotY + 378;
      const langW = (contentW - 56 - 36) / 3;
      LANGUAGES_DATA.forEach((lg, idx) => {
        const lx = margin + 28 + idx * (langW + 18);
        drawRoundedRect(ctx, lx, langY, langW, 68, 14);
        ctx.fillStyle = palette.subcard;
        ctx.fill();

        ctx.fillStyle = palette.title;
        ctx.font = 'bold 18px Play, sans-serif';
        ctx.fillText(`${lg.nameVi} (${lg.percent}%)`, lx + 16, langY + 28);

        ctx.fillStyle = palette.muted;
        ctx.font = '15px Play, sans-serif';
        ctx.fillText((lg.roleVi || lg.levelVi).slice(0, 48), lx + 16, langY + 52);
      });

      // 6. ENTERPRISE SYSTEMS PORTAL + FOOTER (y = 1864, h = 340)
      const sysY = 1864;
      drawRoundedRect(ctx, margin, sysY, contentW, 260, 22);
      ctx.fillStyle = palette.card;
      ctx.fill();
      ctx.strokeStyle = palette.border;
      ctx.stroke();

      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 26px Play, sans-serif';
      ctx.fillText('Hệ sinh thái 12 Phân hệ Quản trị Trực tuyến (powerservice.one)', margin + 28, sysY + 46);

      const chipW = (contentW - 56 - 14 * 5) / 6;
      ENTERPRISE_SYSTEMS_LIST.slice(0, 12).forEach((sys, idx) => {
        const row = Math.floor(idx / 6);
        const col = idx % 6;
        const cx = margin + 28 + col * (chipW + 14);
        const cy = sysY + 72 + row * 82;

        drawRoundedRect(ctx, cx, cy, chipW, 68, 14);
        ctx.fillStyle = palette.subcard;
        ctx.fill();
        ctx.strokeStyle = palette.border;
        ctx.stroke();

        ctx.fillStyle = sys.themeColor || '#4F46E5';
        ctx.font = 'bold 20px Play, sans-serif';
        ctx.fillText(sys.code || sys.abbr || '', cx + 14, cy + 28);

        ctx.fillStyle = palette.text;
        ctx.font = '14px Play, sans-serif';
        ctx.fillText((sys.nameVi || sys.name || '').slice(0, 22), cx + 14, cy + 52);
      });

      // Bottom Signature Footer
      ctx.fillStyle = palette.muted;
      ctx.font = 'bold 19px Play, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Xuất bản từ Portfolio Chính thức · Nguyễn Hùng Thái · https://nguyenhungthai.powerservice.one · Hotline/Zalo: +84 0909097882',
        W / 2,
        2192
      );
      ctx.textAlign = 'left';

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Nguyen_Hung_Thai_Executive_Summary_${exportTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowNotification?.(
        '✓ Đã tải ảnh Infographic 1 trang chất lượng cao (1600×2260px) sẵn sàng chia sẻ qua Zalo / LinkedIn!'
      );
    } catch {
      onShowNotification?.('Không thể tạo ảnh PNG Infographic. Vui lòng thử lại.');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div id="executive-summary-sheet" className="w-full max-w-[1250px] mx-auto flex flex-col gap-[15px] font-play">
      {/* Toolbar xuất Infographic 1 trang (no-print) */}
      <div
        data-section-card="true"
        className="bento-card glass-card no-print p-[15px] rounded-[14px] flex flex-wrap items-center justify-between gap-3"
      >
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="card-header-sync flex items-center gap-2 min-w-0 text-indigo-600 dark:text-indigo-400">
              <WebIcon name="sparkles" size={18} className="shrink-0" />
              <h2 className="typo-h4 card-title-synced font-bold text-indigo-600 dark:text-indigo-400 truncate" data-card-title="true">
                One-Page Executive Summary Sheet
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center p-1 rounded-full border gap-1"
            style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
          >
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setExportTheme('light');
              }}
              className={`px-3 py-1 rounded-full typo-badge cursor-pointer transition ${
                exportTheme === 'light'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:opacity-80'
              }`}
            >
              Ảnh Sáng
            </button>
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setExportTheme('dark');
              }}
              className={`px-3 py-1 rounded-full typo-badge cursor-pointer transition ${
                exportTheme === 'dark'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:opacity-80'
              }`}
            >
              Ảnh Tối
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopySummaryText}
            className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full typo-button cursor-pointer transition active:scale-95"
          >
            <WebIcon name="copy" size={15} />
            <span>Sao chép Zalo / LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={handleExportInfographicPng}
            disabled={isGeneratingPng}
            style={{ background: 'var(--bg-button-primary)', color: '#FFFFFF' }}
            className="banner-primary-cta inline-flex items-center gap-2 px-4 py-2 rounded-full typo-button cursor-pointer transition active:scale-95 disabled:opacity-60"
          >
            <WebIcon name="download" size={16} className="text-white" />
            <span>{isGeneratingPng ? 'Đang xuất ảnh PNG...' : 'Tải ảnh Infographic PNG'}</span>
          </button>
            </div>
          </div>
          <p className="typo-caption text-[var(--text-secondary)]">
            Xuất ảnh Infographic 1 trang (1600×2260px) chia sẻ nhanh qua Zalo hoặc LinkedIn
          </p>
        </div>
      </div>

      {/* Bản xem trước Infographic 1 trang */}
      <article
        data-section-card="true"
        className="bento-card glass-card p-[15px] rounded-[14px] flex flex-col gap-[15px] print-card-bg"
      >
        {/* Header Profile Row */}
        <div
          data-subcard="true"
          className="sub-card p-[15px] rounded-[14px] flex flex-col md:flex-row items-center md:items-start gap-[15px] print-card-bg"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[14px] overflow-hidden ring-2 ring-[var(--border-subcard)] shrink-0">
            <img
              src={AVATAR_URL}
              alt="Nguyễn Hùng Thái"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <span className="typo-label font-bold text-blue-600 dark:text-sky-400">
              One-Page Executive Summary Sheet
            </span>
            <h2 className="typo-h2 font-bold text-[var(--text-primary)] mt-0.5">
              Nguyễn Hùng Thái
            </h2>
            <p className="typo-h5 font-semibold text-cyan-700 dark:text-cyan-300 mt-0.5">
              Chuyên Gia Vận Hành CSKH &amp; Chuyển Đổi Số · CX &amp; Operations Director
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 typo-caption text-[var(--text-secondary)]">
              <span>📧 hungthai84@gmail.com</span>
              <span>•</span>
              <span>📞 +84 0909097882</span>
              <span>•</span>
              <span>🌐 nguyenhungthai.powerservice.one</span>
              <span>•</span>
              <span>📍 TP. Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>
        </div>

        {/* 4 Executive KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px]">
          {ABOUT_PROFILE_STATS.map((stat) => (
            <div
              key={stat.id}
              data-subcard="true"
              className="sub-card p-[15px] rounded-[14px] text-center flex flex-col justify-center print-card-bg"
            >
              <span className="typo-kpi font-bold" style={{ color: stat.color }}>
                {stat.metric}
              </span>
              <span className="typo-body-sm font-bold text-[var(--text-primary)] mt-1">
                {stat.labelVi}
              </span>
              {stat.unitVi && (
                <span className="typo-caption text-[var(--text-muted)]">{stat.unitVi}</span>
              )}
            </div>
          ))}
        </div>

        {/* 2 Cột chính: Hành trình 8 tập đoàn & 6 Lĩnh vực trọng tâm */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px]">
          <div
            data-subcard="true"
            className="sub-card lg:col-span-7 p-[15px] rounded-[14px] flex flex-col gap-2.5 print-card-bg min-w-0"
          >
            <div className="border-b border-[var(--border-subcard)] pb-2 flex flex-col gap-0.5">
              <h3 className="subcard-header-sync subcard-title-synced typo-h4 font-bold text-blue-600 dark:text-sky-400" data-subcard-title="true">
                Lộ trình Thăng tiến &amp; Đa lĩnh vực (2002 – 2026+)
              </h3>
              <p className="typo-caption text-[var(--text-muted)] font-medium">
                Nhân viên → Giám sát → Trưởng phòng quy mô nhỏ → Trưởng phòng cấp cao · Kỹ năng: Quản lý · Quy trình · Đào tạo · Xây dựng hệ thống
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="nested-card p-2.5 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] min-w-0"
                >
                  <div className="typo-caption font-bold truncate" style={{ color: m.hexColor || '#0284c7' }}>
                    {m.period} · {m.company}
                  </div>
                  <div className="typo-body-sm font-semibold text-[var(--text-primary)] truncate">
                    {m.roleVi}
                  </div>
                  {m.headcount && (
                    <div className="typo-caption text-[var(--text-muted)] truncate">
                      Quy mô: {m.headcount} nhân sự
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            data-subcard="true"
            className="sub-card lg:col-span-5 p-[15px] rounded-[14px] flex flex-col gap-2.5 print-card-bg min-w-0"
          >
            <h3 className="subcard-header-sync subcard-title-synced typo-h4 font-bold text-emerald-600 dark:text-emerald-400 border-b border-[var(--border-subcard)] pb-2" data-subcard-title="true">
              6 Lĩnh vực Chuyên môn
            </h3>
            <div className="flex flex-col gap-2">
              {DOMAINS_DATA.map((d) => (
                <div
                  key={d.id}
                  className="nested-card p-2.5 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] min-w-0"
                >
                  <div className="typo-body-sm font-bold text-[var(--text-primary)] truncate">
                    {d.id}. {d.title}
                  </div>
                  <div className="typo-caption text-[var(--text-secondary)] truncate">
                    {d.typicalRolesLine || d.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tóm tắt SWOT + 12 Hệ thống */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px]">
          <div
            data-subcard="true"
            className="sub-card lg:col-span-6 p-[15px] rounded-[14px] flex flex-col gap-2.5 print-card-bg min-w-0"
          >
            <h3 className="subcard-header-sync subcard-title-synced typo-h4 font-bold text-rose-600 dark:text-rose-400 border-b border-[var(--border-subcard)] pb-2" data-subcard-title="true">
              Năng lực Cốt lõi &amp; Thích ứng (SWOT)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STRENGTHS_DATA.slice(0, 2).map((s) => (
                <div key={s.id} className="nested-card p-2.5 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-nested-card)]">
                  <div className="flex justify-between gap-2 typo-caption font-bold">
                    <span className="text-[var(--text-primary)] truncate">{s.labelVi}</span>
                    <span className="text-blue-600 dark:text-sky-400 shrink-0">{s.percent}%</span>
                  </div>
                </div>
              ))}
              {THREATS_DATA.slice(0, 2).map((t) => (
                <div key={t.id} className="nested-card p-2.5 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-nested-card)]">
                  <div className="flex justify-between gap-2 typo-caption font-bold">
                    <span className="text-[var(--text-primary)] truncate">{t.labelVi}</span>
                    <span className="text-rose-600 dark:text-rose-400 shrink-0" title="Mức độ tác động">
                      Mức độ tác động {t.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            data-subcard="true"
            className="sub-card lg:col-span-6 p-[15px] rounded-[14px] flex flex-col gap-2.5 print-card-bg min-w-0"
          >
            <h3 className="subcard-header-sync subcard-title-synced typo-h4 font-bold text-indigo-600 dark:text-indigo-400 border-b border-[var(--border-subcard)] pb-2" data-subcard-title="true">
              12 Hệ sinh thái Số (powerservice.one)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {ENTERPRISE_SYSTEMS_LIST.map((sys) => (
                <span
                  key={sys.id}
                  className="px-2.5 py-1 rounded-[14px] typo-caption font-bold border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] text-[var(--text-primary)]"
                >
                  <strong style={{ color: sys.themeColor || '#4f46e5' }}>{sys.code || sys.abbr || ''}</strong> · {sys.nameVi || sys.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ExecutiveSummarySheet;
