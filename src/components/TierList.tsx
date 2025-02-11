import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTierListStore } from '../store/tierListStore';
import { Tier } from './Tier';
import { ItemPool } from './ItemPool';
import { Download, Plus } from 'lucide-react';
import { toPng } from 'html-to-image';

export const TierList: React.FC = () => {
  const { tiers, items, addTier, moveItem } = useTierListStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const sourceTier = tiers.find(tier => 
      tier.items.some(item => item.id === active.id)
    );
    setActiveTier(sourceTier?.id || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (over) {
      const overTier = tiers.find(tier => 
        tier.id === over.id || tier.items.some(item => item.id === over.id)
      );
      setOverId(overTier?.id || null);
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const overId = over.id as string;
      
      // Find target tier (either directly or through an item)
      const targetTier = tiers.find(tier => 
        tier.id === overId || tier.items.some(item => item.id === overId)
      );
      
      if (targetTier) {
        // Skip if dropping in the same tier
        if (targetTier.id === activeTier) {
          return;
        }
        
        // Find index to insert at
        const targetIndex = targetTier.items.findIndex(item => item.id === overId);
        moveItem(
          active.id as string,
          activeTier,
          targetTier.id,
          targetIndex >= 0 ? targetIndex : targetTier.items.length
        );
      } else {
        // Move back to item pool if not dropping on a tier
        moveItem(active.id as string, activeTier, null, items.length);
      }
    }
    
    setActiveId(null);
    setActiveTier(null);
    setOverId(null);
  };

  const handleAddTier = () => {
    const hue = Math.random() * 360;
    const color = `hsl(${hue}, 70%, 60%)`;
    addTier({
      label: 'New Tier',
      color,
    });
  };

  const handleExport = async () => {
    if (!tiersRef.current) return;
    
    try {
      const dataUrl = await toPng(tiersRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#f3f4f6', // Match bg-gray-100
      });
      
      const link = document.createElement('a');
      link.download = 'tier-list.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between mb-4">
          <button
            onClick={handleExport}
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export as PNG
          </button>
          <button
            onClick={handleAddTier}
            className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Tier
          </button>
        </div>
        
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always
            },
          }}
        >
          <div ref={tiersRef} className="space-y-2 mb-4">
            {tiers.map((tier) => (
              <Tier 
                key={tier.id} 
                tier={tier}
                isOver={overId === tier.id}
              />
            ))}
          </div>
          
          <ItemPool items={items} />
          
          <DragOverlay>
            {activeId ? (
              <div className="w-16 h-16 bg-white shadow-lg rounded-lg opacity-80" />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};