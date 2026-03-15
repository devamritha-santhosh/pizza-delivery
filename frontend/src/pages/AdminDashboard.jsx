import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { LayoutDashboard, PackageSearch, Database, LogOut, ArrowLeft } from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden pt-6 text-slate-800">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] z-20" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] z-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-full bg-white group-hover:bg-purple-50 transition-colors shadow-sm border border-slate-200 text-slate-500 hover:text-pizza-red"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Portal</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-bold text-slate-700">{user?.name || "Admin"}</span>
              <span className="text-xs font-medium text-slate-500">System Administrator</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Orders Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 group cursor-pointer hover:shadow-xl hover:shadow-pizza-red/5 transition-shadow" onClick={() => navigate("/admin/orders")}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pizza-orange to-pizza-red flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <PackageSearch className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-pizza-red transition-colors">Manage Orders</h2>
            <p className="text-slate-500 font-medium mb-6">View live orders, update statuses, and track deliveries in real-time.</p>
            <div className="flex items-center text-sm font-bold text-pizza-red">
              Open Order Queue <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </div>
          </motion.div>

          {/* Inventory Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 group cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 transition-shadow" onClick={() => navigate("/admin/inventory")}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Manage Inventory</h2>
            <p className="text-slate-500 font-medium mb-6">Update ingredient stock levels, add new menu items, and control pricing.</p>
            <div className="flex items-center text-sm font-bold text-blue-600">
              Open Inventory Tool <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </div>
          </motion.div>

          {/* Quick Stats (Placeholder) */}
          <motion.div variants={itemVariants} className="glass-panel p-8 col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-6 justify-between items-center text-center sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Today's Overview</h3>
              <p className="text-slate-500 font-medium text-sm">Real-time system metrics</p>
            </div>
            <div className="flex gap-8">
              <div>
                <span className="block text-3xl font-extrabold text-pizza-red mb-1">24</span>
                <span className="text-sm text-slate-400 font-bold tracking-wide uppercase">Active Orders</span>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <span className="block text-3xl font-extrabold text-blue-600 mb-1">98%</span>
                <span className="text-sm text-slate-400 font-bold tracking-wide uppercase">Stock Levels</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

export default AdminDashboard;
