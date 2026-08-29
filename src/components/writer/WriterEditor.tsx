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

const generateCodeBlockHtml = (language = 'javascript') => {
  const placeholder = getCodePlaceholder(language);
  const optionsHtml = CODE_LANGUAGES.map(
    (lang) =>
      `<option value="${lang.value}" ${lang.value === language ? 'selected="selected"' : ''} class="bg-stone-900 text-stone-100">${lang.label}</option>`
  ).join('');

  return `
    <div class="code-block-wrapper my-6 rounded-lg overflow-hidden border border-stone-800 bg-[#18181b] text-stone-100 font-mono text-xs" data-language="${language}">
      <div class="code-block-header flex items-center justify-between px-3 py-1.5 bg-[#121214] border-b border-stone-800 text-[11px] text-stone-400 select-none" contenteditable="false">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-700 inline-block"></span>
          <select class="code-lang-select bg-stone-900/80 text-stone-300 text-xs font-mono rounded px-1.5 py-0.5 border border-stone-700/60 focus:outline-none focus:border-stone-500 cursor-pointer" aria-label="Select code language" contenteditable="false">
            ${optionsHtml}
          </select>
        </div>
        <button type="button" class="code-copy-btn px-2 py-0.5 text-[10px] text-stone-400 hover:text-stone-200 transition-colors rounded hover:bg-stone-800 cursor-pointer" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText).then(()=>{this.innerText='Copied!';setTimeout(()=>{this.innerText='Copy'},2000)})">Copy</button>
      </div>
      <pre class="p-3.5 m-0 bg-transparent overflow-x-auto text-stone-100 font-mono text-xs leading-relaxed focus:outline-none"><code class="language-${language} code-content block focus:outline-none min-h-[1.5rem]" contenteditable="true" spellcheck="false" data-placeholder="${placeholder}"></code></pre>
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

  // Floating toolbar state powered by custom hook
  const { toolbarPosition } = useSelectionToolbar(editorRef);

  const syncCodeSelectValues = () => {
    if (editorRef.current) {
      editorRef.current.querySelectorAll<HTMLSelectElement>('.code-lang-select').forEach((select) => {
        const wrapper = select.closest('.code-block-wrapper');
        const lang = wrapper?.getAttribute('data-language');
        if (lang) {
          select.value = lang;
        }
      });
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

  // Handle dynamic language dropdown changes inside code blocks
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
          const codeEl = wrapper.querySelector('code');
          if (codeEl) {
            codeEl.className = `language-${newLang} code-content block focus:outline-none min-h-[1.5rem]`;
            codeEl.setAttribute('data-placeholder', getCodePlaceholder(newLang));
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

    editor.addEventListener('change', handleSelectChange);
    return () => editor.removeEventListener('change', handleSelectChange);
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

  const adjustTitleHeight = () => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
    adjustTitleHeight();
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubtitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setHasUnsavedChanges(true);
      updatePlusMenuPosition();
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

  const handleInsertCode = (language: string = 'javascript') => {
    insertHtmlAtCursor(generateCodeBlockHtml(language));
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    let node: Node | null = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const isInsideCode = Boolean(
      node &&
        (node.nodeName === 'CODE' ||
          (node instanceof HTMLElement &&
            (node.classList.contains('code-content') || Boolean(node.closest('.code-block-wrapper')))))
    );

    if (isInsideCode) {
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '  ');
        setContent(editorRef.current.innerHTML);
        setHasUnsavedChanges(true);
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertText', false, '\n');
        setContent(editorRef.current.innerHTML);
        setHasUnsavedChanges(true);
        return;
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
    subtitle: string;
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
          placeholder="Title of this reflection..."
          className="w-full bg-transparent resize-none overflow-hidden text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2 sm:mb-3 focus:outline-none placeholder:opacity-30 leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        />

        {/* Optional Subtitle */}
        <textarea
          ref={subtitleRef}
          rows={1}
          value={subtitle}
          onChange={handleSubtitleChange}
          placeholder="An opening line or subtitle (optional)..."
          className="w-full bg-transparent resize-none overflow-hidden text-base sm:text-xl font-serif mb-4 sm:mb-6 focus:outline-none placeholder:opacity-30 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        />

        {/* Medium-style Divider */}
        <div className="w-full h-px my-3 sm:my-4 mb-6 sm:mb-8" style={{ backgroundColor: 'var(--color-border-soft)' }} />

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
