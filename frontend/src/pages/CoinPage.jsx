import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { motion } from "framer-motion";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import Header from "../components/Header";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coin) {
    return (
      <div>
        <Header />
        <div className="w-full h-2 bg-teal-500 animate-pulse mt-24"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      
      {/* Main container with padding to prevent header overlap */}
      <div className="pt-28 pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-lg border border-teal-500/30"
        >
          {/* Glowing effect container */}
          <div className="relative">
            {/* Glow elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row p-6">
              {/* Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full md:w-1/3 flex flex-col items-center md:border-r border-teal-500/30 pr-6"
              >
                <div className="rounded-full p-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 shadow-lg shadow-teal-500/20 mb-4">
                  <img
                    src={coin?.image.large}
                    alt={coin?.name}
                    className="h-36 md:h-48"
                  />
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-montserrat mb-4">
                  {coin?.name}
                </h1>
                
                <div className="bg-gray-800/60 rounded-xl p-6 shadow-inner shadow-teal-500/10 w-full">
                  <p className="text-gray-300 font-montserrat text-justify mb-4">
                    {parse(coin?.description.en.split(". ")[0])}.
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 rounded-lg bg-gray-800/80 hover:bg-gradient-to-r hover:from-teal-900/40 hover:to-blue-900/40 transition-all"
                    >
                      <span className="text-lg font-bold text-teal-400 font-montserrat">
                        Rank:
                      </span>
                      <span className="text-lg text-gray-200 font-montserrat ml-2">
                        {numberWithCommas(coin?.market_cap_rank)}
                      </span>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 rounded-lg bg-gray-800/80 hover:bg-gradient-to-r hover:from-teal-900/40 hover:to-blue-900/40 transition-all"
                    >
                      <span className="text-lg font-bold text-teal-400 font-montserrat">
                        Current Price:
                      </span>
                      <span className="text-lg text-gray-200 font-montserrat ml-2">
                        {symbol}{" "}
                        {numberWithCommas(
                          coin?.market_data.current_price[currency.toLowerCase()]
                        )}
                      </span>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 rounded-lg bg-gray-800/80 hover:bg-gradient-to-r hover:from-teal-900/40 hover:to-blue-900/40 transition-all"
                    >
                      <span className="text-lg font-bold text-teal-400 font-montserrat">
                        Market Cap:
                      </span>
                      <span className="text-lg text-gray-200 font-montserrat ml-2">
                        {symbol}{" "}
                        {numberWithCommas(
                          coin?.market_data.market_cap[currency.toLowerCase()]
                            .toString()
                            .slice(0, -6)
                        )}
                        M
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* CoinInfo Component */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full md:w-2/3 mt-8 md:mt-0 md:pl-6"
              >
                <div className="bg-gray-800/60 rounded-xl p-4 shadow-inner shadow-teal-500/10 h-full">
                  <CoinInfo coin={coin} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoinPage;