"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StockData, CandlestickData, INDIAN_STOCKS, MARKET_INDICES, MarketIndex } from '@/lib/stock-data';
import { MarketSimulator } from '@/lib/market-simulator';

interface MarketDataContextType {
  stocks: StockData[];
  selectedStock: StockData | null;
  candlestickData: CandlestickData[];
  marketIndices: MarketIndex[];
  watchlist: string[];
  isMarketOpen: boolean;
  isLoading: boolean;
  selectStock: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  refreshData: () => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

let marketSimulatorInstance: MarketSimulator | null = null;

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<StockData[]>(INDIAN_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>(MARKET_INDICES);
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'HDFCBANK', 'INFY', 'TCS']);
  const [isMarketOpen, setIsMarketOpen] = useState(true); // Simulated as always open for demo
  const [isLoading, setIsLoading] = useState(false);

  // Initialize market simulator
  useEffect(() => {
    if (!marketSimulatorInstance) {
      marketSimulatorInstance = new MarketSimulator(INDIAN_STOCKS, {
        volatility: 0.01,
        trendStrength: 0.05,
        updateInterval: 3000,
        volumeMultiplier: 1.0
      });
    }

    // Set initial selected stock
    if (!selectedStock && INDIAN_STOCKS.length > 0) {
      setSelectedStock(INDIAN_STOCKS[0]);
      setCandlestickData(marketSimulatorInstance.getCandlestickData(INDIAN_STOCKS[0].symbol));
    }

    return () => {
      if (marketSimulatorInstance) {
        marketSimulatorInstance.stopAllSimulations();
      }
    };
  }, []);

  // Start simulation for watchlist stocks
  useEffect(() => {
    if (!marketSimulatorInstance) return;

    watchlist.forEach(symbol => {
      marketSimulatorInstance!.startSimulation(symbol, (updatedStock) => {
        setStocks(prevStocks => 
          prevStocks.map(stock => 
            stock.symbol === symbol ? updatedStock : stock
          )
        );

        // Update selected stock if it matches
        if (selectedStock?.symbol === symbol) {
          setSelectedStock(updatedStock);
        }
      });
    });

    return () => {
      watchlist.forEach(symbol => {
        marketSimulatorInstance!.stopSimulation(symbol);
      });
    };
  }, [watchlist, selectedStock?.symbol]);

  // Update candlestick data when selected stock changes
  useEffect(() => {
    if (selectedStock && marketSimulatorInstance) {
      const data = marketSimulatorInstance.getCandlestickData(selectedStock.symbol);
      setCandlestickData(data);
    }
  }, [selectedStock]);

  // Simulate market indices updates
  useEffect(() => {
    const updateIndices = () => {
      setMarketIndices(prevIndices => 
        prevIndices.map(index => {
          const change = (Math.random() - 0.5) * index.value * 0.002; // Small random change
          const newValue = index.value + change;
          const changePercent = (change / index.value) * 100;
          
          return {
            ...index,
            value: Math.round(newValue * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            high: Math.max(index.high, newValue),
            low: Math.min(index.low, newValue),
          };
        })
      );
    };

    const interval = setInterval(updateIndices, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const selectStock = useCallback((symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
      if (marketSimulatorInstance) {
        const data = marketSimulatorInstance.getCandlestickData(symbol);
        setCandlestickData(data);
      }
    }
  }, [stocks]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      if (!prev.includes(symbol)) {
        return [...prev, symbol];
      }
      return prev;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }, []);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate data refresh
      if (marketSimulatorInstance && selectedStock) {
        const data = marketSimulatorInstance.getCandlestickData(selectedStock.symbol);
        setCandlestickData(data);
      }
      setIsLoading(false);
    }, 1000);
  }, [selectedStock]);

  const value: MarketDataContextType = {
    stocks,
    selectedStock,
    candlestickData,
    marketIndices,
    watchlist,
    isMarketOpen,
    isLoading,
    selectStock,
    addToWatchlist,
    removeFromWatchlist,
    refreshData,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};