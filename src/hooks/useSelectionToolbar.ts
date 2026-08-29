import { useState, useEffect, type RefObject } from 'react';

export interface ToolbarPosition {
  top: number;
  left: number;
}

/**
 * Hook to track text selection range and compute centered floating toolbar coordinates
 */
export function useSelectionToolbar(containerRef: RefObject<HTMLElement | null>) {
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !containerRef.current) {
        setToolbarPosition(null);
        return;
      }

      // Ensure selection is inside the container element
      if (!containerRef.current.contains(selection.anchorNode)) {
        setToolbarPosition(null);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0) {
          setToolbarPosition({
            top: rect.top,
            left: rect.left + rect.width / 2,
          });
        } else {
          setToolbarPosition(null);
        }
      } catch {
        setToolbarPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [containerRef]);

  return { toolbarPosition, setToolbarPosition };
}
