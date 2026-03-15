import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChefHat, Truck, CheckCircle2, Search, Filter, Clock } from "lucide-react";
import api, { API_URL } from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState("active"); // active, all

  const navigate = useNavigate();

  useEffect(() => {
    const socketUrl = API_URL.replace(/\/api$/, "");
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.emit("admin_join");

    newSocket.on("order_status_changed", (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    newSocket.on("new_order", (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    return () => newSocket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/all");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/order/status/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (socket) {
        socket.emit("order_status_updated", {
          orderId, status: newStatus, userId: res.data.userId
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      received: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Received" },
      kitchen: { color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", label: "Kitchen" },
      delivery: { color: "text-pizza-red", bg: "bg-pizza-red/10", border: "border-pizza-red/30", label: "Delivery" },
      completed: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Completed" },
      cancelled: { color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "Cancelled" }
    };
    return configs[status] || configs.received;
  };

  const displayedOrders = filter === "active" 
    ? orders.filter(o => !["completed", "cancelled"].includes(o.orderStatus))
    : orders;

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden pt-6 text-slate-800">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] z-20 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin")} className="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-pizza-red">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Order Queue</h1>
              <p className="text-slate-500 font-medium text-sm">Live updates from customers</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'active' ? 'bg-white text-pizza-red shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Active Orders
            </button>
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-white text-pizza-red shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All History
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-pizza-red/30 border-t-pizza-red rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading orders...</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Queue is Empty</h2>
            <p className="text-slate-500 font-medium">No {filter} orders right now. Kitchen is clear!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {displayedOrders.map((order) => {
                const config = getStatusConfig(order.orderStatus);
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={order._id}
                    className="glass-panel p-6 hover:shadow-xl hover:shadow-pizza-red/5 transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="bg-white/60 rounded-xl p-4 mb-4 border border-slate-200 shadow-sm text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-500 font-bold">Customer:</span>
                        <span className="text-slate-800 font-bold">{order.userId?.name || "Guest"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Total:</span>
                        <span className="text-pizza-red font-extrabold">₹{order.totalPrice}</span>
                      </div>
                    </div>

                    <div className="mb-6 h-[80px] overflow-y-auto pr-2 custom-scrollbar">
                      {order.items && order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm mb-2">
                          <span className="text-slate-700 font-medium">
                            <span className="text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md mr-2">{item.quantity}x</span>{item.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Admin Actions */}
                    {!["completed", "cancelled"].includes(order.orderStatus) && (
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/60">
                        {order.orderStatus !== "kitchen" && (
                          <button onClick={() => updateStatus(order._id, "kitchen")} className="py-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold uppercase transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <ChefHat className="w-4 h-4" /> Kitchen
                          </button>
                        )}
                        {order.orderStatus !== "delivery" && (
                          <button onClick={() => updateStatus(order._id, "delivery")} className="py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold uppercase transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <Truck className="w-4 h-4" /> Dispatch
                          </button>
                        )}
                        {order.orderStatus !== "completed" && (
                          <button onClick={() => updateStatus(order._id, "completed")} className="py-2.5 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold uppercase transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" /> Complete
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
