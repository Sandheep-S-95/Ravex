// src/pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TransactionTable from "../components/TransactionTable";
import Navbar from "../components/user_components/Navbar";
import LiveChart from "../components/user_components/LiveChart";

const Transactions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:3000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err.response?.data || err.message);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] text-center py-6 text-white">
        <Navbar />
        <div className="pt-20">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] text-center py-6 text-red-400">
        <Navbar />
        <div className="pt-20">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
        <motion.h1 
          className="text-3xl font-bold font-montserrat mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Transactions
        </motion.h1>

        {/* LiveChart Component */}
        <motion.div
          className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LiveChart symbol="BTC" /> {/* Example symbol; make dynamic if needed */}
        </motion.div>

        {/* TransactionTable Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <TransactionTable transactions={transactions} />
        </motion.div>
      </div>
    </div>
  );
};

export default Transactions;