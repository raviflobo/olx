const MAX_CAR_IMAGES = 10;

export function isValidImageUrl(url) {
  try {
    const parsed = new URL(url.trim());
    return /^https?:$/i.test(parsed.protocol);
  } catch {
    return false;
  }
}

/** Split pasted text into unique valid http(s) URLs. */
export function parseImageUrls(text) {
  if (!text || !String(text).trim()) return [];
  const parts = String(text)
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const unique = [];
  parts.forEach((url) => {
    if (isValidImageUrl(url) && !unique.includes(url)) {
      unique.push(url);
    }
  });
  return unique;
}

export function mergeImageUrls(existing, incoming, max = MAX_CAR_IMAGES) {
  const merged = [...existing];
  incoming.forEach((url) => {
    if (merged.length >= max) return;
    if (!merged.includes(url)) merged.push(url);
  });
  return merged;
}

export { MAX_CAR_IMAGES };
