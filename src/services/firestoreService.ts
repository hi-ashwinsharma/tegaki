import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Article, Comment } from '../types/article';

const ARTICLES_COLLECTION = 'articles';
const COMMENTS_COLLECTION = 'comments';

function cleanUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned as Partial<T>;
}

/**
 * Sync an article (create or update) to Cloud Firestore
 */
export async function syncArticleToFirestore(article: Article): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, article.id);
    const cleanedData = cleanUndefined({
      ...article,
      updatedAt: Date.now(),
    });
    await setDoc(articleRef, cleanedData, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore sync article failed:', error);
    return false;
  }
}

/**
 * Real-time subscription to published & shared articles in Cloud Firestore
 */
export function subscribeToArticles(callback: (articles: Article[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('visibility', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Article[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Article);
        });
        callback(list);
      },
      (error) => {
        console.warn('Firestore articles snapshot listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach articles subscription:', err);
    return null;
  }
}

/**
 * Real-time subscription to comments in Cloud Firestore
 */
export function subscribeToComments(callback: (comments: Comment[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, COMMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Comment[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Comment);
        });
        callback(list);
      },
      (error) => {
        console.warn('Firestore comments snapshot listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach comments subscription:', err);
    return null;
  }
}

/**
 * Fetch a single article by Author Username and Slug from Cloud Firestore
 */
export async function fetchArticleBySlugFromFirestore(
  username: string,
  slug: string
): Promise<Article | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const cleanUser = username.toLowerCase().replace(/^@/, '');
    const cleanSlug = slug.toLowerCase();

    // Query Firestore matching author and slug
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('slug', '==', cleanSlug)
    );
    const snapshot = await getDocs(q);
    let matchedArticle: Article | null = null;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Article;
      if (data.authorUsername.toLowerCase() === cleanUser) {
        matchedArticle = data;
      }
    });

    if (matchedArticle) return matchedArticle;

    // Fallback query by document ID
    const docRef = doc(db, ARTICLES_COLLECTION, slug);
    const singleDoc = await getDoc(docRef);
    if (singleDoc.exists()) {
      return singleDoc.data() as Article;
    }

    return null;
  } catch (error) {
    console.warn('Firestore fetch article by slug failed:', error);
    return null;
  }
}

/**
 * Fetch a single article by ID from Cloud Firestore
 */
export async function fetchArticleByIdFromFirestore(id: string): Promise<Article | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Article;
    }
    return null;
  } catch (error) {
    console.warn('Firestore fetch article by ID failed:', error);
    return null;
  }
}

/**
 * Delete an article from Cloud Firestore
 */
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

/**
 * Atomically clap an article in Cloud Firestore
 */
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

/**
 * Sync a comment to Cloud Firestore and increment article comment count
 */
export async function syncCommentToFirestore(comment: Comment): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const commentRef = doc(db, COMMENTS_COLLECTION, comment.id);
    const cleaned = cleanUndefined(comment);
    await setDoc(commentRef, cleaned, { merge: true });

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
