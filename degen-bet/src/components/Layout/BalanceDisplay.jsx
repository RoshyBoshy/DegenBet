import React, { useState, useEffect } from "react";

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
    <div className="fixed top-18 left-4 bg-secondary p-4 rounded-lg border border-accent shadow-xl z-10 transition-all duration-300 hover:shadow-accent/20">
      <div className="text-sm text-gray-300 uppercase tracking-wider font-medium">
        Your Balance
      </div>
      <div
        className={`text-2xl font-bold ${
          isFlashing ? "text-positive animate-pulse" : "text-white"
        } transition-colors duration-300`}
      >
        {typeof animatedBalance === "number"
          ? animatedBalance.toLocaleString()
          : animatedBalance}
        <span className="text-sm ml-1 text-accent">DEGEN</span>
      </div>
      <div className="text-xs text-gray-400 mt-2 italic">
        Virtual Currency Only
      </div>
    </div>
  );
};

export default BalanceDisplay;
