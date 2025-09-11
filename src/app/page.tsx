"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, BarChart3, Activity, TrendingUp, TrendingDown } from 'lucide-react';

import { CandlestickChart } from '@/components/CandlestickChart';
import { StockSearch } from '@/components/StockSearch';
import { Watchlist } from '@/components/Watchlist';
import { MarketOverview } from '@/components/MarketOverview';
import { useMarketData } from '@/contexts/MarketDataContext';
import { formatIndianCurrency, formatIndianNumber, TIMEFRAMES } from '@/lib/stock-data';

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  
  const { 
    selectedStock, 
    candlestickData, 
    isLoading, 
    refreshData, 
    marketIndices,
    stocks 
  } = useMarketData();

  // Get top gainers and losers
  const topGainers = [...stocks]
    .filter(s => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
    
  const topLosers = [...stocks]
    .filter(s => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">NMDC Stock Analyzer</h1>
                  <p className="text-sm text-muted-foreground">
                    Indian Stock Market • Real-time Analysis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stock Search */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Search Stocks</h2>
              <StockSearch />
            </div>

            {/* Watchlist */}
            <Watchlist showTitle={true} />

            {/* Top Movers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Movers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Top Gainers */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h3 className="font-medium text-sm">Top Gainers</h3>
                  </div>
                  <div className="space-y-2">
                    {topGainers.map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-green-600 font-medium">
                          +{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Top Losers */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <h3 className="font-medium text-sm">Top Losers</h3>
                  </div>
                  <div className="space-y-2">
                    {topLosers.map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-red-600 font-medium">
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Market Overview</TabsTrigger>
                <TabsTrigger value="chart">Chart Analysis</TabsTrigger>
                <TabsTrigger value="data">Market Data</TabsTrigger>
              </TabsList>

              {/* Market Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <MarketOverview />
              </TabsContent>

              {/* Chart Analysis Tab */}
              <TabsContent value="chart" className="space-y-6">
                {selectedStock ? (
                  <>
                    {/* Stock Header */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                              <Badge variant="outline">{selectedStock.sector}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {selectedStock.name}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold mb-1">
                              {formatIndianCurrency(selectedStock.price)}
                            </div>
                            <div className={`flex items-center gap-2 ${
                              selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {selectedStock.changePercent >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="font-semibold">
                                {selectedStock.changePercent >= 0 ? '+' : ''}
                                {formatIndianCurrency(Math.abs(selectedStock.change))}
                                ({selectedStock.changePercent >= 0 ? '+' : ''}
                                {selectedStock.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                          <div>
                            <p className="text-sm text-muted-foreground">High</p>
                            <p className="font-semibold">{formatIndianCurrency(selectedStock.high)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Low</p>
                            <p className="font-semibold">{formatIndianCurrency(selectedStock.low)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Volume</p>
                            <p className="font-semibold">{formatIndianNumber(selectedStock.volume)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Market Cap</p>
                            <p className="font-semibold">{formatIndianNumber(selectedStock.marketCap)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chart Controls */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          {/* Timeframe Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Timeframe:</span>
                            <div className="flex items-center gap-1">
                              {TIMEFRAMES.map((tf) => (
                                <Button
                                  key={tf.value}
                                  size="sm"
                                  variant={selectedTimeframe === tf.value ? "default" : "outline"}
                                  onClick={() => setSelectedTimeframe(tf.value)}
                                  className="h-7 px-2 text-xs"
                                >
                                  {tf.label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Chart Options */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={showVolume ? "default" : "outline"}
                              onClick={() => setShowVolume(!showVolume)}
                              className="h-7 px-3 text-xs"
                            >
                              Volume
                            </Button>
                            <Button
                              size="sm"
                              variant={showMA ? "default" : "outline"}
                              onClick={() => setShowMA(!showMA)}
                              className="h-7 px-3 text-xs"
                            >
                              MA Lines
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Candlestick Chart */}
                    <CandlestickChart
                      data={candlestickData}
                      height={500}
                      showVolume={showVolume}
                      showMA={showMA}
                      title={`${selectedStock.symbol} - ${selectedTimeframe.toUpperCase()} Chart`}
                    />
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">No Stock Selected</h3>
                      <p className="text-muted-foreground mb-4">
                        Search and select a stock to view its chart analysis
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Market Data Tab */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Indices Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {marketIndices.map((index) => (
                        <div key={index.name} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{index.name}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Current Value:</span>
                              <span className="font-medium">
                                {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Change:</span>
                              <span className={`font-medium ${
                                index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {index.changePercent >= 0 ? '+' : ''}
                                {index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}
                                {index.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>High:</span>
                              <span className="font-medium">{index.high.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Low:</span>
                              <span className="font-medium">{index.low.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}