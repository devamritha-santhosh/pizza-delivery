import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { API_URL } from "../api";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const orderData = location.state?.orderData;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // Redirect back if no order data is found
    if (!orderData) {
      navigate("/dashboard");
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: orderData.totalPrice })
      });
      
      const rzpOrder = await orderRes.json();
      if (!rzpOrder.id) {
        alert("Payment initialization failed");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_SRD7Es0Pvh7hmN",
        amount: rzpOrder.amount,
        currency: "INR",
        order_id: rzpOrder.id,
        name: "Slice&Spice Pizza",
        description: "Pizza Order Payment",
        prefill: { 
          name: user?.name || "Guest", 
          email: user?.email || "", 
          contact: user?.phone || "9000000000" 
        },
        theme: { color: "#6B46C1" }, // Using the new lavender theme color
        handler: async function (response) {
          // Verify & Create Order in Backend
          const res = await fetch(`${API_URL}/order/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              items: orderData.items,
              totalPrice: orderData.totalPrice,
              paymentId: response.razorpay_payment_id
            })
          });
          
          const data = await res.json();
          if (data.success) {
            setPaymentSuccess(true);
            setTimeout(() => {
              navigate("/orders");
            }, 3000); // Redirect after 3 seconds showing success state
          } else {
            alert("Order saving failed");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing payment");
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6">
        <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa]" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="glass-panel p-12 text-center max-w-lg w-full"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 mb-8">Your order has been placed successfully. Kitchen is preparing your pizza right now!</p>
          <p className="text-sm font-semibold text-slate-400 animate-pulse">Redirecting to your orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-10 pb-20">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pizza-red/10 rounded-full blur-[100px] z-20" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pizza-orange/10 rounded-full blur-[100px] z-20" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-pizza-red transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-white group-hover:bg-purple-50 transition-colors border border-slate-200 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Order Summary */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Review Your Order</h1>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel p-8">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-4 mb-4">Order Items</h3>
              
              <ul className="space-y-4 mb-8">
                {orderData.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-3">
                      <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-sm font-bold">{item.quantity}x</span>
                      <span className="font-medium">{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700">₹{orderData.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500">Taxes & Fees</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1 group relative cursor-help">
                    ₹0 <span className="text-pizza-red text-xs font-bold">(Free)</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total to Pay</span>
                    <span className="text-4xl font-extrabold text-pizza-red">₹{orderData.totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Action */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 invisible hidden lg:block">Checkout</h1>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-8 sticky top-8">
               <div className="w-16 h-16 bg-purple-100 text-pizza-red rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-200">
                 <CreditCard className="w-8 h-8" />
               </div>
               
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Secure Checkout</h3>
               <p className="text-slate-500 mb-8 max-w-sm">Pay securely via UPI, Cards, or NetBanking using Razorpay's encrypted gateway.</p>
               
               <button 
                 onClick={handlePayNow} 
                 disabled={isProcessing}
                 className={`w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isProcessing ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-pizza-red text-white hover:bg-[#5b3bb3] hover:shadow-xl hover:shadow-pizza-red/30 hover:-translate-y-1'}`}
               >
                 {isProcessing ? (
                   <>
                     <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     Pay ₹{orderData.totalPrice} Securely
                   </>
                 )}
               </button>

               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 256-bit Secure Encryption
               </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
