import { useEffect, useState } from "react";
import Stars from "../components/Stars";
import { getOverallReviews, submitReview } from "../lib/api";

export default function ReviewsPage({ onToast }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getOverallReviews().then(setReviews);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    const review = await submitReview(form);
    setReviews((prev) => [review, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitting(false);
    onToast?.("Thanks for your review!");
  }

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-16">
      <div className="mb-5 md:mb-8">
        <span className="text-gold-500 text-xs font-semibold tracking-[0.15em] uppercase">
          In Their Words
        </span>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-700">
          Customer Reviews
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-display font-bold text-2xl md:text-3xl text-gold-500">{avg}</span>
          <div>
            <Stars rating={Number(avg)} size={14} />
            <span className="text-xs text-gray-400">{reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-8 md:items-start">
        <div className="space-y-3 order-2 md:order-1">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-primary-700 text-sm">{r.name}</span>
                <Stars rating={r.rating} size={13} />
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
              <span className="text-xs text-gray-400 mt-2 block">{r.date}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-soft p-4 space-y-3 mb-5 md:mb-0 order-1 md:order-2 md:sticky md:top-24"
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
    </div>
  );
}
