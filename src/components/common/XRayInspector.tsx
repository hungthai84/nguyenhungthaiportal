'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';

interface ElementInfo {
  tag: string;
  id: string;
  elementName?: string;
  elementType?: string;
  elementPage?: string;
  elementParent?: string;
  elementDescription?: string;
  className: string;
  selector: string;
  text: string;
  rect: DOMRect;
  element: HTMLElement;
  attributes: Record<string, string>;
}

// Generate a precise, unique CSS selector for any DOM element
function getUniqueSelector(el: HTMLElement): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.nodeName.toLowerCase();

    if (current.id) {
      selector += `#${CSS.escape(current.id)}`;
      path.unshift(selector);
      break;
    }

    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c && !c.startsWith('hover:') && !c.startsWith('focus:') && !c.startsWith('active:') && !c.startsWith('group-') && !c.includes(':'))
        .slice(0, 2);
      if (classes.length) {
        selector += `.${classes.map((c) => CSS.escape(c)).join('.')}`;
      }
    }

    let sibling = current;
    let nth = 1;
    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling as HTMLElement;
      if (sibling.nodeName.toLowerCase() === current.nodeName.toLowerCase()) {
        nth++;
      }
    }

    if (nth > 1) {
      selector += `:nth-of-type(${nth})`;
    }

    path.unshift(selector);
    current = current.parentElement;

    if (current && current.tagName === 'BODY') {
      path.unshift('body');
      break;
    }
  }

  return path.join(' > ');
}

export interface XRayInspectorProps {
  onShowNotification?: (msg: string) => void;
  onSwitchToLightMode?: () => void;
}

export const XRayInspector: React.FC<XRayInspectorProps> = ({
  onShowNotification,
  onSwitchToLightMode,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hoveredInfo, setHoveredInfo] = useState<ElementInfo | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{
    target: HTMLElement;
    info: ElementInfo;
    computed: CSSStyleDeclaration;
    rect: DOMRect;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<'identity' | 'effects' | 'config' | null>(null);
  const [inspectorTheme, setInspectorTheme] = useState<'light' | 'dark'>('light');

  const activeRef = useRef<boolean>(false);
  activeRef.current = isActive;

  // Toggle X-Ray mode via key 'x' or 'X'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        setIsActive((prev) => {
          const next = !prev;
          if (!next) {
            setHoveredInfo(null);
            setSelectedTarget(null);
            if (onShowNotification) onShowNotification('Đã tắt chế độ X-Ray Inspector');
          } else {
            if (onShowNotification)
              onShowNotification('🎯 Bật X-Ray Inspector: Di chuột & Double Click vào đối tượng để lấy thông tin, hiệu ứng và cấu hình [Nhấn X để tắt]');
          }
          return next;
        });
      } else if (e.key === 'Escape' && activeRef.current) {
        if (selectedTarget) {
          setSelectedTarget(null);
        } else {
          setIsActive(false);
          setHoveredInfo(null);
          if (onShowNotification) onShowNotification('Đã tắt chế độ X-Ray Inspector');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShowNotification, selectedTarget]);

  const extractInfo = useCallback((target: HTMLElement): ElementInfo => {
    const closestWithData = (target.closest('[data-element-name]') as HTMLElement) || target;
    const rect = target.getBoundingClientRect();
    const selector = getUniqueSelector(target);
    const text = (target.innerText || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 150);

    const attrs: Record<string, string> = {};
    Array.from(target.attributes).forEach((attr) => {
      if (!attr.name.startsWith('on')) {
        attrs[attr.name] = attr.value.slice(0, 150);
      }
    });

    let derivedName =
      target.getAttribute('data-element-name') ||
      closestWithData.getAttribute('data-element-name') ||
      target.getAttribute('title') ||
      target.getAttribute('aria-label') ||
      '';

    if (!derivedName) {
      const tag = target.tagName.toLowerCase();
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        derivedName = text ? `Tiêu đề: ${text.slice(0, 40)}` : `Tiêu đề ${tag.toUpperCase()}`;
      } else if (tag === 'button') {
        derivedName = text ? `Nút: ${text.slice(0, 35)}` : 'Nút bấm tương tác';
      } else if (tag === 'a') {
        derivedName = text ? `Liên kết: ${text.slice(0, 35)}` : 'Đường dẫn liên kết';
      } else if (tag === 'img') {
        derivedName = target.getAttribute('alt') ? `Hình ảnh: ${target.getAttribute('alt')}` : 'Hình ảnh';
      } else if (target.classList.contains('bento-card') || target.classList.contains('glass-card')) {
        derivedName = 'Thẻ Bento / Card';
      } else {
        derivedName = `${tag.toUpperCase()} (${target.id || 'no-id'})`;
      }
    }

    return {
      tag: target.tagName.toLowerCase(),
      id: target.id || closestWithData.id || '',
      elementName: derivedName,
      elementType: target.getAttribute('data-element-type') || closestWithData.getAttribute('data-element-type') || 'container',
      elementPage: target.getAttribute('data-element-page') || closestWithData.getAttribute('data-element-page') || 'global',
      elementParent: target.getAttribute('data-element-parent') || closestWithData.getAttribute('data-element-parent') || undefined,
      elementDescription: target.getAttribute('data-element-description') || closestWithData.getAttribute('data-element-description') || undefined,
      className: typeof target.className === 'string' ? target.className : '',
      selector,
      text,
      rect,
      element: target,
      attributes: attrs,
    };
  }, []);

  // Track cursor hover & double-click to show the 3 inspection action buttons
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      setHoveredInfo(extractInfo(target));
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      e.preventDefault();
      e.stopPropagation();

      const info = extractInfo(target);
      const computed = window.getComputedStyle(target);
      const rect = target.getBoundingClientRect();

      setSelectedTarget({
        target,
        info,
        computed,
        rect,
      });
      SoundEngine.playTap();
      if (onShowNotification) {
        onShowNotification(`🔍 Đã chọn đối tượng: ${info.elementName} (${info.selector}). Vui lòng chọn hành động trích xuất.`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('dblclick', handleDblClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('dblclick', handleDblClick, true);
    };
  }, [isActive, extractInfo, onShowNotification]);

  // Handler for Action 1: Get Object Identification Info for AI
  const handleCopyIdentity = () => {
    if (!selectedTarget) return;
    const { info } = selectedTarget;
    const payload = `[AI Target: "${info.elementName || info.tag}" | Tag: ${info.tag} | ID: ${info.id || 'none'} | Selector: ${info.selector} | Type: ${info.elementType} | Page: ${info.elementPage} | Text: "${info.text || ''}"]`;

    navigator.clipboard.writeText(payload);
    setCopiedType('identity');
    SoundEngine.playTap();
    if (onSwitchToLightMode) onSwitchToLightMode();
    if (onShowNotification) {
      onShowNotification(`✓ [X-Ray] Đã sao chép nhận dạng đối tượng vào bộ nhớ tạm thành công!`);
    }
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Handler for Action 2: Get Object Effects
  const handleCopyEffects = () => {
    if (!selectedTarget) return;
    const { computed, info } = selectedTarget;
    const payload = `[Object CSS Effects & Animations for ${info.elementName}]
- Transition: ${computed.transition}
- Animation: ${computed.animation}
- Transform: ${computed.transform}
- Box Shadow: ${computed.boxShadow}
- Drop Shadow / Filter: ${computed.filter}
- Backdrop Filter: ${computed.backdropFilter}
- Opacity: ${computed.opacity}
- Cursor: ${computed.cursor}
- Will Change: ${computed.willChange}`;

    navigator.clipboard.writeText(payload);
    setCopiedType('effects');
    SoundEngine.playTap();
    if (onShowNotification) {
      onShowNotification(`✓ [X-Ray] Đã sao chép hiệu ứng đối tượng vào bộ nhớ tạm thành công!`);
    }
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Handler for Action 3: Get Object Configuration Info
  const handleCopyConfig = () => {
    if (!selectedTarget) return;
    const { computed, info, rect } = selectedTarget;
    const payload = `[Object Configuration & Metrics for ${info.elementName}]
- Dimensions: Width ${Math.round(rect.width)}px, Height ${Math.round(rect.height)}px (Top: ${Math.round(rect.top)}, Left: ${Math.round(rect.left)})
- Font Family: ${computed.fontFamily}
- Font Size: ${computed.fontSize} (Weight: ${computed.fontWeight}, Line Height: ${computed.lineHeight})
- Text Color: ${computed.color}
- Background Color: ${computed.backgroundColor}
- Border: Width ${computed.borderWidth}, Style ${computed.borderStyle}, Color ${computed.borderColor}
- Border Radius: ${computed.borderRadius}
- Spacing: Padding (${computed.padding}), Margin (${computed.margin})
- Display / Layout: Display ${computed.display}, Flex Direction ${computed.flexDirection}, Gap ${computed.gap}
- ClassName: ${info.className}
- Selector: ${info.selector}`;

    navigator.clipboard.writeText(payload);
    setCopiedType('config');
    SoundEngine.playTap();
    if (onShowNotification) {
      onShowNotification(`✓ [X-Ray] Đã sao chép cấu hình đối tượng vào bộ nhớ tạm thành công!`);
    }
    setTimeout(() => setCopiedType(null), 2500);
  };

  if (!isActive) return null;

  return (
    <div id="xray-inspector-root" className="fixed inset-0 pointer-events-none z-[99999] select-none font-play">
      {/* Top Banner Indicator */}
      <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border-2 shadow-[0_4px_24px_rgba(6,182,212,0.35)] backdrop-blur-xl typo-label font-play font-bold flex items-center gap-2.5 pointer-events-auto transition-all ${
        inspectorTheme === 'light'
          ? 'bg-white/98 text-cyan-950 border-cyan-500/80 shadow-md'
          : 'bg-slate-900/98 text-cyan-200 border-cyan-400/80 shadow-xl'
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
        <span className="font-play tracking-wide">
          X-RAY INSPECTOR: DOUBLE CLICK VÀO ĐỐI TƯỢNG ĐỂ TRÍCH XUẤT THÔNG TIN / HIỆU ỨNG / CẤU HÌNH [X ĐỂ TẮT]
        </span>

        <button
          type="button"
          onClick={() => setInspectorTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          className={`px-2.5 py-0.5 rounded-full typo-badge font-play font-bold border transition cursor-pointer flex items-center gap-1 ${
            inspectorTheme === 'light'
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
          }`}
        >
          <WebIcon name={inspectorTheme === 'light' ? 'sun' : 'moon'} className="w-3 h-3" />
          <span>{inspectorTheme === 'light' ? 'Sáng' : 'Tối'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsActive(false);
            setHoveredInfo(null);
            setSelectedTarget(null);
          }}
          className="ml-1 px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-900 transition cursor-pointer typo-badge font-play font-bold border border-rose-300"
        >
          Tắt (X)
        </button>
      </div>

      {/* Hover Bounding Box */}
      {hoveredInfo && !selectedTarget && (
        <div
          className="absolute border-2 border-cyan-500 bg-cyan-400/15 pointer-events-none transition-all duration-75 rounded-[14px] shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          style={{
            left: `${hoveredInfo.rect.left}px`,
            top: `${hoveredInfo.rect.top}px`,
            width: `${hoveredInfo.rect.width}px`,
            height: `${hoveredInfo.rect.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-cyan-600 text-white px-2 py-0.5 rounded typo-badge font-play font-bold shadow-md whitespace-nowrap truncate max-w-xs">
            {hoveredInfo.elementName ? `${hoveredInfo.elementName} (Double Click để kiểm tra)` : hoveredInfo.selector}
          </div>
        </div>
      )}

      {/* Selected Target Action Modal / Floating Action Card on Double Click */}
      {selectedTarget && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-[14px] border shadow-2xl relative font-play animate-in fade-in zoom-in-95 duration-150 ${
            inspectorTheme === 'light'
              ? 'bg-white/95 text-slate-800 border-cyan-200 shadow-cyan-900/10'
              : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-black/50'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-[14px] bg-cyan-500/15 text-cyan-500">
                  <WebIcon name="sparkles" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="typo-h4 font-bold text-cyan-600 dark:text-cyan-400">
                    X-Ray Inspector: Phân tích đối tượng
                  </h3>
                  <p className="typo-caption opacity-75">
                    {selectedTarget.info.selector}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target Summary Badge */}
            <div className="mb-4 p-3 rounded-[14px] bg-cyan-50 dark:bg-slate-800/80 border border-cyan-200 dark:border-slate-700 flex flex-col gap-1">
              <span className="typo-badge font-bold text-cyan-700 dark:text-cyan-300">
                {selectedTarget.info.elementName}
              </span>
              <span className="typo-caption opacity-80 truncate">
                Tag: &lt;{selectedTarget.info.tag}&gt; | ID: #{selectedTarget.info.id || 'none'} | Type: {selectedTarget.info.elementType}
              </span>
            </div>

            {/* Action Buttons (3 Requested Features) */}
            <div className="flex flex-col gap-3">
              {/* Button 1: Lấy thông tin đối tượng (AI Recognition) */}
              <button
                type="button"
                onClick={handleCopyIdentity}
                className={`w-full py-3 px-4 rounded-[14px] font-play font-bold flex items-center justify-between border transition cursor-pointer shadow-sm ${
                  copiedType === 'identity'
                    ? 'bg-emerald-600 text-white border-emerald-500 scale-[1.02]'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <WebIcon name="cpu" className="w-5 h-5 shrink-0" />
                  <span className="text-left">
                    {copiedType === 'identity' ? '✓ Đã sao chép nhận dạng đối tượng!' : 'Lấy thông tin nhận dạng đối tượng (cho AI)'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Copy</span>
              </button>

              {/* Button 2: Lấy hiệu ứng đối tượng */}
              <button
                type="button"
                onClick={handleCopyEffects}
                className={`w-full py-3 px-4 rounded-[14px] font-play font-bold flex items-center justify-between border transition cursor-pointer shadow-sm ${
                  copiedType === 'effects'
                    ? 'bg-emerald-600 text-white border-emerald-500 scale-[1.02]'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <WebIcon name="sparkles" className="w-5 h-5 shrink-0" />
                  <span className="text-left">
                    {copiedType === 'effects' ? '✓ Đã sao chép hiệu ứng đối tượng!' : 'Lấy hiệu ứng đối tượng (Effects & Animation)'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Copy</span>
              </button>

              {/* Button 3: Lấy thông tin cấu hình đối tượng */}
              <button
                type="button"
                onClick={handleCopyConfig}
                className={`w-full py-3 px-4 rounded-[14px] font-play font-bold flex items-center justify-between border transition cursor-pointer shadow-sm ${
                  copiedType === 'config'
                    ? 'bg-emerald-600 text-white border-emerald-500 scale-[1.02]'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-amber-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <WebIcon name="settings" className="w-5 h-5 shrink-0" />
                  <span className="text-left">
                    {copiedType === 'config' ? '✓ Đã sao chép cấu hình đối tượng!' : 'Lấy thông tin cấu hình đối tượng (Kích thước, Font, Màu)'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Copy</span>
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs opacity-75">
              <span>Bấm nút bất kỳ để sao chép dữ liệu vào Clipboard.</span>
              <button
                type="button"
                onClick={() => setSelectedTarget(null)}
                className="underline hover:opacity-100 cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
