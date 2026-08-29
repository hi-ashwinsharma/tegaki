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

export const handleCodeBlockEnter = (codeEl: HTMLElement) => {
  const codeText = codeEl.innerText || codeEl.textContent || '';
  const offset = getCaretCharacterOffsetWithin(codeEl);

  const textBefore = codeText.slice(0, offset);
  const textAfter = codeText.slice(offset);

  const linesBefore = textBefore.split('\n');
  const currentLine = linesBefore[linesBefore.length - 1] || '';

  // Calculate indentation of current line
  const indentMatch = currentLine.match(/^[ \t]*/);
  const currentIndent = indentMatch ? indentMatch[0] : '';

  const trimmedLine = currentLine.trimEnd();
  const isBlockOpener =
    trimmedLine.endsWith('{') ||
    trimmedLine.endsWith(':') ||
    trimmedLine.endsWith('(') ||
    trimmedLine.endsWith('[');

  const isBetweenBrackets =
    (trimmedLine.endsWith('{') && textAfter.trimStart().startsWith('}')) ||
    (trimmedLine.endsWith('(') && textAfter.trimStart().startsWith(')')) ||
    (trimmedLine.endsWith('[') && textAfter.trimStart().startsWith(']'));

  let insertionText = '\n' + currentIndent;
  let newCursorOffset = offset + 1 + currentIndent.length;

  if (isBetweenBrackets) {
    const extraIndent = currentIndent + '  ';
    insertionText = '\n' + extraIndent + '\n' + currentIndent;
    newCursorOffset = offset + 1 + extraIndent.length;
  } else if (isBlockOpener) {
    const extraIndent = currentIndent + '  ';
    insertionText = '\n' + extraIndent;
    newCursorOffset = offset + 1 + extraIndent.length;
  }

  const newCodeText = textBefore + insertionText + textAfter;
  const lang = codeEl.closest('.code-block-wrapper')?.getAttribute('data-language') || 'javascript';

  codeEl.innerHTML = highlightCode(newCodeText, lang);
  setCaretCharacterOffsetWithin(codeEl, newCursorOffset);
};

export const handleCodeBlockTab = (codeEl: HTMLElement, isShift: boolean) => {
  const codeText = codeEl.innerText || codeEl.textContent || '';
  const offset = getCaretCharacterOffsetWithin(codeEl);

  if (isShift) {
    const textBefore = codeText.slice(0, offset);
    const textAfter = codeText.slice(offset);
    const linesBefore = textBefore.split('\n');
    const currentLineIndex = linesBefore.length - 1;
    let currentLine = linesBefore[currentLineIndex];

    let removedSpaces = 0;
    if (currentLine.startsWith('  ')) {
      currentLine = currentLine.slice(2);
      removedSpaces = 2;
    } else if (currentLine.startsWith(' ')) {
      currentLine = currentLine.slice(1);
      removedSpaces = 1;
    }

    if (removedSpaces > 0) {
      linesBefore[currentLineIndex] = currentLine;
      const newTextBefore = linesBefore.join('\n');
      const newCodeText = newTextBefore + textAfter;
      const lang = codeEl.closest('.code-block-wrapper')?.getAttribute('data-language') || 'javascript';
      codeEl.innerHTML = highlightCode(newCodeText, lang);
      setCaretCharacterOffsetWithin(codeEl, Math.max(0, offset - removedSpaces));
    }
    return;
  }

  const textBefore = codeText.slice(0, offset);
  const textAfter = codeText.slice(offset);
  const newCodeText = textBefore + '  ' + textAfter;
  const lang = codeEl.closest('.code-block-wrapper')?.getAttribute('data-language') || 'javascript';
  codeEl.innerHTML = highlightCode(newCodeText, lang);
  setCaretCharacterOffsetWithin(codeEl, offset + 2);
};

export const handleCodeBlockBackspace = (codeEl: HTMLElement): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return false;

  const codeText = codeEl.innerText || codeEl.textContent || '';
  const offset = getCaretCharacterOffsetWithin(codeEl);

  const textBefore = codeText.slice(0, offset);
  const linesBefore = textBefore.split('\n');
  const currentLine = linesBefore[linesBefore.length - 1];

  // If cursor is on leading spaces and ends with at least 2 spaces
  if (currentLine.length >= 2 && /^[ ]+$/.test(currentLine) && currentLine.endsWith('  ')) {
    const newTextBefore = codeText.slice(0, offset - 2);
    const textAfter = codeText.slice(offset);
    const newCodeText = newTextBefore + textAfter;
    const lang = codeEl.closest('.code-block-wrapper')?.getAttribute('data-language') || 'javascript';
    codeEl.innerHTML = highlightCode(newCodeText, lang);
    setCaretCharacterOffsetWithin(codeEl, offset - 2);
    return true;
  }
  return false;
};
