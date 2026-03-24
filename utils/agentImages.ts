import alexImage from '../assets/images/alex.jpg';
import davidImage from '../assets/images/david.jpg';
import emmaImage from '../assets/images/emma.jpg';
import sarahImage from '../assets/images/sarah.jpg';
import sophiaImage from '../assets/images/sophia.jpg';
import reserveMaleImage from '../assets/images/reserve_male.jpg';

const agentImageMap: Record<string, any> = {
  alex: alexImage,
  david: davidImage,
  emma: emmaImage,
  sarah: sarahImage,
  sophia: sophiaImage,
  reserve_male: reserveMaleImage,
};

const fallbackAgentImage = reserveMaleImage;

function normalizeAgentKey(name?: string) {
  if (!name) return null;
  const raw = name.trim().toLowerCase();
  if (!raw) return null;
  const compact = raw.replace(/[^a-z0-9_]/g, '');
  const firstToken = raw.split(/[^a-z0-9_]+/).filter(Boolean)[0];
  return { raw, compact, firstToken };
}

function resolveAgentKeyFromName(name?: string) {
  const normalized = normalizeAgentKey(name);
  if (!normalized) return null;
  if (normalized.raw.includes('alex')) return 'alex';
  if (agentImageMap[normalized.raw]) return normalized.raw;
  if (normalized.firstToken && agentImageMap[normalized.firstToken]) return normalized.firstToken;
  if (agentImageMap[normalized.compact]) return normalized.compact;
  return null;
}

function resolveAgentKeyFromImageKey(imageKey?: string) {
  if (!imageKey) return null;
  const raw = imageKey.trim().toLowerCase();
  if (!raw) return null;
  const withoutExt = raw.replace(/\.(png|jpe?g|webp)$/i, '');
  if (agentImageMap[withoutExt]) return withoutExt;
  return resolveAgentKeyFromName(withoutExt);
}

export function getAgentImageKeyByName(name?: string) {
  const key = resolveAgentKeyFromName(name);
  return key ? `${key}.jpg` : 'reserve_male.jpg';
}

export function getAgentImageSourceByName(name?: string) {
  const key = resolveAgentKeyFromName(name);
  return (key && agentImageMap[key]) || fallbackAgentImage;
}

export function getAgentImageSourceByKey(imageKey?: string) {
  const key = resolveAgentKeyFromImageKey(imageKey);
  return (key && agentImageMap[key]) || fallbackAgentImage;
}

export function getAgentImageSource(imageKey?: string, nameFallback?: string) {
  if (imageKey) {
    return getAgentImageSourceByKey(imageKey);
  }
  return getAgentImageSourceByName(nameFallback);
}
