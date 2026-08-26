import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Article, Comment } from '../types/article';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredComments,
  saveComment,
} from '../services/storageService';
import {
  syncArticleToFirestore,
  deleteArticleFromFirestore,
  clapArticleInFirestore,
  syncCommentToFirestore,
  subscribeToArticles,
  subscribeToComments,
  fetchArticleBySlugFromFirestore,
  fetchArticleByIdFromFirestore,
} from '../services/firestoreService';
import { encryptContent, decryptContent } from '../services/cryptoService';
import { generateSlug, sanitizeSlug } from '../services/slugService';
import { useAuth } from './AuthContext';

interface ArticlesContextType {
  articles: Article[];
  getArticleById: (id: string) => Article | undefined;
  getArticleBySlug: (username: string, slug: string) => Article | undefined;
  findArticleBySlugOrFetch: (username: string, slug: string) => Promise<Article | null>;
  findArticleByIdOrFetch: (id: string) => Promise<Article | null>;
  createArticle: (params: {
    title: string;
    subtitle?: string;
    content: string;
    visibility: 'private' | 'published';
    slug?: string;
    tags?: string[];
    coverImage?: string;
  }) => Promise<Article>;
  updateArticle: (
    id: string,
    params: Partial<Omit<Article, 'id' | 'createdAt'>>
  ) => Promise<Article | undefined>;
  deleteArticle: (id: string) => void;
  toggleVisibility: (id: string, slug?: string) => Promise<Article | undefined>;
  clapArticle: (id: string) => void;
  getCommentsForArticle: (articleId: string) => Comment[];
  addCommentToArticle: (articleId: string, content: string) => Comment;
  clapComment: (commentId: string) => void;
  decryptJournal: (article: Article) => Promise<string>;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const ArticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>(() => getStoredArticles());
  const [comments, setComments] = useState<Comment[]>(() => getStoredComments());

  // Real-time Cloud Firestore synchronization
  useEffect(() => {
    const unsubArticles = subscribeToArticles((cloudArticles) => {
      if (cloudArticles) {
        setArticles((prev) => {
          const cloudIds = new Set(cloudArticles.map((a) => a.id));
          // Preserve any local-only private entries that haven't synced
          const localPrivate = prev.filter(
            (a) => !cloudIds.has(a.id) && a.visibility === 'private'
          );
          return [...cloudArticles, ...localPrivate];
        });
      }
    });

    const unsubComments = subscribeToComments((cloudComments) => {
      if (cloudComments) {
        setComments((prev) => {
          const cloudIds = new Set(cloudComments.map((c) => c.id));
          const localOnly = prev.filter((c) => !cloudIds.has(c.id));
          return [...cloudComments, ...localOnly];
        });
      }
    });

    // Auto-sync any previously stored local published stories to Firestore
    articles.forEach((art) => {
      if (art.visibility === 'published') {
        syncArticleToFirestore(art);
      }
    });

    return () => {
      if (unsubArticles) unsubArticles();
      if (unsubComments) unsubComments();
    };
  }, []);

  // Save to persistent storage cache
  useEffect(() => {
    saveStoredArticles(articles);
  }, [articles]);

  const getArticleById = useCallback((id: string) => {
    return articles.find((a) => a.id === id);
  }, [articles]);

  const getArticleBySlug = useCallback((username: string, slug: string) => {
    const cleanUser = username.toLowerCase().replace(/^@/, '');
    const cleanSlug = slug.toLowerCase();
    return articles.find(
      (a) =>
        a.authorUsername.toLowerCase() === cleanUser &&
        (a.slug?.toLowerCase() === cleanSlug || a.id === cleanSlug)
    );
  }, [articles]);

  const findArticleBySlugOrFetch = useCallback(async (username: string, slug: string): Promise<Article | null> => {
    const local = getArticleBySlug(username, slug);
    if (local) return local;

    // Fetch directly from Cloud Firestore
    const cloud = await fetchArticleBySlugFromFirestore(username, slug);
    if (cloud) {
      setArticles((prev) => {
        if (prev.some((a) => a.id === cloud.id)) return prev;
        return [cloud, ...prev];
      });
      return cloud;
    }
    return null;
  }, [getArticleBySlug]);

  const findArticleByIdOrFetch = useCallback(async (id: string): Promise<Article | null> => {
    const local = getArticleById(id);
    if (local) return local;

    // Fetch directly from Cloud Firestore
    const cloud = await fetchArticleByIdFromFirestore(id);
    if (cloud) {
      setArticles((prev) => {
        if (prev.some((a) => a.id === cloud.id)) return prev;
        return [cloud, ...prev];
      });
      return cloud;
    }
    return null;
  }, [getArticleById]);

  const calculateReadingTime = (text: string) => {
    const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const createArticle = async ({
    title,
    subtitle = '',
    content,
    visibility = 'private',
    slug,
    tags = [],
    coverImage,
  }: {
    title: string;
    subtitle?: string;
    content: string;
    visibility: 'private' | 'published';
    slug?: string;
    tags?: string[];
    coverImage?: string;
  }): Promise<Article> => {
    const finalSlug = slug ? sanitizeSlug(slug) : generateSlug(title || 'journal');
    const isEncrypted = visibility === 'private';
    let encryptedPayload: string | undefined;

    if (isEncrypted) {
      encryptedPayload = await encryptContent(content);
    }

    const newArticle: Article = {
      id: 'art-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim() || 'Untitled Thought',
      subtitle: subtitle.trim(),
      content: content,
      encryptedPayload: encryptedPayload,
      isEncrypted: isEncrypted,
      visibility: visibility,
      authorId: user?.id || 'guest-author',
      authorName: user?.name || 'Anonymous Writer',
      authorUsername: user?.username || 'writer',
      authorAvatar: user?.avatarUrl,
      slug: finalSlug,
      tags: tags.length ? tags : visibility === 'private' ? ['Personal Journal'] : ['Writing'],
      coverImage: coverImage,
      readingTimeMinutes: calculateReadingTime(content),
      upvotes: 0,
      commentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setArticles((prev) => [newArticle, ...prev]);

    // Async sync to Cloud Firestore
    await syncArticleToFirestore(newArticle);

    return newArticle;
  };

  const updateArticle = async (
    id: string,
    params: Partial<Omit<Article, 'id' | 'createdAt'>>
  ): Promise<Article | undefined> => {
    let updatedTarget: Article | undefined;

    const newArticles = await Promise.all(
      articles.map(async (art) => {
        if (art.id !== id) return art;

        let content = params.content !== undefined ? params.content : art.content;
        let isEncrypted = params.visibility ? params.visibility === 'private' : art.isEncrypted;
        let encryptedPayload = art.encryptedPayload;

        if (isEncrypted && params.content !== undefined) {
          encryptedPayload = await encryptContent(content);
        }

        const updated: Article = {
          ...art,
          ...params,
          content,
          isEncrypted,
          encryptedPayload,
          readingTimeMinutes: content ? calculateReadingTime(content) : art.readingTimeMinutes,
          updatedAt: Date.now(),
        };

        if (params.slug) {
          updated.slug = sanitizeSlug(params.slug);
        }

        updatedTarget = updated;
        return updated;
      })
    );

    setArticles(newArticles);

    if (updatedTarget) {
      await syncArticleToFirestore(updatedTarget);
    }

    return updatedTarget;
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    deleteArticleFromFirestore(id);
  };

  const toggleVisibility = async (id: string, newSlug?: string): Promise<Article | undefined> => {
    const current = articles.find((a) => a.id === id);
    if (!current) return undefined;

    const nextVisibility = current.visibility === 'private' ? 'published' : 'private';
    const slug = newSlug || current.slug || generateSlug(current.title);

    return updateArticle(id, {
      visibility: nextVisibility,
      slug: sanitizeSlug(slug),
    });
  };

  const clapArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a))
    );
    clapArticleInFirestore(id);
  };

  const getCommentsForArticle = (articleId: string) => {
    return comments.filter((c) => c.articleId === articleId);
  };

  const addCommentToArticle = (articleId: string, content: string): Comment => {
    const newComment: Comment = {
      id: 'c-' + Date.now() + Math.random().toString(36).substring(2, 5),
      articleId,
      authorId: user?.id || 'guest',
      authorName: user?.name || 'Anonymous Reader',
      authorUsername: user?.username || 'reader',
      authorAvatar: user?.avatarUrl,
      content: content.trim(),
      createdAt: Date.now(),
      upvotes: 0,
    };

    const updated = saveComment(newComment);
    setComments(updated);

    // Increment local article comment count
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, commentCount: a.commentCount + 1 } : a
      )
    );

    // Sync to Firestore
    syncCommentToFirestore(newComment);

    return newComment;
  };

  const clapComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  const decryptJournal = async (article: Article): Promise<string> => {
    if (!article.isEncrypted || !article.encryptedPayload) {
      return article.content;
    }
    return decryptContent(article.encryptedPayload);
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        getArticleById,
        getArticleBySlug,
        findArticleBySlugOrFetch,
        findArticleByIdOrFetch,
        createArticle,
        updateArticle,
        deleteArticle,
        toggleVisibility,
        clapArticle,
        getCommentsForArticle,
        addCommentToArticle,
        clapComment,
        decryptJournal,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
};
