import React, { useState, useEffect } from "react";

const Sidebar = ({ activeBets }) => {
  // State to track the animated countdown
  const [timeLeft, setTimeLeft] = useState({});

  // Update countdown timers every second
  useEffect(() => {
    if (!activeBets || activeBets.length === 0) return;

    // Initialize countdown times based on expiry string (e.g., "2h 15m")
    const initialTimes = {};
    activeBets.forEach((bet) => {
      const match = bet.expiry.match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
      let minutes = 0;

      if (match) {
        const hours = parseInt(match[1] || match[3] || 0);
        const mins = parseInt(match[2] || match[4] || 0);
        minutes = hours * 60 + mins;
      }
      initialTimes[bet.id] = minutes * 60; // convert to seconds
    });

    setTimeLeft(initialTimes);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };
        let needsUpdate = false;

        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) {
            updated[id] -= 1;
            needsUpdate = true;
          }
        });

        return needsUpdate ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBets]);

  // Format seconds into a readable time string
  const formatTime = (seconds) => {
    if (seconds <= 0) return "Expired";

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Calculate a mock P/L based on time elapsed
  const calculatePL = (bet, seconds) => {
    if (!seconds) return { value: 0, isPositive: false };

    const initialSeconds = bet.expiry.includes("h")
      ? parseInt(bet.expiry.match(/(\d+)/)[0]) * 60 * 60
      : parseInt(bet.expiry.match(/(\d+)/)[0]) * 60;

    const progress = 1 - seconds / initialSeconds;
    const randomFactor = bet.id % 2 === 0 ? 1 : -1; // Some bets go up, some down
    const volatility = Math.sin(progress * Math.PI) * randomFactor;
    const plValue = bet.amount * volatility * 0.5;

    return {
      value: Math.abs(plValue).toFixed(1),
      isPositive: plValue >= 0,
    };
  };

  return (
    <div className="fixed top-18 left-4 w-72 bg-secondary rounded-lg border border-accent/30 shadow-xl z-10 mt-16 max-h-[calc(100vh-140px)] overflow-y-auto">
      <div className="p-3 border-b border-accent/20 sticky top-0 bg-secondary">
        <h3 className="font-bold text-lg tracking-wide flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mr-2 text-accent"
          >
            <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" />
          </svg>
          Active Bets{" "}
          <span className="ml-2 text-sm text-gray-400">
            ({activeBets?.length || 0})
          </span>
        </h3>
      </div>
      <div className="p-2">
        {activeBets && activeBets.length > 0 ? (
          activeBets.map((bet) => {
            const pl = calculatePL(bet, timeLeft[bet.id]);

            return (
              <div
                key={bet.id}
                className="mb-3 p-3 bg-primary rounded-lg border border-accent/20 hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center">
                    {bet.asset}
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        bet.target.includes("+")
                          ? "bg-positive/20 text-positive"
                          : "bg-negative/20 text-negative"
                      }`}
                    >
                      {bet.target.includes("+") ? "↑ UP" : "↓ DOWN"}
                    </span>
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      timeLeft[bet.id] < 300
                        ? "text-negative animate-pulse"
                        : "text-gray-300"
                    }`}
                  >
                    {formatTime(timeLeft[bet.id])}
                  </span>
                </div>

                <div className="mt-2 font-medium text-white flex items-center">
                  <span className="text-xs text-gray-400 mr-1">Target:</span>
                  {bet.target}
                </div>

                <div className="flex justify-between mt-3 items-end">
                  <div>
                    <div className="text-xs text-gray-400">Amount</div>
                    <div className="font-medium text-white">
                      {bet.amount}{" "}
                      <span className="text-xs text-accent">DEGEN</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Current P/L</div>
                    <div
                      className={`font-medium ${
                        pl.isPositive ? "text-positive" : "text-negative"
                      }`}
                    >
                      {pl.isPositive ? "+" : "-"}
                      {pl.value} <span className="text-xs">DEGEN</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-accent/10 rounded-full h-1.5">
                  <div
                    className={`h-full rounded-full ${
                      pl.isPositive ? "bg-positive" : "bg-negative"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (1 - timeLeft[bet.id] / (60 * 60 * 3)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-gray-400 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 mx-auto mb-3 text-gray-600"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                clipRule="evenodd"
              />
            </svg>
            No active bets
            <div className="mt-2 text-sm">
              Place your first prediction to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
