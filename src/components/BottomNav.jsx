import { Home, UtensilsCrossed, MessageSquareText, MessageCircleQuestion, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "enquiry", label: "Enquiry", icon: MessageCircleQuestion },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
  { key: "cart", label: "Cart", icon: ShoppingCart },
];

export default function BottomNav({ activePage, onNavigate }) {
  const { itemCount } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(107,21,34,0.08)]">
      <div className="max-w-5xl mx-auto flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px]"
            >
              <Icon
                size={22}
                className={active ? "text-primary-500" : "text-gray-400"}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary-500" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {key === "cart" && itemCount > 0 && (
                <span className="absolute -top-1 right-1 bg-gold-400 text-primary-800 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
