import React, { useRef } from 'react';
import { Item as ItemType } from '../types';
import { Plus, Image, Type } from 'lucide-react';
import { useTierListStore } from '../store/tierListStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItemPoolProps {
  items: ItemType[];
}

export const ItemPool: React.FC<ItemPoolProps> = ({ items }) => {
  const { addItem } = useTierListStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTextItem = () => {
    addItem({
      type: 'text',
      content: 'New Item',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addItem({
          type: 'image',
          content: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Item Pool</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAddTextItem}
            className="p-3 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <Type className="w-5 h-5" />
            Add Text
          </button>
          <button
            onClick={handleAddImageClick}
            className="p-3 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Image className="w-5 h-5" />
            Add Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Please add new items using the buttons above
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2">
          {items.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

interface DraggableItemProps {
  item: ItemType;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {item.type === 'image' ? (
        <img src={item.content} alt="" className="w-full h-full object-cover rounded" />
      ) : (
        <span className="text-sm dark:text-white">{item.content}</span>
      )}
    </div>
  );
};