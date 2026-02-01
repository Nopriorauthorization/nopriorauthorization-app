export type MascotId =
  | 'founder'
  | 'beau-tox'
  | 'decode'
  | 'harmony'
  | 'peppi'
  | 'roots'
  | 'slim-t';

export interface MascotMediaConfig {
  id: MascotId;
  displayName: string;
  videoSrc: string;
  themeColor: 'pink' | 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  chatPersona: string;
}

export const MASCOT_MEDIA: Record<MascotId, MascotMediaConfig> = {
  founder: {
    id: 'founder',
    displayName: 'Founder',
    videoSrc: '/videos/mascots/founder.mp4',
    themeColor: 'pink',
    chatPersona: 'founder',
  },

  'beau-tox': {
    id: 'beau-tox',
    displayName: 'Beau-Tox',
    videoSrc: '/videos/mascots/beau-tox.mp4',
    themeColor: 'purple',
    chatPersona: 'beau-tox',
  },

  decode: {
    id: 'decode',
    displayName: 'Decode',
    videoSrc: '/videos/mascots/decode.mp4',
    themeColor: 'blue',
    chatPersona: 'decode',
  },

  harmony: {
    id: 'harmony',
    displayName: 'Harmony',
    videoSrc: '/videos/mascots/harmony.mp4',
    themeColor: 'purple',
    chatPersona: 'harmony',
  },

  peppi: {
    id: 'peppi',
    displayName: 'Peppi',
    videoSrc: '/videos/mascots/peppi.mp4',
    themeColor: 'yellow',
    chatPersona: 'peppi',
  },

  roots: {
    id: 'roots',
    displayName: 'Roots',
    videoSrc: '/videos/mascots/roots.mp4',
    themeColor: 'green',
    chatPersona: 'roots',
  },

  'slim-t': {
    id: 'slim-t',
    displayName: 'Slim-T',
    videoSrc: '/videos/mascots/slim-t.mp4',
    themeColor: 'red',
    chatPersona: 'slim-t',
  },
};