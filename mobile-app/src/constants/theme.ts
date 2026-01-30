export const COLORS = {
  // Background colors
  background: '#272522',
  surface: '#312e2b',
  surfaceLight: '#3d3a36',

  // Board colors
  lightSquare: '#f0d9b5',
  darkSquare: '#b58863',

  // Highlight colors
  selectedSquare: '#829769',
  lastMoveHighlight: '#cdd26a',
  legalMoveIndicator: '#646f40',
  captureIndicator: '#dc5f4c',
  checkHighlight: '#e74c3c',
  hintHighlight: '#5dade2',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  textMuted: '#707070',

  // UI colors
  buttonPrimary: '#769656',
  buttonSecondary: '#4a4a4a',
  buttonDisabled: '#333333',
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#f39c12',

  // Evaluation bar
  evalWhite: '#ffffff',
  evalBlack: '#1a1a1a',
};

export const DIFFICULTY_LEVELS = [
  { level: 1, elo: 1350, name: 'Beginner' },
  { level: 2, elo: 1800, name: 'Intermediate' },
  { level: 3, elo: 2200, name: 'Advanced' },
  { level: 4, elo: 2600, name: 'Expert' },
  { level: 5, elo: 3000, name: 'Master' },
];

export const PIECE_UNICODE: Record<string, string> = {
  'K': '\u2654', // White King
  'Q': '\u2655', // White Queen
  'R': '\u2656', // White Rook
  'B': '\u2657', // White Bishop
  'N': '\u2658', // White Knight
  'P': '\u2659', // White Pawn
  'k': '\u265A', // Black King
  'q': '\u265B', // Black Queen
  'r': '\u265C', // Black Rook
  'b': '\u265D', // Black Bishop
  'n': '\u265E', // Black Knight
  'p': '\u265F', // Black Pawn
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
