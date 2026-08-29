export interface UrlPreviewMetadata {
  url: string;
  domain: string;
  title: string;
  description: string;
  image?: string;
  logo?: string;
  isVideo?: boolean;
  videoId?: string;
  videoType?: 'youtube' | 'vimeo';
}

export const getDomain = (url: string): string => {
  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0] || url;
  }
};

export const extractYouTubeId = (url: string): string | null => {
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const extractVimeoId = (url: string): string | null => {
  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+))/i;
  const match = url.match(regExp);
  return match ? match[3] : null;
};

export const fetchUrlPreview = async (url: string): Promise<UrlPreviewMetadata> => {
  const cleanUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  const domain = getDomain(cleanUrl);

  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    return {
      url: cleanUrl,
      domain: 'youtube.com',
      title: 'YouTube Video',
      description: 'Watch this video on YouTube',
      image: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      logo: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64',
      isVideo: true,
      videoId: ytId,
      videoType: 'youtube',
    };
  }

  const vimeoId = extractVimeoId(cleanUrl);
  if (vimeoId) {
    return {
      url: cleanUrl,
      domain: 'vimeo.com',
      title: 'Vimeo Video',
      description: 'Watch this video on Vimeo',
      logo: 'https://www.google.com/s2/favicons?domain=vimeo.com&sz=64',
      isVideo: true,
      videoId: vimeoId,
      videoType: 'vimeo',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && data.data) {
        return {
          url: cleanUrl,
          domain: getDomain(data.data.url || cleanUrl),
          title: data.data.title || domain,
          description: data.data.description || '',
          image: data.data.image?.url || undefined,
          logo: data.data.logo?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch rich embed preview from Microlink, falling back:', err);
  }

  // Fallback with favicon
  return {
    url: cleanUrl,
    domain: domain,
    title: domain,
    description: cleanUrl,
    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  };
};

export const generateEmbedHtml = (
  meta: UrlPreviewMetadata,
  asInteractivePlayer: boolean = true
): string => {
  const safeTitle = (meta.title || meta.domain).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeDesc = (meta.description || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeUrl = meta.url.replace(/"/g, '&quot;');
  const safeDomain = meta.domain.replace(/"/g, '&quot;');
  const logoUrl = meta.logo || `https://www.google.com/s2/favicons?domain=${safeDomain}&sz=64`;

  // 1. Interactive Video Player Embed (YouTube / Vimeo)
  if (asInteractivePlayer && meta.isVideo && meta.videoId) {
    if (meta.videoType === 'youtube') {
      return `
        <div class="embed-video-wrapper my-6 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-black relative select-none group/embed" contenteditable="false">
          <button type="button" class="block-remove-btn" title="Remove video" contenteditable="false">✕</button>
          <iframe src="https://www.youtube-nocookie.com/embed/${meta.videoId}" title="${safeTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full absolute inset-0"></iframe>
        </div>
        <p><br></p>
      `;
    }
    if (meta.videoType === 'vimeo') {
      return `
        <div class="embed-video-wrapper my-6 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-black relative select-none group/embed" contenteditable="false">
          <button type="button" class="block-remove-btn" title="Remove video" contenteditable="false">✕</button>
          <iframe src="https://player.vimeo.com/video/${meta.videoId}" title="${safeTitle}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="w-full h-full absolute inset-0"></iframe>
        </div>
        <p><br></p>
      `;
    }
  }

  // 2. Rich OpenGraph Visual Bookmark Card
  return `
    <div class="embed-card-wrapper my-6 select-none relative group/embed" contenteditable="false">
      <button type="button" class="block-remove-btn" title="Remove embed" contenteditable="false">✕</button>
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="embed-card flex flex-col sm:flex-row rounded-xl overflow-hidden border transition-all duration-150 group">
        <div class="embed-card-content flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div class="embed-card-header flex items-center gap-2 mb-2">
              <img src="${logoUrl}" alt="${safeDomain}" class="w-4 h-4 rounded-sm object-contain" onerror="this.style.display='none'" />
              <span class="embed-card-domain text-xs font-mono">${safeDomain}</span>
            </div>
            <h4 class="embed-card-title text-base sm:text-lg font-serif font-bold group-hover:underline line-clamp-2">${safeTitle}</h4>
            ${safeDesc ? `<p class="embed-card-desc text-xs sm:text-sm mt-1 line-clamp-2">${safeDesc}</p>` : ''}
          </div>
        </div>
        ${
          meta.image
            ? `
        <div class="embed-card-image-container sm:w-48 md:w-56 h-36 sm:h-auto flex-shrink-0 relative bg-stone-100 dark:bg-stone-900">
          <img src="${meta.image}" alt="${safeTitle}" class="w-full h-full object-cover" loading="lazy" onerror="this.parentElement.style.display='none'" />
        </div>
        `
            : ''
        }
      </a>
    </div>
    <p><br></p>
  `;
};
