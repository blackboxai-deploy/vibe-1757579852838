"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketData } from '@/contexts/MarketDataContext';
import { formatIndianCurrency, formatIndianNumber, isMarketOpen } from '@/lib/stock-data';

interface MarketOverviewProps {
  className?: string;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ className = "" }) => {
  const { marketIndices, stocks } = useMarketData();
  
  const marketStatus = isMarketOpen() ? "OPEN" : "CLOSED";
  
  // Calculate market statistics
  const totalAdvances = stocks.filter(s => s.changePercent > 0).length;
  const totalDeclines = stocks.filter(s => s.changePercent < 0).length;
  const totalUnchanged = stocks.filter(s => s.changePercent === 0).length;
  
  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Market Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Indian Stock Market
            </CardTitle>
            <Badge 
              variant={marketStatus === "OPEN" ? "default" : "secondary"}
              className={`font-semibold ${
                marketStatus === "OPEN" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {marketStatus}
            </Badge>
          </div>
          {marketStatus === "OPEN" && (
            <p className="text-sm text-muted-foreground">
              Live market data • Updates every few seconds
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketIndices.map((index) => (
          <Card key={index.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {index.name}
                </h3>
                {index.changePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
                
                <div className={`flex items-center gap-2 text-sm ${
                  index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="font-medium">
                    {index.changePercent >= 0 ? '+' : ''}
                    {index.change.toFixed(2)}
                  </span>
                  <span>
                    ({index.changePercent >= 0 ? '+' : ''}
                    {index.changePercent.toFixed(2)}%)
                  </span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>H: {index.high.toFixed(2)}</span>
                  <span>L: {index.low.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Breadth */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Advances
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {totalAdvances}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Declines
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {totalDeclines}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unchanged
                </p>
                <p className="text-2xl font-bold">
                  {totalUnchanged}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Change
                </p>
                <p className={`text-2xl font-bold ${
                  avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {avgChange >= 0 ? '+' : ''}
                  {avgChange.toFixed(2)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="font-semibold">{formatIndianNumber(totalVolume)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">A/D Ratio</p>
              <p className="font-semibold">
                {totalDeclines > 0 ? (totalAdvances / totalDeclines).toFixed(2) : '∞'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="font-semibold">
                {formatIndianNumber(stocks.reduce((sum, s) => sum + s.marketCap, 0))}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Stocks</p>
              <p className="font-semibold">{stocks.filter(s => s.isActive).length}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Market Sentiment:</span>
              <Badge 
                variant={avgChange >= 0 ? "default" : "destructive"}
                className={avgChange >= 0 ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {avgChange >= 0.5 ? "Bullish" : avgChange <= -0.5 ? "Bearish" : "Neutral"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};