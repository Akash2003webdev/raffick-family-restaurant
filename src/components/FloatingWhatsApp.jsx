import { MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { restaurantInfo } from "../lib/data";
import { buildOrderMessage, sendWhatsAppMessage } from "../lib/whatsapp";

export default function FloatingWhatsApp({ onNavigate }) {
  const { items } = useCart();

  function handleClick() {
    if (items.length > 0) {
      onNavigate("cart");
      return;
    }
    sendWhatsAppMessage(
      `Hi ${restaurantInfo.name}! I'd like to know more about your menu.`
    );
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-30 w-14 h-14 rounded-full bg-green-500 shadow-card flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white fill-white/10" />
    </button>
  );
}
