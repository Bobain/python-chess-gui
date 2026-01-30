import { Chess, Move, Square, PieceSymbol, Color } from 'chess.js';

export interface GameState {
  fen: string;
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  lastMove: { from: Square; to: Square } | null;
}

export interface EvaluationResult {
  score: number; // In centipawns, positive = white advantage
  isMate: boolean;
  mateIn: number | null;
}

// Simple chess AI using minimax with alpha-beta pruning
// For a more powerful AI, we'd integrate Stockfish.js via web worker

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables for positional evaluation
const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const KNIGHT_TABLE = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const BISHOP_TABLE = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
];

const ROOK_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, 10, 10, 10, 10, 5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  0, 0, 0, 5, 5, 0, 0, 0,
];

const QUEEN_TABLE = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
];

const KING_MIDDLE_TABLE = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20,
];

const PIECE_TABLES: Record<PieceSymbol, number[]> = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_MIDDLE_TABLE,
};

function squareToIndex(square: Square): number {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  return (7 - rank) * 8 + file;
}

function evaluateBoard(chess: Chess): number {
  const board = chess.board();
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const index = row * 8 + col;
        const mirroredIndex = (7 - row) * 8 + col; // For black pieces
        const pieceValue = PIECE_VALUES[piece.type];
        const positionalValue =
          PIECE_TABLES[piece.type][piece.color === 'w' ? index : mirroredIndex];

        if (piece.color === 'w') {
          score += pieceValue + positionalValue;
        } else {
          score -= pieceValue + positionalValue;
        }
      }
    }
  }

  return score;
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluateBoard(chess);
  }

  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return isMaximizing ? -Infinity : Infinity;
    }
    return 0; // Draw
  }

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getAIMove(
  chess: Chess,
  difficulty: number
): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Adjust search depth based on difficulty
  const depthMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };
  const depth = depthMap[difficulty] || 3;

  // Add some randomness for lower difficulties
  const randomFactor = Math.max(0, 6 - difficulty) * 0.1;

  let bestMove = moves[0];
  let bestEval = chess.turn() === 'w' ? -Infinity : Infinity;
  const isMaximizing = chess.turn() === 'w';

  for (const move of moves) {
    chess.move(move);
    const evalScore = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
    chess.undo();

    // Add randomness for lower difficulties
    const adjustedEval = evalScore + (Math.random() - 0.5) * 100 * randomFactor;

    if (isMaximizing) {
      if (adjustedEval > bestEval) {
        bestEval = adjustedEval;
        bestMove = move;
      }
    } else {
      if (adjustedEval < bestEval) {
        bestEval = adjustedEval;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

export function evaluatePosition(chess: Chess): EvaluationResult {
  if (chess.isCheckmate()) {
    return {
      score: chess.turn() === 'w' ? -10000 : 10000,
      isMate: true,
      mateIn: 0,
    };
  }

  const score = evaluateBoard(chess);
  return {
    score,
    isMate: false,
    mateIn: null,
  };
}

export function getHintMove(chess: Chess, difficulty: number): Move | null {
  // For hints, we use a higher depth
  const tempChess = new Chess(chess.fen());
  return getAIMove(tempChess, Math.min(difficulty + 1, 5));
}

export function getGameState(chess: Chess, lastMove: Move | null): GameState {
  return {
    fen: chess.fen(),
    turn: chess.turn(),
    isCheck: chess.isCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isDraw: chess.isDraw(),
    isGameOver: chess.isGameOver(),
    moveHistory: chess.history({ verbose: true }),
    lastMove: lastMove ? { from: lastMove.from, to: lastMove.to } : null,
  };
}
