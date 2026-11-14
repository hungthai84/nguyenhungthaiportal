import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
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
  maxWidth = '4xl',
  children,
}) => {
  if (!isOpen) return null;

  const maxWidthClass = MAX_WIDTH_MAP[maxWidth] || 'max-w-4xl';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1220]/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full ${maxWidthClass} bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-4 sm:p-6 shadow-2xl z-10 flex flex-col gap-3 text-[#334155] dark:text-[#E2E8F0] max-h-[90vh] overflow-y-auto font-play text-left`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#334155] shrink-0">
            <div className="flex items-center gap-2.5">
              {icon && <div className="shrink-0">{icon}</div>}
              <div>
                <h3 className="typo-h3 font-bold text-[#1E1B4B] dark:text-[#F8FAFC] leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="typo-caption text-[#475569] dark:text-[#94A3B8] mt-0.5 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              title="Đóng (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
