import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pizza, ChevronRight } from "lucide-react";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#e6e6fa] to-[#f8f9fa] z-10" />
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pizza-red/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pizza-orange/15 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-8 w-full max-w-md z-10 relative bg-white/70"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-gradient-to-br from-pizza-red to-pizza-orange p-3 rounded-2xl shadow-md ring-1 ring-white/50">
             <Pizza className="w-8 h-8 text-white" />
           </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-800">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-8 font-medium">
          Sign in to track your orders and customize more pizzas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="glass-input w-full"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="glass-input w-full"
            />
          </div>

          <div className="flex justify-end mt-1">
            <Link to="/forgot" className="nav-link text-sm hover:text-pizza-red font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button w-full mt-4 flex items-center justify-center gap-2 group text-white"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
          <p className="text-slate-500 font-medium">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pizza-red hover:text-pizza-orange transition-colors font-bold ml-1">
              Register now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
