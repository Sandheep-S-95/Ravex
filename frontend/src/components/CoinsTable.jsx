import React, { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext.jsx";
import { motion } from "framer-motion";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CoinsTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    console.log(data);
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredCoins = handleSearch();
  const totalPages = Math.ceil(filteredCoins.length / 10);
  const paginatedCoins = filteredCoins.slice((page - 1) * 10, page * 10);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      } 
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 0 15px rgba(52, 211, 153, 0.5), 0 0 25px rgba(59, 130, 246, 0.3)",
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      transition: { 
        duration: 0.3,
        boxShadow: { duration: 0.4 },
      }
    }
  };

  return (
    <motion.div 
      className="text-center py-16 bg-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.h4 
          className="text-5xl font-bold font-montserrat mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Cryptocurrency Prices by Market Cap
        </motion.h4>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-8"
        >
          <input
            type="text"
            placeholder="Search For a Crypto Currency..."
            className="w-full p-4 pl-5 pr-12 text-white bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg 
            className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>

        {loading ? (
          <motion.div 
            className="w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400 rounded-full"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scaleX: [0.8, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5
            }}
          ></motion.div>
        ) : (
          <>
            <motion.div 
              className="overflow-x-auto rounded-lg shadow-lg"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              <table className="w-full text-left text-white">
                <thead className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white">
                  <tr>
                    <th className="p-5 font-extrabold text-2xl font-poppins rounded-tl-lg border-r border-emerald-400">Coin</th>
                    <th className="p-5 font-extrabold text-2xl font-poppins text-right border-r border-emerald-400">Price</th>
                    <th className="p-5 font-extrabold text-2xl font-poppins text-right border-r border-emerald-400">24h Change</th>
                    <th className="p-5 font-extrabold text-2xl font-poppins text-right rounded-tr-lg">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoins.map((row, index) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <motion.tr
                        key={row.name}
                        className="bg-gray-900 border-b border-gray-800 last:border-0 cursor-pointer"
                        onClick={() => navigate(`/coins/${row.id}`)}
                        variants={rowVariants}
                        whileHover="hover"
                        custom={index}
                      >
                        <td className="p-5 flex items-center gap-4 border-r border-gray-700">
                          <motion.img 
                            src={row?.image} 
                            alt={row.name} 
                            className="h-12 w-12 object-contain"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xl font-bold uppercase">{row.symbol}</span>
                            <span className="text-gray-400">{row.name}</span>
                          </div>
                        </td>
                        <td className="p-5 text-right font-medium border-r border-gray-700">
                          {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                        </td>
                        <td
                          className={`p-5 text-right font-medium border-r border-gray-700 ${
                            profit ? "text-green-400" : "text-red-500"
                          }`}
                        >
                          <div className="flex items-center justify-end">
                            {profit ? (
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                            {Math.abs(row.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-5 text-right font-medium">
                          {symbol}{" "}
                          {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            <motion.div 
              className="flex justify-center mt-8 py-5 flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    window.scrollTo({ top: 450, behavior: 'smooth' });
                  }
                }}
                disabled={page === 1}
                className="px-5 py-3 mx-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </div>
              </motion.button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 450, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 mx-1 flex items-center justify-center ${
                      page === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } rounded-full shadow-md transition-all duration-200`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (page < totalPages) {
                    setPage(page + 1);
                    window.scrollTo({ top: 450, behavior: 'smooth' });
                  }
                }}
                disabled={page === totalPages}
                className="px-5 py-3 mx-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <div className="flex items-center">
                  Next
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}