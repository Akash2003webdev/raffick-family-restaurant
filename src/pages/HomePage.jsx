import { useEffect, useState } from "react";
import { Star, MapPin, Utensils } from "lucide-react";
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
  if (hour < 12) return { text: "Good morning!", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon!", emoji: "🌤️" };
  return { text: "Good evening!", emoji: "🌙" };
}

export default function HomePage({ onNavigate, onSelectCategory, onSelectItem, onToast }) {
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
    <div>
      {/* Hero */}
      <section className="bg-primary-500 rounded-b-[2rem] md:rounded-b-[2.5rem] pb-10 md:pb-14 shadow-card">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-6">
          <div className="flex items-start justify-between mb-4 md:mb-6">
            <div className="animate-fadeUp">
              <h2 className="font-display font-bold text-xl md:text-2xl text-cream flex items-center gap-1.5">
                {greeting.text} <span>{greeting.emoji}</span>
              </h2>
              <p className="text-gold-100 text-sm md:text-base mt-0.5">
                Your favourite dishes await.
              </p>
            </div>
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-cream border-2 border-gold-200 flex items-center justify-center shrink-0 shadow-soft">
              <Utensils size={18} className="text-primary-600" />
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-40 sm:h-52 md:h-64 shadow-card animate-fadeIn">
            <img
              src={info?.heroImage}
              alt="Raffick Family Restaurant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full border border-white/25 text-cream text-xs">
              <Star size={12} className="fill-gold-300 text-gold-300" />
              {info?.rating} ({info?.reviewCount})
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="font-display font-bold text-xl md:text-2xl text-white">{info?.name}</h1>
              <p className="text-gold-100 text-xs md:text-sm">{info?.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="relative -mt-6 md:-mt-8 z-10">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-16 space-y-8 md:space-y-12">
        {search.trim() ? (
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-primary-700 mb-4">
              Search results
            </h2>
            {searchResults.length === 0 ? (
              <p className="text-sm text-gray-400">No dishes found for "{search}"</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
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
            <CategoryShowcase
              categories={categories}
              onSelect={onSelectCategory}
              onViewAll={() => onNavigate("menu")}
            />

            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-gold-500 text-xs font-semibold tracking-[0.15em] uppercase">
                    House Favourites
                  </span>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-primary-700">
                    Chef's Specials
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
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

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl md:text-2xl text-primary-700">
                  What our guests say
                </h2>
                <button
                  onClick={() => onNavigate("reviews")}
                  className="text-xs md:text-sm font-semibold text-gold-500 hover:text-gold-600"
                >
                  View all →
                </button>
              </div>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar md:grid md:grid-cols-3">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white rounded-2xl shadow-soft p-4 md:p-5">
              <MapPin size={16} className="text-primary-400 shrink-0" />
              {info?.address}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
