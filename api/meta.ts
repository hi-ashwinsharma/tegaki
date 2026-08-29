/**
 * Vercel Serverless Function: Dynamic OpenGraph / Social Crawler Handler for Tegaki
 * Injects article-specific OpenGraph and Twitter card metadata for WhatsApp, Twitter, Facebook, iMessage, etc.
 */

interface FirestoreFieldString {
  stringValue?: string;
}
interface FirestoreFieldInteger {
  integerValue?: string | number;
}
interface FirestoreFields {
  title?: FirestoreFieldString;
  subtitle?: FirestoreFieldString;
  authorName?: FirestoreFieldString;
  authorUsername?: FirestoreFieldString;
  slug?: FirestoreFieldString;
  coverImage?: FirestoreFieldString;
  visibility?: FirestoreFieldString;
  readingTimeMinutes?: FirestoreFieldInteger;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: any, res: any) {
  const { username, slug, id } = req.query;

  const projectId =
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'tegaki-app';

  let articleTitle = 'Tegaki — Minimalist Journal & Writer';
  let articleSubtitle = 'First for yourself. Then, for the world.';
  let authorName = 'Tegaki';
  let coverImage = '';
  let canonicalPath = '/';

  const host =
    req.headers['x-forwarded-host'] || req.headers.host || 'tegaki.app';
  const protocol =
    req.headers['x-forwarded-proto'] ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;

  try {
    if (slug) {
      const cleanSlug = String(slug).toLowerCase().trim();
      const cleanUser = username
        ? String(username).toLowerCase().replace(/^@/, '').trim()
        : '';

      canonicalPath = cleanUser ? `/@${cleanUser}/${cleanSlug}` : `/story/${cleanSlug}`;

      // Query Firestore REST API for matching slug & visibility
      const firestoreQueryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: 'articles' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: cleanSlug },
            },
          },
          limit: 1,
        },
      };

      const response = await fetch(firestoreQueryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryBody),
      });

      if (response.ok) {
        const results = await response.json();
        if (Array.isArray(results) && results[0]?.document?.fields) {
          const fields: FirestoreFields = results[0].document.fields;
          articleTitle = fields.title?.stringValue || articleTitle;
          articleSubtitle = fields.subtitle?.stringValue || articleSubtitle;
          authorName = fields.authorName?.stringValue || authorName;
          coverImage = fields.coverImage?.stringValue || '';
        }
      }
    } else if (id) {
      const cleanId = String(id).trim();
      canonicalPath = `/story/${cleanId}`;

      const firestoreDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/articles/${cleanId}`;
      const response = await fetch(firestoreDocUrl);

      if (response.ok) {
        const doc = await response.json();
        if (doc?.fields) {
          const fields: FirestoreFields = doc.fields;
          articleTitle = fields.title?.stringValue || articleTitle;
          articleSubtitle = fields.subtitle?.stringValue || articleSubtitle;
          authorName = fields.authorName?.stringValue || authorName;
          coverImage = fields.coverImage?.stringValue || '';
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching article metadata for OG injection:', err);
  }

  const fullUrl = `${baseUrl}${canonicalPath}`;
  const fullCoverImage = coverImage || `${baseUrl}/hero.png`;

  const html = `<!doctype html>
<html lang="en" data-theme="white">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>${escapeHtml(articleTitle)} — Tegaki</title>
    <meta name="description" content="${escapeHtml(articleSubtitle)}" />

    <!-- OpenGraph / WhatsApp / Facebook / LinkedIn -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Tegaki" />
    <meta property="og:title" content="${escapeHtml(articleTitle)}" />
    <meta property="og:description" content="${escapeHtml(articleSubtitle)}" />
    <meta property="og:image" content="${escapeHtml(fullCoverImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escapeHtml(fullUrl)}" />

    <!-- Twitter / 𝕏 -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@tegaki" />
    <meta name="twitter:title" content="${escapeHtml(articleTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(articleSubtitle)}" />
    <meta name="twitter:image" content="${escapeHtml(fullCoverImage)}" />
    ${authorName ? `<meta name="twitter:creator" content="${escapeHtml(authorName)}" />` : ''}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
