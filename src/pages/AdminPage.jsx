import { useEffect, useState } from "react";
import {
  LayoutGrid,
  UtensilsCrossed,
  MessageSquareText,
  MessageCircleQuestion,
  ClipboardList,
  X,
  Plus,
  Pencil,
  Trash2,
  Lock,
  User,
  Key,
  Calendar,
  Phone,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { getCategories, getMenuItems, getOverallReviews, getOrders, getEnquiries } from "../lib/api";

const ADMIN_USER = "raffick";
const ADMIN_PASS = "123456";

const TABS = [
  { key: "categories", label: "Categories", icon: LayoutGrid },
  { key: "items", label: "Menu Items", icon: UtensilsCrossed },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "enquiries", label: "Enquiries", icon: MessageCircleQuestion },
];

// --- 1. SOLID PREMIUM LOGIN GATE (NO GLASS EFFECT) ---
function LoginGate({ onSuccess, onClose }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    if (e) e.preventDefault(); 
    setError(""); 

    if (user.trim() === ADMIN_USER && pass.trim() === ADMIN_PASS) {
      onSuccess(); 
    } else {
      setError("Invalid username or password credentials");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900/90 flex items-center justify-center px-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-[2rem] border border-gray-200 p-8 w-full max-w-sm shadow-2xl relative"
      >
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock size={22} className="text-amber-500 animate-pulse" />
        </div>

        <h2 className="font-display font-black text-xl text-center text-gray-900 tracking-tight">
          Control Center
        </h2>
        <p className="text-center text-xs text-gray-400 mt-1 mb-6 font-medium">Authorized staff login only</p>
        
        <div className="space-y-4">
          <div className="relative group">
            <User size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Admin Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              required
            />
          </div>

          <div className="relative group">
            <Key size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="password"
              placeholder="Security Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold tracking-wide shadow-md shadow-orange-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            Authenticate
          </button>
        </div>
      </form>
    </div>
  );
}

// --- 2. SUBCOMPONENTS ---
function SectionHeader({ title, onAdd, count }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 tracking-tight">{title}</h3>
        {count !== undefined && (
          <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-inner">
            {count}
          </span>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl shadow-md shadow-orange-500/5 hover:scale-[1.02] transition-all active:scale-95"
        >
          <Plus size={14} strokeWidth={2.5} /> Add Item
        </button>
      )}
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-2">
      <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-xs font-semibold text-gray-400">Fetching live matrix...</p>
    </div>
  );
}

function ErrorRow({ message }) {
  return (
    <div className="flex items-start gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 text-xs md:text-sm font-medium mb-6">
      <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
      <div>
        <p className="font-bold">Database Connectivity Alert</p>
        <p className="opacity-90 mt-0.5">Couldn't stream server data — {message}. Verify your Supabase configurations.</p>
      </div>
    </div>
  );
}

// --- 3. ADMINISTRATIVE TABS COMPONENTS ---
function CategoriesTab() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Categories" onAdd={() => {}} count={categories?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !categories && <LoadingRow />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories?.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all">
            <img src={c.image} alt={c.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
            <span className="flex-1 text-sm font-bold text-gray-800">{c.name}</span>
            <div className="flex gap-1">
              <button className="text-gray-400 hover:text-amber-500 p-1.5 rounded-xl hover:bg-amber-50 transition-colors"><Pencil size={15} /></button>
              <button className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
      
      {categories && (
        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl p-4 mt-6 text-xs font-semibold text-gray-500">
          <Layers size={16} className="text-amber-500 shrink-0" />
          <p>Supabase connection operational. Engine actions ready to layout write queries.</p>
        </div>
      )}
    </div>
  );
}

function ItemsTab() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMenuItems().then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Menu Items" onAdd={() => {}} count={items?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !items && <LoadingRow />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items?.map((i) => {
          const isAvailable = i.status === "available";
          return (
            <div key={i.id} className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:border-gray-300 transition-all">
              <img src={i.images?.[0]} alt={i.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-800 block truncate">{i.name}</span>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 border ${
                  isAvailable 
                    ? "bg-green-50 text-green-600 border-green-200" 
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}>
                  {isAvailable ? "Available" : "Sold Out"}
                </span>
              </div>
              <div className="flex gap-1">
                <button className="text-gray-400 hover:text-amber-500 p-1.5 rounded-xl hover:bg-amber-50 transition-colors"><Pencil size={15} /></button>
                <button className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOverallReviews().then(setReviews).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Guest Reviews" count={reviews?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !reviews && <LoadingRow />}
      
      <div className="space-y-3">
        {reviews?.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-[10px] font-black uppercase">
                  {r.name.charAt(0)}
                </div>
                {r.name}
              </span>
              <button className="text-gray-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"><Trash2 size={15} /></button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <SectionHeader title="WhatsApp Orders Ledger" count={orders?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !orders && <LoadingRow />}
      {orders?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No transactions yet. Direct mobile baskets will queue live here.
        </div>
      )}
      
      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-bold text-gray-900 block">{o.customer_name}</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 font-bold border border-amber-200 px-2 py-0.5 rounded-md mt-1">
                  {o.order_type} {o.table_number ? `· Table #${o.table_number}` : ""}
                </span>
              </div>
              <span className="text-base font-black text-amber-600">₹{o.total}</span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1"><Phone size={12} /> {o.customer_phone}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(o.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEnquiries().then(setEnquiries).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Guest Enquiries" count={enquiries?.length} />
      {error && <ErrorRow message={error} />}
      {!error && !enquiries && <LoadingRow />}
      {enquiries?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No client records registered.
        </div>
      )}
      
      <div className="space-y-3">
        {enquiries?.map((e) => (
          <div key={e.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
              <div>
                <span className="text-sm font-bold text-gray-900 block">{e.name}</span>
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone size={11} /> {e.phone}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                {e.enquiry_type}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">{e.message}</p>
            <span className="text-[10px] text-gray-400 mt-2.5 block font-semibold">
              Received · {new Date(e.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. MAIN ADMINISTRATIVE FRAMEWORK PAGE (SOLID STATE) ---
export default function AdminPage({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("categories");

  if (!loggedIn) {
    return <LoginGate onSuccess={() => setLoggedIn(true)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-gray-100 flex flex-col min-h-screen">
      
      {/* Premium Dashboard Solid Topbar Header */}
      <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between shadow-md border-b border-gray-800 relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="font-display font-black text-lg tracking-tight uppercase flex items-center gap-1.5">
            HQ Dashboard <Sparkles size={14} className="text-amber-400" />
          </h1>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all active:scale-90 z-10"
        >
          <X size={18} />
        </button>
      </div>

      {/* Primary Data Output Node Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full md:px-6 pb-28">
        {tab === "categories" && <CategoriesTab />}
        {tab === "items" && <ItemsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "enquiries" && <EnquiriesTab />}
      </div>

      {/* Bottom Administrative Premium Dock Solid Panel */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl pb-safe">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="relative flex flex-col items-center justify-center py-1 min-w-[60px] md:min-w-[70px] transition-all duration-300 active:scale-95"
              >
                {/* Active Element Box */}
                <div className={`absolute inset-x-0.5 top-0 bottom-0 rounded-xl bg-amber-50 opacity-0 scale-75 transition-all duration-300 -z-10 ${
                  active ? "opacity-100 scale-100 border border-amber-100" : ""
                }`} />

                <div className={`transition-transform duration-300 ${active ? "-translate-y-0.5" : ""}`}>
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-300 ${active ? "text-amber-500 stroke-[2.5]" : "text-gray-400 stroke-[2]"}`} 
                    color={active ? "#f59e0b" : "#9ca3af"}
                  />
                </div>
                
                <span
                  className={`text-[9px] tracking-wide mt-1 transition-all duration-300 font-bold ${
                    active ? "text-amber-600 scale-105" : "text-gray-400 font-medium"
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