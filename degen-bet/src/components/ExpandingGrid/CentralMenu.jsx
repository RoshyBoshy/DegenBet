import React, { useState, useEffect } from "react";
import RoomCard from "../Room/RoomCard";
import styles from "./CentralMenu.module.css";

const CentralMenu = () => {
  // Mock cryptocurrency price data
  const [cryptoData, setCryptoData] = useState({
    BTC: { price: 60245.32, change: 2.5 },
    ETH: { price: 3120.67, change: 1.8 },
    SOL: { price: 142.21, change: 4.2 },
    ADA: { price: 0.58, change: -0.5 },
    DOGE: { price: 0.12, change: 0.8 },
    XRP: { price: 0.51, change: -1.2 },
    DOT: { price: 6.87, change: 3.1 },
    AVAX: { price: 35.25, change: 5.7 },
    LINK: { price: 14.92, change: 3.2 },
    MATIC: { price: 0.71, change: -1.4 },
  });

  // Mock betting rooms
  const [rooms, setRooms] = useState([
    {
      id: 1,
      asset: "BTC",
      type: "Price Target",
      target: "$65,000",
      deadline: "2h 30m",
      totalPool: 2500,
      yesPercentage: 65,
      noPercentage: 35,
      userCount: 78,
      currentPrice: "$60,245.32",
    },
    {
      id: 2,
      asset: "ETH",
      type: "Price Movement",
      target: "+5%",
      deadline: "1h 15m",
      totalPool: 1800,
      yesPercentage: 48,
      noPercentage: 52,
      userCount: 42,
      currentPrice: "$3,120.67",
    },
    {
      id: 3,
      asset: "SOL",
      type: "Price Target",
      target: "$150",
      deadline: "45m",
      totalPool: 1200,
      yesPercentage: 72,
      noPercentage: 28,
      userCount: 31,
      currentPrice: "$142.21",
    },
    {
      id: 4,
      asset: "DOGE",
      type: "Price Movement",
      target: "-3%",
      deadline: "1h",
      totalPool: 950,
      yesPercentage: 40,
      noPercentage: 60,
      userCount: 28,
      currentPrice: "$0.12",
    },
    {
      id: 5,
      asset: "ADA",
      type: "Price Target",
      target: "$0.65",
      deadline: "3h 15m",
      totalPool: 1450,
      yesPercentage: 53,
      noPercentage: 47,
      userCount: 36,
      currentPrice: "$0.58",
    },
    {
      id: 6,
      asset: "XRP",
      type: "Price Movement",
      target: "+10%",
      deadline: "4h",
      totalPool: 2100,
      yesPercentage: 75,
      noPercentage: 25,
      userCount: 54,
      currentPrice: "$0.51",
    },
    {
      id: 7,
      asset: "DOT",
      type: "Price Target",
      target: "$7.50",
      deadline: "1h 45m",
      totalPool: 870,
      yesPercentage: 42,
      noPercentage: 58,
      userCount: 21,
      currentPrice: "$6.87",
    },
    {
      id: 8,
      asset: "LINK",
      type: "Price Movement",
      target: "-2%",
      deadline: "30m",
      totalPool: 750,
      yesPercentage: 37,
      noPercentage: 63,
      userCount: 19,
      currentPrice: "$14.92",
    },
    {
      id: 9,
      asset: "AVAX",
      type: "Price Target",
      target: "$35.50",
      deadline: "3h 45m",
      totalPool: 1650,
      yesPercentage: 59,
      noPercentage: 41,
      userCount: 41,
      currentPrice: "$35.25",
    },
    {
      id: 10,
      asset: "MATIC",
      type: "Price Movement",
      target: "+7%",
      deadline: "2h 10m",
      totalPool: 1250,
      yesPercentage: 62,
      noPercentage: 38,
      userCount: 32,
      currentPrice: "$0.71",
    },
  ]);

  // Simulate price updates and update the rooms
  useEffect(() => {
    const interval = setInterval(() => {
      // Update crypto prices
      setCryptoData((prevData) => {
        const updatedData = { ...prevData };

        Object.keys(updatedData).forEach((symbol) => {
          // Random price change between -0.5% and +0.5%
          const changePercent = (Math.random() - 0.3) * 1;
          const newPrice =
            updatedData[symbol].price * (1 + changePercent / 100);

          // Update change percentage (weighted toward previous change for realistic movement)
          const currentChange = updatedData[symbol].change;
          const changeDirection = Math.random() > 0.4 ? 1 : -1;
          const newChange =
            currentChange + changeDirection * Math.random() * 0.3;

          updatedData[symbol] = {
            price: newPrice,
            change: newChange,
          };
        });

        return updatedData;
      });

      // Update room data with new prices
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (!cryptoData[room.asset]) return room;

          const price = cryptoData[room.asset].price;
          const formattedPrice =
            price < 1
              ? `$${price.toFixed(5)}`
              : `$${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;

          // Slightly adjust the pool percentages for a dynamic feel
          const yesChange = (Math.random() - 0.5) * 2;
          let newYesPercentage = Math.min(
            98,
            Math.max(2, room.yesPercentage + yesChange)
          );

          return {
            ...room,
            currentPrice: formattedPrice,
            yesPercentage: newYesPercentage,
            noPercentage: 100 - newYesPercentage,
            // Occasionally increase the user count
            userCount:
              Math.random() > 0.9 ? room.userCount + 1 : room.userCount,
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [cryptoData]);

  // Grid cell dimensions
  const cellSize = 250;

  // State to store grid positions of each panel
  const [gridPositions, setGridPositions] = useState([]);

  useEffect(() => {
    // Generate grid positions when component mounts
    generateExpandingGrid();
  }, []);

  const generateExpandingGrid = () => {
    // Start with the center menu position
    const positions = [{ x: 0, y: 0 }]; // Center menu

    // Define the four cardinal directions
    const directions = [
      { x: 0, y: -1 }, // top
      { x: 1, y: 0 }, // right
      { x: 0, y: 1 }, // bottom
      { x: -1, y: 0 }, // left
    ];

    // Add the first layer of 4 rooms (exactly touching the center menu)
    directions.forEach((dir) => {
      positions.push({ x: dir.x, y: dir.y });
    });

    // Add diagonal positions for the second layer
    positions.push({ x: 1, y: -1 }); // top-right
    positions.push({ x: 1, y: 1 }); // bottom-right
    positions.push({ x: -1, y: 1 }); // bottom-left
    positions.push({ x: -1, y: -1 }); // top-left

    // Add two more in cardinal directions (further out)
    positions.push({ x: 0, y: -2 }); // far top
    positions.push({ x: 2, y: 0 }); // far right

    setGridPositions(positions);
  };

  // Handle placing a bet
  const handlePlaceBet = (roomId, option, amount) => {
    console.log(`Bet placed in room ${roomId}: ${option} with ${amount} DEGEN`);
    // In a real app, this would call an API to place the bet
    // and update the room state accordingly
  };

  return (
    <div>
      {/* Grid with rooms */}
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {/* Rooms positioned around the center menu */}
          {gridPositions.map((gridPos, index) => {
            // Convert grid coordinates to actual position
            const xPos = gridPos.x * cellSize;
            const yPos = gridPos.y * cellSize;

            // Center position is reserved for the menu
            if (index === 0) {
              return (
                <div
                  key="central-menu"
                  className={styles.menuCard}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    left: `calc(50% + ${xPos}px - ${cellSize / 2}px)`,
                    top: `calc(50% + ${yPos}px - ${cellSize / 2}px)`,
                  }}
                >
                  <div className={styles.menuCardContent}>
                    <div className={styles.menuHeader}>
                      <h2 className={styles.menuTitle}>DegenBet</h2>
                      <div className={styles.menuSubtitle}>
                        <span className={styles.liveIndicator}></span>
                        Crypto Predictions
                      </div>
                    </div>

                    <div className={styles.buttonContainer}>
                      <button className={styles.primaryButton}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={styles.buttonIcon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Host Room
                      </button>

                      <button className={styles.secondaryButton}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={styles.buttonIcon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Buy Coin
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // All other positions are for room cards
            // index - 1 to account for the center menu being at index 0
            const roomIndex = index - 1;

            // Skip if we don't have enough rooms
            if (roomIndex >= rooms.length) return null;

            const room = rooms[roomIndex];

            return (
              <div
                key={`room-${room.id}`}
                className={styles.roomCard}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  left: `calc(50% + ${xPos}px - ${cellSize / 2}px)`,
                  top: `calc(50% + ${yPos}px - ${cellSize / 2}px)`,
                }}
              >
                <RoomCard room={room} onPlaceBet={handlePlaceBet} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CentralMenu;
