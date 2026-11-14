export const AUDIO_PREF_EVENT = 'hungthai_audio_pref_change';

export function getSavedMutedPref(defaultVal: boolean = true): boolean {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const saved = localStorage.getItem('hungthai_audio_muted');
    if (saved !== null) {
      return saved === 'true';
    }
  } catch {}
  return defaultVal;
}

export function saveMutedPref(muted: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('hungthai_audio_muted', String(muted));
    window.dispatchEvent(
      new CustomEvent(AUDIO_PREF_EVENT, { detail: { muted } })
    );
  } catch {}
}
