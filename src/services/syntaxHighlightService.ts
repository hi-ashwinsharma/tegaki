import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-markdown';

export const highlightCode = (code: string, language: string): string => {
  const normalizedLang = (language || 'plaintext').toLowerCase();
  const grammar = Prism.languages[normalizedLang] || Prism.languages.javascript || Prism.languages.plaintext;
  if (!grammar) {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  try {
    return Prism.highlight(code, grammar, normalizedLang);
  } catch (err) {
    console.warn('Prism highlighting fallback:', err);
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
};

export const getCaretCharacterOffsetWithin = (element: Node): number => {
  let caretOffset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    try {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    } catch {
      caretOffset = 0;
    }
  }
  return caretOffset;
};

export const setCaretCharacterOffsetWithin = (element: Node, offset: number) => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  let currentOffset = 0;
  let found = false;

  function traverse(node: Node) {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length || 0;
      if (currentOffset + textLength >= offset) {
        range.setStart(node, Math.min(offset - currentOffset, textLength));
        range.collapse(true);
        found = true;
        return;
      }
      currentOffset += textLength;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
        if (found) break;
      }
    }
  }

  traverse(element);
  if (!found) {
    range.selectNodeContents(element);
    range.collapse(false);
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

export const highlightCodeElementInPlace = (codeEl: HTMLElement) => {
  const wrapper = codeEl.closest('.code-block-wrapper');
  const lang = wrapper?.getAttribute('data-language') || 'javascript';
  const rawText = codeEl.innerText || codeEl.textContent || '';

  if (!rawText.trim()) {
    codeEl.innerHTML = '';
    return;
  }

  const caretOffset = getCaretCharacterOffsetWithin(codeEl);
  const highlighted = highlightCode(rawText, lang);
  codeEl.innerHTML = highlighted;
  try {
    setCaretCharacterOffsetWithin(codeEl, caretOffset);
  } catch {
    // Caret catch
  }
};

export const highlightAllCodeBlocks = (container: HTMLElement | null) => {
  if (!container) return;
  const codeElements = container.querySelectorAll<HTMLElement>('.code-block-wrapper code');
  codeElements.forEach((codeEl) => {
    const wrapper = codeEl.closest('.code-block-wrapper');
    const lang = wrapper?.getAttribute('data-language') || 'javascript';
    const rawText = codeEl.innerText || codeEl.textContent || '';
    if (rawText.trim()) {
      codeEl.innerHTML = highlightCode(rawText, lang);
    }
  });
};
