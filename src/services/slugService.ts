/**
 * Slug generator, live input formatter, and sanitizer for Medium-style URLs
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

/**
 * Format live typing in slug input:
 * - Converts spaces and underscores to hyphens
 * - Strips forbidden characters (keeps a-z, 0-9, and hyphens)
 * - Collapses multiple consecutive hyphens into one
 * - Preserves trailing hyphens so the user can freely type hyphens and spaces
 */
export function formatSlugInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Final sanitization before saving:
 * - Formats input
 * - Trims leading and trailing hyphens
 */
export function sanitizeSlug(input: string): string {
  return formatSlugInput(input).replace(/^-+|-+$/g, '');
}

export function buildArticlePath(username: string, slug?: string, id?: string): string {
  if (slug && slug.trim().length > 0) {
    return `/@${username.replace(/^@/, '')}/${slug}`;
  }
  return `/story/${id}`;
}
