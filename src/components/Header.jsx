import { useRef, useState } from "react";
import { UtensilsCrossed, Home, CalendarCheck, MessageSquareText, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const DESKTOP_NAV = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "reservation", label: "Reserve", icon: CalendarCheck },
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
    <header className="sticky top-0 z-40 bg-cream p-3 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-full shadow-soft px-3 py-2 md:py-2.5 flex items-center gap-3">
        <button
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          onClick={() => onNavigate?.("home")}
          className={`w-10 h-10 md:w-11 md:h-11 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center transition-transform shrink-0 ${
            pressing ? "scale-90" : "scale-100"
          }`}
        >
          <UtensilsCrossed size={18} className="text-primary-600" />
        </button>
        
        {/* Split Text Layout: Big Brand Name + Small Modern Subtitle */}
        <div className="flex flex-col select-none pl-1 justify-center">
          {/* Large Main Title */}
          <h1 className="font-graffiti text-3xl text-center font-bold sm:text-4xl md:text-5xl font- text-primary-700 tracking-wider leading-none skew-x-[-2deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] uppercase">
            Raffick
          </h1>
          {/* Small Subtitle Below */}
          <span className="font-sans text-center text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold-600 uppercase mt-0.5 whitespace-nowrap">
            Family Restaurant
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {DESKTOP_NAV.map(({ key, label, icon: Icon }) => {
            const active = activePage === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate?.(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active ? "bg-primary-500 text-white" : "text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
          <button
            onClick={() => onNavigate?.("cart")}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ml-1 transition-colors ${
              activePage === "cart" ? "bg-gold-400 text-primary-800" : "bg-gold-400/90 text-primary-800 hover:bg-gold-400"
            }`}
          >
            <ShoppingCart size={16} />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary-700 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}