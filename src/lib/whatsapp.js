import { restaurantInfo } from "./data";

export function buildOrderMessage({ cartItems, orderType, tableNumber, address, name, phone }) {
  const lines = [];
  lines.push(`*New Order — ${restaurantInfo.name}*`);
  lines.push(`Order Type: ${orderType}`);
  if (orderType === "Dine-in" && tableNumber) lines.push(`Table No: ${tableNumber}`);
  if (orderType === "Delivery" && address) lines.push(`Address: ${address}`);
  lines.push("");
  lines.push("*Items:*");
  cartItems.forEach((item) => {
    const variantLabel = item.variantName ? ` (${item.variantName})` : "";
    lines.push(`• ${item.name}${variantLabel} x${item.quantity} — ₹${item.price * item.quantity}`);
  });
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  lines.push("");
  lines.push(`*Total: ₹${total}*`);
  lines.push("");
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  return lines.join("\n");
}

export function buildReservationMessage({ name, phone, date, time, guests, note }) {
  const lines = [];
  lines.push(`*Table Reservation — ${restaurantInfo.name}*`);
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  lines.push(`Date: ${date}`);
  lines.push(`Time: ${time}`);
  lines.push(`Guests: ${guests}`);
  if (note) lines.push(`Special Request: ${note}`);
  return lines.join("\n");
}

export function sendWhatsAppMessage(message) {
  const url = `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
