import { createContext } from 'react';
import type { Article, Comment } from '../types/article';

export interface ArticlesContextType {
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

export const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);
