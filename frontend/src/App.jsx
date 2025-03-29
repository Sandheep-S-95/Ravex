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
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/coins/:id" element={<CoinPage />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="p-4 text-center bg-gray-100">
          <p>© 2025 Crypto App. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;