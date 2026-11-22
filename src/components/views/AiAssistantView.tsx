'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { SiteTheme } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import {
  TRINHAN_SAMPLE_QUESTION_CATEGORIES,
  ALL_SAMPLE_QUESTIONS,
  SampleQuestionItem,
} from '@/data/aiSampleQuestions';
import { findVerifiedFallbackAnswer } from '@/data/triNhanKnowledgeBase';
import { SampleQuestionButton } from '@/components/ai/SampleQuestionButton';
import { SampleQuestionDropdown } from '@/components/ai/SampleQuestionDropdown';
import { FormattedAiMessage } from '@/components/ai/FormattedAiMessage';
import {
  AssistantVoiceLanguage,
  speakSiteText,
  stopActiveSpeech,
  DEFAULT_PUCK_VOICE_PERSONA,
  ENGLISH_PUCK_VOICE_PERSONA,
} from '@/utils/speechVoice';
import { BannerBackgroundVideo } from '@/components/common/BannerBackgroundVideo';

export { TRI_NHAN_CATEGORIES } from '@/data/aiSampleQuestions';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  title?: string;
  isError?: boolean;
  retryQuery?: string;
}

const INITIAL_GREETING_TEXT =
  'Xin chào Anh Chị ! Tôi là Trí Nhân, trợ lý AI của anh Hùng Thái. Anh Chị có thể hỏi tôi về thông tin của anh Hùng Thái hoặc dùng câu hỏi mẫu bên dưới !';

const INITIAL_GREETING_TEXT_EN =
  'Hello! I am Tri Nhan, Mr. Hung Thai’s AI Assistant. You can ask me about Mr. Hung Thai’s information or use the sample questions below!';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    title: 'Trí Nhân • Trợ lý AI',
    text: INITIAL_GREETING_TEXT,
  },
];

export interface AiAssistantViewProps {
  currentTheme?: SiteTheme;
  onSelectTab?: (index: number) => void;
  onShowNotification?: (msg: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onShowNotification,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark } = useTheme();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Drop-up 8 nhóm chủ đề & 47 câu hỏi mẫu
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState<boolean>(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    TRINHAN_SAMPLE_QUESTION_CATEGORIES[0].id
  );
  const [openToCategoriesToken, setOpenToCategoriesToken] = useState<number>(0);
  const [pendingDraftQuestion, setPendingDraftQuestion] = useState<SampleQuestionItem | null>(null);

  // Trạng thái giọng đọc AI Puck Nam giới (Trẻ em 10 tuổi · Miền Nam Việt Nam & Tiếng Anh)
  const [voiceLanguage, setVoiceLanguage] = useState<AssistantVoiceLanguage>(language);
  const [isAutoVoiceEnabled] = useState<boolean>(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    setVoiceLanguage(language);
  }, [language]);

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const dropTopMenuRef = useRef<HTMLDivElement>(null);
  const dropTopOverlayRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [syncedBannerHeight, setSyncedBannerHeight] = useState<number | null>(null);
  const [chatControlHeight, setChatControlHeight] = useState<number>(44);
  const [chatExpandPx, setChatExpandPx] = useState<number>(0);
  const [isDraggingExpand, setIsDraggingExpand] = useState<boolean>(false);
  const dragMovedRef = useRef<boolean>(false);
  const isChatExpanded = chatExpandPx > 0;

  const showToast = (msg: string) => {
    if (onShowNotification) onShowNotification(msg);
  };

  // Measure rendered height of #ai-assistant-droptop-menu-btn so input & submit match it across all viewports
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncControlHeight = () => {
      const btn = document.getElementById('ai-assistant-droptop-menu-btn');
      if (!btn) return;
      const h = Math.round(btn.getBoundingClientRect().height);
      if (h > 0) setChatControlHeight(h);
    };
    syncControlHeight();
    const btn = document.getElementById('ai-assistant-droptop-menu-btn');
    const ro =
      typeof ResizeObserver !== 'undefined' && btn ? new ResizeObserver(syncControlHeight) : null;
    if (ro && btn) ro.observe(btn);
    window.addEventListener('resize', syncControlHeight);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', syncControlHeight);
    };
  }, [language, isSampleDropdownOpen]);

  // Lock chat input height strictly to Danh mục button height at all times
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const baseHeight = chatControlHeight || 44;
    el.style.height = `${baseHeight}px`;
    el.style.minHeight = `${baseHeight}px`;
    el.style.maxHeight = `${baseHeight}px`;
  }, [inputValue, chatControlHeight]);

  // Drag / click handler on expand icon to widen chat container smoothly
  const handleExpandPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startExpand = chatExpandPx;
    dragMovedRef.current = false;
    setIsDraggingExpand(true);

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragMovedRef.current = true;
      }
      if (!dragMovedRef.current) return;

      const delta =
        startExpand === 0
          ? Math.max(Math.abs(dx), -dy, 0) * 2.1
          : dx * 2.1;
      const next = Math.max(0, Math.min(540, Math.round(startExpand + delta)));
      setChatExpandPx(next);
    };

    const handleUp = () => {
      setIsDraggingExpand(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  const handleExpandClick = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    SoundEngine.playTap();
    setChatExpandPx((prev) => (prev > 0 ? 0 : 420));
  };

  useEffect(() => {
    const syncHeight = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 1024) {
        setSyncedBannerHeight(null);
        return;
      }
      if (chatCardRef.current) {
        const h = Math.round(chatCardRef.current.getBoundingClientRect().height);
        if (h > 0) setSyncedBannerHeight(h);
      }
    };

    syncHeight();
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => syncHeight()) : null;
    if (observer && chatCardRef.current) {
      observer.observe(chatCardRef.current);
    }
    window.addEventListener('resize', syncHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Đóng Drop-up khi click ra ngoài hoặc bấm Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!isSampleDropdownOpen) return;
      const target = e.target as Node;
      const inWrapper = dropTopMenuRef.current?.contains(target);
      const inOverlay = dropTopOverlayRef.current?.contains(target);
      if (!inWrapper && !inOverlay) {
        setIsSampleDropdownOpen(false);
        setPendingDraftQuestion(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSampleDropdownOpen) {
        setIsSampleDropdownOpen(false);
        setPendingDraftQuestion(null);
        textareaRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSampleDropdownOpen]);

  // Dừng giọng đọc khi rời trang
  useEffect(() => {
    return () => {
      stopActiveSpeech();
    };
  }, []);

  const speakWithPuckVoice = (
    msgId: string,
    textToRead: string,
    overrideLang?: AssistantVoiceLanguage
  ) => {
    if (speakingMessageId === msgId && !overrideLang) {
      stopActiveSpeech();
      setSpeakingMessageId(null);
      return;
    }
    const targetLang = overrideLang || voiceLanguage;
    const persona =
      targetLang === 'en' ? ENGLISH_PUCK_VOICE_PERSONA : DEFAULT_PUCK_VOICE_PERSONA;

    const actualText =
      msgId === 'msg-welcome' && targetLang === 'en'
        ? INITIAL_GREETING_TEXT_EN
        : textToRead;

    setSpeakingMessageId(msgId);
    speakSiteText(actualText, {
      lang: targetLang,
      useGeminiTts: true,
      speakingStyle: 'puck',
      voiceName: persona.voiceName,
      pitch: persona.pitch,
      rate: persona.rate,
      onStart: () => setSpeakingMessageId(msgId),
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const focusChatInputAtEnd = () => {
    setTimeout(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 30);
  };

  const applySampleQuestionToInput = (item: SampleQuestionItem, mode: 'replace' | 'append') => {
    setInputValue((prev) => {
      if (mode === 'append' && prev.trim().length > 0) {
        return `${prev.trimEnd()}\n${item.question}`;
      }
      return item.question;
    });
    setPendingDraftQuestion(null);
    setIsSampleDropdownOpen(false);
    focusChatInputAtEnd();
    showToast(
      isEn
        ? `Inserted sample question #${item.number}. You can edit before sending.`
        : `Đã đưa câu hỏi #${item.number} vào khung nhập. Bạn có thể chỉnh sửa trước khi gửi.`
    );
  };

  const handleSelectQuestionItem = (item: SampleQuestionItem) => {
    SoundEngine.playTap();
    applySampleQuestionToInput(item, 'replace');
  };

  const handleConfirmDraftAction = (action: 'replace' | 'append' | 'cancel') => {
    SoundEngine.playTap();
    if (action === 'cancel' || !pendingDraftQuestion) {
      setPendingDraftQuestion(null);
      return;
    }
    applySampleQuestionToInput(pendingDraftQuestion, action);
  };

  const handleSend = async (textOverride?: string) => {
    if (isLoading) return;
    const text = (textOverride ?? inputValue).trim();
    if (!text) return;

    SoundEngine.playTap();
    setIsSampleDropdownOpen(false);
    setPendingDraftQuestion(null);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
    };

    const historySnapshot = messages
      .filter((m) => m.id !== 'msg-welcome' && !m.isError)
      .slice(-10)
      .map((m) => ({ sender: m.sender, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    if (textOverride === undefined) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historySnapshot,
          language: voiceLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        reply?: string;
        matchedTitle?: string;
        source?: string;
        fallback?: boolean;
      };

      const replyText =
        data.reply?.trim() ||
        findVerifiedFallbackAnswer(text, voiceLanguage).reply;

      const aiMsgId = `ai-${Date.now()}`;
      const aiTitle = data.matchedTitle
        ? voiceLanguage === 'en'
          ? `Tri Nhan • ${data.matchedTitle}`
          : `Trí Nhân • ${data.matchedTitle}`
        : voiceLanguage === 'en'
        ? 'Tri Nhan • AI Assistant'
        : 'Trí Nhân • Trợ lý AI';

      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        title: aiTitle,
        text: replyText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      showToast(isEn ? '✓ Tri Nhan answered your question!' : '✓ Trí Nhân đã giải đáp câu hỏi!');

      if (isAutoVoiceEnabled) {
        speakWithPuckVoice(aiMsgId, replyText, voiceLanguage);
      }
    } catch {
      const fallback = findVerifiedFallbackAnswer(text, voiceLanguage);
      const aiMsgId = `ai-err-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        title: isEn ? 'Tri Nhan • Offline Fallback' : 'Trí Nhân • Dữ liệu xác thực',
        text: fallback.reply,
        isError: false,
        retryQuery: text,
      };
      setMessages((prev) => [...prev, aiMsg]);
      showToast(
        isEn
          ? 'Connection notice: Used verified local portfolio data.'
          : 'Đang dùng dữ liệu hồ sơ xác thực do kết nối máy chủ AI gián đoạn.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      id="ai-assistant-page-container"
      data-element-name="Trang Trợ lý AI Hỗ trợ Trí Nhân"
      data-element-type="container"
      data-element-page="ai-assistant"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="ai-assistant-cards-track"
        data-element-name="Track căn giữa Trợ lý AI"
        data-element-type="container"
        data-element-page="ai-assistant"
        data-element-parent="ai-assistant-page-container"
        className="page-cards-track"
      >
        <div
          id="ai-assistant-main-card"
          data-main-card="true"
          data-layer-level="1"
          data-chat-expanded={isChatExpanded ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Trợ lý AI"
          data-element-type="card"
          data-element-page="ai-assistant"
          data-element-parent="ai-assistant-cards-track"
          style={
            isChatExpanded
              ? ({
                  '--ai-chat-extra-w': `${chatExpandPx}px`,
                  '--ai-banner-collapsed-w': `${Math.max(0, 235 - Math.round(chatExpandPx * 1.15))}px`,
                } as React.CSSProperties)
              : undefined
          }
          className="page-main-card flex flex-col items-stretch p-[15px] gap-[15px] rounded-[14px] overflow-y-auto lg:overflow-hidden font-play text-left justify-start box-border"
        >
      <div
        className={`flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch ${
          chatExpandPx >= 200 ? 'gap-0 lg:gap-0' : 'gap-[15px]'
        }`}
      >
      {/* 1. HERO BANNER TRỢ LÝ AI TRÍ NHÂN */}
      <section
        id="ai-assistant-hero-banner"
        data-element-name="Banner Trợ lý AI Trí Nhân"
        data-element-type="banner-card"
        data-section-card="true"
        data-element-page="ai-assistant"
        data-element-parent="ai-assistant-main-card"
        className="banner-card bento-card glass-card group w-full min-h-[170px] lg:min-h-0 lg:w-[235px] lg:min-w-[235px] lg:max-w-[235px] lg:flex-[0_0_235px] xl:w-[255px] xl:min-w-[255px] xl:max-w-[255px] xl:flex-[0_0_255px] lg:self-stretch rounded-[14px] border relative overflow-hidden text-[var(--text-primary)] z-30 flex flex-col justify-between p-[15px] box-border shadow-xl transition-all duration-300"
        style={{
          padding: '15px',
          borderRadius: 'var(--radius-banner, 24px)',
          boxSizing: 'border-box',
          ...(syncedBannerHeight
            ? {
                height: `${syncedBannerHeight}px`,
                minHeight: `${syncedBannerHeight}px`,
                maxHeight: `${syncedBannerHeight}px`,
              }
            : {}),
        }}
      >
        <div className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0">
          <BannerBackgroundVideo
            id="ai-assistant-banner-video"
            src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4"
            alt="AI Hỗ Trợ • Trí Nhân"
            objectPosition="50% 18%"
            className="transition-all duration-700 select-none pointer-events-none"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

        <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
          <div className="card-header-sync flex items-center gap-2 w-full min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon name="bot" className="w-[22px] h-[22px] shrink-0" />
            <h1
              id="ai-assistant-banner-h1"
              className="typo-h3 card-title-synced font-play not-italic tracking-tight leading-tight whitespace-normal min-w-0"
              data-card-title="true"
            >
              AI Hỗ Trợ • Trí Nhân
            </h1>
          </div>
          <p
            id="ai-assistant-banner-quote"
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left w-full whitespace-normal leading-snug"
            style={{
              color: 'var(--text-secondary)',
              fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
              fontWeight: 600,
              fontStyle: 'normal',
            }}
          >
            &quot;Trí Nhân đồng hành giải đáp thông tin anh Hùng Thái 24/7 ♡&quot;
          </p>
        </div>
      </section>

      {/* 2. CHAT INTERFACE CHÍNH */}
      <div
        ref={chatCardRef}
        id="ai-assistant-chat-container"
        data-element-name="Khung trò chuyện Trợ lý AI Trí Nhân"
        data-element-type="card"
        data-section-card="true"
        data-element-page="ai-assistant"
        data-element-parent="ai-assistant-main-card"
        className="bento-card glass-card min-w-0 min-h-0 flex-1 lg:h-full lg:min-h-full lg:max-h-full flex flex-col justify-between rounded-[14px] shadow-xl gap-[15px] overflow-hidden relative"
        style={{
          flex: '1 1 0%',
          minWidth: 0,
          maxWidth: '100%',
          alignSelf: 'stretch',
          padding: '15px',
          gap: '15px',
          borderRadius: 'var(--radius-card, 24px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Vùng hiển thị tin nhắn + Drop-up Câu hỏi mẫu neo ngay trên khung nhập */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            id="ai-assistant-messages-viewport"
            className="flex-1 overflow-y-auto no-scrollbar rounded-[14px] space-y-3.5 pr-1 min-h-0"
          >
            {messages.map((m) => {
              const displayTitle =
                m.id === 'msg-welcome' && isEn
                  ? 'Tri Nhan • AI Assistant'
                  : m.title;
              const displayText =
                m.id === 'msg-welcome' && isEn
                  ? INITIAL_GREETING_TEXT_EN
                  : m.text;
              return (
                <div
                  key={m.id}
                  id={`ai-chat-msg-${m.id}`}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    data-element-type={m.sender === 'ai' ? 'card' : undefined}
                    data-subcard={m.sender === 'ai' ? 'true' : undefined}
                    style={m.sender === 'user' ? { background: 'var(--bg-button-primary)' } : undefined}
                    className={`max-w-[92%] sm:max-w-[82%] p-[15px] rounded-[14px] leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'text-white rounded-br-none font-medium'
                        : 'ai-assistant-bubble sub-card rounded-bl-none shadow-xs'
                    }`}
                  >
                    {displayTitle && (
                      <div
                        className={`flex items-center justify-between gap-2 pb-1.5 mb-2 border-b typo-h5 ${
                          m.sender === 'user' ? 'border-white/25 text-white/95' : ''
                        }`}
                        style={
                          m.sender === 'ai'
                            ? { borderColor: 'var(--border-subcard)', color: 'var(--color-primary)' }
                            : undefined
                        }
                      >
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <WebIcon name={m.sender === 'ai' ? 'bot' : 'user'} className="w-4 h-4 shrink-0" />
                          <span className="truncate">{displayTitle}</span>
                        </span>
                        {m.sender === 'ai' && (
                          <button
                            type="button"
                            onClick={() => speakWithPuckVoice(m.id, displayText)}
                            className="project-detail-chip inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full typo-badge cursor-pointer transition shrink-0 hover:opacity-85"
                            title={isEn ? 'AI Tri Nhan (Puck)' : 'AI Trí Nhân (Puck • Miền Nam)'}
                          >
                            <WebIcon name={speakingMessageId === m.id ? 'pause' : 'volume'} className="w-3.5 h-3.5" />
                            <span>
                              {speakingMessageId === m.id
                                ? isEn
                                  ? 'Stop'
                                  : 'Dừng đọc'
                                : isEn
                                ? 'Read'
                                : 'Đọc'}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {m.sender === 'ai' ? (
                      <FormattedAiMessage text={displayText} />
                    ) : (
                      <p className="typo-body whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                        {displayText}
                      </p>
                    )}

                    {m.retryQuery && (
                      <div className="mt-2 pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-subcard)' }}>
                        <button
                          type="button"
                          onClick={() => handleSend(m.retryQuery)}
                          className="inline-flex items-center gap-1 typo-badge font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition hover:opacity-85"
                          style={{
                            borderColor: 'var(--border-subcard)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          <WebIcon name="rotate-ccw" className="w-3 h-3" />
                          <span>{isEn ? 'Retry AI answer' : 'Thử hỏi lại AI'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div id="ai-assistant-loading-indicator" className="flex justify-start">
                <div
                  data-subcard="true"
                  className="ai-assistant-bubble sub-card p-[15px] rounded-[14px] flex items-center gap-[15px] typo-body-sm font-semibold font-play"
                >
                  <WebIcon name="bot" className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {isEn
                      ? 'Tri Nhan is compiling insights about Mr. Nguyen Hung Thai...'
                      : 'Trí Nhân đang tổng hợp thông tin...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* DROP-UP THẺ DANH MỤC (GRID CARD) -> LIST CÂU HỎI */}
          <div
            ref={dropTopOverlayRef}
            className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-end"
          >
            <SampleQuestionDropdown
              isOpen={isSampleDropdownOpen}
              isDark={isDark}
              isEn={isEn}
              categories={TRINHAN_SAMPLE_QUESTION_CATEGORIES}
              activeCategoryId={activeCategoryId}
              openToCategoriesToken={openToCategoriesToken}
              onSelectCategory={(catId) => setActiveCategoryId(catId)}
              onSelectQuestion={handleSelectQuestionItem}
              onClose={() => {
                setIsSampleDropdownOpen(false);
                setPendingDraftQuestion(null);
              }}
              pendingDraftQuestion={pendingDraftQuestion}
              onConfirmDraftAction={handleConfirmDraftAction}
            />
          </div>
        </div>

        {/* FORM NHẬP TIN NHẮN: [Nút Danh mục] [Khung nhập chat = chiều cao nút Danh mục + icon kéo giãn rộng] [Nút Gửi] */}
        <form
          id="ai-assistant-input-form"
          data-element-name="Biểu mẫu nhập câu hỏi Trợ lý AI Trí Nhân"
          data-element-type="control"
          data-element-page="ai-assistant"
          data-element-parent="ai-assistant-chat-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 sm:gap-2.5 pt-1 relative shrink-0"
        >
          <div ref={dropTopMenuRef} id="ai-assistant-droptop-wrapper" className="shrink-0 flex items-center">
            <SampleQuestionButton
              isOpen={isSampleDropdownOpen}
              isEn={isEn}
              totalQuestions={ALL_SAMPLE_QUESTIONS.length}
              onToggle={() => {
                SoundEngine.playTap();
                setIsSampleDropdownOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    setOpenToCategoriesToken((t) => t + 1);
                  } else {
                    setPendingDraftQuestion(null);
                  }
                  return next;
                });
              }}
            />
          </div>

          <div
            id="ai-assistant-input-wrapper"
            style={{
              height: `${chatControlHeight}px`,
              minHeight: `${chatControlHeight}px`,
              maxHeight: `${chatControlHeight}px`,
            }}
            className="relative flex-1 min-w-0 flex items-center box-border"
          >
            <textarea
              ref={textareaRef}
              id="ai-assistant-input-text"
              data-element-name="Ô nhập nội dung câu hỏi AI Trí Nhân"
              data-element-type="control"
              data-element-page="ai-assistant"
              data-element-parent="ai-assistant-input-form"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder={
                isEn
                  ? 'Enter question with Tri Nhan...'
                  : 'Nhập câu hỏi với Trí Nhân...'
              }
              style={{
                height: `${chatControlHeight}px`,
                minHeight: `${chatControlHeight}px`,
                maxHeight: `${chatControlHeight}px`,
                lineHeight: '22px',
                paddingTop: `${Math.max(4, Math.floor((chatControlHeight - 24) / 2))}px`,
                paddingBottom: `${Math.max(4, Math.floor((chatControlHeight - 24) / 2))}px`,
                borderRadius: `${Math.round(chatControlHeight / 2)}px`,
              }}
              className="theme-input box-border w-full h-full pl-3.5 sm:pl-4 pr-10 border typo-input resize-none focus:outline-none shadow-inner overflow-y-auto no-scrollbar"
            />
            <button
              id="ai-assistant-chat-expand-btn"
              type="button"
              onPointerDown={handleExpandPointerDown}
              onClick={handleExpandClick}
              aria-expanded={isChatExpanded}
              aria-label={
                isEn
                  ? isChatExpanded
                    ? 'Restore standard chat width (or drag to resize)'
                    : 'Drag or click to widen chat frame'
                  : isChatExpanded
                  ? 'Thu gọn khung chat về mặc định (hoặc kéo để chỉnh)'
                  : 'Kéo hoặc nhấn để mở rộng khung chat rộng hơn'
              }
              title={
                isEn
                  ? isChatExpanded
                    ? 'Drag or click to resize chat width'
                    : 'Drag or click to widen chat frame'
                  : isChatExpanded
                  ? 'Kéo hoặc nhấn để chỉnh độ rộng khung chat'
                  : 'Kéo hoặc nhấn để kéo giãn khung chat rộng hơn'
              }
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-ew-resize touch-none select-none z-10 ${
                isChatExpanded || isDraggingExpand
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <WebIcon
                name={isChatExpanded ? 'minimize-2' : 'move-horizontal'}
                className="w-4 h-4 shrink-0 pointer-events-none"
              />
            </button>
          </div>

          <button
            id="ai-assistant-submit-button"
            data-element-name="Nút trao đổi AI Trí Nhân"
            data-element-type="button"
            data-element-page="ai-assistant"
            data-element-parent="ai-assistant-input-form"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              background: 'var(--bg-button-primary)',
              height: `${chatControlHeight}px`,
              minHeight: `${chatControlHeight}px`,
              maxHeight: `${chatControlHeight}px`,
            }}
            className="box-border px-3 sm:px-5 rounded-full text-white typo-button shadow-md cursor-pointer transition hover:opacity-90 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 border border-white/20"
          >
            <span>{isEn ? 'Chat' : 'Trao đổi'}</span>
            <WebIcon name="send" className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantView;
