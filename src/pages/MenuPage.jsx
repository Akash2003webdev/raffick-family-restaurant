import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getCategories, getMenuItems } from "../lib/api";

export default function MenuPage({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMenuData() {
      try {
        setIsLoading(true);
        // Step 1: Subhaana mudhalil categories full-ah fetch pannugirom
        const cats = await getCategories();
        if (!isMounted) return;
        setCategories(cats);

        // Step 2: Ovoru category-kum parallel-ah items count fetch aagum (Safe implementation)
        const entries = await Promise.all(
          cats.map(async (c) => {
            try {
              const items = await getMenuItems({ categoryId: c.id });
              return [c.id, items ? items.length : 0];
            } catch (err) {
              console.error(`Error counting category ${c.id}:`, err);
              return [c.id, 0];
            }
          })
        );

        if (isMounted) {
          setCounts(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error("Error fetching premium menu details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-stone-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-24 space-y-8 md:space-y-12">
        
        {/* Header Section */}
        <div className="border-b border-stone-200/60 pb-5 md:pb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-gold-500 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase block">
              Everything We Serve
            </span>
            <h1 className="font-display font-light text-3xl md:text-4xl text-stone-800 tracking-tight">
              Our Culinary <span className="font-serif italic text-gold-600">Masterpieces</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-stone-500 font-medium max-w-xs md:text-right leading-relaxed">
            Select a curated category below to explore our finely crafted dishes.
          </p>
        </div>

        {/* Dynamic Layout Rendering */}
        {isLoading ? (
          /* Premium Skeleton Loading State */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden border border-stone-100 p-3 space-y-4 shadow-sm animate-pulse">
                <div className="h-28 md:h-36 w-full bg-stone-200 rounded-lg" />
                <div className="space-y-2 py-1">
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Actual Interactive Card Grid Layout */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="group relative bg-white rounded-xl border border-stone-200/60 hover:border-gold-300/80 shadow-sm hover:shadow-xl hover:shadow-gold-950/[0.02] transition-all duration-500 text-left overflow-hidden flex flex-col justify-between focus:outline-none"
              >
                {/* Top Image Structure with Luxury Overlays */}
                <div className="h-28 md:h-36 w-full overflow-hidden relative bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent opacity-60" />
                </div>

                {/* Info Area */}
                <div className="p-4 flex items-center justify-between gap-2 bg-white grow w-full">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-sm md:text-base text-stone-800 tracking-tight group-hover:text-gold-600 transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] md:text-xs font-medium text-stone-400 tracking-wide">
                      {counts[cat.id] !== undefined ? `${counts[cat.id]} items` : "0 items"}
                    </p>
                  </div>
                  
                  {/* Premium Circle Arrow Icon */}
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-stone-50 group-hover:bg-gold-500 flex items-center justify-center transition-all duration-300 shrink-0 border border-stone-100 group-hover:border-gold-400">
                    <ArrowRight 
                      size={14} 
                      className="text-stone-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300" 
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}