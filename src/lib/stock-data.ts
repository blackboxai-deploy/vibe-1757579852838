export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  marketCap: number;
  pe: number;
  isActive: boolean;
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

// Indian Stock Market - NIFTY 50 and popular stocks
export const INDIAN_STOCKS: StockData[] = [
  // Banking & Financial Services
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Oil & Gas",
    price: 2456.75,
    previousClose: 2432.10,
    change: 24.65,
    changePercent: 1.01,
    high: 2478.90,
    low: 2441.30,
    open: 2445.20,
    volume: 2840567,
    marketCap: 16623450,
    pe: 24.8,
    isActive: true,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    sector: "Banking",
    price: 1542.35,
    previousClose: 1538.70,
    change: 3.65,
    changePercent: 0.24,
    high: 1556.80,
    low: 1535.20,
    open: 1540.50,
    volume: 1876543,
    marketCap: 11789320,
    pe: 18.9,
    isActive: true,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    sector: "Banking",
    price: 1078.90,
    previousClose: 1072.45,
    change: 6.45,
    changePercent: 0.60,
    high: 1089.60,
    low: 1065.30,
    open: 1074.20,
    volume: 3245678,
    marketCap: 7654321,
    pe: 16.7,
    isActive: true,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    sector: "IT",
    price: 1456.80,
    previousClose: 1448.30,
    change: 8.50,
    changePercent: 0.59,
    high: 1467.90,
    low: 1442.10,
    open: 1450.75,
    volume: 1987654,
    marketCap: 6123456,
    pe: 22.4,
    isActive: true,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT",
    price: 3456.25,
    previousClose: 3442.80,
    change: 13.45,
    changePercent: 0.39,
    high: 3478.90,
    low: 3438.70,
    open: 3445.60,
    volume: 987654,
    marketCap: 12654321,
    pe: 26.8,
    isActive: true,
  },
  {
    symbol: "HDFCLIFE",
    name: "HDFC Life Insurance Co Ltd",
    sector: "Insurance",
    price: 678.45,
    previousClose: 672.30,
    change: 6.15,
    changePercent: 0.92,
    high: 685.70,
    low: 669.80,
    open: 674.50,
    volume: 1456789,
    marketCap: 1456789,
    pe: 15.6,
    isActive: true,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "Banking",
    price: 567.80,
    previousClose: 562.45,
    change: 5.35,
    changePercent: 0.95,
    high: 572.90,
    low: 559.70,
    open: 564.20,
    volume: 4567890,
    marketCap: 5067890,
    pe: 12.3,
    isActive: true,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    sector: "Construction",
    price: 2987.65,
    previousClose: 2965.40,
    change: 22.25,
    changePercent: 0.75,
    high: 3005.80,
    low: 2956.70,
    open: 2972.30,
    volume: 876543,
    marketCap: 4187653,
    pe: 28.9,
    isActive: true,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    sector: "Financial Services",
    price: 6789.45,
    previousClose: 6734.20,
    change: 55.25,
    changePercent: 0.82,
    high: 6823.70,
    low: 6712.80,
    open: 6745.60,
    volume: 567890,
    marketCap: 4234567,
    pe: 31.2,
    isActive: true,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India Ltd",
    sector: "Automobile",
    price: 9876.30,
    previousClose: 9823.75,
    change: 52.55,
    changePercent: 0.54,
    high: 9912.40,
    low: 9789.60,
    open: 9834.80,
    volume: 345678,
    marketCap: 2987654,
    pe: 25.7,
    isActive: true,
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints Ltd",
    sector: "Paints",
    price: 3234.55,
    previousClose: 3198.70,
    change: 35.85,
    changePercent: 1.12,
    high: 3256.80,
    low: 3187.90,
    open: 3205.40,
    volume: 234567,
    marketCap: 3109876,
    pe: 42.8,
    isActive: true,
  },
  {
    symbol: "NESTLEIND",
    name: "Nestle India Ltd",
    sector: "FMCG",
    price: 21456.75,
    previousClose: 21287.40,
    change: 169.35,
    changePercent: 0.80,
    high: 21567.80,
    low: 21198.60,
    open: 21334.20,
    volume: 12345,
    marketCap: 2076543,
    pe: 56.9,
    isActive: true,
  },
];

// Market Indices
export const MARKET_INDICES: MarketIndex[] = [
  {
    name: "NIFTY 50",
    value: 19674.25,
    change: 125.80,
    changePercent: 0.64,
    high: 19732.45,
    low: 19589.70,
  },
  {
    name: "SENSEX",
    value: 65953.48,
    change: 287.32,
    changePercent: 0.44,
    high: 66087.92,
    low: 65734.56,
  },
  {
    name: "NIFTY BANK",
    value: 44567.85,
    change: 234.67,
    changePercent: 0.53,
    high: 44789.23,
    low: 44234.56,
  },
  {
    name: "NIFTY IT",
    value: 31245.67,
    change: 187.45,
    changePercent: 0.60,
    high: 31456.78,
    low: 31098.54,
  },
];

// Timeframe options for charts
export const TIMEFRAMES = [
  { label: "1M", value: "1m", minutes: 1 },
  { label: "5M", value: "5m", minutes: 5 },
  { label: "15M", value: "15m", minutes: 15 },
  { label: "30M", value: "30m", minutes: 30 },
  { label: "1H", value: "1h", minutes: 60 },
  { label: "4H", value: "4h", minutes: 240 },
  { label: "1D", value: "1d", minutes: 1440 },
];

// Indian market sectors
export const SECTORS = [
  "Banking",
  "IT",
  "Oil & Gas", 
  "Automobile",
  "Pharma",
  "FMCG",
  "Financial Services",
  "Insurance",
  "Construction",
  "Paints",
  "Telecom",
  "Power",
  "Steel",
  "Cement",
  "Textiles",
];

// Market hours (IST)
export const MARKET_HOURS = {
  open: { hour: 9, minute: 15 }, // 9:15 AM IST
  close: { hour: 15, minute: 30 }, // 3:30 PM IST
  preOpen: { hour: 9, minute: 0 }, // 9:00 AM IST
  postClose: { hour: 16, minute: 0 }, // 4:00 PM IST
};

// Helper function to check if market is open
export const isMarketOpen = (): boolean => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = istTime.getDay();
  
  // Check if it's weekend (Saturday = 6, Sunday = 0)
  if (day === 0 || day === 6) return false;
  
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();
  const currentTime = hour * 60 + minute;
  
  const openTime = MARKET_HOURS.open.hour * 60 + MARKET_HOURS.open.minute;
  const closeTime = MARKET_HOURS.close.hour * 60 + MARKET_HOURS.close.minute;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Format Indian currency
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers in Indian style (Lakhs, Crores)
export const formatIndianNumber = (num: number): string => {
  if (num >= 10000000) { // 1 Crore
    return (num / 10000000).toFixed(2) + " Cr";
  } else if (num >= 100000) { // 1 Lakh
    return (num / 100000).toFixed(2) + " L";
  } else if (num >= 1000) { // 1 Thousand
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toString();
};