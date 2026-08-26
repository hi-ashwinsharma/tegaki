import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Article, Comment } from '../types/article';

const ARTICLES_COLLECTION = 'articles';
const COMMENTS_COLLECTION = 'comments';

export async function syncArticleToFirestore(article: Article): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, article.id);
    await setDoc(articleRef, {
      ...article,
      updatedAt: Date.now(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore sync article failed:', error);
    return false;
  }
}

export async function fetchArticlesFromFirestore(): Promise<Article[] | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, ARTICLES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const articles: Article[] = [];
    snapshot.forEach((d) => {
      articles.push(d.data() as Article);
    });
    return articles.length ? articles : null;
  } catch (error) {
    console.warn('Firestore fetch articles failed:', error);
    return null;
  }
}

export async function deleteArticleFromFirestore(id: string): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
    return true;
  } catch (error) {
    console.warn('Firestore delete article failed:', error);
    return false;
  }
}

export async function clapArticleInFirestore(id: string): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(articleRef, {
      upvotes: increment(1),
    });
    return true;
  } catch (error) {
    console.warn('Firestore clap failed:', error);
    return false;
  }
}

export async function syncCommentToFirestore(comment: Comment): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const commentRef = doc(db, COMMENTS_COLLECTION, comment.id);
    await setDoc(commentRef, comment);
    
    // Increment comment count on article
    const articleRef = doc(db, ARTICLES_COLLECTION, comment.articleId);
    await updateDoc(articleRef, {
      commentCount: increment(1),
    });
    return true;
  } catch (error) {
    console.warn('Firestore sync comment failed:', error);
    return false;
  }
}

export async function fetchCommentsFromFirestore(articleId?: string): Promise<Comment[] | null> {
  if (!isFirebaseConfigured) return null;
  try {
    let q = query(collection(db, COMMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    if (articleId) {
      q = query(
        collection(db, COMMENTS_COLLECTION),
        where('articleId', '==', articleId),
        orderBy('createdAt', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    const comments: Comment[] = [];
    snapshot.forEach((d) => {
      comments.push(d.data() as Comment);
    });
    return comments.length ? comments : null;
  } catch (error) {
    console.warn('Firestore fetch comments failed:', error);
    return null;
  }
}
