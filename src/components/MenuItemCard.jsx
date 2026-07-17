import { Plus } from "lucide-react";
import VegBadge from "./VegBadge";
import Stars from "./Stars";
import { useCart } from "../context/CartContext";

export default function MenuItemCard({ item, onClick, onToast }) {
  const { addItem } = useCart();
  const isSoldOut = item.status === "sold_out";
  const defaultVariant = item.variants?.[0];

  function handleQuickAdd(e) {
    e.stopPropagation();
    if (isSoldOut) return;
    addItem({
      id: item.id,
      name: item.name,
      price: defaultVariant?.price ?? 0,
      variantId: defaultVariant?.id ?? null,
      variantName: defaultVariant?.name ?? null,
      image: item.images?.[0],
      quantity: 1,
    });
    onToast?.(`${item.name} added to cart`);
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl md:rounded-3xl shadow-soft hover:shadow-card overflow-hidden animate-fadeUp cursor-pointer flex flex-col transition-shadow duration-300 group"
    >
      <div className="relative h-32 md:h-40 overflow-hidden">
        <img
          src={item.images?.[0]}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wide">Sold Out</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 rounded-md p-0.5">
          <VegBadge type={item.veg_type} size={14} />
        </div>
      </div>
      <div className="p-3 md:p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-sm md:text-[15px] text-primary-800 leading-tight">{item.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 hidden sm:block">{item.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col gap-0.5">
            <Stars rating={item.rating} size={12} />
            {defaultVariant && (
              <span className="text-sm md:text-base font-bold text-primary-600">₹{defaultVariant.price}</span>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 flex items-center justify-center shadow-soft transition-colors shrink-0"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
