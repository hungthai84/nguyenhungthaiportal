import React from 'react';

interface BentoFocusModalProps {
  cardKey: string | null;
  onClose: () => void;
}

export const BentoFocusModal: React.FC<BentoFocusModalProps> = ({
  cardKey,
  onClose,
}) => {
  if (!cardKey) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#0B1220]/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#334155] p-5 sm:p-6 rounded-[14px] shadow-2xl z-10 flex flex-col gap-4 text-[#334155] dark:text-[#E2E8F0] font-play overflow-y-auto no-scrollbar max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <i className="fa-solid fa-bullseye text-base"></i>
            <h3 className="typo-h3 font-bold">
              3 Trụ Cột Vận Hành Chiến Lược (22+ Năm Kinh Nghiệm)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1F2937] hover:bg-slate-200 dark:hover:bg-[#334155] flex items-center justify-center text-[#475569] dark:text-[#94A3B8] font-bold cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 typo-body-sm text-left">
          <div className="p-4 rounded-[14px] bg-gradient-to-br from-blue-600 to-sky-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white">01. Hiệu Quả</h4>
              <p className="mt-2 text-blue-100 leading-relaxed typo-body-sm">
                Tối ưu hiệu suất vận hành, chuẩn hóa SOP, quản trị KPI, SLA, FCR và giải quyết triệt để rủi ro dịch vụ.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Chuẩn hóa SOP & Đo lường ROI
            </span>
          </div>
          <div className="p-4 rounded-[14px] bg-gradient-to-br from-rose-500 to-pink-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white">02. Nhân Văn</h4>
              <p className="mt-2 text-rose-100 leading-relaxed typo-body-sm">
                Lắng nghe thấu hiểu từ tâm, lấy con người làm gốc rễ, đào tạo đội ngũ tận tâm và xây dựng văn hóa gắn kết.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Thấu cảm từ tâm & Trao quyền
            </span>
          </div>
          <div className="p-4 rounded-[14px] bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex flex-col justify-between shadow-md">
            <div>
              <h4 className="typo-h4 font-bold text-white">03. Bền Vững</h4>
              <p className="mt-2 text-emerald-100 leading-relaxed typo-body-sm">
                Xây dựng niềm tin dài hạn, ứng dụng công nghệ CRM hiện đại, Data Analytics và tự động hóa AI tạo đòn bẩy.
              </p>
            </div>
            <span className="mt-4 pt-2 border-t border-white/20 font-mono typo-label">
              ✓ Công nghệ AI CRM & Tăng trưởng
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-[14px] bg-[#1E1B4B] dark:bg-[#F8FAFC] text-white dark:text-[#1E1B4B] typo-button hover:opacity-90 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
