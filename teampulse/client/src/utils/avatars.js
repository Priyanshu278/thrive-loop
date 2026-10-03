// Curated, guaranteed high-resolution portrait URLs
export const VERIFIED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
];

export function getMemberAvatar(index = 0, name = '') {
  return VERIFIED_AVATARS[Math.abs(index) % VERIFIED_AVATARS.length];
}

/**
 * Fallback event handler to replace any broken or blocked avatar images
 * with a crisp, personalized SVG badge using user initials.
 */
export function handleAvatarError(e, name = 'User') {
  const parts = String(name).trim().split(/\s+/);
  const rawFirst = (parts[0]?.[0] || 'T').toString();
  const rawSecond = (parts[1]?.[0] || parts[0]?.[1] || 'P').toString();
  const initials = (rawFirst.replace(/[^A-Za-z0-9]/g, '') || 'T') + (rawSecond.replace(/[^A-Za-z0-9]/g, '') || 'P');
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#059669'];
  const charCode = (name || 'U').replace(/[^A-Za-z0-9]/g, '').charCodeAt(0) || 65;
  const bg = colors[charCode % colors.length];

  e.target.onerror = null;
  e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${encodeURIComponent(bg)}"/><text x="50%" y="55%" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${initials.toUpperCase()}</text></svg>`;
}
