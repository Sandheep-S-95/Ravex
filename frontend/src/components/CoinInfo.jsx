import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setFlag(true);
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-lg shadow-xl border border-teal-500/30 relative overflow-hidden"
    >
      {/* Glowing effects */}
      <div className="absolute -top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

      {/* Chart */}
      {!historicData || !flag ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Line
            data={{
              labels: historicData.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicData.map((coin) => coin[1]),
                  label: `Price (Past ${days} Days) in ${currency}`,
                  borderColor: "#2DD4BF", // Tailwind cyan-400
                  backgroundColor: "rgba(45, 212, 191, 0.1)",
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 2,
                },
              },
            }}
          />

          {/* Buttons */}
          <div className="flex justify-center mt-6 space-x-3">
            {chartDays.map((day) => (
              <motion.button
                key={day.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDays(day.value);
                  setFlag(false);
                }}
                className={`px-4 py-2 rounded-xl transition-all font-semibold text-sm 
                  ${day.value === days ? "bg-teal-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-teal-500/30"}`}
              >
                {day.label}
              </motion.button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CoinInfo;