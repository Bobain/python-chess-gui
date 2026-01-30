# Chess Mobile App

A cross-platform mobile chess application for iOS and Android, built with React Native and Expo.

## Features

- **Play against AI** - Challenge the built-in chess AI at various difficulty levels
- **Choose your color** - Play as White or Black
- **5 Difficulty levels** - From Beginner (1350 ELO) to Master (3000 ELO)
- **Visual feedback** - Legal move indicators, last move highlights, check warnings
- **Undo moves** - Take back your last move pair (yours and AI's)
- **Hint system** - Get move suggestions when you're stuck
- **Position evaluation** - Real-time evaluation bar showing who's winning
- **Responsive design** - Works on all screen sizes

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/chess-mobile-app.git
cd chess-mobile-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on devices

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web (preview)
npm run web
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development toolchain and runtime
- **chess.js** - Chess logic and move validation
- **expo-router** - File-based routing
- **TypeScript** - Type-safe JavaScript

## Project Structure

```
chess-mobile-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Main entry point
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ChessBoard.tsx
│   │   ├── EvaluationBar.tsx
│   │   ├── GameStatus.tsx
│   │   └── ControlBar.tsx
│   ├── screens/           # Full-screen views
│   │   ├── SettingsMenu.tsx
│   │   └── GameScreen.tsx
│   ├── context/           # React context providers
│   │   └── GameContext.tsx
│   ├── utils/             # Utility functions
│   │   └── chessEngine.ts
│   └── constants/         # App constants
│       └── theme.ts
├── assets/                # Images and fonts
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Game Controls

| Action | Description |
|--------|-------------|
| Tap piece | Select a piece to see legal moves |
| Tap destination | Move the selected piece |
| Undo | Take back your last move and AI's response |
| Hint | Get a suggested move |
| Restart | Start a new game with same settings |
| Menu | Return to settings menu |

## AI Engine

The app includes a built-in chess AI using minimax algorithm with alpha-beta pruning:

- **Depth-based search** - Higher difficulty = deeper search
- **Position evaluation** - Material and positional scoring
- **Piece-square tables** - Encourages good piece placement

Difficulty levels:
1. Beginner (~1350 ELO) - Depth 1
2. Intermediate (~1800 ELO) - Depth 2
3. Advanced (~2200 ELO) - Depth 3
4. Expert (~2600 ELO) - Depth 4
5. Master (~3000 ELO) - Depth 5

## License

MIT License - feel free to use this code for your own projects.

## Credits

Inspired by [python-chess-gui](https://github.com/yourusername/python-chess-gui)
