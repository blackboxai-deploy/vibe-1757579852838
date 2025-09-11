"use client";

import React from 'react';
import { X, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMarketData } from '@/contexts/MarketDataContext';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/stock-data';

interface WatchlistProps {
  className?: string;
  showTitle?: boolean;
  maxHeight?: number;
}

export const Watchlist: React.FC<WatchlistProps> = ({
  className = "",
  showTitle = true,
  maxHeight = 400
}) => {
  const { stocks, watchlist, removeFromWatchlist, selectStock, selectedStock } = useMarketData();

  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  const handleSelectStock = (symbol: string) => {
    selectStock(symbol);
  };

  const handleRemoveStock = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(symbol);
  };

  if (watchlistStocks.length === 0) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Watchlist
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No stocks in watchlist</p>
            <p className="text-xs mt-1">Search and add stocks to track them</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Watchlist ({watchlistStocks.length})
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-0">
            {watchlistStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`
                  flex items-center justify-between p-3 border-b border-border/50 last:border-b-0
                  hover:bg-muted/50 cursor-pointer transition-all duration-200
                  ${selectedStock?.symbol === stock.symbol ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                `}
                onClick={() => handleSelectStock(stock.symbol)}
              >
                <div className="flex-1 min-w-0 pr-3">
                  {/* Stock Symbol and Sector */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{stock.symbol}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1.5 py-0.5"
                    >
                      {stock.sector}
                    </Badge>
                  </div>
                  
                  {/* Stock Name */}
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {stock.name}
                  </p>
                  
                  {/* Market Cap and Volume */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Cap: {formatIndianNumber(stock.marketCap)}</span>
                    <span>Vol: {formatIndianNumber(stock.volume)}</span>
                    {stock.pe && <span>PE: {stock.pe}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Price Information */}
                  <div className="text-right">
                    <div className="font-semibold text-sm mb-1">
                      {formatIndianCurrency(stock.price)}
                    </div>
                    
                    <div className={`flex items-center gap-1 text-xs mb-1 ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {stock.changePercent >= 0 ? '+' : ''}
                        {formatIndianCurrency(Math.abs(stock.change))}
                      </span>
                    </div>
                    
                    <div className={`text-xs ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleRemoveStock(stock.symbol, e)}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};