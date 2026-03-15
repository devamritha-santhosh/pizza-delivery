import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { UserPlus, Pizza } from "lucide-react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(data.message); 
      setForm({ name: "", email: "", password: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-pizza-red/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pizza-orange/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-8 w-full max-w-md z-10 relative mt-8 mb-8 bg-white/70"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-gradient-to-br from-pizza-red to-pizza-orange p-3 rounded-2xl shadow-md ring-1 ring-white/50">
             <UserPlus className="w-8 h-8 text-white" />
           </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-800">
          Create Account
        </h2>
        <p className="text-center text-slate-500 mb-6 font-medium">
          Join us for exclusive deals and faster checkout
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              placeholder="Full Name" 
              required 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="glass-input w-full"
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email" 
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
          <div>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              required 
              value={form.confirm} 
              onChange={e => setForm({ ...form, confirm: e.target.value })} 
              className="glass-input w-full"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button w-full mt-4 flex items-center justify-center gap-2 text-white"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
          <p className="text-slate-500 font-medium">
            Already registered?{" "}
            <Link to="/" className="text-pizza-red hover:text-pizza-orange transition-colors font-bold ml-1">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
