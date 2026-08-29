import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Article } from '../../types/article';
import { WriterHeader } from './WriterHeader';
import { InlineToolbar } from './InlineToolbar';
import { PlusMenu } from './PlusMenu';
import { PublishModal } from './PublishModal';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';
import { useSelectionToolbar } from '../../hooks/useSelectionToolbar';
import { calculateWordCount, calculateReadingTime } from '../../utils/textMetrics';
import { generateAndUploadOgImage } from '../../services/ogCanvasService';
import { CODE_LANGUAGES, getCodePlaceholder } from '../../utils/codeLanguages';
import {
  highlightAllCodeBlocks,
  highlightCodeElementInPlace,
  highlightInlineCodeElement,
  highlightCode,
  handleCodeBlockEnter,
  handleCodeBlockTab,
  handleCodeBlockBackspace,
  handleInlineCodeKeyDown,
} from '../../services/syntaxHighlightService';
import { generateEmbedHtml, fetchUrlPreview, type UrlPreviewMetadata } from '../../services/embedService';

const isCustomBlockElement = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  return Boolean(
    el.matches?.(
      '.embed-card-wrapper, .embed-video-wrapper, .code-block-wrapper, figure, hr, .editorial-divider, [contenteditable="false"]'
    )
  );
};

const generateCodeBlockHtml = (language = 'javascript', title = '') => {
  const placeholder = getCodePlaceholder(language);
  const optionsHtml = CODE_LANGUAGES.map(
    (lang) =>
      `<option value="${lang.value}" ${lang.value === language ? 'selected="selected"' : ''}>${lang.label}</option>`
  ).join('');

  const safeTitle = title.replace(/"/g, '&quot;');

  return `
    <div class="code-block-wrapper" data-language="${language}" data-title="${safeTitle}">
      <div class="code-block-header" contenteditable="false">
        <div class="code-block-header-left">
          <span class="code-lang-dot"></span>
          <select class="code-lang-select" aria-label="Select code language" contenteditable="false">
            ${optionsHtml}
          </select>
          <span class="code-title-separator">•</span>
          <input type="text" class="code-title-input" placeholder="Filename (optional)" value="${safeTitle}" aria-label="Code title" contenteditable="false" />
        </div>
        <button type="button" class="code-copy-btn" contenteditable="false" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText).then(()=>{this.innerText='Copied!';setTimeout(()=>{this.innerText='Copy'},2000)})">Copy</button>
      </div>
      <pre class="code-block-pre"><code class="language-${language} code-content" contenteditable="true" spellcheck="false" data-placeholder="${placeholder}"></code></pre>
    </div>
    <p><br></p>
  `;
};

interface WriterEditorProps {
  initialArticle?: Article | null;
  onBack: () => void;
  onSaved: (article: Article) => void;
}

export const WriterEditor: React.FC<WriterEditorProps> = ({
  initialArticle,
  onBack,
  onSaved,
}) => {
  const { user } = useAuth();
  const { createArticle, updateArticle, decryptJournal } = useArticles();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'published'>(
    initialArticle?.visibility || 'private'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Plus menu state
  const [plusMenuTop, setPlusMenuTop] = useState(4);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const savedTargetElementRef = useRef<HTMLElement | null>(null);

  // Floating toolbar state powered by custom hook
  const { toolbarPosition } = useSelectionToolbar(editorRef);

  const adjustTitleHeight = () => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      if (titleRef.current.scrollHeight > 0) {
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      }
    }
  };

  const adjustSubtitleHeight = () => {
    if (subtitleRef.current) {
      subtitleRef.current.style.height = 'auto';
      if (subtitleRef.current.scrollHeight > 0) {
        subtitleRef.current.style.height = `${subtitleRef.current.scrollHeight}px`;
      }
    }
  };

  const syncCodeSelectValues = () => {
    if (editorRef.current) {
      editorRef.current.querySelectorAll<HTMLSelectElement>('.code-lang-select').forEach((select) => {
        const wrapper = select.closest('.code-block-wrapper');
        const lang = wrapper?.getAttribute('data-language');
        if (lang) {
          select.value = lang;
        }
      });
      editorRef.current.querySelectorAll<HTMLInputElement>('.code-title-input').forEach((input) => {
        const wrapper = input.closest('.code-block-wrapper');
        const titleVal = wrapper?.getAttribute('data-title');
        if (titleVal !== null && titleVal !== undefined) {
          input.value = titleVal;
        }
      });
      highlightAllCodeBlocks(editorRef.current);
    }
  };

  // Initial decrypted content loading
  useEffect(() => {
    async function loadContent() {
      if (initialArticle) {
        if (initialArticle.isEncrypted) {
          const dec = await decryptJournal(initialArticle);
          setContent(dec);
          if (editorRef.current) {
            editorRef.current.innerHTML = dec;
            syncCodeSelectValues();
          }
        } else {
          setContent(initialArticle.content);
          if (editorRef.current) {
            editorRef.current.innerHTML = initialArticle.content;
            syncCodeSelectValues();
          }
        }
      } else {
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      }
    }
    loadContent();
  }, [initialArticle, decryptJournal]);

  // Adjust title and subtitle heights on mount / text change
  useEffect(() => {
    adjustTitleHeight();
    adjustSubtitleHeight();
  }, [title, subtitle]);

  // Track cursor position for plus menu
  const updatePlusMenuPosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    if (selection.rangeCount === 0) return;
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    savedRangeRef.current = range.cloneRange();

    let anchorNode: Node | null = selection.anchorNode;
    if (anchorNode?.nodeType === Node.TEXT_NODE) {
      anchorNode = anchorNode.parentElement;
    }
    if (anchorNode instanceof HTMLElement && editorRef.current.contains(anchorNode)) {
      savedTargetElementRef.current = anchorNode.closest('p, div, blockquote, h1, h2, h3, figure') as HTMLElement | null;
    }

    const editorRect = editorRef.current.getBoundingClientRect();
    let rect = range.getBoundingClientRect();

    // Fallback if range bounding rect is collapsed/zero (e.g. empty line or fresh focus)
    if (rect.height === 0 || (rect.top === 0 && rect.bottom === 0)) {
      const clientRects = range.getClientRects();
      if (clientRects.length > 0) {
        rect = clientRects[0];
      } else {
        let node: Node | null = selection.anchorNode;
        if (node?.nodeType === Node.TEXT_NODE) {
          node = node.parentElement;
        }
        if (node && node instanceof HTMLElement && node !== editorRef.current && editorRef.current.contains(node)) {
          rect = node.getBoundingClientRect();
        }
      }
    }

    if (rect.height > 0 && rect.top >= editorRect.top - 100 && rect.bottom <= editorRect.bottom + 500) {
      // Center the 28px button vertically with the line of text
      const computedTop = rect.top - editorRect.top + (rect.height - 28) / 2;
      setPlusMenuTop(Math.max(0, computedTop));
    } else {
      setPlusMenuTop(4);
    }
  }, []);

  // Handle dynamic language dropdown and title input changes inside code blocks
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('code-lang-select')) {
        const select = target as HTMLSelectElement;
        const newLang = select.value;
        const wrapper = select.closest('.code-block-wrapper');
        if (wrapper) {
          wrapper.setAttribute('data-language', newLang);
          const codeEl = wrapper.querySelector<HTMLElement>('code');
          if (codeEl) {
            codeEl.className = `language-${newLang} code-content`;
            codeEl.setAttribute('data-placeholder', getCodePlaceholder(newLang));
            highlightCodeElementInPlace(codeEl);
          }
          Array.from(select.options).forEach((opt) => {
            if (opt.value === newLang) {
              opt.setAttribute('selected', 'selected');
            } else {
              opt.removeAttribute('selected');
            }
          });
          setContent(editor.innerHTML);
          setHasUnsavedChanges(true);
        }
      }
    };

    const handleTitleInputChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('code-title-input')) {
        const input = target as HTMLInputElement;
        input.setAttribute('value', input.value);
        const wrapper = input.closest('.code-block-wrapper');
        if (wrapper) {
          wrapper.setAttribute('data-title', input.value);
        }
        setContent(editor.innerHTML);
        setHasUnsavedChanges(true);
      }
    };

    const handleBlockClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const removeBtn = target.closest('.block-remove-btn');
      if (removeBtn && editor.contains(removeBtn)) {
        e.preventDefault();
        e.stopPropagation();
        const wrapper = removeBtn.closest(
          '.embed-card-wrapper, .embed-video-wrapper, .code-block-wrapper, figure, hr, .editorial-divider'
        );
        if (wrapper && editor.contains(wrapper)) {
          wrapper.remove();
          setContent(editor.innerHTML);
          setHasUnsavedChanges(true);
          updatePlusMenuPosition();
        }
      }
    };

    editor.addEventListener('change', handleSelectChange);
    editor.addEventListener('input', handleTitleInputChange);
    editor.addEventListener('click', handleBlockClick);
    return () => {
      editor.removeEventListener('change', handleSelectChange);
      editor.removeEventListener('input', handleTitleInputChange);
      editor.removeEventListener('click', handleBlockClick);
    };
  }, [updatePlusMenuPosition]);

  // Listen to document selection change to reposition plus menu dynamically
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && editorRef.current && editorRef.current.contains(selection.anchorNode)) {
        updatePlusMenuPosition();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updatePlusMenuPosition]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
    adjustTitleHeight();
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubtitle(e.target.value);
    setHasUnsavedChanges(true);
    adjustSubtitleHeight();
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    let node: Node | null = selection?.anchorNode || null;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    // Live syntax highlighting inside active fenced code block
    const codeEl = node && (node.nodeName === 'CODE' ? (node as HTMLElement) : (node as HTMLElement).closest?.('code'));
    if (codeEl && codeEl.classList.contains('code-content')) {
      highlightCodeElementInPlace(codeEl);
    }

    // Live syntax highlighting inside active inline code
    const inlineCodeEl = node instanceof HTMLElement ? (node.closest('code:not(.code-content)') as HTMLElement | null) : null;
    if (inlineCodeEl) {
      highlightInlineCodeElement(inlineCodeEl);
    }

    setContent(editorRef.current.innerHTML);
    setHasUnsavedChanges(true);
    updatePlusMenuPosition();
  };

  const handleEditorBlur = () => {
    if (editorRef.current) {
      highlightAllCodeBlocks(editorRef.current);
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (subtitleRef.current) {
        subtitleRef.current.focus();
      } else if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const handleSubtitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const calculateWords = () => {
    return calculateWordCount(title + ' ' + subtitle + ' ' + content);
  };

  // Formatting actions
  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
  };

  const handleToggleInlineCode = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const inlineCodeEl = node instanceof HTMLElement ? (node.closest('code:not(.code-content)') as HTMLElement | null) : null;

    if (inlineCodeEl) {
      // Toggle off: unwrap inline code to plain text
      const textNode = document.createTextNode(inlineCodeEl.textContent || '');
      inlineCodeEl.parentNode?.replaceChild(textNode, inlineCodeEl);
      const newRange = document.createRange();
      newRange.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else if (!selection.isCollapsed) {
      // Wrap selected text in inline code with live syntax highlighting
      const selectedText = range.toString();
      const code = document.createElement('code');
      code.className = 'inline-code';
      code.innerHTML = highlightCode(selectedText, 'javascript');

      range.deleteContents();
      range.insertNode(code);

      const space = document.createTextNode('\u00A0');
      code.after(space);

      const newRange = document.createRange();
      newRange.setStartAfter(code);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
  };

  const handleToggleQuote = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    let node: Node | null = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const quoteEl = node instanceof HTMLElement ? (node.closest('blockquote') as HTMLElement | null) : null;

    if (quoteEl) {
      // Toggle off: replace blockquote with regular paragraph
      const p = document.createElement('p');
      p.innerHTML = quoteEl.innerHTML.trim() ? quoteEl.innerHTML : '<br>';
      quoteEl.parentNode?.replaceChild(p, quoteEl);
      const range = document.createRange();
      range.selectNodeContents(p);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      document.execCommand('formatBlock', false, '<blockquote>');
    }

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
  };

  // Plus menu insertions
  const insertHtmlAtCursor = (html: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    editor.focus();

    const selection = window.getSelection();

    // 1. Determine target block element using multiple robust fallback strategies:
    let targetBlock: HTMLElement | null = null;

    // Strategy A: Direct saved target element from cursor/plus tracking
    if (savedTargetElementRef.current && editor.contains(savedTargetElementRef.current)) {
      targetBlock = savedTargetElementRef.current;
    }

    // Strategy B: From active Selection Range
    if (!targetBlock && selection && selection.rangeCount > 0) {
      const activeNode = selection.anchorNode;
      if (activeNode && editor.contains(activeNode)) {
        const el = activeNode.nodeType === Node.TEXT_NODE ? activeNode.parentElement : (activeNode as HTMLElement);
        if (el && el !== editor) {
          targetBlock = el.closest('p, div, blockquote, h1, h2, h3, figure') as HTMLElement | null;
        }
      }
    }

    // Strategy C: Saved Range
    if (!targetBlock && savedRangeRef.current && editor.contains(savedRangeRef.current.commonAncestorContainer)) {
      const ancestor = savedRangeRef.current.commonAncestorContainer;
      const el = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentElement : (ancestor as HTMLElement);
      if (el && el !== editor) {
        targetBlock = el.closest('p, div, blockquote, h1, h2, h3, figure') as HTMLElement | null;
      }
    }

    // Strategy D: Find block by plusMenuTop position
    if (!targetBlock) {
      const children = Array.from(editor.children) as HTMLElement[];
      if (children.length > 0) {
        const editorRect = editor.getBoundingClientRect();
        let closestChild: HTMLElement | null = null;
        let minDiff = Infinity;
        for (const child of children) {
          const childRect = child.getBoundingClientRect();
          const childTop = childRect.top - editorRect.top;
          const diff = Math.abs(childTop - plusMenuTop);
          if (diff < minDiff) {
            minDiff = diff;
            closestChild = child;
          }
        }
        targetBlock = closestChild;
      }
    }

    // 2. Parse the HTML fragment to insert
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();

    // Ensure there is always a trailing paragraph for typing
    if (!temp.querySelector('p:last-child')) {
      const trailingP = document.createElement('p');
      trailingP.innerHTML = '<br>';
      temp.appendChild(trailingP);
    }

    let trailingParagraph: HTMLElement | null = null;

    if (targetBlock && targetBlock !== editor && targetBlock.parentNode === editor) {
      const isEmpty = !targetBlock.textContent || targetBlock.textContent.trim() === '';

      if (isEmpty) {
        // Replace empty line directly
        let lastInserted: Node | null = null;
        while (temp.firstChild) {
          lastInserted = temp.firstChild;
          editor.insertBefore(temp.firstChild, targetBlock);
        }
        targetBlock.remove();

        if (lastInserted && lastInserted instanceof HTMLElement) {
          trailingParagraph = lastInserted.nodeName === 'P' ? lastInserted : lastInserted.querySelector('p');
        }
      } else {
        // Insert right after the non-empty block
        const insertRef: Node | null = targetBlock.nextSibling;
        let lastInserted: Node | null = null;
        while (temp.firstChild) {
          lastInserted = temp.firstChild;
          if (insertRef) {
            editor.insertBefore(temp.firstChild, insertRef);
          } else {
            editor.appendChild(temp.firstChild);
          }
        }
        if (lastInserted && lastInserted instanceof HTMLElement) {
          trailingParagraph = lastInserted.nodeName === 'P' ? lastInserted : lastInserted.querySelector('p');
        }
      }
    } else {
      // Fallback: append to end of editor
      let lastInserted: Node | null = null;
      while (temp.firstChild) {
        lastInserted = temp.firstChild;
        editor.appendChild(temp.firstChild);
      }
      if (lastInserted && lastInserted instanceof HTMLElement) {
        trailingParagraph = lastInserted.nodeName === 'P' ? lastInserted : lastInserted.querySelector('p');
      }
    }

    // 3. Focus cursor into the trailing paragraph
    if (trailingParagraph && selection) {
      const newRange = document.createRange();
      newRange.setStart(trailingParagraph, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    savedRangeRef.current = null;
    savedTargetElementRef.current = null;
    setContent(editor.innerHTML);
    setHasUnsavedChanges(true);
    updatePlusMenuPosition();
  };

  const handleInsertImage = (url: string, caption?: string) => {
    const imageHtml = `
      <figure class="my-6 text-center select-none">
        <img src="${url}" alt="${caption || 'Image'}" class="max-w-full h-auto rounded-lg mx-auto" />
        ${caption ? `<figcaption class="text-xs text-stone-500 mt-2 font-serif italic">${caption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    insertHtmlAtCursor(imageHtml);
  };

  const handleInsertEmbed = async (
    url: string,
    embedTitle?: string,
    meta?: UrlPreviewMetadata,
    isVideoPlayer: boolean = true
  ) => {
    let resolvedMeta = meta;
    if (!resolvedMeta) {
      resolvedMeta = await fetchUrlPreview(url);
    }
    if (embedTitle && embedTitle !== resolvedMeta.title) {
      resolvedMeta = { ...resolvedMeta, title: embedTitle };
    }
    const embedHtml = generateEmbedHtml(resolvedMeta, isVideoPlayer);
    insertHtmlAtCursor(embedHtml);
  };

  const handleInsertCode = (language: string = 'javascript', title: string = '') => {
    insertHtmlAtCursor(generateCodeBlockHtml(language, title));
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    let node: Node | null = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const codeEl = node && (node.nodeName === 'CODE' ? (node as HTMLElement) : (node as HTMLElement).closest?.('code'));
    const isInsideCode = Boolean(codeEl && codeEl.classList.contains('code-content'));

    if (isInsideCode && codeEl) {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleCodeBlockTab(codeEl, e.shiftKey);
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
        }
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleCodeBlockEnter(codeEl);
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
        }
        return;
      }

      if (e.key === 'Backspace') {
        const handled = handleCodeBlockBackspace(codeEl);
        if (handled && editorRef.current) {
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          return;
        }
      }
    }

    // Handle inline code navigation and exiting
    const inlineCodeEl = node instanceof HTMLElement ? (node.closest('code:not(.code-content)') as HTMLElement | null) : null;
    if (inlineCodeEl && editorRef.current.contains(inlineCodeEl)) {
      const handled = handleInlineCodeKeyDown(inlineCodeEl, e, selection);
      if (handled) {
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
        }
        return;
      }
    }

    // Handle blockquote navigation and breakout
    const quoteEl = node instanceof HTMLElement ? (node.closest('blockquote') as HTMLElement | null) : null;
    if (quoteEl && editorRef.current.contains(quoteEl)) {
      const isQuoteEmpty = !quoteEl.textContent || quoteEl.textContent.trim() === '';

      if (e.key === 'Enter' && !e.shiftKey) {
        if (isQuoteEmpty) {
          e.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          quoteEl.parentNode?.replaceChild(p, quoteEl);
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          return;
        }

        // Check if cursor is on an empty line within the blockquote
        let currentNode: Node | null = selection.anchorNode;
        if (currentNode?.nodeType === Node.TEXT_NODE) {
          currentNode = currentNode.parentElement;
        }

        const isCurrentLineEmpty =
          currentNode &&
          currentNode !== quoteEl &&
          quoteEl.contains(currentNode) &&
          (!currentNode.textContent || currentNode.textContent.trim() === '');

        if (isCurrentLineEmpty) {
          e.preventDefault();
          if (currentNode instanceof HTMLElement && quoteEl.contains(currentNode)) {
            currentNode.remove();
          }
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          if (quoteEl.nextSibling) {
            quoteEl.parentNode?.insertBefore(p, quoteEl.nextSibling);
          } else {
            quoteEl.parentNode?.appendChild(p);
          }
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          return;
        }
      }

      if (e.key === 'Backspace') {
        if (isQuoteEmpty) {
          e.preventDefault();
          const prev = quoteEl.previousElementSibling;
          if (prev) {
            quoteEl.remove();
            const range = document.createRange();
            range.selectNodeContents(prev);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            quoteEl.parentNode?.replaceChild(p, quoteEl);
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          return;
        }

        // If cursor is at the very beginning of the quote block, unwrap it to <p>
        if (selection.isCollapsed && selection.anchorNode) {
          try {
            const range = document.createRange();
            range.setStart(quoteEl, 0);
            range.setEnd(selection.anchorNode, selection.anchorOffset);
            if (range.toString().length === 0) {
              e.preventDefault();
              const p = document.createElement('p');
              p.innerHTML = quoteEl.innerHTML.trim() ? quoteEl.innerHTML : '<br>';
              quoteEl.parentNode?.replaceChild(p, quoteEl);
              const newRange = document.createRange();
              newRange.setStart(p, 0);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              setContent(editorRef.current.innerHTML);
              setHasUnsavedChanges(true);
              return;
            }
          } catch {
            // Range fallback
          }
        }
      }
    }

    // Safeguard 1: Non-collapsed selection deletion crossing into custom blocks (e.g. Shift + ArrowRight + Backspace on empty line)
    if ((e.key === 'Backspace' || e.key === 'Delete') && !selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const startEl = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : (startContainer as HTMLElement);
      const startBlock = startEl?.closest('p, div:not(.code-block-wrapper):not(.embed-card-wrapper):not(.embed-video-wrapper)');
      if (startBlock && editorRef.current.contains(startBlock) && (!startBlock.textContent || startBlock.textContent.trim() === '')) {
        const next = startBlock.nextElementSibling as HTMLElement | null;
        if (isCustomBlockElement(next) && (range.toString().length === 0 || range.toString().trim() === '')) {
          e.preventDefault();
          startBlock.remove();
          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          updatePlusMenuPosition();
          return;
        }
      }
    }

    // Safeguard 2: Backspace / Delete on empty paragraphs between/adjacent to custom blocks
    if ((e.key === 'Backspace' || e.key === 'Delete') && selection.isCollapsed) {
      let anchorNode: Node | null = selection.anchorNode;
      if (anchorNode?.nodeType === Node.TEXT_NODE) {
        anchorNode = anchorNode.parentElement;
      }

      const currentBlock =
        anchorNode instanceof HTMLElement &&
        editorRef.current.contains(anchorNode) &&
        anchorNode !== editorRef.current
          ? (anchorNode.closest(
              'p, div:not(.code-block-wrapper):not(.embed-card-wrapper):not(.embed-video-wrapper), h1, h2, h3, blockquote'
            ) as HTMLElement | null)
          : null;

      const isCurrentLineEmpty =
        currentBlock &&
        (!currentBlock.textContent || currentBlock.textContent.trim() === '') &&
        !currentBlock.querySelector('img, iframe, input, select, svg');

      if (isCurrentLineEmpty && currentBlock && currentBlock.parentNode === editorRef.current) {
        const prev = currentBlock.previousElementSibling as HTMLElement | null;
        const next = currentBlock.nextElementSibling as HTMLElement | null;

        // If adjacent to custom blocks or another block
        if (isCustomBlockElement(prev) || isCustomBlockElement(next) || prev || next) {
          e.preventDefault();
          currentBlock.remove();

          // Focus next editable if available
          if (next && !isCustomBlockElement(next)) {
            const range = document.createRange();
            range.setStart(next, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else if (prev && !isCustomBlockElement(prev)) {
            const range = document.createRange();
            range.selectNodeContents(prev);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          } else if (next && isCustomBlockElement(next)) {
            let nextEditable = next.nextElementSibling as HTMLElement | null;
            while (nextEditable && isCustomBlockElement(nextEditable)) {
              nextEditable = nextEditable.nextElementSibling as HTMLElement | null;
            }
            if (nextEditable) {
              const range = document.createRange();
              range.setStart(nextEditable, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              const trailing = document.createElement('p');
              trailing.innerHTML = '<br>';
              next.after(trailing);
              const range = document.createRange();
              range.setStart(trailing, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } else if (prev && isCustomBlockElement(prev)) {
            let prevEditable = prev.previousElementSibling as HTMLElement | null;
            while (prevEditable && isCustomBlockElement(prevEditable)) {
              prevEditable = prevEditable.previousElementSibling as HTMLElement | null;
            }
            if (prevEditable) {
              const range = document.createRange();
              range.selectNodeContents(prevEditable);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              const trailing = document.createElement('p');
              trailing.innerHTML = '<br>';
              prev.after(trailing);
              const range = document.createRange();
              range.setStart(trailing, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }

          setContent(editorRef.current.innerHTML);
          setHasUnsavedChanges(true);
          updatePlusMenuPosition();
          return;
        }
      }
    }
  };

  const handleInsertDivider = () => {
    insertHtmlAtCursor('<hr class="editorial-divider my-8" /><p><br></p>');
  };

  const handleSaveJournal = useCallback(async () => {
    setIsSaving(true);
    try {
      if (initialArticle) {
        const updated = await updateArticle(initialArticle.id, {
          title: title.trim() || 'Untitled Thought',
          subtitle: subtitle.trim(),
          content: content,
          visibility: 'private',
        });
        if (updated) onSaved(updated);
      } else {
        const created = await createArticle({
          title: title.trim() || 'Untitled Thought',
          subtitle: subtitle.trim(),
          content: content,
          visibility: 'private',
        });
        onSaved(created);
      }
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [initialArticle, title, subtitle, content, updateArticle, createArticle, onSaved]);

  const handlePublishConfirm = async (params: {
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle?: string;
  }) => {
    setIsSaving(true);
    try {
      const finalTitle = title.trim() || 'Untitled Thought';
      const finalSubtitle = params.subtitle || subtitle.trim();
      const targetId = initialArticle?.id || 'art-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

      let coverImageUrl = initialArticle?.coverImage;

      // Automatically generate & upload OpenGraph preview card if published
      if (params.visibility === 'published') {
        const readingTime = calculateReadingTime(content);

        const uploadedUrl = await generateAndUploadOgImage(
          {
            title: finalTitle,
            subtitle: finalSubtitle,
            authorName: user?.name || initialArticle?.authorName || 'Anonymous Writer',
            authorUsername: user?.username || initialArticle?.authorUsername || 'writer',
            readingTimeMinutes: readingTime,
            tags: params.tags,
          },
          targetId
        );

        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        }
      }

      if (initialArticle) {
        const updated = await updateArticle(initialArticle.id, {
          title: finalTitle,
          subtitle: finalSubtitle,
          content: content,
          visibility: params.visibility,
          slug: params.slug,
          tags: params.tags,
          coverImage: coverImageUrl,
        });
        if (updated) onSaved(updated);
      } else {
        const created = await createArticle({
          title: finalTitle,
          subtitle: finalSubtitle,
          content: content,
          visibility: params.visibility,
          slug: params.slug,
          tags: params.tags,
          coverImage: coverImageUrl,
        });
        onSaved(created);
      }
      setIsPublishModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Header */}
      <WriterHeader
        onBack={onBack}
        onPublishClick={() => setIsPublishModalOpen(true)}
        onSaveJournal={handleSaveJournal}
        isSaving={isSaving}
        visibility={visibility}
        onToggleVisibility={setVisibility}
        hasUnsavedChanges={hasUnsavedChanges}
        wordCount={calculateWords()}
      />

      {/* Floating Inline Selection Toolbar */}
      <InlineToolbar
        position={toolbarPosition}
        onFormat={handleFormat}
        onToggleQuote={handleToggleQuote}
        onToggleInlineCode={handleToggleInlineCode}
      />

      {/* Main Distraction-Free Canvas */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-5 sm:px-12 py-8 sm:py-12">
        {/* Title */}
        <textarea
          ref={titleRef}
          rows={1}
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Title"
          className="writer-title-input text-3xl sm:text-5xl"
          style={{ minHeight: '52px' }}
        />

        {/* Subtitle */}
        <textarea
          ref={subtitleRef}
          rows={1}
          value={subtitle}
          onChange={handleSubtitleChange}
          onKeyDown={handleSubtitleKeyDown}
          placeholder="Subtitle (optional)"
          className="placeholder-visible w-full bg-transparent resize-none overflow-hidden text-lg sm:text-xl font-serif mb-4 focus:outline-none leading-relaxed block"
          style={{
            color: 'var(--color-text-secondary)',
            minHeight: '34px',
          }}
        />

        {/* Editorial Divider */}
        <div className="w-full h-px my-3 mb-8" style={{ backgroundColor: 'var(--color-border-soft)' }} />

        {/* Body Canvas in Newsreader Editorial Typography with Plus Menu */}
        <div className="relative">
          {/* Empty Line Plus Menu */}
          <PlusMenu
            top={plusMenuTop}
            isOpen={isPlusMenuOpen}
            onToggle={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            onInsertImage={handleInsertImage}
            onInsertEmbed={handleInsertEmbed}
            onInsertCode={handleInsertCode}
            onInsertDivider={handleInsertDivider}
          />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onKeyDown={handleEditorKeyDown}
            onBlur={handleEditorBlur}
            onClick={updatePlusMenuPosition}
            onKeyUp={updatePlusMenuPosition}
            onFocus={updatePlusMenuPosition}
            data-placeholder="Begin in solitude. No one is watching..."
            className="editorial-canvas font-editorial text-base sm:text-xl leading-relaxed min-h-[400px] sm:min-h-[500px] focus:outline-none pb-32"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>
      </main>

      {/* Custom Slug & Publication Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title={title}
        subtitle={subtitle}
        initialSlug={initialArticle?.slug}
        initialVisibility={visibility}
        initialTags={initialArticle?.tags}
        onConfirmPublish={handlePublishConfirm}
      />
    </div>
  );
};
