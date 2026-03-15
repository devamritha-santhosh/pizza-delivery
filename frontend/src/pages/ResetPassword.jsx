import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeySquare } from "lucide-react";
import api from "../api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      alert(data.message);
      navigate("/"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-pizza-orange/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-8 w-full max-w-md z-10 relative bg-white/70"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-gradient-to-br from-pizza-red to-pizza-orange p-3 rounded-2xl shadow-md ring-1 ring-white/50">
             <KeySquare className="w-8 h-8 text-white" />
           </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-800">
          New Password
        </h2>
        <p className="text-center text-slate-500 mb-8 font-medium">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button w-full mt-4 flex items-center justify-center gap-2 text-white"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
