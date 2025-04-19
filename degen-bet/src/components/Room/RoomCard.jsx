import React, { useState, useEffect, useRef } from "react";

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
    <canvas ref={canvasRef} width="210" height="50" className="w-full h-12" />
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
    <div className="bg-secondary rounded-lg overflow-hidden w-full h-full flex flex-col border border-accent/20">
      {/* Header with asset info */}
      <div className="bg-primary p-3 border-b border-accent/20 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold text-lg text-white">{room.asset}</span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-accent/20 rounded-full text-gray-300">
            {room.type}
          </span>
        </div>
        <div
          className={`font-medium text-sm ${
            isFlashing ? "text-negative animate-pulse" : "text-gray-300"
          }`}
        >
          {timeLeft || room.deadline}
        </div>
      </div>

      {/* Current price */}
      <div className="px-3 py-2 bg-primary/50 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400">Current Price</div>
          <div className="text-md font-semibold text-white">
            {room.currentPrice}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs mr-2 text-gray-400">Users:</span>
          <span className="flex items-center text-white text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 text-accent"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>
            {room.userCount}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Prediction and chart */}
        <div>
          <div className="mb-2">
            <div className="text-xs text-gray-400">Prediction Target</div>
            <div className="text-md font-bold text-white">
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
          <div className="mb-3 mt-2">
            <PriceChart asset={room.asset} trend={getTrendFromTarget()} />
          </div>

          {/* Pool distribution visualization */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1 text-gray-400">
              <span>YES: {room.yesPercentage}%</span>
              <span>Pool: {room.totalPool} DEGEN</span>
              <span>NO: {room.noPercentage}%</span>
            </div>
            <div className="h-2 bg-primary rounded-full overflow-hidden">
              <div
                className="h-full bg-positive"
                style={{ width: `${room.yesPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Betting interface */}
        {!showBetForm ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-2 rounded-lg font-bold bg-positive hover:bg-positive/90 text-white transition-colors"
              onClick={() => handleOptionSelect("UP")}
            >
              BET UP
            </button>
            <button
              className="py-2 rounded-lg font-bold bg-negative hover:bg-negative/90 text-white transition-colors"
              onClick={() => handleOptionSelect("DOWN")}
            >
              BET DOWN
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount"
                className="bg-primary text-white rounded-l-lg py-2 px-3 w-full focus:outline-none border border-accent/30 focus:border-accent"
              />
              <span className="bg-primary border border-l-0 border-accent/30 rounded-r-lg py-2 px-3 text-gray-300">
                DEGEN
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowBetForm(false)}
                className="py-2 rounded-lg font-bold bg-primary text-white border border-accent/30"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBet}
                disabled={!betAmount}
                className={`py-2 rounded-lg font-bold ${
                  betAmount
                    ? "bg-accent hover:bg-accent/80 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
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
