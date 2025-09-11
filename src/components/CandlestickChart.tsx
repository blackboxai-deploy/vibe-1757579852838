"use client";

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
  Cell,
} from 'recharts';
import { CandlestickData } from '@/lib/stock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: string | number;
  height?: number;
  showVolume?: boolean;
  showMA?: boolean;
  title?: string;
}

// Custom Candlestick component for Recharts
const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  
  // Colors
  const bullishColor = '#22c55e'; // green-500
  const bearishColor = '#ef4444'; // red-500
  const isGreen = close >= open;
  const color = isGreen ? bullishColor : bearishColor;
  
  // Calculate positions
  const bodyHeight = Math.abs(close - open);
  const bodyTop = Math.max(close, open);
  const wickWidth = 2;
  const bodyWidth = Math.max(width * 0.6, 1);
  const centerX = x + width / 2;
  
  return (
    <g>
      {/* High-Low wick */}
      <line
        x1={centerX}
        y1={y + (100 - high)}
        x2={centerX}
        y2={y + (100 - low)}
        stroke={color}
        strokeWidth={wickWidth}
      />
      
      {/* Open-Close body */}
      <rect
        x={centerX - bodyWidth / 2}
        y={y + (100 - bodyTop)}
        width={bodyWidth}
        height={bodyHeight || 1}
        fill={isGreen ? 'transparent' : color}
        stroke={color}
        strokeWidth={isGreen ? 2 : 0}
      />
    </g>
  );
};

// Format time for tooltip
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format price
const formatPrice = (price: number) => {
  return `₹${price.toFixed(2)}`;
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const { open, high, low, close, volume } = data;
  const change = close - open;
  const changePercent = ((change / open) * 100);
  const isPositive = change >= 0;
  
  return (
    <div className="bg-background/95 border rounded-lg shadow-lg p-3 min-w-[200px]">
      <p className="font-medium text-sm mb-2">{formatTime(label)}</p>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-medium">{formatPrice(open)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">High:</span>
          <span className="font-medium">{formatPrice(high)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Low:</span>
          <span className="font-medium">{formatPrice(low)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Close:</span>
          <span className="font-medium">{formatPrice(close)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Change:</span>
          <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {formatPrice(Math.abs(change))} ({changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Volume:</span>
          <span className="font-medium">{volume.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = '100%',
  height = 400,
  showVolume = true,
  showMA = true,
  title = 'Price Chart',
}) => {
  // Calculate moving averages
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((candle, index) => {
      let sma20 = null;
      let sma50 = null;
      
      if (showMA) {
        // Calculate SMA 20
        if (index >= 19) {
          const sum20 = data.slice(index - 19, index + 1).reduce((sum, c) => sum + c.close, 0);
          sma20 = sum20 / 20;
        }
        
        // Calculate SMA 50
        if (index >= 49) {
          const sum50 = data.slice(index - 49, index + 1).reduce((sum, c) => sum + c.close, 0);
          sma50 = sum50 / 50;
        }
      }
      
      return {
        ...candle,
        sma20,
        sma50,
        time: formatTime(candle.time),
        // Normalize price data for custom candlestick rendering
        normalizedHigh: ((candle.high - Math.min(...data.map(d => d.low))) / 
                        (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * 100,
        normalizedLow: ((candle.low - Math.min(...data.map(d => d.low))) / 
                       (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * 100,
        normalizedOpen: ((candle.open - Math.min(...data.map(d => d.low))) / 
                        (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * 100,
        normalizedClose: ((candle.close - Math.min(...data.map(d => d.low))) / 
                         (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * 100,
      };
    });
  }, [data, showMA]);
  
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main price chart */}
          <ResponsiveContainer width={width} height={height}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Moving averages */}
              {showMA && (
                <>
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dot={false}
                    connectNulls={false}
                    name="SMA 20"
                  />
                  <Line
                    type="monotone"
                    dataKey="sma50"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    dot={false}
                    connectNulls={false}
                    name="SMA 50"
                  />
                </>
              )}
              
              {/* Candlestick bars (simplified as colored bars) */}
              <Bar dataKey="close" fill="transparent">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.close >= entry.open ? '#22c55e' : '#ef4444'}
                    stroke={entry.close >= entry.open ? '#22c55e' : '#ef4444'}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
              
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Volume chart */}
          {showVolume && (
            <ResponsiveContainer width={width} height={120}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: any) => [value.toLocaleString('en-IN'), 'Volume']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Bar dataKey="volume" fill="#6b7280" opacity={0.6}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`volume-cell-${index}`}
                      fill={entry.close >= entry.open ? '#22c55e' : '#ef4444'}
                      opacity={0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};