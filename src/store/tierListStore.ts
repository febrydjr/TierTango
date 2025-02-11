import { create } from 'zustand';
import { TierListState, Item } from '../types';

const defaultTiers = [
  { id: 's', label: 'S', color: '#FF7F7F', items: [] },
  { id: 'aplus', label: 'A+', color: '#FFBF7F', items: [] },
  { id: 'a', label: 'A', color: '#FFDF7F', items: [] },
  { id: 'aminus', label: 'A-', color: '#FFFF7F', items: [] },
  { id: 'bplus', label: 'B+', color: '#BFFF7F', items: [] },
  { id: 'b', label: 'B', color: '#7FFF7F', items: [] },
  { id: 'bminus', label: 'B-', color: '#7FFFFF', items: [] },
  { id: 'c', label: 'C', color: '#7FBFFF', items: [] },
];

export const useTierListStore = create<TierListState>((set) => ({
  tiers: defaultTiers,
  items: [],
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

  addTier: (tier) =>
    set((state) => ({
      tiers: [...state.tiers, { ...tier, id: crypto.randomUUID(), items: [] }],
    })),

  removeTier: (id) =>
    set((state) => ({
      tiers: state.tiers.filter((tier) => tier.id !== id),
      items: [
        ...state.items,
        ...state.tiers.find((tier) => tier.id === id)?.items || [],
      ],
    })),

  updateTier: (id, updates) =>
    set((state) => ({
      tiers: state.tiers.map((tier) =>
        tier.id === id ? { ...tier, ...updates } : tier
      ),
    })),

  updateItem: (id, updates) =>
    set((state) => {
      const newTiers = state.tiers.map(tier => ({
        ...tier,
        items: tier.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
      
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );

      return {
        tiers: newTiers,
        items: newItems,
      };
    }),

  reorderTiers: (startIndex, endIndex) =>
    set((state) => {
      const newTiers = [...state.tiers];
      const [removed] = newTiers.splice(startIndex, 1);
      newTiers.splice(endIndex, 0, removed);
      return { tiers: newTiers };
    }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: crypto.randomUUID() }],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      tiers: state.tiers.map((tier) => ({
        ...tier,
        items: tier.items.filter((item) => item.id !== id),
      })),
    })),

  moveItem: (itemId, sourceTierId, targetTierId, index) =>
    set((state) => {
      let item: Item | undefined;
      let newItems = [...state.items];
      let newTiers = [...state.tiers];

      // Remove item from source
      if (sourceTierId === null) {
        item = newItems.find((i) => i.id === itemId);
        newItems = newItems.filter((i) => i.id !== itemId);
      } else {
        const sourceTier = newTiers.find((t) => t.id === sourceTierId);
        if (sourceTier) {
          item = sourceTier.items.find((i) => i.id === itemId);
          newTiers = newTiers.map((tier) =>
            tier.id === sourceTierId
              ? { ...tier, items: tier.items.filter((i) => i.id !== itemId) }
              : tier
          );
        }
      }

      if (!item) return state;

      // Add item to target
      if (targetTierId === null) {
        newItems.splice(index, 0, item);
      } else {
        newTiers = newTiers.map((tier) => {
          if (tier.id === targetTierId) {
            const newTierItems = [...tier.items];
            newTierItems.splice(index, 0, item!);
            return { ...tier, items: newTierItems };
          }
          return tier;
        });
      }

      return { items: newItems, tiers: newTiers };
    }),

  toggleDarkMode: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
    })),
}));