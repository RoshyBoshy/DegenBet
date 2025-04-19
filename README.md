# DegenBet - Crypto Prediction Platform

DegenBet is a web-based platform that allows users to participate in cryptocurrency price predictions using a pool-based betting system with virtual currency. The application features an expanding grid layout with a central menu hub surrounded by dynamic prediction rooms.

## 🚀 Features

- **Pool-Based Betting System**: Similar to Twitch predictions, where users place bets into a shared pool
- **Multiple Prediction Types**: Support for both price target predictions and price movement predictions
- **Real-time Updates**: Dynamic price feeds and odds adjustments
- **Expanding Grid UI**: Intuitive navigation with a central menu that allows exploration in all directions
- **Active Bets Tracking**: Sidebar that displays all your active predictions with countdowns and P/L estimates

## 📋 Room Types

1. **Price Target Rooms**: Predict if a cryptocurrency will reach a specific price by the deadline
2. **Price Movement Rooms**: Predict if a cryptocurrency will move up or down by a certain percentage

## 🔧 Technology Stack

- **Frontend**: React.js with Vite for faster development
- **Styling**: Tailwind CSS + CSS Modules for component-scoped styling
- **Charting**: Recharts for data visualization
- **Real-time Communication**: Socket.io for live updates

## 🏗️ Project Structure

```
degen-bet/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and icons
│   ├── components/       # React components
│   │   ├── ExpandingGrid/  # Grid navigation system
│   │   ├── Layout/         # App layout components
│   │   └── Room/           # Prediction room components
│   ├── styles/           # Global styles and variables
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global CSS
├── package.json          # Project dependencies
└── vite.config.js        # Vite configuration
```

## 🚧 Development Status

This project is currently in development. Features and UI are being actively built out.

## 🔮 Upcoming Features

- User account system with persistent balance
- Room creation functionality for users to host their own prediction rooms
- Leaderboards and achievement system
- More advanced prediction types and options
- Mobile-responsive design improvements

## 📝 Important Note

DegenBet uses **virtual currency only**. No real cryptocurrency or money is involved in the platform.

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser to the URL shown in the console

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.
