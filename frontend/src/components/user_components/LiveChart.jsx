// src/components/LiveChart.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const API_KEY = "YWKNZCCT3TT4K4I3"; // Your API key

const LiveChart = ({ symbol }) => {
  const [stockData, setStockData] = useState({});

  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return {};
    }
  };

  const formatStockData = (stockData) => {
    const formattedData = [];
    if (stockData["Weekly Adjusted Time Series"]) {
      Object.entries(stockData["Weekly Adjusted Time Series"]).forEach(
        ([key, value]) => {
          formattedData.push({
            x: key,
            y: [
              value["1. open"],
              value["2. high"],
              value["3. low"],
              value["4. close"],
            ],
          });
        }
      );
    }
    // Sort by date and take the last 13 weeks (approx. 3 months) for zoom
    return formattedData
      .sort((a, b) => new Date(a.x) - new Date(b.x))
      .slice(-13); // Adjust this number to zoom in/out (e.g., -5 for ~1 month)
  };

  const candleStickOptions = {
    chart: {
      type: "candlestick",
      height: 500,
      background: "transparent", // Match the dark theme
      foreColor: "#d1d5db", // Light gray text for labels (Tailwind gray-300)
    },
    title: {
      text: `${symbol} Weekly Price Chart`,
      align: "left",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "Montserrat, sans-serif",
        color: "#10b981", // Tailwind emerald-500 for gradient start
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#9ca3af", // Tailwind gray-400
          fontFamily: "Montserrat, sans-serif",
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#9ca3af", // Tailwind gray-400
          fontFamily: "Montserrat, sans-serif",
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981", // Tailwind emerald-500 for bullish candles
          downward: "#ef4444", // Tailwind red-500 for bearish candles
        },
        wick: {
          width: 1, // Thinner wicks for clarity
        },
      },
    },
    grid: {
      borderColor: "#374151", // Tailwind gray-700
    },
    tooltip: {
      theme: "dark",
      style: {
        fontFamily: "Montserrat, sans-serif",
      },
    },
  };

  useEffect(() => {
    fetchStockData(symbol).then((data) => setStockData(data));
  }, [symbol]);

  const seriesData = useMemo(() => formatStockData(stockData), [stockData]);

  return (
    <ReactApexChart
      series={[{ data: seriesData }]}
      options={candleStickOptions}
      type="candlestick"
      height={500}
      width="100%"
    />
  );
};

export default LiveChart;