'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { WebIcon } from '@/components/ui/WebIcon';

interface ContactPillItem {
  id: string;
  title: string;
  sub: string;
  iconName: string;
  gradient: string;
  circleBg: string;
  ringColor: string;
  laserColor: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left?: number; right?: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateCoords = () => {
      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (position === 'top') {
          // Attached to top (Header), dropdown goes DOWN
          setCoords({
            top: rect.bottom + 8,
            right: align === 'right' ? viewportWidth - rect.right : undefined,
            left: align === 'left' ? rect.left : undefined,
          });
        } else {
          // Attached to bottom (Footer), dropdown goes UP
          setCoords({
            bottom: viewportHeight - rect.top + 8,
            right: align === 'right' ? viewportWidth - rect.right : undefined,
            left: align === 'left' ? rect.left : undefined,
          });
        }
      }
    };

    updateCoords();
    // Use a small timeout to ensure layout has settled
    const timer = setTimeout(updateCoords, 10);
    
    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    return () => {
      clearTimeout(timer);
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
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose, anchorRef]);

  const items: ContactPillItem[] = [
    {
      id: 'booking',
      title: 'Đặt lịch',
      sub: 'Liên hệ & Hẹn gặp',
      iconName: 'calendar',
      gradient: 'from-[#312E81] via-[#4338CA] to-[#6366F1]',
      circleBg: 'bg-indigo-600 text-white',
      ringColor: currentTab === 12 ? 'ring-indigo-500 ring-2' : 'ring-indigo-400/60',
      laserColor: '#6366F1',
      pillBg: currentTab === 12 ? 'bg-indigo-100/95 dark:bg-indigo-900/90' : 'bg-indigo-50/95 dark:bg-indigo-950/80',
      pillBorder: 'border-indigo-400/80 dark:border-indigo-500/80',
      textColor: 'text-indigo-950 dark:text-indigo-100',
      action: () => {
        onSelectTab(12);
        onShowNotification?.('✓ Đã mở trang Đặt lịch hẹn & Liên hệ');
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
      laserColor: '#F43F5E',
      pillBg: 'bg-rose-50/95 dark:bg-rose-950/80',
      pillBorder: 'border-rose-400/80 dark:border-rose-500/80',
      textColor: 'text-rose-950 dark:text-rose-100',
      href: 'mailto:hungthai84@gmail.com',
    },
    {
      id: 'phone',
      title: 'Điện thoại',
      sub: '+84 0909097882',
      iconName: 'phone',
      gradient: 'from-[#0369A1] via-[#0284C7] to-[#0EA5E9]',
      circleBg: 'bg-sky-600 text-white',
      ringColor: 'ring-sky-400/60',
      laserColor: '#0EA5E9',
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
      laserColor: '#10B981',
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
      laserColor: '#F59E0B',
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
      laserColor: '#38BDF8',
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
          className="flex flex-col gap-2 pointer-events-auto select-none shadow-2xl"
          style={{
            position: 'fixed',
            top: coords?.top !== undefined ? `${coords.top}px` : 'auto',
            bottom: coords?.bottom !== undefined ? `${coords.bottom}px` : 'auto',
            left: coords?.left !== undefined ? `${coords.left}px` : 'auto',
            right: coords?.right !== undefined ? `${coords.right}px` : 'auto',
            zIndex: 9999999,
            width: '176px',
          }}
        >
          {items.map((item, idx) => {
            const isItemActive = item.id === 'booking' && currentTab === 12;
            const content = (
              <div
                className={`relative inline-flex items-center justify-between rounded-[999px] p-[1.5px] select-none group/item transition-all duration-300 hover:scale-[1.05] w-[176px] h-[44px] overflow-hidden shadow-lg ring-1.5 ${item.ringColor}`}
              >
                {/* Rotating Laser Beam Border */}
                <div
                  className={`absolute -inset-[220%] animate-[spin_4s_linear_infinite] pointer-events-none ${
                    isItemActive ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
                  }`}
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0 200deg, ${item.laserColor} 260deg, #ffffff 320deg, ${item.laserColor} 360deg)`,
                  }}
                />

                {/* Inner Pill */}
                <div
                  className={`relative z-10 inline-flex items-center w-full h-full rounded-[999px] ${item.pillBg} px-2 py-0.5 gap-1.5 shadow-inner backdrop-blur-md cursor-pointer border ${item.pillBorder} ${item.textColor}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.circleBg} leading-none p-0 overflow-hidden typo-badge`}
                  >
                    <WebIcon name={item.iconName} className="w-3.5 h-3.5 text-white m-auto" />
                  </div>
                  <div className={`w-[1px] h-3.5 opacity-40 shrink-0 mx-0.5 rounded-[999px] ${item.textColor.replace('text-', 'bg-')}`} />
                  <div className="flex flex-col text-left leading-none pr-1 min-w-0">
                    <span className="text-[14px] leading-tight font-bold font-play truncate">
                      {item.title}
                    </span>
                    <span className="text-[12px] leading-none font-semibold mt-0.5 opacity-85 truncate">
                      {item.sub}
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
                        onShowNotification?.(`Đã mở kết nối: ${item.sub}`);
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
