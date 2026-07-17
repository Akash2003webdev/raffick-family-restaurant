import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CategoryPage from "./pages/CategoryPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import CartPage from "./pages/CartPage";
import ReviewsPage from "./pages/ReviewsPage";
import AdminPage from "./pages/AdminPage";
import SplashScreen from "./components/SplashScreen";

function AppShell() {
  const [page, setPage] = useState("home");
  const [returnTo, setReturnTo] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function navigate(target) {
    setPage(target);
    window.scrollTo(0, 0);
  }

  function selectCategory(cat) {
    setSelectedCategory(cat);
    setReturnTo("menu");
    setPage("category");
    window.scrollTo(0, 0);
  }

  function selectItem(item, from = "home") {
    setSelectedItem(item);
    setReturnTo(from);
    setPage("item");
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header onAdminTrigger={() => setShowAdmin(true)} activePage={page} onNavigate={navigate} />

      {page === "home" && (
        <HomePage
          onNavigate={navigate}
          onSelectCategory={selectCategory}
          onSelectItem={(item) => selectItem(item, "home")}
          onToast={showToast}
        />
      )}
      {page === "menu" && <MenuPage onSelectCategory={selectCategory} />}
      {page === "category" && (
        <CategoryPage
          category={selectedCategory}
          onBack={() => navigate("menu")}
          onSelectItem={(item) => selectItem(item, "category")}
          onToast={showToast}
        />
      )}
      {page === "item" && (
        <ItemDetailPage
          item={selectedItem}
          onBack={() => navigate(returnTo)}
          onToast={showToast}
          onGoToCart={() => navigate("cart")}
        />
      )}
      {page === "cart" && (
        <CartPage onToast={showToast} onOrderSent={() => navigate("home")} />
      )}
      {page === "reviews" && <ReviewsPage onToast={showToast} />}

      {page !== "item" && <FloatingWhatsApp onNavigate={navigate} />}

      <BottomNav activePage={page} onNavigate={navigate} />

      {showAdmin && <AdminPage onClose={() => setShowAdmin(false)} />}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <CartProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <AppShell />
    </CartProvider>
  );
}
