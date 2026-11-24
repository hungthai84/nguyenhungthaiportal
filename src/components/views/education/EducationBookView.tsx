'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { PageFlip, type PageFlipHandle } from '@/components/ui/PageFlip';
import { cn, formatCardTitle } from '@/lib/utils';
import {
  CREDENTIAL_VERIFICATION_MAP,
  EducationCourse,
} from '@/data/education';

export interface EducationBookViewProps {
  course: EducationCourse;
  courseColor: string;
  categoryLabel: string;
  isEn: boolean;
  isDark: boolean;
  getSkillTagIcon: (tag: string) => string;
  onClose: () => void;
  onNavigateSkillToSwot: (skill: string) => void;
  onOpenVerifyModal: (course: EducationCourse, e?: React.MouseEvent) => void;
  onOpenLightbox: (imgSrc: string, title: string, e?: React.MouseEvent) => void;
  disableKeyboardNav?: boolean;
}


function handleDriveImageFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const currentSrc = img.getAttribute('src') || '';
  const match = currentSrc.match(/lh3\.googleusercontent\.com\/d\/([^/?]+)/);
  if (match && match[1]) {
    img.onerror = null;
    img.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920`;
  }
}

export const EducationBookView: React.FC<EducationBookViewProps> = ({
  course,
  courseColor,
  categoryLabel,
  isEn,
  isDark,
  getSkillTagIcon,
  onClose,
  onNavigateSkillToSwot,
  onOpenVerifyModal,
  onOpenLightbox,
  disableKeyboardNav = false,
}) => {
  const bookHandleRef = useRef<PageFlipHandle | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lastStageWheelRef = useRef<number>(0);
  const [stageBounds, setStageBounds] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const verifyInfo = CREDENTIAL_VERIFICATION_MAP[course.id];

  // Đo chính xác kích thước khung thẻ chi tiết học vấn để sách luôn nằm gọn 100% ở mọi kích thước
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateBounds = () => {
      const rect = el.getBoundingClientRect();
      setStageBounds({
        w: Math.max(0, Math.floor(rect.width)),
        h: Math.max(0, Math.floor(rect.height)),
      });
    };
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tính kích thước sách tối ưu luôn lọt lòng thẻ ở mọi độ rộng & chiều cao (cả 2 trang đối xứng và 1 trang hẹp)
  const fittedBook = useMemo(() => {
    const padX = stageBounds.w >= 640 ? 28 : 12;
    const padTop = stageBounds.w < 680 ? 48 : 20;
    const padBottom = stageBounds.h >= 480 ? 20 : 12;
    const availW = Math.max(120, stageBounds.w - padX * 2);
    const availH = Math.max(140, stageBounds.h - padTop - padBottom);
    const isSingle = availW < 520;

    if (isSingle) {
      const targetRatio = 0.75; // 3:4 cho 1 trang sách dọc
      let pageW = availW;
      let pageH = pageW / targetRatio;
      if (pageH > availH) {
        pageH = availH;
        pageW = pageH * targetRatio;
      }
      return {
        isSingle: true,
        frameWidth: Math.min(availW, Math.max(120, Math.floor(pageW))),
        bookHeight: Math.min(availH, Math.max(140, Math.floor(pageH))),
      };
    }

    const targetRatio = 16 / 10; // 1.6 cho trang đôi đối xứng
    let bookW = Math.min(availW, 980);
    let bookH = bookW / targetRatio;
    if (bookH > availH) {
      bookH = availH;
      bookW = bookH * targetRatio;
    }
    return {
      isSingle: false,
      frameWidth: Math.min(availW, Math.max(220, Math.floor(bookW))),
      bookHeight: Math.min(availH, Math.max(140, Math.floor(bookH))),
    };
  }, [stageBounds.h, stageBounds.w]);

  // Hỗ trợ lăn chuột mở trang ngay cả khi con trỏ nằm ở khoảng trống hai bên sách trong thẻ chi tiết
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || disableKeyboardNav) return;

    const handleStageWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < 8) return;

      const dir: 1 | -1 = dominantDelta > 0 ? 1 : -1;

      // Nếu đang cuộn nội dung chữ bên trong trang sách và chưa chạm biên, ưu tiên cuộn nội dung trang
      if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
        let el = event.target as HTMLElement | null;
        while (el && el !== stage) {
          const style = window.getComputedStyle(el);
          const overflowY = style.overflowY;
          if (
            (overflowY === 'auto' || overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight + 2
          ) {
            const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
            const canScrollUp = el.scrollTop > 2;
            if ((dir === 1 && canScrollDown) || (dir === -1 && canScrollUp)) {
              return;
            }
          }
          el = el.parentElement;
        }
      }

      event.preventDefault();
      const now = Date.now();
      if (now - lastStageWheelRef.current < 420) return;
      lastStageWheelRef.current = now;
      bookHandleRef.current?.go(dir);
    };

    stage.addEventListener('wheel', handleStageWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleStageWheel);
  }, [disableKeyboardNav]);

  // Click vùng trống bên trái/phải của sân khấu sách cũng mở/lật trang mượt mà
  const handleStageBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const currentSpread = bookHandleRef.current?.getSpread() ?? 0;
    if (currentSpread === 0) {
      bookHandleRef.current?.go(1);
      return;
    }
    bookHandleRef.current?.go(clickX >= rect.width / 2 ? 1 : -1);
  };

  // Đồng bộ bảng màu nội bộ sách học vấn theo giao diện (Theme) đang chọn
  const inkPrimary = 'text-[var(--text-primary)]';
  const inkSecondary = 'text-[var(--text-secondary)]';
  const inkMuted = 'text-[var(--text-muted)]';
  const themeAccent = 'var(--text-link, var(--color-primary))';
  const paperBox = 'theme-modal-subcard';
  const paperDivider = 'border-[var(--border-subcard)]';

  const bookPages = useMemo<React.ReactNode[]>(() => {
    // ================= PAGE 0: BÌA SÁCH (THẺ HỌC VẤN) =================
    const coverPage = (
      <div
        key={`cover-${course.id}`}
        className="education-book-cover relative flex size-full flex-col justify-between gap-2.5 p-4 sm:p-5 overflow-y-auto no-scrollbar text-left"
        style={{
          background:
            'linear-gradient(155deg, color-mix(in srgb, var(--text-link, var(--color-primary)) 14%, transparent) 0%, transparent 60%)',
        }}
      >
        {/* Dải gáy bìa sách tạo chiều sâu */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2.5"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in srgb, var(--text-link, var(--color-primary)) 36%, transparent) 0%, color-mix(in srgb, var(--text-link, var(--color-primary)) 12%, transparent) 70%, transparent 100%)',
          }}
        />

        {/* Thanh metadata đỉnh bìa */}
        <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap pl-1">
          <span
            className="inline-flex items-center gap-1.5 typo-badge font-semibold"
            style={{ color: themeAccent }}
          >
            <WebIcon name="book" className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Education Monograph' : 'Bìa sách · Thẻ học vấn'}</span>
          </span>
          <span className={cn('typo-badge font-mono font-semibold tabular-nums', inkMuted)}>
            {course.code || `Năm ${course.year}`}
          </span>
        </div>

        {/* Ảnh thẻ học vấn */}
        <div
          data-media-card="image"
          style={{ borderRadius: '14px', padding: '0px' }}
          className={cn(
            'education-book-media-rounded relative w-full aspect-[16/10] overflow-hidden rounded-[14px] border shrink-0 p-0',
            paperDivider
          )}
        >
          <img
            src={course.image}
            alt={formatCardTitle(course.title)}
            style={{ borderRadius: '14px' }}
            className="education-book-media-img w-full h-full object-cover object-center block rounded-[14px]"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleDriveImageFallback}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 text-white">
            <span className="typo-badge font-semibold truncate drop-shadow-xs">
              {course.issuer}
            </span>
            <span className="typo-badge font-mono font-semibold shrink-0 tabular-nums drop-shadow-xs">
              Năm {course.year}
            </span>
          </div>
        </div>

        {/* Tiêu đề, mô tả & kết quả */}
        <div className="relative z-10 flex flex-col gap-1.5 pl-1 min-w-0">
          <div className="flex items-center gap-1.5 typo-caption font-medium">
            <span style={{ color: themeAccent }}>{course.type}</span>
            <span aria-hidden="true" className={inkMuted}>·</span>
            <span className={inkMuted}>{categoryLabel}</span>
          </div>

          <h3
            className="typo-h3 font-play font-bold leading-snug break-words m-0"
            style={{ color: themeAccent }}
          >
            {formatCardTitle(course.title)}
          </h3>

          <p className={cn('typo-caption leading-relaxed line-clamp-2 m-0', inkSecondary)}>
            {course.desc || 'Thông tin chưa được cung cấp.'}
          </p>

          {course.result && (
            <div
              className="mt-1 px-2.5 py-2 rounded-[10px] border flex items-start gap-2 min-w-0"
              style={{
                background: 'var(--bg-badge, var(--bg-subcard))',
                borderColor: 'var(--border-badge, var(--border-subcard))',
              }}
            >
              <p
                className="typo-caption font-semibold m-0 line-clamp-2 break-words"
                style={{ color: 'var(--text-badge, var(--text-link, var(--color-primary)))' }}
              >
                {course.result}
              </p>
            </div>
          )}
        </div>

        {/* Chân bìa sách: Gợi ý kéo góc + Nút Mở sách */}
        <div className={cn('relative z-10 pt-2 border-t flex items-center justify-between gap-2 pl-1', paperDivider)}>
          <span className={cn('typo-caption font-medium truncate', inkMuted)}>
            {isEn ? 'Drag corner or click to open' : 'Kéo góc trang hoặc chạm để mở sách'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playTap();
              bookHandleRef.current?.goToPage(1);
            }}
            className="banner-primary-cta px-3 py-1.5 rounded-full typo-badge font-semibold inline-flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shrink-0"
            style={{
              background: 'var(--bg-button-primary)',
              color: 'var(--text-button-primary, #FFFFFF)',
            }}
          >
            <span>{isEn ? 'Open' : 'Mở sách'}</span>
            <WebIcon name="arrow-right" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );

    // ================= PAGE 1: THÔNG TIN MÔ TẢ KHÓA HỌC =================
    const page1 = (
      <div
        key={`page1-${course.id}`}
        className="flex size-full flex-col gap-3 p-4 sm:p-5 overflow-y-auto no-scrollbar text-left"
      >
        <div className={cn('flex items-center justify-between gap-2 pb-2 border-b shrink-0', paperDivider)}>
          <div className="flex items-center gap-1.5 min-w-0" style={{ color: themeAccent }}>
            <WebIcon name="book-open" className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
            <h3 className="typo-h4 font-play font-bold m-0 truncate" style={{ color: themeAccent }}>
              {isEn ? 'Page 1 · Course Description' : 'Trang 1 · Mô tả khóa học'}
            </h3>
          </div>
          <span className={cn('typo-badge font-mono tabular-nums shrink-0', inkMuted)}>01 / 04</span>
        </div>

        <div className={cn('p-3 rounded-[10px] border flex flex-col gap-2', paperBox)}>
          <h4 className={cn('typo-h4 font-play font-bold m-0 leading-snug break-words', inkPrimary)}>
            {formatCardTitle(course.title)}
          </h4>
          <p className={cn('typo-body-sm leading-relaxed m-0 break-words', inkSecondary)}>
            {course.desc || 'Thông tin chưa được cung cấp.'}
          </p>

          {course.orientation && course.orientation !== course.desc && (
            <div className={cn('pt-2 border-t flex flex-col gap-0.5', paperDivider)}>
              <span className="typo-caption font-semibold" style={{ color: themeAccent }}>
                Định hướng đào tạo
              </span>
              <p className={cn('typo-caption leading-relaxed m-0 break-words', inkSecondary)}>
                {course.orientation}
              </p>
            </div>
          )}

          {course.focus && (
            <div className={cn('pt-2 border-t flex flex-col gap-0.5', paperDivider)}>
              <span className="typo-caption font-semibold" style={{ color: themeAccent }}>
                Trọng tâm chuyên môn
              </span>
              <p className={cn('typo-caption leading-relaxed m-0 break-words', inkSecondary)}>
                {course.focus}
              </p>
            </div>
          )}
        </div>

        {/* Bảng thông tin chuẩn */}
        <div className="grid grid-cols-2 gap-2 min-w-0 mt-auto">
          <div className={cn('p-2.5 rounded-[10px] border flex flex-col gap-1', paperBox)}>
            <div className="flex items-center gap-1" style={{ color: 'var(--accent-sky, var(--text-link))' }}>
              <WebIcon name="calendar" className="w-3.5 h-3.5 shrink-0" />
              <span className="typo-caption font-semibold truncate">Năm học &amp; Mã</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={cn('typo-caption font-semibold tabular-nums', inkPrimary)}>
                Năm {course.year}
              </span>
              {course.code && (
                <span className="typo-caption font-mono" style={{ color: 'var(--text-link)' }}>
                  · {course.code}
                </span>
              )}
            </div>
          </div>

          <div className={cn('p-2.5 rounded-[10px] border flex flex-col gap-1', paperBox)}>
            <div className="flex items-center gap-1" style={{ color: 'var(--accent-indigo, var(--text-link))' }}>
              <WebIcon name="building-2" className="w-3.5 h-3.5 shrink-0" />
              <span className="typo-caption font-semibold truncate">Đơn vị đào tạo</span>
            </div>
            <span className={cn('typo-caption font-semibold break-words leading-snug', inkPrimary)}>
              {course.issuer || 'Thông tin chưa được cung cấp.'}
            </span>
          </div>

          <div className={cn('p-2.5 rounded-[10px] border flex flex-col gap-1', paperBox)}>
            <div className="flex items-center gap-1" style={{ color: 'var(--accent-teal, var(--text-link))' }}>
              <WebIcon name="layers" className="w-3.5 h-3.5 shrink-0" />
              <span className="typo-caption font-semibold truncate">Hình thức đào tạo</span>
            </div>
            <span className={cn('typo-caption font-semibold break-words leading-snug', inkPrimary)}>
              {course.type || 'Thông tin chưa được cung cấp.'}
            </span>
          </div>

          <div className={cn('p-2.5 rounded-[10px] border flex flex-col gap-1', paperBox)}>
            <div className="flex items-center gap-1" style={{ color: 'var(--accent-amber, var(--text-link))' }}>
              <WebIcon name="tag" className="w-3.5 h-3.5 shrink-0" />
              <span className="typo-caption font-semibold truncate">Nhóm lĩnh vực</span>
            </div>
            <span className={cn('typo-caption font-semibold break-words leading-snug', inkPrimary)}>
              {categoryLabel}
            </span>
          </div>
        </div>
      </div>
    );

    // ================= PAGE 2: DANH MỤC KHÓA HỌC & KỸ NĂNG =================
    const page2 = (
      <div
        key={`page2-${course.id}`}
        className="flex size-full flex-col gap-3 p-4 sm:p-5 overflow-y-auto no-scrollbar text-left"
      >
        <div className={cn('flex items-center justify-between gap-2 pb-2 border-b shrink-0', paperDivider)}>
          <div className="flex items-center gap-1.5 min-w-0" style={{ color: themeAccent }}>
            <WebIcon name="list-filter" className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
            <h3 className="typo-h4 font-play font-bold m-0 truncate" style={{ color: themeAccent }}>
              {isEn ? 'Page 2 · Curriculum' : 'Trang 2 · Danh mục khóa học'}
            </h3>
          </div>
          <span className={cn('typo-badge font-mono tabular-nums shrink-0', inkMuted)}>02 / 04</span>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <span className={cn('typo-body-sm font-semibold', inkPrimary)}>
            Nội dung chuyên đề đào tạo ({course.modules?.length || 0} chuyên đề)
          </span>

          {course.modules && course.modules.length > 0 ? (
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0 w-full">
              {course.modules.map((mod, idx) => (
                <li
                  key={idx}
                  className={cn('w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] border min-w-0', paperBox)}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center typo-badge font-mono font-bold shrink-0"
                    style={{
                      background: 'var(--bg-button-primary)',
                      color: 'var(--text-button-primary, #FFFFFF)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className={cn('typo-caption font-semibold flex-1 min-w-0 break-words leading-snug', inkPrimary)}>
                    {mod}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn('typo-caption font-semibold', inkMuted)}>
              Thông tin chưa được cung cấp.
            </p>
          )}
        </div>

        {/* Từ khóa kỹ năng đầu ra */}
        <div className={cn('pt-2 border-t flex flex-col gap-2 min-w-0 mt-auto', paperDivider)}>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--semantic-success, var(--text-link))' }}>
            <WebIcon name="sparkles" className="w-3.5 h-3.5 shrink-0" />
            <span className="typo-caption font-semibold">
              Từ khóa kỹ năng (Nhấn để xem trên Ma trận SWOT)
            </span>
          </div>

          {course.skills && course.skills.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {course.skills.map((skill, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onNavigateSkillToSwot(skill)}
                  title={isEn ? `View ${skill} in Core Skills SWOT` : `Xem kỹ năng "${skill}" trong Ma trận Kỹ năng SWOT`}
                  style={{
                    background: 'var(--bg-badge, var(--bg-button-secondary))',
                    borderColor: 'var(--border-badge, var(--border-subcard))',
                    color: 'var(--text-badge, var(--text-link))',
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-caption font-semibold border cursor-pointer transition-all hover:opacity-90"
                >
                  <WebIcon name={getSkillTagIcon(skill)} className="w-3 h-3 shrink-0" />
                  <span>{skill}</span>
                  <WebIcon name="arrow-right" className="w-2.5 h-2.5 opacity-65 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <span className={cn('typo-caption font-semibold', inkMuted)}>
              Thông tin chưa được cung cấp.
            </span>
          )}
        </div>
      </div>
    );

    // ================= PAGE 3: KẾT QUẢ ĐẠT ĐƯỢC =================
    const page3 = (
      <div
        key={`page3-${course.id}`}
        className="flex size-full flex-col gap-3 p-4 sm:p-5 overflow-y-auto no-scrollbar text-left"
      >
        <div className={cn('flex items-center justify-between gap-2 pb-2 border-b shrink-0', paperDivider)}>
          <div className="flex items-center gap-1.5 min-w-0" style={{ color: themeAccent }}>
            <WebIcon name="trophy" className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
            <h3 className="typo-h4 font-play font-bold m-0 truncate" style={{ color: themeAccent }}>
              {isEn ? 'Page 3 · Outcomes' : 'Trang 3 · Kết quả đạt được'}
            </h3>
          </div>
          <span className={cn('typo-badge font-mono tabular-nums shrink-0', inkMuted)}>03 / 04</span>
        </div>

        {/* Chứng nhận đánh giá */}
        <div
          className="p-3 rounded-[10px] border flex flex-col gap-1.5"
          style={{
            background: 'var(--bg-badge, var(--bg-subcard))',
            borderColor: 'var(--border-badge, var(--border-subcard))',
          }}
        >
          <div className="flex items-center gap-1.5" style={{ color: themeAccent }}>
            <WebIcon name="shield-check" className="w-4 h-4 shrink-0" />
            <span className="typo-body-sm font-bold">Chứng nhận đánh giá</span>
          </div>
          <p className={cn('typo-body-sm font-semibold m-0 break-words leading-snug', inkPrimary)}>
            {course.result || 'Thông tin chưa được cung cấp.'}
          </p>
        </div>

        {/* Ứng dụng thực tiễn */}
        <div className={cn('p-3 rounded-[10px] border flex flex-col gap-1.5', paperBox)}>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--accent-teal, var(--text-link))' }}>
            <WebIcon name="target" className="w-4 h-4 shrink-0" />
            <span className="typo-body-sm font-bold">Ứng dụng thực tiễn</span>
          </div>
          <p className={cn('typo-caption leading-relaxed m-0 break-words', inkSecondary)}>
            {course.application || 'Thông tin chưa được cung cấp.'}
          </p>
        </div>

        {/* Hồ sơ xác thực chứng chỉ số */}
        {verifyInfo && (
          <div className={cn('p-3 rounded-[10px] border flex flex-col gap-2.5 mt-auto', paperBox)}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5" style={{ color: 'var(--semantic-success, var(--text-link))' }}>
                <WebIcon name="check-circle-02" className="w-4 h-4 shrink-0" />
                <span className="typo-body-sm font-bold">Xác thực chứng chỉ</span>
              </div>
              <button
                type="button"
                onClick={(e) => onOpenVerifyModal(course, e)}
                style={{
                  background: 'var(--bg-button-primary)',
                  color: 'var(--text-button-primary, #FFFFFF)',
                }}
                className="px-2.5 py-1 rounded-full typo-caption font-semibold hover:opacity-90 transition inline-flex items-center gap-1 cursor-pointer"
              >
                <WebIcon name="shield-check" className="w-3 h-3" />
                <span>Tra cứu số</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 typo-caption">
              <div className="min-w-0">
                <span className={cn('block', inkMuted)}>Mã chứng chỉ số</span>
                <code className={cn('font-mono font-semibold break-all', inkPrimary)}>
                  {verifyInfo.credentialId}
                </code>
              </div>
              <div className="min-w-0">
                <span className={cn('block', inkMuted)}>Hệ thống đăng ký</span>
                <span className={cn('font-semibold break-words', inkPrimary)}>
                  {verifyInfo.registryName}
                </span>
              </div>
              <div className="min-w-0">
                <span className={cn('block', inkMuted)}>Tổ chức cấp</span>
                <span className={cn('font-semibold break-words', inkPrimary)}>
                  {verifyInfo.organization}
                </span>
              </div>
              <div className="min-w-0">
                <span className={cn('block', inkMuted)}>Trạng thái</span>
                <span className="font-semibold" style={{ color: 'var(--semantic-success, var(--text-link))' }}>
                  {verifyInfo.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    // ================= PAGE 4: HÌNH KHÓA HỌC & HÌNH BẰNG CẤP =================
    const page4 = (
      <div
        key={`page4-${course.id}`}
        className="flex size-full flex-col gap-2 p-3 sm:p-4 overflow-hidden text-left"
      >
        <div className={cn('flex items-center justify-between gap-2 pb-1.5 border-b shrink-0', paperDivider)}>
          <div className="flex items-center gap-1.5 min-w-0" style={{ color: themeAccent }}>
            <WebIcon name="image" className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
            <h3 className="typo-h4 font-play font-bold m-0 truncate" style={{ color: themeAccent }}>
              {isEn ? 'Page 4 · Photos & Certificate' : 'Trang 4 · Hình khóa học & Bằng cấp'}
            </h3>
          </div>
          <span className={cn('typo-badge font-mono tabular-nums shrink-0', inkMuted)}>04 / 04</span>
        </div>

        <div className="flex-1 min-h-0 grid grid-rows-2 gap-2">
          {/* Hình khóa học */}
          <div className={cn('h-full min-h-0 p-2 rounded-[10px] border flex flex-col gap-1.5 min-w-0', paperBox)}>
            <div className="flex items-center justify-between gap-2 shrink-0" style={{ color: 'var(--accent-purple, var(--text-link))' }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <WebIcon name="image" className="w-3.5 h-3.5 shrink-0" />
                <span className="typo-caption font-semibold truncate">Hình ảnh khóa học</span>
              </div>
              <button
                type="button"
                onClick={(e) =>
                  onOpenLightbox(
                    course.courseImg || course.image,
                    `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${formatCardTitle(course.title)}`,
                    e
                  )
                }
                className="typo-caption font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <WebIcon name="maximize" className="w-3 h-3" />
                <span>Phóng to</span>
              </button>
            </div>
            <button
              type="button"
              onClick={(e) =>
                onOpenLightbox(
                  course.courseImg || course.image,
                  `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${formatCardTitle(course.title)}`,
                  e
                )
              }
              style={{ borderRadius: '14px', padding: '0px' }}
              className={cn(
                'education-book-media-rounded relative flex-1 min-h-0 w-full rounded-[14px] overflow-hidden bg-slate-950/90 border cursor-zoom-in block p-0',
                paperDivider
              )}
              title="Nhấn để phóng to hình ảnh khóa học"
            >
              <img
                src={course.courseImg || course.image}
                alt={`Hình khóa học ${formatCardTitle(course.title)}`}
                style={{ borderRadius: '14px' }}
                className="education-book-media-img w-full h-full object-cover object-top block rounded-[14px]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleDriveImageFallback}
              />
            </button>
          </div>

          {/* Hình bằng cấp */}
          <div className={cn('h-full min-h-0 p-2 rounded-[10px] border flex flex-col gap-1.5 min-w-0', paperBox)}>
            <div className="flex items-center justify-between gap-2 shrink-0" style={{ color: 'var(--accent-rose, var(--text-link))' }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <WebIcon name="award" className="w-3.5 h-3.5 shrink-0" />
                <span className="typo-caption font-semibold truncate">Hình ảnh bằng cấp</span>
              </div>
              <button
                type="button"
                onClick={(e) =>
                  onOpenLightbox(
                    course.certImg || course.image,
                    `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${formatCardTitle(course.title)}`,
                    e
                  )
                }
                className="typo-caption font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <WebIcon name="maximize" className="w-3 h-3" />
                <span>Xem bằng</span>
              </button>
            </div>
            <button
              type="button"
              onClick={(e) =>
                onOpenLightbox(
                  course.certImg || course.image,
                  `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${formatCardTitle(course.title)}`,
                  e
                )
              }
              style={{ borderRadius: '14px', padding: '0px' }}
              className={cn(
                'education-book-media-rounded relative flex-1 min-h-0 w-full rounded-[14px] overflow-hidden bg-slate-950/90 border cursor-zoom-in block p-0',
                paperDivider
              )}
              title="Nhấn để phóng to hình ảnh bằng cấp"
            >
              <img
                src={course.certImg || course.image}
                alt={`Hình bằng cấp ${formatCardTitle(course.title)}`}
                style={{ borderRadius: '14px' }}
                className="education-book-media-img w-full h-full object-cover object-center block rounded-[14px]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleDriveImageFallback}
              />
            </button>
          </div>
        </div>

        {verifyInfo && (
          <div className={cn('pt-2 border-t flex items-center justify-between gap-2 flex-wrap shrink-0', paperDivider)}>
            <span className={cn('typo-caption truncate', inkMuted)}>
              Mã: <strong className={cn('font-mono', inkPrimary)}>{verifyInfo.credentialId}</strong>
            </span>
            <button
              type="button"
              onClick={(e) => onOpenVerifyModal(course, e)}
              style={{
                background: 'var(--bg-button-primary)',
                color: 'var(--text-button-primary, #FFFFFF)',
              }}
              className="px-2.5 py-1 rounded-full typo-caption font-semibold hover:opacity-90 transition inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <WebIcon name="shield-check" className="w-3 h-3" />
              <span>Kiểm tra trực tuyến</span>
            </button>
          </div>
        )}
      </div>
    );

    return [coverPage, page1, page2, page3, page4];
  }, [
    categoryLabel,
    course,
    getSkillTagIcon,
    inkMuted,
    inkPrimary,
    inkSecondary,
    isEn,
    onNavigateSkillToSwot,
    onOpenLightbox,
    onOpenVerifyModal,
    paperBox,
    paperDivider,
    themeAccent,
    verifyInfo,
  ]);

  return (
    <motion.div
      id="education-book-view"
      ref={stageRef}
      key={`education-book-${course.id}`}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleStageBackdropClick}
      className="relative w-full h-full flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4 font-play text-left overflow-hidden box-border select-none"
    >
      {/* Nút đóng sách ở góc trên bên phải để quay về danh sách học vấn */}
      <button
        id="education-book-close-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          SoundEngine.playBookClose();
          onClose();
        }}
        style={{ position: 'absolute', top: '12px', right: '12px' }}
        className="theme-modal-close nav-arrow-btn absolute top-3 right-3 z-40 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm"
        title={isEn ? 'Close book (Esc)' : 'Đóng sách (Esc)'}
        aria-label={isEn ? 'Close book' : 'Đóng sách'}
      >
        <WebIcon name="x" className="w-4 h-4" />
      </button>

      {/* CHỈ HIỂN THỊ SÁCH — LUÔN VỪA KHÍT TRONG THẺ CHI TIẾT HỌC VẤN Ở MỌI KÍCH THƯỚC */}
      {stageBounds.w > 0 && stageBounds.h > 0 && (
        <PageFlip
          key={`pageflip-${course.id}`}
          ref={bookHandleRef}
          pages={bookPages}
          isDark={isDark}
          accentColor={courseColor}
          disableKeyboardNav={disableKeyboardNav}
          disableWheelNav={true}
          forceSingle={fittedBook.isSingle}
          showFooterNav={false}
          soundEnabled={true}
          className="mx-auto my-auto max-w-full max-h-full"
          frameStyle={{
            width: `${fittedBook.frameWidth}px`,
            height: `${fittedBook.bookHeight}px`,
          }}
          bookClassName="aspect-auto w-full h-full"
          bookStyle={{
            height: `${fittedBook.bookHeight}px`,
          }}
        />
      )}
    </motion.div>
  );
};

export default EducationBookView;
