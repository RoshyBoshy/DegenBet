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
      width="250"
      height="40"
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

  // Round percentages to whole numbers
  const yesPercentage = Math.round(room.yesPercentage);
  const noPercentage = Math.round(room.noPercentage);

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

  // Format compact deadline display
  const formatDeadline = (deadline) => {
    if (!deadline) return "";

    // Convert "2h 30m" to "2:30"
    const match = deadline.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
    if (match) {
      const hours = parseInt(match[1] || match[3] || 0);
      const mins = parseInt(match[2] || match[4] || 0) || 0;
      return `${hours}:${mins < 10 ? "0" + mins : mins}`;
    }

    return deadline;
  };

  return (
    <div className={styles.roomCard}>
      {/* Header with asset info */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.assetSymbol}>{room.asset}</span>
          {room.type === "Price Movement" ? (
            <div className={styles.roomTypeIndicator}>
              <span className={styles.percentSymbol}>%</span>
            </div>
          ) : (
            <div className={styles.roomTypeIndicator}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.targetIcon}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" />
              </svg>
            </div>
          )}
        </div>
        <div className={styles.headerRight}>
          <div className={styles.poolInfo}>
            <span className={styles.poolValue}>{room.totalPool}</span>
            <span className={styles.poolLabel}>DEGEN</span>
          </div>
          <div
            className={`${styles.timer} ${
              isFlashing ? styles.timerFlashing : ""
            }`}
          >
            {timeLeft || formatDeadline(room.deadline)}
          </div>
        </div>
      </div>

      {/* Current price and user count */}
      <div className={styles.infoRow}>
        <div className={styles.priceInfo}>
          <div className={styles.priceLabel}>Price</div>
          <div className={styles.priceValue}>{room.currentPrice}</div>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userLabel}>Users</span>
          <span className={styles.userCount}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={styles.userIcon}
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            {room.userCount}
          </span>
        </div>
      </div>

      {/* Main content with chart and betting */}
      <div className={styles.mainContent}>
        {/* Chart visualization */}
        <div className={styles.chartContainer}>
          <PriceChart asset={room.asset} trend={getTrendFromTarget()} />
        </div>

        {/* Condensed criteria badge */}
        <div className={styles.criteriaBadge}>
          {room.target.startsWith("+") || room.target.startsWith("-")
            ? `${room.target} by ${timeLeft || formatDeadline(room.deadline)}`
            : `Target: ${room.target}`}
        </div>

        {/* Pool distribution visualization with percentages inside the meter */}
        <div className={styles.poolStats}>
          <div className={styles.poolBarContainer}>
            <div className={styles.poolBar}>
              <div
                className={styles.yesPercentage}
                style={{ width: `${yesPercentage}%` }}
              >
                {yesPercentage > 10 && (
                  <span className={styles.yesPercentLabel}>
                    {yesPercentage}%
                  </span>
                )}
              </div>
              {noPercentage > 10 && (
                <span
                  className={styles.noPercentLabel}
                  style={{
                    left: `${Math.min(
                      yesPercentage + 2,
                      100 - noPercentage / 2
                    )}%`,
                  }}
                >
                  {noPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Betting interface right below the meter */}
        {!showBetForm ? (
          <div className={styles.betButtons}>
            <button
              className={styles.betYesButton}
              onClick={() => handleOptionSelect("UP")}
            >
              YES
            </button>
            <button
              className={styles.betNoButton}
              onClick={() => handleOptionSelect("DOWN")}
            >
              NO
            </button>
          </div>
        ) : (
          <div className={styles.betForm}>
            <div className={styles.inputGroup}>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Amount"
                className={styles.betInput}
              />
              <button
                onClick={handleSubmitBet}
                disabled={!betAmount}
                className={
                  betAmount
                    ? styles.submitButton
                    : `${styles.submitButton} ${styles.disabledButton}`
                }
              >
                Bet
              </button>
              <button
                onClick={() => setShowBetForm(false)}
                className={styles.cancelButton}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
