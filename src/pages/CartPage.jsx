import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import ConfirmOrderModal from "../components/ConfirmOrderModal";
import { orderTypes } from "../lib/data";
import { buildOrderMessage, sendWhatsAppMessage } from "../lib/whatsapp";

export default function CartPage({ onToast, onOrderSent }) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [orderType, setOrderType] = useState("Dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const canOrder =
    items.length > 0 &&
    name.trim() &&
    phone.trim().length >= 10 &&
    (orderType !== "Dine-in" || tableNumber.trim()) &&
    (orderType !== "Delivery" || address.trim());

  function handleSend() {
    const message = buildOrderMessage({
      cartItems: items,
      orderType,
      tableNumber,
      address,
      name,
      phone,
    });
    sendWhatsAppMessage(message);
    clearCart();
    setShowConfirm(false);
    onToast?.("Order sent via WhatsApp!");
    onOrderSent?.();
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-400 text-sm">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-40 md:pb-16">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-700 mb-5 md:mb-8">
        Your Cart
      </h1>

      <div className="md:grid md:grid-cols-[1fr_380px] md:gap-8 md:items-start">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variantId || "default"}`}
              className="bg-white rounded-2xl shadow-soft p-3 flex items-center gap-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-primary-800 truncate">{item.name}</h3>
                {item.variantName && (
                  <p className="text-xs text-gray-400">{item.variantName}</p>
                )}
                <span className="text-sm font-bold text-primary-600">₹{item.price}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-50 rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                  className="w-6 h-6 rounded-full bg-white shadow-soft flex items-center justify-center"
                >
                  <Minus size={12} className="text-primary-600" />
                </button>
                <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-white shadow-soft flex items-center justify-center"
                >
                  <Plus size={12} className="text-primary-600" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id, item.variantId)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order details / summary */}
        <div className="bg-white rounded-2xl shadow-soft p-4 md:p-5 space-y-3 mt-4 md:mt-0 md:sticky md:top-24">
          <h3 className="text-sm font-semibold text-primary-700">Order Type</h3>
          <div className="flex gap-2">
            {orderTypes.map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  orderType === type
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "border-gray-200 text-gray-500 hover:border-primary-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {orderType === "Dine-in" && (
            <input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
            />
          )}
          {orderType === "Delivery" && (
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400 resize-none"
            />
          )}

          <input
            type="text"
            placeholder="Your Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />

          <div className="hidden md:block border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-display font-bold text-xl text-primary-700">₹{total}</span>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canOrder}
              className="w-full py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors"
            >
              Order on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fixed bar */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 bg-white border-t border-gray-100 p-3 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-400 block">Total</span>
            <span className="font-display font-bold text-lg text-primary-700">₹{total}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canOrder}
            className="flex-1 max-w-[220px] py-3 rounded-2xl bg-primary-500 text-white font-semibold text-sm disabled:opacity-40"
          >
            Order on WhatsApp
          </button>
        </div>
      </div>

      <ConfirmOrderModal
        open={showConfirm}
        title="Confirm Your Order"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSend}
      >
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-primary-700">{orderType}</p>
          {orderType === "Dine-in" && <p className="text-gray-500">Table: {tableNumber}</p>}
          {orderType === "Delivery" && <p className="text-gray-500">Address: {address}</p>}
          <div className="border-t border-gray-100 pt-2 space-y-1">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variantId || "default"}`}
                className="flex justify-between text-gray-600"
              >
                <span>
                  {item.name} {item.variantName ? `(${item.variantName})` : ""} x{item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-primary-700">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <p className="text-gray-500">
            {name} · {phone}
          </p>
        </div>
      </ConfirmOrderModal>
    </div>
  );
}
