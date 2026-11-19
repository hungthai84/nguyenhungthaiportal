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

// Tạo CSS selector duy nhất cho đối tượng DOM
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
        .filter(
          (c) =>
            c &&
            !c.startsWith('hover:') &&
            !c.startsWith('focus:') &&
            !c.startsWith('active:') &&
            !c.startsWith('group-') &&
            !c.includes(':')
        )
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

function copyTextToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    });
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

export interface XRayInspectorProps {
  onShowNotification?: (msg: string) => void;
  onSwitchToLightMode?: () => void;
}

export const XRayInspector: React.FC<XRayInspectorProps> = ({
  onShowNotification,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hoveredInfo, setHoveredInfo] = useState<ElementInfo | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{
    target: HTMLElement;
    info: ElementInfo;
    computed: CSSStyleDeclaration;
    rect: DOMRect;
  } | null>(null);

  const activeRef = useRef<boolean>(false);
  activeRef.current = isActive;

  const closeXRay = useCallback(() => {
    setIsActive(false);
    setHoveredInfo(null);
    setSelectedTarget(null);
  }, []);

  // Bật / tắt chế độ X-Ray bằng phím 'x' hoặc 'X'
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
            onShowNotification?.('Đã tắt chế độ X-Ray');
          } else {
            onShowNotification?.('Đã bật chế độ X-Ray: Bấm chọn đối tượng cần kiểm tra [Nhấn X để tắt]');
          }
          return next;
        });
      } else if (e.key === 'Escape' && activeRef.current) {
        if (selectedTarget) {
          setSelectedTarget(null);
        } else {
          closeXRay();
          onShowNotification?.('Đã tắt chế độ X-Ray');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShowNotification, selectedTarget, closeXRay]);

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
        derivedName = text ? `Nút: ${text.slice(0, 35)}` : 'Nút bấm';
      } else if (tag === 'a') {
        derivedName = text ? `Liên kết: ${text.slice(0, 35)}` : 'Liên kết';
      } else if (tag === 'img') {
        derivedName = target.getAttribute('alt') ? `Hình ảnh: ${target.getAttribute('alt')}` : 'Hình ảnh';
      } else if (target.classList.contains('bento-card') || target.classList.contains('glass-card')) {
        derivedName = 'Thẻ nội dung';
      } else {
        derivedName = `${tag.toUpperCase()}${target.id ? ` (#${target.id})` : ''}`;
      }
    }

    return {
      tag: target.tagName.toLowerCase(),
      id: target.id || closestWithData.id || '',
      elementName: derivedName,
      elementType:
        target.getAttribute('data-element-type') ||
        closestWithData.getAttribute('data-element-type') ||
        'container',
      elementPage:
        target.getAttribute('data-element-page') ||
        closestWithData.getAttribute('data-element-page') ||
        'global',
      elementParent:
        target.getAttribute('data-element-parent') ||
        closestWithData.getAttribute('data-element-parent') ||
        undefined,
      elementDescription:
        target.getAttribute('data-element-description') ||
        closestWithData.getAttribute('data-element-description') ||
        undefined,
      className: typeof target.className === 'string' ? target.className : '',
      selector,
      text,
      rect,
      element: target,
      attributes: attrs,
    };
  }, []);

  // Theo dõi di chuột & bấm chọn đối tượng
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;
      setHoveredInfo(extractInfo(target));
    };

    const selectDomElement = (e: MouseEvent) => {
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
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('click', selectDomElement, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('click', selectDomElement, true);
    };
  }, [isActive, extractInfo]);

  // Cập nhật lại tọa độ viền màu khi cuộn hoặc thay đổi kích thước màn hình
  useEffect(() => {
    if (!isActive || !selectedTarget) return;

    const updateSelectedRect = () => {
      if (!document.body.contains(selectedTarget.target)) {
        setSelectedTarget(null);
        return;
      }
      const nextRect = selectedTarget.target.getBoundingClientRect();
      setSelectedTarget((prev) =>
        prev
          ? {
              ...prev,
              rect: nextRect,
              info: { ...prev.info, rect: nextRect },
            }
          : null
      );
    };

    window.addEventListener('scroll', updateSelectedRect, true);
    window.addEventListener('resize', updateSelectedRect);
    return () => {
      window.removeEventListener('scroll', updateSelectedRect, true);
      window.removeEventListener('resize', updateSelectedRect);
    };
  }, [isActive, selectedTarget?.target]);

  // Icon 1: Sao chép nhận dạng đối tượng & tự đóng X-Ray
  const handleCopyIdentity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedTarget) return;
    const { info } = selectedTarget;
    const payload = `[Nhận dạng đối tượng: "${info.elementName || info.tag}" | Thẻ: ${info.tag} | ID: ${info.id || 'không có'} | Bộ chọn CSS: ${info.selector} | Loại: ${info.elementType} | Trang: ${info.elementPage} | Nội dung: "${info.text || ''}"]`;

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    onShowNotification?.(`✓ Đã sao chép nhận dạng "${info.elementName || info.tag}" vào bộ nhớ tạm`);
    closeXRay();
  };

  // Icon 2: Sao chép hiệu ứng đối tượng & tự đóng X-Ray
  const handleCopyEffects = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedTarget) return;
    const { computed, info } = selectedTarget;
    const payload = `[Hiệu ứng đối tượng: ${info.elementName || info.tag}]
- Chuyển động (Transition): ${computed.transition}
- Hoạt ảnh (Animation): ${computed.animation}
- Biến đổi (Transform): ${computed.transform}
- Đổ bóng (Box Shadow): ${computed.boxShadow}
- Bộ lọc (Filter): ${computed.filter}
- Kính mờ (Backdrop Filter): ${computed.backdropFilter}
- Độ mờ (Opacity): ${computed.opacity}
- Con trỏ (Cursor): ${computed.cursor}
- Tối ưu GPU (Will Change): ${computed.willChange}`;

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    onShowNotification?.(`✓ Đã sao chép hiệu ứng "${info.elementName || info.tag}" vào bộ nhớ tạm`);
    closeXRay();
  };

  // Icon 3: Sao chép thông tin cấu hình đối tượng & tự đóng X-Ray
  const handleCopyConfig = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedTarget) return;
    const { computed, info, rect } = selectedTarget;
    const payload = `[Thông tin cấu hình đối tượng: ${info.elementName || info.tag}]
- Kích thước & Vị trí: Rộng ${Math.round(rect.width)}px, Cao ${Math.round(rect.height)}px (Top: ${Math.round(rect.top)}px, Left: ${Math.round(rect.left)}px)
- Phông chữ: ${computed.fontFamily}
- Cỡ chữ: ${computed.fontSize} (Độ đậm: ${computed.fontWeight}, Chiều cao dòng: ${computed.lineHeight})
- Màu chữ: ${computed.color}
- Màu nền: ${computed.backgroundColor}
- Viền (Border): ${computed.borderWidth} ${computed.borderStyle} ${computed.borderColor}
- Bo góc (Border Radius): ${computed.borderRadius}
- Khoảng cách: Padding (${computed.padding}), Margin (${computed.margin})
- Bố cục: Display ${computed.display}, Flex Direction ${computed.flexDirection}, Gap ${computed.gap}
- Class: ${info.className}
- Bộ chọn CSS: ${info.selector}`;

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    onShowNotification?.(`✓ Đã sao chép cấu hình "${info.elementName || info.tag}" vào bộ nhớ tạm`);
    closeXRay();
  };

  if (!isActive) return null;

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const selectedRect = selectedTarget?.rect;
  const placeToolbarInsideTop = selectedRect ? selectedRect.top < 42 : false;
  const toolbarLeft = selectedRect
    ? Math.max(8, Math.min(selectedRect.left, viewportW - 340))
    : 8;
  const toolbarTop = selectedRect
    ? placeToolbarInsideTop
      ? Math.max(8, selectedRect.top + 6)
      : Math.max(8, selectedRect.top - 38)
    : 8;

  return (
    <div id="xray-inspector-root" className="fixed inset-0 pointer-events-none z-[99999] select-none font-play">
      {/* Khung viền khi rê chuột */}
      {hoveredInfo && (!selectedTarget || hoveredInfo.element !== selectedTarget.target) && (
        <div
          className="fixed border-2 border-cyan-500 bg-cyan-400/10 pointer-events-none transition-all duration-75 rounded-[12px] shadow-[0_0_12px_rgba(6,182,212,0.35)]"
          style={{
            left: `${hoveredInfo.rect.left}px`,
            top: `${hoveredInfo.rect.top}px`,
            width: `${hoveredInfo.rect.width}px`,
            height: `${hoveredInfo.rect.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-cyan-600 text-white px-2 py-0.5 rounded-md typo-badge font-play font-bold shadow-md whitespace-nowrap truncate max-w-xs">
            {hoveredInfo.elementName || hoveredInfo.selector}
          </div>
        </div>
      )}

      {/* Viền màu nổi bật + Tên đối tượng & 3 Icon sao chép ngay trên tên khi bấm chọn */}
      {selectedTarget && selectedRect && (
        <>
          <div
            aria-hidden="true"
            className="fixed pointer-events-none rounded-[12px] border-[2.5px] border-rose-500 bg-rose-500/10 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(244,63,94,0.45)] transition-all duration-100"
            style={{
              left: `${selectedRect.left}px`,
              top: `${selectedRect.top}px`,
              width: `${selectedRect.width}px`,
              height: `${selectedRect.height}px`,
            }}
          />

          <div
            className="fixed pointer-events-auto z-[100000] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/95 text-white border border-rose-400/80 shadow-[0_8px_24px_rgba(15,23,42,0.45)] backdrop-blur-md max-w-[calc(100vw-16px)]"
            style={{
              left: `${toolbarLeft}px`,
              top: `${toolbarTop}px`,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-xs font-bold font-play truncate max-w-[190px] sm:max-w-[260px]">
              {selectedTarget.info.elementName || selectedTarget.info.tag}
            </span>

            <div className="w-[1px] h-4 bg-white/20 mx-0.5 shrink-0" />

            {/* Icon 1: Nhận dạng đối tượng */}
            <button
              type="button"
              onClick={handleCopyIdentity}
              title="Sao chép nhận dạng đối tượng"
              aria-label="Sao chép nhận dạng đối tượng"
              className="w-6 h-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            >
              <WebIcon name="cpu" className="w-3.5 h-3.5" />
            </button>

            {/* Icon 2: Hiệu ứng đối tượng */}
            <button
              type="button"
              onClick={handleCopyEffects}
              title="Sao chép hiệu ứng đối tượng"
              aria-label="Sao chép hiệu ứng đối tượng"
              className="w-6 h-6 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            >
              <WebIcon name="sparkles" className="w-3.5 h-3.5" />
            </button>

            {/* Icon 3: Thông tin cấu hình đối tượng */}
            <button
              type="button"
              onClick={handleCopyConfig}
              title="Sao chép thông tin cấu hình đối tượng"
              aria-label="Sao chép thông tin cấu hình đối tượng"
              className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            >
              <WebIcon name="settings" className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
