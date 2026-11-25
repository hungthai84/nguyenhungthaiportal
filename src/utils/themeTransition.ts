export type ThemeTransitionDirection = 'to-dark' | 'to-light' | 'switch';

let crossFadeResetTimer: number | null = null;

/**
 * Triggers a brief, GPU-friendly synchronized cross-fade transition attribute on <html>
 * when switching between theme styles or light/dark modes.
 */
export function triggerThemeCrossFade(
  durationMs = 340,
  direction: ThemeTransitionDirection = 'switch'
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
  } catch {
    // ignore media query errors
  }

  const root = document.documentElement;
  if (crossFadeResetTimer !== null) {
    window.clearTimeout(crossFadeResetTimer);
    crossFadeResetTimer = null;
  }

  root.setAttribute('data-theme-transitioning', 'true');
  root.setAttribute('data-theme-transition-dir', direction);
  crossFadeResetTimer = window.setTimeout(() => {
    root.removeAttribute('data-theme-transitioning');
    root.removeAttribute('data-theme-transition-dir');
    crossFadeResetTimer = null;
  }, durationMs);
}
