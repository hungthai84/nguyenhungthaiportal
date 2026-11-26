import React, { useEffect, useRef, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { CardStyleMode } from '@/config/ui/theme.types';
import {
  CARD_MATERIAL_PRESETS,
  CardMaterialPresetId,
  CardTargetKey,
  CursorStyleId,
  MotionPresetLevel,
  PRIMARY_PALETTE_PRESETS,
  SoundEventId,
  SoundThemeId,
  ThemeStudioConfig,
  WALLPAPER_MODE_GRADIENTS,
  WallpaperModeId,
  applyThemeStudioConfigToDocument,
  createDefaultStudioConfig,
  generateHarmonizedPalette,
  isIridescentTheme,
  loadStudioConfigForTheme,
  parseColorToHex,
  resetStudioConfigForTheme,
  saveStudioConfigForTheme,
} from '@/config/ui/iridescentConfig';
import { IridescentLivePreview } from './IridescentLivePreview';

export interface IridescentStudioPanelProps {
  activeCardStyle: CardStyleMode;
  targetMode: 'light' | 'dark';
  isEn?: boolean;
  onApplyCardStyle: (mode: CardStyleMode, label: string) => void;
  onClose?: () => void;
  onShowNotification?: (msg: string) => void;
}

type StudioGroupId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const GROUP_TABS: Array<{ id: StudioGroupId; code: string; vi: string; en: string; icon: string }> = [
  { id: 1, code: '01', vi: 'Màu Website', en: 'Site Colors', icon: 'palette' },
  { id: 2, code: '02', vi: 'Màu chính', en: 'Primary', icon: 'droplet' },
  { id: 3, code: '03', vi: 'Hình nền', en: 'Wallpaper', icon: 'image' },
  { id: 4, code: '04', vi: 'Nền Card', en: 'Card Glass', icon: 'layers' },
  { id: 5, code: '05', vi: 'Hiệu ứng Card', en: 'Card FX', icon: 'sparkles' },
  { id: 6, code: '06', vi: 'Chuyển động', en: 'Motion', icon: 'zap' },
  { id: 7, code: '07', vi: 'Tương tác', en: 'Interaction', icon: 'mouse-pointer' },
  { id: 8, code: '08', vi: 'Âm thanh', en: 'Sound', icon: 'volume-2' },
  { id: 9, code: '09', vi: 'Con trỏ chuột', en: 'Cursor', icon: 'navigation' },
];

const CARD_TARGETS: Array<{ key: CardTargetKey; vi: string; en: string }> = [
  { key: 'mainCard', vi: 'Main Card', en: 'Main Card' },
  { key: 'contentCard', vi: 'Content Card', en: 'Content Card' },
  { key: 'dashboardCard', vi: 'Dashboard Card', en: 'Dashboard Card' },
  { key: 'navigationCard', vi: 'Navigation Card', en: 'Navigation Card' },
  { key: 'modalCard', vi: 'Modal Card', en: 'Modal Card' },
  { key: 'popupCard', vi: 'Popup Card', en: 'Popup Card' },
  { key: 'sidebarCard', vi: 'Sidebar Card', en: 'Sidebar Card' },
  { key: 'footerCard', vi: 'Footer Card', en: 'Footer Card' },
];

const SOUND_THEMES: Array<{ id: SoundThemeId; label: string }> = [
  { id: 'soft-glass', label: 'Soft Glass' },
  { id: 'crystal', label: 'Crystal' },
  { id: 'liquid', label: 'Liquid' },
  { id: 'digital', label: 'Digital' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'minimal', label: 'Minimal' },
];

const SOUND_EVENTS: Array<{ id: SoundEventId; vi: string; en: string }> = [
  { id: 'buttonClick', vi: 'Bấm nút (Click)', en: 'Button Click' },
  { id: 'buttonHover', vi: 'Di chuột nút (Hover)', en: 'Button Hover' },
  { id: 'toggleOn', vi: 'Bật công tắc (Toggle On)', en: 'Toggle On' },
  { id: 'toggleOff', vi: 'Tắt công tắc (Toggle Off)', en: 'Toggle Off' },
  { id: 'tabChange', vi: 'Chuyển Tab', en: 'Tab Change' },
  { id: 'cardSelect', vi: 'Chọn thẻ (Card Select)', en: 'Card Select' },
  { id: 'popupOpen', vi: 'Mở Popup / Modal', en: 'Popup Open' },
  { id: 'popupClose', vi: 'Đóng Popup / Modal', en: 'Popup Close' },
  { id: 'notification', vi: 'Thông báo (Notification)', en: 'Notification' },
  { id: 'success', vi: 'Thành công (Success)', en: 'Success' },
  { id: 'error', vi: 'Lỗi (Error)', en: 'Error' },
];

const CURSOR_STYLES: Array<{ id: CursorStyleId; label: string }> = [
  { id: 'default', label: 'Default' },
  { id: 'glass', label: 'Glass' },
  { id: 'crystal', label: 'Crystal' },
  { id: 'iridescent', label: 'Iridescent' },
  { id: 'glow', label: 'Glow' },
  { id: 'magnetic', label: 'Magnetic' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'soft-circle', label: 'Soft Circle' },
];

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (nextHex: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => {
  const [textVal, setTextVal] = useState(value);
  useEffect(() => {
    setTextVal(value);
  }, [value]);

  const commitText = (raw: string) => {
    setTextVal(raw);
    const parsed = parseColorToHex(raw, '');
    if (parsed) {
      onChange(parsed);
    }
  };

  return (
    <div
      className="flex flex-col gap-1 p-2 rounded-xl border min-w-0"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subcard)',
      }}
    >
      <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5 min-w-0">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#06B6D4'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0 p-0"
          aria-label={label}
        />
        <input
          type="text"
          value={textVal}
          onChange={(e) => commitText(e.target.value)}
          onBlur={() => setTextVal(value)}
          placeholder="#HEX / rgb() / hsl()"
          className="w-full min-w-0 px-2 py-1 rounded-lg text-[11px] font-mono border outline-none"
          style={{
            background: 'var(--bg-subcard)',
            borderColor: 'var(--border-subcard)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
    </div>
  );
};

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => (
  <div
    className="flex flex-col gap-1 p-2 rounded-xl border min-w-0"
    style={{
      background: 'var(--bg-card)',
      borderColor: 'var(--border-subcard)',
    }}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="text-[11px] font-mono font-bold tabular-nums shrink-0" style={{ color: 'var(--color-primary)' }}>
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full cursor-pointer accent-[var(--color-primary)]"
      aria-label={label}
    />
  </div>
);

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  actionButton?: React.ReactNode;
}

const ToggleField: React.FC<ToggleFieldProps> = ({ label, checked, onChange, actionButton }) => (
  <div
    className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl border min-w-0"
    style={{
      background: 'var(--bg-card)',
      borderColor: 'var(--border-subcard)',
    }}
  >
    <span className="text-[11.5px] font-semibold truncate min-w-0" style={{ color: 'var(--text-primary)' }}>
      {label}
    </span>
    <div className="flex items-center gap-1.5 shrink-0">
      {actionButton}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5.5 rounded-full p-0.5 cursor-pointer border-0 transition-colors shrink-0"
        style={{
          background: checked ? 'var(--bg-button-primary, #06B6D4)' : 'rgba(148, 163, 184, 0.38)',
        }}
      >
        <span
          className="block w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(0px)' }}
        />
      </button>
    </div>
  </div>
);

export const IridescentStudioPanel: React.FC<IridescentStudioPanelProps> = ({
  activeCardStyle,
  targetMode,
  isEn = false,
  onApplyCardStyle,
  onClose,
  onShowNotification,
}) => {
  const [studioMode, setStudioMode] = useState<'light' | 'dark'>(targetMode);
  const studioThemeId: CardStyleMode =
    studioMode === 'dark' ? 'dark-iridescent-liquid-glass' : 'iridescent-liquid-glass';

  const [draft, setDraft] = useState<ThemeStudioConfig>(() =>
    loadStudioConfigForTheme(studioThemeId)
  );
  const [savedSnapshot, setSavedSnapshot] = useState<ThemeStudioConfig>(() =>
    loadStudioConfigForTheme(studioThemeId)
  );
  const [activeGroup, setActiveGroup] = useState<StudioGroupId>(1);
  const [mobilePane, setMobilePane] = useState<'controls' | 'preview'>('controls');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const wallpaperUploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setStudioMode(targetMode);
  }, [targetMode]);

  useEffect(() => {
    const loaded = loadStudioConfigForTheme(studioThemeId);
    setDraft(loaded);
    setSavedSnapshot(loaded);
  }, [studioThemeId]);

  // Live-apply CSS variables when current site theme matches this Iridescent mode
  useEffect(() => {
    if (activeCardStyle === studioThemeId) {
      applyThemeStudioConfigToDocument(draft, studioThemeId);
      SoundEngine.configureStudioSound(draft.sound);
    }
  }, [draft, activeCardStyle, studioThemeId]);

  const notify = (msg: string) => {
    setStatusMsg(msg);
    onShowNotification?.(msg);
  };

  const patchDraft = (updater: (prev: ThemeStudioConfig) => ThemeStudioConfig) => {
    setDraft((prev) => updater(prev));
  };

  const handleApplyTheme = () => {
    saveStudioConfigForTheme(studioThemeId, draft);
    setSavedSnapshot(draft);
    applyThemeStudioConfigToDocument(draft, studioThemeId);
    SoundEngine.configureStudioSound(draft.sound);
    onApplyCardStyle(
      studioThemeId,
      studioMode === 'dark'
        ? isEn
          ? 'Iridescent Liquid Glass (Dark)'
          : 'Kính Lỏng Xà Cừ (Tối)'
        : isEn
          ? 'Iridescent Liquid Glass (Light)'
          : 'Kính Lỏng Xà Cừ (Sáng)'
    );
    SoundEngine.playEvent('success');
    notify(
      isEn
        ? '✓ Applied Iridescent Liquid Glass across the entire website.'
        : '✓ Đã áp dụng giao diện Kính lỏng ánh xà cừ toàn website.'
    );
  };

  const handleSaveConfig = () => {
    saveStudioConfigForTheme(studioThemeId, draft);
    setSavedSnapshot(draft);
    SoundEngine.playEvent('success');
    notify(
      isEn
        ? `✓ Saved custom configuration for ${studioMode === 'dark' ? 'Dark' : 'Light'} mode.`
        : `✓ Đã lưu cấu hình riêng cho chế độ ${studioMode === 'dark' ? 'Tối' : 'Sáng'}.`
    );
  };

  const handleExportConfig = () => {
    try {
      const payload = JSON.stringify({ themeId: studioThemeId, config: draft }, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studioThemeId}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SoundEngine.playEvent('notification');
      notify(isEn ? '✓ Exported theme JSON configuration.' : '✓ Đã xuất tệp cấu hình JSON thành công.');
    } catch {
      notify(isEn ? 'Unable to export JSON file.' : 'Không thể xuất tệp JSON.');
    }
  };

  const handleImportConfigFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const candidate: Partial<ThemeStudioConfig> = parsed?.config || parsed;
        if (!candidate || typeof candidate !== 'object' || !candidate.colors || !candidate.primary) {
          throw new Error('Invalid format');
        }
        const base = createDefaultStudioConfig(studioMode);
        const merged: ThemeStudioConfig = {
          ...base,
          ...candidate,
          mode: studioMode,
          colors: { ...base.colors, ...(candidate.colors || {}) },
          primary: { ...base.primary, ...(candidate.primary || {}) },
          wallpaper: { ...base.wallpaper, ...(candidate.wallpaper || {}) },
          cardBg: {
            ...base.cardBg,
            ...(candidate.cardBg || {}),
            targets: { ...base.cardBg.targets, ...(candidate.cardBg?.targets || {}) },
          },
          cardEffects: { ...base.cardEffects, ...(candidate.cardEffects || {}) },
          motion: { ...base.motion, ...(candidate.motion || {}) },
          interaction: { ...base.interaction, ...(candidate.interaction || {}) },
          sound: {
            ...base.sound,
            ...(candidate.sound || {}),
            events: { ...base.sound.events, ...(candidate.sound?.events || {}) },
          },
          cursor: { ...base.cursor, ...(candidate.cursor || {}) },
        };
        setDraft(merged);
        SoundEngine.playEvent('success');
        notify(
          isEn
            ? '✓ Imported JSON configuration into preview. Click Save or Apply to persist.'
            : '✓ Đã nhập cấu hình JSON vào xem trước. Nhấn Lưu hoặc Áp dụng để ghi nhận.'
        );
      } catch {
        SoundEngine.playEvent('error');
        notify(isEn ? 'Invalid JSON theme file.' : 'Tệp JSON không đúng định dạng cấu hình giao diện.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreDefaults = () => {
    const fresh = resetStudioConfigForTheme(studioThemeId);
    setDraft(fresh);
    setSavedSnapshot(fresh);
    SoundEngine.playEvent('notification');
    notify(
      isEn
        ? '✓ Restored Iridescent Liquid Glass default configuration.'
        : '✓ Đã khôi phục cấu hình mặc định Kính lỏng ánh xà cừ.'
    );
  };

  const handleDiscardChanges = () => {
    setDraft(savedSnapshot);
    if (isIridescentTheme(activeCardStyle) && activeCardStyle === studioThemeId) {
      applyThemeStudioConfigToDocument(savedSnapshot, studioThemeId);
      SoundEngine.configureStudioSound(savedSnapshot.sound);
    }
    SoundEngine.playEvent('popupClose');
    notify(isEn ? 'Reverted unsaved changes.' : 'Đã hủy các thay đổi chưa lưu.');
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (dataUrl) {
        patchDraft((prev) => ({
          ...prev,
          wallpaper: {
            ...prev.wallpaper,
            mode: 'upload',
            backgroundImage: dataUrl,
          },
        }));
        notify(isEn ? '✓ Uploaded custom wallpaper image.' : '✓ Đã tải hình nền tùy chỉnh lên xem trước.');
      }
    };
    reader.readAsDataURL(file);
  };

  const activeTarget = draft.cardBg.activeTarget;
  const activeTargetVal = draft.cardBg.targets[activeTarget];

  const renderGroupContent = () => {
    switch (activeGroup) {
      case 1:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    patchDraft((prev) => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        ...generateHarmonizedPalette(prev.primary.primaryColor, prev.mode),
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold cursor-pointer border-0"
                  style={{
                    background: 'var(--bg-button-primary)',
                    color: 'var(--text-button-primary, #FFFFFF)',
                  }}
                >
                  <WebIcon name="sparkles" className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Harmonize Palette' : 'Tạo bảng màu phối hợp'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchDraft((prev) => ({
                      ...prev,
                      colors: createDefaultStudioConfig(prev.mode).colors,
                    }))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11.5px] font-semibold border cursor-pointer"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subcard)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <WebIcon name="rotate-ccw" className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset Colors' : 'Khôi phục màu mặc định'}</span>
                </button>
              </div>
              <ToggleField
                label={isEn ? 'Use Gradient Background' : 'Dùng nền Gradient'}
                checked={draft.colors.useGradient}
                onChange={(v) =>
                  patchDraft((prev) => ({ ...prev, colors: { ...prev.colors, useGradient: v } }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <ColorField
                label={isEn ? 'Website Background' : 'Màu nền tổng thể website'}
                value={draft.colors.websiteBg}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, websiteBg: v } }))}
              />
              <ColorField
                label={isEn ? 'Header Background' : 'Màu nền vùng Header'}
                value={draft.colors.headerBg}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, headerBg: v } }))}
              />
              <ColorField
                label={isEn ? 'Main Container' : 'Màu nền Main Container'}
                value={draft.colors.mainContainerBg}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, mainContainerBg: v } }))}
              />
              <ColorField
                label={isEn ? 'Sidebar Background' : 'Màu nền Sidebar'}
                value={draft.colors.sidebarBg}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, sidebarBg: v } }))}
              />
              <ColorField
                label={isEn ? 'Footer Background' : 'Màu nền Footer'}
                value={draft.colors.footerBg}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, footerBg: v } }))}
              />
              <ColorField
                label={isEn ? 'Primary Text' : 'Màu chữ chính'}
                value={draft.colors.textPrimary}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, textPrimary: v } }))}
              />
              <ColorField
                label={isEn ? 'Secondary Text' : 'Màu chữ phụ'}
                value={draft.colors.textSecondary}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, textSecondary: v } }))}
              />
              <ColorField
                label={isEn ? 'Border Color' : 'Màu đường viền'}
                value={draft.colors.borderColor}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, borderColor: v } }))}
              />
              <ColorField
                label={isEn ? 'Icon Color' : 'Màu biểu tượng'}
                value={draft.colors.iconColor}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, iconColor: v } }))}
              />
              <ColorField
                label={isEn ? 'Success Status' : 'Màu thành công'}
                value={draft.colors.successColor}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, successColor: v } }))}
              />
              <ColorField
                label={isEn ? 'Warning Status' : 'Màu cảnh báo'}
                value={draft.colors.warningColor}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, warningColor: v } }))}
              />
              <ColorField
                label={isEn ? 'Error Status' : 'Màu lỗi'}
                value={draft.colors.errorColor}
                onChange={(v) => patchDraft((p) => ({ ...p, colors: { ...p.colors, errorColor: v } }))}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                {isEn ? '9 Suggested Primary Palettes' : '9 mẫu màu chủ đạo gợi ý'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRIMARY_PALETTE_PRESETS.map((preset) => {
                  const selected = draft.primary.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        patchDraft((prev) => ({
                          ...prev,
                          primary: {
                            presetId: preset.id,
                            primaryColor: preset.primaryColor,
                            secondaryColor: preset.secondaryColor,
                            accentColor: preset.accentColor,
                            highlightColor: preset.highlightColor,
                            gradientStart: preset.gradientStart,
                            gradientEnd: preset.gradientEnd,
                            glowColor: preset.glowColor,
                            chromeReflectionColor: preset.chromeReflectionColor,
                          },
                          colors: {
                            ...prev.colors,
                            iconColor: preset.primaryColor,
                          },
                        }))
                      }
                      className="flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: selected ? preset.primaryColor : 'var(--border-subcard)',
                        boxShadow: selected ? `0 0 0 2px ${preset.primaryColor}` : 'none',
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-full shrink-0 border border-white/60"
                        style={{
                          background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor}, ${preset.accentColor})`,
                        }}
                      />
                      <span className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <ColorField
                label="Primary Color"
                value={draft.primary.primaryColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', primaryColor: v } }))}
              />
              <ColorField
                label="Secondary Color"
                value={draft.primary.secondaryColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', secondaryColor: v } }))}
              />
              <ColorField
                label="Accent Color"
                value={draft.primary.accentColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', accentColor: v } }))}
              />
              <ColorField
                label="Highlight Color"
                value={draft.primary.highlightColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', highlightColor: v } }))}
              />
              <ColorField
                label="Gradient Start"
                value={draft.primary.gradientStart}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', gradientStart: v } }))}
              />
              <ColorField
                label="Gradient End"
                value={draft.primary.gradientEnd}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', gradientEnd: v } }))}
              />
              <ColorField
                label="Glow Color"
                value={draft.primary.glowColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', glowColor: v } }))}
              />
              <ColorField
                label="Chrome Reflection"
                value={draft.primary.chromeReflectionColor}
                onChange={(v) => patchDraft((p) => ({ ...p, primary: { ...p.primary, presetId: 'custom', chromeReflectionColor: v } }))}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'solid', vi: 'Màu đơn sắc', en: 'Solid Color' },
                  { id: 'multi-gradient', vi: 'Gradient đa sắc', en: 'Multi Gradient' },
                  { id: 'aurora', vi: 'Aurora Gradient', en: 'Aurora Gradient' },
                  { id: 'liquid', vi: 'Liquid Gradient', en: 'Liquid Gradient' },
                  { id: 'iridescent', vi: 'Iridescent', en: 'Iridescent' },
                  { id: 'abstract-3d', vi: 'Abstract 3D', en: 'Abstract 3D' },
                  { id: 'custom-image', vi: 'Ảnh từ URL', en: 'Image URL' },
                  { id: 'upload', vi: 'Tải ảnh lên', en: 'Upload Image' },
                ] as Array<{ id: WallpaperModeId; vi: string; en: string }>
              ).map((m) => {
                const active = draft.wallpaper.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (m.id === 'upload') {
                        wallpaperUploadRef.current?.click();
                      } else {
                        patchDraft((p) => ({
                          ...p,
                          wallpaper: { ...p.wallpaper, mode: m.id },
                          colors: {
                            ...p.colors,
                            gradientCss: WALLPAPER_MODE_GRADIENTS[m.id]?.[p.mode] || p.colors.gradientCss,
                          },
                        }));
                      }
                    }}
                    className="p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: active ? 'var(--color-primary)' : 'var(--border-subcard)',
                      boxShadow: active ? '0 0 0 2px var(--color-primary)' : 'none',
                    }}
                  >
                    <div
                      className="w-full h-8 rounded-lg border border-white/25"
                      style={{
                        background:
                          m.id === 'solid'
                            ? draft.wallpaper.backgroundColor
                            : WALLPAPER_MODE_GRADIENTS[m.id][draft.mode],
                      }}
                    />
                    <span className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {isEn ? m.en : m.vi}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              ref={wallpaperUploadRef}
              type="file"
              accept="image/*"
              onChange={handleWallpaperUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="url"
                value={draft.wallpaper.backgroundImage}
                onChange={(e) =>
                  patchDraft((p) => ({
                    ...p,
                    wallpaper: {
                      ...p.wallpaper,
                      mode: e.target.value.trim() ? 'custom-image' : p.wallpaper.mode,
                      backgroundImage: e.target.value,
                    },
                  }))
                }
                placeholder={isEn ? 'Paste wallpaper image URL...' : 'Dán đường dẫn ảnh hình nền (URL)...'}
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl text-[12px] border outline-none"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-subcard)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={() => wallpaperUploadRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold border-0 cursor-pointer"
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFF)' }}
              >
                <WebIcon name="upload" className="w-3.5 h-3.5" />
                <span>{isEn ? 'Upload' : 'Tải ảnh'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  patchDraft((p) => ({
                    ...p,
                    wallpaper: { ...p.wallpaper, mode: 'solid', backgroundImage: '' },
                  }))
                }
                className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold border cursor-pointer"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
              >
                {isEn ? 'Remove' : 'Xóa hình nền'}
              </button>
              <button
                type="button"
                onClick={() =>
                  patchDraft((p) => ({
                    ...p,
                    wallpaper: createDefaultStudioConfig(p.mode).wallpaper,
                  }))
                }
                className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold border cursor-pointer"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
              >
                {isEn ? 'Default' : 'Mặc định'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <ColorField
                label={isEn ? 'Solid Base Color' : 'Màu nền cơ bản'}
                value={draft.wallpaper.backgroundColor}
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, backgroundColor: v } }))}
              />
              <ColorField
                label={isEn ? 'Overlay Color' : 'Màu lớp phủ Overlay'}
                value={draft.wallpaper.overlayColor}
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, overlayColor: v } }))}
              />
              <div
                className="flex flex-col gap-1 p-2 rounded-xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
              >
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {isEn ? 'Size / Position / Attachment' : 'Kích thước / Vị trí / Cố định'}
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <select
                    value={draft.wallpaper.backgroundSize}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        wallpaper: { ...p.wallpaper, backgroundSize: e.target.value as 'cover' | 'contain' | 'auto' },
                      }))
                    }
                    className="px-1.5 py-1 rounded-lg text-[11px] border"
                    style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                  </select>
                  <select
                    value={draft.wallpaper.backgroundPosition}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        wallpaper: { ...p.wallpaper, backgroundPosition: e.target.value },
                      }))
                    }
                    className="px-1.5 py-1 rounded-lg text-[11px] border"
                    style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                  >
                    <option value="center center">Center</option>
                    <option value="top center">Top</option>
                    <option value="bottom center">Bottom</option>
                  </select>
                  <select
                    value={draft.wallpaper.backgroundAttachment}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        wallpaper: { ...p.wallpaper, backgroundAttachment: e.target.value as 'fixed' | 'scroll' },
                      }))
                    }
                    className="px-1.5 py-1 rounded-lg text-[11px] border"
                    style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                  >
                    <option value="fixed">Fixed</option>
                    <option value="scroll">Scroll</option>
                  </select>
                </div>
              </div>
              <SliderField
                label={isEn ? 'Background Opacity' : 'Độ rõ hình nền'}
                value={draft.wallpaper.backgroundOpacity}
                min={10}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, backgroundOpacity: v } }))}
              />
              <SliderField
                label={isEn ? 'Background Blur' : 'Độ mờ hình nền'}
                value={draft.wallpaper.backgroundBlur}
                min={0}
                max={40}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, backgroundBlur: v } }))}
              />
              <SliderField
                label={isEn ? 'Overlay Opacity' : 'Độ mờ lớp phủ'}
                value={draft.wallpaper.overlayOpacity}
                min={0}
                max={80}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, overlayOpacity: v } }))}
              />
              <SliderField
                label={isEn ? 'Brightness' : 'Độ sáng'}
                value={draft.wallpaper.brightness}
                min={50}
                max={150}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, brightness: v } }))}
              />
              <SliderField
                label={isEn ? 'Contrast' : 'Độ tương phản'}
                value={draft.wallpaper.contrast}
                min={50}
                max={150}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, contrast: v } }))}
              />
              <ToggleField
                label={isEn ? 'Background Animation' : 'Hiệu ứng nền động'}
                checked={draft.wallpaper.backgroundAnimation}
                onChange={(v) => patchDraft((p) => ({ ...p, wallpaper: { ...p.wallpaper, backgroundAnimation: v } }))}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-3">
            {/* 10 Card Material Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {CARD_MATERIAL_PRESETS.map((preset) => {
                const active = draft.cardBg.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      patchDraft((p) => ({
                        ...p,
                        cardBg: {
                          ...p.cardBg,
                          preset: preset.id as CardMaterialPresetId,
                          backgroundColor: preset.backgroundColor,
                          backgroundOpacity: preset.backgroundOpacity,
                          backdropBlur: preset.backdropBlur,
                          saturation: preset.saturation,
                          borderOpacity: preset.borderOpacity,
                          innerHighlight: preset.innerHighlight,
                          glassReflection: preset.glassReflection,
                        },
                      }))
                    }
                    className="px-2.5 py-2 rounded-xl border text-[11px] font-bold cursor-pointer truncate transition-all"
                    style={
                      active
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                            borderColor: 'transparent',
                          }
                        : {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            borderColor: 'var(--border-subcard)',
                          }
                    }
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* 11 Card Background Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <ColorField
                label="Background Color"
                value={draft.cardBg.backgroundColor}
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, backgroundColor: v } }))}
              />
              <ColorField
                label="Border Color"
                value={draft.cardBg.borderColor}
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, borderColor: v } }))}
              />
              <SliderField
                label="Background Opacity"
                value={draft.cardBg.backgroundOpacity}
                min={15}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, backgroundOpacity: v } }))}
              />
              <SliderField
                label="Backdrop Blur"
                value={draft.cardBg.backdropBlur}
                min={0}
                max={48}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, backdropBlur: v } }))}
              />
              <SliderField
                label="Saturation"
                value={draft.cardBg.saturation}
                min={80}
                max={240}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, saturation: v } }))}
              />
              <SliderField
                label="Border Opacity"
                value={draft.cardBg.borderOpacity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, borderOpacity: v } }))}
              />
              <SliderField
                label="Border Width"
                value={draft.cardBg.borderWidth}
                min={0}
                max={4}
                step={0.5}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, borderWidth: v } }))}
              />
              <SliderField
                label="Border Radius"
                value={draft.cardBg.borderRadius}
                min={0}
                max={32}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, borderRadius: v } }))}
              />
              <SliderField
                label="Inner Highlight"
                value={draft.cardBg.innerHighlight}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, innerHighlight: v } }))}
              />
              <SliderField
                label="Glass Reflection"
                value={draft.cardBg.glassReflection}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, glassReflection: v } }))}
              />
              <SliderField
                label="Card Transparency"
                value={draft.cardBg.cardTransparency}
                min={0}
                max={85}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, cardTransparency: v } }))}
              />
            </div>

            {/* Per-Card-Type Overrides (8 Card Targets) */}
            <div
              className="p-2.5 rounded-2xl border flex flex-col gap-2"
              style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
            >
              <span className="text-[11.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEn ? 'Per-Card-Type Customization (8 Targets)' : 'Áp dụng riêng từng loại Card (8 nhóm)'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CARD_TARGETS.map((ct) => {
                  const selected = activeTarget === ct.key;
                  return (
                    <button
                      key={ct.key}
                      type="button"
                      onClick={() =>
                        patchDraft((p) => ({ ...p, cardBg: { ...p.cardBg, activeTarget: ct.key } }))
                      }
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border"
                      style={
                        selected
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFF)',
                              borderColor: 'transparent',
                            }
                          : {
                              background: 'var(--bg-card)',
                              color: 'var(--text-secondary)',
                              borderColor: 'var(--border-subcard)',
                            }
                      }
                    >
                      {isEn ? ct.en : ct.vi}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <SliderField
                  label={`${activeTarget} Opacity`}
                  value={activeTargetVal.opacity}
                  min={20}
                  max={100}
                  unit="%"
                  onChange={(v) =>
                    patchDraft((p) => ({
                      ...p,
                      cardBg: {
                        ...p.cardBg,
                        targets: {
                          ...p.cardBg.targets,
                          [activeTarget]: { ...p.cardBg.targets[activeTarget], opacity: v },
                        },
                      },
                    }))
                  }
                />
                <SliderField
                  label={`${activeTarget} Blur`}
                  value={activeTargetVal.blur}
                  min={0}
                  max={48}
                  unit="px"
                  onChange={(v) =>
                    patchDraft((p) => ({
                      ...p,
                      cardBg: {
                        ...p.cardBg,
                        targets: {
                          ...p.cardBg.targets,
                          [activeTarget]: { ...p.cardBg.targets[activeTarget], blur: v },
                        },
                      },
                    }))
                  }
                />
                <SliderField
                  label={`${activeTarget} Radius`}
                  value={activeTargetVal.radius}
                  min={0}
                  max={36}
                  unit="px"
                  onChange={(v) =>
                    patchDraft((p) => ({
                      ...p,
                      cardBg: {
                        ...p.cardBg,
                        targets: {
                          ...p.cardBg.targets,
                          [activeTarget]: { ...p.cardBg.targets[activeTarget], radius: v },
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(
                [
                  ['glossyReflection', 'Glossy Reflection'],
                  ['iridescentBorder', 'Iridescent Border'],
                  ['chromeEdge', 'Chrome Edge'],
                  ['glassRefraction', 'Glass Refraction'],
                  ['holographicShine', 'Holographic Shine'],
                  ['innerGlow', 'Inner Glow'],
                  ['outerGlow', 'Outer Glow'],
                  ['softShadow', 'Soft Shadow'],
                  ['floatingCard', 'Floating Card'],
                  ['layeredGlass', 'Layered Glass'],
                  ['prismaticHighlight', 'Prismatic Highlight'],
                  ['specularHighlight', 'Specular Highlight'],
                ] as const
              ).map(([key, label]) => (
                <ToggleField
                  key={key}
                  label={label}
                  checked={draft.cardEffects[key]}
                  onChange={(v) =>
                    patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, [key]: v } }))
                  }
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <SliderField
                label="Glow Intensity"
                value={draft.cardEffects.glowIntensity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, glowIntensity: v } }))}
              />
              <SliderField
                label="Reflection Intensity"
                value={draft.cardEffects.reflectionIntensity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, reflectionIntensity: v } }))}
              />
              <SliderField
                label="Shadow Depth"
                value={draft.cardEffects.shadowDepth}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, shadowDepth: v } }))}
              />
              <SliderField
                label="Border Shine"
                value={draft.cardEffects.borderShine}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, borderShine: v } }))}
              />
              <SliderField
                label="Refraction Strength"
                value={draft.cardEffects.refractionStrength}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, refractionStrength: v } }))}
              />
              <SliderField
                label="Hover Elevation"
                value={draft.cardEffects.hoverElevation}
                min={0}
                max={18}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, hoverElevation: v } }))}
              />
              <SliderField
                label="Card Depth"
                value={draft.cardEffects.cardDepth}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, cardDepth: v } }))}
              />
              <SliderField
                label="Glass Glossiness"
                value={draft.cardEffects.glassGlossiness}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cardEffects: { ...p.cardEffects, glassGlossiness: v } }))}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'off', vi: 'Tắt chuyển động', en: 'Off' },
                    { id: 'gentle', vi: 'Nhẹ', en: 'Gentle' },
                    { id: 'standard', vi: 'Tiêu chuẩn', en: 'Standard' },
                    { id: 'vivid', vi: 'Nổi bật', en: 'Vivid' },
                  ] as Array<{ id: MotionPresetLevel; vi: string; en: string }>
                ).map((lvl) => {
                  const active = draft.motion.level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        patchDraft((p) => ({
                          ...p,
                          motion: {
                            ...p.motion,
                            level: lvl.id,
                            motionIntensity:
                              lvl.id === 'off' ? 0 : lvl.id === 'gentle' ? 30 : lvl.id === 'vivid' ? 90 : 55,
                          },
                        }))
                      }
                      className="px-3 py-1.5 rounded-full text-[11.5px] font-bold cursor-pointer border"
                      style={
                        active
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFF)',
                              borderColor: 'transparent',
                            }
                          : {
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              borderColor: 'var(--border-subcard)',
                            }
                      }
                    >
                      {isEn ? lvl.en : lvl.vi}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {isEn ? 'Respects OS prefers-reduced-motion' : 'Tự tuân thủ prefers-reduced-motion hệ điều hành'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(
                [
                  ['floatingAnimation', 'Floating Animation'],
                  ['smoothFade', 'Smooth Fade'],
                  ['slideTransition', 'Slide Transition'],
                  ['scaleTransition', 'Scale Transition'],
                  ['parallaxMovement', 'Parallax Movement'],
                  ['lightSweep', 'Light Sweep'],
                  ['glassShimmer', 'Glass Shimmer'],
                  ['borderFlow', 'Border Flow'],
                  ['gradientFlow', 'Gradient Flow'],
                  ['ambientGlow', 'Ambient Glow'],
                  ['cardEntrance', 'Card Entrance'],
                  ['pageTransition', 'Page Transition'],
                ] as const
              ).map(([key, label]) => (
                <ToggleField
                  key={key}
                  label={label}
                  checked={draft.motion[key]}
                  onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, [key]: v } }))}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <SliderField
                label="Animation Speed"
                value={draft.motion.animationSpeed}
                min={40}
                max={200}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, animationSpeed: v } }))}
              />
              <SliderField
                label="Duration"
                value={draft.motion.animationDuration}
                min={80}
                max={800}
                step={20}
                unit="ms"
                onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, animationDuration: v } }))}
              />
              <div
                className="flex flex-col gap-1 p-2 rounded-xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
              >
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Easing
                </span>
                <select
                  value={draft.motion.easing}
                  onChange={(e) => patchDraft((p) => ({ ...p, motion: { ...p.motion, easing: e.target.value } }))}
                  className="px-2 py-1 rounded-lg text-[11px] border"
                  style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                >
                  <option value="cubic-bezier(0.22, 1, 0.36, 1)">Smooth Fluid (Default)</option>
                  <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">Liquid Spring</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="ease-out">Ease Out</option>
                </select>
              </div>
              <SliderField
                label="Motion Intensity"
                value={draft.motion.motionIntensity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, motionIntensity: v } }))}
              />
              <SliderField
                label="Delay"
                value={draft.motion.delay}
                min={0}
                max={300}
                step={10}
                unit="ms"
                onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, delay: v } }))}
              />
              <SliderField
                label="Hover Speed"
                value={draft.motion.hoverAnimationSpeed}
                min={80}
                max={500}
                step={20}
                unit="ms"
                onChange={(v) => patchDraft((p) => ({ ...p, motion: { ...p.motion, hoverAnimationSpeed: v } }))}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(
              [
                {
                  title: 'Button',
                  items: [
                    ['buttonHoverGlow', 'Hover Glow'],
                    ['buttonPressDepth', 'Press Depth'],
                    ['buttonRippleEffect', 'Ripple Effect'],
                    ['buttonLightReflection', 'Light Reflection'],
                    ['buttonMagneticHover', 'Magnetic Hover'],
                    ['buttonGradientShift', 'Gradient Shift'],
                  ],
                },
                {
                  title: 'Card',
                  items: [
                    ['cardHoverLift', 'Hover Lift'],
                    ['cardTilt3D', '3D Tilt'],
                    ['cardBorderHighlight', 'Border Highlight'],
                    ['cardPerspective', 'Perspective'],
                    ['cardSpotlightFollow', 'Spotlight Follow'],
                  ],
                },
                {
                  title: 'Input',
                  items: [
                    ['inputFocusGlow', 'Focus Glow'],
                    ['inputAnimatedBorder', 'Animated Border'],
                    ['inputGlassFocus', 'Glass Focus'],
                    ['inputSearchSuggestions', 'Search Suggestions'],
                  ],
                },
                {
                  title: 'Navigation',
                  items: [
                    ['navActiveIndicator', 'Active Indicator'],
                    ['navSmoothUnderline', 'Smooth Underline'],
                    ['navSlidingHighlight', 'Sliding Highlight'],
                    ['navIconAnimation', 'Icon Animation'],
                  ],
                },
                {
                  title: 'Toggle & Tabs',
                  items: [
                    ['toggleLiquidSwitch', 'Liquid Switch'],
                    ['toggleGlowSwitch', 'Glow Switch'],
                    ['toggleSmoothSliding', 'Smooth Sliding'],
                    ['tabsSlidingIndicator', 'Tabs Sliding Indicator'],
                    ['tabsCapsuleHighlight', 'Tabs Capsule Highlight'],
                    ['tabsGlassActiveState', 'Tabs Glass Active State'],
                  ],
                },
                {
                  title: 'Toast & Popup',
                  items: [
                    ['toastGlassReveal', 'Glass Reveal'],
                    ['toastSmoothEntrance', 'Smooth Entrance'],
                    ['toastBlurBackground', 'Blur Background'],
                  ],
                },
              ] as const
            ).map((group) => (
              <div
                key={group.title}
                className="p-2.5 rounded-2xl border flex flex-col gap-1.5"
                style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
              >
                <span className="text-[11.5px] font-bold" style={{ color: 'var(--color-primary)' }}>
                  {group.title}
                </span>
                {group.items.map(([key, label]) => (
                  <ToggleField
                    key={key}
                    label={label}
                    checked={draft.interaction[key]}
                    onChange={(v) =>
                      patchDraft((p) => ({
                        ...p,
                        interaction: { ...p.interaction, [key]: v },
                      }))
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ToggleField
                label={
                  isEn
                    ? 'Enable Sound Effects (Default: OFF)'
                    : 'Bật hiệu ứng âm thanh (Mặc định: Tắt)'
                }
                checked={draft.sound.enabled}
                onChange={(v) => {
                  const nextSound = { ...draft.sound, enabled: v };
                  patchDraft((p) => ({ ...p, sound: nextSound }));
                  SoundEngine.configureStudioSound(nextSound);
                  if (v) SoundEngine.playEvent('toggleOn', true);
                }}
              />
              <SliderField
                label={isEn ? 'Master Volume' : 'Âm lượng tổng'}
                value={draft.sound.volume}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => {
                  const nextSound = { ...draft.sound, volume: v };
                  patchDraft((p) => ({ ...p, sound: nextSound }));
                  SoundEngine.configureStudioSound(nextSound);
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                {isEn ? '6 Sound Themes' : '6 chủ đề âm thanh'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                {SOUND_THEMES.map((st) => {
                  const active = draft.sound.theme === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        const nextSound = { ...draft.sound, theme: st.id };
                        patchDraft((p) => ({ ...p, sound: nextSound }));
                        SoundEngine.configureStudioSound(nextSound);
                        SoundEngine.playEvent('buttonClick', true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all"
                      style={
                        active
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFF)',
                              borderColor: 'transparent',
                            }
                          : {
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              borderColor: 'var(--border-subcard)',
                            }
                      }
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ToggleField
                label={isEn ? 'Hover Sounds' : 'Âm thanh Hover'}
                checked={draft.sound.hoverSound}
                onChange={(v) => patchDraft((p) => ({ ...p, sound: { ...p.sound, hoverSound: v } }))}
              />
              <ToggleField
                label={isEn ? 'Click Sounds' : 'Âm thanh Click'}
                checked={draft.sound.clickSound}
                onChange={(v) => patchDraft((p) => ({ ...p, sound: { ...p.sound, clickSound: v } }))}
              />
              <ToggleField
                label={isEn ? 'Notification Sounds' : 'Âm thanh Thông báo'}
                checked={draft.sound.notificationSound}
                onChange={(v) =>
                  patchDraft((p) => ({ ...p, sound: { ...p.sound, notificationSound: v } }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_EVENTS.map((evt) => (
                <ToggleField
                  key={evt.id}
                  label={isEn ? evt.en : evt.vi}
                  checked={draft.sound.events[evt.id]}
                  onChange={(v) =>
                    patchDraft((p) => ({
                      ...p,
                      sound: {
                        ...p.sound,
                        events: { ...p.sound.events, [evt.id]: v },
                      },
                    }))
                  }
                  actionButton={
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.configureStudioSound(draft.sound);
                        SoundEngine.playEvent(evt.id, true);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border cursor-pointer"
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <WebIcon name="play" className="w-2.5 h-2.5" />
                      <span>{isEn ? 'Test' : 'Nghe thử'}</span>
                    </button>
                  }
                />
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ToggleField
                label={
                  isEn
                    ? 'Enable Custom Liquid Glass Cursor'
                    : 'Bật con trỏ chuột kính lỏng tùy chỉnh'
                }
                checked={draft.cursor.enabled}
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, enabled: v } }))}
              />
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {isEn
                  ? 'Active on Desktop mouse pointers only (disabled on Touch)'
                  : 'Chỉ kích hoạt trên chuột Desktop (tự ẩn trên thiết bị cảm ứng)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CURSOR_STYLES.map((cs) => {
                const active = draft.cursor.style === cs.id;
                return (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, style: cs.id } }))}
                    className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer"
                    style={
                      active
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFF)',
                            borderColor: 'transparent',
                          }
                        : {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            borderColor: 'var(--border-subcard)',
                          }
                    }
                  >
                    {cs.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <ColorField
                label="Cursor Color"
                value={draft.cursor.color}
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, color: v } }))}
              />
              <SliderField
                label="Size"
                value={draft.cursor.size}
                min={14}
                max={60}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, size: v } }))}
              />
              <SliderField
                label="Opacity"
                value={draft.cursor.opacity}
                min={20}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, opacity: v } }))}
              />
              <SliderField
                label="Glow Intensity"
                value={draft.cursor.glowIntensity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, glowIntensity: v } }))}
              />
              <SliderField
                label="Trail Length"
                value={draft.cursor.trailLength}
                min={0}
                max={10}
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, trailLength: v } }))}
              />
              <SliderField
                label="Animation Speed"
                value={draft.cursor.animationSpeed}
                min={20}
                max={100}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, animationSpeed: v } }))}
              />
              <SliderField
                label="Hover Scale"
                value={draft.cursor.hoverScale}
                min={100}
                max={200}
                unit="%"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, hoverScale: v } }))}
              />
              <SliderField
                label="Blur"
                value={draft.cursor.blur}
                min={0}
                max={24}
                unit="px"
                onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, blur: v } }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(
                [
                  ['glassReflection', 'Glass Reflection'],
                  ['rainbowTrail', 'Rainbow Trail'],
                  ['softGlow', 'Soft Glow'],
                  ['magneticHover', 'Magnetic Hover'],
                  ['clickRipple', 'Click Ripple'],
                  ['interactiveSpotlight', 'Interactive Spotlight'],
                ] as const
              ).map(([key, label]) => (
                <ToggleField
                  key={key}
                  label={label}
                  checked={draft.cursor[key]}
                  onChange={(v) => patchDraft((p) => ({ ...p, cursor: { ...p.cursor, [key]: v } }))}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="iridescent-liquid-glass-studio"
      data-subcard="true"
      className="sub-card w-full rounded-[var(--radius-subcard,18px)] border p-3.5 sm:p-4 flex flex-col gap-3.5 min-w-0"
      style={{
        background: 'var(--bg-subcard)',
        borderColor: 'var(--border-subcard)',
      }}
    >
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b" style={{ borderColor: 'var(--border-subcard)' }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 52%, #FB923C 100%)',
            }}
          >
            <WebIcon name="sparkles" className="w-4.5 h-4.5" />
          </span>
          <div className="min-w-0">
            <h3 className="typo-h5 font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {isEn
                ? 'Iridescent Liquid Glass — 9-Group Theme Studio'
                : 'Iridescent Liquid Glass · Kính lỏng ánh xà cừ đa sắc'}
            </h3>
            <p className="typo-caption truncate" style={{ color: 'var(--text-muted)' }}>
              {isEn
                ? 'Customize every layer independently with real-time 14-component preview.'
                : 'Tùy chỉnh độc lập 9 nhóm thông số cùng bản xem trước trực tiếp 14 thành phần.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="inline-flex items-center p-0.5 rounded-full border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
          >
            <button
              type="button"
              onClick={() => setStudioMode('light')}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border-0"
              style={
                studioMode === 'light'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFF)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' }
              }
            >
              {isEn ? 'Light Mode' : 'Bản Sáng'}
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('dark')}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border-0"
              style={
                studioMode === 'dark'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFF)' }
                  : { background: 'transparent', color: 'var(--text-secondary)' }
              }
            >
              {isEn ? 'Dark Mode' : 'Bản Tối'}
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? 'Close studio' : 'Đóng bảng tùy chỉnh'}
              className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subcard)',
                color: 'var(--text-primary)',
              }}
            >
              <WebIcon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tablet / Mobile Pane Switcher */}
      <div className="flex xl:hidden items-center gap-1.5 p-1 rounded-full border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}>
        <button
          type="button"
          onClick={() => setMobilePane('controls')}
          className="flex-1 py-1.5 rounded-full text-[12px] font-bold cursor-pointer border-0"
          style={
            mobilePane === 'controls'
              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFF)' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
        >
          {isEn ? '9 Config Groups' : 'Cấu hình (9 nhóm)'}
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('preview')}
          className="flex-1 py-1.5 rounded-full text-[12px] font-bold cursor-pointer border-0"
          style={
            mobilePane === 'preview'
              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFF)' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
        >
          {isEn ? 'Live Preview (14)' : 'Xem trước trực tiếp (14)'}
        </button>
      </div>

      {/* Responsive Split Studio Layout: Controls + Sticky Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start min-w-0">
        {/* Left: 9-Group Controls */}
        <div
          className={`xl:col-span-7 flex flex-col gap-3 min-w-0 ${
            mobilePane === 'preview' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          {/* 9-Group Selector Pills */}
          <div className="flex flex-wrap gap-1.5">
            {GROUP_TABS.map((g) => {
              const active = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    SoundEngine.playEvent('tabChange');
                    setActiveGroup(g.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11.5px] font-bold cursor-pointer border transition-all"
                  style={
                    active
                      ? {
                          background: 'var(--bg-button-primary)',
                          color: 'var(--text-button-primary, #FFFFFF)',
                          borderColor: 'transparent',
                        }
                      : {
                          background: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-subcard)',
                        }
                  }
                >
                  <span className="opacity-75 font-mono text-[10px]">{g.code}</span>
                  <WebIcon name={g.icon} className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? g.en : g.vi}</span>
                </button>
              );
            })}
          </div>

          {/* Active Group Controls Panel */}
          <div
            className="p-3 rounded-2xl border min-w-0"
            style={{
              background: 'var(--bg-main, var(--bg-subcard))',
              borderColor: 'var(--border-subcard)',
            }}
          >
            {renderGroupContent()}
          </div>
        </div>

        {/* Right: Sticky Live Preview Panel */}
        <div
          className={`xl:col-span-5 xl:sticky xl:top-2 min-w-0 ${
            mobilePane === 'controls' ? 'hidden xl:block' : 'block'
          }`}
        >
          <IridescentLivePreview
            config={draft}
            isEn={isEn}
            onSwitchPreviewMode={(m) => setStudioMode(m)}
            onResetPreview={handleRestoreDefaults}
            onApplyTheme={handleApplyTheme}
          />
        </div>
      </div>

      {/* Inline Feedback Status */}
      {statusMsg && (
        <div
          role="status"
          className="px-3 py-2 rounded-xl border text-[12px] font-semibold flex items-center justify-between gap-2"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--color-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <span>{statusMsg}</span>
          <button
            type="button"
            onClick={() => setStatusMsg('')}
            className="cursor-pointer border-0 bg-transparent opacity-70 hover:opacity-100"
            style={{ color: 'var(--text-primary)' }}
          >
            <WebIcon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom 6-Button Action Control Bar */}
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportConfigFile}
        className="hidden"
      />
      <div
        className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
        style={{ borderColor: 'var(--border-subcard)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleApplyTheme}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold cursor-pointer border-0 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 52%, #FB923C 100%)',
              color: '#FFFFFF',
            }}
          >
            <WebIcon name="check" className="w-3.5 h-3.5" />
            <span>{isEn ? 'APPLY THEME' : 'ÁP DỤNG GIAO DIỆN'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveConfig}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold border cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }}
          >
            <WebIcon name="save" className="w-3.5 h-3.5" />
            <span>{isEn ? 'SAVE CONFIG' : 'LƯU CẤU HÌNH'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportConfig}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11.5px] font-semibold border cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subcard)',
              color: 'var(--text-primary)',
            }}
          >
            <WebIcon name="download" className="w-3.5 h-3.5" />
            <span>{isEn ? 'EXPORT JSON' : 'XUẤT CẤU HÌNH'}</span>
          </button>

          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11.5px] font-semibold border cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subcard)',
              color: 'var(--text-primary)',
            }}
          >
            <WebIcon name="upload" className="w-3.5 h-3.5" />
            <span>{isEn ? 'IMPORT JSON' : 'NHẬP CẤU HÌNH'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11.5px] font-semibold border cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subcard)',
              color: 'var(--text-primary)',
            }}
          >
            <WebIcon name="rotate-ccw" className="w-3.5 h-3.5" />
            <span>{isEn ? 'RESTORE DEFAULTS' : 'KHÔI PHỤC MẶC ĐỊNH'}</span>
          </button>

          <button
            type="button"
            onClick={handleDiscardChanges}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11.5px] font-semibold border cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subcard)',
              color: 'var(--text-secondary)',
            }}
          >
            <WebIcon name="x" className="w-3.5 h-3.5" />
            <span>{isEn ? 'CANCEL CHANGES' : 'HỦY THAY ĐỔI'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
