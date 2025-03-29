import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  console.log(coin);

  return (
    <div className="w-3/4 flex flex-col items-center justify-center mt-6 p-10 bg-purple-900 text-white md:w-full md:mt-0 md:p-5 md:pt-0">
      {!historicData || !flag ? (
        <div className="w-64 h-64 border-4 border-t-purple-500 rounded-full animate-spin"></div>
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
                  borderColor: "#EEBC1D", // Gold color
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                },
              },
            }}
          />
          <div className="flex mt-5 justify-around w-full flex-wrap gap-4">
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => {
                  setDays(day.value);
                  setFlag(false);
                }}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoinInfo;