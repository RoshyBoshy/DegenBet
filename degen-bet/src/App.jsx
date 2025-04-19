import { useState, useEffect } from "react";
import "./App.css";

// Import our components
import Layout from "./components/Layout/Layout";
import ExpandingGrid from "./components/ExpandingGrid/ExpandingGrid";
import CentralMenu from "./components/ExpandingGrid/CentralMenu";
import BalanceDisplay from "./components/Layout/BalanceDisplay";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";

function App() {
  // Mock user data with balance fluctuation
  const [balance, setBalance] = useState(1000);

  // Mock active bets
  const [activeBets, setActiveBets] = useState([
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

  // Simulate random balance changes
  useEffect(() => {
    const balanceUpdater = setInterval(() => {
      // Random value between -10 and +15
      const change = Math.floor(Math.random() * 25) - 10;
      setBalance((prev) => Math.max(0, prev + change));
    }, 8000);

    return () => clearInterval(balanceUpdater);
  }, []);

  // Handle placing a bet
  const handlePlaceBet = (roomId, option, amount) => {
    // Convert string amount to number
    const betAmount = Number(amount);

    // Validate bet
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      alert("Invalid bet amount");
      return;
    }

    // Deduct from balance
    setBalance((prev) => prev - betAmount);

    // Add to active bets (simplified for demo)
    const newBet = {
      id: Date.now(),
      asset: roomId.substring(0, 3), // Just for demo
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
      {/* Fixed price ticker at top */}
      <Header />

      {/* User balance in top-left */}
      <BalanceDisplay balance={balance} />

      {/* Active bets sidebar on left */}
      <Sidebar activeBets={activeBets} />

      {/* Main content with expandable grid */}
      <div className="mt-16 ml-0 sm:ml-72 transition-all duration-300">
        <ExpandingGrid>
          <CentralMenu onPlaceBet={handlePlaceBet} />
        </ExpandingGrid>
      </div>
    </Layout>
  );
}

export default App;
