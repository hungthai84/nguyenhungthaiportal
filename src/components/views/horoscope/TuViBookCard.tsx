'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import { stopActiveSpeech } from '@/utils/speechVoice';

const BOOK_OPEN_SOUND_URL =
  'https://cdn.scena.ai/project/9626/b40b848d5a2ad108760073e8c64bd80f963850ab7e79c19af228c82a83f6419d.mp3';
const COVER_MEDALLION_IMAGE_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794233300/T%E1%BB%AD_vi_avata.png';
const THIEN_CO_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/50fa79ad5c25c7dec42334262fa1ddf347fc3ac37045824740e75234fd4c724b.mp4';

const BAGUA_LIST = [
  { glyph: '☰', name: 'Càn', elem: 'Kim · Tây Bắc' },
  { glyph: '☷', name: 'Khôn', elem: 'Thổ · Tây Nam' },
  { glyph: '☵', name: 'Khảm', elem: 'Thủy · Bắc' },
  { glyph: '☲', name: 'Ly', elem: 'Hỏa · Nam' },
  { glyph: '☳', name: 'Chấn', elem: 'Mộc · Đông' },
  { glyph: '☴', name: 'Tốn', elem: 'Mộc · Đông Nam' },
  { glyph: '☶', name: 'Cấn', elem: 'Thổ · Đông Bắc' },
  { glyph: '☱', name: 'Đoài', elem: 'Kim · Tây' },
];

const HERO_MOTTO =
  '“Không chỉ làm tốt một công việc, mà xây dựng một hệ thống có thể làm tốt công việc đó một cách nhất quán, hiệu quả và bền vững.”';

const MP3_TOTAL_SECONDS = 308.66;

const AUDIO_CHAPTER_SPREADS = [
  {
    spread: 1,
    pagesLabel: 'Trang 1–2',
    title: '1. Chân Dung Sự Nghiệp & Nền Tảng Thiên Phủ',
    subtitle: 'Người Giữ Trụ Và Xây Nền · Năng Lực Tích Lũy & Quản Trị Nguồn Lực',
    startSec: 0,
    endSec: 62.52,
  },
  {
    spread: 2,
    pagesLabel: 'Trang 3–4',
    title: '2. Thiên Tướng & 3. Bình Tĩnh Khi Khủng Hoảng',
    subtitle: 'Chuẩn Mực Điều Phối · Tham Lang & Linh Tinh Ngòi Nổ Tên Lửa',
    startSec: 62.52,
    endSec: 131.12,
  },
  {
    spread: 3,
    pagesLabel: 'Trang 5–6',
    title: '4. Phong Cách Lãnh Đạo: Âm Thầm – Sâu – Chuẩn – Bền – Có Hậu',
    subtitle: '5 Từ Khóa Vận Hành & Cơ Chế Trao Quyền Hệ Thống',
    startSec: 131.12,
    endSec: 152.0,
  },
  {
    spread: 4,
    pagesLabel: 'Trang 7–8',
    title: '5. Thách Thức Ôm Việc & Chiến Lược Kiến Trúc Sư Trưởng',
    subtitle: '3 Vấn Đề Dài Hạn & 5 Bước Chuyển Đổi Sang Kiến Trúc Sư Trưởng',
    startSec: 152.0,
    endSec: 175.22,
  },
  {
    spread: 5,
    pagesLabel: 'Trang 9–10',
    title: '6. Chiến Lược Xây Dựng Đội Ngũ: Bổ Sung Thay Vì Đối Đầu',
    subtitle: 'Cánh Tay Phải (Thân 1992 · Thìn 1988) · Nhóm Điều Chỉnh (Ngọ 1990)',
    startSec: 175.22,
    endSec: 233.46,
  },
  {
    spread: 6,
    pagesLabel: 'Trang 11–12',
    title: '7. Định Hướng Nghề Nghiệp & Hệ Sinh Thái CSKH',
    subtitle: 'COO · Trưởng Phòng CSKH · CCO/CX · Cố Vấn Hệ Thống · Chuyển Đổi Số',
    startSec: 233.46,
    endSec: 264.84,
  },
  {
    spread: 7,
    pagesLabel: 'Trang 13–14',
    title: '8. Chiến Lược Phát Triển Dài Hạn (4 Định Hướng)',
    subtitle: 'Kiến Tạo Hệ Thống · Phát Triển Con Người · Công Nghệ · Nâng Tầm Quản Trị',
    startSec: 264.84,
    endSec: 286.0,
  },
  {
    spread: 8,
    pagesLabel: 'Trang 15–16',
    title: '9. Thông Điệp Kết Luận: Giá Trị Bền Vững',
    subtitle: 'Người Giữ Được Nền Tảng Sẽ Tạo Nên Giá Trị Bền Vững',
    startSec: 286.0,
    endSec: 9999,
  },
];

interface AudioSyncSegment {
  id: number;
  spread: number;
  page: number;
  timeRange: string;
  label: string;
  startSec: number;
  endSec: number;
}

const AUDIO_SYNC_SEGMENTS: AudioSyncSegment[] = [
  { id: 0, spread: 1, page: 1, timeRange: '00:00 – 00:38', label: '1. Chân dung sự nghiệp: Người giữ trụ và xây nền', startSec: 0, endSec: 38.84 },
  { id: 1, spread: 1, page: 2, timeRange: '00:38 – 01:02', label: '2. Nền tảng tư duy: Thiên Phủ – Năng lực tích lũy và quản trị nguồn lực', startSec: 38.84, endSec: 62.52 },
  { id: 2, spread: 2, page: 3, timeRange: '01:02 – 01:24', label: '2. Thiên Tướng – Chuẩn mực, uy tín và năng lực điều phối', startSec: 62.52, endSec: 84.22 },
  { id: 3, spread: 2, page: 4, timeRange: '01:24 – 02:11', label: '3. Năng lực đặc biệt: Bình tĩnh và tập trung khi khủng hoảng', startSec: 84.22, endSec: 131.12 },
  { id: 4, spread: 3, page: 5, timeRange: '02:11 – 02:27', label: '4. Phong cách lãnh đạo: Âm thầm – Sâu – Chuẩn – Bền – Có hậu', startSec: 131.12, endSec: 152.0 },
  { id: 5, spread: 4, page: 7, timeRange: '02:27 – 02:42', label: '5. Thách thức lớn nhất: Xu hướng ôm việc và tiêu chuẩn cá nhân quá cao', startSec: 152.0, endSec: 164.0 },
  { id: 6, spread: 4, page: 8, timeRange: '02:42 – 02:55', label: '5. Chiến lược chuyển đổi: Từ người thực hiện sang kiến trúc sư trưởng', startSec: 164.0, endSec: 175.22 },
  { id: 7, spread: 5, page: 9, timeRange: '02:55 – 03:25', label: '6. Nhóm cộng hưởng – Cánh tay phải (Tuổi Thân 1992 · Tuổi Thìn 1988)', startSec: 175.22, endSec: 205.76 },
  { id: 8, spread: 5, page: 10, timeRange: '03:25 – 03:53', label: '6. Nhóm cần điều chỉnh (Tuổi Ngọ 1990) & Nguyên tắc xây dựng đội ngũ', startSec: 205.76, endSec: 233.46 },
  { id: 9, spread: 6, page: 11, timeRange: '03:53 – 04:12', label: '7. Định hướng nghề nghiệp: 5 Vị trí phát huy thế mạnh', startSec: 233.46, endSec: 252.48 },
  { id: 10, spread: 6, page: 12, timeRange: '04:12 – 04:24', label: '7. Hệ sinh thái CSKH & Năng lực kiến tạo hệ thống vận hành', startSec: 252.48, endSec: 264.84 },
  { id: 11, spread: 7, page: 13, timeRange: '04:24 – 04:46', label: '8. Chiến lược phát triển dài hạn: Bốn định hướng cốt lõi', startSec: 264.84, endSec: 286.0 },
  { id: 12, spread: 8, page: 15, timeRange: '04:46 – 05:08', label: '9. Thông điệp kết luận: Người giữ được nền tảng sẽ tạo nên giá trị bền vững', startSec: 286.0, endSec: 309 },
];

const CORE_PROFILE_ITEMS = [
  {
    label: 'Ngày sinh dương lịch',
    value: '22/06/1984 (17:00)',
    meaning: 'Tứ trụ: Giáp Tý • Canh Ngọ • Quý Dậu',
  },
  {
    label: 'Ngày sinh âm lịch',
    value: '24/05/1984',
    meaning: 'Năm Giáp Tý • Tam Hợp Thân - Tý - Thìn',
  },
  {
    label: 'Giờ sinh & Nhịp điều phối',
    value: 'Giờ Quý Dậu (17h - 19h)',
    meaning: 'Tư duy tổng kết ca & tối ưu vận hành cuối ngày',
  },
  {
    label: 'Nạp âm & Thế sự nghiệp',
    value: 'Hải Trung Kim',
    meaning: 'Bản lĩnh kín đáo · Vững vàng trước bài toán lớn',
  },
];

/* ============================================================================
 * BỘ MÁY VẬT LÝ LẬT TRANG SÁCH
 * ============================================================================ */

const SINGLE_BELOW = 520;
const HIDDEN = Symbol('hidden');
const PEEK_ZONE = 64;
const PEEK_MAX = 34;
const TURN_CONFIG = { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const };
const SETTLE_CONFIG = { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };
const DRAG_SLOP = 4;

interface Point2D {
  x: number;
  y: number;
}

interface TurnState {
  dir: 1 | -1;
  corner: Point2D;
  at: Point2D;
}

interface PressState {
  start: Point2D;
  dragging: boolean;
  back?: boolean;
}

type ModalKind = 'taichi' | 'nguhanh' | 'batquai' | 'menhly' | null;

const sub = (a: Point2D, b: Point2D): Point2D => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: Point2D, b: Point2D): number => a.x * b.x + a.y * b.y;
const len = (a: Point2D): number => Math.hypot(a.x, a.y);
const lerp = (a: Point2D, b: Point2D, t: number): Point2D => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

function within(p: Point2D, center: Point2D, radius: number): Point2D {
  const d = sub(p, center);
  const l = len(d);
  if (l <= radius) return p;
  return {
    x: center.x + (d.x / l) * radius,
    y: center.y + (d.y / l) * radius,
  };
}

function clipPolygon(poly: Point2D[], m: Point2D, n: Point2D, keepNegative: boolean): Point2D[] {
  const side = (p: Point2D) => {
    const d = dot(sub(p, m), n);
    return keepNegative ? -d : d;
  };
  const out: Point2D[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = side(a);
    const db = side(b);
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      out.push(lerp(a, b, da / (da - db)));
    }
  }
  return out;
}

const toPolygonCss = (points: Point2D[], dx: number): string =>
  points.length
    ? `polygon(${points.map((p) => `${(p.x - dx).toFixed(2)}px ${p.y.toFixed(2)}px`).join(', ')})`
    : 'polygon(0 0)';

function foldStyles(turn: TurnState, w: number, h: number) {
  const x0 = turn.dir === 1 ? w : 0;
  const page: Point2D[] = [
    { x: x0, y: 0 },
    { x: x0 + w, y: 0 },
    { x: x0 + w, y: h },
    { x: x0, y: h },
  ];
  const d = sub(turn.at, turn.corner);
  const l = len(d);
  if (l < 0.5) return null;

  const n = { x: d.x / l, y: d.y / l };
  const m = lerp(turn.corner, turn.at, 0.5);
  const front = clipPolygon(page, m, n, false);
  const flap = clipPolygon(page, m, n, true);

  const a = 1 - 2 * n.x * n.x;
  const bc = -2 * n.x * n.y;
  const dd = 1 - 2 * n.y * n.y;
  const k = 2 * dot(m, n);
  const bx = k * n.x;
  const by = k * n.y;

  const e = a * x0 + bx - x0;
  const f = bc * x0 + by;

  return {
    front: { clipPath: toPolygonCss(front, x0) },
    flap: {
      clipPath: toPolygonCss(flap, x0),
      transform: `matrix(${a}, ${bc}, ${bc}, ${dd}, ${e}, ${f})`,
    },
    progress: Math.min(1, l / (2 * w)),
  };
}

type PageSlot = React.ReactNode | typeof HIDDEN | null | undefined;

function twoPages(pages: React.ReactNode[], spread: number, dir?: 1 | -1) {
  const leftOf = (s: number) => (s > 0 ? pages[2 * s - 1] : undefined);
  const rightOf = (s: number) => pages[2 * s];
  if (!dir) {
    return { left: leftOf(spread), right: rightOf(spread) };
  }
  const target = spread + dir;
  return dir === 1
    ? {
        left: leftOf(spread),
        right: rightOf(target),
        turning: rightOf(spread),
        back: leftOf(target),
      }
    : {
        left: leftOf(target),
        right: rightOf(spread),
        turning: leftOf(spread),
        back: rightOf(target),
      };
}

function onePage(
  pages: React.ReactNode[],
  page: number,
  dir?: 1 | -1
): { left?: PageSlot; right?: PageSlot; turning?: PageSlot; back?: PageSlot } {
  if (dir === 1) {
    return { right: pages[page + 1], turning: pages[page], back: null };
  }
  if (dir === -1) {
    return { right: pages[page], back: pages[page - 1] ?? HIDDEN };
  }
  return { right: pages[page] };
}

function centerShift({ left, right }: { left?: PageSlot; right?: PageSlot }): number {
  if (left === undefined) return -0.25;
  return right === undefined ? 0.25 : 0;
}

function createCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2Est = sampleCurveX(t2) - x;
      if (Math.abs(x2Est) < 1e-6) return sampleCurveY(t2);
      const d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 -= x2Est / d2;
    }
    let t0 = 0;
    let t1 = 1;
    t2 = x;
    while (t0 < t1) {
      const x2Est = sampleCurveX(t2);
      if (Math.abs(x2Est - x) < 1e-6) return sampleCurveY(t2);
      if (x > x2Est) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return sampleCurveY(t2);
  };
}

function animateProgress(
  fromVal: number,
  toVal: number,
  {
    duration,
    ease,
    onUpdate,
    onComplete,
  }: {
    duration: number;
    ease: readonly [number, number, number, number];
    onUpdate?: (val: number) => void;
    onComplete?: () => void;
  }
) {
  const easeFn = createCubicBezier(ease[0], ease[1], ease[2], ease[3]);
  const startTime = performance.now();
  const durationMs = duration * 1000;
  let rafId: number | null = null;
  let stopped = false;

  const tick = (now: number) => {
    if (stopped) return;
    const elapsed = now - startTime;
    const rawT = Math.min(1, Math.max(0, elapsed / durationMs));
    const easedT = easeFn(rawT);
    const val = fromVal + (toVal - fromVal) * easedT;
    onUpdate?.(val);
    if (rawT < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(tick);
  return {
    stop: () => {
      stopped = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    },
  };
}

function Paper({
  side,
  back = false,
  style,
  isCoverFront = false,
  children,
}: {
  side: 'left' | 'right';
  back?: boolean;
  style?: React.CSSProperties;
  isCoverFront?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`pf-paper ${back ? 'pf-paper-back' : 'pf-paper-front'} ${
        side === 'left' ? 'pf-side-left' : 'pf-side-right'
      } ${isCoverFront ? 'pf-cover-surface' : ''}`}
      style={style}
    >
      <div className={back ? 'pf-back-mirror' : 'pf-front-inner'}>{children}</div>
      <span
        aria-hidden="true"
        className={`pf-gutter ${side === 'left' ? 'pf-gutter-left' : 'pf-gutter-right'}`}
      />
    </div>
  );
}

interface TalismanPageFlipHandle {
  openBook: () => void;
  closeBook: () => void;
  goToSpread: (targetSpread: number) => void;
  nextSpread: () => void;
  prevSpread: () => void;
  getSpread: () => number;
  getTargetSpread: () => number;
}

interface TalismanPageFlipProps {
  pages: React.ReactNode[];
  onSpreadChange?: (nextSpread: number) => void;
  onWillOpenBook?: () => void;
  onInteractionStateChange?: (interacting: boolean) => void;
}

const TalismanPageFlip = forwardRef<TalismanPageFlipHandle, TalismanPageFlipProps>(
  function TalismanPageFlip(
    { pages, onSpreadChange, onWillOpenBook, onInteractionStateChange },
    ref
  ) {
    const frameRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 340, h: 500 });
    const [single, setSingle] = useState(false);
    const singleRef = useRef(false);
    const [spread, setSpread] = useState(0);
    const [turn, setTurn] = useState<TurnState | null>(null);
    const [heading, setHeading] = useState<number | null>(null);

    const turnRef = useRef<TurnState | null>(null);
    const pressRef = useRef<PressState | null>(null);
    const animRef = useRef<{ stop: () => void } | null>(null);
    const playingRef = useRef(false);
    const committingRef = useRef(false);
    const wheelLockRef = useRef(false);
    const onSpreadChangeRef = useRef(onSpreadChange);
    onSpreadChangeRef.current = onSpreadChange;
    const onWillOpenBookRef = useRef(onWillOpenBook);
    onWillOpenBookRef.current = onWillOpenBook;

    const spreads = single ? pages.length : Math.floor(pages.length / 2) + 1;

    useLayoutEffect(() => {
      const book = bookRef.current;
      const frame = frameRef.current;
      if (!(book && frame)) return;
      const measure = () => {
        const narrow = window.innerWidth < SINGLE_BELOW;
        if (narrow !== singleRef.current) {
          singleRef.current = narrow;
          setSingle(narrow);
          setSpread((s) => (narrow ? Math.max(0, 2 * s - 1) : Math.ceil(s / 2)));
        }
        if (book.clientWidth && book.clientHeight) {
          setSize({ w: book.clientWidth / 2, h: book.clientHeight });
        }
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(frame);
      observer.observe(book);
      window.addEventListener('resize', measure);
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', measure);
      };
    }, []);

    useEffect(() => () => animRef.current?.stop(), []);

    const stop = useCallback(() => {
      animRef.current?.stop();
      playingRef.current = false;
    }, []);

    const setAt = useCallback(
      (next: TurnState | null) => {
        turnRef.current = next;
        setTurn(next);
        onInteractionStateChange?.(Boolean(next));
      },
      [onInteractionStateChange]
    );

    const reach = useCallback(
      (p: Point2D, corner: Point2D) => {
        const { w, h } = size;
        const spineSame = { x: w, y: corner.y };
        const spineOther = { x: w, y: corner.y === 0 ? h : 0 };
        return within(within(p, spineSame, w), spineOther, Math.hypot(w, h));
      },
      [size]
    );

    const cornerFor = useCallback(
      (dir: 1 | -1, y: number): Point2D => ({
        x: dir === 1 ? 2 * size.w : 0,
        y: y < size.h / 2 ? 0 : size.h,
      }),
      [size.h, size.w]
    );

    const run = useCallback(
      (fromState: TurnState, toPoint: Point2D, complete: boolean) => {
        stop();
        const start = fromState.at;
        const lift = complete ? size.h * 0.14 * (fromState.corner.y === 0 ? 1 : -1) : 0;
        playingRef.current = true;
        committingRef.current = complete;
        const nextSpread = spread + fromState.dir;
        if (complete) {
          setHeading(nextSpread);
          if (spread === 0 && nextSpread > 0) {
            onWillOpenBookRef.current?.();
          }
        }
        const config = complete ? TURN_CONFIG : SETTLE_CONFIG;
        animRef.current = animateProgress(0, 1, {
          ...config,
          onUpdate: (t) => {
            const p = lerp(start, toPoint, t);
            setAt({
              ...fromState,
              at: { x: p.x, y: p.y + Math.sin(Math.PI * t) * lift },
            });
          },
          onComplete: () => {
            playingRef.current = false;
            committingRef.current = false;
            setAt(null);
            setHeading(null);
            if (complete) {
              setSpread(nextSpread);
              onSpreadChangeRef.current?.(nextSpread);
            }
          },
        });
      },
      [spread, setAt, size.h, stop]
    );

    const canTurn = useCallback(
      (dir: 1 | -1) => (dir === 1 ? spread < spreads - 1 : spread > 0),
      [spread, spreads]
    );

    const go = useCallback(
      (dir: 1 | -1, preferredY?: number) => {
        if (!(canTurn(dir) && size.w) || committingRef.current) return;
        const yPos = preferredY !== undefined ? preferredY : size.h;
        const corner = cornerFor(dir, yPos);
        run(
          { dir, corner, at: { x: corner.x - dir * 1, y: corner.y === 0 ? 1 : corner.y - 1 } },
          { x: corner.x - dir * 2 * size.w, y: corner.y },
          true
        );
      },
      [canTurn, cornerFor, run, size.h, size.w]
    );

    useImperativeHandle(
      ref,
      () => ({
        openBook: () => {
          if (spread === 0) go(1, size.h * 0.85);
        },
        closeBook: () => {
          if (spread > 0 || committingRef.current) {
            stop();
            committingRef.current = false;
            setAt(null);
            setHeading(null);
            setSpread(0);
            onSpreadChangeRef.current?.(0);
          }
        },
        goToSpread: (targetSpread: number) => {
          const mapped = single ? Math.max(0, 2 * targetSpread - 1) : targetSpread;
          const clamped = Math.max(0, Math.min(spreads - 1, mapped));
          if (clamped === spread) return;
          if (spread === 0 && clamped > 0) {
            onWillOpenBookRef.current?.();
          }
          if (Math.abs(clamped - spread) === 1 && !committingRef.current && size.w) {
            go(clamped > spread ? 1 : -1, size.h * 0.85);
          } else {
            stop();
            committingRef.current = false;
            setAt(null);
            setHeading(null);
            setSpread(clamped);
            onSpreadChangeRef.current?.(clamped);
          }
        },
        nextSpread: () => go(1, size.h * 0.85),
        prevSpread: () => go(-1, size.h * 0.85),
        getSpread: () => (single ? Math.ceil(spread / 2) : spread),
        getTargetSpread: () => {
          const active = heading !== null ? heading : spread;
          return single ? Math.ceil(active / 2) : active;
        },
      }),
      [go, heading, single, size.h, size.w, spread, spreads, stop, setAt]
    );

    const localPoint = (event: React.PointerEvent<HTMLDivElement>): Point2D => {
      const book = bookRef.current;
      const rect = book?.getBoundingClientRect();
      const k = book && rect && book.offsetWidth ? rect.width / book.offsetWidth : 1;
      return rect
        ? { x: (event.clientX - rect.left) / k, y: (event.clientY - rect.top) / k }
        : { x: 0, y: 0 };
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !size.w || committingRef.current) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, label, [data-sync-segment]')) {
        return;
      }
      const p = localPoint(event);
      const backZone = single && p.x < size.w * 1.3;
      const dir: 1 | -1 = p.x >= size.w && !backZone ? 1 : -1;
      if (!canTurn(dir)) return;

      stop();
      event.currentTarget.setPointerCapture(event.pointerId);
      if (single && dir === -1) {
        pressRef.current = { start: p, dragging: false, back: true };
        return;
      }
      pressRef.current = { start: p, dragging: false };

      const current = turnRef.current;
      const corner = current?.dir === dir ? current.corner : cornerFor(dir, p.y);
      setAt({ dir, corner, at: current?.dir === dir ? current.at : corner });
    };

    const peek = (p: Point2D) => {
      const dir: 1 | -1 = p.x >= size.w ? 1 : -1;
      const corner = cornerFor(dir, p.y);
      const near = canTurn(dir) && len(sub(p, corner)) < PEEK_ZONE;
      const current = turnRef.current;
      if (!near) {
        if (current) {
          run(current, current.corner, false);
        }
        return;
      }
      stop();
      const toward = sub(p, corner);
      const l = Math.max(1, len(toward));
      const lift = Math.min(PEEK_MAX, l * 0.6 + 14);
      setAt({
        dir,
        corner,
        at: reach(
          {
            x: corner.x + (toward.x / l) * lift,
            y: corner.y + (toward.y / l) * lift,
          },
          corner
        ),
      });
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const p = localPoint(event);
      const press = pressRef.current;
      const current = turnRef.current;
      if (press?.back) {
        press.dragging ||= len(sub(p, press.start)) >= DRAG_SLOP;
        return;
      }
      if (press && current) {
        if (!press.dragging && len(sub(p, press.start)) < DRAG_SLOP) {
          return;
        }
        press.dragging = true;
        setAt({ ...current, at: reach(p, current.corner) });
        return;
      }
      if (event.pointerType === 'mouse' && !playingRef.current) {
        peek(p);
      }
    };

    const onPointerUp = () => {
      const press = pressRef.current;
      const current = turnRef.current;
      pressRef.current = null;
      if (press?.back) {
        if (!press.dragging) {
          go(-1, size.h * 0.85);
        }
        return;
      }
      if (!(press && current)) return;

      const crossed = current.dir === 1 ? current.at.x < size.w : current.at.x > size.w;
      const complete = press.dragging ? crossed : true;
      run(
        current,
        complete
          ? { x: current.corner.x - current.dir * 2 * size.w, y: current.corner.y }
          : current.corner,
        complete
      );
    };

    const onWheelTurn = (event: React.WheelEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.inner-scroll-body')) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 12) return;
      if (wheelLockRef.current || committingRef.current || !size.w) return;

      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      if (!canTurn(dir)) return;

      wheelLockRef.current = true;
      go(dir, size.h * 0.85);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 520);
    };

    const onPointerLeave = () => {
      const current = turnRef.current;
      if (!pressRef.current && current && !playingRef.current) {
        run(current, current.corner, false);
      }
    };

    useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('input, textarea')) return;
        if (e.key === 'ArrowRight') {
          go(1, size.h * 0.85);
        } else if (e.key === 'ArrowLeft') {
          go(-1, size.h * 0.85);
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, [go, size.h]);

    const fold = turn && size.w ? foldStyles(turn, size.w, size.h) : null;
    const { left, right, turning, back } = single
      ? onePage(pages, spread, turn?.dir)
      : twoPages(pages, spread, turn?.dir);
    const shift = single ? 0 : centerShift(twoPages(pages, heading ?? spread));

    const lastIdx = pages.length - 1;
    const isCoverIndex = (idx: number) => idx === 0 || idx === lastIdx;

    const rightPageIdx = single
      ? turn?.dir === 1
        ? spread + 1
        : spread
      : turn?.dir === 1
      ? 2 * (spread + 1)
      : 2 * spread;
    const turningPageIdx = single
      ? spread
      : turn?.dir === 1
      ? 2 * spread
      : 2 * spread - 1;
    const backPageIdx = single
      ? spread - 1
      : turn?.dir === 1
      ? 2 * (spread + 1) - 1
      : 2 * (spread - 1);

    const isCoverOnRight = isCoverIndex(rightPageIdx);
    const isCoverTurning = Boolean(turn && isCoverIndex(turningPageIdx));
    const isCoverOnFlap = Boolean(turn && isCoverIndex(backPageIdx));

    return (
      <div className="pf-frame" ref={frameRef}>
        <div
          className={`pf-slider ${single ? 'is-single-mode' : ''}`}
          style={{ transform: `translateX(${single ? -50 : shift * 100}%)` }}
        >
          <div
            className="pf-book"
            ref={bookRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerLeave}
            onWheel={onWheelTurn}
          >
            {left !== undefined && left !== null && left !== HIDDEN && (
              <Paper side="left">{left}</Paper>
            )}

            {right !== undefined && right !== null && right !== HIDDEN && (
              <Paper side="right" isCoverFront={isCoverOnRight}>
                {right}
              </Paper>
            )}

            {turn && fold && turning !== undefined && turning !== null && turning !== HIDDEN && (
              <Paper
                side={turn.dir === 1 ? 'right' : 'left'}
                style={fold.front}
                isCoverFront={isCoverTurning}
              >
                {turning}
              </Paper>
            )}
            {turn && !fold && turning !== undefined && turning !== null && turning !== HIDDEN && (
              <Paper
                side={turn.dir === 1 ? 'right' : 'left'}
                isCoverFront={isCoverTurning}
              >
                {turning}
              </Paper>
            )}

            {turn && fold && back !== undefined && back !== null && back !== HIDDEN && (
              <div
                className="pf-flap-shadow"
                style={{
                  filter: `drop-shadow(0 ${2 + fold.progress * 6}px ${
                    6 + fold.progress * 10
                  }px rgba(0, 0, 0, ${0.24 + (1 - fold.progress) * 0.22}))`,
                }}
              >
                <Paper
                  back
                  side={turn.dir === 1 ? 'right' : 'left'}
                  style={fold.flap}
                  isCoverFront={isCoverOnFlap}
                >
                  {back}
                </Paper>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

/* ============================================================================
 * CÁC THÀNH PHẦN ĐỒ HỌA BÁT QUÁI & NỘI DUNG TỬ VI (GIỮ NGUYÊN 100% DATA)
 * ============================================================================ */

function BaguaDefs() {
  return (
    <svg className="nat-defs" aria-hidden="true">
      <defs>
        <g id="q-can" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-khon" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" />
          <line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" />
          <line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" />
          <line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-kham" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" />
          <line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" />
          <line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-ly" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" />
          <line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-chan" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" />
          <line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" />
          <line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-ton" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" />
          <line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-can2" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" />
          <line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" />
          <line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-doai" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" />
          <line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <path
          id="nat-scritta"
          d="M310 310 m-282 0 a282 282 0 1 1 564 0 a282 282 0 1 1 -564 0"
        />
      </defs>
    </svg>
  );
}

function CompassBackdrop() {
  return (
    <div className="nat-cerchio">
      <BaguaDefs />
      <svg className="nat-strato" viewBox="0 0 620 620" aria-hidden="true">
        <g fill="none" style={{ stroke: 'var(--nat-incisione)' }} opacity=".75">
          <g className="nat-anello nat-a2">
            <text
              fontSize="11"
              fontWeight="700"
              stroke="none"
              fontFamily="'Play', sans-serif"
              style={{ fill: 'var(--nat-incisione)' }}
            >
              <textPath href="#nat-scritta" textLength="1765" lengthAdjust="spacing">
                ☯ Càn · Khảm · Cấn · Chấn · Tốn · Ly · Khôn · Đoài ☯ Tý · Sửu · Dần · Mão · Thìn · Tỵ · Ngọ · Mùi · Thân · Dậu · Tuất · Hợi ☯ Hải Trung Kim · Song Ngư Âm Dương ☯
              </textPath>
            </text>
            <circle cx="310" cy="310" r="270" strokeWidth="1" />
            <circle cx="310" cy="310" r="295" strokeWidth="0.6" strokeDasharray="3 5" />
          </g>

          <g className="nat-anello nat-a3">
            <circle cx="310" cy="310" r="245" strokeWidth="0.8" />
            <circle cx="310" cy="310" r="215" strokeWidth="0.8" />
            <use href="#q-ly" transform="translate(310, 80) rotate(0)" />
            <use href="#q-khon" transform="translate(472, 148) rotate(45)" />
            <use href="#q-doai" transform="translate(540, 310) rotate(90)" />
            <use href="#q-can" transform="translate(472, 472) rotate(135)" />
            <use href="#q-kham" transform="translate(310, 540) rotate(180)" />
            <use href="#q-can2" transform="translate(148, 472) rotate(225)" />
            <use href="#q-chan" transform="translate(80, 310) rotate(270)" />
            <use href="#q-ton" transform="translate(148, 148) rotate(315)" />
          </g>

          <g className="nat-anello nat-a4" strokeWidth="0.8">
            <circle cx="310" cy="310" r="190" strokeDasharray="4 4" />
            <text transform="translate(310, 134)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Hưu</text>
            <text transform="translate(434, 186) rotate(45)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Sinh</text>
            <text transform="translate(486, 310) rotate(90)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Thương</text>
            <text transform="translate(434, 434) rotate(135)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Đỗ</text>
            <text transform="translate(310, 486) rotate(180)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Cảnh</text>
            <text transform="translate(186, 434) rotate(225)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Tử</text>
            <text transform="translate(134, 310) rotate(270)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Kinh</text>
            <text transform="translate(186, 186) rotate(315)" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" style={{ fill: 'var(--nat-incisione)' }}>Khai</text>
          </g>

          <g className="nat-anello nat-a5" strokeWidth="0.9">
            <polygon points="310,150 423,197 470,310 423,423 310,470 197,423 150,310 197,197" />
            <polygon points="310,150 470,310 310,470 150,310" opacity="0.5" />
            <polygon points="423,197 423,423 197,423 197,197" opacity="0.5" />
            <circle cx="310" cy="310" r="150" />
          </g>
        </g>

        <g className="nat-brilla" fill="none">
          <g className="nat-anello nat-a3">
            <use href="#q-ly" transform="translate(310, 80) rotate(0)" />
            <use href="#q-can" transform="translate(472, 472) rotate(135)" />
            <use href="#q-kham" transform="translate(310, 540) rotate(180)" />
            <use href="#q-chan" transform="translate(80, 310) rotate(270)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function BookModal({
  activeModal,
  onClose,
  isDark,
}: {
  activeModal: ModalKind;
  onClose: () => void;
  isDark: boolean;
}) {
  const [showKhauQuyet, setShowKhauQuyet] = useState(false);

  useEffect(() => {
    setShowKhauQuyet(false);
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`tuvi-app-root tuvi-modal-host ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="nws-modal is-open" role="dialog" aria-modal="true">
        <div className="nws-backdrop" onClick={onClose} />
        <div className="nws-window">
          <button type="button" className="nws-close" onClick={onClose} aria-label="Đóng cửa sổ">
            ×
          </button>

          {activeModal === 'taichi' && (
            <div className="nlg">
              <div className="nlg-visual-box">
                <svg width="130" height="130" viewBox="0 0 120 120" className="spin-slow">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="var(--nat-vang)" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M60 8 A52 52 0 0 1 60 112 A26 26 0 0 1 60 60 A26 26 0 0 0 60 8 Z" style={{ fill: 'var(--yang-fill)' }} />
                  <path d="M60 8 A52 52 0 0 0 60 112 A26 26 0 0 1 60 60 A26 26 0 0 0 60 8 Z" style={{ fill: 'var(--yin-fill)' }} stroke="var(--nat-vang)" strokeWidth="1" />
                  <circle cx="60" cy="34" r="6.5" style={{ fill: 'var(--yin-fill)' }} />
                  <circle cx="60" cy="86" r="6.5" style={{ fill: 'var(--yang-fill)' }} />
                  <path d="M44 26 Q32 36 38 48" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M76 94 Q88 84 82 72" fill="none" style={{ stroke: 'var(--yang-fill)' }} strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="nlg-title">Thái Cực Đồ</h3>
              <p className="nlg-sub">Song Ngư Giao Hòa · Tam Hợp Thân - Tý - Thìn</p>
              <p className="nlg-text">
                Hình tượng <b>Song Ngư Âm Dương</b> biểu trưng cho sự cân bằng giữa hai thái cực trong vũ trụ. Với đương số <b>Nguyễn Hùng Thái</b> sinh năm Giáp Tý (1984), bộ <b>Tam Hợp Thân - Tý - Thìn</b> kết hợp cùng <b>Kim Tứ Cục (Số 4)</b> tạo nên tư duy kiến trúc hệ thống chặt chẽ và kỷ luật chuẩn hóa.
                <br /><br />
                Trên lá số Tử Vi, cách cục <b>Dương Nam</b> giúp đại vận đi thuận chiều, biểu thị khí chất chủ động, dám nghĩ dám làm và dẫn dắt tổ chức bằng dữ liệu thực chứng.
              </p>
              <div className="nlg-more">
                <button
                  type="button"
                  className="khau-quyet-btn"
                  onClick={() => setShowKhauQuyet((prev) => !prev)}
                  title="Xem châm ngôn lãnh đạo"
                >
                  <div className="book-seal" style={{ margin: '0 auto', width: 92 }}>Kim Chỉ Nam</div>
                </button>
                {showKhauQuyet && (
                  <div className="nlg-more-box">
                    <p className="nlg-text" style={{ color: 'var(--nat-chu-sa)', fontWeight: 700, height: 'auto' }}>
                      {HERO_MOTTO}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModal === 'nguhanh' && (
            <div className="nlg nlg-plain">
              <div className="nlg-visual-box">
                <svg width="145" height="145" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="65" fill="none" stroke="var(--book-border)" strokeWidth="1" />
                  <polygon points="80,22 115,126 26,61 134,61 45,126" fill="none" stroke="var(--nat-chu-sa)" strokeWidth="1" opacity="0.8" />
                  <g fontFamily="'Play', sans-serif" fontWeight="700" fontSize="10" textAnchor="middle" dominantBaseline="central">
                    <circle cx="80" cy="22" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#d94e3f" strokeWidth="1.4" />
                    <text x="80" y="22" style={{ fill: 'var(--nat-chiaro)' }}>Hỏa</text>
                    <circle cx="134" cy="61" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#d4a853" strokeWidth="1.4" />
                    <text x="134" y="61" style={{ fill: 'var(--nat-chiaro)' }}>Thổ</text>
                    <circle cx="115" cy="126" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#9e6b1b" strokeWidth="1.8" />
                    <text x="115" y="126" style={{ fill: 'var(--nat-chu-sa)' }}>Kim</text>
                    <circle cx="45" cy="126" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#2b7a9e" strokeWidth="1.4" />
                    <text x="45" y="126" style={{ fill: 'var(--nat-chiaro)' }}>Thủy</text>
                    <circle cx="26" cy="61" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#3d8c52" strokeWidth="1.4" />
                    <text x="26" y="61" style={{ fill: 'var(--nat-chiaro)' }}>Mộc</text>
                  </g>
                </svg>
              </div>
              <h3 className="nlg-title">Ngũ Hành Bản Mệnh</h3>
              <p className="nlg-sub">Hải Trung Kim · Kim Tứ Cục (Số 4)</p>
              <p className="nlg-text">
                Tuổi <b>Giáp Tý 1984</b> nạp âm là <b>Hải Trung Kim</b> (Vàng trong biển lớn) — bản lĩnh kín đáo, vững vàng trước bài toán lớn và giữ trọn chữ tín dưới áp lực cao.
                <br /><br />
                <b>Ngũ Hành Vận Hành Hợp Nhất:</b> Kim giữ chuẩn mực (SOP/SLA/QA), Thủy tăng tốc độ công nghệ (CRM/AI/BI), Mộc nuôi dưỡng kế thừa (Coaching), Hỏa giữ nhịp trải nghiệm (FCR/CX), Thổ bảo toàn chi phí & nền tảng (BCP).
              </p>
            </div>
          )}

          {activeModal === 'batquai' && (
            <div className="nlg nlg-plain">
              <h3 className="nlg-title" style={{ marginTop: 10 }}>Bát Quái Đồ</h3>
              <p className="nlg-sub">Đoài Kim · 4 Hướng Cát Khí Tây Tứ Mệnh</p>
              <div className="nlg-gallery">
                {BAGUA_LIST.map((item) => (
                  <div className="bagua-cell" key={item.name}>
                    <span className="bagua-glyph">{item.glyph}</span>
                    <span className="bagua-name">{item.name}</span>
                    <span className="bagua-elem">{item.elem}</span>
                  </div>
                ))}
              </div>
              <p className="nlg-text" style={{ height: 'auto', marginTop: 12, textAlign: 'left' }}>
                Cung mệnh la bàn <b>Đoài Kim (Tây Tứ Mệnh)</b> với 4 hướng cát khí: <b>Tây Bắc 315° (Sinh Khí — Đại Cát)</b>, <b>Tây Nam 225° (Thiên Y — Thượng Cát)</b>, <b>Đông Bắc 45° (Diên Niên — Thượng Cát)</b> và <b>Tây 270° (Phục Vị — Trung Cát)</b>.
              </p>
            </div>
          )}

          {activeModal === 'menhly' && (
            <div className="nlg nlg-plain">
              <div className="nlg-visual-box">
                <svg width="145" height="145" viewBox="0 0 140 140">
                  <rect x="6" y="6" width="128" height="128" fill="none" stroke="var(--nat-vang)" strokeWidth="1.3" />
                  <rect x="38" y="38" width="64" height="64" fill="rgba(184,139,70,0.08)" stroke="var(--nat-vang)" strokeWidth="0.9" />
                  <line x1="38" y1="6" x2="38" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="102" y1="6" x2="102" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="6" y1="38" x2="134" y2="38" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="6" y1="102" x2="134" y2="102" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="70" y1="6" x2="70" y2="38" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="70" y1="102" x2="70" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="6" y1="70" x2="38" y2="70" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <line x1="102" y1="70" x2="134" y2="70" stroke="var(--nat-vang)" strokeWidth="0.7" />
                  <text x="70" y="65" textAnchor="middle" fontFamily="'Play', sans-serif" fontWeight="700" fontSize="11" fill="var(--nat-vang-sang)">Quan Lộc</text>
                  <text x="70" y="81" textAnchor="middle" fontFamily="'Play', sans-serif" fontWeight="700" fontSize="8.5" fill="var(--nat-chu-sa)">17h00 · Quý Dậu</text>
                </svg>
              </div>
              <h3 className="nlg-title">Mệnh Lý Sự Nghiệp 1984</h3>
              <p className="nlg-sub">Nguyễn Hùng Thái · Giờ Quý Dậu (17h–19h)</p>
              <p className="nlg-text">
                <b>Thông tin lá số:</b> Dương lịch <b>22/06/1984 (17:00)</b> · Âm lịch <b>24/05/1984</b> · Tứ trụ: <b>Giáp Tý • Canh Ngọ • Quý Dậu</b>.
                <br /><br />
                <b>Định vị sự nghiệp:</b> Phát huy cao nhất ở vai trò chuẩn hóa vận hành (SOP/SLA/QA), điều phối liên phòng ban và chuyển đổi số dịch vụ CSKH, CRM, AI tự động hóa đa kênh.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export interface TuViBookCardProps {
  isDark?: boolean;
  fitToHeight?: boolean;
  isActive?: boolean;
  onBookOpenChange?: (isOpen: boolean) => void;
  onMp3PlayingChange?: (isPlaying: boolean) => void;
  closeSignal?: number;
}

export default function TuViBookCard({
  isDark,
  isActive = true,
  onBookOpenChange,
  onMp3PlayingChange,
  closeSignal = 0,
}: TuViBookCardProps) {
  const [docIsDark, setDocIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );
  const effectiveDark = typeof isDark === 'boolean' ? isDark : docIsDark;

  const [spread, setSpread] = useState(0);
  const [isPeekingOrTurning, setIsPeekingOrTurning] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [scale, setScale] = useState(0.5);

  const [mp3Duration, setMp3Duration] = useState(MP3_TOTAL_SECONDS);
  const [mp3CurrentTime, setMp3CurrentTime] = useState(0);
  const [isMp3Playing, setIsMp3Playing] = useState(false);

  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bookAudioRef = useRef<HTMLAudioElement | null>(null);
  const pageFlipRef = useRef<TalismanPageFlipHandle>(null);
  const isSeekingFromFlipRef = useRef(false);
  const prevSpreadRef = useRef(0);
  const onBookOpenChangeRef = useRef(onBookOpenChange);
  onBookOpenChangeRef.current = onBookOpenChange;
  const onMp3PlayingChangeRef = useRef(onMp3PlayingChange);
  onMp3PlayingChangeRef.current = onMp3PlayingChange;

  const isBookOpen = spread > 0;

  useEffect(() => {
    onMp3PlayingChangeRef.current?.(isMp3Playing);
  }, [isMp3Playing]);

  // Đồng bộ tự động Light / Dark từ tài liệu gốc
  useEffect(() => {
    if (typeof isDark === 'boolean' || typeof document === 'undefined') return;
    const checkDark = () => {
      setDocIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, [isDark]);

  // Tự động co giãn sân khấu theo đúng diện tích thực tế của card 6 (đóng = gọn theo nội dung, mở/phát mp3 = bung rộng)
  useEffect(() => {
    const updateScale = () => {
      const container = stageWrapperRef.current;
      if (!container) return;
      const availW = Math.max(200, container.clientWidth - 8);
      const rawH = container.clientHeight;
      const availH = rawH > 120 ? Math.max(220, rawH - (isBookOpen ? 10 : 42)) : 460;
      const baseW = isBookOpen ? 1140 : 620;
      const baseH = isBookOpen ? 780 : 750;
      const nextScale = Math.min(1, availW / baseW, availH / baseH);
      setScale(Math.max(0.2, nextScale));
    };
    updateScale();
    const rafId = requestAnimationFrame(updateScale);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && stageWrapperRef.current) {
      observer = new ResizeObserver(updateScale);
      observer.observe(stageWrapperRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [isBookOpen, isMp3Playing]);

  const playZenChime = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const pentatonic = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // Ignore Web Audio restriction
    }
  }, []);

  const playBookOpenSound = useCallback(
    (seekSeconds?: number) => {
      const audio = bookAudioRef.current;
      if (!audio) return;
      try {
        stopActiveSpeech();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }

        const effectiveDuration =
          Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : MP3_TOTAL_SECONDS;

        if (typeof seekSeconds === 'number' && seekSeconds >= 0) {
          isSeekingFromFlipRef.current = true;
          const clampedTime = Math.max(0, Math.min(effectiveDuration - 0.05, seekSeconds));
          audio.currentTime = clampedTime;
          setMp3CurrentTime(clampedTime);
          setTimeout(() => {
            isSeekingFromFlipRef.current = false;
          }, 350);
        } else if (audio.currentTime >= effectiveDuration - 0.15) {
          audio.currentTime = 0;
          setMp3CurrentTime(0);
        }

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(() => setIsMp3Playing(true))
            .catch(() => {
              playZenChime();
            });
        } else {
          setIsMp3Playing(true);
        }
      } catch {
        playZenChime();
      }
    },
    [playZenChime]
  );

  const stopBookSound = useCallback(() => {
    const audio = bookAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setMp3CurrentTime(0);
    setIsMp3Playing(false);
  }, []);

  // Phát âm thanh ngay lập tức & báo bung rộng thẻ khi bấm mở sách
  const handleWillOpenBook = useCallback(() => {
    onBookOpenChangeRef.current?.(true);
    playBookOpenSound(0);
  }, [playBookOpenSound]);

  // Đóng sách từ bên ngoài (nút Đóng sách trên header thẻ hoặc chuyển slide)
  useEffect(() => {
    if (closeSignal > 0) {
      pageFlipRef.current?.closeBook();
      stopBookSound();
      setActiveModal(null);
      onBookOpenChangeRef.current?.(false);
    }
  }, [closeSignal, stopBookSound]);

  // Dừng âm thanh khi người dùng rời khỏi slide 0
  useEffect(() => {
    if (!isActive) {
      stopBookSound();
      setActiveModal(null);
    }
  }, [isActive, stopBookSound]);

  // Clean up audio & context on unmount
  useEffect(() => {
    const audio = bookAudioRef.current;
    const ctx = audioCtxRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (ctx && ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  const handleSpreadChange = useCallback(
    (nextSpread: number) => {
      prevSpreadRef.current = nextSpread;
      setSpread(nextSpread);

      if (nextSpread === 0) {
        stopBookSound();
        onBookOpenChangeRef.current?.(false);
        return;
      }

      onBookOpenChangeRef.current?.(true);

      const audio = bookAudioRef.current;
      const targetChapter = AUDIO_CHAPTER_SPREADS.find((c) => c.spread === nextSpread);
      if (audio && targetChapter) {
        const curSec = audio.currentTime || 0;
        const alreadyInChapter =
          curSec >= targetChapter.startSec && curSec < targetChapter.endSec;
        if (!alreadyInChapter && !audio.paused) {
          playBookOpenSound(targetChapter.startSec);
        }
      }
    },
    [playBookOpenSound, stopBookSound]
  );

  const handleAudioTimeUpdate = useCallback(() => {
    const audio = bookAudioRef.current;
    if (!audio) return;
    const curSec = audio.currentTime;
    setMp3CurrentTime(curSec);
    if (isSeekingFromFlipRef.current || audio.paused) return;

    const matchedChapter =
      AUDIO_CHAPTER_SPREADS.find((c) => curSec >= c.startSec && curSec < c.endSec) ||
      AUDIO_CHAPTER_SPREADS[AUDIO_CHAPTER_SPREADS.length - 1];

    if (!matchedChapter) return;

    if (pageFlipRef.current?.getSpread() === 0) {
      pageFlipRef.current?.goToSpread(matchedChapter.spread);
      return;
    }

    const currentOrHeadingSpread = pageFlipRef.current?.getTargetSpread() ?? spread;
    if (currentOrHeadingSpread !== matchedChapter.spread) {
      pageFlipRef.current?.goToSpread(matchedChapter.spread);
    }
  }, [spread]);

  const activeSegment =
    isMp3Playing || mp3CurrentTime > 0
      ? AUDIO_SYNC_SEGMENTS.find(
          (seg) => mp3CurrentTime >= seg.startSec && mp3CurrentTime < seg.endSec
        ) || AUDIO_SYNC_SEGMENTS[0]
      : null;

  useEffect(() => {
    if (!activeSegment || !isMp3Playing || !isBookOpen) return;
    const timer = setTimeout(() => {
      const activeEl = document.querySelector(`[data-sync-segment="${activeSegment.id}"]`);
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [activeSegment, isMp3Playing, isBookOpen]);

  const handleJumpToSegment = useCallback(
    (segment: AudioSyncSegment) => {
      if (pageFlipRef.current?.getTargetSpread() !== segment.spread) {
        pageFlipRef.current?.goToSpread(segment.spread);
      }
      playBookOpenSound(segment.startSec);
    },
    [playBookOpenSound]
  );

  // Danh sách 18 trang (Bìa đầu + 16 trang nội dung tương ứng 9 mục + Bìa sau)
  const bookPages: React.ReactNode[] = [
    /* TRANG 0: BÌA SÁCH NGOÀI */
    <div
      className="book-cover-page"
      key="cover"
      title="Rê chuột vào góc bìa hoặc bấm để mở sách & phát luận giải"
    >
      <div
        className="book-frame book-cover-frameless"
        style={{ justifyContent: 'space-between', gap: 16, paddingTop: 22, paddingBottom: 20, paddingLeft: 18, paddingRight: 18 }}
      >
        <div className="book-title-box book-title-frameless flex flex-col items-center gap-1.5 w-full">
          <div className="book-title-main" style={{ fontSize: 20, letterSpacing: '1.4px', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Tử Vi Trong Công Việc
          </div>
          <div className="book-subtitle" style={{ fontSize: 13, letterSpacing: '0.8px', fontWeight: 600, color: 'var(--nat-vang)' }}>
            Nguyễn Hùng Thái · Giáp Tý 1984
          </div>
          <div
            className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full mt-1 border"
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              background: 'rgba(214, 179, 114, 0.14)',
              color: 'var(--nat-vang-sang)',
              borderColor: 'rgba(214, 179, 114, 0.35)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span>★ Hải Trung Kim · Đoài Tứ Cục</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <div className="thien-co-medallion" style={{ width: 310, height: 310, margin: 0 }}>
            <svg className="thien-co-ring-svg spin-slow" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="var(--nat-ngan)"
                strokeWidth="0.9"
                strokeDasharray="1.5 4.5"
                opacity="0.75"
              />
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--nat-vang)" strokeWidth="1.4" opacity="0.9" />
              <g stroke="var(--nat-vang-sang)" strokeWidth="1.6">
                <use href="#q-ly" transform="translate(100, 16) scale(0.55)" />
                <use href="#q-khon" transform="translate(159, 41) rotate(45) scale(0.55)" />
                <use href="#q-doai" transform="translate(184, 100) rotate(90) scale(0.55)" />
                <use href="#q-can" transform="translate(159, 159) rotate(135) scale(0.55)" />
                <use href="#q-kham" transform="translate(100, 184) rotate(180) scale(0.55)" />
                <use href="#q-can2" transform="translate(41, 159) rotate(225) scale(0.55)" />
                <use href="#q-chan" transform="translate(16, 100) rotate(270) scale(0.55)" />
                <use href="#q-ton" transform="translate(41, 41) rotate(315) scale(0.55)" />
              </g>
            </svg>
            <div className="thien-co-video-circle" style={{ width: 232, height: 232 }}>
              <video
                className="thien-co-video"
                src={THIEN_CO_VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
              <div className="thien-co-video-overlay" />
            </div>
          </div>
        </div>

        <div className="w-full text-center pb-1">
          <span
            className="text-[11px] font-mono tracking-widest uppercase transition-colors"
            style={{ color: 'var(--nat-ngan)', opacity: 0.85 }}
          >
            [ Mở Sách &amp; Phát Luận Giải ➔ ]
          </span>
        </div>
      </div>
    </div>,

    /* TRANG 1: MỤC 1 — VÒNG TRÒN BÁT QUÁI & SUB-CARD THÔNG TIN NGUYỄN HÙNG THÁI */
    <div className="book-inner-left" key="page-1">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">1. Hồ sơ bản mệnh &amp; sự nghiệp</span>
            <span className="tv-meta">Nguyễn Hùng Thái · Giáp Tý 1984 · Hải Trung Kim</span>
          </div>
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('taichi');
            }}
          >
            Lá Số ⤢
          </button>
        </div>

        <div
          className="inner-scroll-body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div
            className="thien-co-medallion"
            style={{ width: 176, height: 176, margin: '2px auto 0', flexShrink: 0 }}
          >
            <svg className="thien-co-ring-svg spin-slow" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="var(--nat-ngan)"
                strokeWidth="0.9"
                strokeDasharray="1.5 4.5"
                opacity="0.75"
              />
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--nat-vang)" strokeWidth="1.4" opacity="0.9" />
              <g stroke="var(--nat-vang-sang)" strokeWidth="1.6">
                <use href="#q-ly" transform="translate(100, 16) scale(0.55)" />
                <use href="#q-khon" transform="translate(159, 41) rotate(45) scale(0.55)" />
                <use href="#q-doai" transform="translate(184, 100) rotate(90) scale(0.55)" />
                <use href="#q-can" transform="translate(159, 159) rotate(135) scale(0.55)" />
                <use href="#q-kham" transform="translate(100, 184) rotate(180) scale(0.55)" />
                <use href="#q-can2" transform="translate(41, 159) rotate(225) scale(0.55)" />
                <use href="#q-chan" transform="translate(16, 100) rotate(270) scale(0.55)" />
                <use href="#q-ton" transform="translate(41, 41) rotate(315) scale(0.55)" />
              </g>
            </svg>
            <div className="thien-co-video-circle" style={{ width: 132, height: 132 }}>
              <video
                className="thien-co-video"
                src={THIEN_CO_VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
              <div className="thien-co-video-overlay" />
            </div>
          </div>

          <div
            data-sync-segment="0"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[0])}
            className={`sync-passage-box ${activeSegment?.id === 0 ? 'is-reading-active' : ''}`}
            style={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0,
              padding: '6px 8px',
            }}
            title="Bấm để nghe từ 00:00"
          >
            {activeSegment?.id === 0 && (
              <span className="sync-reading-pill" style={{ alignSelf: 'flex-start' }}>
                🔊 Đang phát · 00:00 – 00:38
              </span>
            )}
            <div className="subcard-two-col-grid">
              {CORE_PROFILE_ITEMS.map((item) => (
                <div className="data-card-compact subcard-two-col-item" key={item.label}>
                  <div className="data-card-label">{item.label}</div>
                  <div className="data-card-val" style={{ marginTop: 2 }}>
                    {item.value}
                  </div>
                  <div className="data-card-sub" style={{ fontSize: 11.2, marginTop: 2 }}>
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Bìa Sách
          </button>
          <span className="page-number-tag">Trang 1 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 2: MỤC 2 (PHẦN 1) — NỀN TẢNG TƯ DUY: THIÊN PHỦ */
    <div className="book-inner-right" key="page-2">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">2. Nền tảng tư duy</span>
            <span className="tv-meta">Thiên Phủ – Năng Lực Tích Lũy &amp; Quản Trị Nguồn Lực</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="1"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[1])}
            className={`sync-passage-box ${activeSegment?.id === 1 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 00:38"
          >
            {activeSegment?.id === 1 && (
              <span className="sync-reading-pill">🔊 Đang phát · 00:38 – 01:02</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Trong cấu trúc lá số được luận giải, hai sao <span className="tv-gold">Thiên Phủ</span> và{' '}
              <span className="tv-gold">Thiên Tướng</span> đóng vai trò quan trọng trong việc hình thành hình tượng người quản trị hệ thống. Thiên Phủ thường được ví như{' '}
              <span className="tv-highlight">kho trời</span>, tượng trưng cho khả năng tích lũy, bảo toàn và quản lý tài nguyên:
            </p>

            <div className="data-list-stack">
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">• Quản trị nguồn lực</span>
                </div>
                <div className="data-card-sub">
                  Biết phân bổ và sử dụng nhân sự, ngân sách, thời gian và tài nguyên hợp lý.
                </div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">• Tích lũy tri thức</span>
                </div>
                <div className="data-card-sub">
                  Chú trọng lưu trữ dữ liệu, kinh nghiệm và kiến thức tổ chức.
                </div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">• Xây dựng nền tảng</span>
                </div>
                <div className="data-card-sub">
                  Quan tâm đến quy trình, tiêu chuẩn và cấu trúc vận hành lâu dài.
                </div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">• Tư duy bền vững</span>
                </div>
                <div className="data-card-sub">
                  Không chỉ giải quyết vấn đề trước mắt mà còn hướng đến khả năng duy trì hiệu quả trong tương lai.
                </div>
              </div>
            </div>

            <p className="body-para" style={{ marginTop: 8, marginBottom: 0 }}>
              Đây là tư duy của một người xây dựng{' '}
              <span className="tv-highlight">tài sản vô hình cho doanh nghiệp</span>: hệ thống, quy trình, dữ liệu và năng lực con người.
            </p>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 2 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Thiên Tướng ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 3: MỤC 2 (PHẦN 2) — THIÊN TƯỚNG: CHUẨN MỰC, UY TÍN VÀ ĐIỀU PHỐI */
    <div className="book-inner-left" key="page-3">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Thiên Tướng · Ấn Tín</span>
            <span className="tv-meta">Chuẩn Mực, Uy Tín Và Năng Lực Điều Phối</span>
          </div>
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('menhly');
            }}
          >
            Mệnh Lý ⤢
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="2"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[2])}
            className={`sync-passage-box ${activeSegment?.id === 2 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 01:02"
          >
            {activeSegment?.id === 2 && (
              <span className="sync-reading-pill">🔊 Đang phát · 01:02 – 01:24</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Nếu Thiên Phủ được ví như kho lưu trữ thì <span className="tv-gold">Thiên Tướng</span> được ví như{' '}
              <span className="tv-highlight">ấn tín của nhà vua</span>, đại diện cho tính chính danh, kỷ luật, trách nhiệm và sự chuẩn mực. Trong quản trị, hình tượng này gắn với:
            </p>

            <ul className="bullet-list-compact" style={{ marginBottom: 10 }}>
              <li>✦ Thiết lập tiêu chuẩn chất lượng dịch vụ.</li>
              <li>✦ Xây dựng quy trình và cơ chế kiểm soát.</li>
              <li>✦ Duy trì tính nhất quán trong hoạt động.</li>
              <li>✦ Điều phối con người và các bộ phận.</li>
              <li>✦ Đảm bảo trách nhiệm và uy tín trong thực thi.</li>
            </ul>

            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)' }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Kiến Trúc Sư Hệ Thống</span>
                <span className="pillar-badge">Thiên Phủ + Thiên Tướng</span>
              </div>
              <p className="body-para" style={{ margin: '6px 0 0' }}>
                Sự kết hợp giữa Thiên Phủ và Thiên Tướng tạo nên hình ảnh một{' '}
                <span className="tv-gold">kiến trúc sư hệ thống</span>: người không chỉ quản lý những gì đang tồn tại mà còn có khả năng{' '}
                <span className="tv-highlight">thiết kế, chuẩn hóa và nâng cấp bộ máy vận hành</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Thiên Phủ
          </button>
          <span className="page-number-tag">Trang 3 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 4: MỤC 3 — NĂNG LỰC ĐẶC BIỆT: BÌNH TĨNH VÀ TẬP TRUNG KHI KHỦNG HOẢNG */
    <div className="book-inner-right" key="page-4">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">3. Năng lực đặc biệt</span>
            <span className="tv-meta">Bình Tĩnh Và Tập Trung Khi Khủng Hoảng</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="3"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[3])}
            className={`sync-passage-box ${activeSegment?.id === 3 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 01:24"
          >
            {activeSegment?.id === 3 && (
              <span className="sync-reading-pill">🔊 Đang phát · 01:24 – 02:11</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Bên cạnh yếu tố ổn định, lá số còn có sự hiện diện của <span className="tv-gold">Tham Lang</span> và{' '}
              <span className="tv-red">Linh Tinh</span>. Linh Tinh được ví như{' '}
              <span className="tv-highlight">bộ phận đánh lửa của động cơ tên lửa</span> — nguồn năng lượng kích hoạt đúng thời điểm và tập trung vào một mục tiêu cụ thể:
            </p>

            <div className="data-list-stack" style={{ marginBottom: 8 }}>
              <div className="data-card-compact">
                <span className="tv-gold">1. Tập trung khi áp lực gia tăng:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Không dễ để cảm xúc chi phối toàn bộ quá trình xử lý vấn đề.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">2. Phản ứng nhanh trước sự cố:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Có xu hướng tập trung nguồn lực vào điểm nghẽn quan trọng nhất.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">3. Phân tích và xử lý vấn đề:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Ưu tiên xác định nguyên nhân, đánh giá tác động và lựa chọn phương án giải quyết.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">4. Khôi phục vận hành:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Không dừng lại ở việc xử lý sự cố mà còn chú trọng xây dựng giải pháp phòng ngừa tái diễn.
                </span>
              </div>
            </div>

            <p className="body-para" style={{ marginBottom: 0 }}>
              Đây là phẩm chất giá trị trong môi trường <span className="tv-highlight">Chăm sóc khách hàng</span>, nơi các sự cố dịch vụ, khiếu nại nghiêm trọng và gián đoạn hệ thống đòi hỏi sự tỉnh táo.
            </p>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 4 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Phong Cách ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 5: MỤC 4 (PHẦN 1) — PHONG CÁCH LÃNH ĐẠO: 5 TỪ KHÓA */
    <div className="book-inner-left" key="page-5">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">4. Phong cách lãnh đạo</span>
            <span className="tv-meta">Âm Thầm – Sâu – Chuẩn – Bền – Có Hậu</span>
          </div>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="4"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[4])}
            className={`sync-passage-box ${activeSegment?.id === 4 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 02:11"
          >
            {activeSegment?.id === 4 && (
              <span className="sync-reading-pill">🔊 Đang phát · 02:11 – 02:27</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Năm từ khóa được sử dụng để khái quát phong cách làm việc của <span className="tv-gold">Nguyễn Hùng Thái</span> là:
            </p>

            <div className="data-list-stack">
              <div className="data-card-compact">
                <span className="tv-gold">Âm thầm:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Không nhất thiết phải xuất hiện ở mọi điểm nóng. Tập trung vào việc tạo ra kết quả thực chất thông qua hệ thống và đội ngũ.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Sâu:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Ưu tiên tìm hiểu bản chất vấn đề, phân tích nguyên nhân gốc rễ thay vì chỉ xử lý những biểu hiện bên ngoài.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Chuẩn:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Đề cao quy trình, tiêu chuẩn, trách nhiệm và chất lượng thực thi.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Bền:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Hướng đến kết quả lâu dài, hạn chế phụ thuộc vào cá nhân và những giải pháp mang tính tình thế.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Có hậu:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Chú trọng xây dựng nền tảng để những thành quả hôm nay tiếp tục tạo ra giá trị trong tương lai.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Khủng Hoảng
          </button>
          <span className="page-number-tag">Trang 5 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 6: MỤC 4 (PHẦN 2) — CƠ CHẾ VẬN HÀNH & HỒ SƠ BẢN MỆNH 1984 */
    <div className="book-inner-right" key="page-6">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Cơ chế vận hành hệ thống</span>
            <span className="tv-meta">Thiết Kế Vai Trò &amp; Nền Tảng Lá Số Giáp Tý</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div
          className="inner-scroll-body"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}
        >
          <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)' }}>
            <div className="pillar-header-row">
              <span className="pillar-title">Bản Chất Phong Cách Lãnh Đạo</span>
              <span className="pillar-badge">Đồng Bộ Mục Tiêu Chung</span>
            </div>
            <p className="body-para" style={{ margin: '6px 0 0' }}>
              Phong cách lãnh đạo này không nằm ở việc người đứng đầu phải trực tiếp giải quyết mọi công việc, mà ở khả năng{' '}
              <span className="tv-gold">
                thiết kế một cơ chế để mỗi cá nhân hiểu rõ vai trò, mỗi bộ phận vận hành đúng chức năng
              </span>{' '}
              và toàn bộ hệ thống cùng hướng đến mục tiêu chung.
            </p>
          </div>

          <div className="subcard-two-col-grid">
            {CORE_PROFILE_ITEMS.map((item) => (
              <div className="data-card-compact subcard-two-col-item" key={item.label}>
                <div className="data-card-label">{item.label}</div>
                <div className="data-card-val" style={{ marginTop: 2 }}>
                  {item.value}
                </div>
                <div className="data-card-sub" style={{ fontSize: 11.2, marginTop: 2 }}>
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 6 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Thách Thức ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 7: MỤC 5 (PHẦN 1) — THÁCH THỨC LỚN NHẤT: XU HƯỚNG ÔM VIỆC */
    <div className="book-inner-left" key="page-7">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">5. Thách thức lớn nhất</span>
            <span className="tv-meta">Xu Hướng Ôm Việc Và Tiêu Chuẩn Cá Nhân Quá Cao</span>
          </div>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="5"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[5])}
            className={`sync-passage-box ${activeSegment?.id === 5 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 02:27"
          >
            {activeSegment?.id === 5 && (
              <span className="sync-reading-pill">🔊 Đang phát · 02:27 – 02:42</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Một điểm cần đặc biệt lưu ý trong hình tượng người kiến tạo hệ thống là{' '}
              <span className="tv-red">xu hướng ôm việc</span>. Khi đặt ra tiêu chuẩn cá nhân cao, người quản lý dễ hình thành suy nghĩ rằng tự mình thực hiện sẽ nhanh hơn, chính xác hơn và ít rủi ro hơn việc giao cho người khác.
            </p>
            <p className="body-para" style={{ marginBottom: 8 }}>
              Điều này có thể mang lại hiệu quả trong ngắn hạn nhưng lại tạo ra{' '}
              <span className="tv-gold">ba vấn đề dài hạn</span>:
            </p>

            <div className="data-list-stack" style={{ marginBottom: 8 }}>
              <div className="data-card-compact">
                <span className="tv-red">• Quá tải cá nhân:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Người lãnh đạo trở thành điểm tập trung của quá nhiều quyết định và công việc.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-red">• Hạn chế phát triển nhân sự:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Đội ngũ thiếu cơ hội rèn luyện khả năng tự chủ và giải quyết vấn đề.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-red">• Rủi ro phụ thuộc:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Hệ thống khó vận hành ổn định nếu thiếu người quản lý chủ chốt.
                </span>
              </div>
            </div>

            <p className="body-para" style={{ marginBottom: 0 }}>
              Đặc biệt, việc <span className="tv-highlight">chịu đựng áp lực trong im lặng</span> có thể khiến những dấu hiệu quá tải không được nhận diện kịp thời.
            </p>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Phong Cách
          </button>
          <span className="page-number-tag">Trang 7 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 8: MỤC 5 (PHẦN 2) — CHIẾN LƯỢC CHUYỂN ĐỔI SANG KIẾN TRÚC SƯ TRƯỞNG */
    <div className="book-inner-right" key="page-8">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Chiến lược chuyển đổi</span>
            <span className="tv-meta">Từ Người Thực Hiện Sang Kiến Trúc Sư Trưởng</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="6"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[6])}
            className={`sync-passage-box ${activeSegment?.id === 6 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 02:42"
          >
            {activeSegment?.id === 6 && (
              <span className="sync-reading-pill">🔊 Đang phát · 02:42 – 02:55</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Giải pháp không phải là hạ thấp tiêu chuẩn, mà là{' '}
              <span className="tv-gold">thay đổi cách đạt được tiêu chuẩn đó</span>. Thay vì trực tiếp giải quyết mọi công việc, người lãnh đạo cần:
            </p>

            <div className="data-list-stack" style={{ marginBottom: 10 }}>
              <div className="data-card-compact">
                <span className="tv-gold">1.</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Chuẩn hóa quy trình để nhân sự có thể tự thực hiện.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">2.</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Phân quyền rõ ràng theo năng lực và trách nhiệm.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">3.</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Xây dựng đội ngũ kế thừa và những nhân sự chủ chốt.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">4.</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Sử dụng Dashboard và KPI để theo dõi kết quả.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">5.</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Tập trung vào những quyết định mang tính chiến lược.
                </span>
              </div>
            </div>

            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang-sang)' }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Bước Trưởng Thành Quan Trọng Nhất</span>
              </div>
              <p className="body-para" style={{ margin: '4px 0 0' }}>
                Chuyển từ <span className="tv-highlight">người làm tốt nhất</span> sang{' '}
                <span className="tv-gold">người xây dựng được một đội ngũ có khả năng làm tốt</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 8 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Đội Ngũ ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 9: MỤC 6 (PHẦN 1) — CHIẾN LƯỢC XÂY DỰNG ĐỘI NGŨ: NHÓM CỘNG HƯỞNG */
    <div className="book-inner-left" key="page-9">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">6. Chiến lược đội ngũ</span>
            <span className="tv-meta">Bổ Sung Thay Vì Đối Đầu · Nhóm Cộng Hưởng</span>
          </div>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="7"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[7])}
            className={`sync-passage-box ${activeSegment?.id === 7 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 02:55"
          >
            {activeSegment?.id === 7 && (
              <span className="sync-reading-pill">🔊 Đang phát · 02:55 – 03:25</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Sự tương hợp theo <span className="tv-gold">Can Chi</span> được sử dụng như góc nhìn tham khảo trong việc nhận diện sự khác biệt về tính cách và nhịp độ làm việc —{' '}
              <span className="tv-highlight">Nhóm cộng hưởng (Cánh tay phải)</span>:
            </p>

            <div className="data-list-stack">
              <div className="pillar-card">
                <div className="pillar-header-row">
                  <span className="pillar-title">Tuổi Thân – Ví dụ 1992</span>
                  <span className="pillar-badge">Thực Thi &amp; Tốc Độ</span>
                </div>
                <p className="body-para" style={{ margin: '5px 0 4px' }}>
                  Được luận giải theo hướng bổ sung{' '}
                  <span className="tv-gold">tốc độ triển khai, khả năng thực thi và sự linh hoạt</span> — hỗ trợ hiện thực hóa những hệ thống phức tạp thành công việc cụ thể.
                </p>
                <div className="data-card-focus">
                  Vai trò phù hợp: Quản lý triển khai, trưởng nhóm vận hành, quản lý dự án.
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-header-row">
                  <span className="pillar-title">Tuổi Thìn – Ví dụ 1988</span>
                  <span className="pillar-badge">Chiến Lược &amp; Tầm Nhìn</span>
                </div>
                <p className="body-para" style={{ margin: '5px 0 4px' }}>
                  Được xem là hình tượng bổ sung{' '}
                  <span className="tv-gold">góc nhìn chiến lược, tư duy tổng thể và khả năng định hướng dài hạn</span>.
                </p>
                <div className="data-card-focus">
                  Vai trò phù hợp: Giám đốc chiến lược, cố vấn quản trị, quản lý phát triển kinh doanh.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Kiến Trúc Sư
          </button>
          <span className="page-number-tag">Trang 9 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 10: MỤC 6 (PHẦN 2) — NHÓM CẦN ĐIỀU CHỈNH & NGUYÊN TẮC XÂY DỰNG ĐỘI NGŨ */
    <div className="book-inner-right" key="page-10">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Điều chỉnh nhịp độ &amp; Nguyên tắc</span>
            <span className="tv-meta">Tuổi Ngọ (1990) &amp; Bộ Máy Tính Bổ Trợ</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="8"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[8])}
            className={`sync-passage-box ${activeSegment?.id === 8 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 03:25"
          >
            {activeSegment?.id === 8 && (
              <span className="sync-reading-pill">🔊 Đang phát · 03:25 – 03:53</span>
            )}
            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-chu-sa)', marginBottom: 8 }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Nhóm cần điều chỉnh: Tuổi Ngọ – Ví dụ 1990</span>
                <span className="pillar-badge">Khác Biệt Nhịp Độ</span>
              </div>
              <p className="body-para" style={{ margin: '5px 0 4px' }}>
                Một bên thiên về <span className="tv-gold">phương pháp, cấu trúc và sự bền bỉ</span>; bên còn lại thiên về{' '}
                <span className="tv-highlight">tốc độ, sự ngẫu hứng và hành động nhanh</span>. Khi thiếu cơ chế thống nhất dễ dẫn đến xung đột cách ra quyết định.
              </p>
              <div className="data-card-sub">
                Tuy nhiên, khác biệt không đồng nghĩa với không thể hợp tác: thành công cần đánh giá dựa trên{' '}
                <b>năng lực, giá trị, hành vi, mục tiêu và khả năng phối hợp thực tế</b> thay vì chỉ dựa vào năm sinh.
              </div>
            </div>

            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)' }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Nguyên Tắc Xây Dựng Đội Ngũ</span>
                <span className="pillar-badge">Bổ Trợ Thay Vì Cạnh Tranh</span>
              </div>
              <p className="body-para" style={{ margin: '5px 0 0' }}>
                <span className="tv-gold">Người giữ nền tảng</span> cần người thúc đẩy tốc độ.{' '}
                <span className="tv-gold">Người có tầm nhìn</span> cần người hiện thực hóa kế hoạch.{' '}
                <span className="tv-gold">Người quản trị tiêu chuẩn</span> cần người tạo ra sự đổi mới — hình thành bộ máy bổ trợ thay vì cạnh tranh nội bộ.
              </p>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 10 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Nghề Nghiệp ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 11: MỤC 7 (PHẦN 1) — ĐỊNH HƯỚNG NGHỀ NGHIỆP: NHỮNG VỊ TRÍ PHÁT HUY THẾ MẠNH */
    <div className="book-inner-left" key="page-11">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">7. Định hướng nghề nghiệp</span>
            <span className="tv-meta">Những Vị Trí Phát Huy Thế Mạnh Hệ Thống</span>
          </div>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="9"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[9])}
            className={`sync-passage-box ${activeSegment?.id === 9 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 03:53"
          >
            {activeSegment?.id === 9 && (
              <span className="sync-reading-pill">🔊 Đang phát · 03:53 – 04:12</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Các vị trí nghề nghiệp phù hợp tập trung vào vai trò{' '}
              <span className="tv-gold">quản trị, điều phối và kiến tạo hệ thống</span>:
            </p>

            <div className="data-list-stack">
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">1. Giám đốc vận hành (COO)</span>
                </div>
                <div className="data-card-sub">Xây dựng và tối ưu toàn bộ hoạt động doanh nghiệp.</div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">2. Trưởng phòng Chăm sóc khách hàng</span>
                </div>
                <div className="data-card-sub">Quản trị chất lượng dịch vụ, nhân sự và hiệu quả vận hành.</div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">3. Giám đốc trải nghiệm khách hàng (CCO/CX Director)</span>
                </div>
                <div className="data-card-sub">Kiến tạo hành trình khách hàng và chiến lược trải nghiệm.</div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">4. Cố vấn hệ thống</span>
                </div>
                <div className="data-card-sub">Phân tích, thiết kế và chuẩn hóa mô hình vận hành.</div>
              </div>
              <div className="data-card-compact">
                <div className="data-card-top">
                  <span className="tv-gold">5. Quản lý chuyển đổi số</span>
                </div>
                <div className="data-card-sub">Ứng dụng công nghệ, dữ liệu và tự động hóa vào quản trị.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Đội Ngũ
          </button>
          <span className="page-number-tag">Trang 11 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 12: MỤC 7 (PHẦN 2) — HỆ SINH THÁI CHĂM SÓC KHÁCH HÀNG & KIẾN TẠO HỆ THỐNG */
    <div className="book-inner-right" key="page-12">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Hệ sinh thái vận hành CSKH</span>
            <span className="tv-meta">Biến Định Hướng Thành Kết Quả Đo Lường Được</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="10"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[10])}
            className={`sync-passage-box ${activeSegment?.id === 10 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 04:12"
          >
            {activeSegment?.id === 10 && (
              <span className="sync-reading-pill">🔊 Đang phát · 04:12 – 04:24</span>
            )}
            <p className="body-para">
              Điểm chung của những vị trí này là khả năng{' '}
              <span className="tv-gold">biến định hướng thành hệ thống, biến chiến lược thành quy trình</span> và{' '}
              <span className="tv-highlight">biến quy trình thành kết quả có thể đo lường</span>.
            </p>

            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)', marginBottom: 10 }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Kiến Tạo Hệ Thống Chăm Sóc Khách Hàng</span>
                <span className="pillar-badge">Thực Chiến CX</span>
              </div>
              <p className="body-para" style={{ margin: '6px 0 8px' }}>
                Đặc biệt, trong lĩnh vực <span className="tv-gold">Chăm sóc khách hàng</span>, năng lực kiến tạo hệ thống thể hiện rõ nét qua việc xây dựng đồng bộ:
              </p>
              <div className="chart-grid">
                <div className="chart-item">
                  <b>Nền Tảng Công Nghệ</b>CRM · Contact Center · AI Chatbot
                </div>
                <div className="chart-item">
                  <b>Tri Thức &amp; Dữ Liệu</b>Knowledge Base · Dashboard Quản Trị
                </div>
                <div className="chart-item">
                  <b>Tiêu Chuẩn Dịch Vụ</b>Bộ Tiêu Chuẩn Dịch Vụ &amp; QA/SLA
                </div>
                <div className="chart-item">
                  <b>Quy Trình Nghiệp Vụ</b>Chuẩn Hóa Luồng Xử Lý Đa Kênh
                </div>
              </div>
            </div>

            <p className="body-para" style={{ marginBottom: 0 }}>
              Đây chính là hướng phát triển có tính liên kết chặt chẽ với kinh nghiệm quản lý và vận hành dịch vụ khách hàng của{' '}
              <span className="tv-gold">Nguyễn Hùng Thái</span>.
            </p>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 12 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Dài Hạn ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 13: MỤC 8 (PHẦN 1) — CHIẾN LƯỢC PHÁT TRIỂN DÀI HẠN: BỐN ĐỊNH HƯỚNG */
    <div className="book-inner-left" key="page-13">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">8. Chiến lược dài hạn</span>
            <span className="tv-meta">Tập Trung Vào Giá Trị Để Lại · 4 Định Hướng</span>
          </div>
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('nguhanh');
            }}
          >
            Ngũ Hành ⤢
          </button>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="11"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[11])}
            className={`sync-passage-box ${activeSegment?.id === 11 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 04:24"
          >
            {activeSegment?.id === 11 && (
              <span className="sync-reading-pill">🔊 Đang phát · 04:24 – 04:46</span>
            )}
            <p className="body-para" style={{ marginBottom: 8 }}>
              Giá trị lớn hơn nằm ở khả năng{' '}
              <span className="tv-gold">
                xây dựng những nền tảng có thể tiếp tục vận hành và phát triển ngay cả khi người lãnh đạo không trực tiếp tham gia từng công việc
              </span>
              , thông qua bốn định hướng:
            </p>

            <div className="data-list-stack">
              <div className="data-card-compact">
                <span className="tv-gold">Một là – Kiến tạo hệ thống:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Xây dựng quy trình chuẩn, dữ liệu tập trung và cơ chế kiểm soát minh bạch.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Hai là – Phát triển con người:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Đào tạo nhân sự chủ chốt, phân quyền và xây dựng đội ngũ kế thừa.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Ba là – Ứng dụng công nghệ:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Tận dụng CRM, AI, Dashboard và tự động hóa để giảm phụ thuộc vào thao tác thủ công.
                </span>
              </div>
              <div className="data-card-compact">
                <span className="tv-gold">Bốn là – Nâng tầm quản trị:</span>{' '}
                <span className="data-card-sub" style={{ display: 'inline' }}>
                  Chuyển trọng tâm từ xử lý công việc hằng ngày sang hoạch định chiến lược, quản trị hiệu suất và phát triển tổ chức.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Nghề Nghiệp
          </button>
          <span className="page-number-tag">Trang 13 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 14: MỤC 8 (PHẦN 2) — LỘ TRÌNH CHUYỂN ĐỔI LÃNH ĐẠO HỆ THỐNG */
    <div className="book-inner-right" key="page-14">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Lộ trình nâng tầm lãnh đạo</span>
            <span className="tv-meta">Từ Quản Lý Thực Chiến Sang Kiến Tạo Hệ Thống</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div
          className="inner-scroll-body"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}
        >
          <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)' }}>
            <div className="pillar-header-row">
              <span className="pillar-title">Thông Điệp Trọng Tâm Của Bản Luận Giải</span>
              <span className="pillar-badge">Giá Trị Để Lại</span>
            </div>
            <p className="body-para" style={{ margin: '6px 0 0' }}>
              Thông điệp quan trọng nhất của bản luận giải không nằm ở việc phải trở thành một nhà lãnh đạo nổi bật hay luôn đứng ở vị trí trung tâm — mà là{' '}
              <span className="tv-gold">
                con đường chuyển đổi từ một người quản lý giàu kinh nghiệm thực chiến thành một nhà lãnh đạo có năng lực kiến tạo và phát triển hệ thống
              </span>
              .
            </p>
          </div>

          <div className="page-bagua-grid">
            {BAGUA_LIST.map((item) => (
              <div className="bagua-cell" key={item.name}>
                <span className="bagua-glyph">{item.glyph}</span>
                <span className="bagua-name">{item.name}</span>
                <span className="bagua-elem">{item.elem}</span>
              </div>
            ))}
          </div>

          <div className="chart-grid">
            <div className="chart-item">
              <b>Bước 1 · Nền Tảng</b>Quy Trình Chuẩn &amp; Dữ Liệu
            </div>
            <div className="chart-item">
              <b>Bước 2 · Con Người</b>Phân Quyền &amp; Đội Ngũ Kế Thừa
            </div>
            <div className="chart-item">
              <b>Bước 3 · Công Nghệ</b>CRM · AI · Dashboard Tự Động
            </div>
            <div className="chart-item">
              <b>Bước 4 · Tầm Nhìn</b>Hoạch Định Chiến Lược Tổ Chức
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 14 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.nextSpread();
            }}
          >
            Kết Luận ▶
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 15: MỤC 9 (PHẦN 1) — THÔNG ĐIỆP KẾT LUẬN: GIÁ TRỊ BỀN VỮNG */
    <div className="book-inner-left" key="page-15">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">9. Thông điệp kết luận</span>
            <span className="tv-meta">Người Giữ Được Nền Tảng Sẽ Tạo Nên Giá Trị Bền Vững</span>
          </div>
        </div>

        <div className="inner-scroll-body">
          <div
            data-sync-segment="12"
            onClick={() => handleJumpToSegment(AUDIO_SYNC_SEGMENTS[12])}
            className={`sync-passage-box ${activeSegment?.id === 12 ? 'is-reading-active' : ''}`}
            title="Bấm để nghe từ 04:46"
          >
            {activeSegment?.id === 12 && (
              <span className="sync-reading-pill">🔊 Đang phát · 04:46 – 05:08</span>
            )}
            <p className="body-para">
              <span className="tv-gold">Sự thầm lặng không phải là điểm yếu.</span> Sự ổn định không đồng nghĩa với thiếu đột phá. Và một nhà lãnh đạo không nhất thiết phải tự mình tạo ra mọi thành quả.
            </p>
            <p className="body-para">
              Trong cuộc đua dài hạn, người có khả năng{' '}
              <span className="tv-highlight">
                giữ vững nền tảng, phát triển con người, chuẩn hóa hệ thống và thích ứng trước những biến động mới
              </span>{' '}
              mới là người tạo ra giá trị lâu dài cho tổ chức.
            </p>
            <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang-sang)' }}>
              <div className="pillar-header-row">
                <span className="pillar-title">Tóm Lược Hình Tượng Nguyễn Hùng Thái</span>
                <span className="pillar-badge">Kim Chỉ Nam</span>
              </div>
              <p className="quote-text" style={{ marginTop: 6, fontWeight: 700, color: 'var(--nat-vang-sang)' }}>
                “Không chỉ làm tốt một công việc, mà xây dựng một hệ thống có thể làm tốt công việc đó một cách nhất quán, hiệu quả và bền vững.”
              </p>
            </div>
          </div>
        </div>

        <div className="page-footer-row">
          <button
            type="button"
            className="page-nav-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.prevSpread();
            }}
          >
            ◀ Dài Hạn
          </button>
          <span className="page-number-tag">Trang 15 / 16</span>
        </div>
      </div>
    </div>,

    /* TRANG 16: MỤC 9 (PHẦN 2) — TƯ DUY NGƯỜI KIẾN TẠO HỆ THỐNG */
    <div className="book-inner-right" key="page-16">
      <div className="inner-page-border">
        <div className="inner-page-header">
          <div>
            <span className="nat-nome">Tư duy kiến tạo hệ thống</span>
            <span className="tv-meta">Chuẩn Bị Năng Lực Cho Thách Thức Ngày Mai</span>
          </div>
          <button
            type="button"
            className="inner-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Đóng ✕
          </button>
        </div>

        <div
          className="inner-scroll-body"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}
        >
          <div className="pillar-card" style={{ borderLeft: '3px solid var(--nat-vang)' }}>
            <div className="pillar-header-row">
              <span className="pillar-title">Tầm Nhìn Của Người Kiến Tạo Hệ Thống</span>
              <span className="pillar-badge">Hôm Nay &amp; Ngày Mai</span>
            </div>
            <p className="body-para" style={{ margin: '6px 0 0' }}>
              Đó là tư duy của <span className="tv-gold">người kiến tạo hệ thống</span> – người không chỉ giải quyết vấn đề hôm nay mà còn{' '}
              <span className="tv-highlight">chuẩn bị năng lực cho những thách thức của ngày mai</span>.
            </p>
          </div>

          <div
            className="pillar-card"
            style={{ borderLeft: '3px solid var(--nat-vang-sang)', background: 'rgba(223, 185, 115, 0.08)' }}
          >
            <div className="pillar-header-row">
              <span className="pillar-title">Thước Đo Giá Trị Của Người Lãnh Đạo</span>
              <span className="pillar-badge">Di Sản Vận Hành</span>
            </div>
            <p className="quote-text" style={{ marginTop: 6, fontWeight: 700, color: 'var(--nat-chiaro)' }}>
              “Giá trị của người lãnh đạo không chỉ nằm ở những gì họ trực tiếp làm được, mà còn ở những gì đội ngũ và hệ thống có thể tiếp tục làm tốt khi họ không còn đứng ở vị trí trung tâm.”
            </p>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              fontStyle: 'italic',
              color: 'var(--nat-spento)',
              textAlign: 'center',
            }}
          >
            Bản Luận Giải Tử Vi Sự Nghiệp – Nguyễn Hùng Thái (Giáp Tý 1984 · Hải Trung Kim).
          </p>
        </div>

        <div className="page-footer-row">
          <span className="page-number-tag">Trang 16 / 16</span>
          <button
            type="button"
            className="page-nav-mini-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              pageFlipRef.current?.closeBook();
            }}
          >
            Hoàn Tất · Đóng Sách ✕
          </button>
        </div>
      </div>
    </div>,

    /* TRANG 17: BÌA SAU (ẤN KÝ HỒI KẾT) */
    <div className="book-cover-page" key="back-cover">
      <div className="book-frame" style={{ inset: '14px' }}>
        <div className="book-title-box">
          <div className="book-title-main">Hải Trung Kim</div>
          <div className="book-subtitle">Nguyễn Hùng Thái · Giáp Tý 1984</div>
        </div>

        <p
          className="quote-text"
          style={{ padding: '0 14px', textAlign: 'center', color: 'var(--nat-vang-sang)', fontWeight: 700 }}
        >
          {HERO_MOTTO}
        </p>

        <button
          type="button"
          className="inner-close-btn"
          style={{ padding: '8px 16px', fontSize: 12 }}
          onClick={(e) => {
            e.stopPropagation();
            pageFlipRef.current?.closeBook();
          }}
        >
          ↺ Về Bìa Đầu Sách
        </button>
      </div>
    </div>,
  ];

  // Keep unused-asset warning clean if needed
  void COVER_MEDALLION_IMAGE_URL;

  return (
    <div
      ref={stageWrapperRef}
      className={`tuvi-app-root ${effectiveDark ? 'theme-dark' : 'theme-light'}`}
    >
      <audio
        ref={bookAudioRef}
        src={BOOK_OPEN_SOUND_URL}
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setMp3Duration(d);
        }}
        onTimeUpdate={handleAudioTimeUpdate}
        onPlay={() => setIsMp3Playing(true)}
        onPause={() => setIsMp3Playing(false)}
        onEnded={() => setIsMp3Playing(false)}
      />

      <style>{`
        .tuvi-app-root,
        .tuvi-app-root *,
        .tuvi-app-root *::before,
        .tuvi-app-root *::after {
          box-sizing: border-box;
          font-family: 'Play', sans-serif !important;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .tuvi-app-root {
          --bg-page: radial-gradient(circle at 50% 45%, #171D26 0%, #0E1218 55%, #07090D 100%);
          --dot-gold: rgba(214, 179, 114, 0.12);
          --dot-red: rgba(198, 218, 238, 0.09);
          --text-body: #F2F5F9;
          --nat-testo: #E6ECF4;
          --nat-chiaro: #FFFFFF;
          --nat-spento: #AEBAC9;
          --nat-vang: #D4AF6A;
          --nat-vang-sang: #F7DF9E;
          --nat-ngan: #D5E3F2;
          --nat-chu-sa: #E8B45E;
          --nat-fondo: #10151B;
          --nat-incisione: #CFA968;
          --circle-bg: radial-gradient(circle closest-side, rgba(22, 28, 37, 0.96) 0, rgba(12, 16, 22, 0.92) 76%, transparent 100%);
          --circle-shadow: 0 0 55px 12px rgba(198, 218, 238, 0.12), 0 0 130px 40px rgba(214, 179, 114, 0.1);
          --book-bg: linear-gradient(145deg, #1A2029 0%, #0E1218 55%, #151B23 100%);
          --book-page-bg: linear-gradient(90deg, #0D1116 0%, #141A22 14%, #10151C 100%);
          --book-left-page-bg: linear-gradient(270deg, #0D1116 0%, #141A22 18%, #10151C 100%);
          --book-border: #9E8150;
          --book-shadow: -8px 0 22px rgba(0, 0, 0, 0.88), 0 16px 38px rgba(0, 0, 0, 0.92), inset 0 0 38px rgba(198, 218, 238, 0.08);
          --title-box-bg: rgba(11, 15, 20, 0.95);
          --inner-border-bg: rgba(12, 16, 22, 0.78);
          --surface-card-bg: rgba(20, 26, 35, 0.9);
          --card-bg: linear-gradient(145deg, #192028, #0f1318);
          --card-shadow: 0 10px 28px rgba(0, 0, 0, 0.85), inset 0 0 18px rgba(214, 179, 114, 0.07);
          --link-bar-bg: rgba(13, 17, 23, 0.95);
          --modal-backdrop: rgba(5, 7, 10, 0.86);
          --modal-bg: #11161c;
          --visual-box-bg: radial-gradient(circle at center, #202832 0%, #0c1015 100%);
          --cell-bg: #171e26;
          --cell-hover-bg: #222c37;
          --yin-fill: #0f1318;
          --yang-fill: #edf3f9;
          --switcher-bg: rgba(15, 20, 27, 0.88);
          --switcher-border: rgba(212, 175, 106, 0.42);
          --switcher-text: #C7D2E0;

          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
          border-radius: var(--radius-subcard, 14px);
          background: var(--bg-page);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px;
          color: var(--text-body);
          position: relative;
          transition: background 0.45s ease, color 0.35s ease;
        }

        .tuvi-app-root.tuvi-modal-host {
          width: 0;
          height: 0;
          min-height: 0;
          padding: 0;
          background: transparent;
          overflow: visible;
        }

        .tuvi-app-root.theme-light {
          --bg-page: radial-gradient(circle at 50% 42%, #ECEFF4 0%, #DFE5ED 56%, #CFD7E2 100%);
          --dot-gold: rgba(166, 123, 56, 0.16);
          --dot-red: rgba(94, 112, 134, 0.14);
          --text-body: #171E27;
          --nat-testo: #263140;
          --nat-chiaro: #10161F;
          --nat-spento: #526173;
          --nat-vang: #B0833E;
          --nat-vang-sang: #7D561B;
          --nat-ngan: #3C4E64;
          --nat-chu-sa: #9E531E;
          --nat-fondo: #E5EAF0;
          --nat-incisione: #8C662C;
          --circle-bg: radial-gradient(circle closest-side, rgba(238, 242, 247, 0.94) 0, rgba(220, 227, 236, 0.9) 76%, transparent 100%);
          --circle-shadow: 0 0 55px 12px rgba(176, 131, 62, 0.14), 0 0 120px 36px rgba(116, 132, 152, 0.22);
          --book-bg: linear-gradient(145deg, #F1F4F8 0%, #E4E9F0 55%, #D7DFE9 100%);
          --book-page-bg: linear-gradient(90deg, #D5DEE8 0%, #E9EEF4 12%, #F1F4F8 100%);
          --book-left-page-bg: linear-gradient(270deg, #D5DEE8 0%, #E9EEF4 14%, #F1F4F8 100%);
          --book-border: #B88D48;
          --book-shadow: -8px 12px 28px rgba(15, 23, 42, 0.16), 0 18px 42px rgba(15, 23, 42, 0.18), inset 0 0 28px rgba(176, 131, 62, 0.1);
          --title-box-bg: rgba(242, 245, 249, 0.94);
          --inner-border-bg: rgba(240, 244, 249, 0.86);
          --surface-card-bg: rgba(232, 237, 244, 0.92);
          --card-bg: linear-gradient(145deg, #F3F6FA, #E3E8F0);
          --card-shadow: 0 10px 26px rgba(15, 23, 42, 0.12), inset 0 0 14px rgba(176, 131, 62, 0.08);
          --link-bar-bg: rgba(239, 243, 248, 0.94);
          --modal-backdrop: rgba(15, 23, 42, 0.48);
          --modal-bg: #EEF2F7;
          --visual-box-bg: radial-gradient(circle at center, #F5F7FA 0%, #DCE3EC 100%);
          --cell-bg: #E5EAF1;
          --cell-hover-bg: #D8E0EB;
          --yin-fill: #171E27;
          --yang-fill: #F3F6FA;
          --switcher-bg: rgba(239, 243, 248, 0.9);
          --switcher-border: rgba(176, 131, 62, 0.48);
          --switcher-text: #465568;
        }

        .tuvi-app-root:not(.tuvi-modal-host)::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(var(--dot-gold) 1px, transparent 0),
            radial-gradient(var(--dot-red) 1px, transparent 0);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
          pointer-events: none;
          z-index: 0;
        }

        .nat-stage {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .nat {
          position: relative;
          width: 1140px;
          height: 780px;
          margin: 0 auto;
          outline: none;
          flex-shrink: 0;
          transform-origin: center center;
          transition: transform 0.2s ease;
        }

        .nat-cerchio {
          position: absolute;
          z-index: 0;
          left: 170px;
          top: -10px;
          width: 800px;
          height: 800px;
          opacity: 0.22;
          transform: scale(.94) rotate(-8deg);
          transition: opacity 1.2s ease, transform 1.6s ease;
          pointer-events: none;
        }
        .nat-cerchio::before {
          content: "";
          position: absolute;
          inset: 4%;
          border-radius: 50%;
          background: var(--circle-bg);
          box-shadow: var(--circle-shadow);
        }
        .nat-cerchio svg { position: absolute; }
        .nat-cerchio .nat-defs { width: 0; height: 0; }
        .nat-cerchio .nat-strato { inset: 0; width: 100%; height: 100%; overflow: visible; }

        .nat-anello { transform-origin: 310px 310px; animation: nat-gira 110s linear infinite; }
        .nat-a2 { animation-direction: reverse; animation-duration: 150s; }
        .nat-a3 { animation-duration: 95s; }
        .nat-a4 { animation-direction: reverse; animation-duration: 120s; }
        .nat-a5 { animation-duration: 80s; }
        @keyframes nat-gira { to { transform: rotate(360deg); } }

        .nat-brilla {
          stroke: var(--nat-ngan);
          filter: drop-shadow(0 0 4px rgba(198, 218, 238, .8)) drop-shadow(0 0 10px rgba(214, 179, 114, .45));
        }
        .nat-brilla > g > * { animation: nat-respira 6s ease-in-out infinite alternate; }
        .nat-brilla > g > *:nth-child(2n) { animation-delay: -2s; animation-duration: 8s; }
        @keyframes nat-respira { from { opacity: .4; } to { opacity: .95; } }

        .nat.is-active .nat-cerchio,
        .nat.is-book-open .nat-cerchio {
          opacity: .92;
          transform: none;
        }

        .pf-frame {
          position: absolute;
          z-index: 6;
          left: 60px;
          top: 30px;
          width: 1020px;
          height: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: visible;
        }

        .pf-slider {
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          position: relative;
          transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .pf-slider.is-single-mode {
          width: 200%;
          align-self: flex-start;
        }

        .pf-book {
          position: relative;
          width: 100%;
          height: 100%;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease;
        }
        .pf-book:hover {
          transform: translateY(-5px) scale(1.006);
        }
        .nat.is-book-open .pf-book {
          transform: translateY(-4px);
        }
        .pf-book:active {
          cursor: grabbing;
          transform: translateY(-2px) scale(1.002);
        }

        .pf-book::before {
          content: "";
          position: absolute;
          left: 2%;
          right: 2%;
          bottom: -22px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 55%, transparent 78%);
          filter: blur(12px);
          transform: translateZ(-20px) scale(0.98);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease;
          pointer-events: none;
          z-index: -2;
        }
        .pf-book:hover::before,
        .nat.is-book-open .pf-book::before {
          transform: translateY(6px) translateZ(-20px) scale(1.02);
          opacity: 0.92;
        }

        .pf-book::after {
          content: "";
          position: absolute;
          top: 2px;
          bottom: 2px;
          left: 50%;
          width: 18px;
          margin-left: -9px;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(255, 248, 226, 0.14) 48%,
            rgba(0, 0, 0, 0.38) 100%
          );
          box-shadow: 0 0 14px rgba(0, 0, 0, 0.45);
          pointer-events: none;
          z-index: 7;
          border-radius: 2px;
        }

        .pf-paper {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          transform-origin: top left;
          overflow: hidden;
          border: 1.5px solid var(--book-border);
        }

        .pf-side-left {
          left: 0;
          border-radius: 10px 3px 3px 10px;
          background: var(--book-left-page-bg);
          box-shadow: -10px 14px 34px rgba(0, 0, 0, 0.72), inset -14px 0 24px rgba(214, 179, 114, 0.08);
        }

        .pf-side-right {
          left: 50%;
          border-radius: 3px 10px 10px 3px;
          background: var(--book-page-bg);
          box-shadow: 10px 16px 36px rgba(0, 0, 0, 0.76), inset 16px 0 24px rgba(0, 0, 0, 0.45);
        }

        .pf-cover-surface {
          background: var(--book-bg) !important;
          box-shadow: var(--book-shadow) !important;
        }

        .pf-paper-back {
          filter: brightness(0.9);
          box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.25);
        }

        .pf-front-inner,
        .pf-back-mirror {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .pf-back-mirror {
          transform: scaleX(-1);
        }

        .pf-flap-shadow {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 8;
        }

        .pf-gutter {
          pointer-events: none;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 24px;
          z-index: 6;
        }
        .pf-gutter-left {
          right: 0;
          background: linear-gradient(to left, rgba(0, 0, 0, 0.45), transparent);
        }
        .pf-gutter-right {
          left: 0;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.45), transparent);
        }

        .book-cover-page {
          width: 100%;
          height: 100%;
          position: relative;
          background: var(--book-bg);
          overflow: hidden;
        }

        .book-frame {
          position: absolute;
          inset: 14px 14px 14px 28px;
          border: 1px solid rgba(223, 185, 115, 0.55);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 22px 16px;
        }
        .book-frame::after {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(214, 230, 245, 0.25);
          pointer-events: none;
        }
        .book-cover-frameless {
          inset: 14px;
          border: none !important;
        }
        .book-cover-frameless::after {
          display: none !important;
        }

        .book-title-box {
          position: relative;
          background: var(--title-box-bg);
          border: 1.2px solid var(--book-border);
          padding: 13px 18px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(214, 179, 114, 0.16);
          text-align: center;
          z-index: 3;
        }
        .book-title-frameless {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .book-title-main {
          font-weight: 700;
          font-size: 18px;
          line-height: 1.35;
          letter-spacing: 1.2px;
          text-transform: none;
          color: var(--nat-vang-sang);
        }
        .book-subtitle {
          margin-top: 6px;
          font-size: 12px;
          letter-spacing: 0.8px;
          text-transform: none;
          color: var(--nat-ngan);
          font-weight: 700;
        }

        .book-inner-left,
        .book-inner-right {
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .thien-co-medallion {
          position: relative;
          width: 164px;
          height: 164px;
          margin: 4px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          filter: drop-shadow(0 0 16px rgba(214, 179, 114, 0.32));
        }
        .thien-co-ring-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }
        .thien-co-video-circle {
          position: relative;
          width: 126px;
          height: 126px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.8px solid var(--nat-vang);
          box-shadow:
            0 0 18px rgba(198, 218, 238, 0.22),
            inset 0 0 16px rgba(7, 9, 12, 0.65);
          background: #0b0e13;
          z-index: 2;
        }
        .thien-co-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          transform: scale(1.04);
        }
        .thien-co-video-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 58%, rgba(10, 13, 18, 0.45) 100%);
          box-shadow: inset 0 0 10px rgba(214, 179, 114, 0.28);
          pointer-events: none;
        }

        .book-seal {
          font-weight: 700;
          font-size: 11px;
          line-height: 1.25;
          color: var(--nat-vang-sang);
          border: 1.5px solid var(--nat-vang);
          padding: 5px 8px;
          background: rgba(214, 179, 114, 0.14);
          box-shadow: inset 0 0 8px rgba(214, 179, 114, 0.18);
          letter-spacing: 0.6px;
          text-transform: none;
          z-index: 3;
          text-align: center;
        }

        .inner-page-border {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(223, 185, 115, 0.42);
          background: var(--inner-border-bg);
          padding: 15px 15px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .inner-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          border-bottom: 1px solid rgba(223, 185, 115, 0.35);
          padding-bottom: 9px;
          margin-bottom: 10px;
        }
        .inner-close-btn {
          background: rgba(214, 179, 114, 0.14);
          border: 1px solid var(--nat-vang);
          color: var(--nat-vang-sang);
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 9px;
          cursor: pointer;
          text-transform: none;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .inner-close-btn:hover {
          background: var(--nat-vang);
          color: #0e1217;
        }

        .inner-scroll-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
          overflow-y: auto;
          scrollbar-width: none;
          font-size: clamp(13px, 1.05vw + 9px, 15px);
          line-height: 1.66;
          text-align: left;
          color: var(--nat-testo);
          padding-right: 2px;
        }
        .inner-scroll-body::-webkit-scrollbar { display: none; }

        .body-para {
          margin: 0 0 10px;
          font-size: clamp(13px, 1.05vw + 9px, 15px);
          line-height: 1.66;
          color: var(--nat-testo);
        }

        .sync-passage-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          border-radius: 7px;
          padding: 10px 12px;
          margin-bottom: 0;
          border: 1px solid transparent;
          border-left: 2.5px solid transparent;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease;
        }
        .sync-passage-box:hover {
          background: rgba(223, 185, 115, 0.08);
          border-color: rgba(223, 185, 115, 0.28);
        }
        .sync-passage-box.is-reading-active {
          background: linear-gradient(90deg, rgba(223, 185, 115, 0.19) 0%, rgba(214, 230, 245, 0.08) 100%);
          border-color: rgba(223, 185, 115, 0.55);
          border-left: 3px solid var(--nat-vang-sang);
          box-shadow: 0 4px 16px rgba(214, 179, 114, 0.16), inset 0 0 12px rgba(223, 185, 115, 0.08);
        }
        .sync-passage-box.is-reading-active .data-card-compact,
        .sync-passage-box.is-reading-active .pillar-card {
          border-color: rgba(223, 185, 115, 0.45);
          background: linear-gradient(145deg, rgba(223, 185, 115, 0.12), var(--surface-card-bg));
        }

        .sync-reading-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 5px;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(223, 185, 115, 0.22);
          border: 1px solid var(--nat-vang);
          color: var(--nat-vang-sang);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: none;
        }

        .quote-text {
          font-size: 13px;
          line-height: 1.65;
          color: var(--nat-chiaro);
          margin: 0;
        }

        .data-list-stack {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 8px;
        }
        .subcard-two-col-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
          flex: 1;
          align-content: stretch;
        }
        .subcard-two-col-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px 12px;
          min-width: 0;
        }
        .data-card-compact {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--surface-card-bg);
          border: 1px solid rgba(223, 185, 115, 0.28);
          border-radius: 5px;
          padding: 9px 11px;
          text-align: left;
        }
        .data-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }
        .data-card-label {
          font-size: clamp(10.5px, 0.4vw + 9px, 12px);
          font-weight: 700;
          color: var(--nat-spento);
          text-transform: none;
        }
        .data-card-val {
          font-size: clamp(11.5px, 0.5vw + 9.5px, 13.5px);
          font-weight: 700;
          color: var(--nat-vang-sang);
        }
        .data-card-sub {
          font-size: clamp(11.5px, 0.55vw + 9.2px, 13.2px);
          line-height: 1.5;
          color: var(--nat-testo);
          margin-top: 2px;
        }
        .data-card-focus {
          font-size: clamp(11px, 0.45vw + 9px, 12.5px);
          font-weight: 700;
          color: var(--nat-ngan);
          margin-top: 4px;
        }
        .pillar-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--surface-card-bg);
          border: 1px solid rgba(223, 185, 115, 0.34);
          border-radius: 6px;
          padding: 11px 12px;
        }
        .pillar-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }
        .pillar-title {
          font-size: clamp(12.5px, 0.65vw + 10px, 14.5px);
          font-weight: 700;
          color: var(--nat-vang-sang);
        }
        .pillar-badge {
          font-size: clamp(10px, 0.35vw + 8.5px, 11.5px);
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(223, 185, 115, 0.16);
          border: 1px solid rgba(223, 185, 115, 0.45);
          color: var(--nat-chu-sa);
          white-space: nowrap;
        }
        .bullet-list-compact {
          flex: 1;
          margin: 4px 0 0;
          padding-left: 4px;
          list-style: none;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          gap: 6px;
          font-size: clamp(12px, 0.6vw + 9.8px, 14px);
          line-height: 1.55;
          color: var(--nat-chiaro);
        }
        .chart-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          align-content: stretch;
        }
        .chart-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--surface-card-bg);
          border: 1px solid rgba(223, 185, 115, 0.28);
          border-radius: 5px;
          padding: 8px 10px;
          font-size: clamp(11.5px, 0.5vw + 9.5px, 13px);
          line-height: 1.45;
          color: var(--nat-testo);
        }
        .chart-item b {
          color: var(--nat-vang-sang);
          display: block;
          font-size: clamp(10px, 0.35vw + 8.8px, 11.5px);
          letter-spacing: 0.4px;
          text-transform: none;
          margin-bottom: 2px;
        }

        .page-bagua-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .page-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-top: 9px;
          margin-top: 8px;
          border-top: 1px solid rgba(223, 185, 115, 0.28);
        }

        .page-number-tag {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: var(--nat-spento);
        }

        .page-nav-mini-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(223, 185, 115, 0.45);
          color: var(--nat-vang-sang);
          border-radius: 4px;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .page-nav-mini-btn:hover {
          background: rgba(223, 185, 115, 0.22);
          color: var(--nat-chiaro);
        }

        .nat-nome {
          display: block;
          font-size: clamp(14px, 0.8vw + 11.5px, 17px);
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: none;
          color: var(--nat-vang-sang);
          line-height: 1.25;
        }
        .tv-meta {
          display: block;
          margin-top: 2px;
          font-size: clamp(11px, 0.45vw + 9.5px, 12.8px);
          letter-spacing: 0.3px;
          color: var(--nat-spento);
        }
        .tv-highlight { color: var(--nat-chiaro); font-weight: 700; }
        .tv-gold { color: var(--nat-vang-sang); font-weight: 700; }
        .tv-red { color: var(--nat-chu-sa); font-weight: 700; }

        .nws-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .nws-backdrop {
          position: absolute;
          inset: 0;
          background: var(--modal-backdrop);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }
        .nws-window {
          position: relative;
          width: 400px;
          max-width: calc(100% - 24px);
          max-height: 92vh;
          overflow-y: auto;
          scrollbar-width: none;
          padding: 18px 20px;
          background: var(--modal-bg);
          border: 1.5px solid var(--book-border);
          border-radius: 8px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
          z-index: 2;
        }
        .nws-window::-webkit-scrollbar { display: none; }
        .nws-close {
          position: absolute;
          top: 8px;
          right: 12px;
          z-index: 3;
          background: none;
          border: none;
          padding: 4px 8px;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          color: var(--nat-spento);
          cursor: pointer;
        }
        .nws-close:hover { color: var(--nat-chu-sa); }

        .nlg {
          width: 350px;
          max-width: 100%;
          margin: 0 auto;
          padding: 10px 0 14px;
          text-align: center;
        }
        .nlg-visual-box {
          height: 155px;
          margin: 6px 14px 0;
          overflow: hidden;
          border: 3px double var(--book-border);
          border-radius: 6px;
          background: var(--visual-box-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nlg-title {
          margin: 14px 0 0;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.5px;
          text-transform: none;
          color: var(--nat-vang-sang);
        }
        .nlg-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0 0;
          padding: 0 14px;
          font-size: 12px;
          letter-spacing: 0.4px;
          color: var(--nat-chu-sa);
          font-weight: 700;
        }
        .nlg-sub::before, .nlg-sub::after { content: ''; flex: 1; height: 1px; }
        .nlg-sub::before { background: linear-gradient(to right, transparent, var(--book-border)); }
        .nlg-sub::after  { background: linear-gradient(to left, transparent, var(--book-border)); }

        .nlg-text {
          margin: 12px 0 0;
          padding: 0 12px;
          font-size: 13.5px;
          line-height: 1.65;
          text-align: left;
          color: var(--nat-testo);
        }
        .nlg-text b { color: var(--nat-vang-sang); }

        .khau-quyet-btn {
          background: none;
          border: none;
          margin-top: 12px;
          cursor: pointer;
          transition: transform 0.25s ease;
        }
        .khau-quyet-btn:hover { transform: scale(1.06); }
        .nlg-more-box {
          margin: 10px 12px 0;
          padding-top: 10px;
          border-top: 1px solid rgba(184, 139, 70, 0.35);
        }

        .nlg-gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 16px 12px 0;
        }
        .bagua-cell {
          aspect-ratio: 1 / 1;
          border: 1px solid var(--book-border);
          border-radius: 5px;
          background: var(--cell-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: all 0.25s ease;
        }
        .bagua-cell:hover {
          border-color: var(--nat-chu-sa);
          background: var(--cell-hover-bg);
          transform: translateY(-2px);
        }
        .bagua-glyph { font-size: 20px; line-height: 1; color: var(--nat-vang-sang); }
        .bagua-name { font-size: 11px; font-weight: 700; color: var(--nat-chiaro); margin-top: 3px; text-transform: none; }
        .bagua-elem { font-size: 9px; color: var(--nat-spento); }

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          transform-origin: center;
          animation: slowSpin 35s linear infinite;
        }

        @media (max-width: 520px) {
          .subcard-two-col-grid {
            gap: 7px;
          }
          .subcard-two-col-item {
            padding: 8px 9px;
          }
          .inner-scroll-body,
          .body-para {
            font-size: 14.5px;
            line-height: 1.62;
          }
          .nat-nome {
            font-size: 16px;
          }
          .tv-meta {
            font-size: 12px;
          }
          .data-card-sub,
          .bullet-list-compact,
          .chart-item {
            font-size: 13px;
          }
          .pillar-title {
            font-size: 14px;
          }
        }
      `}</style>

      <div
        className="nat-stage"
        style={{
          height: `${Math.round((isBookOpen ? 780 : 750) * scale)}px`,
        }}
      >
        <div
          className={`nat ${isPeekingOrTurning ? 'is-active' : ''} ${isBookOpen ? 'is-book-open' : ''}`}
          style={{ transform: scale < 1 ? `scale(${scale})` : 'none' }}
          tabIndex={0}
        >
          <CompassBackdrop />

          <TalismanPageFlip
            ref={pageFlipRef}
            pages={bookPages}
            onSpreadChange={handleSpreadChange}
            onWillOpenBook={handleWillOpenBook}
            onInteractionStateChange={setIsPeekingOrTurning}
          />
        </div>
      </div>

      {!isBookOpen && (
        <div className="relative z-10 mt-1.5 text-center px-2">
          <button
            type="button"
            onClick={() => pageFlipRef.current?.openBook()}
            className="px-3 py-1 rounded-full text-[11.5px] font-semibold border border-[rgba(212,175,106,0.45)] bg-[rgba(212,175,106,0.12)] text-[var(--nat-vang-sang)] hover:bg-[rgba(212,175,106,0.24)] transition-colors cursor-pointer"
          >
            Mở sách luận giải &amp; phát âm thanh
          </button>
        </div>
      )}

      <BookModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        isDark={effectiveDark}
      />
    </div>
  );
}
