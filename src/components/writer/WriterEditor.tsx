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
  handleCodeBlockEnter,
  handleCodeBlockTab,
  handleCodeBlockBackspace,
} from '../../services/syntaxHighlightService';

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
  const editorRef = useRef<HTMLDivElement>(null);

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

  // Adjust title height on mount / text change
  useEffect(() => {
    adjustTitleHeight();
  }, [title]);

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

    editor.addEventListener('change', handleSelectChange);
    editor.addEventListener('input', handleTitleInputChange);
    return () => {
      editor.removeEventListener('change', handleSelectChange);
      editor.removeEventListener('input', handleTitleInputChange);
    };
  }, []);

  // Track cursor position for plus menu
  const updatePlusMenuPosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    if (selection.rangeCount === 0) return;
    if (!editorRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
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

  const handleEditorInput = () => {
    if (!editorRef.current) return;

    // Live syntax highlighting inside active code block
    const selection = window.getSelection();
    let node: Node | null = selection?.anchorNode || null;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const codeEl = node && (node.nodeName === 'CODE' ? (node as HTMLElement) : (node as HTMLElement).closest?.('code'));
    if (codeEl && codeEl.classList.contains('code-content')) {
      highlightCodeElementInPlace(codeEl);
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
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const calculateWords = () => {
    return calculateWordCount(title + ' ' + content);
  };

  // Formatting actions
  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
  };

  const handleToggleQuote = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;
    document.execCommand('formatBlock', false, '<blockquote>');
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
  };

  // Plus menu insertions
  const insertHtmlAtCursor = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
    }
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

  const handleInsertEmbed = (url: string, embedTitle?: string) => {
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    const embedHtml = `
      <div class="my-6 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex flex-col gap-1 select-none">
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="font-serif font-bold text-base hover:underline">${embedTitle || url}</a>
        <span class="text-xs text-stone-400 font-mono">${domain}</span>
      </div>
      <p><br></p>
    `;
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
          content: content,
          visibility: 'private',
        });
        if (updated) onSaved(updated);
      } else {
        const created = await createArticle({
          title: title.trim() || 'Untitled Thought',
          content: content,
          visibility: 'private',
        });
        onSaved(created);
      }
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [initialArticle, title, content, updateArticle, createArticle, onSaved]);

  const handlePublishConfirm = async (params: {
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle?: string;
  }) => {
    setIsSaving(true);
    try {
      const finalTitle = title.trim() || 'Untitled Thought';
      const targetId = initialArticle?.id || 'art-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

      let coverImageUrl = initialArticle?.coverImage;

      // Automatically generate & upload OpenGraph preview card if published
      if (params.visibility === 'published') {
        const readingTime = calculateReadingTime(content);

        const uploadedUrl = await generateAndUploadOgImage(
          {
            title: finalTitle,
            subtitle: params.subtitle || '',
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
          subtitle: params.subtitle || initialArticle.subtitle || '',
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
          subtitle: params.subtitle || '',
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

        {/* Editorial Divider */}
        <div className="w-full h-px mb-8" style={{ backgroundColor: 'var(--color-border-soft)' }} />

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
        subtitle={initialArticle?.subtitle}
        initialSlug={initialArticle?.slug}
        initialVisibility={visibility}
        initialTags={initialArticle?.tags}
        onConfirmPublish={handlePublishConfirm}
      />
    </div>
  );
};
