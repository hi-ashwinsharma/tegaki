/**
 * Text utility metrics for editorial reading time and word calculations
 */

export function calculateWordCount(text: string): number {
  if (!text) return 0;
  // Strip HTML tags if present
  const plainText = text.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = calculateWordCount(text);
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
