import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChefHat, Truck, CheckCircle2, XCircle, Clock, ArrowLeft, RotateCcw } from "lucide-react";
import api, { API_URL } from "../api";
import { io } from "socket.io-client";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const socketUrl = API_URL.replace(/\/api$/, "");
    const newSocket = io(socketUrl);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      newSocket.emit("user_join", user.id);
    }

    newSocket.on("order_status_changed", (data) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId ? { ...order, orderStatus: data.status } : order
        )
      );
    });

    return () => newSocket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/my");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm("Cancel this order?");
    if (!confirmCancel) return;

    try {
      const res = await api.post(`/order/cancel/${id}`);
      alert(res.data.message);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      received: { icon: Package, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", label: "Order Received" },
      kitchen: { icon: ChefHat, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", label: "In Kitchen" },
      delivery: { icon: Truck, color: "text-pizza-red", bg: "bg-pizza-red/10", border: "border-pizza-red/30", label: "Out for Delivery" },
      completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", border: "border-green-200", label: "Delivered" },
      cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "Cancelled" }
    };
    return configs[status] || configs.received;
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden pt-6 text-slate-800">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-pizza-red/10 rounded-full blur-[100px] z-20 animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-pizza-red transition-colors group"
          >
            <div className="p-2 rounded-full bg-white group-hover:bg-purple-50 transition-colors shadow-sm border border-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium hidden sm:block">Back</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Orders</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-pizza-red/30 border-t-pizza-red rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-12 text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't made your first order. Our delicious pizzas are waiting for you!</p>
            <button onClick={() => navigate("/dashboard")} className="glass-button px-8 text-white">
              Explore Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const config = getStatusConfig(order.orderStatus);
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-6 sm:p-8 hover:shadow-xl hover:shadow-pizza-red/5 transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-200/60">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-slate-800 font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border} flex items-center gap-1.5`}>
                            <Icon className="w-3.5 h-3.5" />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric', 
                            hour: 'numeric', minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-sm text-slate-400 uppercase tracking-wide font-bold">Total Amount</span>
                        <div className="text-2xl font-extrabold text-pizza-red">₹{order.totalPrice}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-slate-700 font-bold mb-3">Items</h4>
                      <ul className="space-y-3">
                        {order.items && order.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-center text-sm">
                            <span className="text-slate-700 font-medium flex-1">
                              <span className="text-slate-400 mr-2 bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">{item.quantity}x</span>
                              {item.name}
                            </span>
                            <span className="text-slate-600 font-bold">₹{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      {order.orderStatus === "received" && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="px-6 py-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 transition-all font-bold flex items-center gap-2 text-sm"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Order
                        </button>
                      )}
                      {(order.orderStatus === "completed" || order.orderStatus === "cancelled") && (
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="glass-button-secondary py-2 px-6 flex items-center gap-2 text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> Order Again
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
