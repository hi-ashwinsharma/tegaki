import React, { useState } from 'react';
import { X, Send, Heart, MessageSquare } from 'lucide-react';
import type { Comment } from '../../types/article';
import { useAuth } from '../../context/AuthContext';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onClapComment: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onClapComment,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddComment(content);
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-none" onClick={onClose} />

      <div
        className="relative w-full max-w-md h-full flex flex-col z-10 animate-fade-in select-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderLeft: '1px solid var(--color-border-soft)',
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border-soft)' }}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: 'var(--color-text-primary)' }} />
            <h3 className="font-serif font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Responses ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:opacity-75 cursor-pointer"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Comment Input */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {isAuthenticated && user ? user.name : 'Writing as Guest'}
              </span>
            </div>

            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full p-3 text-sm rounded-md focus:outline-none resize-none font-sans"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Keep responses constructive and thoughtful.
              </span>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-4 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-opacity disabled:opacity-40 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  border: '1px solid var(--color-accent)',
                }}
              >
                <span>Respond</span>
                <Send size={12} />
              </button>
            </div>
          </form>
        </div>

        {/* Comments Feed */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c.id}
                className="pb-5 space-y-2"
                style={{ borderBottom: '1px solid var(--color-border-soft)' }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
                      style={{
                        backgroundColor: 'var(--color-bg-subtle)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border-soft)',
                      }}
                    >
                      {c.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {c.authorName}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-sans leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {c.content}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onClapComment(c.id)}
                    className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    <Heart size={13} className={c.upvotes > 0 ? 'text-red-500 fill-current' : ''} />
                    <span>{c.upvotes}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                No responses yet. Be the first to start the conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
