import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

export interface SampleQuestionButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  isEn?: boolean;
  totalQuestions?: number;
  disabled?: boolean;
}

export const SampleQuestionButton: React.FC<SampleQuestionButtonProps> = ({
  isOpen,
  onToggle,
  isEn = false,
  totalQuestions = 47,
  disabled = false,
}) => {
  const label = isEn ? 'Categories' : 'Danh mục';
  const titleText = isEn
    ? `Open ${totalQuestions} sample questions across 8 category cards`
    : `Mở thẻ Danh mục (${totalQuestions} câu hỏi thuộc 8 nhóm chủ đề)`;

  return (
    <button
      id="ai-assistant-droptop-menu-btn"
      data-element-name="Nút Danh mục"
      data-element-type="button"
      data-element-page="ai-assistant"
      data-open={isOpen ? 'true' : 'false'}
      type="button"
      disabled={disabled}
      onClick={onToggle}
      title={titleText}
      aria-label={label}
      aria-expanded={isOpen}
      aria-controls="ai-assistant-droptop-menu-list"
      aria-haspopup="dialog"
      style={
        isOpen
          ? {
              background: 'var(--bg-button-primary)',
              color: 'var(--text-button-primary, #FFFFFF)',
              borderColor: 'transparent',
            }
          : undefined
      }
      className={`theme-ai-cat-btn box-border h-[44px] px-2.5 sm:px-3.5 rounded-full typo-button border shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 shrink-0 whitespace-nowrap ${
        isOpen ? 'shadow-md' : 'hover:shadow-md'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <WebIcon
        name="grid"
        className="w-4 h-4 shrink-0"
        style={{ color: isOpen ? 'var(--text-button-primary, #FFFFFF)' : 'var(--color-primary)' }}
      />
      <span className="typo-button font-semibold tracking-tight">{label}</span>
      <WebIcon
        name="chevron-up"
        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
        style={{ color: isOpen ? 'var(--text-button-primary, #FFFFFF)' : 'var(--text-muted)' }}
      />
    </button>
  );
};

export default SampleQuestionButton;
