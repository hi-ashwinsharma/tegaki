import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export interface OgImageParams {
  title: string;
  subtitle?: string;
  authorName: string;
  authorUsername: string;
  readingTimeMinutes?: number;
  tags?: string[];
  theme?: 'ivory' | 'white' | 'dark';
}

/**
 * Helper to wrap text cleanly across multiple lines within a max width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
      if (lines.length === maxLines) {
        break;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // If there were more words, append ellipsis to the last line
  if (lines.length === maxLines && words.length > 0) {
    let last = lines[lines.length - 1];
    while (ctx.measureText(`${last}...`).width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last}...`;
  }

  return lines;
}

/**
 * Draw a minimal feather/nib vector on canvas
 */
function drawFeatherIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  // Minimalist stylized feather quill path
  ctx.moveTo(22, 2);
  ctx.bezierCurveTo(15, 2, 6, 8, 4, 16);
  ctx.bezierCurveTo(3, 20, 4, 25, 2, 30);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(22, 2);
  ctx.bezierCurveTo(24, 10, 20, 20, 12, 25);
  ctx.lineTo(2, 30);
  ctx.stroke();

  // Central shaft
  ctx.beginPath();
  ctx.moveTo(22, 2);
  ctx.lineTo(2, 30);
  ctx.stroke();

  ctx.restore();
}

/**
 * Generates an automated 1200x630 OpenGraph preview card on client-side Canvas
 */
export async function generateOgImageBlob(params: OgImageParams): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  // Ensure fonts are loaded if possible
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {}
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isDark = params.theme === 'dark';
  const bgColor = isDark ? '#1C1917' : '#FBF9F5';
  const borderColor = isDark ? '#292524' : '#E7E2D8';
  const textPrimary = isDark ? '#FAFAF9' : '#1C1917';
  const textSecondary = isDark ? '#A8A29E' : '#57534E';
  const textTertiary = isDark ? '#78716C' : '#8C857B';

  // 1. Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1200, 630);

  // 2. Editorial Outer Hairline Border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1200 - 72, 630 - 72);

  // 3. Header Section (y = 80 - 130)
  drawFeatherIcon(ctx, 75, 78, textPrimary);

  ctx.fillStyle = textPrimary;
  ctx.font = '700 24px Newsreader, Georgia, "Times New Roman", serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEGAKI', 118, 94);

  ctx.fillStyle = textTertiary;
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('—  Minimalist Journal & Publication', 232, 94);

  // Hairline Rule below header
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(72, 136);
  ctx.lineTo(1200 - 72, 136);
  ctx.stroke();

  // 4. Main Body: Title & Subtitle (y = 180 - 450)
  const titleText = params.title.trim() || 'Untitled Reflection';
  const titleFontSize = titleText.length > 70 ? 42 : titleText.length > 40 ? 48 : 56;
  ctx.fillStyle = textPrimary;
  ctx.font = `600 ${titleFontSize}px Newsreader, Georgia, "Times New Roman", serif`;
  ctx.textBaseline = 'top';

  const maxContentWidth = 1200 - 160;
  const titleLines = wrapText(ctx, titleText, maxContentWidth, 3);
  const titleLineHeight = titleFontSize * 1.25;

  let currentY = 180;
  for (const line of titleLines) {
    ctx.fillText(line, 80, currentY);
    currentY += titleLineHeight;
  }

  currentY += 16;

  // Subtitle / Excerpt
  if (params.subtitle && params.subtitle.trim()) {
    ctx.fillStyle = textSecondary;
    ctx.font = '400 24px Newsreader, Georgia, "Times New Roman", serif';
    const subtitleLines = wrapText(ctx, params.subtitle.trim(), maxContentWidth, 2);
    for (const sLine of subtitleLines) {
      ctx.fillText(sLine, 80, currentY);
      currentY += 34;
    }
  }

  // 5. Footer Section (y = 480 - 560)
  // Hairline Rule above footer
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(72, 490);
  ctx.lineTo(1200 - 72, 490);
  ctx.stroke();

  // Author Avatar Circle with Initial
  const avatarCenterX = 110;
  const avatarCenterY = 545;
  const avatarRadius = 24;

  ctx.fillStyle = isDark ? '#292524' : '#ECE8DF';
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const authorInitial = (params.authorName || 'W').charAt(0).toUpperCase();
  ctx.fillStyle = textPrimary;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(authorInitial, avatarCenterX, avatarCenterY + 1);

  // Author Name & Username
  ctx.textAlign = 'left';
  ctx.fillStyle = textPrimary;
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(params.authorName || 'Anonymous Writer', 148, 536);

  ctx.fillStyle = textTertiary;
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  const userTag = `@${(params.authorUsername || 'writer').replace(/^@/, '')}`;
  ctx.fillText(userTag, 148, 558);

  // Reading time & tags on the right side
  let metaRightX = 1200 - 90;

  // Tags pill
  if (params.tags && params.tags.length > 0) {
    const primaryTag = params.tags[0];
    ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagWidth = ctx.measureText(`#${primaryTag}`).width + 24;
    const tagX = metaRightX - tagWidth;
    const tagY = 530;

    ctx.fillStyle = isDark ? '#292524' : '#EFECE4';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagWidth, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`#${primaryTag}`, tagX + tagWidth / 2, tagY + 16);

    metaRightX = tagX - 24;
  }

  // Reading time text
  if (params.readingTimeMinutes) {
    ctx.fillStyle = textSecondary;
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${params.readingTimeMinutes} min read`, metaRightX, 546);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.92
    );
  });
}

/**
 * Uploads generated OG image blob to Firebase Storage and returns public download URL
 */
export async function uploadOgImageToStorage(
  blob: Blob,
  articleId: string
): Promise<string | null> {
  if (!isFirebaseConfigured || !storage) {
    return null;
  }

  try {
    const cleanId = articleId.replace(/[^a-zA-Z0-9_-]/g, '');
    const storageRef = ref(storage, `og_images/${cleanId}.jpg`);
    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    });
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.warn('Failed to upload OG image to Firebase Storage:', err);
    return null;
  }
}

/**
 * High-level helper: generate and upload in a single call
 */
export async function generateAndUploadOgImage(
  params: OgImageParams,
  articleId: string
): Promise<string | null> {
  try {
    const blob = await generateOgImageBlob(params);
    if (!blob) return null;
    return await uploadOgImageToStorage(blob, articleId);
  } catch (err) {
    console.warn('Auto OG generation failed gracefully:', err);
    return null;
  }
}
