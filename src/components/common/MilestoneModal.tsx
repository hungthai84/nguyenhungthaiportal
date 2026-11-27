import React, { useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { CareerMilestoneItem } from '../../data/letterData';
import { ExperienceMilestone } from '../../data/experience';
import { resolveCompanyLogo } from '@/utils/companyBrandAssets';

interface MilestoneModalProps {
  item: CareerMilestoneItem | ExperienceMilestone | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  item,
  onClose,
}) => {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      style={{
        background: 'var(--bg-modal-backdrop)',
        backdropFilter: 'blur(var(--blur-modal, 6px))',
        WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 font-play animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.company}
        className="theme-modal-card milestone-modal-card rounded-[var(--radius-modal,24px)] max-w-xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-5 shadow-2xl relative text-left space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-modal-header flex flex-wrap items-center justify-between gap-2 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 px-4 sm:px-5 py-3 rounded-t-[var(--radius-modal,24px)]">
          <div className="flex items-center gap-3">
            <img
              src={item.logo}
              alt={item.company}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const fallback = resolveCompanyLogo(item.company);
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div>
              <h3 className="typo-popup-title flex items-center gap-1.5" style={{ color: item.color }}>
                <WebIcon name="building-2" className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                <span>{item.company}</span>
              </h3>
              <p className="typo-caption font-bold" style={{ color: item.color }}>
                {item.roleVi}
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full typo-badge font-bold font-play tabular-nums shrink-0 border shadow-xs"
            style={{
              backgroundColor: `${item.color}16`,
              borderColor: `${item.color}45`,
              color: item.color,
            }}
          >
            {/^\s*năm\s+/i.test(item.yearLabelVi || '') ? item.yearLabelVi : `Năm ${item.yearLabelVi || ''}`}
          </span>
        </div>
        <div className="space-y-2 typo-body-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          <p className="theme-modal-subcard p-3 rounded-[var(--radius-subcard,16px)] font-medium">
            {item.descVi}
          </p>
          {item.descViPart2 && (
            <p className="theme-modal-subcard p-3 rounded-[var(--radius-subcard,16px)] font-medium">
              {item.descViPart2}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-[var(--radius-subcard,16px)] border flex items-center gap-2"
          style={{
            backgroundColor: `${item.color}15`,
            borderColor: `${item.color}40`,
          }}
        >
          <i
            className={`fa-solid ${item.highlightIconName} typo-body-sm`}
            style={{ color: item.color }}
          ></i>
          <span className="typo-caption font-bold" style={{ color: item.color }}>
            {item.highlightVi}
          </span>
        </div>
        <div className="theme-modal-footer flex justify-end -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 px-4 sm:px-5 py-3 rounded-b-[var(--radius-modal,24px)]">
          <button
            type="button"
            onClick={onClose}
            className="theme-modal-close px-4 py-1.5 rounded-full typo-button cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
