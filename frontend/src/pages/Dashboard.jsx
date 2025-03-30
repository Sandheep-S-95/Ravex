import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/user_components/Navbar";
import { Doughnut, Radar, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-400 text-center py-4">Chart rendering failed. Check console for details.</div>;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("Fetching with token:", token);
        const response = await axios.get("http://localhost:3000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched transactions:", response.data);
        setTransactions(response.data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err.response?.data || err.message);
        setError("Failed to load transactions. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      // Enhanced cleanup
      Object.values(chartRefs.current).forEach(chart => chart?.destroy());
      Object.values(ChartJS.instances).forEach(chart => chart.destroy());
    };
  }, [user, navigate]);

  const categories = ["BTC", "ETH", "USDT", "XRP"];
  const colors = ["#F7931A", "#627EEA", "#26A17B", "#EC4899"];

  const donutData = {
    labels: categories,
    datasets: [{
      data: categories.map(cat => {
        const total = transactions
          .filter(t => t.category === cat)
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        console.log(`Donut - ${cat}: ${total}`);
        return total;
      }),
      backgroundColor: colors,
      borderWidth: 0,
    }],
  };

  const radarData = {
    labels: categories,
    datasets: [
      {
        label: "Buy",
        data: categories.map(cat => {
          const buyTotal = transactions
            .filter(t => t.category === cat && t.type === "Buy")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          console.log(`Radar Buy - ${cat}: ${buyTotal}`);
          return buyTotal;
        }),
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "#EF4444",
        borderWidth: 2,
      },
      {
        label: "Sell",
        data: categories.map(cat => {
          const sellTotal = transactions
            .filter(t => t.category === cat && t.type === "Sell")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          console.log(`Radar Sell - ${cat}: ${sellTotal}`);
          return sellTotal;
        }),
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "#22C55E",
        borderWidth: 2,
      },
    ],
  };

  const dates = [...new Set(transactions.map(t => t.created_at?.split("T")[0] || "Unknown"))].sort();
  const lineData = {
    labels: dates,
    datasets: [{
      label: "Transaction Amount",
      data: dates.map(date => {
        const netAmount = transactions
          .filter(t => t.created_at?.split("T")[0] === date)
          .reduce((sum, t) => sum + (t.type === "Sell" ? -(t.amount || 0) : (t.amount || 0)), 0);
        console.log(`Line - ${date}: ${netAmount}`);
        return netAmount;
      }),
      borderColor: "#8B5CF6",
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      tension: 0.3,
      fill: true,
    }],
  };

  const barData = {
    labels: categories,
    datasets: [{
      label: "Transaction Count",
      data: categories.map(cat => {
        const count = transactions.filter(t => t.category === cat).length;
        console.log(`Bar - ${cat}: ${count}`);
        return count;
      }),
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1,
    }],
  };

  // Minimal options for Doughnut (no scales)
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { backgroundColor: "#1F2937", titleColor: "#fff", bodyColor: "#fff" },
    },
  };

  // Options for other charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { backgroundColor: "#1F2937", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      r: {
        grid: { color: "#374151" },
      },
      x: { ticks: { color: "#fff" }, grid: { color: "#374151" } },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "#374151" },
        beginAtZero: true,
      },
    },
  };

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
          Dashboard
        </motion.h1>

        {transactions.length === 0 ? (
          <div className="text-white text-center py-10">
            No transactions available. Add some transactions to see visualizations!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Total Amount by Category</h2>
              <div className="h-64">
                <ErrorBoundary>
                  <Doughnut
                    ref={ref => (chartRefs.current.donut = ref?.chartInstance)}
                    key="donut"
                    data={donutData}
                    options={donutOptions} // Use minimal options
                  />
                </ErrorBoundary>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Buy vs Sell by Category</h2>
              <div className="h-64">
                <ErrorBoundary>
                  <Radar
                    ref={ref => (chartRefs.current.radar = ref?.chartInstance)}
                    key="radar"
                    data={radarData}
                    options={chartOptions}
                  />
                </ErrorBoundary>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Amounts Over Time</h2>
              <div className="h-64">
                <ErrorBoundary>
                  <Line
                    ref={ref => (chartRefs.current.line = ref?.chartInstance)}
                    key="line"
                    data={lineData}
                    options={chartOptions}
                  />
                </ErrorBoundary>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Transaction Count by Category</h2>
              <div className="h-64">
                <ErrorBoundary>
                  <Bar
                    ref={ref => (chartRefs.current.bar = ref?.chartInstance)}
                    key="bar"
                    data={barData}
                    options={chartOptions}
                  />
                </ErrorBoundary>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;