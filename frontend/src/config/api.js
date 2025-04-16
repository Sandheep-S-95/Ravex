// Base URL for CoinGecko API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Default values
const DEFAULT_CURRENCY = 'usd';
const DEFAULT_DAYS = 365;
const DEFAULT_PER_PAGE = 100;
const DEFAULT_PAGE = 1;

// Utility function to build query string
const buildQueryString = (params) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

// API endpoint configurations
export const CoinList = (currency = DEFAULT_CURRENCY) =>
  `${API_BASE_URL}/coins/markets?${buildQueryString({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: DEFAULT_PER_PAGE,
    page: DEFAULT_PAGE,
    sparkline: false,
  })}`;

export const SingleCoin = (id) =>
  `${API_BASE_URL}/coins/${encodeURIComponent(id)}`;

export const HistoricalChart = (id, currency = DEFAULT_CURRENCY, days = DEFAULT_DAYS) =>
  `${API_BASE_URL}/coins/${encodeURIComponent(id)}/market_chart?${buildQueryString({
    vs_currency: currency,
    days,
  })}`;

export const TrendingCoins = (currency = DEFAULT_CURRENCY) =>
  `${API_BASE_URL}/coins/markets?${buildQueryString({
    vs_currency: currency,
    order: 'gecko_desc',
    per_page: 10,
    page: DEFAULT_PAGE,
    sparkline: false,
    price_change_percentage: '24h',
  })}`;