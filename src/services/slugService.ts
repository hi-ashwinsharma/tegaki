/**
 * Slug generator and validator for Medium-style URLs
 */

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildArticlePath(username: string, slug?: string, id?: string): string {
  if (slug && slug.trim().length > 0) {
    return `/@${username.replace(/^@/, '')}/${slug}`;
  }
  return `/story/${id}`;
}
