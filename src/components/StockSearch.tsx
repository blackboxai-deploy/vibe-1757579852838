"use client";

import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketData } from '@/contexts/MarketDataContext';
import { formatIndianCurrency } from '@/lib/stock-data';

interface StockSearchProps {
  onSelectStock?: (symbol: string) => void;
  className?: string;
}

export const StockSearch: React.FC<StockSearchProps> = ({ 
  onSelectStock, 
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { stocks, selectStock, addToWatchlist, watchlist } = useMarketData();

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks.slice(0, 8); // Show top 8 by default
    
    const query = searchQuery.toLowerCase();
    return stocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit results
  }, [stocks, searchQuery]);

  const handleSelectStock = (symbol: string) => {
    selectStock(symbol);
    onSelectStock?.(symbol);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleAddToWatchlist = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWatchlist(symbol);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks by symbol, name, or sector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {filteredStocks.length > 0 ? (
              <div className="py-2">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                    onClick={() => handleSelectStock(stock.symbol)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{stock.symbol}</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-1.5 py-0.5"
                        >
                          {stock.sector}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {stock.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          {formatIndianCurrency(stock.price)}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {stock.changePercent >= 0 ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {!watchlist.includes(stock.symbol) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleAddToWatchlist(stock.symbol, e)}
                          className="h-6 px-2 text-xs"
                        >
                          + Watch
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {searchQuery ? 'No stocks found matching your search.' : 'Start typing to search stocks...'}
              </div>
            )}

            {searchQuery && (
              <div className="p-2 border-t border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Showing {filteredStocks.length} of {stocks.length} stocks
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};