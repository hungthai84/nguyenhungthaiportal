import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

const MAX_WIDTH_MAP: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  accentColor,
  maxWidth = '4xl',
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = MAX_WIDTH_MAP[maxWidth] || 'max-w-4xl';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          className="fixed inset-0"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.98, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 24 }}
          transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          className={`theme-modal-card relative w-full ${maxWidthClass} rounded-t-[24px] rounded-b-none sm:rounded-[var(--radius-modal,24px)] p-4 pb-[max(16px,env(safe-area-inset-bottom,16px))] sm:p-6 shadow-2xl z-10 flex flex-col gap-3 max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto no-scrollbar font-play text-left`}
        >
          {/* Mobile Bottom Sheet drag handle indicator */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-current/25 mx-auto -mt-1 mb-0.5 shrink-0" aria-hidden="true" />

          <div className="theme-modal-header card-header-sync flex items-center justify-between -mx-4 -mt-3 sm:-mx-6 sm:-mt-6 px-4 sm:px-6 py-3 sm:py-4 rounded-t-[24px] sm:rounded-t-[var(--radius-modal,24px)] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0 flex items-center" style={{ color: accentColor || 'var(--color-primary)' }}>
                {icon || <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />}
              </div>
              <div className="min-w-0">
                <h3
                  className="typo-popup-title card-title-synced leading-tight truncate"
                  style={{ color: accentColor || 'var(--text-heading, var(--text-primary))' }}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="typo-caption mt-0.5 font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="theme-modal-close w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Đóng (ESC)"
            >
              <WebIcon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1 pt-1">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
