'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useLanguage } from '@/context/LanguageContext';

interface ContactPillItem {
  id: string;
  title: string;
  sub: string;
  iconName: string;
  gradient: string;
  circleBg: string;
  ringColor: string;
  pillBg: string; // TailWind class for pill background
  pillBorder: string; // TailWind class for pill border
  textColor: string; // TailWind class for text
  href?: string;
  isExternal?: boolean;
  action?: () => void;
}

interface RadialContactMenuProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectTab: (index: number) => void;
  onShowNotification?: (msg: string) => void;
  currentTab?: number;
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export const RadialContactMenu: React.FC<RadialContactMenuProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onShowNotification,
  currentTab,
  position = 'bottom',
  align = position === 'top' ? 'right' : 'left',
  anchorRef,
}) => {
  const { language } = useLanguage();
  void currentTab;
  const isEn = language === 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateCoords = () => {
      if (anchorRef?.current) {
        const targetEl =
          (anchorRef.current.querySelector('#header-btn-hungthai-avatar') as HTMLElement | null) ||
          anchorRef.current;
        const rect = targetEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const measuredW = Math.round(rect.width);
        const measuredH = Math.round(rect.height);
        const menuWidth =
          measuredW > 40
            ? Math.min(measuredW, viewportWidth - 16)
            : Math.min(153, viewportWidth - 16);
        const pillHeight = measuredH > 24 ? measuredH : 40;
        const safeRight = Math.max(8, Math.min(viewportWidth - rect.right, viewportWidth - menuWidth - 8));
        const safeLeft = Math.max(8, Math.min(rect.left, viewportWidth - menuWidth - 8));

        if (position === 'top') {
          // Attached to top (Header), dropdown goes DOWN flush-aligned with anchor
          setCoords({
            top: Math.max(8, Math.min(rect.bottom + 8, viewportHeight - 120)),
            right: align === 'right' ? safeRight : undefined,
            left: align === 'left' ? safeLeft : undefined,
            width: menuWidth,
            height: pillHeight,
          });
        } else {
          // Attached to bottom (Footer), dropdown goes UP
          setCoords({
            bottom: Math.max(8, Math.min(viewportHeight - rect.top + 8, viewportHeight - 120)),
            right: align === 'right' ? safeRight : undefined,
            left: align === 'left' ? safeLeft : undefined,
            width: menuWidth,
            height: pillHeight,
          });
        }
      }
    };

    updateCoords();
    // Use a small timeout to ensure layout has settled
    const timer = setTimeout(updateCoords, 10);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && anchorRef?.current
        ? new ResizeObserver(updateCoords)
        : null;
    if (resizeObserver && anchorRef?.current) {
      resizeObserver.observe(anchorRef.current);
    }

    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    return () => {
      clearTimeout(timer);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen, anchorRef, position, align]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (anchorRef?.current && anchorRef.current.contains(e.target as Node)) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (onClose) onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  const items: ContactPillItem[] = [
    {
      id: 'booking',
      title: isEn ? 'Booking' : 'Đặt lịch',
      sub: isEn ? 'Contact & Schedule' : 'Liên hệ & Hẹn gặp',
      iconName: 'calendar',
      gradient: 'from-[#312E81] via-[#4338CA] to-[#6366F1]',
      circleBg: 'bg-indigo-600 text-white',
      ringColor: 'ring-indigo-400/60',
      pillBg: 'bg-indigo-50/95 dark:bg-indigo-950/80',
      pillBorder: 'border-indigo-400/80 dark:border-indigo-500/80',
      textColor: 'text-indigo-950 dark:text-indigo-100',
      action: () => {
        onSelectTab(12);
        onShowNotification?.(
          isEn ? '✓ Opened Booking & Contact page' : '✓ Đã mở trang Đặt lịch hẹn & Liên hệ'
        );
      },
    },
    {
      id: 'email',
      title: 'Email',
      sub: 'hungthai84@gmail.com',
      iconName: 'mail',
      gradient: 'from-[#BE123C] via-[#E11D48] to-[#F43F5E]',
      circleBg: 'bg-rose-600 text-white',
      ringColor: 'ring-rose-400/60',
      pillBg: 'bg-rose-50/95 dark:bg-rose-950/80',
      pillBorder: 'border-rose-400/80 dark:border-rose-500/80',
      textColor: 'text-rose-950 dark:text-rose-100',
      href: 'mailto:hungthai84@gmail.com',
    },
    {
      id: 'phone',
      title: isEn ? 'Phone' : 'Điện thoại',
      sub: '+84 0909097882',
      iconName: 'phone',
      gradient: 'from-[#0369A1] via-[#0284C7] to-[#0EA5E9]',
      circleBg: 'bg-sky-600 text-white',
      ringColor: 'ring-sky-400/60',
      pillBg: 'bg-sky-50/95 dark:bg-sky-950/80',
      pillBorder: 'border-sky-400/80 dark:border-sky-500/80',
      textColor: 'text-sky-950 dark:text-sky-100',
      href: 'tel:+840909097882',
    },
    {
      id: 'zalo',
      title: 'Zalo',
      sub: '0909097882',
      iconName: 'chat',
      gradient: 'from-[#047857] via-[#059669] to-[#10B981]',
      circleBg: 'bg-emerald-600 text-white',
      ringColor: 'ring-emerald-400/60',
      pillBg: 'bg-emerald-50/95 dark:bg-emerald-950/80',
      pillBorder: 'border-emerald-400/80 dark:border-emerald-500/80',
      textColor: 'text-emerald-950 dark:text-emerald-100',
      href: 'https://zalo.me/0909097882',
      isExternal: true,
    },
    {
      id: 'website',
      title: 'Website',
      sub: 'powerservice.one',
      iconName: 'globe',
      gradient: 'from-[#C2410C] via-[#EA580C] to-[#F59E0B]',
      circleBg: 'bg-amber-600 text-white',
      ringColor: 'ring-amber-400/60',
      pillBg: 'bg-amber-50/95 dark:bg-amber-950/80',
      pillBorder: 'border-amber-400/80 dark:border-amber-500/80',
      textColor: 'text-amber-950 dark:text-amber-100',
      href: 'https://nguyenhungthai.powerservice.one/',
      isExternal: true,
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      sub: 'hungthai84',
      iconName: 'link',
      gradient: 'from-[#0A66C2] via-[#0284C7] to-[#38BDF8]',
      circleBg: 'bg-blue-600 text-white',
      ringColor: 'ring-blue-400/60',
      pillBg: 'bg-blue-50/95 dark:bg-blue-950/80',
      pillBorder: 'border-blue-400/80 dark:border-blue-500/80',
      textColor: 'text-blue-950 dark:text-blue-100',
      href: 'https://www.linkedin.com/in/hungthai84/',
      isExternal: true,
    },
  ];

  if (!mounted) return null;

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: position === 'top' ? -18 : 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -14 : 14, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-col gap-2 pointer-events-auto select-none overflow-y-auto no-scrollbar"
          style={{
            position: 'fixed',
            top: coords?.top !== undefined ? `${coords.top}px` : 'auto',
            bottom: coords?.bottom !== undefined ? `${coords.bottom}px` : 'auto',
            left: coords?.left !== undefined ? `${coords.left}px` : 'auto',
            right: coords?.right !== undefined ? `${coords.right}px` : 'auto',
            zIndex: 9999999,
            width: coords?.width ? `${coords.width}px` : '176px',
            maxWidth: 'calc(100vw - 16px)',
            maxHeight: 'calc(100vh - 24px)',
          }}
        >
          {items.map((item, idx) => {
            const content = (
              <div
                className="radial-contact-pill-wrapper nav-pill-wrapper relative inline-flex items-center justify-between rounded-[999px] p-[1.5px] select-none group/item transition-colors duration-200 w-full"
                style={{
                  minHeight: '40px',
                  height: coords?.height ? `${coords.height}px` : '40px',
                }}
              >
                {/* Inner Pill */}
                <div
                  className="radial-contact-pill relative z-10 inline-flex items-center w-full h-full rounded-[999px] gap-[6px] cursor-pointer border transition-colors duration-200"
                  style={{
                    paddingTop: '8px',
                    paddingRight: '10px',
                    paddingBottom: '8px',
                    paddingLeft: '10px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  }}
                >
                  <div
                    className={`radial-contact-icon-badge w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-xs ${item.circleBg} leading-none p-0 overflow-hidden typo-badge`}
                  >
                    <WebIcon name={item.iconName} className="w-3.5 h-3.5 text-white m-auto" />
                  </div>
                  <div className="radial-contact-divider w-[1.5px] h-4 shrink-0 rounded-[999px]" />
                  <div className="flex flex-col text-left justify-center leading-none flex-1 min-w-0">
                    <span
                      style={{ fontWeight: 'bold' }}
                      className="radial-contact-title typo-nav leading-tight font-play truncate"
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: idx * 0.035 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => {
                      if (item.id === 'phone' || item.id === 'email') {
                        onShowNotification?.(
                          isEn ? `Opened connection: ${item.sub}` : `Đã mở kết nối: ${item.sub}`
                        );
                      }
                      if (onClose) onClose();
                    }}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (item.action) item.action();
                      if (onClose) onClose();
                    }}
                    className="block text-left w-full border-0 p-0 bg-transparent cursor-pointer"
                  >
                    {content}
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(menuContent, document.body);
};
