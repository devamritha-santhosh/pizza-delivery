import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import PizzaBuilder from "./pages/PizzaBuilder";
import UserOrders from "./pages/UserOrders";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword";
import AdminOrders from "./pages/AdminOrders";
import AdminInventory from "./pages/AdminInventory";
import Payment from "./pages/Payment";

const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const ProtectedRoute = ({ children }) => {
  const user = getUser();
  return user ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const user = getUser();
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/customize" element={<ProtectedRoute><PizzaBuilder /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;