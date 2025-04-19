import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";

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
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.headerTitle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.headerIcon}
          >
            <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" />
          </svg>
          Active Bets{" "}
          <span className={styles.betCount}>({activeBets?.length || 0})</span>
        </h3>
      </div>
      <div className={styles.betsContainer}>
        {activeBets && activeBets.length > 0 ? (
          activeBets.map((bet) => {
            const pl = calculatePL(bet, timeLeft[bet.id]);

            return (
              <div key={bet.id} className={styles.betCard}>
                <div className={styles.betHeader}>
                  <span className={styles.assetName}>
                    {bet.asset}
                    <span
                      className={`${styles.targetLabel} ${
                        bet.target.includes("+")
                          ? styles.upLabel
                          : styles.downLabel
                      }`}
                    >
                      {bet.target.includes("+") ? "↑ UP" : "↓ DOWN"}
                    </span>
                  </span>
                  <span
                    className={`${styles.timeRemaining} ${
                      timeLeft[bet.id] < 300 ? styles.expiringSoon : ""
                    }`}
                  >
                    {formatTime(timeLeft[bet.id])}
                  </span>
                </div>

                <div className={styles.targetInfo}>
                  <span className={styles.targetLabel}>Target:</span>
                  {bet.target}
                </div>

                <div className={styles.betDetails}>
                  <div>
                    <div className={styles.detailsLabel}>Amount</div>
                    <div className={styles.amountValue}>
                      {bet.amount}{" "}
                      <span className={styles.currencyLabel}>DEGEN</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={styles.detailsLabel}>Current P/L</div>
                    <div
                      className={
                        pl.isPositive
                          ? styles.profitLossPositive
                          : styles.profitLossNegative
                      }
                    >
                      {pl.isPositive ? "+" : "-"}
                      {pl.value}{" "}
                      <span style={{ fontSize: "0.75rem" }}>DEGEN</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={styles.progressBarContainer}>
                  <div
                    className={`${styles.progressBar} ${
                      pl.isPositive
                        ? styles.progressBarPositive
                        : styles.progressBarNegative
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
          <div className={styles.emptyState}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.emptyStateIcon}
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                clipRule="evenodd"
              />
            </svg>
            No active bets
            <div className={styles.emptyStateMessage}>
              Place your first prediction to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
