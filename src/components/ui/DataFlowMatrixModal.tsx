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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0B1220]/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl max-h-[85vh] rounded-[14px] bg-white/95 dark:bg-[#111827] border border-slate-200 dark:border-[#334155] shadow-2xl flex flex-col overflow-hidden text-left font-play"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-[#334155] bg-slate-50/90 dark:bg-[#0B1220]/90">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-sky-100 dark:bg-[#1F2937] border border-sky-300 dark:border-[#67E8F9]/40 flex items-center justify-center text-sky-600 dark:text-[#67E8F9] shrink-0">
                <WebIcon name="activity" className="w-5 h-5 text-sky-600 dark:text-[#67E8F9] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="typo-h3 font-bold text-slate-900 dark:text-[#F8FAFC] font-play tracking-wide">
                  Ma Trận Dòng Chảy Dữ Liệu Tương Tác Hệ Thống
                </h3>
                <p className="typo-caption text-sky-700 dark:text-[#67E8F9]">
                  12 Phân hệ kết nối thời gian thực qua Kafka Event Stream &amp; API Gateway
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-rose-500 hover:text-white dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-[#F8FAFC] flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <WebIcon name="cancel" className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto glass-scrollbar flex-1 space-y-4 text-slate-700 dark:text-[#E2E8F0]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SYSTEMS_DATA.map((sys: any) => (
                <div
                  key={sys.id}
                  className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-white/12 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-[12px] typo-badge font-mono font-bold bg-sky-100 dark:bg-[#0B1220] text-sky-700 dark:text-[#67E8F9] border border-sky-300 dark:border-[#67E8F9]/30">
                      {sys.abbr}
                    </span>
                    <span className="typo-label font-mono text-emerald-700 dark:text-[#6EE7B7] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#6EE7B7] animate-pulse" />
                      Live Stream
                    </span>
                  </div>
                  <div>
                    <h4 className="typo-h4 font-bold text-slate-900 dark:text-[#F8FAFC]">{sys.nameVi}</h4>
                    <p className="typo-body-sm text-slate-600 dark:text-[#E2E8F0] mt-1 line-clamp-2">{sys.descVi}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 typo-label text-sky-700 dark:text-[#7DD3FC] font-mono">
                    Độ trễ: &lt; 15ms • Chuẩn TLS 1.3
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-[#334155] bg-slate-50/90 dark:bg-[#0B1220]/90 flex items-center justify-between typo-caption text-slate-500 dark:text-[#94A3B8]">
            <span>Enterprise Service Bus • Real-time Sync Active</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-[#075985] hover:bg-[#0E7490] text-white typo-button transition cursor-pointer"
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
