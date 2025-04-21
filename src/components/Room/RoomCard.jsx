import React, { useState, useEffect } from "react";
import styles from "./RoomCard.module.css"; // Use CSS Modules

// Helper function to get full asset name (can be expanded)
const getAssetName = (symbol) => {
  const names = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    ADA: "Cardano",
    DOGE: "Dogecoin",
    XRP: "XRP",
    DOT: "Polkadot",
    AVAX: "Avalanche",
    LINK: "Chainlink",
    MATIC: "Polygon",
  };
  return names[symbol] || symbol;
};

const RoomCard = ({ room, onPlaceBet }) => {
  // Use props directly instead of mock data
  const roomData = room;

  // State for hover effects (optional, handled by CSS :hover now)
  // const [isHovered, setIsHovered] = useState(false);

  // State for time left and progress (keep existing logic)
  const [timeLeft, setTimeLeft] = useState("");
  const [progressPercent, setProgressPercent] = useState(0); // Keep for potential use if needed later

  // Timer and Progress Update Effect (keep existing logic)
  useEffect(() => {
    if (!roomData.deadline) return;
    let timerInterval;
    const match = roomData.deadline.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
    let totalSecondsDuration = 0;
    if (match) {
      const hours = parseInt(match[1] || match[3] || 0);
      const mins = parseInt(match[2] || match[4] || 0);
      totalSecondsDuration = hours * 60 * 60 + mins * 60;
    }
    if (totalSecondsDuration <= 0) {
      setTimeLeft("Invalid");
      setProgressPercent(100);
      return;
    }
    const estimatedStartTime = Date.now() - totalSecondsDuration * 0.2 * 1000;
    const estimatedEndTime = estimatedStartTime + totalSecondsDuration * 1000;

    const updateTimerAndProgress = () => {
      const now = Date.now();
      const end = estimatedEndTime;
      const start = estimatedStartTime;
      const totalDuration = end - start;
      if (totalDuration <= 0) {
        setTimeLeft("Ended");
        setProgressPercent(100);
        clearInterval(timerInterval);
        return;
      }
      const remainingSeconds = Math.max(0, Math.floor((end - now) / 1000));
      const elapsed = Math.max(0, now - start);
      if (remainingSeconds <= 0) {
        setTimeLeft("Ended");
        setProgressPercent(100);
        clearInterval(timerInterval);
      } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const mins = Math.floor((remainingSeconds % 3600) / 60);
        const secs = remainingSeconds % 60;
        if (hours > 0) setTimeLeft(`${hours}h ${mins}m`);
        else setTimeLeft(`${mins}m ${secs}s`);
        const percent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgressPercent(percent);
      }
    };
    updateTimerAndProgress();
    timerInterval = setInterval(updateTimerAndProgress, 1000);
    return () => clearInterval(timerInterval);
  }, [roomData.deadline]);

  // Calculate price difference (using existing logic structure but applying to roomData)
  const calculatePriceDiff = () => {
    const startValue = parseFloat(
      String(roomData.startPrice || "0").replace(/[$,]/g, "")
    );
    const currentValue = parseFloat(
      String(roomData.currentPrice || "0").replace(/[$,]/g, "")
    );
    if (isNaN(startValue) || isNaN(currentValue))
      return { isIncreasing: false, percent: "N/A" };
    const isIncreasing = currentValue >= startValue;
    let percentDiff = 0;
    if (startValue !== 0)
      percentDiff = ((currentValue - startValue) / startValue) * 100;
    else if (currentValue > 0) percentDiff = Infinity;
    const formattedPercent = isFinite(percentDiff)
      ? percentDiff.toFixed(2)
      : "∞";
    return { isIncreasing, percent: formattedPercent };
  };
  const priceDiff = calculatePriceDiff();

  // Format the target criteria string
  const formatTargetCriteria = () => {
    const currentDeadline = timeLeft || roomData.deadline || "N/A";
    if (roomData.type === "Price Target")
      return `Price above ${roomData.target || "N/A"} in ${currentDeadline}`;
    if (roomData.type === "Price Movement") {
      const direction = roomData.target?.startsWith("+") ? "up" : "down";
      return `Move ${
        roomData.target || "N/A"
      } ${direction} in ${currentDeadline}`;
    }
    return roomData.target || "N/A";
  };

  // --- BETTING LOGIC (Keep existing) ---
  const [betAmount, setBetAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowBetForm(true);
  };
  const handleSubmitBet = () => {
    if (!betAmount || !selectedOption) return;
    if (onPlaceBet) onPlaceBet(roomData.id, selectedOption, betAmount); // Use roomData.id
    setBetAmount("");
    setSelectedOption(null);
    setShowBetForm(false);
  };
  // --- END BETTING LOGIC ---

  // Ensure percentages are numbers for styling
  const yesPercentageNum = Math.round(Number(roomData.yesPercentage) || 0);
  const noPercentageNum = 100 - yesPercentageNum;

  return (
    // Use styles from CSS Module
    <div className={styles.cardContainer}>
      {/* Asset and Type Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Ticker Box */}
          <div className={styles.tickerBox}>
            <span className={styles.tickerText}>{roomData.asset}</span>
          </div>
          {/* Asset Name & Type */}
          <div className={styles.assetInfo}>
            <span className={styles.assetName}>
              {getAssetName(roomData.asset)}
            </span>
            <div className={styles.targetTypeContainer}>
              <div className={styles.targetTypePulse}></div>
              <span className={styles.targetTypeText}>
                {roomData.type === "Price Target"
                  ? "Price Target"
                  : "Price Movement"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {/* Pool Box */}
          <div className={styles.poolBox}>
            <svg
              className={styles.headerIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.5 3C8.81 3 5 5.83 5 9.5c0 3.63 3.33 6.43 8 6.94v1.56H9.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3.5v1.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V20h3.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H15v-1.56c4.67-.51 8-3.31 8-6.94 0-3.67-3.81-6.5-8.5-6.5h-1M13 5h1c3.07 0 5.5 1.89 5.5 4.5 0 2.55-2.28 4.42-5.25 4.5h-1.5c-2.97-.08-5.25-1.95-5.25-4.5C7.5 6.89 9.93 5 13 5z" />
            </svg>
            <span className={styles.headerBoxText}>
              {roomData.totalPool?.toLocaleString() || "N/A"}
            </span>
          </div>
          {/* Time Box */}
          <div className={styles.timeBox}>
            <svg
              className={styles.headerIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span className={styles.headerBoxText}>
              {timeLeft || roomData.deadline || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* Chart Section */}
        <div className={styles.chartContainer}>
          {/* Grid lines for chart */}
          <div className={styles.chartGridBackground}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={styles.chartGridLine}></div>
            ))}
          </div>
          {/* SVG Chart - Using snippet's curve path */}
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className={styles.chartSvg}
          >
            <defs>
              <linearGradient
                id={`chartGradient-${roomData.id}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
                <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
              </linearGradient>
            </defs>
            {/* Snippet's curve path */}
            <path
              d="M0,20 Q10,18 20,15 T40,10 T60,12 T80,8 T100,5"
              className={styles.chartLinePath}
            />
            {/* Snippet's gradient fill */}
            <path
              d="M0,20 Q10,18 20,15 T40,10 T60,12 T80,8 T100,5 V30 H0 Z"
              fill={`url(#chartGradient-${roomData.id})`}
            />
          </svg>
        </div>

        {/* Price Info Cards */}
        <div className={styles.priceInfoGrid}>
          <div className={styles.priceInfoCard}>
            <div className={styles.priceInfoLabel}>Starting Price</div>
            <div className={styles.priceInfoValueMono}>
              {String(roomData.startPrice || "N/A")}
            </div>
          </div>
          <div className={styles.priceInfoCard}>
            <div className={styles.priceInfoLabel}>Current Price</div>
            <div className={styles.currentPriceRow}>
              <div className={styles.priceInfoValueMono}>
                {String(roomData.currentPrice || "N/A")}
              </div>
              {priceDiff.percent !== "N/A" && (
                <div
                  className={`${styles.priceDiffBadge} ${
                    priceDiff.isIncreasing
                      ? styles.priceDiffUp
                      : styles.priceDiffDown
                  }`}
                >
                  {priceDiff.isIncreasing ? "+" : ""}
                  {priceDiff.percent}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Target info */}
        <div className={styles.targetInfoBox}>
          <svg
            className={styles.targetInfoIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            <path d="M12 17L6.94 9.27 9.13 8 12 12.47 14.87 8l2.19 1.27z" />
          </svg>
          <span className={styles.targetInfoText}>
            {formatTargetCriteria()}
          </span>
        </div>

        {/* Users and Pool Info */}
        <div className={styles.usersPoolInfoArea}>
          <div className={styles.userCountBox}>
            <svg
              className={styles.headerIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className={styles.userCountText}>
              {roomData.userCount || 0} Users
            </span>
          </div>
          <div className={styles.poolDistributionLabel}>Pool Distribution</div>
        </div>

        {/* Pool distribution bar */}
        <div className={styles.poolBarContainer}>
          <div className={styles.poolBarInner}>
            {/* YES segment */}
            <div
              className={styles.poolBarYes}
              style={{ width: `${yesPercentageNum}%` }}
            >
              {yesPercentageNum > 10 && (
                <span className={styles.poolBarLabelYes}>
                  YES {yesPercentageNum}%
                </span>
              )}
            </div>
            {/* NO segment (implicitly takes remaining space, text positioned absolutely or flexed) */}
            <div className={styles.poolBarNo}>
              {noPercentageNum > 10 && (
                <span className={styles.poolBarLabelNo}>
                  NO {noPercentageNum}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Betting buttons */}
        {/* Betting Interface - Reuse existing logic */}
        {!showBetForm ? (
          <div className={styles.betButtonsGrid}>
            {/* Use button styles derived from snippet */}
            <button
              className={styles.betButtonYes}
              onClick={() => handleOptionSelect("UP")}
            >
              YES
            </button>
            <button
              className={styles.betButtonNo}
              onClick={() => handleOptionSelect("DOWN")}
            >
              NO
            </button>
          </div>
        ) : (
          <div className={styles.betForm}>
            {" "}
            {/* Keep existing form structure */}
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
