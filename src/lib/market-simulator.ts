import { StockData, CandlestickData, MarketIndex } from './stock-data';

export interface SimulationConfig {
  volatility: number; // 0.01 = 1% volatility
  trendStrength: number; // -1 to 1, negative for bearish, positive for bullish
  updateInterval: number; // milliseconds
  volumeMultiplier: number; // base volume multiplier
}

export class MarketSimulator {
  private stocks: Map<string, StockData> = new Map();
  private candlestickHistory: Map<string, CandlestickData[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private simulationConfig: SimulationConfig;

  constructor(initialStocks: StockData[], config: SimulationConfig = {
    volatility: 0.02,
    trendStrength: 0.1,
    updateInterval: 2000,
    volumeMultiplier: 1.0
  }) {
    this.simulationConfig = config;
    
    // Initialize stocks
    initialStocks.forEach(stock => {
      this.stocks.set(stock.symbol, { ...stock });
      this.candlestickHistory.set(stock.symbol, this.generateHistoricalData(stock, 200));
    });
  }

  // Generate realistic historical candlestick data
  private generateHistoricalData(stock: StockData, periods: number): CandlestickData[] {
    const data: CandlestickData[] = [];
    let currentPrice = stock.price * 0.95; // Start 5% below current price
    const baseVolume = stock.volume;
    
    const now = new Date();
    
    for (let i = periods; i > 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000); // 1-minute intervals
      
      // Generate OHLC for this period
      const open = currentPrice;
      const volatility = this.simulationConfig.volatility;
      
      // Random price movement with trend bias
      const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
      const trendFactor = this.simulationConfig.trendStrength;
      const priceChange = open * volatility * (randomFactor + trendFactor);
      
      const close = Math.max(open + priceChange, open * 0.95); // Prevent negative prices
      
      // Generate high and low
      const highRange = Math.max(open, close) * (1 + Math.random() * volatility);
      const lowRange = Math.min(open, close) * (1 - Math.random() * volatility);
      
      const high = Math.max(open, close, highRange);
      const low = Math.min(open, close, lowRange);
      
      // Generate volume with some randomness
      const volumeVariation = 0.5 + Math.random(); // 0.5 to 1.5 multiplier
      const volume = Math.floor(baseVolume * volumeVariation * this.simulationConfig.volumeMultiplier);
      
      data.push({
        time: timestamp.toISOString(),
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  // Start real-time simulation for a stock
  startSimulation(symbol: string, callback: (stock: StockData) => void): void {
    if (this.intervals.has(symbol)) {
      this.stopSimulation(symbol);
    }

    const interval = setInterval(() => {
      const stock = this.stocks.get(symbol);
      if (!stock) return;

      const updatedStock = this.updateStockPrice(stock);
      this.stocks.set(symbol, updatedStock);
      
      // Add new candlestick data
      this.addNewCandlestickData(symbol, updatedStock);
      
      callback(updatedStock);
    }, this.simulationConfig.updateInterval);

    this.intervals.set(symbol, interval);
  }

  // Stop simulation for a stock
  stopSimulation(symbol: string): void {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
  }

  // Stop all simulations
  stopAllSimulations(): void {
    this.intervals.forEach((interval, symbol) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  // Update stock price with realistic movement
  private updateStockPrice(stock: StockData): StockData {
    const volatility = this.simulationConfig.volatility;
    const trendStrength = this.simulationConfig.trendStrength;
    
    // Calculate price change
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const priceChange = stock.price * volatility * (randomFactor + trendStrength);
    
    // Update price
    const newPrice = Math.max(stock.price + priceChange, stock.price * 0.9); // Prevent extreme drops
    const change = newPrice - stock.previousClose;
    const changePercent = (change / stock.previousClose) * 100;
    
    // Update high/low if needed
    const newHigh = Math.max(stock.high, newPrice);
    const newLow = Math.min(stock.low, newPrice);
    
    // Generate new volume
    const volumeVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 multiplier
    const newVolume = Math.floor(stock.volume * volumeVariation);
    
    return {
      ...stock,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      high: Math.round(newHigh * 100) / 100,
      low: Math.round(newLow * 100) / 100,
      volume: newVolume,
    };
  }

  // Add new candlestick data point
  private addNewCandlestickData(symbol: string, stock: StockData): void {
    const history = this.candlestickHistory.get(symbol);
    if (!history) return;

    const now = new Date();
    const lastCandle = history[history.length - 1];
    const lastTime = new Date(lastCandle.time);
    
    // Check if we need to create a new candle (1-minute intervals)
    const timeDiff = now.getTime() - lastTime.getTime();
    if (timeDiff >= 60000) { // 1 minute passed
      // Create new candle
      const newCandle: CandlestickData = {
        time: now.toISOString(),
        open: lastCandle.close,
        high: stock.price,
        low: stock.price,
        close: stock.price,
        volume: stock.volume,
      };
      
      history.push(newCandle);
      
      // Keep only last 500 candles for performance
      if (history.length > 500) {
        history.shift();
      }
    } else {
      // Update current candle
      const currentCandle = history[history.length - 1];
      currentCandle.close = stock.price;
      currentCandle.high = Math.max(currentCandle.high, stock.price);
      currentCandle.low = Math.min(currentCandle.low, stock.price);
      currentCandle.volume = stock.volume;
    }
  }

  // Get candlestick data for a stock
  getCandlestickData(symbol: string, limit?: number): CandlestickData[] {
    const history = this.candlestickHistory.get(symbol) || [];
    return limit ? history.slice(-limit) : history;
  }

  // Get current stock data
  getStock(symbol: string): StockData | undefined {
    return this.stocks.get(symbol);
  }

  // Get all stocks
  getAllStocks(): StockData[] {
    return Array.from(this.stocks.values());
  }

  // Update simulation configuration
  updateConfig(config: Partial<SimulationConfig>): void {
    this.simulationConfig = { ...this.simulationConfig, ...config };
  }

  // Simulate market events (news, earnings, etc.)
  triggerMarketEvent(symbol: string, impactPercent: number): void {
    const stock = this.stocks.get(symbol);
    if (!stock) return;

    const priceImpact = stock.price * (impactPercent / 100);
    const newPrice = Math.max(stock.price + priceImpact, stock.price * 0.8);
    const change = newPrice - stock.previousClose;
    const changePercent = (change / stock.previousClose) * 100;

    const updatedStock: StockData = {
      ...stock,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      high: Math.max(stock.high, newPrice),
      low: Math.min(stock.low, newPrice),
    };

    this.stocks.set(symbol, updatedStock);
  }

  // Calculate technical indicators
  calculateSMA(symbol: string, period: number): number[] {
    const data = this.getCandlestickData(symbol);
    const sma: number[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
      sma.push(sum / period);
    }
    
    return sma;
  }

  calculateEMA(symbol: string, period: number): number[] {
    const data = this.getCandlestickData(symbol);
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i].close;
    }
    ema.push(sum / period);
    
    // Calculate EMA for remaining data points
    for (let i = period; i < data.length; i++) {
      const currentEma = (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(currentEma);
    }
    
    return ema;
  }

  calculateRSI(symbol: string, period: number = 14): number[] {
    const data = this.getCandlestickData(symbol);
    const rsi: number[] = [];
    
    if (data.length < period + 1) return rsi;
    
    let gains = 0;
    let losses = 0;
    
    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    // Calculate RSI for remaining data points
    for (let i = period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      const currentGain = change > 0 ? change : 0;
      const currentLoss = change < 0 ? Math.abs(change) : 0;
      
      avgGain = ((avgGain * (period - 1)) + currentGain) / period;
      avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
      
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
    
    return rsi;
  }
}