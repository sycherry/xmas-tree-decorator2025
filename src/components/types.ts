export interface Ornament {
  id: string;
  emoji: string;
  name: string;
  imageUrl?: string;
}

export interface PlacedOrnament extends Ornament {
  x: number;
  y: number;
}

export const ORNAMENTS: Ornament[] = [
  { id: 'gift', emoji: '🎁', name: 'Gift' },
  { id: 'snowflake', emoji: '❄️', name: 'Snowflake' },
  { id: 'reindeer', emoji: '🦌', name: 'Reindeer' },
  { id: 'snowman', emoji: '⛄', name: 'Snowman' },
  { id: 'santa', emoji: '🎅', name: 'Santa' },
  { id: 'stocking', emoji: '🧦', name: 'Stocking' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
  { id: 'alien', emoji: '👽', name: 'Alien' },
  { id: 'retro-game', emoji: '👾', name: 'Retro Game' },
  { id: 'controller', emoji: '🎮', name: 'Controller' },
];
