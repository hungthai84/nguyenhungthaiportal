import React, { useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

interface BentoFocusModalProps {
  cardKey: string | null;
  onClose: () => void;
}

export const BentoFocusModal: React.FC<BentoFocusModalProps> = ({
  cardKey,
  onClose,
}) => {
  useEffect(() => {
    if (!cardKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cardKey, onClose]);

  if (!cardKey) return null;

  return (
    <div
      style={{
        background: 'var(--bg-modal-backdrop)',
        backdropFilter: 'blur(var(--blur-modal, 6px))',
        WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Trụ Cột Vận Hành Chiến Lược"
        className="theme-modal-card relative w-full max-w-4xl p-5 sm:p-6 rounded-[var(--radius-modal,24px)] shadow-2xl z-10 flex flex-col gap-4 font-play overflow-y-auto no-scrollbar max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-modal-header flex items-center justify-between -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 px-5 sm:px-6 py-3.5 rounded-t-[var(--radius-modal,24px)] shrink-0">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-bullseye typo-h4"></i>
            <h3 className="typo-popup-title card-title-synced" style={{ color: 'var(--color-primary)' }}>
              Trụ Cột Vận Hành Chiến Lược (22+ Năm Kinh Nghiệm)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="theme-modal-close w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 typo-body-sm text-left">
          <div className="p-4 rounded-[var(--radius-card,24px)] bg-gradient-to-br from-blue-600 to-sky-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white flex items-center gap-2" data-subcard-title="true">
                <WebIcon name="target" className="w-4 h-4 shrink-0 text-white" />
                <span>01. Hiệu Quả</span>
              </h4>
              <p className="mt-2 text-blue-100 leading-relaxed typo-body-sm">
                Tối ưu hiệu suất vận hành, chuẩn hóa SOP, quản trị KPI, SLA, FCR và giải quyết triệt để rủi ro dịch vụ.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Chuẩn hóa SOP & Đo lường ROI
            </span>
          </div>
          <div className="p-4 rounded-[var(--radius-card,24px)] bg-gradient-to-br from-rose-500 to-pink-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white flex items-center gap-2" data-subcard-title="true">
                <WebIcon name="heart" className="w-4 h-4 shrink-0 text-white" />
                <span>02. Nhân Văn</span>
              </h4>
              <p className="mt-2 text-rose-100 leading-relaxed typo-body-sm">
                Lắng nghe thấu hiểu từ tâm, lấy con người làm gốc rễ, đào tạo đội ngũ tận tâm và xây dựng văn hóa gắn kết.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Thấu cảm từ tâm & Trao quyền
            </span>
          </div>
          <div className="p-4 rounded-[var(--radius-card,24px)] bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white flex items-center gap-2" data-subcard-title="true">
                <WebIcon name="leaf" className="w-4 h-4 shrink-0 text-white" />
                <span>03. Bền Vững</span>
              </h4>
              <p className="mt-2 text-emerald-100 leading-relaxed typo-body-sm">
                Xây dựng niềm tin dài hạn, ứng dụng công nghệ CRM hiện đại, Data Analytics và tự động hóa AI tạo đòn bẩy.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Công nghệ AI CRM & Tăng trưởng
            </span>
          </div>
        </div>
        <div className="theme-modal-footer -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 px-5 sm:px-6 py-3 rounded-b-[var(--radius-modal,24px)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
            className="px-5 py-2 rounded-full typo-button hover:opacity-90 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
