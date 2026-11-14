'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

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
            if (onShowNotification) onShowNotification('Đã tắt chế độ X-Ray Inspector');
          } else {
            if (onShowNotification)
              onShowNotification('🎯 Bật X-Ray Inspector: Di chuột & Double Click để chép thông tin đối tượng [Nhấn X để tắt]');
          }
          return next;
        });
      } else if (e.key === 'Escape' && activeRef.current) {
        setIsActive(false);
        setHoveredInfo(null);
        if (onShowNotification) onShowNotification('Đã tắt chế độ X-Ray Inspector');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShowNotification]);

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

  // Track cursor hover & double-click to copy payload (NO POPUP)
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      setHoveredInfo(extractInfo(target));
    };

    const copyObjectPayload = (target: HTMLElement) => {
      const info = extractInfo(target);
      const elementId = info.id || 'no-id';
      const elementName = info.elementName || info.selector;
      const pageName = info.elementPage || 'global';
      const elementType = info.elementType || 'container';
      const parentId = info.elementParent || 'none';

      const payload = `[ID: ${elementId}] Name: ${elementName} | Page: ${pageName} | Type: ${elementType} | Parent: ${parentId} | Selector: ${info.selector}`;
      
      navigator.clipboard.writeText(payload);

      if (onSwitchToLightMode) {
        onSwitchToLightMode();
      }

      if (onShowNotification) {
        onShowNotification(`✓ Đã sao chép vào bộ nhớ tạm: [ID: ${elementId}] ${elementName}`);
      }
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      e.preventDefault();
      e.stopPropagation();

      copyObjectPayload(target);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      e.preventDefault();
      e.stopPropagation();

      // Cũng tự động chép dữ liệu khi click để mang lại trải nghiệm tiện lợi nhất
      copyObjectPayload(target);
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('dblclick', handleDblClick, true);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('dblclick', handleDblClick, true);
      window.removeEventListener('click', handleClick, true);
    };
  }, [isActive, extractInfo, onShowNotification, onSwitchToLightMode]);

  if (!isActive) return null;

  return (
    <div id="xray-inspector-root" className="fixed inset-0 pointer-events-none z-[99999] select-none font-play">
      {/* Top Banner Indicator - Responsive Glass Bar (Zero Popup) */}
      <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border-2 shadow-[0_4px_24px_rgba(6,182,212,0.35)] backdrop-blur-xl typo-label font-play font-bold flex items-center gap-2.5 pointer-events-auto transition-all ${
        inspectorTheme === 'light'
          ? 'bg-white/98 text-cyan-950 border-cyan-500/80 shadow-md'
          : 'bg-slate-900/98 text-cyan-200 border-cyan-400/80 shadow-xl'
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
        <span className="font-play tracking-wide">
          X-RAY INSPECTOR: DOUBLE CLICK / CLICK ĐỂ SAO CHÉP ĐỐI TƯỢNG UI (KHÔNG POPUP)
        </span>

        {/* Chuyển đổi giao diện Sáng / Tối cho X-Ray Banner */}
        <button
          type="button"
          onClick={() => setInspectorTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          className={`px-2.5 py-0.5 rounded-full typo-badge font-play font-bold border transition cursor-pointer flex items-center gap-1 ${
            inspectorTheme === 'light'
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
          }`}
          title="Chuyển chế độ giao diện cho khung X-Ray (Sáng / Tối)"
        >
          <WebIcon name={inspectorTheme === 'light' ? 'sun' : 'moon'} className="w-3 h-3" />
          <span>{inspectorTheme === 'light' ? 'Giao diện Sáng' : 'Giao diện Tối'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsActive(false);
            setHoveredInfo(null);
          }}
          className="ml-1 px-2.5 py-0.5 rounded-full bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-900 transition cursor-pointer typo-badge font-play font-bold border border-rose-300"
        >
          Tắt (X)
        </button>
      </div>

      {/* Hover Bounding Box */}
      {hoveredInfo && (
        <div
          className="absolute border-2 border-cyan-500 bg-cyan-400/20 pointer-events-none transition-all duration-75 rounded-[14px] shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          style={{
            left: `${hoveredInfo.rect.left}px`,
            top: `${hoveredInfo.rect.top}px`,
            width: `${hoveredInfo.rect.width}px`,
            height: `${hoveredInfo.rect.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-cyan-600 text-white px-2 py-0.5 rounded typo-badge font-play font-bold shadow-md whitespace-nowrap truncate max-w-xs">
            {hoveredInfo.elementName ? `${hoveredInfo.elementName} (#${hoveredInfo.id || 'no-id'})` : hoveredInfo.selector}
          </div>
        </div>
      )}
    </div>
  );
};
