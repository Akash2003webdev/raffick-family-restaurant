// Mock API layer — function signatures are shaped so a future Supabase
// integration can replace internals here without touching components.

import {
  categories,
  menuItems,
  overallReviews,
  productReviews,
  restaurantInfo,
  reservations,
} from "./data";

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export async function getRestaurantInfo() {
  await delay();
  return restaurantInfo;
}

export async function getCategories() {
  await delay();
  return categories.filter((c) => c.status === "active");
}

export async function getCategoryById(id) {
  await delay();
  return categories.find((c) => c.id === id) || null;
}

export async function getMenuItems({ categoryId, search } = {}) {
  await delay();
  let items = [...menuItems];
  if (categoryId) items = items.filter((i) => i.category_id === categoryId);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }
  return items;
}

export async function getMenuItemById(id) {
  await delay();
  return menuItems.find((i) => i.id === id) || null;
}

export async function getPopularItems(limit = 8) {
  await delay();
  return [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export async function getOverallReviews() {
  await delay();
  return overallReviews;
}

export async function getItemReviews(itemId) {
  await delay();
  return productReviews[itemId] || [];
}

export async function submitReview({ itemId, name, rating, comment }) {
  await delay();
  const review = {
    id: `pr-${Date.now()}`,
    name,
    rating,
    comment,
    date: new Date().toISOString().slice(0, 10),
  };
  if (itemId) {
    productReviews[itemId] = productReviews[itemId] || [];
    productReviews[itemId].unshift(review);
  } else {
    overallReviews.unshift(review);
  }
  return review;
}

export async function submitReservation(data) {
  await delay();
  const reservation = { id: `res-${Date.now()}`, ...data };
  reservations.unshift(reservation);
  return reservation;
}
