// Static restaurant info — doesn't need its own DB table.
// Menu, reviews, and orders now live in Supabase (see src/lib/api.js and supabase/schema.sql).

export const restaurantInfo = {
  name: "Raffick Restaurant",
  tagline: "Taste the Love, Feel the Quality",
  address: "Sattur Main Road, Near ICICI Bank, Sattur - 626203",
  phone: "7010276225",
  whatsapp: "917010276225",
  rating: 4.5,
  reviewCount: 197,
  priceRange: "₹200–400 per person",
  hours: "9:00 AM – 12:00 AM",
  heroImage:"/public/hero.png"
};

export const orderTypes = [ "Takeaway", "Delivery"];
