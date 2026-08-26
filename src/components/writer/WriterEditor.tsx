import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Article } from '../../types/article';
import { WriterHeader } from './WriterHeader';
import { InlineToolbar } from './InlineToolbar';
import { PlusMenu } from './PlusMenu';
import { PublishModal } from './PublishModal';
import { useArticles } from '../../context/ArticlesContext';

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
  const { createArticle, updateArticle, decryptJournal } = useArticles();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [visibility, setVisibility] = useState<'private' | 'published'>(
    initialArticle?.visibility || 'private'
  );
  const [slug] = useState(initialArticle?.slug || '');
  const [tags] = useState<string[]>(initialArticle?.tags || []);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [plusMenuTop, setPlusMenuTop] = useState(10);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  useEffect(() => {
    async function loadContent() {
      if (initialArticle && editorRef.current) {
        if (initialArticle.isEncrypted) {
          const decrypted = await decryptJournal(initialArticle);
          editorRef.current.innerHTML = decrypted || initialArticle.content;
        } else {
          editorRef.current.innerHTML = initialArticle.content;
        }
      }
    }
    loadContent();
  }, [initialArticle, decryptJournal]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editorRef.current) {
      setToolbarPosition(null);
      return;
    }

    if (!editorRef.current.contains(selection.anchorNode)) {
      setToolbarPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width > 0) {
      setToolbarPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2,
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  const handleKeyUpOrClick = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (!range) return;

    const node = selection.anchorNode;
    const parentElem = (node instanceof HTMLElement ? node : node?.parentElement) as HTMLElement;

    if (editorRef.current.contains(parentElem)) {
      const editorRect = editorRef.current.getBoundingClientRect();
      const nodeRect = parentElem.getBoundingClientRect();
      const relativeTop = nodeRect.top - editorRect.top;

      setPlusMenuTop(Math.max(0, relativeTop));

      if (parentElem.textContent?.trim()) {
        setIsPlusMenuOpen(false);
      }
    }
  };

  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    setSaveStatus('dirty');
  };

  const handleToggleQuote = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'editorial-quote';
      blockquote.innerHTML = selectedText;
      range.deleteContents();
      range.insertNode(blockquote);
    } else {
      document.execCommand('formatBlock', false, '<blockquote>');
    }
    setSaveStatus('dirty');
    setToolbarPosition(null);
  };

  const handleInsertImage = (url: string, caption?: string) => {
    if (!editorRef.current) return;
    const figure = document.createElement('figure');
    figure.className = 'my-6 text-center';
    figure.innerHTML = `
      <img src="${url}" alt="${caption || 'Image'}" class="w-full max-h-[520px] object-cover rounded" />
      ${caption ? `<figcaption class="text-xs text-center mt-2 opacity-70 italic">${caption}</figcaption>` : ''}
      <p><br></p>
    `;
    insertElementAtCursor(figure);
  };

  const handleInsertEmbed = (url: string, titleStr?: string) => {
    if (!editorRef.current) return;
    const embedCard = document.createElement('div');
    embedCard.className = 'my-6 p-4 rounded-lg flex items-center justify-between gap-4 select-none';
    embedCard.style.cssText = 'background-color: var(--color-bg-surface); border: 1px solid var(--color-border-soft);';
    embedCard.innerHTML = `
      <div class="space-y-1 overflow-hidden">
        <div class="text-sm font-semibold truncate" style="color: var(--color-text-primary);">${titleStr || url}</div>
        <div class="text-xs truncate opacity-70" style="color: var(--color-text-secondary);">${url}</div>
      </div>
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap" style="background-color: var(--color-bg-subtle); color: var(--color-text-primary); border: 1px solid var(--color-border-soft);">Visit link ↗</a>
    `;
    insertElementAtCursor(embedCard);
  };

  const handleInsertCode = () => {
    if (!editorRef.current) return;
    const pre = document.createElement('pre');
    pre.className = 'p-4 rounded-md my-4 font-mono text-xs overflow-x-auto';
    pre.style.cssText = 'background-color: var(--color-code-bg); border: 1px solid var(--color-border-soft); color: var(--color-text-primary);';
    pre.innerHTML = `<code>// Write code snippet here\nfunction calculate() {\n  return 42;\n}</code>`;
    insertElementAtCursor(pre);
  };

  const handleInsertDivider = () => {
    if (!editorRef.current) return;
    const hr = document.createElement('hr');
    hr.className = 'my-8 border-t';
    hr.style.cssText = 'border-color: var(--color-border-soft);';
    insertElementAtCursor(hr);
  };

  const insertElementAtCursor = (elem: HTMLElement) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(elem);
      range.collapse(false);
    } else if (editorRef.current) {
      editorRef.current.appendChild(elem);
    }
    setSaveStatus('dirty');
  };

  const handlePublishSubmit = async (params: {
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle: string;
  }) => {
    const content = editorRef.current?.innerHTML || '';
    setSaveStatus('saving');

    let savedArticle: Article | undefined;

    if (initialArticle) {
      savedArticle = await updateArticle(initialArticle.id, {
        title: title.trim() || 'Untitled Story',
        subtitle: params.subtitle,
        content,
        visibility: params.visibility,
        slug: params.slug,
        tags: params.tags,
      });
    } else {
      savedArticle = await createArticle({
        title: title.trim() || 'Untitled Story',
        subtitle: params.subtitle,
        content,
        visibility: params.visibility,
        slug: params.slug,
        tags: params.tags,
      });
    }

    setSaveStatus('saved');
    if (savedArticle) {
      onSaved(savedArticle);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Header */}
      <WriterHeader
        onBack={onBack}
        visibility={visibility}
        onToggleVisibility={() =>
          setVisibility((v) => (v === 'private' ? 'published' : 'private'))
        }
        onOpenPublish={() => setShowPublishModal(true)}
        saveStatus={saveStatus}
        isEditingExisting={!!initialArticle}
      />

      {/* Floating Inline Selection Toolbar */}
      <InlineToolbar
        position={toolbarPosition}
        onFormat={handleFormat}
        onToggleQuote={handleToggleQuote}
      />

      {/* Main Canvas with Generous Medium Whitespace */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-6 sm:px-12 py-12">
        <div className="relative">
          {/* Medium-style plus menu on the left */}
          <PlusMenu
            top={plusMenuTop}
            isOpen={isPlusMenuOpen}
            onToggle={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            onInsertImage={handleInsertImage}
            onInsertEmbed={handleInsertEmbed}
            onInsertCode={handleInsertCode}
            onInsertDivider={handleInsertDivider}
          />

          {/* Title Area */}
          <textarea
            ref={titleRef}
            rows={1}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('dirty');
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Title..."
            className="w-full bg-transparent font-serif font-bold text-3xl sm:text-5xl tracking-tight focus:outline-none resize-none overflow-hidden placeholder:opacity-40 mb-4"
            style={{
              color: 'var(--color-text-primary)',
            }}
          />

          {/* Subtitle / Teaser Input (Optional) */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              setSaveStatus('dirty');
            }}
            placeholder="Write a subtitle or preview hook..."
            className="w-full bg-transparent font-serif text-lg sm:text-xl focus:outline-none placeholder:opacity-35 mb-8 pb-3"
            style={{
              color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-border-soft)',
            }}
          />

          {/* Medium Body Editable Canvas */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyUp={handleKeyUpOrClick}
            onClick={handleKeyUpOrClick}
            onInput={() => setSaveStatus('dirty')}
            data-placeholder="Tell your story or write your private journal entry..."
            className="font-editorial text-lg sm:text-xl leading-relaxed focus:outline-none min-h-[500px] max-w-none"
            style={{
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </main>

      {/* Publish Dialog */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title={title}
        subtitle={subtitle}
        initialSlug={slug}
        initialVisibility={visibility}
        initialTags={tags}
        onConfirmPublish={handlePublishSubmit}
      />
    </div>
  );
};
