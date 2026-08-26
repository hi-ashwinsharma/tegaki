import type { Article, Comment } from '../types/article';

const ARTICLES_KEY = 'tegaki_articles_v1';
const COMMENTS_KEY = 'tegaki_comments_v1';

const SEED_ARTICLES: Article[] = [
  {
    id: 'seed-1',
    title: 'The Unbearable Lightness of Solitary Writing',
    subtitle: 'Why turning off metrics, feeds, and analytics makes room for actual original thoughts.',
    content: `<p>For the longest time, our digital notebooks were contaminated with analytics, view counts, and dopamine cycles. We wrote with the audience looking over our shoulder before we even knew what we truly believed.</p>
<h2>1. Reclaiming the Sanctuary of the Draft</h2>
<p>When you sit down with a blank screen devoid of shadows, heavy gradients, or glowing notifications, the mind settles. The typography breathes. A sentence isn’t a tweet waiting for approval; it is an investigation into something you haven’t articulated yet.</p>
<blockquote class="editorial-quote">"To write what is true, one must first ensure that no one is listening except one's quietest self."</blockquote>
<p>In Tegaki, your journals are encrypted directly on your device with AES-GCM before resting in the database. When you finally choose to publish, it is not an accidental broadcast—it is a deliberate gift to the world.</p>`,
    isEncrypted: false,
    visibility: 'published',
    authorId: 'u1',
    authorName: 'Kenji Takahashi',
    authorUsername: 'kenji',
    slug: 'lightness-of-solitary-writing',
    tags: ['Essays', 'Writing', 'Minimalism', 'Philosophy'],
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    readingTimeMinutes: 4,
    upvotes: 42,
    commentCount: 3,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'seed-2',
    title: 'A Private Morning Reflection: Kyoto and the Rain',
    subtitle: 'Personal journal entry — AES-256 client encrypted',
    content: `<p>Woke up to the gentle patter of rain against the cedar eaves. Spent an hour observing how water droplets collect on bamboo leaves before sliding downward. No rush today. Just tea, ink, and silence.</p>
<p>I need to remember to simplify the projects on my desk. More craft, less noise.</p>`,
    isEncrypted: true,
    encryptedPayload: 'U2FsdGVkX18...[AES-GCM-256-ENCRYPTED-JOURNAL]',
    visibility: 'private',
    authorId: 'u-ashwin',
    authorName: 'Ashwin Sharma',
    authorUsername: 'ashwin',
    slug: 'kyoto-rain-morning-reflection',
    tags: ['Personal', 'Reflection', 'Daily Journal'],
    readingTimeMinutes: 2,
    upvotes: 0,
    commentCount: 0,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'seed-3',
    title: 'Designing Without Shadows: The Beauty of Hairline Grids',
    subtitle: 'How 1px borders and thoughtful whitespace create timeless software.',
    content: `<p>Modern software design has oscillated between skeuomorphic excess and over-blurred neumorphism. Yet the most resilient interfaces—from classic Swiss typography to the quiet elegance of editorial publishing—rely on something much more fundamental: structure.</p>
<h2>The Discipline of Zero Gradients</h2>
<p>When you remove gradients and shadows from the designer’s toolkit, something magical happens. You are forced to make typography impeccable. You must calibrate letter spacing, line height, and contrast with absolute precision.</p>
<blockquote class="editorial-quote">"Hairline borders (1px) establish hierarchy without shouting. They guide the eye without creating visual weight."</blockquote>
<p>This is the core foundation behind Tegaki. An homage to the original Medium writer, where the interface dissolves and only your words remain.</p>`,
    isEncrypted: false,
    visibility: 'published',
    authorId: 'u2',
    authorName: 'Elena Rostova',
    authorUsername: 'elena',
    slug: 'designing-without-shadows',
    tags: ['Design', 'Typography', 'UI/UX'],
    coverImage: 'https://images.unsplash.com/photo-1507842229451-79b1be897a27?w=1200&auto=format&fit=crop&q=80',
    readingTimeMinutes: 5,
    upvotes: 89,
    commentCount: 5,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 4,
  }
];

const SEED_COMMENTS: Comment[] = [
  {
    id: 'c1',
    articleId: 'seed-1',
    authorId: 'u2',
    authorName: 'Elena Rostova',
    authorUsername: 'elena',
    content: 'This resonated deeply. The feeling of drafting something in pure peace before deciding to share it is something we lost with social media.',
    createdAt: Date.now() - 86400000 * 1.5,
    upvotes: 8,
  },
  {
    id: 'c2',
    articleId: 'seed-1',
    authorId: 'u3',
    authorName: 'Marcus Aurel',
    authorUsername: 'marcus',
    content: 'The 4-theme palette (especially the warm off-white paper theme) makes reading for hours effortless.',
    createdAt: Date.now() - 86400000 * 1,
    upvotes: 4,
  },
  {
    id: 'c3',
    articleId: 'seed-3',
    authorId: 'u1',
    authorName: 'Kenji Takahashi',
    authorUsername: 'kenji',
    content: 'Hairline borders over drop shadows every single day. Beautiful work.',
    createdAt: Date.now() - 86400000 * 3,
    upvotes: 12,
  }
];

export function getStoredArticles(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(SEED_ARTICLES));
      return SEED_ARTICLES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ARTICLES;
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
    const comments: Comment[] = raw ? JSON.parse(raw) : SEED_COMMENTS;
    if (!raw) {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
    }
    if (articleId) {
      return comments.filter((c) => c.articleId === articleId);
    }
    return comments;
  } catch {
    return SEED_COMMENTS;
  }
}

export function saveComment(comment: Comment): Comment[] {
  const comments = getStoredComments();
  const updated = [comment, ...comments];
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  return updated;
}
