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
        aria-label={location.title}
        className="theme-modal-card map-modal-card relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-6 rounded-[var(--radius-modal,24px)] shadow-2xl z-10 flex flex-col gap-3 font-play"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-modal-header flex items-center justify-between -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 sm:px-6 py-3.5 rounded-t-[var(--radius-modal,24px)]">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[var(--radius-subcard,16px)] flex items-center justify-center text-white font-bold shadow-md ${
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
              <h3
                className="typo-popup-title card-title-synced leading-tight font-play"
                style={{ color: location.type === 'cu_tru' ? 'var(--accent-emerald, #059669)' : 'var(--accent-purple, #9333EA)' }}
              >
                {location.title}
              </h3>
              <p className="typo-caption font-medium" style={{ color: 'var(--text-secondary)' }}>
                {location.address}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="theme-modal-close w-7 h-7 rounded-full flex items-center justify-center cursor-pointer font-bold shrink-0"
          >
            ✕
          </button>
        </div>
        <div
          className="relative w-full h-[280px] sm:h-[340px] rounded-[var(--radius-subcard,16px)] overflow-hidden border shadow-inner"
          style={{ borderColor: 'var(--border-modal, var(--border-color))', background: 'var(--bg-subcard)' }}
        >
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
        <div className="theme-modal-footer flex flex-wrap items-center justify-between gap-2.5 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 sm:px-6 py-3 rounded-b-[var(--radius-modal,24px)]">
          <span className="typo-label font-semibold truncate max-w-full sm:max-w-[55%]" style={{ color: 'var(--text-secondary)' }}>
            {location.address}
          </span>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location.query
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'var(--bg-button-primary)' }}
              className="px-3.5 py-1.5 rounded-full text-white typo-button shadow-md whitespace-nowrap hover:opacity-90"
            >
              Mở Google Maps
            </a>
            <button
              type="button"
              onClick={onClose}
              className="theme-modal-close px-3.5 py-1.5 rounded-full typo-button cursor-pointer whitespace-nowrap"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
