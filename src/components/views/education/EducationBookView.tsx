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
import {
  BOOK_COVER_BODY_FONT,
  BOOK_COVER_DISPLAY_FONT,
  EducationBookCoverArt,
  getBookCoverTheme,
} from './EducationBookCoverArt';

export interface EducationBookViewProps {
  course: EducationCourse;
  courseColor: string;
  categoryLabel: string;
  getCourseIcon?: (title: string) => string;
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
  getCourseIcon,
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

  // Đo chính xác kích thước khung thẻ chi tiết học vấn để sách và thanh điều hướng luôn nằm gọn 100%
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

  // Tỷ lệ khung sách chuẩn Kokonut UI (3:2 trang đôi = 1.5, 3:4 trang đơn = 0.75), chừa chỗ cho thanh điều hướng phía dưới
  const navBarReserve = 52;
  const fittedBook = useMemo(() => {
    const padX = stageBounds.w >= 640 ? 28 : 12;
    const padTop = stageBounds.w < 680 ? 44 : 16;
    const padBottom = stageBounds.h >= 480 ? 16 : 8;
    const availW = Math.max(140, stageBounds.w - padX * 2);
    const availH = Math.max(160, stageBounds.h - padTop - padBottom - navBarReserve);
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
        frameWidth: Math.min(availW, Math.max(140, Math.floor(pageW))),
        bookHeight: Math.min(availH, Math.max(160, Math.floor(pageH))),
      };
    }

    const targetRatio = 3 / 2; // 1.5 chuẩn Kokonut UI aspect-[3/2]
    let bookW = Math.min(availW, 880);
    let bookH = bookW / targetRatio;
    if (bookH > availH) {
      bookH = availH;
      bookW = bookH * targetRatio;
    }
    return {
      isSingle: false,
      frameWidth: Math.min(availW, Math.max(240, Math.floor(bookW))),
      bookHeight: Math.min(availH, Math.max(160, Math.floor(bookH))),
    };
  }, [stageBounds.h, stageBounds.w]);

  // Hỗ trợ lăn chuột mở trang ngay cả khi con trỏ nằm ở khoảng trống hai bên sách
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || disableKeyboardNav) return;

    const handleStageWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < 8) return;

      const dir: 1 | -1 = dominantDelta > 0 ? 1 : -1;

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

  // Click vùng trống bên trái/phải của sân khấu sách để mở/lật trang
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

  // Bảng màu mực trên giấy sách ấm (Kokonut UI Editorial Paper Palette)
  const inkPrimary = 'text-zinc-900 dark:text-zinc-100';
  const inkSecondary = 'text-zinc-600 dark:text-zinc-300';
  const inkMuted = 'text-zinc-500 dark:text-zinc-400';
  const paperDivider = 'border-zinc-200 dark:border-zinc-700/80';
  const paperSubBox = 'bg-black/[0.03] dark:bg-white/[0.04] border-zinc-200/80 dark:border-zinc-700/70';

  const bookPages = useMemo<React.ReactNode[]>(() => {
    const cleanTitle = formatCardTitle(course.title);
    const courseIconName = getCourseIcon ? getCourseIcon(course.title) : 'code';
    const bookCoverTheme = getBookCoverTheme(course, courseColor);

    // ================= PAGE 0: BÌA TRƯỚC (2 THẺ KÍNH LỎNG GLOSSY TÁCH KHỐI + BANNER RIÊNG TỪNG SÁCH) =================
    const coverPage = (
      <EducationBookCoverArt
        key={`cover-${course.id}`}
        course={course}
        courseColor={courseColor}
        categoryLabel={categoryLabel}
        courseIconName={courseIconName}
        isEn={isEn}
        variant="book"
        showSpine={true}
        imageLoading="eager"
        onImageError={handleDriveImageFallback}
      />
    );

    // ================= PAGE 1: MÔ TẢ KHÓA HỌC & THÔNG TIN CHUNG =================
    const page1 = (
      <div
        key={`page1-${course.id}`}
        className="flex size-full flex-col px-[8cqw] pt-[7cqw] pb-[5.5cqw] overflow-y-auto no-scrollbar text-left"
      >
        <p className={cn('text-[3.1cqw] font-semibold tracking-[0.14em] m-0', inkMuted)}>
          {isEn ? 'Course Description' : 'Mô tả khóa học'}
        </p>
        <div
          className="mt-[2.2cqw] h-px w-[12cqw] shrink-0"
          style={{ backgroundColor: `${courseColor}80` }}
        />

        <h3 className={cn('mt-[3.5cqw] font-play font-bold text-[5.2cqw] leading-snug tracking-tight break-words m-0', inkPrimary)}>
          {cleanTitle}
        </h3>

        <p className={cn('mt-[2.5cqw] text-[3.5cqw] leading-relaxed break-words m-0', inkSecondary)}>
          {course.desc || 'Thông tin chưa được cung cấp.'}
        </p>

        {course.orientation && course.orientation !== course.desc && (
          <div className={cn('mt-[3cqw] pt-[2.2cqw] border-t flex flex-col gap-[0.8cqw]', paperDivider)}>
            <span className="text-[3.1cqw] font-semibold" style={{ color: courseColor }}>
              Định hướng đào tạo
            </span>
            <p className={cn('text-[3.2cqw] leading-relaxed m-0 break-words', inkSecondary)}>
              {course.orientation}
            </p>
          </div>
        )}

        {course.focus && (
          <div className={cn('mt-[2.5cqw] pt-[2.2cqw] border-t flex flex-col gap-[0.8cqw]', paperDivider)}>
            <span className="text-[3.1cqw] font-semibold" style={{ color: courseColor }}>
              Trọng tâm chuyên môn
            </span>
            <p className={cn('text-[3.2cqw] leading-relaxed m-0 break-words', inkSecondary)}>
              {course.focus}
            </p>
          </div>
        )}

        {/* Bảng thông tin kiểu Kokonut UI Dotted-Leader */}
        <dl className="mt-auto pt-[3cqw] flex flex-col gap-[2.2cqw] text-[3.2cqw]">
          <div className="flex items-baseline gap-[1.5cqw]">
            <dt className={cn('shrink-0', inkMuted)}>Năm học</dt>
            <span className="mb-[0.6cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
            <dd className={cn('font-semibold tabular-nums m-0', inkPrimary)}>
              Năm {course.year} {course.code ? `· ${course.code}` : ''}
            </dd>
          </div>
          <div className="flex items-baseline gap-[1.5cqw]">
            <dt className={cn('shrink-0', inkMuted)}>Đơn vị</dt>
            <span className="mb-[0.6cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
            <dd className={cn('font-semibold text-right truncate m-0 max-w-[68%]', inkPrimary)}>
              {course.issuer || 'Thông tin chưa được cung cấp.'}
            </dd>
          </div>
          <div className="flex items-baseline gap-[1.5cqw]">
            <dt className={cn('shrink-0', inkMuted)}>Hình thức</dt>
            <span className="mb-[0.6cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
            <dd className={cn('font-semibold text-right truncate m-0 max-w-[68%]', inkPrimary)}>
              {course.type || 'Thông tin chưa được cung cấp.'}
            </dd>
          </div>
          <div className="flex items-baseline gap-[1.5cqw]">
            <dt className={cn('shrink-0', inkMuted)}>Lĩnh vực</dt>
            <span className="mb-[0.6cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
            <dd className={cn('font-semibold m-0', inkPrimary)}>{categoryLabel}</dd>
          </div>
        </dl>

        <p className={cn('mt-[3cqw] text-center text-[2.9cqw] tabular-nums m-0', inkMuted)}>
          1
        </p>
      </div>
    );

    // ================= PAGE 2: DANH MỤC KHÓA HỌC & KỸ NĂNG =================
    const page2 = (
      <div
        key={`page2-${course.id}`}
        className="flex size-full flex-col px-[8cqw] pt-[7cqw] pb-[5.5cqw] overflow-y-auto no-scrollbar text-left"
      >
        <p className={cn('text-[3.1cqw] font-semibold tracking-[0.14em] m-0', inkMuted)}>
          {isEn ? 'Curriculum & Modules' : 'Danh mục chuyên đề'}
        </p>
        <div
          className="mt-[2.2cqw] h-px w-[12cqw] shrink-0"
          style={{ backgroundColor: `${courseColor}80` }}
        />

        <div className="mt-[3.5cqw] flex flex-col gap-[2.2cqw] min-w-0">
          <span className={cn('text-[3.4cqw] font-semibold', inkPrimary)}>
            Nội dung đào tạo ({course.modules?.length || 0} chuyên đề)
          </span>

          {course.modules && course.modules.length > 0 ? (
            <ul className="flex flex-col gap-[2.2cqw] list-none p-0 m-0 w-full">
              {course.modules.map((mod, idx) => (
                <li key={idx} className="flex items-baseline gap-[2cqw] min-w-0">
                  <span
                    className="text-[3.1cqw] font-mono font-bold tabular-nums shrink-0"
                    style={{ color: courseColor }}
                  >
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className={cn('text-[3.4cqw] font-medium leading-snug break-words flex-1', inkPrimary)}>
                    {mod}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn('text-[3.2cqw] font-medium', inkMuted)}>
              Thông tin chưa được cung cấp.
            </p>
          )}
        </div>

        {/* Từ khóa kỹ năng đầu ra */}
        <div className={cn('mt-auto pt-[3cqw] border-t flex flex-col gap-[2cqw] min-w-0', paperDivider)}>
          <span className="text-[3cqw] font-semibold" style={{ color: courseColor }}>
            Từ khóa kỹ năng (Nhấn để xem trên Ma trận SWOT)
          </span>

          {course.skills && course.skills.length > 0 ? (
            <div className="flex items-center gap-[1.5cqw] flex-wrap">
              {course.skills.map((skill, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onNavigateSkillToSwot(skill)}
                  title={isEn ? `View ${skill} in Core Skills SWOT` : `Xem kỹ năng "${skill}" trong Ma trận Kỹ năng SWOT`}
                  style={{
                    borderColor: `${courseColor}40`,
                    color: courseColor,
                    backgroundColor: `${courseColor}10`,
                  }}
                  className="inline-flex items-center gap-1 px-[2.4cqw] py-[1cqw] rounded-full text-[3cqw] font-semibold border cursor-pointer transition-all hover:opacity-85"
                >
                  <WebIcon name={getSkillTagIcon(skill)} className="w-[3cqw] h-[3cqw] shrink-0" />
                  <span>{skill}</span>
                  <WebIcon name="arrow-right" className="w-[2.4cqw] h-[2.4cqw] opacity-65 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <span className={cn('text-[3.2cqw] font-medium', inkMuted)}>
              Thông tin chưa được cung cấp.
            </span>
          )}
        </div>

        <p className={cn('mt-[3cqw] text-center text-[2.9cqw] tabular-nums m-0', inkMuted)}>
          2
        </p>
      </div>
    );

    // ================= PAGE 3: KẾT QUẢ ĐẠT ĐƯỢC & XÁC THỰC =================
    const page3 = (
      <div
        key={`page3-${course.id}`}
        className="flex size-full flex-col px-[8cqw] pt-[7cqw] pb-[5.5cqw] overflow-y-auto no-scrollbar text-left"
      >
        <p className={cn('text-[3.1cqw] font-semibold tracking-[0.14em] m-0', inkMuted)}>
          {isEn ? 'Outcomes & Verification' : 'Kết quả đạt được'}
        </p>
        <div
          className="mt-[2.2cqw] h-px w-[12cqw] shrink-0"
          style={{ backgroundColor: `${courseColor}80` }}
        />

        {/* Chứng nhận đánh giá */}
        <div
          className="mt-[3.5cqw] p-[3cqw] rounded-[10px] border flex flex-col gap-[1.2cqw]"
          style={{
            backgroundColor: `${courseColor}10`,
            borderColor: `${courseColor}35`,
          }}
        >
          <div className="flex items-center gap-1.5" style={{ color: courseColor }}>
            <WebIcon name="shield-check" className="w-[3.5cqw] h-[3.5cqw] shrink-0" />
            <span className="text-[3.3cqw] font-bold">Chứng nhận đánh giá</span>
          </div>
          <p className={cn('text-[3.5cqw] font-semibold m-0 break-words leading-snug', inkPrimary)}>
            {course.result || 'Thông tin chưa được cung cấp.'}
          </p>
        </div>

        {/* Ứng dụng thực tiễn */}
        <div className={cn('mt-[2.8cqw] p-[3cqw] rounded-[10px] border flex flex-col gap-[1.2cqw]', paperSubBox)}>
          <div className="flex items-center gap-1.5" style={{ color: courseColor }}>
            <WebIcon name="target" className="w-[3.5cqw] h-[3.5cqw] shrink-0" />
            <span className="text-[3.3cqw] font-bold">Ứng dụng thực tiễn</span>
          </div>
          <p className={cn('text-[3.3cqw] leading-relaxed m-0 break-words', inkSecondary)}>
            {course.application || 'Thông tin chưa được cung cấp.'}
          </p>
        </div>

        {/* Hồ sơ xác thực chứng chỉ số */}
        {verifyInfo && (
          <div className={cn('mt-auto pt-[2.8cqw] border-t flex flex-col gap-[2cqw]', paperDivider)}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[3.2cqw] font-bold inline-flex items-center gap-1.5" style={{ color: courseColor }}>
                <WebIcon name="check-circle-02" className="w-[3.4cqw] h-[3.4cqw] shrink-0" />
                <span>Xác thực chứng chỉ</span>
              </span>
              <button
                type="button"
                onClick={(e) => onOpenVerifyModal(course, e)}
                style={{ backgroundColor: courseColor, color: '#ffffff' }}
                className="px-[2.6cqw] py-[1cqw] rounded-full text-[2.9cqw] font-semibold hover:opacity-90 transition inline-flex items-center gap-1 cursor-pointer"
              >
                <WebIcon name="shield-check" className="w-[2.8cqw] h-[2.8cqw]" />
                <span>Tra cứu số</span>
              </button>
            </div>

            <dl className="flex flex-col gap-[1.5cqw] text-[3cqw] m-0">
              <div className="flex items-baseline gap-[1.5cqw]">
                <dt className={cn('shrink-0', inkMuted)}>Mã số</dt>
                <span className="mb-[0.5cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
                <dd className={cn('font-mono font-semibold m-0', inkPrimary)}>{verifyInfo.credentialId}</dd>
              </div>
              <div className="flex items-baseline gap-[1.5cqw]">
                <dt className={cn('shrink-0', inkMuted)}>Đăng ký</dt>
                <span className="mb-[0.5cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
                <dd className={cn('font-semibold text-right truncate max-w-[68%] m-0', inkPrimary)}>
                  {verifyInfo.registryName}
                </dd>
              </div>
              <div className="flex items-baseline gap-[1.5cqw]">
                <dt className={cn('shrink-0', inkMuted)}>Trạng thái</dt>
                <span className="mb-[0.5cqw] flex-1 border-b border-dotted border-zinc-300 dark:border-zinc-700" />
                <dd className="font-semibold m-0" style={{ color: courseColor }}>
                  {verifyInfo.status}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <p className={cn('mt-[3cqw] text-center text-[2.9cqw] tabular-nums m-0', inkMuted)}>
          3
        </p>
      </div>
    );

    // ================= PAGE 4: HÌNH KHÓA HỌC & HÌNH BẰNG CẤP =================
    const page4 = (
      <div
        key={`page4-${course.id}`}
        className="flex size-full flex-col px-[7.5cqw] pt-[7cqw] pb-[5.5cqw] overflow-hidden text-left"
      >
        <p className={cn('text-[3.1cqw] font-semibold tracking-[0.14em] m-0', inkMuted)}>
          {isEn ? 'Photos & Certificate' : 'Hình khóa học & Bằng cấp'}
        </p>
        <div
          className="mt-[2.2cqw] h-px w-[12cqw] shrink-0"
          style={{ backgroundColor: `${courseColor}80` }}
        />

        <div className="mt-[3cqw] flex-1 min-h-0 grid grid-rows-2 gap-[2.5cqw]">
          {/* Hình khóa học */}
          <div className={cn('h-full min-h-0 p-[2cqw] rounded-[10px] border flex flex-col gap-[1.4cqw] min-w-0', paperSubBox)}>
            <div className="flex items-center justify-between gap-2 shrink-0" style={{ color: courseColor }}>
              <span className="text-[3cqw] font-semibold truncate flex items-center gap-1">
                <WebIcon name="image" className="w-[3cqw] h-[3cqw] shrink-0" />
                <span>Hình ảnh khóa học</span>
              </span>
              <button
                type="button"
                onClick={(e) =>
                  onOpenLightbox(
                    course.courseImg || course.image,
                    `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${cleanTitle}`,
                    e
                  )
                }
                className="text-[2.9cqw] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <WebIcon name="maximize" className="w-[2.8cqw] h-[2.8cqw]" />
                <span>Phóng to</span>
              </button>
            </div>
            <button
              type="button"
              onClick={(e) =>
                onOpenLightbox(
                  course.courseImg || course.image,
                  `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${cleanTitle}`,
                  e
                )
              }
              className={cn(
                'education-book-media-rounded relative flex-1 min-h-0 w-full rounded-[10px] overflow-hidden bg-zinc-950/90 border cursor-zoom-in block p-0',
                paperDivider
              )}
              title="Nhấn để phóng to hình ảnh khóa học"
            >
              <img
                src={course.courseImg || course.image}
                alt={`Hình khóa học ${cleanTitle}`}
                className="education-book-media-img w-full h-full object-cover object-top block"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleDriveImageFallback}
              />
            </button>
          </div>

          {/* Hình bằng cấp */}
          <div className={cn('h-full min-h-0 p-[2cqw] rounded-[10px] border flex flex-col gap-[1.4cqw] min-w-0', paperSubBox)}>
            <div className="flex items-center justify-between gap-2 shrink-0" style={{ color: courseColor }}>
              <span className="text-[3cqw] font-semibold truncate flex items-center gap-1">
                <WebIcon name="award" className="w-[3cqw] h-[3cqw] shrink-0" />
                <span>Hình ảnh bằng cấp</span>
              </span>
              <button
                type="button"
                onClick={(e) =>
                  onOpenLightbox(
                    course.certImg || course.image,
                    `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${cleanTitle}`,
                    e
                  )
                }
                className="text-[2.9cqw] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <WebIcon name="maximize" className="w-[2.8cqw] h-[2.8cqw]" />
                <span>Xem bằng</span>
              </button>
            </div>
            <button
              type="button"
              onClick={(e) =>
                onOpenLightbox(
                  course.certImg || course.image,
                  `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${cleanTitle}`,
                  e
                )
              }
              className={cn(
                'education-book-media-rounded relative flex-1 min-h-0 w-full rounded-[10px] overflow-hidden bg-zinc-950/90 border cursor-zoom-in block p-0',
                paperDivider
              )}
              title="Nhấn để phóng to hình ảnh bằng cấp"
            >
              <img
                src={course.certImg || course.image}
                alt={`Hình bằng cấp ${cleanTitle}`}
                className="education-book-media-img w-full h-full object-cover object-center block"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleDriveImageFallback}
              />
            </button>
          </div>
        </div>

        <p className={cn('mt-[2.5cqw] text-center text-[2.9cqw] tabular-nums m-0', inkMuted)}>
          4
        </p>
      </div>
    );

    // ================= PAGE 5: BÌA SAU (KHÔNG ĐÓNG KHUNG, PADDING 15PX ĐỒNG BỘ BÌA TRƯỚC) =================
    const backCover = (
      <div
        key={`back-${course.id}`}
        className="relative flex size-full flex-col items-center justify-center text-center text-white select-none overflow-hidden box-border"
        style={{
          background: bookCoverTheme.bottomGradient,
          padding: '15px',
          fontFamily: BOOK_COVER_BODY_FONT,
        }}
      >
        {/* Subtle right-edge French-groove spine hinge matching back hardcover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[3.6cqw]"
          style={{
            background:
              'linear-gradient(270deg, rgba(4, 10, 28, 0.42) 0%, rgba(4, 10, 28, 0.16) 40%, rgba(255, 255, 255, 0.18) 58%, transparent 100%)',
          }}
        />

        {/* Soft seamless studio glass reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 84% 50% at 18% 6%, rgba(255, 255, 255, 0.22) 0%, transparent 60%), radial-gradient(ellipse 68% 52% at 86% 90%, rgba(255, 255, 255, 0.10) 0%, transparent 56%)',
          }}
        />

        {/* Subtle bottom iridescent aurora accent */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 72"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[14%] opacity-75"
        >
          <defs>
            <linearGradient
              id={`back-wave-${course.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={bookCoverTheme.wave1} stopOpacity="0.80" />
              <stop offset="52%" stopColor={bookCoverTheme.wave2} stopOpacity="0.68" />
              <stop offset="100%" stopColor={bookCoverTheme.wave3} stopOpacity="0.82" />
            </linearGradient>
          </defs>
          <path
            d="M0,48 C104,24 190,70 284,52 C340,40 374,22 400,28 L400,72 L0,72 Z"
            fill={`url(#back-wave-${course.id})`}
            opacity="0.52"
          />
        </svg>

        <WebIcon
          name="award"
          className="relative z-10 w-[10cqw] h-[10cqw] text-white/95 mb-[3.2cqw] drop-shadow-[0_2px_10px_rgba(2,10,32,0.35)]"
        />

        <p
          className="relative z-10 font-semibold text-[3cqw] tracking-[0.06em] text-white/80 m-0"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          {categoryLabel}
        </p>

        <p
          className="relative z-10 mt-[1.8cqw] font-extrabold text-[6.3cqw] leading-[1.12] tracking-[-0.025em] text-white m-0 drop-shadow-[0_2px_10px_rgba(2,10,32,0.40)]"
          style={{
            fontFamily: BOOK_COVER_DISPLAY_FONT,
            textWrap: 'balance',
          }}
        >
          {cleanTitle}
        </p>

        <div
          className="relative z-10 mt-[2.6cqw] flex flex-col items-center gap-[1.1cqw] text-[3.15cqw] leading-relaxed text-white/90"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          <span className="font-semibold">{course.issuer}</span>
          <span className="inline-flex items-center gap-[1.5cqw] text-[2.95cqw] text-white/82 tabular-nums">
            <span>{isEn ? `Year ${course.year}` : `Năm ${course.year}`}</span>
            {verifyInfo?.credentialId && (
              <>
                <span aria-hidden="true" className="text-white/50 font-bold">
                  ·
                </span>
                <span>{verifyInfo.credentialId}</span>
              </>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            SoundEngine.playBookClose();
            onClose();
          }}
          className="relative z-10 mt-[6cqw] inline-flex items-center gap-[1.8cqw] px-[5cqw] py-[2cqw] rounded-full text-[3.05cqw] font-semibold text-white bg-white/16 hover:bg-white/24 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer border-0"
          style={{
            fontFamily: BOOK_COVER_BODY_FONT,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <WebIcon name="arrow-left" className="w-[3cqw] h-[3cqw] text-white" />
          <span>{isEn ? 'Back to bookshelf' : 'Quay lại kệ sách'}</span>
        </button>
      </div>
    );

    return [coverPage, page1, page2, page3, page4, backCover];
  }, [
    categoryLabel,
    course,
    courseColor,
    getSkillTagIcon,
    inkMuted,
    inkPrimary,
    inkSecondary,
    isEn,
    onClose,
    onNavigateSkillToSwot,
    onOpenLightbox,
    onOpenVerifyModal,
    paperDivider,
    paperSubBox,
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

      {/* SÁCH 3D PHONG CÁCH KOKONUT UI — VỪA KHÍT KHUNG THẺ Ở MỌI KÍCH THƯỚC */}
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
          showFooterNav={true}
          labels={{
            prev: isEn ? 'Previous page' : 'Trang trước',
            next: isEn ? 'Next page' : 'Trang sau',
            of: '/',
          }}
          soundEnabled={true}
          className="mx-auto my-auto max-w-full max-h-full"
          frameStyle={{
            width: `${fittedBook.frameWidth}px`,
          }}
          bookClassName="aspect-auto w-full"
          bookStyle={{
            height: `${fittedBook.bookHeight}px`,
          }}
        />
      )}
    </motion.div>
  );
};

export default EducationBookView;
