'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
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

  const handleSelect = (lang: Language) => {
    SoundEngine.playGlassChime();
    setLanguage(lang);
    setIsOpen(false);
  };

  const currentLangLabel = language === 'en' ? 'EN' : 'VI';
  const currentFlag = language === 'en' ? '🇬🇧' : '🇻🇳';

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
        title="Chuyển đổi ngôn ngữ / Language Switcher"
        className="nav-pill relative inline-flex items-center justify-between w-[110px] sm:w-[120px] h-[42px] rounded-[999px] px-2.5 py-0.5 gap-1.5 bg-sky-50/90 dark:bg-sky-950/75 border-2 border-sky-400/80 dark:border-sky-500/80 hover:border-sky-500 dark:hover:border-sky-400 shadow-sm transition-all duration-300 cursor-pointer select-none group/lang"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-sky-500 text-white typo-badge shadow-xs ring-1 ring-white/40">
          <span className="typo-body-sm select-none">{currentFlag}</span>
        </div>
        <div className="w-[1.5px] h-4 bg-sky-300/80 dark:bg-sky-400/40 shrink-0 mx-0.5 rounded-[999px]" />
        <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
          <span data-no-translate="true" className="typo-nav leading-tight font-play text-sky-950 dark:text-sky-100 truncate">
            {language === 'en' ? 'English' : 'Tiếng Việt'}
          </span>
          <span className="typo-label leading-none mt-0.5 text-sky-700 dark:text-sky-400 font-play uppercase tracking-wider truncate">
            {currentLangLabel}
          </span>
        </div>
        <WebIcon
          name="chevron-down"
          className={`w-3.5 h-3.5 text-sky-700 dark:text-sky-300 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="theme-popup absolute right-0 mt-2 w-48 rounded-[14px] z-[99999] p-1.5 flex flex-col gap-1 animate-fadeIn font-play"
          style={{ transformOrigin: 'top right' }}
        >
          <div
            className="px-3 py-1.5 typo-label border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subcard)' }}
          >
            {language === 'en' ? 'Select Language' : 'Chọn ngôn ngữ'}
          </div>

          <button
            type="button"
            data-selected={language === 'vi' ? 'true' : undefined}
            onClick={() => handleSelect('vi')}
            className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-left transition-all duration-200 cursor-pointer ${
              language === 'vi' ? 'font-bold shadow-sm' : 'font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="typo-body-lg select-none">🇻🇳</span>
              <span className="typo-body-sm font-bold truncate">Tiếng Việt</span>
            </div>
            {language === 'vi' && (
              <WebIcon name="check" className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            )}
          </button>

          <button
            type="button"
            data-selected={language === 'en' ? 'true' : undefined}
            onClick={() => handleSelect('en')}
            className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-left transition-all duration-200 cursor-pointer ${
              language === 'en' ? 'font-bold shadow-sm' : 'font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="typo-body-lg select-none">🇬🇧</span>
              <span className="typo-body-sm font-bold truncate">English</span>
            </div>
            {language === 'en' && (
              <WebIcon name="check" className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
