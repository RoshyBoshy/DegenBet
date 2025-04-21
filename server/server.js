// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws"); // Import the ws library
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// --- Configuration ---
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// List of assets your frontend cares about (use Binance symbols, typically uppercase BASEQUOTE, e.g., BTCUSDT)
// Match these with the symbols used in your frontend (ID_TO_SYMBOL_MAP)
const WATCHED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "XRPUSDT",
  "DOTUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "MATICUSDT",
];
// Mapping Binance symbols (e.g., BTCUSDT) back to your frontend's desired display symbols (e.g., BTC)
const BINANCE_TO_FRONTEND_MAP = {
  BTCUSDT: "BTC",
  ETHUSDT: "ETH",
  SOLUSDT: "SOL",
  ADAUSDT: "ADA",
  DOGEUSDT: "DOGE",
  XRPUSDT: "XRP",
  DOTUSDT: "DOT",
  AVAXUSDT: "AVAX",
  LINKUSDT: "LINK",
  MATICUSDT: "MATIC",
  // Add more if needed
};

// Store the latest known data for each symbol
let latestDataStore = {};

// --- Middleware ---
app.use(cors());

// --- Socket.IO Setup (for broadcasting to frontend) ---
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Frontend user connected:", socket.id);

  // Send the currently stored latest data to the newly connected client
  if (Object.keys(latestDataStore).length > 0) {
    socket.emit("priceUpdate", latestDataStore);
    console.log("Sent initial data to:", socket.id);
  }

  socket.on("disconnect", () => {
    console.log("Frontend user disconnected:", socket.id);
  });
});

// --- Binance WebSocket Connection ---
function connectToBinance() {
  // Construct the stream URL for combined mini-tickers
  const streams = WATCHED_SYMBOLS.map(
    (s) => `${s.toLowerCase()}@miniTicker`
  ).join("/");
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
  // Alternative port: const wsUrl = `wss://stream.binance.com:443/stream?streams=${streams}`;

  console.log(`Attempting to connect to Binance WebSocket: ${wsUrl}`);
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log("Connected to Binance WebSocket stream.");
    // Reset latest data on fresh connection? Optional.
    // latestDataStore = {};
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Combined streams have a 'stream' and 'data' property
      if (message.stream && message.data) {
        const eventData = message.data;
        // Check if it's a miniTicker event (based on event type 'e')
        if (eventData.e === "24hrMiniTicker") {
          const binanceSymbol = eventData.s; // e.g., BTCUSDT
          const frontendSymbol = BINANCE_TO_FRONTEND_MAP[binanceSymbol]; // e.g., BTC

          if (frontendSymbol) {
            const currentPrice = parseFloat(eventData.c); // Last price
            const priceChangePercent = parseFloat(eventData.P); // Price change percent

            // Format data for frontend
            const formattedUpdate = {
              [frontendSymbol]: {
                // Format price (adjust precision as needed)
                price: `$${currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: currentPrice > 1 ? 2 : 5,
                })}`,
                changePercent: priceChangePercent, // Keep as number for potential frontend logic
              },
            };

            // Update the stored data
            latestDataStore = { ...latestDataStore, ...formattedUpdate };

            // Broadcast the specific update via Socket.IO to all frontend clients
            io.emit("priceUpdate", formattedUpdate);
            // console.log(`Emitted update for ${frontendSymbol}:`, formattedUpdate);
          }
        }
      }
    } catch (error) {
      console.error("Error processing Binance message:", error);
      console.error("Received data:", data.toString());
    }
  });

  ws.on("ping", () => {
    // Binance sends pings, respond with pong to keep connection alive
    // console.log('Received ping from Binance, sending pong.');
    ws.pong();
  });

  ws.on("error", (error) => {
    console.error("Binance WebSocket error:", error);
    // Connection will likely close, reconnect logic handles it
  });

  ws.on("close", (code, reason) => {
    console.log(
      `Binance WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`
    );
    console.log("Attempting to reconnect in 5 seconds...");
    // Implement a simple reconnect delay
    setTimeout(connectToBinance, 5000);
  });
}

// --- Start the Binance Connection ---
connectToBinance();

// --- Basic Express Route (Optional) ---
app.get("/", (req, res) => {
  res.send("Crypto Price Server with Binance WS is running!");
});

// --- Start HTTP Server (which includes Socket.IO) ---
server.listen(PORT, () => {
  console.log(`Backend server listening on *:${PORT}`);
  console.log(`Allowing frontend connections from: ${FRONTEND_URL}`);
});
