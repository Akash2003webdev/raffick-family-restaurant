// Mock data for Raffick Family Restaurant
// Structured to be a drop-in replacement target for a future Supabase backend.
// Each entity mirrors a future DB table shape: category, menu_item, review, reservation.

export const restaurantInfo = {
  name: "Raffick Family Restaurant",
  tagline: "Authentic Flavours, Family Taste",
  address: "9W78+5MX, Old Trunk Rd, Sattur, Tamil Nadu 626203",
  phone: "9944000000", // placeholder — update with real number
  whatsapp: "919944000000", // placeholder — update with real number
  rating: 4.5,
  reviewCount: 197,
  priceRange: "₹200–400 per person",
  hours: "10:00 AM – 11:00 PM",
  heroImage:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200&auto=format&fit=crop",
};

export const categories = [
  {
    id: "cat-biryani",
    name: "Biryani",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTtWQFgd3t1sPPSxlnk-0TT5KOM6GnliFxVKqudAMSTA&s=10",
    status: "active",
  },
  {
    id: "cat-parotta",
    name: "Parotta & Curry",
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-starters",
    name: "Starters",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-chinese",
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-curries",
    name: "Curries & Gravy",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-rice",
    name: "Rice & Noodles",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-beverages",
    name: "Beverages",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400&auto=format&fit=crop",
    status: "active",
  },
];

export const menuItems = [
  // Biryani
  {
    id: "item-001",
    name: "Chicken Biryani",
    category_id: "cat-biryani",
    description:
      "Fragrant seeraga samba rice slow-cooked with tender chicken and our signature family spice blend.",
    images: [
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "medium",
    rating: 4.6,
    variants: [
      { id: "v1", name: "Half", price: 130 },
      { id: "v2", name: "Full", price: 220 },
    ],
  },
  {
    id: "item-002",
    name: "Mutton Biryani",
    category_id: "cat-biryani",
    description:
      "Rich, slow-braised mutton layered with masala rice — a weekend family favourite.",
    images: [
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "spicy",
    rating: 4.8,
    variants: [
      { id: "v1", name: "Half", price: 170 },
      { id: "v2", name: "Full", price: 300 },
    ],
  },
  {
    id: "item-003",
    name: "Egg Biryani",
    category_id: "cat-biryani",
    description: "Boiled eggs simmered in masala rice with aromatic spices.",
    images: [
      "https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "egg",
    spice_level: "medium",
    rating: 4.4,
    variants: [
      { id: "v1", name: "Half", price: 100 },
      { id: "v2", name: "Full", price: 170 },
    ],
  },
  {
    id: "item-004",
    name: "Veg Biryani",
    category_id: "cat-biryani",
    description: "Mixed vegetables and paneer cubes cooked with fragrant basmati rice.",
    images: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: "mild",
    rating: 4.2,
    variants: [
      { id: "v1", name: "Half", price: 90 },
      { id: "v2", name: "Full", price: 150 },
    ],
  },

  // Parotta & Curry
  {
    id: "item-005",
    name: "Parotta (2 pcs)",
    category_id: "cat-parotta",
    description: "Soft, flaky layered parotta made fresh to order.",
    images: [
      "https://images.unsplash.com/photo-1630409351217-7ee2e4436e6d?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: null,
    rating: 4.5,
    variants: [],
  },
  {
    id: "item-006",
    name: "Chicken Curry",
    category_id: "cat-parotta",
    description: "Country-style chicken curry, thick gravy, perfect with parotta.",
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "spicy",
    rating: 4.7,
    variants: [
      { id: "v1", name: "Half", price: 120 },
      { id: "v2", name: "Full", price: 220 },
    ],
  },
  {
    id: "item-007",
    name: "Kothu Parotta",
    category_id: "cat-parotta",
    description: "Shredded parotta tossed with egg, spices and your choice of chicken.",
    images: [
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "medium",
    rating: 4.5,
    variants: [
      { id: "v1", name: "Egg", price: 90 },
      { id: "v2", name: "Chicken", price: 130 },
    ],
  },

  // Starters
  {
    id: "item-008",
    name: "Chicken 65",
    category_id: "cat-starters",
    description: "Crispy fried chicken bites tossed in a fiery South Indian masala.",
    images: [
      "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "spicy",
    rating: 4.6,
    variants: [{ id: "v1", name: "Regular", price: 150 }],
  },
  {
    id: "item-009",
    name: "Gobi Manchurian",
    category_id: "cat-starters",
    description: "Crispy cauliflower florets tossed in a tangy Indo-Chinese sauce.",
    images: [
      "https://images.unsplash.com/photo-1626777553635-c0f9e00b9e10?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: "medium",
    rating: 4.3,
    variants: [{ id: "v1", name: "Regular", price: 110 }],
  },

  // Chinese
  {
    id: "item-010",
    name: "Chicken Noodles",
    category_id: "cat-chinese",
    description: "Stir-fried noodles tossed with chicken, vegetables and soy sauce.",
    images: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "medium",
    rating: 4.4,
    variants: [
      { id: "v1", name: "Half", price: 90 },
      { id: "v2", name: "Full", price: 150 },
    ],
  },
  {
    id: "item-011",
    name: "Veg Fried Rice",
    category_id: "cat-chinese",
    description: "Classic Chinese-style fried rice loaded with fresh vegetables.",
    images: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: "mild",
    rating: 4.1,
    variants: [
      { id: "v1", name: "Half", price: 80 },
      { id: "v2", name: "Full", price: 140 },
    ],
  },

  // Curries & Gravy
  {
    id: "item-012",
    name: "Kalan Rice",
    category_id: "cat-curries",
    description: "Comfort-style rice served with our signature kalan curry — a customer favourite.",
    images: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: "medium",
    rating: 4.7,
    variants: [{ id: "v1", name: "Regular", price: 90 }],
  },
  {
    id: "item-013",
    name: "Mutton Curry",
    category_id: "cat-curries",
    description: "Slow-cooked mutton in a rich, spiced gravy — pairs perfectly with parotta or rice.",
    images: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "non_veg",
    spice_level: "spicy",
    rating: 4.6,
    variants: [
      { id: "v1", name: "Half", price: 150 },
      { id: "v2", name: "Full", price: 280 },
    ],
  },

  // Beverages
  {
    id: "item-014",
    name: "Sulaimani Tea",
    category_id: "cat-beverages",
    description: "Light, spiced black tea — the perfect finish to a family meal.",
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: null,
    rating: 4.5,
    variants: [{ id: "v1", name: "Regular", price: 20 }],
  },
  {
    id: "item-015",
    name: "Fresh Lime Soda",
    category_id: "cat-beverages",
    description: "Refreshing lime soda, sweet or salted, served chilled.",
    images: [
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: null,
    rating: 4.3,
    variants: [{ id: "v1", name: "Regular", price: 40 }],
  },

  // Desserts
  {
    id: "item-016",
    name: "Gulab Jamun (2 pcs)",
    category_id: "cat-desserts",
    description: "Soft milk dumplings soaked in warm sugar syrup.",
    images: [
      "https://images.unsplash.com/photo-1601303516361-1c2d558a4a49?q=80&w=600&auto=format&fit=crop",
    ],
    status: "available",
    veg_type: "veg",
    spice_level: null,
    rating: 4.4,
    variants: [{ id: "v1", name: "Regular", price: 50 }],
  },
];

export const overallReviews = [
  {
    id: "rev-001",
    name: "Selvi K",
    rating: 5,
    comment:
      "Food quantity very high service very good food rate very low kalan rice I like 💕",
    date: "2025-04-10",
  },
  {
    id: "rev-002",
    name: "Ganesh Pandian",
    rating: 5,
    comment:
      "All the food we have ordered is really good. Good family restaurant and the taste is really good especially biryani.",
    date: "2025-01-18",
  },
  {
    id: "rev-003",
    name: "Sudharsan N",
    rating: 5,
    comment:
      "We ordered Biriyani for lunch and Parotta with chicken curry for an occasion. All items tasted simply superb, all our family members enjoyed fully. Both owners took special attention and delivered food on time with care.",
    date: "2024-11-22",
  },
];

// per-item reviews keyed by menu_item id
export const productReviews = {
  "item-001": [
    { id: "pr-1", name: "Arun", rating: 5, comment: "Best chicken biryani in Sattur!", date: "2025-05-02" },
    { id: "pr-2", name: "Meena", rating: 4, comment: "Tasty, generous portion.", date: "2025-03-14" },
  ],
  "item-012": [
    { id: "pr-3", name: "Priya", rating: 5, comment: "Kalan rice romba pudichirundhuchu!", date: "2025-02-20" },
  ],
};

export const reservations = [];

export const orderTypes = ["Dine-in", "Takeaway", "Delivery"];
