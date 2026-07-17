import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import MenuItemCard from "../components/MenuItemCard";
import { getMenuItems } from "../lib/api";

export default function CategoryPage({ category, onBack, onSelectItem, onToast }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (category) getMenuItems({ categoryId: category.id }).then(setItems);
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-16 space-y-5 md:space-y-8">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-primary-500 hover:text-primary-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-700">{category?.name}</h1>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No items in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onClick={() => onSelectItem(item)}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
