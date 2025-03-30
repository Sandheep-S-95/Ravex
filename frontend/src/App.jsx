import Homepage from "./pages/HomePage";
import CoinPage from "./pages/CoinPage";
import AddTransaction from "./pages/AddTransaction";
import Login from "./pages/auth_pages/Login";
import SignUp from "./pages/auth_pages/SignUp";
import ResetPassword from "./pages/auth_pages/ResetPassword";
import UpdatePassword from "./pages/auth_pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/coins/:id" element={<CoinPage />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </main>
        
        <motion.footer 
          className="w-full py-4 text-center bg-gray-900 text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-medium text-lg text-gray-400">
              RAVEX &copy; 2025 CODED WITH <span className="text-red-500">&lt;❤️/&gt;</span> AND <span className="text-yellow-500">&lt;☕/&gt;</span> BY Sandheep S & Hariish A
            </p>
          </div>
        </motion.footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
