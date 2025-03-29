import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext.jsx";
import { numberWithCommas } from "../CoinsTable.jsx";

const CarouselComponent = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(TrendingCoins(currency));
      console.log("Fetched trending coins:", data);
      setTrending(data);
    } catch (err) {
      console.error("Error fetching trending coins:", err);
      setError("Failed to fetch trending coins. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call the API every time the component mounts or currency changes
    fetchTrendingCoins();
  }, [currency]);

  const items = trending.map((coin) => {
    const profit = coin?.price_change_percentage_24h >= 0;
    return (
      <Link
        key={coin.id}
        to={`/coins/${coin.id}`}
        className="flex flex-col items-center cursor-pointer text-gray-800 uppercase"
      >
        <img src={coin?.image} alt={coin.name} className="h-20 mb-2" />
        <span className="text-lg font-montserrat">
          {coin?.symbol}{" "}
          <span
            className={
              profit ? "text-green-400 font-medium" : "text-red-500 font-medium"
            }
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span className="text-xl font-medium font-montserrat">
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: { items: 2 },
    512: { items: 4 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-white text-lg font-montserrat">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500 text-lg font-montserrat">{error}</p>
      </div>
    );
  }

  return (
    <AliceCarousel
      mouseTracking
      infinite
      autoPlayInterval={1000}
      animationDuration={1500}
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      items={items}
      autoPlay
    />
  );
};

export default CarouselComponent;