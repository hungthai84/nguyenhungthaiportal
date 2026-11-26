/**
 * Tự động nén và chuẩn hóa định dạng ảnh sang WebP cho cả:
 * 1) Hình ảnh tải lên từ thiết bị người dùng (Canvas/ImageBitmap -> image/webp)
 * 2) Hình ảnh hiển thị từ URL bên ngoài (CDN native WebP hoặc /api/media/webp)
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface CompressedWebPResult {
  dataUrl: string;
  blob: Blob;
  mimeType: string;
  originalBytes: number;
  compressedBytes: number;
  savingsPercent: number;
  width: number;
  height: number;
}

export interface WebPUrlOptions {
  width?: number;
  quality?: number;
  preserveAnimation?: boolean;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Failed to read image blob'));
    reader.readAsDataURL(blob);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode uploaded image'));
    img.src = src;
  });
}

/**
 * Nén tệp hình ảnh tải lên sang định dạng WebP tối ưu dung lượng & tốc độ tải trang.
 * Giữ nguyên ảnh động GIF và vector SVG để không làm mất hoạt ảnh hoặc độ sắc nét vector.
 */
export async function compressImageFileToWebP(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressedWebPResult> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.82 } = options;

  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const dataUrl = await readBlobAsDataUrl(file);
    return {
      dataUrl,
      blob: file,
      mimeType: file.type,
      originalBytes: file.size,
      compressedBytes: file.size,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  }

  let sourceWidth = 0;
  let sourceHeight = 0;
  let drawSource: CanvasImageSource | null = null;
  let bitmapToClose: ImageBitmap | null = null;
  let objectUrlToRevoke: string | null = null;

  try {
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      bitmapToClose = bitmap;
      drawSource = bitmap;
      sourceWidth = bitmap.width;
      sourceHeight = bitmap.height;
    } else {
      objectUrlToRevoke = URL.createObjectURL(file);
      const img = await loadImageElement(objectUrlToRevoke);
      drawSource = img;
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
    }

    if (!drawSource || sourceWidth <= 0 || sourceHeight <= 0) {
      throw new Error('Invalid image dimensions');
    }

    const scaleRatio = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const targetWidth = Math.max(1, Math.round(sourceWidth * scaleRatio));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scaleRatio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(drawSource, 0, 0, targetWidth, targetHeight);

    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP encoding returned null blob'));
        },
        'image/webp',
        Math.min(0.95, Math.max(0.45, quality))
      );
    });

    // If original was already smaller WebP at exact same bounds, keep original blob
    const finalBlob =
      file.type === 'image/webp' && targetWidth === sourceWidth && file.size < webpBlob.size
        ? file
        : webpBlob;

    const dataUrl = await readBlobAsDataUrl(finalBlob);
    const savingsPercent =
      file.size > 0
        ? Math.max(0, Math.round(((file.size - finalBlob.size) / file.size) * 100))
        : 0;

    return {
      dataUrl,
      blob: finalBlob,
      mimeType: 'image/webp',
      originalBytes: file.size,
      compressedBytes: finalBlob.size,
      savingsPercent,
      width: targetWidth,
      height: targetHeight,
    };
  } catch {
    // Fallback gracefully to direct DataURL if browser canvas decoding fails
    const dataUrl = await readBlobAsDataUrl(file);
    return {
      dataUrl,
      blob: file,
      mimeType: file.type || 'image/png',
      originalBytes: file.size,
      compressedBytes: file.size,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  } finally {
    if (bitmapToClose) {
      try {
        bitmapToClose.close();
      } catch {
        // ignore
      }
    }
    if (objectUrlToRevoke) {
      try {
        URL.revokeObjectURL(objectUrlToRevoke);
      } catch {
        // ignore
      }
    }
  }
}

const KNOWN_ANIMATED_DRIVE_IDS = new Set([
  '1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm', // Avata Hùng Thái.gif
  '1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ', // Avata AI hỗ trợ.gif
]);

/**
 * Chuẩn hóa URL hình ảnh sang WebP tự động để tăng tốc độ tải trang:
 * - Giữ nguyên DataURL WebP/SVG/GIF, blob:, .svg, .gif, .webp
 * - Google Drive / lh3.googleusercontent.com -> dùng chuẩn =w{width}-rw (WebP native CDN)
 * - Unsplash -> ép fm=webp&auto=format&q={quality}&w={width}
 * - URL ngoài khác (.png/.jpg/.jpeg/.bmp) -> chuyển qua /api/media/webp để server nén WebP & cache
 */
export function toOptimizedWebPUrl(rawUrl: string, options: WebPUrlOptions = {}): string {
  const { width = 1280, quality = 82, preserveAnimation = false } = options;
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;

  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/api/media/webp')
  ) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.includes('.svg') ||
    lower.includes('.gif') ||
    preserveAnimation
  ) {
    return trimmed;
  }

  // Giữ nguyên các URL đã có đuôi .webp rõ ràng trừ khi cần resize qua server
  if (/\.webp(\?.*)?$/i.test(lower)) {
    return trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return trimmed;
  }

  if (parsed.protocol !== 'https:') {
    return trimmed;
  }

  // Google Drive thumbnail URL -> lh3 WebP CDN
  if (parsed.hostname === 'drive.google.com' && parsed.pathname.includes('/thumbnail')) {
    const fileId = parsed.searchParams.get('id');
    if (fileId) {
      if (KNOWN_ANIMATED_DRIVE_IDS.has(fileId)) return trimmed;
      const safeW = Math.min(2048, Math.max(160, Math.round(width)));
      return `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w${safeW}-rw`;
    }
  }

  // Googleusercontent CDN (non-GIF) -> ép định dạng WebP native (-rw)
  if (parsed.hostname === 'lh3.googleusercontent.com' && parsed.pathname.startsWith('/d/')) {
    const seg = parsed.pathname.slice(3).split('=')[0];
    if (KNOWN_ANIMATED_DRIVE_IDS.has(seg)) {
      return trimmed;
    }
    const safeW = Math.min(2048, Math.max(160, Math.round(width)));
    if (!parsed.pathname.includes('=')) {
      return `https://lh3.googleusercontent.com/d/${seg}=w${safeW}-rw`;
    }
    return trimmed;
  }

  // Unsplash CDN native WebP
  if (parsed.hostname === 'images.unsplash.com') {
    parsed.searchParams.set('fm', 'webp');
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('q', String(Math.min(95, Math.max(50, Math.round(quality)))));
    if (!parsed.searchParams.has('w')) {
      parsed.searchParams.set('w', String(Math.min(2048, Math.max(200, Math.round(width)))));
    }
    return parsed.toString();
  }

  // Các URL ảnh ngoài khác (.png, .jpg, .jpeg, .bmp...) -> định tuyến qua endpoint nén WebP của server
  const safeW = Math.min(1920, Math.max(160, Math.round(width)));
  const safeQ = Math.min(92, Math.max(55, Math.round(quality)));
  return `/api/media/webp?url=${encodeURIComponent(trimmed)}&w=${safeW}&q=${safeQ}`;
}

/**
 * Fallback an toàn về URL gốc nếu /api/media/webp gặp lỗi mạng hoặc nguồn bị chặn
 */
export function fallbackFromWebPProxy(currentSrc: string): string | null {
  if (!currentSrc || !currentSrc.includes('/api/media/webp')) return null;
  try {
    const parsed = new URL(currentSrc, typeof window !== 'undefined' ? window.location.origin : 'https://localhost');
    return parsed.searchParams.get('url');
  } catch {
    return null;
  }
}
