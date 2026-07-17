import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, Flame } from "lucide-react";
import VegBadge from "../components/VegBadge";
import Stars from "../components/Stars";
import ReviewCard from "../components/ReviewCard";
import { useCart } from "../context/CartContext";
import { getItemReviews, submitReview } from "../lib/api";

const SPICE_LABEL = { mild: "Mild", medium: "Medium", spicy: "Spicy" };

export default function ItemDetailPage({ item, onBack, onToast, onGoToCart }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(item?.variants?.[0] || null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (item) getItemReviews(item.id).then(setReviews);
    setVariant(item?.variants?.[0] || null);
    setQty(1);
  }, [item]);

  if (!item) return null;
  const isSoldOut = item.status === "sold_out";
  const price = variant?.price ?? 0;

  function handleAddToCart() {
    addItem({
      id: item.id,
      name: item.name,
      price,
      variantId: variant?.id ?? null,
      variantName: variant?.name ?? null,
      image: item.images?.[0],
      quantity: qty,
    });
    onToast?.(`${item.name} added to cart`);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    const review = await submitReview({ itemId: item.id, ...form });
    setReviews((prev) => [review, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitting(false);
    onToast?.("Review submitted, thank you!");
  }

  return (
    <div className="max-w-6xl mx-auto pb-32 md:pb-16">
      <div className="md:grid md:grid-cols-2 md:gap-10 md:px-8 md:pt-8">
        {/* Image */}
        <div className="relative h-64 md:h-[26rem] md:rounded-3xl md:overflow-hidden md:shadow-card">
          <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-soft md:hidden"
          >
            <ArrowLeft size={18} className="text-primary-700" />
          </button>
        </div>

        {/* Details */}
        <div className="px-4 pt-4 md:px-0 md:pt-0 space-y-5">
          <button
            onClick={onBack}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <VegBadge type={item.veg_type} size={16} />
              {item.spice_level && (
                <span className="flex items-center gap-1 text-xs text-primary-500">
                  <Flame size={12} /> {SPICE_LABEL[item.spice_level]}
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-800">{item.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={item.rating} size={14} />
              <span className="text-xs text-gray-400">({item.rating})</span>
            </div>
            <p className="text-sm md:text-base text-gray-500 mt-2">{item.description}</p>
          </div>

          {isSoldOut && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold rounded-2xl px-4 py-2 text-center">
              Currently Sold Out
            </div>
          )}

          {item.variants?.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-primary-700 mb-2">Choose option</h3>
              <div className="flex gap-2 flex-wrap">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-colors ${
                      variant?.id === v.id
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-200 text-gray-600 hover:border-primary-300"
                    }`}
                  >
                    {v.name} · ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-white rounded-2xl shadow-soft p-4">
            <div>
              <span className="text-xs text-gray-400 block">Price</span>
              <span className="font-display font-bold text-xl text-primary-700">₹{price}</span>
            </div>
            <div className="flex items-center gap-3 bg-primary-50 rounded-full px-3 py-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white shadow-soft flex items-center justify-center"
              >
                <Minus size={14} className="text-primary-600" />
              </button>
              <span className="font-semibold text-primary-700 w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-white shadow-soft flex items-center justify-center"
              >
                <Plus size={14} className="text-primary-600" />
              </button>
            </div>
          </div>

          {/* Desktop inline action buttons */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="flex-1 py-3 rounded-2xl border-2 border-primary-500 text-primary-600 font-semibold text-sm hover:bg-primary-50 disabled:opacity-40 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                onGoToCart?.();
              }}
              disabled={isSoldOut}
              className="flex-1 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-8 md:pt-12 max-w-3xl md:max-w-none">
        <h3 className="font-display font-bold text-lg md:text-xl text-primary-700 mb-3">Reviews</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {reviews.length === 0 && (
            <p className="text-sm text-gray-400">No reviews yet for this dish.</p>
          )}
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        <form
          onSubmit={handleSubmitReview}
          className="mt-4 bg-white rounded-2xl shadow-soft p-4 space-y-3 md:max-w-md"
        >
          <h4 className="text-sm font-semibold text-primary-700">Write a review</h4>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rating:</span>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="border border-gray-200 rounded-xl px-2 py-1 text-sm outline-none"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Mobile fixed action bar */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 bg-white border-t border-gray-100 p-3 z-20">
        <div className="max-w-5xl mx-auto flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className="flex-1 py-3 rounded-2xl border-2 border-primary-500 text-primary-600 font-semibold text-sm disabled:opacity-40"
          >
            Add to Cart
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              onGoToCart?.();
            }}
            disabled={isSoldOut}
            className="flex-1 py-3 rounded-2xl bg-primary-500 text-white font-semibold text-sm disabled:opacity-40"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
