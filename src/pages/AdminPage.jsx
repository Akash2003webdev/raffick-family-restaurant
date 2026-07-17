import { useState } from "react";
import {
  LayoutGrid,
  UtensilsCrossed,
  MessageSquareText,
  ClipboardList,
  CalendarCheck,
  X,
  Plus,
  Pencil,
  Trash2,
  Lock,
} from "lucide-react";
import { categories, menuItems, overallReviews } from "../lib/data";

const ADMIN_USER = "raffick";
const ADMIN_PASS = "123456";

const TABS = [
  { key: "categories", label: "Categories", icon: LayoutGrid },
  { key: "items", label: "Menu Items", icon: UtensilsCrossed },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "reservations", label: "Reservations", icon: CalendarCheck },
];

function LoginGate({ onSuccess, onClose }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onSuccess();
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-primary-900/70 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-card relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <X size={20} />
        </button>
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
          <Lock size={20} className="text-primary-500" />
        </div>
        <h2 className="font-display font-bold text-lg text-center text-primary-700 mb-4">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-display font-bold text-lg text-primary-700">{title}</h3>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-primary-500 text-white px-3 py-1.5 rounded-xl"
        >
          <Plus size={14} /> Add
        </button>
      )}
    </div>
  );
}

function CategoriesTab() {
  return (
    <div>
      <SectionHeader title="Categories" onAdd={() => {}} />
      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-soft p-3 flex items-center gap-3">
            <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />
            <span className="flex-1 text-sm font-medium text-primary-800">{c.name}</span>
            <button className="text-gray-400"><Pencil size={16} /></button>
            <button className="text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Image upload field, add/edit forms will connect to the backend once Supabase is wired up.
      </p>
    </div>
  );
}

function ItemsTab() {
  return (
    <div>
      <SectionHeader title="Menu Items" onAdd={() => {}} />
      <div className="space-y-2">
        {menuItems.map((i) => (
          <div key={i.id} className="bg-white rounded-2xl shadow-soft p-3 flex items-center gap-3">
            <img src={i.images?.[0]} alt={i.name} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <span className="text-sm font-medium text-primary-800 block">{i.name}</span>
              <span className="text-xs text-gray-400">
                {i.status === "available" ? "Available" : "Sold Out"}
              </span>
            </div>
            <button className="text-gray-400"><Pencil size={16} /></button>
            <button className="text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div>
      <SectionHeader title="Reviews" />
      <div className="space-y-2">
        {overallReviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl shadow-soft p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-800">{r.name}</span>
              <button className="text-red-400"><Trash2 size={16} /></button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div>
      <SectionHeader title="Orders" />
      <p className="text-sm text-gray-400">
        Orders are currently sent directly via WhatsApp. Order history will appear here once the
        backend is connected.
      </p>
    </div>
  );
}

function ReservationsTab() {
  return (
    <div>
      <SectionHeader title="Reservations" />
      <p className="text-sm text-gray-400">
        Table reservations sent via WhatsApp will be listed here once the backend is connected.
      </p>
    </div>
  );
}

export default function AdminPage({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("categories");

  if (!loggedIn) {
    return <LoginGate onSuccess={() => setLoggedIn(true)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-cream flex flex-col">
      <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between shadow-card">
        <h1 className="font-display font-bold text-lg">Admin Panel</h1>
        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-4xl mx-auto w-full md:px-8">
        {tab === "categories" && <CategoriesTab />}
        {tab === "items" && <ItemsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "reservations" && <ReservationsTab />}
      </div>

      <nav className="bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(122,31,43,0.08)]">
        <div className="max-w-5xl mx-auto flex items-center justify-around px-1 py-2">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex flex-col items-center gap-0.5 px-2 py-1"
              >
                <Icon size={20} className={active ? "text-primary-500" : "text-gray-400"} />
                <span
                  className={`text-[9px] font-medium ${
                    active ? "text-primary-500" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
