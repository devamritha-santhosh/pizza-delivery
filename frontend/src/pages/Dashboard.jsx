import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, LogOut, Star, ChefHat, Sparkles, Pizza } from "lucide-react";
import { API_URL } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pizzas = [
    { id: 1, name: "Margherita", desc: "Classic delight with 100% real mozzarella cheese", price: 199, rating: 4.8, category: "Veg", img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg" },
    { id: 2, name: "Farmhouse", desc: "Delightful combination of onion, capsicum, tomato & grilled mushroom", price: 249, rating: 4.5, category: "Veg", img: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg" },
    { id: 3, name: "Veg Supreme", desc: "Supreme combination of Black Olives, Onion, Crisp Capsicum, Mushroom, Fresh Tomato", price: 269, rating: 4.9, category: "Veg", img: "https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg" },
    { id: 4, name: "Pepperoni", desc: "Premium pepperoni with extra cheese", price: 299, rating: 4.7, category: "Non-Veg", img: "https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg" },
    { id: 5, name: "Chicken Tikka", desc: "Chicken tikka, onion, tomato with spicy sauce", price: 329, rating: 4.6, category: "Non-Veg", img: "https://images.pexels.com/photos/845811/pexels-photo-845811.jpeg" },
    { id: 6, name: "Cheese Burst", desc: "Crust stuffed with liquid cheese", price: 279, rating: 4.9, category: "Bestseller", img: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg" },
    { id: 7, name: "Double Cheese", desc: "Extra cheese on cheese", price: 309, rating: 4.4, category: "Bestseller", img: "https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg" }
  ];

  const categories = ["All", "Veg", "Non-Veg", "Bestseller", "Sides", "Beverages"];

  const filteredPizzas = pizzas.filter(p => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pizzaIngredients = {
    // Retaining exact ingredients map from original
    "Margherita": [{ name: "Regular Crust", price: 40, quantity: 1 }, { name: "Tomato", price: 30, quantity: 1 }, { name: "Mozzarella", price: 40, quantity: 1 }],
    "Farmhouse": [{ name: "Regular Crust", price: 40, quantity: 1 }, { name: "Tomato", price: 30, quantity: 1 }, { name: "Mozzarella", price: 40, quantity: 1 }, { name: "Onion", price: 15, quantity: 1 }, { name: "Bell Pepper", price: 15, quantity: 1 }, { name: "Mushroom", price: 15, quantity: 1 }],
    "Veg Supreme": [{ name: "Regular Crust", price: 40, quantity: 1 }, { name: "Tomato", price: 30, quantity: 1 }, { name: "Mozzarella", price: 40, quantity: 1 }, { name: "Onion", price: 15, quantity: 1 }, { name: "Bell Pepper", price: 15, quantity: 1 }, { name: "Mushroom", price: 15, quantity: 1 }, { name: "Olives", price: 15, quantity: 1 }],
    "Pepperoni": [{ name: "Regular Crust", price: 40, quantity: 1 }, { name: "Tomato", price: 30, quantity: 1 }, { name: "Mozzarella", price: 40, quantity: 1 }, { name: "Pepperoni", price: 30, quantity: 1 }],
    "Chicken Tikka": [{ name: "Regular Crust", price: 40, quantity: 1 }, { name: "White Sauce", price: 30, quantity: 1 }, { name: "Mozzarella", price: 40, quantity: 1 }, { name: "Chicken", price: 30, quantity: 1 }]
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleOrder = async (pizza) => {
    try {
      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      const items = pizzaIngredients[pizza.name] || [{ name: pizza.name, price: pizza.price, quantity: 1 }];
      
      navigate("/payment", {
        state: {
          orderData: {
            items,
            totalPrice: pizza.price
          }
        }
      });
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="min-h-screen pb-20 relative text-slate-800">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa]">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-pizza-red/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[0%] left-[-10%] w-[40%] h-[40%] bg-pizza-orange/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`glass-panel flex items-center justify-between px-6 py-3 transition-all duration-300 ${isScrolled ? 'shadow-sm bg-white/70 backdrop-blur-2xl' : 'shadow-none bg-white/40'}`}>
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-pizza-red" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pizza-red to-pizza-orange hidden sm:block">
                Slice&Spice
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-slate-600 hover:text-pizza-red cursor-pointer font-bold transition-colors">Menu</span>
              <span onClick={() => navigate("/orders")} className="text-slate-600 hover:text-pizza-red cursor-pointer font-bold transition-colors">My Orders</span>
              {user?.isAdmin && (
                <span onClick={() => navigate("/admin")} className="text-pizza-orange hover:text-pizza-red cursor-pointer font-bold transition-colors">Admin Panel</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200 hidden sm:flex shadow-sm">
                <User className="w-4 h-4 text-pizza-red" />
                <span className="text-sm font-bold text-slate-700">{user?.name?.split(' ')[0] || "User"}</span>
              </div>
              <button onClick={() => navigate("/orders")} className="p-2 relative text-slate-600 hover:text-pizza-red bg-white/60 hover:bg-white rounded-full transition-colors hidden md:block border border-slate-200/50 shadow-sm">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pizza-orange ring-2 ring-white rounded-full"></span>
              </button>
              <button onClick={handleLogout} title="Logout" className="p-2 text-slate-600 hover:text-pizza-red bg-white/60 hover:bg-white rounded-full transition-colors border border-slate-200/50 shadow-sm">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[32px] overflow-hidden mb-12 shadow-xl shadow-pizza-red/5 border border-white/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />
          <img 
            src="https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg" 
            alt="Hero Pizza" 
            className="w-full h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pizza-red/10 border border-pizza-red/20 text-pizza-red mb-4 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Deal of the Day</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-4 drop-shadow-sm">
                The Ultimate <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pizza-red to-pizza-orange">Cheese Burst</span>
              </h1>
              <p className="text-slate-600 font-medium text-lg mb-8 max-w-md">
                Experience layers of melted cheese topped with premium Italian herbs and spices.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/customize")} className="glass-button text-white">
                  Build Your Own
                </button>
                <button className="glass-button-secondary">
                  Order Deal Now
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Discovery & Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for pizzas, sides..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-12 w-full"
            />
          </div>

          <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-sm ${
                  category === cat 
                    ? 'bg-pizza-red text-white shadow-md shadow-pizza-red/30 border border-pizza-red' 
                    : 'bg-white/60 text-slate-600 hover:bg-white hover:text-pizza-red border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pizza Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredPizzas.map((pizza) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={pizza.id}
                className="glass-panel overflow-hidden group hover:-translate-y-2 hover:shadow-xl hover:shadow-pizza-red/10 transition-all duration-300 border-white/60"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={pizza.img} 
                    alt={pizza.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-slate-800 text-xs font-extrabold">{pizza.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{pizza.name}</h3>
                    <span className="text-pizza-red font-extrabold whitespace-nowrap">₹{pizza.price}</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-4 min-h-[40px]">
                    {pizza.desc}
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOrder(pizza)}
                      className="flex-1 bg-white hover:bg-slate-50 text-pizza-red font-bold py-2 rounded-xl border border-pizza-red/20 hover:border-pizza-red/50 shadow-sm transition-all"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => navigate("/customize")}
                      className="flex-1 bg-gradient-to-r from-pizza-red to-pizza-orange text-white font-bold py-2 rounded-xl shadow-md hover:shadow-pizza-red/40 transition-all transform hover:-translate-y-0.5"
                    >
                      Build
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPizzas.length === 0 && (
          <div className="text-center py-20">
            <Pizza className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 font-bold">No items found</h3>
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}