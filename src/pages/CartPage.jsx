import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Hash,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ConfirmOrderModal from "../components/ConfirmOrderModal";
import { orderTypes } from "../lib/data";
import { buildOrderMessage, sendWhatsAppMessage } from "../lib/whatsapp";
import { submitOrder } from "../lib/api";
import { isItemOrderableNow, getUnavailableReason } from "../lib/timeRestrictions";

export default function CartPage({ onToast, onOrderSent }) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [orderType, setOrderType] = useState("Dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Time Restriction Integration
  const blockedItems = items.filter((i) => !isItemOrderableNow(i.categoryName));

  const canOrder =
    items.length > 0 &&
    blockedItems.length === 0 &&
    name.trim() &&
    phone.trim().length >= 10 &&
    (orderType !== "Dine-in" || tableNumber.trim()) &&
    (orderType !== "Delivery" || address.trim());

  async function handleSend() {
    const message = buildOrderMessage({
      cartItems: items,
      orderType,
      tableNumber,
      address,
      name,
      phone,
    });
    try {
      await submitOrder({
        cartItems: items,
        orderType,
        tableNumber,
        address,
        name,
        phone,
        total,
      });
    } catch (err) {
      console.error("Failed to save order to backend:", err);
    }
    sendWhatsAppMessage(message);
    clearCart();
    setShowConfirm(false);
    onToast?.("Order sent via WhatsApp!");
    onOrderSent?.();
  }

  // Modern Empty Cart Screen
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100/80 mb-6 shadow-inner relative">
          <ShoppingBag size={32} className="text-gray-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-amber-400" />
        </div>
        <h2 className="font-display font-black text-xl text-gray-800 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
          Looks like you haven't added anything to your cart yet. Head back to our delicious menu!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-40 md:pb-20 min-h-screen bg-gray-50/40">
      
      {/* Title Header */}
      <div className="mb-6 md:mb-10">
        <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
          <Sparkles size={14} /> Review & Checkout
        </span>
        <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
          Your Culinary Basket
        </h1>
      </div>

      {/* Time Restriction Alert Banner */}
      {blockedItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs md:text-sm rounded-2xl p-4 mb-6 flex items-start gap-3 backdrop-blur-sm animate-fadeUp">
          <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {blockedItems.map((i) => i.name).join(", ")}
            </span>{" "}
            {blockedItems.length > 1 ? "are" : "is"} currently unavailable.{" "}
            <span className="text-amber-700 font-medium">
              {getUnavailableReason(blockedItems[0].categoryName)}.
            </span>{" "}
            Please remove {blockedItems.length > 1 ? "them" : "this item"} to proceed with your order.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 items-start">
        
        {/* Responsive Items List */}
        <div className="space-y-4">
          {items.map((item) => {
            const isBlocked = !isItemOrderableNow(item.categoryName);
            return (
              <div
                key={`${item.id}-${item.variantId || "default"}`}
                className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 ${
                  isBlocked
                    ? "border-amber-200/80 bg-amber-50/10 shadow-none"
                    : "border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                  />
                  {isBlocked && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center p-1">
                      <Clock size={16} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base text-gray-800 truncate">
                    {item.name}
                  </h3>
                  {item.variantName && (
                    <span className="inline-block bg-gray-50 text-gray-500 font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 border border-gray-100">
                      {item.variantName}
                    </span>
                  )}
                  <div className="text-base font-extrabold text-amber-600 mt-1">
                    ₹{item.price}
                  </div>
                </div>

                {/* Modern Premium Quantity Controls */}
                <div className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-100 rounded-full p-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90 hover:text-amber-600"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-5 text-center text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90 hover:text-amber-600"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Trash Action */}
                <button
                  onClick={() => removeItem(item.id, item.variantId)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 transition-colors rounded-xl hover:bg-rose-50/50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Premium Checkout Side Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-5 md:p-6 space-y-6 lg:sticky lg:top-28 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          
          {/* Order Type Tabs */}
          <div>
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase mb-2.5 block px-1">
              Order Details
            </label>
            <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-2xl">
              {orderTypes.map((type) => {
                const active = orderType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-[1.02]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Input Fields */}
          <div className="space-y-4">
            {orderType === "Dine-in" && (
              <div className="relative group">
                <Hash size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Table Number *"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            )}
            
            {orderType === "Delivery" && (
              <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                <textarea
                  placeholder="Full Delivery Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 resize-none"
                />
              </div>
            )}

            <div className="relative group">
              <User size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                placeholder="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div className="relative group">
              <Phone size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>
          </div>

          {/* Desktop Summary Footer */}
          <div className="hidden md:block border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Basket Subtotal</span>
              <span className="font-display font-black text-2xl text-gray-900">₹{total}</span>
            </div>
            
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canOrder}
              className="group w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/10 disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              Order via WhatsApp
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100/80 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total</span>
            <span className="font-display font-black text-xl text-gray-900">₹{total}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canOrder}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wide shadow-md shadow-orange-500/10 disabled:opacity-40 transition-transform active:scale-95"
          >
            Order via WhatsApp
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmOrderModal
        open={showConfirm}
        title="Verify Your Feast"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSend}
      >
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Order Modality</span>
              <span className="font-bold text-amber-600 text-sm">{orderType}</span>
            </div>
            {orderType === "Dine-in" && tableNumber && (
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Table</span>
                <span className="font-bold text-gray-800 text-sm">#{tableNumber}</span>
              </div>
            )}
            {orderType === "Delivery" && address && (
              <div className="text-right max-w-[150px] truncate">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Delivery To</span>
                <span className="font-medium text-gray-700 text-xs truncate block">{address}</span>
              </div>
            )}
          </div>

          <div className="border border-gray-100 rounded-2xl p-3.5 space-y-2.5 bg-white shadow-inner max-h-40 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variantId || "default"}`}
                className="flex justify-between items-start text-xs text-gray-600"
              >
                <span className="font-medium max-w-[70%]">
                  {item.name} {item.variantName ? `(${item.variantName})` : ""} <span className="text-amber-600 font-bold">x{item.quantity}</span>
                </span>
                <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center font-black text-gray-900 text-base">
            <span>Amount Payable</span>
            <span className="text-xl text-amber-600">₹{total}</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50/50 text-amber-800 p-3 rounded-xl border border-amber-100/60 text-xs font-medium">
            <AlertCircle size={14} className="shrink-0" />
            <p className="truncate">
              Sending to: <span className="font-bold">{name}</span> ({phone})
            </p>
          </div>
        </div>
      </ConfirmOrderModal>
    </div>
  );
}