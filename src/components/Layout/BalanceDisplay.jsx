import React, { useState, useEffect } from "react";
import styles from "./BalanceDisplay.module.css";

const BalanceDisplay = ({ balance }) => {
  const [animatedBalance, setAnimatedBalance] = useState(balance);
  const [isFlashing, setIsFlashing] = useState(false);

  // Animate balance changes
  useEffect(() => {
    if (balance !== animatedBalance) {
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setAnimatedBalance(balance);
        setTimeout(() => setIsFlashing(false), 300);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [balance, animatedBalance]);

  return (
    <div className={styles.balanceContainer}>
      <div className={styles.balanceLabel}>Your Balance</div>
      <div
        className={`${styles.balanceValue} ${
          isFlashing ? styles.flashing : ""
        }`}
      >
        {typeof animatedBalance === "number"
          ? animatedBalance.toLocaleString()
          : animatedBalance}
        <span className={styles.currencySymbol}>DEGEN</span>
      </div>
      <div className={styles.disclaimer}>Virtual Currency Only</div>
    </div>
  );
};

export default BalanceDisplay;
