export interface Ornament {
  id: string;
  emoji: string;
  name: string;
}

export interface PlacedOrnament extends Ornament {
  x: number;
  y: number;
}

export const ORNAMENTS: Ornament[] = [
  { id: 'cookie', emoji: '🍪', name: 'Cookie' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'red-ball', emoji: '🔴', name: 'Red Ball' },
  { id: 'gold-ball', emoji: '🟡', name: 'Gold Ball' },
  { id: 'blue-ball', emoji: '🔵', name: 'Blue Ball' },
  { id: 'ribbon', emoji: '🎀', name: 'Ribbon' },
  { id: 'gift', emoji: '🎁', name: 'Gift' },
  { id: 'bell', emoji: '🔔', name: 'Bell' },
  { id: 'snowflake', emoji: '❄️', name: 'Snowflake' },
  { id: 'candle', emoji: '🕯️', name: 'Candle' },
  { id: 'reindeer', emoji: '🦌', name: 'Reindeer' },
  { id: 'snowman', emoji: '⛄', name: 'Snowman' },
  { id: 'santa', emoji: '🎅', name: 'Santa' },
  { id: 'stocking', emoji: '🧦', name: 'Stocking' },
  { id: 'candy', emoji: '🍭', name: 'Candy' },
  { id: 'glowing-star', emoji: '🌟', name: 'Glowing Star' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
  { id: 'ornament', emoji: '🎪', name: 'Ornament' },
  { id: 'music', emoji: '🎵', name: 'Music' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle' },
];
