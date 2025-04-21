import React, { useState, useEffect } from "react";
import RoomCard from "../Room/RoomCard";
import styles from "./CentralMenu.module.css";

// Accept assetData as a prop
const CentralMenu = ({ onPlaceBet, assetData }) => {
  // ***** REMOVED: Internal cryptoData state and price simulation useEffect *****
  // const [cryptoData, setCryptoData] = useState({...});
  // const [startPrices] = useState({...});
  // useEffect(() => { /* simulation logic */ }, [cryptoData]);

  // Mock betting rooms - This state might eventually come from the backend via Socket.IO too
  // For now, we update the currentPrice inside this mock data based on assetData prop
  const [rooms, setRooms] = useState([
    // Keep your initial room structures here
    {
      id: 1,
      asset: "BTC",
      type: "Price Target",
      target: "$65,000",
      deadline: "2h 30m",
      totalPool: 2500,
      yesPercentage: 65,
      userCount: 78,
      currentPrice: "$60,245.32",
      startPrice: "$59,875.00",
    },
    {
      id: 2,
      asset: "ETH",
      type: "Price Movement",
      target: "+5%",
      deadline: "1h 15m",
      totalPool: 1800,
      yesPercentage: 48,
      userCount: 42,
      currentPrice: "$3,120.67",
      startPrice: "$3,085.20",
    },
    {
      id: 3,
      asset: "SOL",
      type: "Price Target",
      target: "$150",
      deadline: "45m",
      totalPool: 1200,
      yesPercentage: 72,
      userCount: 31,
      currentPrice: "$142.21",
      startPrice: "$138.75",
    },
    {
      id: 4,
      asset: "DOGE",
      type: "Price Movement",
      target: "-3%",
      deadline: "1h",
      totalPool: 950,
      yesPercentage: 40,
      userCount: 28,
      currentPrice: "$0.12",
      startPrice: "$0.118",
    },
    {
      id: 5,
      asset: "ADA",
      type: "Price Target",
      target: "$0.65",
      deadline: "3h 15m",
      totalPool: 1450,
      yesPercentage: 53,
      userCount: 36,
      currentPrice: "$0.58",
      startPrice: "$0.61",
    },
    {
      id: 6,
      asset: "XRP",
      type: "Price Movement",
      target: "+10%",
      deadline: "4h",
      totalPool: 2100,
      yesPercentage: 75,
      userCount: 54,
      currentPrice: "$0.51",
      startPrice: "$0.52",
    },
    {
      id: 7,
      asset: "DOT",
      type: "Price Target",
      target: "$7.50",
      deadline: "1h 45m",
      totalPool: 870,
      yesPercentage: 42,
      userCount: 21,
      currentPrice: "$6.87",
      startPrice: "$6.65",
    },
    {
      id: 8,
      asset: "LINK",
      type: "Price Movement",
      target: "-2%",
      deadline: "30m",
      totalPool: 750,
      yesPercentage: 37,
      userCount: 19,
      currentPrice: "$14.92",
      startPrice: "$14.50",
    },
    {
      id: 9,
      asset: "AVAX",
      type: "Price Target",
      target: "$35.50",
      deadline: "3h 45m",
      totalPool: 1650,
      yesPercentage: 59,
      userCount: 41,
      currentPrice: "$35.25",
      startPrice: "$33.80",
    },
    {
      id: 10,
      asset: "MATIC",
      type: "Price Movement",
      target: "+7%",
      deadline: "2h 10m",
      totalPool: 1250,
      yesPercentage: 62,
      userCount: 32,
      currentPrice: "$0.71",
      startPrice: "$0.73",
    },
  ]);

  // ***** NEW: Effect to update room prices from assetData prop *****
  useEffect(() => {
    // Only update if assetData has entries
    if (Object.keys(assetData).length > 0) {
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          // Check if we have real-time data for this room's asset
          const liveData = assetData[room.asset];
          if (liveData && liveData.price) {
            // Update the current price with the real-time one
            // Keep other room properties as they are (unless they also come from backend)
            return { ...room, currentPrice: String(liveData.price) };
          }
          // If no live data for this asset, return the room unchanged
          return room;
        });
      });
    }
  }, [assetData]); // Re-run when assetData prop changes

  // Format price helper (keep as is)
  // const formatPrice = (...) => { ... }; // Can remove if only used in simulation

  // Grid layout logic (keep as is)
  const cellSize = 450;
  const [gridPositions, setGridPositions] = useState([]);
  useEffect(() => {
    generateExpandingGrid();
  }, []);
  const generateExpandingGrid = () => {
    const positions = [{ x: 0, y: 0 }];
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];
    directions.forEach((dir) => positions.push({ x: dir.x, y: dir.y }));
    positions.push(
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 }
    );
    positions.push({ x: 0, y: -2 }, { x: 2, y: 0 });
    setGridPositions(positions);
  };

  // handlePlaceBet (keep as is)
  const handlePlaceBet = (roomId, option, amount) => {
    console.log(`Bet placed in room ${roomId}: ${option} with ${amount} DEGEN`);
    if (onPlaceBet) onPlaceBet(roomId, option, amount);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {gridPositions.map((gridPos, index) => {
            const xPos = gridPos.x * cellSize;
            const yPos = gridPos.y * cellSize;
            const style = {
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              left: `calc(50% + ${xPos}px - ${cellSize / 2}px)`,
              top: `calc(50% + ${yPos}px - ${cellSize / 2}px)`,
            };

            if (index === 0) {
              // Central Menu (keep as is)
              return (
                <div
                  key="central-menu"
                  className={styles.menuCard}
                  style={style}
                >
                  {" "}
                  {/* ... menu content ... */}{" "}
                </div>
              );
            }

            // Room Cards - Pass the potentially updated room data
            const roomIndex = index - 1;
            if (roomIndex >= rooms.length) return null;
            const room = rooms[roomIndex]; // Get the latest room data from state

            return (
              <div
                key={`room-${room.id}`}
                className={styles.roomCard}
                style={style}
              >
                {/* RoomCard now receives updated currentPrice from the 'rooms' state */}
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
