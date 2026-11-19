'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEMS_DATA } from '@/data/systems';

export interface DataFlowMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: any;
}

export const DataFlowMatrixModal: React.FC<DataFlowMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        style={{
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(var(--blur-modal, 6px))',
          WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ma Trận Dòng Chảy Dữ Liệu Tương Tác Hệ Thống"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="theme-modal-card w-full max-w-5xl max-h-[85vh] rounded-[var(--radius-modal,24px)] shadow-2xl flex flex-col overflow-hidden text-left font-play"
        >
          {/* Header */}
          <div className="theme-modal-header flex items-center justify-between p-4 sm:p-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[var(--radius-subcard,16px)] bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-600 dark:text-[#67E8F9] shrink-0">
                <WebIcon name="activity" className="w-5 h-5 text-sky-600 dark:text-[#67E8F9]" />
              </div>
              <div className="min-w-0">
                <h3 className="typo-popup-title card-title-synced font-play tracking-wide" style={{ color: 'var(--accent-sky, #0284c7)' }}>
                  Ma Trận Dòng Chảy Dữ Liệu Tương Tác Hệ Thống
                </h3>
                <p className="typo-caption" style={{ color: 'var(--color-primary)' }}>
                  12 Phân hệ kết nối thời gian thực qua Kafka Event Stream &amp; API Gateway
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="theme-modal-close w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <WebIcon name="cancel" className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto glass-scrollbar flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SYSTEMS_DATA.map((sys: any) => (
                <div
                  key={sys.id}
                  className="theme-modal-subcard p-3.5 rounded-[var(--radius-subcard,16px)] flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-[var(--radius-subcard,16px)] typo-badge font-mono font-bold bg-sky-500/15 border border-sky-400/35" style={{ color: 'var(--color-primary)' }}>
                      {sys.abbr}
                    </span>
                    <span className="typo-label font-mono text-emerald-600 dark:text-[#6EE7B7] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#6EE7B7]" />
                      Live Stream
                    </span>
                  </div>
                  <div>
                    <h4 className="typo-h4" style={{ color: 'var(--text-heading, var(--text-primary))' }}>{sys.nameVi}</h4>
                    <p className="typo-body-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{sys.descVi}</p>
                  </div>
                  <div className="pt-2 border-t typo-label font-mono" style={{ borderColor: 'var(--border-subcard)', color: 'var(--color-primary)' }}>
                    Độ trễ: &lt; 15ms • Chuẩn TLS 1.3
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="theme-modal-footer p-3.5 sm:p-4 flex items-center justify-between typo-caption">
            <span style={{ color: 'var(--text-muted)' }}>Enterprise Service Bus • Real-time Sync Active</span>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'var(--bg-button-primary)' }}
              className="px-4 py-1.5 rounded-full text-white typo-button transition cursor-pointer hover:opacity-90"
            >
              Đóng Ma Trận
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default DataFlowMatrixModal;
