import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser"; // This is the modern package
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
      <div className="w-full h-2 bg-purple-500 animate-pulse"></div> // Replaces LinearProgress
    );
  }

  return (
    <div>
      <Header/>
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col items-center mt-6 border-r-2 border-purple-200 md:border-r-purple-400">
          <img
            src={coin?.image.large}
            alt={coin?.name}
            className="h-48 mb-5"
          />
          <h1 className="text-4xl font-bold text-purple-700 font-montserrat">
            {coin?.name}
          </h1>
          <p className="w-full text-gray-700 font-montserrat p-6 pb-4 text-justify">
            {parse(coin?.description.en.split(". ")[0])}.
          </p>
          <div className="w-full px-6 pt-2 space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-purple-600 font-montserrat">
                Rank:
              </span>
              <span className="text-xl text-gray-800 font-montserrat ml-2">
                {numberWithCommas(coin?.market_cap_rank)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-purple-600 font-montserrat">
                Current Price:
              </span>
              <span className="text-xl text-gray-800 font-montserrat ml-2">
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-purple-600 font-montserrat">
                Market Cap:
              </span>
              <span className="text-xl text-gray-800 font-montserrat ml-2">
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)
                )}
                M
              </span>
            </div>
          </div>
        </div>

        {/* CoinInfo Component */}
        <div className="w-full md:w-2/3">
          <CoinInfo coin={coin} />
        </div>
      </div>
    </div>
  );
};

export default CoinPage;