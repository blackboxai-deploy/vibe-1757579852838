import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MarketDataProvider } from "@/contexts/MarketDataContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NMDC Indian Stock Market Analysis",
  description: "Real-time Indian stock market analysis with candlestick charts and technical indicators",
  keywords: "Indian stocks, NSE, BSE, candlestick charts, technical analysis, real-time trading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MarketDataProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <Toaster />
          </MarketDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}