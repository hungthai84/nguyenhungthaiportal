export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCardTitle(title: string): string {
  if (!title) return '';
  return title;
}
