import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";

// Accept assetData as a prop
const Header = ({ assetData }) => {
  // ***** REMOVED: Internal cryptoPrices state and simulation logic *****
  // const [cryptoPrices, setCryptoPrices] = useState([...]);
  // const [priceUpdateTrigger, setPriceUpdateTrigger] = useState(0);
  // useEffect(() => { /* simulation logic */ }, []);
  // useEffect(() => { /* update logic */ }, [priceUpdateTrigger]);

  // State to hold formatted prices derived from props
  const [displayPrices, setDisplayPrices] = useState([]);

  // Format data from props when it changes
  useEffect(() => {
    const formatted = Object.entries(assetData).map(([symbol, data]) => ({
      symbol: symbol,
      // Ensure price and change properties exist, provide fallbacks
      price: data?.price ? String(data.price) : "N/A",
      change: data?.changePercent
        ? `${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(
            2
          )}%`
        : "N/A", // Example formatting
    }));
    setDisplayPrices(formatted);
  }, [assetData]); // Re-run when assetData prop changes

  // Ticker width calculation logic (keep as is)
  const tickerRef = useRef(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  useEffect(() => {
    const measureWidth = () => {
      if (tickerRef.current) {
        const firstTickerItems = tickerRef.current.querySelector(
          `.${styles.tickerItems}`
        ); // Use CSS module class
        if (firstTickerItems) setTickerWidth(firstTickerItems.offsetWidth);
      }
    };
    setTimeout(measureWidth, 100); // Allow rendering first
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, [displayPrices]); // Recalculate width if items change

  // Animation duration calculation (keep as is)
  const animationDuration = tickerWidth > 0 ? tickerWidth / 80 : 30;

  const renderTickerItems = () => {
    // Render using displayPrices state derived from props
    if (displayPrices.length === 0) {
      return <div className={styles.cryptoItem}>Loading prices...</div>; // Show loading state
    }

    return displayPrices.map((crypto, index) => {
      const isLastItem = index === displayPrices.length - 1;
      // Determine class based on change value (handle 'N/A')
      let changeClass = "";
      if (crypto.change !== "N/A") {
        changeClass = crypto.change.startsWith("+")
          ? styles.positiveChange
          : styles.negativeChange;
      }

      return (
        <div
          key={crypto.symbol || index} // Use symbol as key
          className={isLastItem ? styles.lastCryptoItem : styles.cryptoItem}
          style={{ width: "auto", minWidth: "160px" }}
        >
          <span className={styles.symbolText}>{crypto.symbol}</span>
          <span className={styles.priceText}>{crypto.price}</span>
          <span className={`${styles.changeText} ${changeClass}`}>
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
          <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-${tickerWidth}px); } }`}</style>
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
          {/* Render ticker items (will duplicate for seamless loop) */}
          <div className={styles.tickerItems}>{renderTickerItems()}</div>
          <div className={styles.tickerItems} aria-hidden="true">
            {renderTickerItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
