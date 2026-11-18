'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';

export const LanguageSwitcher: React.FC = () => {
  const { language, languageMode, setLanguageMode, browserLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectMode = (mode: 'auto' | 'vi' | 'en') => {
    SoundEngine.playGlassChime();
    setLanguageMode(mode);
    setIsOpen(false);
  };

  const currentLangLabel = languageMode === 'auto'
    ? (language === 'en' ? 'Auto (EN)' : 'Auto (VI)')
    : (language === 'en' ? 'EN' : 'VI');
  const currentFlag = languageMode === 'auto'
    ? '🌐'
    : (language === 'en' ? '🇬🇧' : '🇻🇳');

  return (
    <div className="relative inline-block shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title={languageMode === 'auto' ? 'Ngôn ngữ: Mặc định trình duyệt' : 'Chuyển đổi ngôn ngữ / Language Switcher'}
        className="nav-pill relative inline-flex items-center justify-between w-[118px] sm:w-[128px] h-[42px] rounded-[999px] px-2.5 py-0.5 gap-1.5 bg-[var(--bg-subcard)] border-2 border-[var(--border-subcard)] hover:border-[var(--color-primary)] shadow-sm transition-all duration-300 cursor-pointer select-none group/lang"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-primary)] text-white typo-badge shadow-xs ring-1 ring-white/40">
          <span className="typo-body-sm select-none">{currentFlag}</span>
        </div>
        <div className="w-[1.5px] h-4 bg-[var(--border-subcard)] shrink-0 mx-0.5 rounded-[999px]" />
        <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
          <span data-no-translate="true" className="typo-nav leading-tight font-play text-[var(--text-primary)] truncate">
            {language === 'en' ? 'English' : 'Tiếng Việt'}
          </span>
          <span className="typo-label leading-none mt-0.5 text-[var(--text-secondary)] font-play tracking-wide truncate">
            {currentLangLabel}
          </span>
        </div>
        <WebIcon
          name="chevron-down"
          className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="theme-popup absolute right-0 mt-2 w-56 rounded-[14px] z-[99999] p-1.5 flex flex-col gap-1 animate-fadeIn font-play"
          style={{ transformOrigin: 'top right' }}
        >
          <div
            className="px-3 py-1.5 typo-label border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subcard)' }}
          >
            {language === 'en' ? 'Select Language' : 'Chọn ngôn ngữ'}
          </div>

          {/* Tùy chọn 1: Mặc định trình duyệt */}
          <button
            type="button"
            data-selected={languageMode === 'auto' ? 'true' : undefined}
            onClick={() => handleSelectMode('auto')}
            className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              languageMode === 'auto' ? 'font-bold shadow-sm' : 'font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="typo-body-lg select-none">🌐</span>
              <div className="flex flex-col min-w-0">
                <span className="typo-body-sm font-bold truncate">
                  {language === 'en' ? 'Browser Default' : 'Mặc định trình duyệt'}
                </span>
                <span className="typo-caption text-[var(--text-muted)] truncate">
                  {browserLanguage === 'en' ? 'English (Auto)' : 'Tiếng Việt (Tự động)'}
                </span>
              </div>
            </div>
            {languageMode === 'auto' && (
              <WebIcon name="check" className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            )}
          </button>

          {/* Tùy chọn 2: Tiếng Việt */}
          <button
            type="button"
            data-selected={languageMode === 'vi' ? 'true' : undefined}
            onClick={() => handleSelectMode('vi')}
            className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              languageMode === 'vi' ? 'font-bold shadow-sm' : 'font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="typo-body-lg select-none">🇻🇳</span>
              <span className="typo-body-sm font-bold truncate">Tiếng Việt</span>
            </div>
            {languageMode === 'vi' && (
              <WebIcon name="check" className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            )}
          </button>

          {/* Tùy chọn 3: English */}
          <button
            type="button"
            data-selected={languageMode === 'en' ? 'true' : undefined}
            onClick={() => handleSelectMode('en')}
            className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] text-left transition-all duration-200 cursor-pointer ${
              languageMode === 'en' ? 'font-bold shadow-sm' : 'font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="typo-body-lg select-none">🇬🇧</span>
              <span className="typo-body-sm font-bold truncate">English</span>
            </div>
            {languageMode === 'en' && (
              <WebIcon name="check" className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
