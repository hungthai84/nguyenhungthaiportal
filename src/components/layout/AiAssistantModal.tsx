import React, { useState, useEffect } from 'react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (index: number) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    sender: 'ai',
    text: 'Xin chào! Tôi là Trợ lý AI Hùng Thái 24/7. Bạn muốn tìm hiểu gì về kinh nghiệm 22+ năm, dịch vụ CSKH, các dự án hay cách liên hệ hợp tác với Nguyễn Hùng Thái?'
  }
];

const PRESET_QUESTIONS = [
  'Hùng Thái có kinh nghiệm ở các tập đoàn nào?',
  'Tỷ lệ CSAT và chỉ số FCR tiêu biểu?',
  'Quy trình xử lý khủng hoảng truyền thông?',
  'Cách thức liên hệ và đặt lịch tư vấn?'
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('tập đoàn') || lower.includes('công ty') || lower.includes('kinh nghiệm')) {
        reply = 'Nguyễn Hùng Thái có hơn 22 năm kinh nghiệm điều hành CSKH tại MobiFone, Viễn Liên V247, HTVC, VED (Garena/Shopee), Prudential Việt Nam, Ví MoMo, Finviet (Ví ECO). Bạn có thể mở Tab 06 (Kinh Nghiệm) hoặc Tab 01 (Thư Ngỏ) để xem chi tiết từng cộc mốc!';
      } else if (lower.includes('csat') || lower.includes('fcr') || lower.includes('chỉ số')) {
        reply = 'Các chỉ số vận hành nổi bật: CSAT đạt 98.2% - 99%, FCR > 92% - 94.5%, SLA tiếp nhận > 98%, tốc độ phản hồi Live Chat/Ticket dưới 30 giây, và tự động hóa hoàn tiền qua RPA dưới 90 giây!';
      } else if (lower.includes('khủng hoảng') || lower.includes('sự cố')) {
        reply = 'Nguyên tắc xử lý khủng hoảng: 3 phút kết nối, 15 phút đưa giải pháp bước đầu (Fast-Track). Thiết lập War-Room khẩn cấp, minh bạch thông tin, chủ động đồng cảm và bồi thường thỏa đáng.';
      } else if (lower.includes('liên hệ') || lower.includes('tư vấn') || lower.includes('lịch')) {
        reply = 'Bạn có thể gọi trực tiếp Hotline 0903.011.699, nhắn Zalo 0903011699, gửi email hungthai84@gmail.com hoặc chuyển tới Tab 12 (Liên Hệ) để gửi form đặt lịch trao đổi.';
      } else {
        reply = `Chuyên gia Nguyễn Hùng Thái sẵn sàng đồng hành cùng Quý Doanh Nghiệp nâng tầm trải nghiệm khách hàng (CX), chuẩn hóa SOP, tích hợp CRM/AI Agents. Bạn có thể xem chi tiết ở các Tab chuyên đề trên menu.`;
      }

      setMessages([...newMessages, { sender: 'ai', text: reply }]);
      setIsLoading(false);
    }, 600);
  };

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
        aria-label="Trợ Lý AI Hùng Thái 24/7"
        className="theme-modal-card relative w-full max-w-lg p-4 sm:p-5 rounded-[14px] shadow-2xl z-10 flex flex-col justify-between h-[520px] max-h-[90vh] font-play overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="theme-modal-header flex items-center justify-between -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 px-4 sm:px-5 py-3 rounded-t-[14px]">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAvatarZoomed(!isAvatarZoomed)}
              title="Bấm để phóng to/thu nhỏ hình Avatar AI gấp đôi (2x)"
              className="w-9 h-9 rounded-full bg-purple-950/80 text-white overflow-hidden ring-2 ring-purple-400 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
            >
              <img
                src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550149/Avata_AI_h%E1%BB%97_tr%E1%BB%A3.gif"
                alt="AI Hỗ trợ Avatar"
                className={`w-full h-full object-cover transition-transform duration-300 ${isAvatarZoomed ? 'scale-[3.6]' : 'scale-[1.8]'}`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>
            <div>
              <h3 className="typo-popup-title leading-tight" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                Trợ Lý AI Hùng Thái 24/7
              </h3>
              <span className="typo-label text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sẵn sàng giải đáp tự động {isAvatarZoomed && <span className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold">(Phóng to 2x)</span>}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="theme-modal-close w-7 h-7 rounded-full flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 my-2 overflow-y-auto no-scrollbar space-y-2.5 pr-1 typo-body-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                style={m.sender === 'user' ? { background: 'var(--bg-button-primary)' } : undefined}
                className={`max-w-[85%] p-3 rounded-[14px] leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'text-white rounded-br-none font-medium'
                    : 'theme-modal-subcard rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="theme-modal-subcard p-3 rounded-[14px] flex items-center gap-2 typo-body-sm">
                <i className="fa-solid fa-circle-notch animate-spin" style={{ color: 'var(--color-primary)' }}></i>
                <span style={{ color: 'var(--text-secondary)' }}>Đang suy nghĩ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-smooth py-1 shrink-0">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="theme-modal-subcard px-2.5 py-1 rounded-full typo-label font-bold whitespace-nowrap cursor-pointer transition hover:opacity-85"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="theme-modal-footer -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 px-4 sm:px-5 py-3 rounded-b-[14px] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hỏi AI về kinh nghiệm, dịch vụ, dự án..."
            className="theme-input flex-1 min-w-0 px-4 py-2 rounded-full border typo-input focus:outline-none"
          />
          <button
            type="submit"
            style={{ background: 'var(--bg-button-primary)' }}
            className="px-4 py-2 rounded-full text-white typo-button shadow-md cursor-pointer transition hover:opacity-90 flex items-center gap-1 shrink-0"
          >
            <span>Gửi</span>
            <i className="fa-solid fa-paper-plane typo-label"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
