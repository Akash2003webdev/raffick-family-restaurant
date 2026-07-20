import { useRef, useState } from "react";
import { UtensilsCrossed, Home, MessageSquareText, MessageCircleQuestion, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const DESKTOP_NAV = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "enquiry", label: "Enquiry", icon: MessageCircleQuestion },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
];

export default function Header({ onAdminTrigger, activePage, onNavigate }) {
  const timerRef = useRef(null);
  const [pressing, setPressing] = useState(false);
  const { itemCount } = useCart();

  function startPress() {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      onAdminTrigger?.();
      setPressing(false);
    }, 600);
  }

  function cancelPress() {
    setPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  return (
   <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
  <div className="max-w-7xl mx-auto px-5 py-4">
    <div className="flex items-center justify-between rounded-full bg-white/90 shadow-2xl border border-gray-100 px-5 py-3">

      {/* Logo */}
      <div className="flex items-center gap-4">

      <button
  onMouseDown={startPress}
  onMouseUp={cancelPress}
  onMouseLeave={cancelPress}
  onTouchStart={startPress}
  onTouchEnd={cancelPress}
  onClick={() => onNavigate?.("home")}
  className="group w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 hover:rotate-12"
>
  <img
    src="/src/assets/logo.png"
    alt="Raffick Family Restaurant"
    className="w-full h-full object-cover transition-transform group-hover:scale-125"
  />
</button> 

        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-wide text-gray-900">
            Raffick
          </h1>

          <p className="text-xs uppercase tracking-[0.35em] text-amber-600 font-semibold">
            Family Restaurant
          </p>
        </div>

      </div>

      {/* Desktop Nav */}

      <nav className="hidden lg:flex items-center gap-3">

        {DESKTOP_NAV.map(({ key, label, icon: Icon }) => {

          const active = activePage === key;

          return (
            <button
              key={key}
              onClick={() => onNavigate?.(key)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300

              ${
                active
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-amber-50 hover:text-amber-600 hover:scale-105"
              }
              `}
            >
              <Icon
                size={18}
                className="transition-transform duration-300 group-hover:rotate-12"
              />

              {label}
            </button>
          );
        })}

        {/* Cart */}

        <button
          onClick={() => onNavigate?.("cart")}
          className="relative ml-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <ShoppingCart size={18} />

          Cart

          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-4 ring-white animate-pulse">
              {itemCount}
            </span>
          )}
        </button>

      </nav>

    </div>
  </div>
</header>
  );
}
