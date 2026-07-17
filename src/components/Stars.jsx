import { Star } from "lucide-react";

export default function Stars({ rating = 0, size = 14 }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= full ? "fill-gold-400 text-gold-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
