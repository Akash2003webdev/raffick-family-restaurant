export default function CategoryShowcase({ categories, onSelect, onViewAll }) {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-gold-500 text-xs font-semibold tracking-[0.15em] uppercase">
            Explore
          </span>
          <h2 className="font-display font-bold text-xl md:text-2xl text-primary-700">Browse Menu</h2>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs md:text-sm font-semibold text-gold-500 hover:text-gold-600">
            View all →
          </button>
        )}
      </div>
      <div className="flex md:grid md:grid-cols-8 gap-4 md:gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="w-20 h-20 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gold-200 shadow-soft group-hover:border-gold-400 transition-colors">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-medium text-primary-700 text-center max-w-[70px] md:max-w-[84px] leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
