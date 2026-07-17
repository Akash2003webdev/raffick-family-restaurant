export default function VegBadge({ type, size = 14 }) {
  const colorMap = {
    veg: "border-green-600",
    non_veg: "border-red-600",
    egg: "border-yellow-500",
  };
  const dotMap = {
    veg: "bg-green-600",
    non_veg: "bg-red-600",
    egg: "bg-yellow-500",
  };
  if (!type) return null;
  return (
    <span
      className={`inline-flex items-center justify-center border ${colorMap[type]} rounded-sm`}
      style={{ width: size, height: size }}
      title={type === "veg" ? "Veg" : type === "non_veg" ? "Non-Veg" : "Egg"}
    >
      <span
        className={`rounded-full ${type === "egg" ? "bg-yellow-500" : dotMap[type]}`}
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    </span>
  );
}
