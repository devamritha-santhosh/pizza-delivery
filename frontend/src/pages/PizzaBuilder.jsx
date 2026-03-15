import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Receipt } from "lucide-react";

export default function PizzaBuilder() {
  const navigate = useNavigate();

  const [base, setBase] = useState("Regular Crust");
  const [sauce, setSauce] = useState("Tomato");
  const [cheese, setCheese] = useState("Mozzarella");
  const [veggies, setVeggies] = useState([]);

  const bases = ["Thin Crust", "Regular Crust", "Thick Crust", "Cheese Burst"];
  const sauces = ["Tomato", "White Sauce", "Pesto", "Marinara"];
  const cheeses = ["Mozzarella", "Cheddar", "Parmesan", "No Cheese"];
  
  const veggieOptions = [
    { name: "Onion", price: 15 },
    { name: "Bell Pepper", price: 15 },
    { name: "Mushroom", price: 15 },
    { name: "Olives", price: 15 },
    { name: "Tomato", price: 15 },
    { name: "Jalapeno", price: 15 }
  ];

  const toggleVeggie = (vegName) => {
    if (veggies.includes(vegName)) {
      setVeggies(veggies.filter(v => v !== vegName));
    } else {
      setVeggies([...veggies, vegName]);
    }
  };

  const calculatePrice = () => {
    let price = 150; // base price
    if (base === "Cheese Burst") price += 70;
    else price += 40;
    
    if (sauce !== "Tomato") price += 30;
    if (cheese !== "No Cheese") price += 40;
    
    price += veggies.length * 15;
    return price;
  };

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      if (!base || !sauce || !cheese) {
        alert("Please select base, sauce, and cheese!");
        return;
      }

      const totalPrice = calculatePrice();
      const items = [
        { name: base, price: base === 'Cheese Burst' ? 110 : 40, quantity: 1 },
        { name: sauce, price: sauce === 'Tomato' ? 0 : 30, quantity: 1 },
        { name: cheese, price: cheese === 'No Cheese' ? 0 : 40, quantity: 1 },
        ...veggies.map((v) => ({ name: v, price: 15, quantity: 1 })),
      ];

      navigate("/payment", {
        state: {
          orderData: {
            items,
            totalPrice
          }
        }
      });
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0 relative pt-6 text-slate-800">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e6e6fa] z-10" />
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pizza-red/10 rounded-full blur-[100px] z-20" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pizza-orange/10 rounded-full blur-[100px] z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-pizza-red transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-white group-hover:bg-purple-50 transition-colors shadow-sm border border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Menu</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          
          {/* Left Pane: Dynamic Receipt / Outline Visualization */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-8 h-fit">
             <div className="glass-panel p-8 relative flex flex-col items-center overflow-hidden">
                <div className="w-16 h-16 bg-purple-100 text-pizza-red rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-200">
                  <Receipt className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Your Masterpiece</h2>
                
                <div className="w-full bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm relative overflow-hidden backdrop-blur-md">
                   
                   <ul className="space-y-4 mb-6 relative z-10 text-slate-700 font-medium">
                      <motion.li layout className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Crust: {base}</span>
                        <span className="text-slate-500 text-sm">₹{base === 'Cheese Burst' ? 110 : 40}</span>
                      </motion.li>
                      <motion.li layout className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Sauce: {sauce}</span>
                        <span className="text-slate-500 text-sm">₹{sauce === 'Tomato' ? 0 : 30}</span>
                      </motion.li>
                      <motion.li layout className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Cheese: {cheese}</span>
                        <span className="text-slate-500 text-sm">₹{cheese === 'No Cheese' ? 0 : 40}</span>
                      </motion.li>
                      
                      <AnimatePresence>
                        {veggies.length > 0 && (
                          <motion.li 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2"
                          >
                            <span className="block text-sm text-slate-500 mb-2 uppercase tracking-wide">Toppings</span>
                            <div className="flex flex-wrap gap-2">
                              {veggies.map(v => (
                                <motion.span 
                                  key={v}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="bg-purple-100/80 text-pizza-red text-xs px-2.5 py-1 rounded-full font-bold border border-purple-200"
                                >
                                  {v}
                                </motion.span>
                              ))}
                            </div>
                          </motion.li>
                        )}
                      </AnimatePresence>
                   </ul>
                   
                   {/* Abstract background graphics */}
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pizza-red/5 rounded-full blur-2xl" />
                   <div className="absolute -top-10 -left-10 w-40 h-40 bg-pizza-orange/5 rounded-full blur-2xl" />
                </div>
             </div>

             {/* Sticky Desktop Pricing Panel */}
             <div className="hidden lg:block mt-6 glass-panel p-6 shadow-md border-slate-200">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">Total Price</span>
                  <motion.span 
                    key={calculatePrice()}
                    initial={{ scale: 1.2, color: "#9F7AEA" }}
                    animate={{ scale: 1, color: "#6B46C1" }}
                    className="text-4xl font-extrabold text-pizza-red line-height-1"
                  >
                    ₹{calculatePrice()}
                  </motion.span>
                </div>
                <button onClick={handleOrder} className="w-full bg-pizza-red text-white py-4 rounded-xl font-bold shadow-lg shadow-pizza-red/20 hover:shadow-pizza-red/40 hover:-translate-y-1 transition-all text-lg flex justify-center items-center gap-2">
                  Proceed to Checkout <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* Right Pane: Controls */}
          <div className="w-full lg:w-[55%] space-y-8 pb-32 lg:pb-0">
             
             <div>
               <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Customize Options</h1>
               <p className="text-slate-500">Select your preferred crust, sauce, cheese, and fresh toppings.</p>
             </div>

             {/* Base */}
             <section className="glass-panel p-6">
               <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 relative">
                 <span className="bg-pizza-red/10 text-pizza-red flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold">1</span> 
                 Choose Crust
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {bases.map(b => (
                   <button
                     key={b}
                     onClick={() => setBase(b)}
                     className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                       base === b 
                         ? 'border-pizza-red bg-pizza-red/5 text-pizza-red shadow-sm'
                         : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-white hover:text-slate-800 shadow-sm'
                     }`}
                   >
                     {base === b && <CheckCircle2 className="w-4 h-4 text-pizza-red" />}
                     {b}
                   </button>
                 ))}
               </div>
             </section>

             {/* Sauce */}
             <section className="glass-panel p-6">
               <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <span className="bg-pizza-red/10 text-pizza-red flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold">2</span> 
                 Select Sauce
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {sauces.map(s => (
                   <button
                     key={s}
                     onClick={() => setSauce(s)}
                     className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                       sauce === s 
                         ? 'border-pizza-red bg-pizza-red/5 text-pizza-red shadow-sm'
                         : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-white hover:text-slate-800 shadow-sm'
                     }`}
                   >
                     {sauce === s && <CheckCircle2 className="w-4 h-4 text-pizza-red" />}
                     {s}
                   </button>
                 ))}
               </div>
             </section>

             {/* Cheese */}
             <section className="glass-panel p-6">
               <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <span className="bg-pizza-red/10 text-pizza-red flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold">3</span> 
                 Cheese Level
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {cheeses.map(c => (
                   <button
                     key={c}
                     onClick={() => setCheese(c)}
                     className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                       cheese === c 
                         ? 'border-pizza-red bg-pizza-red/5 text-pizza-red shadow-sm'
                         : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-white hover:text-slate-800 shadow-sm'
                     }`}
                   >
                     {cheese === c && <CheckCircle2 className="w-4 h-4 text-pizza-red" />}
                     {c}
                   </button>
                 ))}
               </div>
             </section>

             {/* Toppings */}
             <section className="glass-panel p-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <span className="bg-pizza-red/10 text-pizza-red flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold">4</span> 
                   Fresh Toppings
                 </h3>
                 <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">₹15 each</span>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {veggieOptions.map(veg => {
                   const isSelected = veggies.includes(veg.name);
                   return (
                     <button
                       key={veg.name}
                       onClick={() => toggleVeggie(veg.name)}
                       className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                         isSelected 
                           ? 'border-pizza-red bg-pizza-red/5 text-pizza-red shadow-sm'
                           : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-white hover:text-slate-800 shadow-sm'
                       }`}
                     >
                       <div className="flex items-center gap-2">
                         <span>{veg.name}</span>
                       </div>
                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'border-pizza-red bg-pizza-red' : 'border-slate-300'}`}>
                         {isSelected && <Check className="w-3 h-3 text-white" />}
                       </div>
                     </button>
                   )
                 })}
               </div>
             </section>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel !rounded-none !rounded-t-[32px] p-6 !border-b-0 !border-l-0 !border-r-0 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] bg-white/95">
         <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total</span>
              <motion.span 
                key={`mobile-${calculatePrice()}`} 
                initial={{ scale: 1.2, color: "#9F7AEA" }} 
                animate={{ scale: 1, color: "#6B46C1" }} 
                className="text-2xl font-extrabold text-pizza-red"
              >
                ₹{calculatePrice()}
              </motion.span>
            </div>
            <button onClick={handleOrder} className="bg-pizza-red text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-pizza-red/20">
              Checkout <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

    </div>
  );
}