import React, { useState, useEffect, useRef } from "react";
import styles from "./RoomCard.module.css";

// Simplified price chart component
const PriceChart = ({ asset, trend }) => {
  const canvasRef = useRef(null);
  const isPositive = trend.startsWith("+");

  // Generate mock chart data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate random price points with a general trend
    const points = [];
    const steps = 24;
    const volatility = 0.2;
    const trendStrength = parseFloat(trend.replace(/[+\-%]/g, "")) / 100;

    let lastY = height / 2;

    for (let i = 0; i < steps; i++) {
      // Calculate x position
      const x = (i / (steps - 1)) * width;

      // Calculate price movement with randomness but following the trend
      const direction = isPositive ? -1 : 1; // Negative means up (lower y value)
      const trendComponent = (i / steps) * height * trendStrength * direction;
      const randomComponent = (Math.random() - 0.5) * height * volatility;

      // Update y position (bounded to stay within canvas)
      lastY = Math.max(
        5,
        Math.min(height - 5, lastY + randomComponent + trendComponent / steps)
      );
      points.push({ x, y: lastY });
    }

    // Draw path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => ctx.lineTo(point.x, point.y));

    // Style the line
    ctx.strokeStyle = isPositive ? "#4ade80" : "#f87171";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add gradient fill below the line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isPositive) {
      gradient.addColorStop(0, "rgba(74, 222, 128, 0.2)");
      gradient.addColorStop(1, "rgba(74, 222, 128, 0)");
    } else {
      gradient.addColorStop(0, "rgba(248, 113, 113, 0.2)");
      gradient.addColorStop(1, "rgba(248, 113, 113, 0)");
    }

    ctx.lineTo(points[points.length - 1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [asset, trend, isPositive]);

  return (
    <canvas
      ref={canvasRef}
      width="210"
      height="50"
      className={styles.priceChart}
    />
  );
};

const RoomCard = ({ room, onPlaceBet }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isFlashing, setIsFlashing] = useState(false);

  // Parse the deadline into seconds and update countdown
  useEffect(() => {
    if (!room.deadline) return;

    const match = room.deadline.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
    let seconds = 0;

    if (match) {
      const hours = parseInt(match[1] || match[3] || 0);
      const mins = parseInt(match[2] || match[4] || 0);
      seconds = hours * 60 * 60 + mins * 60;
    }

    // Update countdown every second
    const timer = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(timer);
        setTimeLeft("Expired");
      } else {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
          setTimeLeft(`${h}h ${m}m`);
        } else if (m > 0) {
          setTimeLeft(`${m}m ${s}s`);
        } else {
          setTimeLeft(`${s}s`);
        }

        // Flash the timer when less than 5 minutes remain
        if (seconds < 300) {
          setIsFlashing(true);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [room.deadline]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowBetForm(true);
  };

  // Handle bet submission
  const handleSubmitBet = () => {
    if (!betAmount || !selectedOption) return;

    // Call the onPlaceBet function from parent component
    if (onPlaceBet) {
      onPlaceBet(room.id, selectedOption, betAmount);
    }

    // Reset form
    setBetAmount("");
    setSelectedOption(null);
    setShowBetForm(false);
  };

  // Get trend indicator for chart
  const getTrendFromTarget = () => {
    if (room.target.startsWith("+") || room.target.startsWith("-")) {
      return room.target;
    }

    // For price targets, calculate whether it's up or down from current
    const targetPrice = parseFloat(room.target.replace(/[$,]/g, ""));
    const currentPrice = parseFloat(room.currentPrice.replace(/[$,]/g, ""));
    const percentDiff = ((targetPrice - currentPrice) / currentPrice) * 100;

    return percentDiff > 0
      ? `+${percentDiff.toFixed(1)}%`
      : `${percentDiff.toFixed(1)}%`;
  };

  return (
    <div className={styles.roomCard}>
      {/* Header with asset info */}
      <div className={styles.header}>
        <div className={styles.assetInfo}>
          <span className={styles.assetSymbol}>{room.asset}</span>
          <span className={styles.assetType}>{room.type}</span>
        </div>
        <div
          className={`${styles.timer} ${
            isFlashing ? styles.timerFlashing : ""
          }`}
        >
          {timeLeft || room.deadline}
        </div>
      </div>

      {/* Current price */}
      <div className={styles.priceInfo}>
        <div>
          <div className={styles.priceLabel}>Current Price</div>
          <div className={styles.priceValue}>{room.currentPrice}</div>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userLabel}>Users:</span>
          <span className={styles.userCount}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={styles.userIcon}
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>
            {room.userCount}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Prediction and chart */}
        <div>
          <div className={styles.predictionSection}>
            <div className={styles.predictionLabel}>Prediction Target</div>
            <div className={styles.predictionTarget}>
              {room.asset} will{" "}
              {room.target.startsWith("+")
                ? "rise"
                : room.target.startsWith("-")
                ? "fall"
                : "reach"}{" "}
              {room.target}
            </div>
          </div>

          {/* Simple price chart */}
          <div className={styles.chartContainer}>
            <PriceChart asset={room.asset} trend={getTrendFromTarget()} />
          </div>

          {/* Pool distribution visualization */}
          <div className={styles.poolStats}>
            <div className={styles.poolLabels}>
              <span>YES: {room.yesPercentage}%</span>
              <span>Pool: {room.totalPool} DEGEN</span>
              <span>NO: {room.noPercentage}%</span>
            </div>
            <div className={styles.poolBar}>
              <div
                className={styles.yesPercentage}
                style={{ width: `${room.yesPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Betting interface */}
        {!showBetForm ? (
          <div className={styles.betButtons}>
            <button
              className={styles.betUpButton}
              onClick={() => handleOptionSelect("UP")}
            >
              BET UP
            </button>
            <button
              className={styles.betDownButton}
              onClick={() => handleOptionSelect("DOWN")}
            >
              BET DOWN
            </button>
          </div>
        ) : (
          <div className={styles.betForm}>
            <div className={styles.inputGroup}>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount"
                className={styles.betInput}
              />
              <span className={styles.currencySuffix}>DEGEN</span>
            </div>

            <div className={styles.betButtons}>
              <button
                onClick={() => setShowBetForm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBet}
                disabled={!betAmount}
                className={
                  betAmount
                    ? styles.submitButton
                    : `${styles.submitButton} ${styles.disabledButton}`
                }
              >
                Place Bet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
