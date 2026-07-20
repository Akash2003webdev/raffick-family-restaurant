// API layer backed by Supabase. Function names/signatures match what the
// components already call, so no component code had to change.

import { supabase } from "./supabaseClient";
import { restaurantInfo } from "./data";

function normalizeItem(row) {
  return {
    ...row,
    images: row.images || [],
    variants: (row.variants || []).slice().sort((a, b) => a.sort_order - b.sort_order),
  };
}

function normalizeReview(row) {
  return { ...row, date: row.created_at?.slice(0, 10) };
}

export async function getRestaurantInfo() {
  // Static — not stored in the DB.
  return restaurantInfo;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getCategoryById(id) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function getMenuItems({ categoryId, search } = {}) {
  let query = supabase.from("menu_items").select("*, variants:menu_item_variants(*)");
  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeItem);
}

export async function getMenuItemById(id) {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return normalizeItem(data);
}

export async function getPopularItems(limit = 8) {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*)")
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map(normalizeItem);
}

export async function getOverallReviews() {
  const { data, error } = await supabase
    .from("overall_reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeReview);
}

export async function getItemReviews(itemId) {
  const { data, error } = await supabase
    .from("item_reviews")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeReview);
}

export async function submitReview({ itemId, name, rating, comment }) {
  const table = itemId ? "item_reviews" : "overall_reviews";
  const payload = itemId ? { item_id: itemId, name, rating, comment } : { name, rating, comment };
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return normalizeReview(data);
}

export async function submitOrder({ cartItems, orderType, tableNumber, address, name, phone, total }) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_type: orderType,
      table_number: tableNumber || null,
      address: address || null,
      customer_name: name,
      customer_phone: phone,
      items: cartItems,
      total,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitEnquiry({ name, phone, enquiryType, message }) {
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      phone,
      enquiry_type: enquiryType || "General",
      message,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEnquiries() {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
