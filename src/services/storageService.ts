import type { Article, Comment } from '../types/article';

const ARTICLES_KEY = 'tegaki_articles_v2';
const COMMENTS_KEY = 'tegaki_comments_v2';

// Clean legacy mock data from v1
try {
  localStorage.removeItem('tegaki_articles_v1');
  localStorage.removeItem('tegaki_comments_v1');
  localStorage.removeItem('tegaki_current_user');
} catch {}

export function getStoredArticles(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredArticles(articles: Article[]): void {
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (err) {
    console.error('Failed to save articles:', err);
  }
}

export function getStoredComments(articleId?: string): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const comments: Comment[] = raw ? JSON.parse(raw) : [];
    if (articleId) {
      return comments.filter((c) => c.articleId === articleId);
    }
    return comments;
  } catch {
    return [];
  }
}

export function saveComment(comment: Comment): Comment[] {
  const comments = getStoredComments();
  const updated = [comment, ...comments];
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save comment:', err);
  }
  return updated;
}
