import React from 'react';
import { CareerMilestoneItem } from '../../data/letterData';
import { ExperienceMilestone } from '../../data/experience';

interface MilestoneModalProps {
  item: CareerMilestoneItem | ExperienceMilestone | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-[#0B1220]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-play animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111827] rounded-[14px] max-w-xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-5 border border-[#CBD5E1] dark:border-[#334155] shadow-2xl relative text-left space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={item.logo}
              alt={item.company}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div>
              <h3 className="typo-h3 font-bold text-slate-900 dark:text-white">
                {item.company}
              </h3>
              <p className="typo-caption font-bold" style={{ color: item.color }}>
                {item.roleVi}
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full typo-badge font-bold font-play tabular-nums shrink-0 bg-white/95 dark:bg-slate-800/90 border shadow-xs"
            style={{
              backgroundColor: `${item.color}16`,
              borderColor: `${item.color}45`,
              color: item.color,
            }}
          >
            {/^\s*năm\s+/i.test(item.yearLabelVi || '') ? item.yearLabelVi : `Năm ${item.yearLabelVi || ''}`}
          </span>
        </div>
        <div className="space-y-2 typo-body-sm text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
          <p className="p-3 rounded-[14px] bg-[#F8FAFC] dark:bg-[#1F2937]/80 border border-[#E2E8F0] dark:border-[#334155] font-medium">
            {item.descVi}
          </p>
          {item.descViPart2 && (
            <p className="p-3 rounded-[14px] bg-[#F8FAFC] dark:bg-[#1F2937]/80 border border-[#E2E8F0] dark:border-[#334155] font-medium">
              {item.descViPart2}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-[14px] border flex items-center gap-2"
          style={{
            backgroundColor: `${item.color}15`,
            borderColor: `${item.color}40`,
          }}
        >
          <i
            className={`fa-solid ${item.highlightIconName} text-sm`}
            style={{ color: item.color }}
          ></i>
          <span className="typo-caption font-bold" style={{ color: item.color }}>
            {item.highlightVi}
          </span>
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 typo-button text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
