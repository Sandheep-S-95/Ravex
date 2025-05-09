import React, { useState, useEffect, useRef } from "react";
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
  const [aiResponse, setAiResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null); // Ref for focus management

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

  // Handle AI analysis
  const handleAnalyzeWithAI = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/analyze-stock",
        { stock_symbol: "BTC" },
        { timeout: 10000 }
      );
      setAiResponse(response.data.analysis || "No analysis returned.");
      setShowPopup(true);
    } catch (err) {
      console.error("Error fetching AI analysis:", err);
      setAiResponse(`Failed to fetch analysis: ${err.message}`);
      setShowPopup(true);
    }
  };

  // Close popup handler
  const closePopup = () => {
    setShowPopup(false);
    setAiResponse(null);
  };

  // Keyboard event handler for analyze button
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAnalyzeWithAI();
    }
  };

  // Handle keyboard events for popup (e.g., Escape key)
  const handlePopupKeyDown = (event) => {
    if (event.key === "Escape") {
      closePopup();
    }
  };

  // Focus management for popup
  useEffect(() => {
    if (showPopup && popupRef.current) {
      popupRef.current.focus(); // Focus the popup when it opens
    }
  }, [showPopup]);

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

        <motion.div
          className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LiveChart symbol="BTC" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={handleAnalyzeWithAI}
            onKeyDown={handleKeyDown}
            className="px-6 py-3 rounded-lg font-montserrat font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none flex items-center justify-center shadow-lg"
            aria-label="Analyze with AI"
            type="button"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.31 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Analyze with AI
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <TransactionTable transactions={transactions} />
        </motion.div>

        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-labelledby="ai-analysis-title"
            aria-modal="true"
            ref={popupRef}
            tabIndex={-1}
            onKeyDown={handlePopupKeyDown}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
              onClick={closePopup}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closePopup();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close dialog"
            />
            <motion.div
              className="relative bg-gradient-to-b from-[#0d1d31] to-[#1e3a8a] rounded-xl p-8 w-full max-w-2xl shadow-2xl border border-gray-700/50"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                id="ai-analysis-title"
                className="text-2xl font-montserrat font-semibold text-white mb-6"
              >
                AI Stock Analysis
              </h2>
              <p className="text-gray-200 font-montserrat font-bold leading-relaxed space-y-4">
                {aiResponse}
              </p>
              <button
                onClick={closePopup}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    closePopup();
                  }
                }}
                className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-montserrat focus:ring-2 focus:ring-gray-500 focus:outline-none"
                type="button"
                aria-label="Close"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Transactions;