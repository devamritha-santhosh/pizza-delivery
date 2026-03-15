import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft } from "lucide-react";
import api from "../api";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      alert(data.message); // show success or error message
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-pizza-red/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-8 w-full max-w-md z-10 relative bg-white/70"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-gradient-to-br from-pizza-red to-pizza-orange p-3 rounded-2xl shadow-md ring-1 ring-white/50">
             <KeyRound className="w-8 h-8 text-white" />
           </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-800">
          Reset Password
        </h2>
        <p className="text-center text-slate-500 mb-8 font-medium">
          Enter your registered email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your registered email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button w-full mt-4 flex items-center justify-center gap-2 text-white"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-pizza-red transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
