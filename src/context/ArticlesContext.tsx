import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import { calculateReadingTime } from '../utils/textMetrics';
import { ArticlesContext } from './articlesContextState';

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
          // Preserve any local private entries not present in public stream
          const localPrivate = prev.filter(
            (a) => !cloudIds.has(a.id) && a.visibility === 'private'
          );
          const combined = [...cloudArticles, ...localPrivate];
          saveStoredArticles(combined);
          return combined;
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

    // Auto-sync any local published stories on mount
    if (user) {
      const localStored = getStoredArticles();
      localStored.forEach((art) => {
        if (art.visibility === 'published' && (art.authorId === user.id || art.authorUsername === user.username)) {
          syncArticleToFirestore(art);
        }
      });
    }

    return () => {
      if (unsubArticles) unsubArticles();
      if (unsubComments) unsubComments();
    };
  }, [user]);

  // Save to persistent storage cache
  useEffect(() => {
    saveStoredArticles(articles);
  }, [articles]);

  const getArticleById = useCallback((id: string) => {
    return articles.find((a) => a.id === id);
  }, [articles]);

  const getArticleBySlug = useCallback((username: string, slug: string) => {
    const cleanUser = decodeURIComponent(username).toLowerCase().replace(/^@/, '').trim();
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
    return (
      articles.find(
        (a) =>
          (a.authorUsername.toLowerCase() === cleanUser || a.authorId === cleanUser || cleanUser === 'writer' || cleanUser === 'me') &&
          (a.slug?.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug)
      ) ||
      articles.find(
        (a) =>
          a.slug?.toLowerCase() === cleanSlug ||
          a.id.toLowerCase() === cleanSlug
      )
    );
  }, [articles]);

  const findArticleBySlugOrFetch = useCallback(async (username: string, slug: string): Promise<Article | null> => {
    const local = getArticleBySlug(username, slug);
    if (local) return local;

    // Direct check in localStorage cache to prevent render timing race conditions
    const stored = getStoredArticles();
    const cleanUser = decodeURIComponent(username).toLowerCase().replace(/^@/, '').trim();
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
    const matchedStored =
      stored.find(
        (a) =>
          (a.authorUsername.toLowerCase() === cleanUser || a.authorId === cleanUser || cleanUser === 'writer' || cleanUser === 'me') &&
          (a.slug?.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug)
      ) ||
      stored.find(
        (a) =>
          a.slug?.toLowerCase() === cleanSlug ||
          a.id.toLowerCase() === cleanSlug
      );

    if (matchedStored) {
      setArticles((prev) => {
        if (!prev.some((p) => p.id === matchedStored.id)) {
          return [matchedStored, ...prev];
        }
        return prev;
      });
      return matchedStored;
    }

    // Fetch directly from Cloud Firestore
    const cloud = await fetchArticleBySlugFromFirestore(cleanUser, cleanSlug);
    if (cloud) {
      setArticles((prev) => {
        const next = [cloud, ...prev.filter((a) => a.id !== cloud.id)];
        saveStoredArticles(next);
        return next;
      });
      return cloud;
    }
    return null;
  }, [getArticleBySlug]);

  const findArticleByIdOrFetch = useCallback(async (id: string): Promise<Article | null> => {
    const local = getArticleById(id);
    if (local) return local;

    const stored = getStoredArticles();
    const cleanId = decodeURIComponent(id).trim();
    const matchedStored = stored.find((a) => a.id === cleanId || a.slug?.toLowerCase() === cleanId.toLowerCase());
    if (matchedStored) {
      setArticles((prev) => {
        if (!prev.some((p) => p.id === matchedStored.id)) {
          return [matchedStored, ...prev];
        }
        return prev;
      });
      return matchedStored;
    }

    // Fetch directly from Cloud Firestore
    const cloud = await fetchArticleByIdFromFirestore(id);
    if (cloud) {
      setArticles((prev) => {
        const next = [cloud, ...prev.filter((a) => a.id !== cloud.id)];
        saveStoredArticles(next);
        return next;
      });
      return cloud;
    }
    return null;
  }, [getArticleById]);

  const createArticle = async ({
    title,
    subtitle = '',
    content,
    visibility,
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

    setArticles((prev) => {
      const next = [newArticle, ...prev];
      saveStoredArticles(next);
      return next;
    });

    // Async sync to Cloud Firestore
    await syncArticleToFirestore(newArticle);

    return newArticle;
  };

  const updateArticle = async (
    id: string,
    params: Partial<Omit<Article, 'id' | 'createdAt'>>
  ): Promise<Article | undefined> => {
    let updatedTarget: Article | undefined;

    const currentList = [...articles];
    for (let i = 0; i < currentList.length; i++) {
      const art = currentList[i];
      if (art.id === id) {
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
        currentList[i] = updated;
        break;
      }
    }

    if (updatedTarget) {
      setArticles(currentList);
      saveStoredArticles(currentList);

      // Async sync to Cloud Firestore
      await syncArticleToFirestore(updatedTarget);
    }

    return updatedTarget;
  };

  const toggleVisibility = async (id: string, customSlug?: string): Promise<Article | undefined> => {
    const art = getArticleById(id);
    if (!art) return undefined;

    const newVisibility = art.visibility === 'published' ? 'private' : 'published';
    const finalSlug = customSlug ? sanitizeSlug(customSlug) : art.slug || generateSlug(art.title);

    let decryptedContent = art.content;
    if (art.isEncrypted) {
      decryptedContent = await decryptJournal(art);
    }

    return updateArticle(id, {
      visibility: newVisibility,
      slug: finalSlug,
      content: decryptedContent,
    });
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveStoredArticles(next);
      return next;
    });

    // Cloud Firestore delete
    await deleteArticleFromFirestore(id);
  };

  const clapArticle = async (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, upvotes: (a.upvotes || 0) + 1 } : a))
    );

    // Atomically increment in Cloud Firestore
    await clapArticleInFirestore(id);
  };

  const getCommentsForArticle = useCallback((articleId: string) => {
    return comments.filter((c) => c.articleId === articleId);
  }, [comments]);

  const addCommentToArticle = (articleId: string, content: string): Comment => {
    const newComment: Comment = {
      id: 'c-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      articleId,
      authorId: user?.id || 'guest-reader',
      authorName: user?.name || 'Fellow Reader',
      authorUsername: user?.username || 'reader',
      authorAvatar: user?.avatarUrl,
      content: content.trim(),
      createdAt: Date.now(),
      upvotes: 0,
    };

    saveComment(newComment);
    setComments((prev) => [newComment, ...prev]);

    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, commentCount: (a.commentCount || 0) + 1 } : a
      )
    );

    // Async sync to Cloud Firestore
    syncCommentToFirestore(newComment);

    return newComment;
  };

  const clapComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c
    );
    setComments(updated);
    saveStoredArticles(articles);
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
