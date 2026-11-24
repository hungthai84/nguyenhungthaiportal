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
  openToCategoriesToken?: number;
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
  openToCategoriesToken = 0,
  openToQuestionsToken = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewStep, setViewStep] = useState<'categories' | 'questions'>('categories');

  useEffect(() => {
    if (!isOpen) {
      setViewStep('categories');
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (openToCategoriesToken > 0) {
      setViewStep('categories');
      setSearchTerm('');
    }
  }, [openToCategoriesToken]);

  useEffect(() => {
    if (openToQuestionsToken > 0) {
      setViewStep('questions');
      setSearchTerm('');
    }
  }, [openToQuestionsToken]);

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
  const showQuestionList = isSearching || viewStep === 'questions';

  return (
    <div
      id="ai-assistant-droptop-menu-list"
      role="dialog"
      aria-modal="false"
      aria-label={isEn ? 'Sample Question Categories' : 'Thẻ Danh mục Câu hỏi mẫu Trí Nhân'}
      className="theme-modal-card pointer-events-auto relative w-full h-[min(580px,100%)] max-h-full rounded-[var(--radius-modal,24px)] shadow-2xl flex flex-col overflow-hidden animate-fadeIn motion-reduce:animate-none"
    >
      {/* Header Thẻ Danh mục / List câu hỏi */}
      <div className="theme-modal-header px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <WebIcon
            name={showQuestionList && !isSearching ? selectedCategory.icon : 'grid'}
            className="w-[18px] h-[18px] shrink-0"
            style={{ color: showQuestionList && !isSearching ? activeColor : 'var(--color-primary)' }}
          />
          <div className="min-w-0">
            <h3
              className="typo-popup-title font-play truncate"
              style={{ color: showQuestionList && !isSearching ? activeColor : 'var(--color-primary)' }}
            >
              {isSearching
                ? isEn
                  ? `Search Results (${searchResults.length})`
                  : `Kết quả tìm kiếm (${searchResults.length} câu)`
                : showQuestionList
                  ? `${selectedCategory.labelWithNumber} (${selectedCategory.items.length} ${isEn ? 'questions' : 'câu'})`
                  : isEn
                    ? `Categories • ${categories.length} Topics (${totalCount})`
                    : `Danh mục câu hỏi • ${categories.length} chủ đề (${totalCount} câu)`}
            </h3>
            <p className="typo-caption text-[var(--text-muted)] line-clamp-1">
              {showQuestionList
                ? isEn
                  ? 'Click any question below to automatically insert it into the AI chat box'
                  : 'Bấm vào câu hỏi để tự động đưa vào khung chat AI hỗ trợ'
                : isEn
                  ? 'Select a category card to view its list of sample questions'
                  : 'Chọn một thẻ danh mục để xem danh sách câu hỏi mẫu'}
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

      {/* Thanh tìm nhanh + Nút quay lại Danh mục khi đang xem List câu hỏi */}
      <div
        className="px-3.5 sm:px-4 py-2 border-b flex flex-wrap items-center gap-2 shrink-0"
        style={{ borderColor: 'var(--border-subcard, var(--border-color))' }}
      >
        {showQuestionList && (
          <button
            id="ai-sample-back-to-categories-btn"
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              setSearchTerm('');
              setViewStep('categories');
            }}
            className="px-3 py-1.5 rounded-full typo-badge font-semibold flex items-center gap-1.5 border cursor-pointer shrink-0 transition hover:opacity-85"
            style={{
              background: 'var(--bg-button-secondary, var(--bg-subcard))',
              borderColor: 'var(--border-subcard, var(--border-color))',
              color: 'var(--color-primary)',
            }}
          >
            <WebIcon name="chevron-left" className="w-3.5 h-3.5" />
            <span>{isEn ? 'All Categories' : 'Quay lại Danh mục'}</span>
          </button>
        )}

        <div className="relative flex-1 min-w-[180px]">
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

      {/* Bảo vệ nội dung đang nhập dở nếu cần */}
      {pendingDraftQuestion && (
        <div
          id="ai-sample-draft-guard"
          role="alert"
          className="mx-3.5 sm:mx-4 mt-2.5 p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0"
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
              style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
              className="px-3 py-1 rounded-full typo-badge font-semibold cursor-pointer transition hover:opacity-90"
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

      {/* NỘI DUNG CHÍNH: VIEW 1 = THẺ DANH MỤC (RESPONSIVE GRID CARD) | VIEW 2 = LIST CÂU HỎI */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        {!showQuestionList ? (
          /* VIEW 1: THẺ DANH MỤC RESPONSIVE GRID CARD (1 cột Mobile -> 2 cột Tablet -> 3 cột x 4 hàng Desktop) */
          <div
            id="ai-categories-responsive-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 gap-2.5 sm:gap-3 auto-rows-fr min-h-full"
          >
            {categories.map((cat) => {
              const catColor = getReadableCategoryColor(cat.color);
              const isSelected = cat.id === selectedCategory.id;
              return (
                <button
                  key={cat.id}
                  id={`ai-droptop-item-${cat.code}`}
                  type="button"
                  data-subcard="true"
                  onClick={() => {
                    SoundEngine.playTap();
                    onSelectCategory(cat.id);
                    setViewStep('questions');
                  }}
                  style={{
                    borderRadius: 'var(--radius-subcard, 16px)',
                    ...(isSelected ? { borderColor: `${catColor}90` } : {}),
                  }}
                  className="theme-modal-subcard w-full h-full p-[15px] !rounded-[var(--radius-subcard,16px)] text-left flex items-center gap-3 min-h-[78px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group min-w-0"
                >
                  <WebIcon name={cat.icon} className="w-[18px] h-[18px] shrink-0" style={{ color: catColor }} />
                  <h4
                    className="typo-h5 font-play leading-snug break-words min-w-0 flex-1"
                    style={{ color: catColor }}
                  >
                    {cat.labelWithNumber}
                  </h4>
                </button>
              );
            })}
          </div>
        ) : isSearching ? (
          /* KẾT QUẢ TÌM KIẾM LIST CÂU HỎI */
          searchResults.length > 0 ? (
            <div id="ai-questions-search-list" className="space-y-2">
              {searchResults.map(({ category, item }) => {
                const itemColor = getReadableCategoryColor(category.color);
                return (
                  <button
                    key={`search-q-${item.id}`}
                    id={`ai-menu-l3-q-${item.id}`}
                    type="button"
                    data-subcard="true"
                    onClick={() => onSelectQuestion(item)}
                    className="theme-modal-subcard w-full p-[15px] rounded-[var(--radius-subcard,16px)] text-left transition cursor-pointer flex flex-col gap-1.5 hover:border-purple-400/70 hover:shadow-sm group min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="typo-badge font-semibold" style={{ color: itemColor }}>
                        {category.labelWithNumber} • Câu {item.number}
                      </span>
                      <span
                        className="typo-badge px-2 py-0.5 rounded-full opacity-85 group-hover:opacity-100"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {isEn ? 'Insert into chat ↵' : 'Đưa vào khung chat ↵'}
                      </span>
                    </div>
                    <p className="typo-body-sm text-[var(--text-primary)] leading-snug break-words [overflow-wrap:anywhere]">
                      {item.question}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center typo-body-sm text-[var(--text-muted)]">
              {isEn
                ? 'No matching sample questions found. Try another keyword or ask Tri Nhan directly.'
                : 'Không tìm thấy câu hỏi mẫu phù hợp. Bạn có thể xóa từ khóa hoặc đặt câu hỏi trực tiếp cho Trí Nhân.'}
            </div>
          )
        ) : (
          /* VIEW 2: LIST CÂU HỎI CỦA DANH MỤC ĐÃ CHỌN */
          <div id="ai-category-questions-list" className="space-y-2.5">
            <div
              data-subcard="true"
              className="theme-modal-subcard p-[15px] rounded-[var(--radius-subcard,16px)] flex flex-wrap items-center justify-between gap-2"
              style={{ borderColor: `${activeColor}45` }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <WebIcon name={selectedCategory.icon} className="w-4 h-4 shrink-0" style={{ color: activeColor }} />
                <div className="min-w-0">
                  <h4 className="typo-h5 font-play truncate" style={{ color: activeColor }}>
                    {selectedCategory.labelWithNumber}
                  </h4>
                  <p className="typo-caption text-[var(--text-secondary)] line-clamp-1">
                    {isEn ? selectedCategory.descriptionEn : selectedCategory.description}
                  </p>
                </div>
              </div>
              <span
                className="px-2.5 py-0.5 rounded-full typo-badge font-semibold shrink-0"
                style={{ backgroundColor: `${selectedCategory.color}20`, color: activeColor }}
              >
                {selectedCategory.items.length} {isEn ? 'questions' : 'câu hỏi'}
              </span>
            </div>

            <div className="space-y-2">
              {selectedCategory.items.map((qItem) => (
                <button
                  key={qItem.id}
                  id={`ai-menu-l3-q-${qItem.id}`}
                  type="button"
                  data-subcard="true"
                  onClick={() => onSelectQuestion(qItem)}
                  className="theme-modal-subcard w-full p-[15px] rounded-[var(--radius-subcard,16px)] text-left transition cursor-pointer flex flex-col gap-1.5 hover:border-purple-400/70 hover:shadow-sm group min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="typo-badge font-semibold" style={{ color: activeColor }}>
                      {qItem.title}
                    </span>
                    <span
                      className="typo-badge px-2 py-0.5 rounded-full shrink-0 opacity-85 group-hover:opacity-100"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {isEn ? 'Insert into chat ↵' : 'Đưa vào khung chat ↵'}
                    </span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)] leading-snug break-words [overflow-wrap:anywhere]">
                    {qItem.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleQuestionDropdown;
