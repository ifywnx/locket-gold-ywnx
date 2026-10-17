// Strictly limited Remote Config widget image selection.
// This is a web-based selector, NOT a native Locket theme picker.
export const v6Themes = [
  { id: 'original', name: 'Khung gốc', emoji: '📷', ready: true },
  { id: 'shinchan', name: 'Shin-chan', emoji: '🧢', ready: true },
  { id: 'capybara', name: 'Capybara', emoji: '🦫', ready: false },
  { id: 'chihuahua', name: 'Chihuahua', emoji: '🐕', ready: false },
  { id: 'kitty', name: 'Kittycore', emoji: '🎀', ready: false },
  { id: 'meme', name: 'Meme', emoji: '😂', ready: false },
  { id: 'custom', name: 'Ảnh của bạn', emoji: '🖼️', ready: false },
] as const;

export type V6Choice = {
  theme: string;
  frameUrl: string;
  popup: boolean;
};

const SHINCHAN_URL = 'https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png';

export function getV6Choice(query: URLSearchParams): V6Choice | null {
  const theme = query.get('theme') || 'original';
  if (!v6Themes.some(item => item.id === theme)) return null;
  const popup = query.get('popup') === '1';
  if (theme === 'original') return { theme, popup, frameUrl: '' };
  if (theme === 'shinchan') return { theme, popup, frameUrl: SHINCHAN_URL };

  // Require an image explicitly provided by the user for these themes.
  // Do not hotlink random unverified copyrighted images from other sites.
  const submitted = query.get('image') || '';
  if (submitted.length === 0 || submitted.length > 512) return null;
  try {
    const parsed = new URL(submitted);
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== 'i.ibb.co' ||
      parsed.username || parsed.password ||
      parsed.search || parsed.hash ||
      !/^\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp)$/i.test(parsed.pathname) ||
      parsed.pathname.includes('..')
    ) return null;
    return { theme, popup, frameUrl: parsed.href };
  } catch { return null; }
}
