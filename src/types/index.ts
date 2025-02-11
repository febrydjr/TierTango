export interface Item {
  id: string;
  type: 'text' | 'image';
  content: string;
  fontSize?: number;
}

export interface Tier {
  id: string;
  label: string;
  color: string;
  items: Item[];
}

export interface TierListState {
  tiers: Tier[];
  items: Item[];
  isDarkMode: boolean;
  addTier: (tier: Omit<Tier, 'id' | 'items'>) => void;
  removeTier: (id: string) => void;
  updateTier: (id: string, updates: Partial<Omit<Tier, 'id'>>) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, 'id'>>) => void;
  reorderTiers: (startIndex: number, endIndex: number) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  removeItem: (id: string) => void;
  moveItem: (itemId: string, sourceTierId: string | null, targetTierId: string | null, index: number) => void;
  toggleDarkMode: () => void;
}