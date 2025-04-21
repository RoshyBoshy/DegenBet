import { useState, useEffect } from "react";
import io from "socket.io-client"; // Import socket.io client
import "./App.css";

// Import our components
import Layout from "./components/Layout/Layout";
import ExpandingGrid from "./components/ExpandingGrid/ExpandingGrid";
import CentralMenu from "./components/ExpandingGrid/CentralMenu";
import BalanceDisplay from "./components/Layout/BalanceDisplay";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";

// Define your backend server URL (replace with your actual backend URL when built)
const SOCKET_SERVER_URL = "http://localhost:3001"; // Example URL

function App() {
  // Mock user data (balance, bets - keep as is for now)
  const [balance, setBalance] = useState(1000);
  const [activeBets, setActiveBets] = useState([
    // Keep existing mock bets for demo
    {
      id: 1,
      asset: "BTC",
      type: "Price Target",
      target: "$60,000",
      expiry: "2h 15m",
      amount: 100,
      potentialWin: 280,
    },
    {
      id: 2,
      asset: "ETH",
      type: "Price Movement",
      target: "+5%",
      expiry: "45m",
      amount: 50,
      potentialWin: 95,
    },
    {
      id: 3,
      asset: "SOL",
      type: "Price Target",
      target: "$150",
      expiry: "3h 30m",
      amount: 75,
      potentialWin: 185,
    },
  ]);

  // ***** NEW: State to hold real-time asset data *****
  const [realtimeAssetData, setRealtimeAssetData] = useState({}); // e.g., { BTC: { price: '...', changePercent: '...' }, ETH: { ... } }

  // Simulate random balance changes (keep for demo)
  useEffect(() => {
    const balanceUpdater = setInterval(() => {
      const change = Math.floor(Math.random() * 25) - 10;
      setBalance((prev) => Math.max(0, prev + change));
    }, 8000);
    return () => clearInterval(balanceUpdater);
  }, []);

  // ***** NEW: Effect for Socket.IO connection *****
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(SOCKET_SERVER_URL);

    console.log("Attempting to connect to Socket.IO server...");

    // Listener for successful connection
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
      // You might want to request initial data or subscribe to specific assets here
      // socket.emit('requestInitialData');
    });

    // Listener for price updates from the server
    socket.on("priceUpdate", (data) => {
      // Assuming data is an object like: { BTC: { price: '...', changePercent: '...' }, ETH: { ... } }
      // console.log("Received price update:", data);
      setRealtimeAssetData((prevData) => ({ ...prevData, ...data }));
    });

    // Listener for general updates (e.g., room data if backend handles it)
    socket.on("roomUpdate", (updatedRoomData) => {
      // console.log("Received room update:", updatedRoomData);
      // Here you would update the 'rooms' state if rooms data comes from backend
      // setRooms(prevRooms => /* logic to update rooms */);
    });

    // Listener for connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    // Listener for disconnection
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.IO server:", reason);
    });

    // Cleanup on component unmount
    return () => {
      console.log("Disconnecting Socket.IO...");
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle placing a bet (keep existing logic)
  const handlePlaceBet = (roomId, option, amount) => {
    const betAmount = Number(amount);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      alert("Invalid bet amount");
      return;
    }
    setBalance((prev) => prev - betAmount);
    const newBet = {
      id: Date.now(),
      asset: String(roomId).substring(0, 3),
      type: "Price Movement",
      target: option === "UP" ? "+5%" : "-5%",
      expiry: "1h 30m",
      amount: betAmount,
      potentialWin: Math.floor(betAmount * 1.9),
    };
    setActiveBets((prev) => [...prev, newBet]);
  };

  return (
    <Layout>
      {/* Pass real-time data to Header */}
      <Header assetData={realtimeAssetData} />

      <BalanceDisplay balance={balance} />
      <Sidebar activeBets={activeBets} />

      {/* Main content */}
      {/* ml-0 sm:ml-72 might need adjustment based on actual sidebar width */}
      <div className="main-content-area">
        {" "}
        {/* Added a class for potential styling */}
        <ExpandingGrid>
          {/* Pass real-time data down to CentralMenu */}
          <CentralMenu
            onPlaceBet={handlePlaceBet}
            assetData={realtimeAssetData}
          />
        </ExpandingGrid>
      </div>
    </Layout>
  );
}

export default App;

// Add some basic CSS for layout adjustment if needed in App.css or index.css
// .main-content-area {
//   margin-top: 3.5rem; /* Height of Header */
//   margin-left: 0; /* Adjust based on sidebar */
//   transition: margin-left 0.3s ease;
// }
// @media (min-width: 640px) { /* sm breakpoint */
//   .main-content-area {
//     margin-left: 18rem; /* Width of Sidebar */
//   }
// }
