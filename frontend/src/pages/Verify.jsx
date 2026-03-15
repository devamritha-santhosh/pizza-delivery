import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, Loader2 } from "lucide-react";
import api from "../api";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    api
      .get(`/auth/verify/${token}`)
      .then((res) => {
        setStatus("success");
        setTimeout(() => {
          alert(res.data);
          navigate("/"); // redirect to login
        }, 1500);
      })
      .catch(() => {
        setStatus("error");
        setTimeout(() => {
          alert("Verification failed");
          navigate("/");
        }, 2000);
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pizza-red/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-8 w-full max-w-sm z-10 relative flex flex-col items-center text-center bg-white/70"
      >
        <div className="mb-6">
           <div className={`p-4 rounded-2xl shadow-md ring-1 ring-white/50 transition-colors ${status === 'error' ? 'bg-red-500' : 'bg-gradient-to-br from-pizza-red to-pizza-orange'}`}>
             {status === "verifying" && <Loader2 className="w-10 h-10 text-white animate-spin" />}
             {(status === "success" || status === "error") && <MailCheck className="w-10 h-10 text-white" />}
           </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 tracking-tight text-slate-800">
          {status === "verifying" ? "Verifying Email" : status === "success" ? "Verified Successfully" : "Verification Failed"}
        </h2>
        
        <p className="text-slate-500 font-medium mt-2">
          {status === "verifying" 
            ? "Please wait while we verify your email address..." 
            : "Redirecting you back to login..."}
        </p>
      </motion.div>
    </div>
  );
}
