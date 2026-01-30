import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Chess, Move, Square, Color } from 'chess.js';
import {
  GameState,
  EvaluationResult,
  getAIMove,
  evaluatePosition,
  getHintMove,
  getGameState,
} from '../utils/chessEngine';

interface GameContextType {
  // Game state
  gameState: GameState;
  evaluation: EvaluationResult;
  selectedSquare: Square | null;
  legalMoves: Square[];
  hintMove: { from: Square; to: Square } | null;

  // Settings
  playerColor: Color;
  difficulty: number;
  isGameStarted: boolean;
  isAIThinking: boolean;

  // Actions
  startGame: (color: Color, difficulty: number) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  undoMove: () => void;
  requestHint: () => void;
  clearHint: () => void;
  newGame: () => void;
  resetToMenu: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const chessRef = useRef(new Chess());
  const [gameState, setGameState] = useState<GameState>(() =>
    getGameState(chessRef.current, null)
  );
  const [evaluation, setEvaluation] = useState<EvaluationResult>({
    score: 0,
    isMate: false,
    mateIn: null,
  });
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [hintMove, setHintMove] = useState<{ from: Square; to: Square } | null>(null);
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const updateGameState = useCallback(() => {
    setGameState(getGameState(chessRef.current, lastMove));
    setEvaluation(evaluatePosition(chessRef.current));
  }, [lastMove]);

  const isPlayerTurn = useCallback(() => {
    return chessRef.current.turn() === playerColor;
  }, [playerColor]);

  // AI move logic
  useEffect(() => {
    if (
      isGameStarted &&
      !chessRef.current.isGameOver() &&
      !isPlayerTurn() &&
      !isAIThinking
    ) {
      setIsAIThinking(true);

      // Use setTimeout to allow UI to update
      setTimeout(() => {
        const aiMove = getAIMove(chessRef.current, difficulty);
        if (aiMove) {
          const move = chessRef.current.move(aiMove);
          setLastMove(move);
          setGameState(getGameState(chessRef.current, move));
          setEvaluation(evaluatePosition(chessRef.current));
        }
        setIsAIThinking(false);
      }, 500);
    }
  }, [gameState.turn, isGameStarted, isPlayerTurn, isAIThinking, difficulty]);

  const startGame = useCallback((color: Color, diff: number) => {
    chessRef.current = new Chess();
    setPlayerColor(color);
    setDifficulty(diff);
    setIsGameStarted(true);
    setLastMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);
    setGameState(getGameState(chessRef.current, null));
    setEvaluation(evaluatePosition(chessRef.current));
  }, []);

  const selectSquare = useCallback(
    (square: Square) => {
      if (!isPlayerTurn() || chessRef.current.isGameOver()) {
        return;
      }

      const piece = chessRef.current.get(square);

      // If clicking on own piece, select it
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        const moves = chessRef.current.moves({ square, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        setHintMove(null);
        return;
      }

      // If a piece is selected and clicking on a legal move target
      if (selectedSquare && legalMoves.includes(square)) {
        makeMove(selectedSquare, square);
        return;
      }

      // Otherwise, deselect
      setSelectedSquare(null);
      setLegalMoves([]);
    },
    [playerColor, selectedSquare, legalMoves]
  );

  const makeMove = useCallback(
    (from: Square, to: Square, promotion: string = 'q'): boolean => {
      if (!isPlayerTurn() || chessRef.current.isGameOver()) {
        return false;
      }

      try {
        const move = chessRef.current.move({ from, to, promotion });
        if (move) {
          setLastMove(move);
          setSelectedSquare(null);
          setLegalMoves([]);
          setHintMove(null);
          setGameState(getGameState(chessRef.current, move));
          setEvaluation(evaluatePosition(chessRef.current));
          return true;
        }
      } catch {
        // Invalid move
      }

      setSelectedSquare(null);
      setLegalMoves([]);
      return false;
    },
    [isPlayerTurn]
  );

  const undoMove = useCallback(() => {
    if (chessRef.current.history().length < 2) return;

    // Undo both player and AI moves
    chessRef.current.undo();
    chessRef.current.undo();

    const history = chessRef.current.history({ verbose: true });
    const newLastMove = history.length > 0 ? history[history.length - 1] : null;
    setLastMove(newLastMove);
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);
    setGameState(getGameState(chessRef.current, newLastMove));
    setEvaluation(evaluatePosition(chessRef.current));
  }, []);

  const requestHint = useCallback(() => {
    if (!isPlayerTurn() || chessRef.current.isGameOver()) return;

    const hint = getHintMove(chessRef.current, difficulty);
    if (hint) {
      setHintMove({ from: hint.from, to: hint.to });
    }
  }, [difficulty, isPlayerTurn]);

  const clearHint = useCallback(() => {
    setHintMove(null);
  }, []);

  const newGame = useCallback(() => {
    chessRef.current = new Chess();
    setLastMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);
    setGameState(getGameState(chessRef.current, null));
    setEvaluation(evaluatePosition(chessRef.current));
  }, []);

  const resetToMenu = useCallback(() => {
    setIsGameStarted(false);
    chessRef.current = new Chess();
    setLastMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintMove(null);
    setGameState(getGameState(chessRef.current, null));
  }, []);

  const value: GameContextType = {
    gameState,
    evaluation,
    selectedSquare,
    legalMoves,
    hintMove,
    playerColor,
    difficulty,
    isGameStarted,
    isAIThinking,
    startGame,
    selectSquare,
    makeMove,
    undoMove,
    requestHint,
    clearHint,
    newGame,
    resetToMenu,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
