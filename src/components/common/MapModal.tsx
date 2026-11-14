import React, { useEffect } from 'react';
import { MapLocation } from '../../data/about';

interface MapModalProps {
  location: MapLocation | null;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ location, onClose }) => {
  useEffect(() => {
    if (!location) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location, onClose]);

  if (!location) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#0B1220]/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={location.title}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#334155] p-4 sm:p-6 rounded-[14px] shadow-2xl z-10 flex flex-col gap-3 text-[#334155] dark:text-[#E2E8F0] font-play"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[14px] flex items-center justify-center text-white font-bold shadow-md ${
                location.type === 'cu_tru' ? 'bg-emerald-600' : 'bg-purple-600'
              }`}
            >
              <i
                className={`fa-solid ${
                  location.type === 'cu_tru' ? 'fa-house' : 'fa-location-dot'
                }`}
              ></i>
            </div>
            <div>
              <h3 className="typo-h3 font-bold text-slate-900 dark:text-white leading-tight font-play">
                {location.title}
              </h3>
              <p className="typo-caption text-[#475569] dark:text-[#94A3B8] font-medium">
                {location.address}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1F2937] hover:bg-slate-200 dark:hover:bg-[#334155] flex items-center justify-center text-[#475569] dark:text-[#94A3B8] cursor-pointer font-bold shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="relative w-full h-[280px] sm:h-[340px] rounded-[14px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
          <iframe
            title={location.title}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              location.query
            )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <span className="typo-label font-semibold text-[#475569] dark:text-[#94A3B8] truncate max-w-full sm:max-w-[55%]">
            {location.address}
          </span>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location.query
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white typo-button shadow-md whitespace-nowrap"
            >
              Mở Google Maps
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 typo-button cursor-pointer whitespace-nowrap"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
