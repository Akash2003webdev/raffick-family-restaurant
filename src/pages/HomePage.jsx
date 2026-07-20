import { useEffect, useState } from "react";
import { Star, MapPin, Utensils, Sparkles, Navigation, ArrowRight, Quote } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryShowcase from "../components/CategoryShowcase";
import MenuItemCard from "../components/MenuItemCard";
import ReviewCard from "../components/ReviewCard";
import {
  getCategories,
  getPopularItems,
  getMenuItems,
  getOverallReviews,
  getRestaurantInfo,
} from "../lib/api";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "✨" };
  if (hour < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

export default function HomePage({
  onNavigate,
  onSelectCategory,
  onSelectItem,
  onToast,
}) {
  const [info, setInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getRestaurantInfo().then(setInfo);
    getCategories().then(setCategories);
    getPopularItems(8).then(setPopular);
    getOverallReviews().then(setReviews);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    getMenuItems({ search }).then(setSearchResults);
  }, [search]);

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gray-50/40">
      
      {/* 1. Premium & Interactive Hero Header */}
      <section className="bg-gradient-to-b from-primary-900 via-primary-800 to-primary-600 rounded-b-[2.5rem] md:rounded-b-[3.5rem] pb-16 md:pb-24 pt-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,224,71,0.12),transparent_45%)]" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Greeting Section */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm uppercase tracking-wider mb-2">
                {greeting.emoji} {greeting.text}
              </span>
              <h1 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight">
                Your Culinary Journey Awaits
              </h1>
            </div>
            {/* Elegant Restaurant Logo Container */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/95 border border-white/20 flex items-center justify-center shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src="/src/assets/logo.png"
                alt="Raffick Family Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Luxury Main Hero Showcase Banner */}
          <div className="relative rounded-[2rem] overflow-hidden h-60 sm:h-72 md:h-[400px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] group">
            <img
              src={info?.heroImage}
              alt="Raffick Restaurant Experience"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Multi-layered Premium Dark Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
            
            {/* Floating Live Badge Metrics */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold shadow-lg">
              <Star size={13} className="fill-amber-400 text-amber-400 animate-pulse" />
              <span>{info?.rating || "4.5"}</span>
              <span className="text-white/60 font-normal">({info?.reviewCount || "100+"} Reviews)</span>
            </div>
            
            {/* Brand Overlay Text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/90 via-transparent to-transparent pt-24">
              <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight drop-shadow-md">
                {info?.name || "Raffick Family Restaurant"}
              </h2>
              <p className="text-amber-300 font-semibold text-sm md:text-lg mt-1 tracking-wide flex items-center gap-1.5 opacity-95">
                <Sparkles size={16} className="text-amber-400" /> {info?.tagline || "Authentic Flavors, Countless Memories"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overlapping Fluid Search Bar Component */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="relative -mt-8 md:-mt-10 z-30 transition-transform duration-300 focus-within:scale-[1.01]">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* 3. Core Sections & Lists Wrapper */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-28 md:pb-20 space-y-14 md:space-y-20">
        
        {search.trim() ? (
          /* Search Feed Design */
          <div className="animate-fade-in">
            <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 mb-6 flex items-center gap-2">
              Search Results <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">{searchResults.length} found</span>
            </h3>
            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                No matching gourmet dishes found for "{search}"
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectItem(item)}
                    onToast={onToast}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Categories Module Slider */}
            <div className="animate-fade-in">
              <CategoryShowcase
                categories={categories}
                onSelect={onSelectCategory}
                onViewAll={() => onNavigate("menu")}
              />
            </div>

            {/* Chef's Curated Masterpieces Grid */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
                    <Utensils size={12} /> House Favourites
                  </span>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight">
                    Chef's Specials
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {popular.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onClick={() => onSelectItem(item)}
                    onToast={onToast}
                  />
                ))}
              </div>
            </div>

            {/* Premium Interactive Guest Review Carousel Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
                    <Quote size={12} className="fill-amber-500" /> Guest Ledger
                  </span>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight">
                    What Our Guests Say
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate("reviews")}
                  className="group flex items-center gap-1 text-xs md:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  View all reviews
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar md:grid md:grid-cols-3 md:gap-6">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="min-w-[280px] md:min-w-0 transition-transform duration-300 hover:-translate-y-1">
                    <ReviewCard review={r} />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Fine-Arts Premium Location Map Dock */}
            <div className="pt-4">
              <div className="mb-6">
                <span className="text-amber-500 text-xs font-bold tracking-[0.2em] uppercase px-1">
                  Visit The Sanctuary
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1">
                  Find Our Restaurant
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  We are waiting to serve you with hot, delicious multi-cuisine food.
                </p>
              </div>

              {/* Map Iframe Framework with High Definition Shadows */}
              <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100/70 relative group">
                <iframe
                  title="Raffick Family Restaurant"
                  src="https://www.google.com/maps?q=Raffick+Family+Restaurant+Sattur&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="brightness-[0.98] contrast-[1.01] transition-all duration-300"
                />
              </div>

              {/* Glass Travel Location Card Block */}
              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white border border-gray-100/80 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <MapPin className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 leading-snug">
                      Raffick Family Restaurant
                    </h4>
                    <p className="text-gray-500 text-sm mt-1.5 leading-relaxed font-medium">
                      Old Trunk Road, Near Central Bus Stand,
                      <br />
                      Sattur, Tamil Nadu - 626203
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Raffick+Family+Restaurant+Sattur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm tracking-wide shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <Navigation size={16} className="fill-white/10" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}