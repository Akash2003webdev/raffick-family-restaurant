import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getCategories, getMenuItems } from "../lib/api";

export default function MenuPage({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    getCategories().then(async (cats) => {
      setCategories(cats);
      const entries = await Promise.all(
        cats.map(async (c) => [c.id, (await getMenuItems({ categoryId: c.id })).length])
      );
      setCounts(Object.fromEntries(entries));
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-16 space-y-5 md:space-y-8">
      <div>
        <span className="text-gold-500 text-xs font-semibold tracking-[0.15em] uppercase">
          Everything We Serve
        </span>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-700">Full Menu</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="bg-white rounded-2xl md:rounded-3xl shadow-soft hover:shadow-card overflow-hidden text-left animate-fadeUp transition-shadow group"
          >
            <div className="h-24 md:h-32 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm md:text-base text-primary-800">{cat.name}</h3>
                <p className="text-xs text-gray-400">{counts[cat.id] ?? "…"} items</p>
              </div>
              <ChevronRight size={16} className="text-gold-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
