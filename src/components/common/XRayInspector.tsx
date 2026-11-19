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

interface PinnedTarget {
  key: string;
  target: HTMLElement;
  info: ElementInfo;
  computed: CSSStyleDeclaration;
  rect: DOMRect;
}

export const XRayInspector: React.FC<XRayInspectorProps> = ({
  onShowNotification,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hoveredInfo, setHoveredInfo] = useState<ElementInfo | null>(null);
  const [pinnedTargets, setPinnedTargets] = useState<PinnedTarget[]>([]);
  const [isShiftHeld, setIsShiftHeld] = useState<boolean>(false);
  const [isShiftAddMode, setIsShiftAddMode] = useState<boolean>(false);

  const activeRef = useRef<boolean>(false);
  activeRef.current = isActive;
  const pinnedRef = useRef<PinnedTarget[]>([]);
  pinnedRef.current = pinnedTargets;
  const shiftAddModeRef = useRef<boolean>(false);
  shiftAddModeRef.current = isShiftAddMode;
  const clickUsedDuringShiftRef = useRef<boolean>(false);
  const nextPinIdRef = useRef<number>(1);

  const closeXRay = useCallback(() => {
    setIsActive(false);
    setHoveredInfo(null);
    setPinnedTargets([]);
    setIsShiftHeld(false);
    setIsShiftAddMode(false);
    clickUsedDuringShiftRef.current = false;
  }, []);

  // Bật / tắt chế độ X-Ray bằng phím 'x' hoặc 'X', và xử lý phím Shift / Escape
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
            setPinnedTargets([]);
            setIsShiftHeld(false);
            setIsShiftAddMode(false);
            clickUsedDuringShiftRef.current = false;
            onShowNotification?.('Đã tắt chế độ X-Ray');
          } else {
            onShowNotification?.(
              'Đã bật chế độ X-Ray: Click để ghim đối tượng · Shift để chọn thêm · Double-click để sao chép tên'
            );
          }
          return next;
        });
        return;
      }

      if (!activeRef.current) return;

      if (e.key === 'Shift') {
        if (!e.repeat) {
          clickUsedDuringShiftRef.current = false;
        }
        setIsShiftHeld(true);
      } else if (e.key === 'Escape') {
        if (shiftAddModeRef.current) {
          setIsShiftAddMode(false);
          onShowNotification?.('Đã khóa lại danh sách đối tượng đang ghim');
        } else if (pinnedRef.current.length > 0) {
          setPinnedTargets([]);
          setIsShiftAddMode(false);
          onShowNotification?.('Đã bỏ ghim tất cả đối tượng X-Ray');
        } else {
          closeXRay();
          onShowNotification?.('Đã tắt chế độ X-Ray');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(false);
        // Nếu người dùng bấm phím tắt Shift mà không click trong lúc giữ Shift và đang có đối tượng ghim:
        // bật/tắt chế độ chọn thêm đối tượng
        if (activeRef.current && pinnedRef.current.length > 0 && !clickUsedDuringShiftRef.current) {
          setIsShiftAddMode((prev) => {
            const next = !prev;
            SoundEngine.playTap();
            onShowNotification?.(
              next
                ? 'Đã bật chọn thêm đối tượng (Shift): Click để thêm đối tượng mới · Bấm Shift lại để khóa'
                : 'Đã khóa đối tượng đang ghim (bấm Shift để chọn thêm)'
            );
            return next;
          });
        }
        clickUsedDuringShiftRef.current = false;
      }
    };

    const handleWindowBlur = () => {
      setIsShiftHeld(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [onShowNotification, closeXRay]);

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

  const createPinnedTarget = useCallback(
    (target: HTMLElement): PinnedTarget => {
      const info = extractInfo(target);
      const computed = window.getComputedStyle(target);
      const rect = target.getBoundingClientRect();
      const key = `pin-${nextPinIdRef.current++}`;
      return { key, target, info, computed, rect };
    },
    [extractInfo]
  );

  // Theo dõi di chuột, click ghim đối tượng, Shift để chọn thêm & double click để copy tên
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) {
        setHoveredInfo(null);
        return;
      }
      const canPreviewOther =
        pinnedRef.current.length === 0 || e.shiftKey || shiftAddModeRef.current;
      if (!canPreviewOther) {
        setHoveredInfo(null);
        return;
      }
      setHoveredInfo(extractInfo(target));
    };

    const selectDomElement = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.shiftKey) {
        clickUsedDuringShiftRef.current = true;
      }

      const currentPinned = pinnedRef.current;
      const allowAddMore = e.shiftKey || shiftAddModeRef.current;

      // Chưa có đối tượng nào được ghim -> Click để ghim đối tượng đầu tiên
      if (currentPinned.length === 0) {
        const pinned = createPinnedTarget(target);
        setPinnedTargets([pinned]);
        setHoveredInfo(null);
        SoundEngine.playTap();
        onShowNotification?.(
          `Đã ghim "${pinned.info.elementName || pinned.info.tag}" · Bấm Shift để chọn thêm · Double-click để chép tên`
        );
        return;
      }

      // Đã có đối tượng ghim nhưng KHÔNG bấm/bật Shift -> khóa chặt, không chọn đối tượng khác
      if (!allowAddMore) {
        const isAlreadyPinned = currentPinned.some((p) => p.target === target);
        if (!isAlreadyPinned) {
          onShowNotification?.(
            'Đối tượng đang được ghim · Bấm phím Shift để chọn thêm đối tượng khác'
          );
        }
        return;
      }

      // Đang giữ/bật Shift -> cho phép chọn thêm đối tượng (nếu đã ghim và có >1 thì bỏ chọn đối tượng đó)
      const existingIdx = currentPinned.findIndex((p) => p.target === target);
      if (existingIdx >= 0) {
        if (currentPinned.length > 1) {
          setPinnedTargets((prev) => prev.filter((_, idx) => idx !== existingIdx));
          SoundEngine.playTap();
        }
        return;
      }

      const added = createPinnedTarget(target);
      setPinnedTargets((prev) => [...prev, added]);
      SoundEngine.playTap();
      onShowNotification?.(
        `✓ Đã chọn thêm "${added.info.elementName || added.info.tag}" (${currentPinned.length + 1} đối tượng)`
      );
    };

    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#xray-inspector-root')) return;

      e.preventDefault();
      e.stopPropagation();

      const currentPinned = pinnedRef.current;
      let copiedNames: string[] = [];

      if (currentPinned.length > 0 && !e.shiftKey && !shiftAddModeRef.current) {
        const exactPinned =
          currentPinned.find((p) => p.target === target) ||
          currentPinned.find((p) => p.target.contains(target));
        if (exactPinned) {
          copiedNames = [exactPinned.info.elementName || exactPinned.info.tag];
        } else if (currentPinned.length === 1) {
          copiedNames = [currentPinned[0].info.elementName || currentPinned[0].info.tag];
        } else {
          copiedNames = currentPinned.map((p) => p.info.elementName || p.info.tag);
        }
      } else {
        const info = extractInfo(target);
        copiedNames = [info.elementName || info.tag];
      }

      const textToCopy = copiedNames.join(', ');
      copyTextToClipboard(textToCopy);
      SoundEngine.playTap();
      onShowNotification?.(`✓ Đã sao chép tên đối tượng "${textToCopy}" vào bộ nhớ tạm`);
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('click', selectDomElement, true);
    window.addEventListener('dblclick', handleDoubleClick, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('click', selectDomElement, true);
      window.removeEventListener('dblclick', handleDoubleClick, true);
    };
  }, [isActive, extractInfo, createPinnedTarget, onShowNotification]);

  // Cập nhật lại tọa độ viền màu khi cuộn hoặc thay đổi kích thước màn hình
  useEffect(() => {
    if (!isActive || pinnedTargets.length === 0) return;

    const updatePinnedRects = () => {
      setPinnedTargets((prev) =>
        prev
          .filter((item) => document.body.contains(item.target))
          .map((item) => {
            const nextRect = item.target.getBoundingClientRect();
            return {
              ...item,
              rect: nextRect,
              info: { ...item.info, rect: nextRect },
            };
          })
      );
    };

    window.addEventListener('scroll', updatePinnedRects, true);
    window.addEventListener('resize', updatePinnedRects);
    return () => {
      window.removeEventListener('scroll', updatePinnedRects, true);
      window.removeEventListener('resize', updatePinnedRects);
    };
  }, [isActive, pinnedTargets.length]);

  const handleUnpinOne = (e: React.MouseEvent, pinKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPinnedTargets((prev) => {
      const next = prev.filter((item) => item.key !== pinKey);
      if (next.length === 0) {
        setIsShiftAddMode(false);
      }
      return next;
    });
    SoundEngine.playTap();
  };

  const handleCopyPinnedName = (e: React.MouseEvent, item: PinnedTarget) => {
    e.preventDefault();
    e.stopPropagation();
    const name = item.info.elementName || item.info.tag;
    copyTextToClipboard(name);
    SoundEngine.playTap();
    onShowNotification?.(`✓ Đã sao chép tên đối tượng "${name}" vào bộ nhớ tạm`);
  };

  // Icon 1: Sao chép nhận dạng đối tượng & tự đóng X-Ray
  const handleCopyIdentity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinnedTargets.length === 0) return;
    const payload = pinnedTargets
      .map(
        ({ info }) =>
          `[Nhận dạng đối tượng: "${info.elementName || info.tag}" | Thẻ: ${info.tag} | ID: ${info.id || 'không có'} | Bộ chọn CSS: ${info.selector} | Loại: ${info.elementType} | Trang: ${info.elementPage} | Nội dung: "${info.text || ''}"]`
      )
      .join('\n\n');

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    const labelSummary =
      pinnedTargets.length === 1
        ? `"${pinnedTargets[0].info.elementName || pinnedTargets[0].info.tag}"`
        : `${pinnedTargets.length} đối tượng`;
    onShowNotification?.(`✓ Đã sao chép nhận dạng ${labelSummary} vào bộ nhớ tạm`);
    closeXRay();
  };

  // Icon 2: Sao chép hiệu ứng đối tượng & tự đóng X-Ray
  const handleCopyEffects = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinnedTargets.length === 0) return;
    const payload = pinnedTargets
      .map(({ computed, info }) => {
        return `[Hiệu ứng đối tượng: ${info.elementName || info.tag}]
- Chuyển động (Transition): ${computed.transition}
- Hoạt ảnh (Animation): ${computed.animation}
- Biến đổi (Transform): ${computed.transform}
- Đổ bóng (Box Shadow): ${computed.boxShadow}
- Bộ lọc (Filter): ${computed.filter}
- Kính mờ (Backdrop Filter): ${computed.backdropFilter}
- Độ mờ (Opacity): ${computed.opacity}
- Con trỏ (Cursor): ${computed.cursor}
- Tối ưu GPU (Will Change): ${computed.willChange}`;
      })
      .join('\n\n');

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    const labelSummary =
      pinnedTargets.length === 1
        ? `"${pinnedTargets[0].info.elementName || pinnedTargets[0].info.tag}"`
        : `${pinnedTargets.length} đối tượng`;
    onShowNotification?.(`✓ Đã sao chép hiệu ứng ${labelSummary} vào bộ nhớ tạm`);
    closeXRay();
  };

  // Icon 3: Sao chép thông tin cấu hình đối tượng & tự đóng X-Ray
  const handleCopyConfig = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinnedTargets.length === 0) return;
    const payload = pinnedTargets
      .map(({ computed, info, rect }) => {
        return `[Thông tin cấu hình đối tượng: ${info.elementName || info.tag}]
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
      })
      .join('\n\n');

    copyTextToClipboard(payload);
    SoundEngine.playTap();
    const labelSummary =
      pinnedTargets.length === 1
        ? `"${pinnedTargets[0].info.elementName || pinnedTargets[0].info.tag}"`
        : `${pinnedTargets.length} đối tượng`;
    onShowNotification?.(`✓ Đã sao chép cấu hình ${labelSummary} vào bộ nhớ tạm`);
    closeXRay();
  };

  if (!isActive) return null;

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const canHoverPreview = pinnedTargets.length === 0 || isShiftHeld || isShiftAddMode;
  const isHoveredPinned = Boolean(
    hoveredInfo && pinnedTargets.some((p) => p.target === hoveredInfo.element)
  );

  return (
    <div id="xray-inspector-root" className="fixed inset-0 pointer-events-none z-[99999] select-none font-play">
      {/* Trạng thái thanh chỉ dẫn nhanh trên cùng khi đang bật X-Ray & có đối tượng ghim */}
      {pinnedTargets.length > 0 && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 pointer-events-auto z-[100001] inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 text-white border border-white/20 shadow-lg backdrop-blur-md text-[11px] font-play whitespace-nowrap max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isShiftHeld || isShiftAddMode ? 'bg-emerald-400' : 'bg-rose-500'
            }`}
          />
          <span className="font-bold">
            {isShiftHeld || isShiftAddMode
              ? `Đang bật chọn thêm (Shift) · Đã ghim ${pinnedTargets.length}`
              : `Đã ghim ${pinnedTargets.length} đối tượng · Bấm Shift để chọn thêm · Double-click để chép tên`}
          </span>
          <button
            type="button"
            onClick={() => {
              setPinnedTargets([]);
              setIsShiftAddMode(false);
            }}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold cursor-pointer transition-colors"
            title="Bỏ ghim tất cả (Esc)"
          >
            Bỏ ghim
          </button>
        </div>
      )}

      {/* Khung viền khi rê chuột (chỉ hiển thị khi chưa ghim hoặc đang giữ/bật Shift để chọn thêm) */}
      {canHoverPreview && hoveredInfo && !isHoveredPinned && (
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
            {isShiftHeld || isShiftAddMode ? '+ Thêm: ' : ''}
            {hoveredInfo.elementName || hoveredInfo.selector}
          </div>
        </div>
      )}

      {/* Viền màu nổi bật + Tên đối tượng & 3 Icon sao chép ngay trên tên cho từng đối tượng đang ghim */}
      {pinnedTargets.map((item, idx) => {
        const selectedRect = item.rect;
        const placeToolbarInsideTop = selectedRect.top < 42;
        const toolbarLeft = Math.max(8, Math.min(selectedRect.left, viewportW - 360));
        const toolbarTop = placeToolbarInsideTop
          ? Math.max(8, selectedRect.top + 6)
          : Math.max(8, selectedRect.top - 38);
        const isLast = idx === pinnedTargets.length - 1;

        return (
          <React.Fragment key={item.key}>
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
              onDoubleClick={(e) => handleCopyPinnedName(e, item)}
              title="Double-click để sao chép tên đối tượng"
              className="fixed pointer-events-auto z-[100000] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/95 text-white border border-rose-400/80 shadow-[0_8px_24px_rgba(15,23,42,0.45)] backdrop-blur-md max-w-[calc(100vw-16px)]"
              style={{
                left: `${toolbarLeft}px`,
                top: `${toolbarTop}px`,
              }}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              {pinnedTargets.length > 1 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/30 border border-rose-400/50 text-rose-100 shrink-0">
                  #{idx + 1}
                </span>
              )}
              <span className="text-xs font-bold font-play truncate max-w-[170px] sm:max-w-[240px]">
                {item.info.elementName || item.info.tag}
              </span>

              {isLast && (
                <>
                  <div className="w-[1px] h-4 bg-white/20 mx-0.5 shrink-0" />

                  {/* Icon 1: Nhận dạng đối tượng */}
                  <button
                    type="button"
                    onClick={handleCopyIdentity}
                    title={
                      pinnedTargets.length > 1
                        ? `Sao chép nhận dạng ${pinnedTargets.length} đối tượng`
                        : 'Sao chép nhận dạng đối tượng'
                    }
                    aria-label="Sao chép nhận dạng đối tượng"
                    className="w-6 h-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                  >
                    <WebIcon name="cpu" className="w-3.5 h-3.5" />
                  </button>

                  {/* Icon 2: Hiệu ứng đối tượng */}
                  <button
                    type="button"
                    onClick={handleCopyEffects}
                    title={
                      pinnedTargets.length > 1
                        ? `Sao chép hiệu ứng ${pinnedTargets.length} đối tượng`
                        : 'Sao chép hiệu ứng đối tượng'
                    }
                    aria-label="Sao chép hiệu ứng đối tượng"
                    className="w-6 h-6 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                  >
                    <WebIcon name="sparkles" className="w-3.5 h-3.5" />
                  </button>

                  {/* Icon 3: Thông tin cấu hình đối tượng */}
                  <button
                    type="button"
                    onClick={handleCopyConfig}
                    title={
                      pinnedTargets.length > 1
                        ? `Sao chép cấu hình ${pinnedTargets.length} đối tượng`
                        : 'Sao chép thông tin cấu hình đối tượng'
                    }
                    aria-label="Sao chép thông tin cấu hình đối tượng"
                    className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                  >
                    <WebIcon name="settings" className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={(e) => handleUnpinOne(e, item.key)}
                title="Bỏ ghim đối tượng này"
                aria-label="Bỏ ghim đối tượng này"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-rose-500 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-0.5"
              >
                <WebIcon name="x" className="w-3 h-3" />
              </button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
