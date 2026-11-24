import React from 'react';

export function useToast() {
  const showToast = (msg: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hungthai_toast', { detail: { message: msg } }));
    }
  };

  return { showToast };
}
