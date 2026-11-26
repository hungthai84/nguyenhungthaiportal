'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { TABS_DATA } from '@/data/tabs';
import { cn } from '@/lib/utils';

export interface VoiceNavigationProps {
  currentTabIndex: number;
  onSelectTab: (index: number) => void;
  onShowNotification: (msg: string) => void;
}

export const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  onSelectTab,
  onShowNotification,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const handleCommand = useCallback(
    (spokenText: string) => {
      const lower = spokenText.toLowerCase().trim();
      console.log('Voice Command received:', lower);

      // Match tab names
      const matchedTab = TABS_DATA.find((tab) => {
        const name = tab.name.toLowerCase();
        return lower.includes(name) || name.includes(lower);
      });

      if (matchedTab) {
        onSelectTab(matchedTab.id);
        SoundEngine.playGlassChime();
        onShowNotification(`✓ Đã chuyển đến trang: ${matchedTab.name} (Bằng giọng nói)`);
        setTranscript(`✓ ${matchedTab.name}`);
        return;
      }

      // Keyword matching
      if (lower.includes('trang chủ') || lower.includes('home') || lower.includes('tổng quan')) {
        onSelectTab(0);
        onShowNotification('✓ Đã chuyển đến trang Tổng quan');
      } else if (lower.includes('thư ngỏ') || lower.includes('tâm thư') || lower.includes('letter')) {
        onSelectTab(1);
        onShowNotification('✓ Đã chuyển đến trang Tâm thư');
      } else if (lower.includes('hồ sơ') || lower.includes('giới thiệu') || lower.includes('about')) {
        onSelectTab(2);
        onShowNotification('✓ Đã chuyển đến trang Hồ sơ');
      } else if (lower.includes('đào tạo') || lower.includes('học vấn') || lower.includes('education')) {
        onSelectTab(3);
        onShowNotification('✓ Đã chuyển đến trang Đào tạo');
      } else if (lower.includes('giải pháp') || lower.includes('services')) {
        onSelectTab(4);
        onShowNotification('✓ Đã chuyển đến trang Giải pháp');
      } else if (lower.includes('kinh nghiệm') || lower.includes('experience') || lower.includes('năm')) {
        onSelectTab(5);
        onShowNotification('✓ Đã chuyển đến trang 22+ Năm Kinh nghiệm');
      } else if (lower.includes('swot') || lower.includes('ma trận')) {
        onSelectTab(6);
        onShowNotification('✓ Đã chuyển đến trang Ma trận SWOT CX');
      } else if (lower.includes('dự án') || lower.includes('thực chiến') || lower.includes('projects')) {
        onSelectTab(7);
        onShowNotification('✓ Đã chuyển đến trang Thực chiến Dự án');
      } else if (lower.includes('phỏng vấn') || lower.includes('interview')) {
        onSelectTab(8);
        onShowNotification('✓ Đã chuyển đến trang Phỏng vấn 1-1');
      } else if (lower.includes('tử vi') || lower.includes('horoscope')) {
        onSelectTab(9);
        onShowNotification('✓ Đã chuyển đến trang Tử vi Giáp Tý');
      } else if (lower.includes('kỷ niệm') || lower.includes('memories')) {
        onSelectTab(10);
        onShowNotification('✓ Đã chuyển đến trang Kỷ niệm');
      } else if (lower.includes('trợ lý ai') || lower.includes('trí nhân') || lower.includes('ai')) {
        onSelectTab(11);
        onShowNotification('✓ Đã chuyển đến trang Trợ lý AI Trí Nhân');
      } else if (lower.includes('liên hệ') || lower.includes('contact')) {
        onSelectTab(13);
        onShowNotification('✓ Đã chuyển đến trang Liên hệ');
      } else if (lower.includes('hình nền') || lower.includes('wallpaper')) {
        onSelectTab(14);
        onShowNotification('✓ Đã chuyển đến trang Quản lý Hình nền');
      } else if (lower.includes('cấu hình') || lower.includes('giao diện')) {
        onSelectTab(15);
        onShowNotification('✓ Đã chuyển đến trang Cấu hình Giao diện');
      } else {
        onShowNotification(`Không nhận diện được lệnh: "${spokenText}". Thử lại "Mở dự án" hoặc "Vào kinh nghiệm".`);
      }
    },
    [onSelectTab, onShowNotification]
  );

  const startListening = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onShowNotification('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói Web Speech API.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        SoundEngine.playTap();
        setTranscript('Đang lắng nghe lệnh giọng nói...');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          handleCommand(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
      onShowNotification('Không thể khởi động micro giọng nói.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        className={cn(
          'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer',
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
            : 'bg-[var(--surface-secondary-bg)] hover:bg-[var(--surface-hover-bg)] text-[var(--text-primary)] border border-[var(--border-subcard)]'
        )}
        title={isListening ? 'Đang nghe... Nhấn để dừng' : 'Điều hướng bằng giọng nói tiếng Việt'}
      >
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            isListening ? 'bg-white animate-ping' : 'bg-emerald-500'
          )}
        />
        <WebIcon name="mic" className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isListening ? 'Đang nghe...' : 'Điều hướng Giọng nói'}
        </span>
      </button>

      {transcript && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subcard)] text-[var(--text-primary)] text-[11px] shadow-lg whitespace-nowrap z-50 animate-fade-in pointer-events-none">
          {transcript}
        </div>
      )}
    </div>
  );
};
