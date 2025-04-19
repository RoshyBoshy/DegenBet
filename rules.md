# Crypto Prediction Platform Development Rules

## Project Overview

This project is a web-based platform where users can create and participate in prediction rooms for cryptocurrency price movements. The platform uses a pool-based betting system with virtual currency only (no real money). The UI features an expanding grid of rooms with a central menu.

## Core Features

### Room System

- Rooms are created by users (hosts) who set parameters and earn a % fee
- Two main room types:
  1. Price Target (Will X asset hit Y price by Z time?)
  2. Price Movement (Will X asset move Y% in any direction within Z time?)
- Pool-based betting with dynamic odds based on participant activity
- Automated resolution using cryptocurrency price APIs

### User Interface

- Expanding grid layout growing outward from central menu
- Room cards showing asset, prediction terms, current pool distribution, and betting controls
- Price ticker banner at top of screen
- User balance in top-left corner
- Active bets sidebar showing countdown timers and potential P/L

## Technical Guidelines

### Frontend

- React.js with TypeScript
- Tailwind CSS for styling
- Recharts for price visualization
- Socket.io for real-time updates

### Backend

- Node.js with Express
- PostgreSQL database
- Real-time price data from public APIs (CoinGecko/CryptoCompare)

## Development Priorities

1. Core room mechanics and betting system
2. Basic UI with expanding grid
3. Price feeds and automated resolution
4. User accounts and balance tracking
5. Host functionality and room creation

## Implementation Rules

### General Development Rules

- Keep the virtual currency aspect clear throughout the UI
- Focus on clean, modular code with clear component separation
- Prioritize responsive design that works on all screen sizes
- Document all functions and components thoroughly
- Break complex features into manageable chunks

### Frontend Development Rules

- Use functional components with hooks
- Create reusable UI components for room cards, buttons, etc.
- Implement proper loading states and error handling
- Ensure real-time updates for odds, timers, and prices
- Maintain a consistent design language throughout

### Backend Development Rules

- Create RESTful API endpoints with clear naming
- Implement proper validation for all inputs
- Use environment variables for configuration
- Ensure database schemas support all required features
- Build with scalability in mind

### Data Management Rules

- Store all betting history and room data persistently
- Implement efficient caching for price data
- Use WebSockets for real-time updates
- Ensure data consistency across the platform

## Feature Scope Limitations

- No real cryptocurrency or money integration
- No user-to-user transfers initially
- No complex trading features (limit orders, etc.)
- Focus on core betting functionality first before adding social features

## Testing Guidelines

- Write unit tests for all critical functions
- Test room resolution logic thoroughly
- Validate all UI states across different screen sizes
- Test with simulated high traffic for performance

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ExpandingGrid/    # Grid layout components
│   ├── Room/             # Room card components
│   ├── Betting/          # Betting interface components
│   └── Layout/           # Page layout components
├── hooks/                # Custom React hooks
├── services/             # API services and data fetching
├── context/              # React context for global state
├── utils/                # Helper functions and utilities
├── pages/                # Page components
└── types/                # TypeScript type definitions
```

## Context Instructions for Claude

When responding to development questions:

1. Prioritize the pool-based betting system implementation
2. Focus on creating the expanding grid UI as described
3. Suggest straightforward solutions that a solo developer can implement
4. Remember this is for a virtual currency system only
5. Provide complete code snippets with explanations
6. Consider both technical implementation and user experience
7. Stay within the defined technical stack
8. Break complex problems into smaller, manageable tasks
9. Don't introduce new betting mechanisms without explicit direction
10. Keep the room hosting and participation flow as specified in the documentation

## Development Milestones

1. Basic UI with central menu and room grid
2. Room creation and parameter setting
3. Betting mechanism and pool calculations
4. Price feed integration and automated resolution
5. User accounts and balance tracking
6. Host analytics and room management
7. Social features and platform growth mechanisms

## Reference Implementation Details

Remember that our pool-based betting system works like Twitch predictions:

- Bets go into a combined pool
- Winners split proportionally to their bet size
- Odds update dynamically as bets are placed
- Host receives a fixed percentage fee regardless of outcome
- System automatically resolves based on price feed data at deadline
