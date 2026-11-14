export interface CategoryTheme {
  color: string;
  glow: string;
  badgeBg: string;
}

export function getCategoryTheme(companyName: string = ''): CategoryTheme {
  const norm = companyName.toLowerCase();

  if (norm.includes('mobifone') || norm.includes('v247')) {
    return {
      color: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.45)',
      badgeBg: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300',
    };
  }
  if (norm.includes('ved') || norm.includes('garena') || norm.includes('shopee')) {
    return {
      color: '#ed1c24',
      glow: 'rgba(237, 28, 36, 0.45)',
      badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300',
    };
  }
  if (norm.includes('prudential')) {
    return {
      color: '#e11d48',
      glow: 'rgba(225, 29, 72, 0.45)',
      badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300',
    };
  }
  if (norm.includes('momo') || norm.includes('finviet') || norm.includes('eco')) {
    return {
      color: '#db2777',
      glow: 'rgba(219, 39, 119, 0.45)',
      badgeBg: 'bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300',
    };
  }

  return {
    color: '#4f46e5',
    glow: 'rgba(79, 70, 229, 0.45)',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300',
  };
}
