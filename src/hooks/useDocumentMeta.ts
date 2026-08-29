import { useEffect } from 'react';

/**
 * Hook to dynamically synchronize document.title with automatic cleanup
 */
export function useDocumentMeta(title?: string) {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    document.title = `${title} — Tegaki`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
