import React, { useEffect, useState } from "react";

const Header = () => {
  // Mock cryptocurrency price data
  const [cryptoPrices, setCryptoPrices] = useState([
    { symbol: "BTC", price: "$60,245.32", change: "+2.5%" },
    { symbol: "ETH", price: "$3,120.67", change: "+1.8%" },
    { symbol: "SOL", price: "$142.21", change: "+4.2%" },
    { symbol: "ADA", price: "$0.58", change: "-0.5%" },
    { symbol: "DOGE", price: "$0.12", change: "+0.8%" },
    { symbol: "XRP", price: "$0.51", change: "-1.2%" },
    { symbol: "DOT", price: "$6.87", change: "+3.1%" },
    { symbol: "AVAX", price: "$35.25", change: "+5.7%" },
    { symbol: "LINK", price: "$14.92", change: "+3.2%" },
    { symbol: "MATIC", price: "$0.71", change: "-1.4%" },
    { symbol: "UNI", price: "$5.83", change: "+0.7%" },
    { symbol: "SHIB", price: "$0.00002134", change: "+6.1%" },
  ]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices((prevPrices) => {
        return prevPrices.map((crypto) => {
          // Random price change between -0.5% and +0.5%
          const changePercent = (Math.random() - 0.3) * 1;
          const currentPrice = parseFloat(crypto.price.replace(/[$,]/g, ""));
          const newPrice = currentPrice * (1 + changePercent / 100);

          // Format the new price with proper decimals based on value
          let formattedPrice;
          if (newPrice < 0.0001) {
            formattedPrice = `$${newPrice.toFixed(8)}`;
          } else if (newPrice < 1) {
            formattedPrice = `$${newPrice.toFixed(5)}`;
          } else if (newPrice < 100) {
            formattedPrice = `$${newPrice.toFixed(2)}`;
          } else {
            formattedPrice = `$${newPrice.toFixed(2)}`;
          }

          // Get the current change and update it
          const currentChange = parseFloat(
            crypto.change.replace(/[+%]/g, "").replace("-", "")
          );
          const isPositive =
            crypto.change.startsWith("+") || Math.random() > 0.4;
          const newChange = `${isPositive ? "+" : "-"}${(
            Math.random() * 1.5 +
            currentChange * 0.8
          ).toFixed(1)}%`;

          return {
            ...crypto,
            price: formattedPrice,
            change: newChange,
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-14 bg-secondary fixed top-0 left-0 flex items-center overflow-hidden z-10 border-b border-accent/30">
      <div className="flex whitespace-nowrap animate-ticker">
        {/* Display each price three times to ensure continuous scrolling with no gaps */}
        {[...cryptoPrices, ...cryptoPrices, ...cryptoPrices].map(
          (crypto, index) => (
            <div
              key={index}
              className="flex items-center mx-2 px-3 py-1.5 border-r border-accent/20"
            >
              <span className="font-bold text-white">{crypto.symbol}</span>
              <span className="mx-2 text-gray-300">{crypto.price}</span>
              <span
                className={`${
                  crypto.change.startsWith("+")
                    ? "text-positive font-medium"
                    : "text-negative font-medium"
                }`}
              >
                {crypto.change}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Header;
