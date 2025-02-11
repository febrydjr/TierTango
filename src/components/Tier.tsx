import React, { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tier as TierType, Item as ItemType } from '../types';
import { GripVertical, X, Edit2, Check, Image, Trash2 } from 'lucide-react';
import { useTierListStore } from '../store/tierListStore';

interface TierProps {
  tier: TierType;
  isOver: boolean;
}

export const Tier: React.FC<TierProps> = ({ tier, isOver }) => {
  const { removeTier, updateTier, updateItem, removeItem } = useTierListStore();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTierName, setEditingTierName] = useState(false);
  const [tierName, setTierName] = useState(tier.label);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: tier.id,
    disabled: true // Disable tier dragging
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleEditItem = (item: ItemType) => {
    setEditingItemId(item.id);
    setEditingContent(item.content);
  };

  const handleSaveEdit = () => {
    if (editingItemId) {
      updateItem(editingItemId, { content: editingContent });
      setEditingItemId(null);
    }
  };

  const handleSaveTierName = () => {
    updateTier(tier.id, { label: tierName });
    setEditingTierName(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateItem(itemId, {
          type: 'image',
          content: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm ${
        isOver ? 'ring-2 ring-indigo-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-6 h-6 text-gray-400" />
      </div>

      <div
        className="w-24 h-24 rounded flex items-center justify-center text-white font-bold text-2xl cursor-pointer relative"
        style={{ backgroundColor: tier.color }}
        onClick={handleColorClick}
      >
        {editingTierName ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
            <input
              type="text"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTierName()}
              className="w-3/4 text-center bg-transparent outline-none border-b-2 border-white"
              autoFocus
            />
            <button
              onClick={handleSaveTierName}
              className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-bl"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span
            className="w-full text-center cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTierName(true);
            }}
          >
            {tier.label}
          </span>
        )}
        <input
          ref={colorInputRef}
          type="color"
          value={tier.color}
          onChange={(e) => updateTier(tier.id, { color: e.target.value })}
          className="hidden"
        />
      </div>

      <div className="flex-1 min-h-[6rem] bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2">
          {tier.items.map((item) => (
            <div
              key={item.id}
              className="group aspect-square bg-white dark:bg-gray-600 rounded flex items-center justify-center relative"
            >
              {editingItemId === item.id ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-600 rounded z-10">
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full h-full text-center bg-transparent outline-none dark:text-white"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-bl"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  {item.type === 'image' ? (
                    <img src={item.content} alt="" className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-sm dark:text-white">{item.content}</span>
                  )}
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-1 bg-blue-500 text-white rounded-bl"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 bg-green-500 text-white rounded-bl"
                    >
                      <Image className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 bg-red-500 text-white rounded-bl"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, item.id)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => removeTier(tier.id)}
        className="p-2 text-gray-400 hover:text-red-500"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};