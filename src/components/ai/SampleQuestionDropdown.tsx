import React, { useEffect, useMemo, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  SampleQuestionCategory,
  SampleQuestionItem,
} from '@/data/aiSampleQuestions';

export interface SampleQuestionDropdownProps {
  isOpen: boolean;
  isDark: boolean;
  isEn: boolean;
  categories: SampleQuestionCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectQuestion: (item: SampleQuestionItem) => void;
  onClose: () => void;
  pendingDraftQuestion: SampleQuestionItem | null;
  onConfirmDraftAction: (action: 'replace' | 'append' | 'cancel') => void;
  openToQuestionsToken?: number;
}

export const SampleQuestionDropdown: React.FC<SampleQuestionDropdownProps> = ({
  isOpen,
  isDark,
  isEn,
  categories,
  activeCategoryId,
  onSelectCategory,
  onSelectQuestion,
  onClose,
  pendingDraftQuestion,
  onConfirmDraftAction,
  openToQuestionsToken = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileShowQuestions, setMobileShowQuestions] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMobileShowQuestions(false);
    } else if (openToQuestionsToken > 0) {
      setMobileShowQuestions(true);
    }
  }, [isOpen, openToQuestionsToken]);

  const getReadableCategoryColor = (hex: string): string => {
    if (!isDark) return hex;
    const darkPaletteMap: Record<string, string> = {
      '#EC7D21': '#FDBA74',
      '#E64C72': '#FDA4AF',
      '#1480C0': '#7DD3FC',
      '#0D9488': '#5EEAD4',
      '#3BB8E6': '#67E8F9',
      '#6353B5': '#C4B5FD',
      '#2563EB': '#93C5FD',
      '#A855F7': '#D8B4FE',
    };
    return darkPaletteMap[hex] || hex;
  };

  const totalCount = useMemo(
    () => categories.reduce((acc, cat) => acc + cat.items.length, 0),
    [categories]
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) || categories[0],
    [categories, activeCategoryId]
  );

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    const results: Array<{ category: SampleQuestionCategory; item: SampleQuestionItem }> = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        const hay = `${cat.labelWithNumber} ${item.title} ${item.question}`.toLowerCase();
        if (hay.includes(normalizedQuery)) {
          results.push({ category: cat, item });
        }
      }
    }
    return results;
  }, [categories, normalizedQuery]);

  if (!isOpen) return null;

  const activeColor = getReadableCategoryColor(selectedCategory.color);
  const isSearching = normalizedQuery.length > 0;

  return (
    <div
      id="ai-assistant-droptop-menu-list"
      role="dialog"
      aria-modal="false"
      aria-label={isEn ? 'Sample Questions Directory' : 'Danh mục Câu hỏi mẫu Trí Nhân'}
      data-element-type="card"
      data-section-card="true"
      className="theme-modal-card absolute bottom-0 left-0 right-0 z-40 h-[min(520px,100%)] max-h-full rounded-[14px] shadow-2xl flex flex-col overflow-hidden animate-fadeIn motion-reduce:animate-none"
    >
      {/* Header Drop-up */}
      <div className="theme-modal-header px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <WebIcon
            name="book-open"
            className="w-[18px] h-[18px] shrink-0"
            style={{ color: 'var(--color-primary)' }}
          />
          <div className="min-w-0">
            <h3
              className="typo-popup-title font-play truncate"
              style={{ color: 'var(--text-heading, var(--text-primary))' }}
            >
              {isEn
                ? `Sample Questions • ${categories.length} Topics (${totalCount})`
                : `Câu hỏi mẫu • ${categories.length} nhóm chủ đề (${totalCount} câu)`}
            </h3>
            <p className="typo-caption text-[var(--text-muted)]">
              {isEn
                ? 'Select a topic, then pick a question to insert & edit before sending'
                : 'Chọn nhóm chủ đề và chọn câu hỏi để đưa vào khung nhập (có thể sửa trước khi gửi)'}
            </p>
          </div>
        </div>

        <button
          id="ai-assistant-droptop-close-btn"
          type="button"
          onClick={() => {
            SoundEngine.playTap();
            onClose();
          }}
          className="px-3 py-1.5 rounded-full typo-button bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <WebIcon name="cancel" className="w-3.5 h-3.5" />
          <span>{isEn ? 'Close' : 'Đóng'}</span>
        </button>
      </div>

      {/* Thanh tìm nhanh câu hỏi */}
      <div
        className="px-3.5 sm:px-4 py-2 border-b flex items-center gap-2 shrink-0"
        style={{ borderColor: 'var(--border-subcard, var(--border-color))' }}
      >
        <div className="relative flex-1 min-w-0">
          <WebIcon
            name="search"
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            id="ai-sample-questions-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isEn
                ? 'Quick filter across 47 sample questions...'
                : 'Tìm nhanh trong 47 câu hỏi mẫu (VD: MoMo, STAR, CRM, KPI...)'
            }
            className="theme-input w-full h-8 pl-8 pr-8 rounded-full border typo-body-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <WebIcon name="cancel" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bảo vệ nội dung đang nhập dở nếu user đã gõ sẵn text */}
      {pendingDraftQuestion && (
        <div
          id="ai-sample-draft-guard"
          role="alert"
          className="mx-3.5 sm:mx-4 mt-2.5 p-3 rounded-[12px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0"
          style={{
            background: 'var(--bg-subcard)',
            borderColor: 'var(--color-primary)',
          }}
        >
          <div className="flex items-start gap-2 min-w-0">
            <WebIcon
              name="alert-circle"
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: 'var(--color-primary)' }}
            />
            <div className="min-w-0">
              <p className="typo-body-sm font-semibold text-[var(--text-primary)]">
                {isEn
                  ? 'You have unsent text in the chat box. Replace or append this sample question?'
                  : 'Khung nhập đang có nội dung chưa gửi. Bạn muốn thay thế hay chèn nối tiếp câu hỏi mẫu?'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onConfirmDraftAction('replace')}
              style={{ background: 'var(--bg-button-primary)' }}
              className="px-3 py-1 rounded-full typo-badge text-white font-semibold cursor-pointer transition hover:opacity-90"
            >
              {isEn ? 'Replace text' : 'Thay thế'}
            </button>
            <button
              type="button"
              onClick={() => onConfirmDraftAction('append')}
              className="px-3 py-1 rounded-full typo-badge font-semibold border cursor-pointer transition hover:opacity-90"
              style={{
                background: 'var(--bg-button-secondary, transparent)',
                borderColor: 'var(--border-subcard, var(--border-color))',
                color: 'var(--text-primary)',
              }}
            >
              {isEn ? 'Append' : 'Chèn nối tiếp'}
            </button>
            <button
              type="button"
              onClick={() => onConfirmDraftAction('cancel')}
              className="px-2.5 py-1 rounded-full typo-badge text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy'}
            </button>
          </div>
        </div>
      )}

      {/* Nội dung 2 cấp: Desktop (2 cột) & Mobile (chuyển bước Danh mục <-> Câu hỏi) */}
      <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-[248px_1fr] overflow-hidden">
        {/* CỘT TRÁI: 8 Nhóm chủ đề */}
        <div
          className={`${
            isSearching || mobileShowQuestions ? 'hidden md:flex' : 'flex'
          } flex-col gap-1.5 p-3 overflow-y-auto md:border-r min-h-0`}
          style={{ borderColor: 'var(--border-subcard, var(--border-color))' }}
        >
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategory.id;
            const catColor = getReadableCategoryColor(cat.color);
            return (
              <button
                key={cat.id}
                id={`ai-droptop-item-${cat.code}`}
                type="button"
                data-subcard="true"
                onClick={() => {
                  SoundEngine.playTap();
                  onSelectCategory(cat.id);
                  setMobileShowQuestions(true);
                }}
                style={
                  isSelected
                    ? {
                        borderColor: catColor,
                        boxShadow: `0 0 0 1px ${catColor}40`,
                      }
                    : undefined
                }
                className={`theme-modal-subcard w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-[12px] text-left transition cursor-pointer ${
                  isSelected ? 'font-semibold' : 'hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <WebIcon
                    name={cat.icon}
                    className="w-4 h-4 shrink-0"
                    style={{ color: catColor }}
                  />
                  <span
                    className="typo-body-sm font-play leading-snug"
                    style={{ color: isSelected ? catColor : 'var(--text-primary)' }}
                  >
                    {cat.labelWithNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="px-2 py-0.5 rounded-full typo-badge font-semibold"
                    style={{
                      background: `${cat.color}20`,
                      color: catColor,
                    }}
                  >
                    {cat.items.length}
                  </span>
                  <WebIcon
                    name="chevron-right"
                    className="w-3.5 h-3.5 md:hidden shrink-0"
                    style={{ color: catColor }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* CỘT PHẢI: Danh sách câu hỏi của nhóm đã chọn (hoặc kết quả lọc tìm kiếm) */}
        <div
          className={`${
            !isSearching && !mobileShowQuestions ? 'hidden md:flex' : 'flex'
          } flex-col flex-1 min-h-0 overflow-hidden`}
        >
          {/* Sub-header danh mục đang xem hoặc nút quay lại trên mobile */}
          <div
            className="px-3.5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0"
            style={{ borderColor: 'var(--border-subcard, var(--border-color))' }}
          >
            {isSearching ? (
              <div className="flex items-center justify-between w-full gap-2">
                <span className="typo-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {isEn
                    ? `Found ${searchResults.length} matching questions`
                    : `Tìm thấy ${searchResults.length} câu hỏi phù hợp`}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="typo-badge px-2.5 py-1 rounded-full border cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subcard, var(--border-color))',
                    color: 'var(--text-primary)',
                  }}
                >
                  {isEn ? 'Reset' : 'Xem theo chủ đề'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setMobileShowQuestions(false);
                    }}
                    className="md:hidden px-2.5 py-1 rounded-full typo-badge font-semibold flex items-center gap-1 border cursor-pointer shrink-0"
                    style={{
                      background: 'var(--bg-button-secondary, var(--bg-subcard))',
                      borderColor: 'var(--border-subcard, var(--border-color))',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <WebIcon name="chevron-left" className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Topics' : '8 chủ đề'}</span>
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <WebIcon
                        name={selectedCategory.icon}
                        className="w-4 h-4 shrink-0 hidden md:inline-block"
                        style={{ color: activeColor }}
                      />
                      <h4
                        className="typo-h5 font-play truncate"
                        style={{ color: activeColor }}
                      >
                        {selectedCategory.labelWithNumber} ({selectedCategory.items.length} câu)
                      </h4>
                    </div>
                    <p className="typo-caption text-[var(--text-muted)] line-clamp-1">
                      {isEn ? selectedCategory.descriptionEn : selectedCategory.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danh sách câu hỏi cuộn độc lập */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
            {isSearching ? (
              searchResults.length > 0 ? (
                searchResults.map(({ category, item }) => {
                  const itemColor = getReadableCategoryColor(category.color);
                  return (
                    <button
                      key={`search-q-${item.id}`}
                      id={`ai-menu-l3-q-${item.id}`}
                      type="button"
                      data-subcard="true"
                      onClick={() => onSelectQuestion(item)}
                      className="theme-modal-subcard w-full p-3 rounded-[12px] text-left transition cursor-pointer flex flex-col gap-1.5 hover:border-purple-400/70 group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="typo-badge font-semibold" style={{ color: itemColor }}>
                          {category.labelWithNumber} • Câu {item.number}
                        </span>
                        <span className="typo-badge px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100" style={{ color: 'var(--color-primary)' }}>
                          {isEn ? 'Insert into input ↵' : 'Chọn đưa vào ô nhập ↵'}
                        </span>
                      </div>
                      <p className="typo-body-sm text-[var(--text-primary)] leading-snug">
                        {item.question}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center typo-body-sm text-[var(--text-muted)]">
                  {isEn
                    ? 'No matching sample questions found. Try another keyword or ask Tri Nhan directly.'
                    : 'Không tìm thấy câu hỏi mẫu phù hợp. Bạn có thể xóa từ khóa hoặc đặt câu hỏi trực tiếp cho Trí Nhân.'}
                </div>
              )
            ) : (
              selectedCategory.items.map((qItem) => (
                <button
                  key={qItem.id}
                  id={`ai-menu-l3-q-${qItem.id}`}
                  type="button"
                  data-subcard="true"
                  onClick={() => onSelectQuestion(qItem)}
                  className="theme-modal-subcard w-full p-3 rounded-[12px] text-left transition cursor-pointer flex flex-col gap-1.5 hover:border-purple-400/70 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-badge font-semibold" style={{ color: activeColor }}>
                      {qItem.title}
                    </span>
                    <span
                      className="typo-badge px-2 py-0.5 rounded-full shrink-0 opacity-80 group-hover:opacity-100"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {isEn ? 'Insert ↵' : 'Đưa vào ô chat ↵'}
                    </span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)] leading-snug">
                    {qItem.question}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleQuestionDropdown;
