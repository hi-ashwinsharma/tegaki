export type ArticleVisibility = 'private' | 'published';

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  createdAt: number;
  upvotes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // HTML or structured content
  encryptedPayload?: string; // AES-GCM ciphertext for private journals
  isEncrypted: boolean;
  visibility: ArticleVisibility;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  slug?: string; // e.g. "my-first-reflection"
  tags: string[];
  coverImage?: string;
  readingTimeMinutes: number;
  upvotes: number;
  commentCount: number;
  createdAt: number;
  updatedAt: number;
}
