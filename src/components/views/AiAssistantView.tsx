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
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';

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

const DID_AGENT_SCRIPT_URL = 'https://agent.d-id.com/v2/index.js';
const DID_AGENT_ID = 'v2_agt_1tkm8qYc';
const DID_CLIENT_KEY = 'ck_aNohELomFnIRmYfOmUR4u';
const DID_SHARE_URL =
  'https://studio.d-id.com/agents/share?id=v2_agt_1tkm8qYc&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGMzTkRnMk5qUTNPVGt4T1RZeU16QTJOVFk2UkVkNldUaDFXR3R3VEUxTGVWTlpObkp5VUU1UQ==';

// Video nền khung chat AI Hỗ trợ (luôn tắt tiếng - muted)
const AI_CHAT_IDLE_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/c81ba72750f77882cc06ff84414c9117c0705d99efc1e6e0ad519af88a4fc731.mp4';
const AI_CHAT_RESPONDING_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/9daae10f4c2a9811e992cf36d580ba22f8dffdaabcda99959b1b5f6bea4c8424.mp4';
const AI_RESPONSE_VIDEO_HOLD_MS = 7000;

interface DidAgentModule {
  init: (config: Record<string, unknown>) => Promise<{ destroy?: () => void }> | { destroy?: () => void };
  getAuth?: (opts: { clientKey: string }) => unknown;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onShowNotification,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark } = useTheme();

  // Chế độ hiển thị trong khung trò chuyện: 'trinhan' (Hỏi đáp Trí Nhân + video nền động) hoặc 'did' (Nhúng trực tiếp D-ID AI Agent)
  const [chatViewMode, setChatViewMode] = useState<'did' | 'trinhan'>('trinhan');
  const [didStatus, setDidStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [didErrorMsg, setDidErrorMsg] = useState<string>('');
  const [didMountNonce, setDidMountNonce] = useState<number>(0);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyVideoActive, setIsReplyVideoActive] = useState(false);

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

  const idleBgVideoRef = useRef<HTMLVideoElement | null>(null);
  const respondingBgVideoRef = useRef<HTMLVideoElement | null>(null);
  const replyVideoTimerRef = useRef<number | null>(null);

  const isAiResponding = isLoading || isReplyVideoActive || speakingMessageId !== null;

  const triggerAiResponseVideo = () => {
    setIsReplyVideoActive(true);
    if (replyVideoTimerRef.current !== null) {
      window.clearTimeout(replyVideoTimerRef.current);
    }
    replyVideoTimerRef.current = window.setTimeout(() => {
      setIsReplyVideoActive(false);
      replyVideoTimerRef.current = null;
    }, AI_RESPONSE_VIDEO_HOLD_MS);
  };

  useEffect(() => {
    setVoiceLanguage(language);
  }, [language]);

  // Đồng bộ phát/tạm dừng mượt giữa video màn hình chờ và video AI phản hồi (luôn muted) trên hero banner
  useEffect(() => {
    const idleEl = idleBgVideoRef.current;
    const respondingEl = respondingBgVideoRef.current;
    if (idleEl) {
      idleEl.muted = true;
      idleEl.defaultMuted = true;
    }
    if (respondingEl) {
      respondingEl.muted = true;
      respondingEl.defaultMuted = true;
    }

    const activeEl = isAiResponding ? respondingEl : idleEl;
    const inactiveEl = isAiResponding ? idleEl : respondingEl;

    if (activeEl) {
      activeEl.muted = true;
      const playPromise = activeEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Bỏ qua nếu trình duyệt chặn autoplay tạm thời trước tương tác
        });
      }
    }

    const pauseTimer = window.setTimeout(() => {
      if (inactiveEl && !inactiveEl.paused) {
        inactiveEl.pause();
      }
    }, 520);

    return () => {
      window.clearTimeout(pauseTimer);
    };
  }, [isAiResponding]);

  useEffect(() => {
    return () => {
      if (replyVideoTimerRef.current !== null) {
        window.clearTimeout(replyVideoTimerRef.current);
      }
    };
  }, []);

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const dropTopMenuRef = useRef<HTMLDivElement>(null);
  const dropTopOverlayRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const didEmbedHostRef = useRef<HTMLDivElement>(null);
  const didInstanceRef = useRef<{ destroy?: () => void } | null>(null);
  const [chatControlHeight, setChatControlHeight] = useState<number>(44);
  const [chatExpandPx, setChatExpandPx] = useState<number>(0);
  const [isDraggingExpand, setIsDraggingExpand] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const dragMovedRef = useRef<boolean>(false);
  const isChatExpanded = chatExpandPx > 0;

  const showToast = (msg: string) => {
    if (onShowNotification) onShowNotification(msg);
  };

  const quickStarterPrompts = isEn
    ? [
        'Summarize Mr. Nguyen Hung Thai’s 22+ years of leadership experience',
        'What were his key achievements at MoMo and Viettel?',
        'What Contact Center & CRM systems has he built?',
        'How can I contact or download his CV?',
      ]
    : [
        'Tóm tắt hành trình 22+ năm lãnh đạo của anh Hùng Thái',
        'Thành tựu nổi bật tại MoMo và Viettel là gì?',
        'Các hệ thống tổng đài & CRM anh đã xây dựng?',
        'Thông tin liên hệ và cách xem hồ sơ CV?',
      ];

  const handleCopyMessage = async (msgId: string, content: string) => {
    SoundEngine.playTap();
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(msgId);
      showToast(isEn ? 'Copied response to clipboard' : 'Đã sao chép câu trả lời');
      window.setTimeout(() => {
        setCopiedMessageId((prev) => (prev === msgId ? null : prev));
      }, 1800);
    } catch {
      showToast(isEn ? 'Unable to copy text' : 'Không thể sao chép nội dung');
    }
  };

  const handleResetChat = () => {
    SoundEngine.playTap();
    stopActiveSpeech();
    setSpeakingMessageId(null);
    setIsReplyVideoActive(false);
    setMessages(INITIAL_MESSAGES);
    setInputValue('');
    setPendingDraftQuestion(null);
    setIsSampleDropdownOpen(false);
    showToast(isEn ? 'Started a new conversation' : 'Đã làm mới cuộc trò chuyện với Trí Nhân');
  };

  // Nhúng trực tiếp D-ID Agent SDK v2 vào khung #did-agent-embed-container bên trong khung trò chuyện
  useEffect(() => {
    if (chatViewMode !== 'did') {
      if (didInstanceRef.current?.destroy) {
        try {
          didInstanceRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        didInstanceRef.current = null;
      }
      return;
    }

    let cancelled = false;
    const hostEl = didEmbedHostRef.current;
    if (!hostEl) return;

    setDidStatus('loading');
    setDidErrorMsg('');

    const mountDidAgent = async () => {
      try {
        // Nạp module D-ID SDK v2 qua dynamic import runtime để tái khởi tạo sạch sẽ mỗi lần quay lại trang
        const importer = new Function('u', 'return import(u)') as (u: string) => Promise<DidAgentModule>;
        const mod = await importer(DID_AGENT_SCRIPT_URL);
        if (cancelled || !didEmbedHostRef.current) return;

        if (!mod || typeof mod.init !== 'function') {
          throw new Error('Không tìm thấy hàm khởi tạo D-ID Agent.');
        }

        const authConfig =
          typeof mod.getAuth === 'function'
            ? mod.getAuth({ clientKey: DID_CLIENT_KEY })
            : { type: 'key', clientKey: DID_CLIENT_KEY };

        const instance = await mod.init({
          mode: 'full',
          targetElement: didEmbedHostRef.current,
          auth: authConfig,
          agentId: DID_AGENT_ID,
          name: 'did-agent',
          monitor: true,
          lightMode: false,
          orientation: 'horizontal',
          position: 'right',
          openMode: 'expanded',
          onError: (err: unknown) => {
            if (cancelled) return;
            const detail = err instanceof Error ? err.message : String(err || '');
            setDidErrorMsg(detail);
            setDidStatus('error');
          },
        });

        if (cancelled) {
          instance?.destroy?.();
          return;
        }

        didInstanceRef.current = instance || null;
        setDidStatus('ready');
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Không thể kết nối máy chủ D-ID Agent.';
        setDidErrorMsg(msg);
        setDidStatus('error');
      }
    };

    mountDidAgent();

    return () => {
      cancelled = true;
      if (didInstanceRef.current?.destroy) {
        try {
          didInstanceRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        didInstanceRef.current = null;
      }
      if (hostEl) {
        hostEl.innerHTML = '';
      }
    };
  }, [chatViewMode, didMountNonce]);

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
    setChatExpandPx((prev) => (prev > 0 ? 0 : 480));
  };

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
      triggerAiResponseVideo();
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
      triggerAiResponseVideo();
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
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play text-left rounded-none box-border"
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
          data-floating-surface="main"
          data-chat-expanded={isChatExpanded ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Trợ lý AI"
          data-element-type="card"
          data-element-page="ai-assistant"
          data-element-parent="ai-assistant-cards-track"
          style={
            isChatExpanded
              ? ({
                  '--ai-chat-extra-w': `${chatExpandPx}px`,
                } as React.CSSProperties)
              : undefined
          }
          className="page-main-card floating-surface--main relative flex flex-col items-stretch p-2.5 sm:p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play text-left justify-start box-border"
        >
          <div
            id="ai-assistant-main-scroll-viewport"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-2.5 sm:gap-[15px] overflow-y-auto lg:overflow-hidden overflow-x-hidden no-scrollbar box-border"
          >
      <div
        id="ai-assistant-split-stage"
        className={`flex-1 min-h-0 h-full w-full flex flex-col lg:flex-row items-stretch ${
          chatExpandPx >= 360 ? 'lg:gap-0 gap-2.5' : 'gap-2.5 sm:gap-[15px]'
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
        className={`banner-card bento-card glass-card group w-full min-h-[168px] sm:min-h-[195px] lg:min-h-0 lg:self-stretch rounded-[var(--radius-card,var(--radius-global,14px))] border relative overflow-hidden text-[var(--text-primary)] z-30 flex flex-col justify-between p-3 sm:p-[15px] box-border shadow-xl transition-all duration-300 ${
          chatExpandPx >= 360 ? 'lg:opacity-0 lg:pointer-events-none lg:border-0 lg:p-0' : ''
        }`}
        style={{
          borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
          boxSizing: 'border-box',
        }}
      >
        <div
          id="ai-assistant-banner-video-bg"
          aria-hidden="true"
          className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
        >
          {/* Video màn hình chờ (Idle) */}
          <video
            ref={idleBgVideoRef}
            src={AI_CHAT_IDLE_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
              isAiResponding ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Video khi AI phản hồi chat (Responding) */}
          <video
            ref={respondingBgVideoRef}
            src={AI_CHAT_RESPONDING_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
              isAiResponding ? 'opacity-100' : 'opacity-0'
            }`}
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
              Trợ lý trí nhân
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

        {/* Nút truy cập D-ID AI Agent Hỗ trợ */}
        <div className="relative z-10 mt-auto pt-3 w-full">
          <a
            href="https://studio.d-id.com/agents/share?id=v2_agt_1tkm8qYc&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGMzTkRnMk5qUTNPVGt4T1RZeU16QTJOVFk2UkVkNldUaDFXR3R3VEUxTGVWTlpObkp5VUU1UQ=="
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => SoundEngine.playTap()}
            title={isEn ? 'Open AI Assistant Agent (D-ID)' : 'Mở Banner AI Hỗ trợ Trí Nhân (D-ID Agent)'}
            aria-label={isEn ? 'Open AI Assistant Agent (D-ID)' : 'Mở Banner AI Hỗ trợ Trí Nhân (D-ID Agent)'}
            className="banner-primary-cta inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-full typo-button font-bold transition-all cursor-pointer"
          >
            <WebIcon name="external-link" className="w-3.5 h-3.5 text-current" />
            <span className="truncate">{isEn ? 'AI Support Agent' : 'Mở AI Hỗ Trợ'}</span>
          </a>
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
        data-ai-responding={isAiResponding ? 'true' : 'false'}
        className="bento-card glass-card w-full flex-1 min-h-[380px] lg:min-h-0 lg:h-full flex flex-col justify-between rounded-[var(--radius-card,var(--radius-global,14px))] shadow-xl gap-2.5 sm:gap-[12px] overflow-hidden relative transition-all duration-300"
        style={{
          alignSelf: 'stretch',
          padding: '15px',
          borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
          boxSizing: 'border-box',
        }}
      >

        {/* Thanh chuyển chế độ trong khung chat: Hỏi đáp Trí Nhân <-> AI Trực quan D-ID */}
        <div
          id="ai-assistant-mode-bar"
          className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0"
        >
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]/80 backdrop-blur-md">
            <button
              id="ai-mode-tab-trinhan"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setChatViewMode('trinhan');
              }}
              aria-pressed={chatViewMode === 'trinhan'}
              style={
                chatViewMode === 'trinhan'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                  : { color: 'var(--text-primary)' }
              }
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full typo-badge font-bold transition-all cursor-pointer"
            >
              <WebIcon name="message-square" className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isEn
                  ? `Tri Nhan Q&A (${ALL_SAMPLE_QUESTIONS.length})`
                  : `Hỏi đáp Trí Nhân (${ALL_SAMPLE_QUESTIONS.length})`}
              </span>
            </button>

            <button
              id="ai-mode-tab-did"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                stopActiveSpeech();
                setSpeakingMessageId(null);
                setChatViewMode('did');
              }}
              aria-pressed={chatViewMode === 'did'}
              style={
                chatViewMode === 'did'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                  : { color: 'var(--text-primary)' }
              }
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full typo-badge font-bold transition-all cursor-pointer"
            >
              <WebIcon name="video" className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'AI Support Agent (D-ID)' : 'Trợ lý AI Hỗ trợ (D-ID)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {chatViewMode === 'trinhan' && messages.length > 1 && (
              <button
                id="ai-chat-reset-btn"
                type="button"
                onClick={handleResetChat}
                title={isEn ? 'Start new conversation' : 'Làm mới cuộc trò chuyện'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] typo-badge font-semibold transition cursor-pointer"
              >
                <WebIcon name="rotate-ccw" className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{isEn ? 'New chat' : 'Làm mới'}</span>
              </button>
            )}

            {chatViewMode === 'did' && (
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setDidMountNonce((n) => n + 1);
                }}
                title={isEn ? 'Reload D-ID Agent' : 'Tải lại khung AI Hỗ trợ'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] typo-badge font-semibold transition cursor-pointer"
              >
                <WebIcon name="refresh" className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{isEn ? 'Reload' : 'Tải lại'}</span>
              </button>
            )}

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
                  ? 'Drag or click to widen chat frame'
                  : 'Kéo hoặc nhấn để mở rộng khung chat'
              }
              style={
                isChatExpanded || isDraggingExpand
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)', borderColor: 'transparent' }
                  : undefined
              }
              className={`hidden lg:flex w-8 h-8 rounded-full border border-[var(--border-subcard)] items-center justify-center transition-colors cursor-ew-resize touch-none select-none ${
                isChatExpanded || isDraggingExpand
                  ? 'shadow-xs'
                  : 'bg-[var(--bg-subcard)]/85 backdrop-blur-md text-[var(--text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <WebIcon
                name={isChatExpanded ? 'minimize-2' : 'move-horizontal'}
                className="w-4 h-4 shrink-0 pointer-events-none"
              />
            </button>
          </div>
        </div>

        {/* CHẾ ĐỘ 1: NHÚNG TRỰC TIẾP D-ID AGENT VÀO KHUNG CHAT */}
        {chatViewMode === 'did' ? (
          <div
            id="did-agent-embed-wrapper"
            data-element-name="Khung nhúng AI Hỗ trợ D-ID Agent"
            className="relative z-10 flex-1 min-h-[340px] lg:min-h-0 w-full rounded-[14px] overflow-hidden border border-[var(--border-subcard)] bg-slate-950/90 flex flex-col"
          >
            {/* Vùng DOM mount ShadowRoot của D-ID SDK v2 (mode: full, agentId: v2_agt_1tkm8qYc) */}
            <div
              id="did-agent-embed-container"
              ref={didEmbedHostRef}
              data-mode="fabio"
              data-client-key={DID_CLIENT_KEY}
              data-agent-id={DID_AGENT_ID}
              data-name="did-agent"
              data-monitor="true"
              data-light-mode="false"
              data-orientation="horizontal"
              data-position="right"
              data-open-mode="expanded"
              className="w-full h-full flex-1 min-h-0 relative"
            />

            {didStatus === 'loading' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-6 text-center bg-slate-950/85 backdrop-blur-md text-white pointer-events-none">
                <WebIcon name="bot" className="w-9 h-9 text-sky-400 animate-spin" />
                <p className="typo-body font-semibold text-white/95 m-0">
                  {isEn
                    ? 'Connecting interactive AI Support Agent...'
                    : 'Đang kết nối Trợ lý AI hỗ trợ trực quan Trí Nhân...'}
                </p>
                <span className="typo-caption text-slate-300">
                  Agent ID: {DID_AGENT_ID}
                </span>
              </div>
            )}

            {didStatus === 'error' && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 p-6 text-center bg-slate-950/92 backdrop-blur-md text-white">
                <WebIcon name="alert-circle" className="w-9 h-9 text-amber-400" />
                <div className="space-y-1 max-w-md">
                  <p className="typo-h4 font-bold text-white m-0">
                    {isEn ? 'Unable to load embedded D-ID Agent' : 'Không thể tải trực tiếp khung D-ID Agent'}
                  </p>
                  <p className="typo-caption text-slate-300 leading-relaxed m-0">
                    {didErrorMsg ||
                      (isEn
                        ? 'Please check network access or open the Agent directly, or switch to Tri Nhan Q&A.'
                        : 'Miền xem trước hoặc trình duyệt hiện chặn nhúng trực tiếp. Anh Chị có thể mở trực tiếp trên D-ID Studio hoặc chuyển sang tab Hỏi đáp Trí Nhân.')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setDidMountNonce((n) => n + 1);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-button font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
                  >
                    <WebIcon name="refresh" className="w-4 h-4" />
                    <span>{isEn ? 'Retry' : 'Thử kết nối lại'}</span>
                  </button>
                  <a
                    href={DID_SHARE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => SoundEngine.playTap()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-button font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md hover:brightness-110 transition cursor-pointer"
                  >
                    <WebIcon name="external-link" className="w-4 h-4" />
                    <span>{isEn ? 'Open D-ID Agent' : 'Mở D-ID Agent'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setChatViewMode('trinhan');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-button font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/35 transition cursor-pointer"
                  >
                    <WebIcon name="message-square" className="w-4 h-4" />
                    <span>{isEn ? 'Use Tri Nhan Q&A' : 'Dùng Hỏi đáp Trí Nhân'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* CHẾ ĐỘ 2: HỘI THOẠI TRÍ NHÂN Q&A VỚI 47 CÂU HỎI MẪU & GIỌNG ĐỌC PUCK */
          <>
            <div className="relative z-10 flex-1 min-h-0 flex flex-col">
              <div
                id="ai-assistant-messages-viewport"
                className="flex-1 overflow-y-auto no-scrollbar rounded-[14px] space-y-3.5 pr-1 min-h-0 bg-transparent"
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
                        style={
                          m.sender === 'user'
                            ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                            : undefined
                        }
                        className={`max-w-[92%] sm:max-w-[82%] p-[15px] rounded-[14px] leading-relaxed shadow-sm ${
                          m.sender === 'user'
                            ? 'rounded-br-none font-medium'
                            : 'ai-assistant-bubble sub-card rounded-bl-none shadow-xs'
                        }`}
                      >
                        {displayTitle && (
                          <div
                            className={`flex items-center justify-between gap-2 pb-1.5 mb-2 border-b typo-h5 ${
                              m.sender === 'user' ? 'border-current/25' : ''
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
                              <div className="inline-flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessage(m.id, displayText)}
                                  className="project-detail-chip inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge cursor-pointer transition shrink-0 hover:opacity-85"
                                  title={isEn ? 'Copy response' : 'Sao chép nội dung'}
                                >
                                  <WebIcon name={copiedMessageId === m.id ? 'check' : 'copy'} className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">
                                    {copiedMessageId === m.id ? (isEn ? 'Copied' : 'Đã chép') : isEn ? 'Copy' : 'Chép'}
                                  </span>
                                </button>
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
                              </div>
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

                {messages.length === 1 && !isLoading && (
                  <div
                    id="ai-assistant-quick-prompts"
                    className="flex flex-wrap items-center gap-2 pt-1"
                  >
                    {quickStarterPrompts.map((promptText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(promptText)}
                        className="project-detail-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-badge font-semibold text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xs"
                      >
                        <WebIcon name="sparkles" className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        <span>{promptText}</span>
                      </button>
                    ))}
                  </div>
                )}

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

            {/* FORM NHẬP TIN NHẮN */}
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
              className="relative z-10 flex items-center gap-1.5 sm:gap-2.5 pt-1 shrink-0"
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
                  className="theme-input box-border w-full h-full pl-3.5 sm:pl-4 pr-4 border typo-input resize-none focus:outline-none shadow-inner overflow-y-auto no-scrollbar"
                />
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
                  color: 'var(--text-button-primary, #FFFFFF)',
                  height: `${chatControlHeight}px`,
                  minHeight: `${chatControlHeight}px`,
                  maxHeight: `${chatControlHeight}px`,
                }}
                className="box-border px-3 sm:px-5 rounded-full typo-button shadow-md cursor-pointer transition hover:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 border border-white/20"
              >
                <span>{isEn ? 'Chat' : 'Trao đổi'}</span>
                <WebIcon name="send" className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}
      </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantView;
