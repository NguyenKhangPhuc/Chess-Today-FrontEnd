# ChessToday 

**ChessToday** is an online chess platform that allows players to compete in real-time, solve puzzles, and play against an AI engine with move explanations.

**Developer:** Phuc Nguyen  
**Project Duration:** August 2025 – January 2026  
**Deployment:** Vercel (Frontend)

---

## Overview

ChessToday is a real-time online chess application where users can:

- Find and play online matches with other players
- Play different time controls:
  - **Rapid**
  - **Blitz**
  - **Rocket**
- Maintain **separate Elo ratings** for each time mode
- Solve built-in chess puzzles
- View match history and detailed game records
- Add friends and communicate via **real-time messaging**
- Send and receive **challenge invitations**
- Play against **Stockfish AI** *(available in local development only)*
- Get **AI move explanations** *(available in local development only)*

The project focuses not only on gameplay, but also on building a scalable real-time system with clean architecture and maintainable code.

---

## Key Features

- Real-time multiplayer chess
- Matchmaking system
- Elo rating system per game mode
- Game history & move tracking
- Friend system & real-time chat
- Puzzle system
- AI opponent (Stockfish integration, local development)
- Move explanation (local development)

---

## Tech Stack

### Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query**
- **Axios**
- **react-chessboard**
- **chess.js**
- **Material UI**
- **Socket.IO Client (real-time communication)**

### Deployment
- **Vercel**

> This repository contains **frontend only**.  
> The application requires a **separate backend service** to function correctly.

---

## Project Structure

The project follows a **feature-based and domain-driven structure**, designed to keep game logic, realtime communication, and UI concerns clearly separated.

src/
├── challenge/[challengeId]        # Handle incoming and outgoing game challenges
├── chess/
│   ├── learn-with-AI/[id]          # Play against Stockfish with AI move explanations (OpenAI)
│   └── pvp/[id]                    # Real-time PvP chess matches
├── components/                     # Shared and reusable UI components
├── constants/                      # Global constants (e.g. time settings, enums)
├── contexts/                       # Global React contexts (Challenge, Navbar, Notifications)
├── friends/                        # Social features: friends list, friend requests
├── game-management/                # Main hub for selecting game modes
├── helpers/
│   └── chess-general/              # Shared chess logic used by both AI and PvP modes
├── history/[id]                    # Detailed view of a completed chess game
├── hooks/                          # Custom hooks (queries, mutations, socket listeners)
├── libs/                           # API client and Socket.IO client initialization
├── login/                          # Authentication: login, signup, forgot password
├── messages/                       # Real-time messaging between friends
├── profiles/                       # User profiles, Elo ratings, game history
├── provider/                       # Application-level providers (TanStack Query)
└── puzzles/                        # Chess puzzles and puzzle-solving logic

## ⚙️ Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Backend service running (required for full functionality)

### Installation

```bash
git clone <repository-url>
cd chess-today
npm install
npm run dev
```

## Known Issues & Incomplete Goals

### 1. AI Mode (Stockfish + Move Explanation)
This mode works only in local development. Production deployment is challenging due to process management and communication with the Stockfish engine. A Docker + AWS setup is considered for future implementation.

### 2. Real-Time Clock
The game clock can sometimes lag by 1–2 seconds between players due to unexpected user interactions or network delays. Clock synchronization needs further optimization.

### 3. Middleware in Production
Some middleware behaves inconsistently on first requests in production, normalizing only after a page reload.