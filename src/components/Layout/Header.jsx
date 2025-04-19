import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";

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

  const tickerRef = useRef(null);
  const [tickerWidth, setTickerWidth] = useState(0);

  // Create a separate price updater that doesn't affect the animation
  const [priceUpdateTrigger, setPriceUpdateTrigger] = useState(0);

  // Measure the actual width of a single set of ticker items
  useEffect(() => {
    const measureWidth = () => {
      if (tickerRef.current) {
        const firstTickerItems =
          tickerRef.current.querySelector(".ticker-items");
        if (firstTickerItems) {
          setTickerWidth(firstTickerItems.offsetWidth);
        }
      }
    };

    // Initial measurement after render
    setTimeout(measureWidth, 100);

    // Re-measure on window resize
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, []);

  // Simulate price updates without affecting the animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceUpdateTrigger((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update prices when the trigger changes
  useEffect(() => {
    if (priceUpdateTrigger > 0) {
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
    }
  }, [priceUpdateTrigger]);

  // Animation duration calculation (constant speed regardless of screen size)
  const animationDuration = tickerWidth > 0 ? tickerWidth / 80 : 30; // Pixels per second

  const renderTickerItems = () => {
    return cryptoPrices.map((crypto, index) => {
      const isLastItem = index === cryptoPrices.length - 1;
      return (
        <div
          key={index}
          className={isLastItem ? styles.lastCryptoItem : styles.cryptoItem}
          style={{ width: "auto", minWidth: "160px" }}
        >
          <span className={styles.symbolText}>{crypto.symbol}</span>
          <span className={styles.priceText}>{crypto.price}</span>
          <span
            className={`${styles.changeText} ${
              crypto.change.startsWith("+")
                ? styles.positiveChange
                : styles.negativeChange
            }`}
          >
            {crypto.change}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={styles.headerContainer}>
      <div ref={tickerRef} className={styles.tickerContainer}>
        {tickerWidth > 0 && (
          <style>
            {`
              @keyframes ticker {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-${tickerWidth}px);
                }
              }
            `}
          </style>
        )}
        <div
          className={styles.tickerWrapper}
          style={{
            animation:
              tickerWidth > 0
                ? `ticker ${animationDuration}s linear infinite`
                : "none",
          }}
        >
          {/* First set of items */}
          <div className={`ticker-items ${styles.tickerItems}`}>
            {renderTickerItems()}
          </div>

          {/* Duplicate set for seamless looping */}
          <div className={`ticker-items ${styles.tickerItems}`}>
            {renderTickerItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
