import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const TRANSPARENT_PLACEHOLDER_URI =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export interface BlurUpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 'eager' skips IntersectionObserver gating for above-the-fold heroes/avatars */
  priority?: 'eager' | 'lazy';
  /**
   * 'cover' adds a soft frosted shimmer surface while loading (photos, banners, wallpapers);
   * 'contain' keeps backgrounds transparent during blur-up (logos, transparent 3D cutouts)
   */
  variant?: 'cover' | 'contain';
  /** Secondary fallback URL tried automatically before invoking external onError */
  fallbackSrc?: string;
  /** IntersectionObserver rootMargin for predictive lazy preloading */
  rootMargin?: string;
  /** Optional custom scrollable root container (e.g. horizontal filmstrips) */
  rootRef?: React.RefObject<HTMLElement | null>;
  /** Optional callback whenever decode completion changes */
  onReadyChange?: (loaded: boolean) => void;
}

/**
 * Unified lazy-loading + blur-up placeholder image component.
 * Uses IntersectionObserver gating + async decoding + smooth CSS blur-up reveal
 * while preserving direct <img> geometry (zero wrapper layout side-effects).
 */
export const BlurUpImage = React.forwardRef<HTMLImageElement, BlurUpImageProps>(
  (
    {
      src,
      fallbackSrc,
      priority = 'lazy',
      variant = 'cover',
      rootMargin = '220px 0px',
      rootRef,
      loading,
      decoding = 'async',
      referrerPolicy = 'no-referrer',
      className,
      onLoad,
      onError,
      onReadyChange,
      ...rest
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLImageElement | null>(null);
    const [activeSrc, setActiveSrc] = useState<string>(src || '');
    const [shouldLoad, setShouldLoad] = useState<boolean>(priority === 'eager' || loading === 'eager');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const triedFallbackRef = useRef<boolean>(false);

    useEffect(() => {
      setActiveSrc(src || '');
      setIsLoaded(false);
      triedFallbackRef.current = false;
    }, [src]);

    useEffect(() => {
      if (priority === 'eager' || loading === 'eager') {
        setShouldLoad(true);
        return;
      }
      if (shouldLoad) return;

      const el = innerRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') {
        setShouldLoad(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              setShouldLoad(true);
              observer.disconnect();
              break;
            }
          }
        },
        {
          root: rootRef?.current || null,
          rootMargin,
          threshold: 0.01,
        }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [priority, loading, shouldLoad, rootMargin, rootRef]);

    useEffect(() => {
      if (!shouldLoad || !activeSrc) return;
      const el = innerRef.current;
      if (el && el.complete && el.naturalWidth > 0 && el.currentSrc) {
        setIsLoaded(true);
        onReadyChange?.(true);
      }
    }, [shouldLoad, activeSrc, onReadyChange]);

    const setRefs = (node: HTMLImageElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!shouldLoad || img.getAttribute('src') === TRANSPARENT_PLACEHOLDER_URI) {
        return;
      }
      const finalize = () => {
        setIsLoaded(true);
        onReadyChange?.(true);
        onLoad?.(e);
      };

      if (typeof img.decode === 'function') {
        img
          .decode()
          .then(finalize)
          .catch(finalize);
      } else {
        finalize();
      }
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (!shouldLoad) return;
      if (fallbackSrc && !triedFallbackRef.current && activeSrc !== fallbackSrc) {
        triedFallbackRef.current = true;
        setIsLoaded(false);
        setActiveSrc(fallbackSrc);
        return;
      }
      setIsLoaded(true);
      onReadyChange?.(true);
      onError?.(e);
    };

    const resolvedSrc = shouldLoad && activeSrc ? activeSrc : TRANSPARENT_PLACEHOLDER_URI;

    return (
      <img
        ref={setRefs}
        src={resolvedSrc}
        loading={priority === 'eager' ? 'eager' : loading || 'lazy'}
        decoding={decoding}
        referrerPolicy={referrerPolicy}
        data-blur-up="true"
        data-blur-variant={variant}
        data-blur-loaded={isLoaded ? 'true' : 'false'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn('blur-up-media', className)}
        {...rest}
      />
    );
  }
);

BlurUpImage.displayName = 'BlurUpImage';
