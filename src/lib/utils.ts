export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCardTitle(title: string): string {
  if (!title) return '';
  return title;
}

export function formatSentenceFourWords(title: string): string {
  if (!title) return '';
  const cleaned = title
    .replace(/^\d+(?:\.\d+)?\s*[·.:-]?\s*/, '')
    .replace(/[—–-]/g, ' ')
    .replace(/&/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 4);
  if (words.length === 0) return '';
  const joined = words.join(' ').toLocaleLowerCase('vi-VN');
  return joined.charAt(0).toLocaleUpperCase('vi-VN') + joined.slice(1);
}
