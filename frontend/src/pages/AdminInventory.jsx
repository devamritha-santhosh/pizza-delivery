import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, AlertTriangle, DatabaseZap, RotateCcw } from "lucide-react";
import api from "../api";

export default function AdminInventory() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initializeInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/init");
      setInventory(res.data.inventory);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to initialize inventory");
    } finally {
      setLoading(false);
    }
  };

  const resetInventory = async () => {
    if (!window.confirm("This will delete all current inventory and reset to defaults. Continue?")) return;
    try {
      setLoading(true);
      const res = await api.get("/admin/reset-inventory");
      setInventory(res.data.inventory);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to reset inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/inventory");
      setInventory(res.data.inventory || res.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to fetch inventory");
      setInventory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (category, name, newStock) => {
    try {
      await api.put("/inventory", { category, name, quantity: Number(newStock) });
      fetchInventory(); // Soft refresh
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    }
  };

  const categories = [
    { key: "bases", label: "Pizza Bases" },
    { key: "sauces", label: "Sauces" },
    { key: "cheeses", label: "Cheeses" },
    { key: "veggies", label: "Vegetables" },
    { key: "meats", label: "Meats" }
  ];

  const THRESHOLD = 20;

  if (loading && !inventory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Database...</p>
      </div>
    );
  }

  const allEmpty = inventory && !inventory.bases?.length && !inventory.sauces?.length;

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden pt-6 text-slate-800">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin")} className="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-pizza-red">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Inventory Manager</h1>
              <p className="text-slate-500 font-medium text-sm">Control ingredient stock levels in real-time</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={fetchInventory} className="glass-button-secondary py-2 px-4 shadow-sm text-sm gap-2">
              <RefreshCw className="w-4 h-4" /> Sync Data
            </button>
            {allEmpty && (
              <button onClick={initializeInventory} className="glass-button-secondary py-2 px-4 shadow-sm text-sm gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700">
                <DatabaseZap className="w-4 h-4" /> Initialize
              </button>
            )}
            <button onClick={resetInventory} className="glass-button-secondary py-2 px-4 shadow-sm text-sm gap-2 bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600">
              <RotateCcw className="w-4 h-4" /> Factory Reset
            </button>
          </div>
        </div>

        {error && !inventory && (
          <div className="glass-panel p-6 bg-red-50 border-red-200 flex items-center gap-4 shadow-sm">
             <AlertTriangle className="w-6 h-6 text-red-500" />
             <p className="text-red-600 font-bold flex-1">{error}</p>
          </div>
        )}

        {allEmpty && (
          <div className="glass-panel p-6 bg-yellow-50 border-yellow-200 flex items-center gap-4 mb-8 shadow-sm">
             <AlertTriangle className="w-6 h-6 text-yellow-600" />
             <p className="text-yellow-700 font-bold">Database is empty! Click "Initialize" to populate default inventory.</p>
          </div>
        )}

        {inventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.key} className="glass-panel p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-shadow">
                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200/60 pb-4">{cat.label}</h2>
                
                <div className="space-y-4">
                  {inventory[cat.key]?.length > 0 ? (
                    inventory[cat.key].map(item => {
                      const isLow = item.stock < THRESHOLD;
                      return (
                        <div key={item.name} className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-slate-700 font-bold text-sm">{item.name}</span>
                            {isLow && <span className="text-red-500 text-xs mt-1 font-extrabold">⚠️ Low Stock ({item.stock})</span>}
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               defaultValue={item.stock}
                               min="0"
                               onBlur={(e) => updateStock(cat.key, item.name, e.target.value)}
                               className="bg-white text-slate-800 font-bold w-16 text-center rounded-lg py-1.5 px-2 border border-slate-300 text-sm focus:outline-none focus:border-pizza-red focus:ring-1 focus:ring-pizza-red shadow-inner transition-colors"
                             />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-slate-400 text-sm italic font-medium text-center py-4">No items listed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
