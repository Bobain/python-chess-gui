import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Chess, Square } from 'chess.js';
import { useGame } from '../context/GameContext';
import { COLORS, PIECE_UNICODE, FILES, RANKS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 32, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

interface SquareProps {
  square: Square;
  row: number;
  col: number;
  piece: { type: string; color: string } | null;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  isHint: boolean;
  onPress: (square: Square) => void;
  isFlipped: boolean;
}

function ChessSquare({
  square,
  row,
  col,
  piece,
  isSelected,
  isLegalMove,
  isLastMove,
  isCheck,
  isHint,
  onPress,
  isFlipped,
}: SquareProps) {
  const isLightSquare = (row + col) % 2 === 0;
  const isCapture = isLegalMove && piece !== null;

  const squareStyle = [
    styles.square,
    {
      backgroundColor: isLightSquare ? COLORS.lightSquare : COLORS.darkSquare,
    },
    isLastMove && styles.lastMoveHighlight,
    isSelected && styles.selectedHighlight,
    isHint && styles.hintHighlight,
    isCheck && styles.checkHighlight,
  ];

  const pieceSymbol = piece
    ? PIECE_UNICODE[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]
    : null;

  const showFile = isFlipped ? row === 0 : row === 7;
  const showRank = isFlipped ? col === 7 : col === 0;

  return (
    <TouchableOpacity
      style={squareStyle}
      onPress={() => onPress(square)}
      activeOpacity={0.7}
    >
      {/* Coordinate labels */}
      {showFile && (
        <Text style={[styles.coordinateFile, isLightSquare && styles.coordinateDark]}>
          {FILES[isFlipped ? 7 - col : col]}
        </Text>
      )}
      {showRank && (
        <Text style={[styles.coordinateRank, isLightSquare && styles.coordinateDark]}>
          {RANKS[isFlipped ? 7 - row : row]}
        </Text>
      )}

      {/* Legal move indicator */}
      {isLegalMove && !isCapture && <View style={styles.legalMoveIndicator} />}
      {isLegalMove && isCapture && <View style={styles.captureIndicator} />}

      {/* Chess piece */}
      {pieceSymbol && (
        <Text style={[styles.piece, piece?.color === 'w' && styles.whitePiece]}>
          {pieceSymbol}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function ChessBoard() {
  const {
    gameState,
    selectedSquare,
    legalMoves,
    hintMove,
    playerColor,
    selectSquare,
  } = useGame();

  const isFlipped = playerColor === 'b';

  const chess = useMemo(() => {
    const c = new Chess();
    c.load(gameState.fen);
    return c;
  }, [gameState.fen]);

  const board = useMemo(() => {
    const b = chess.board();
    return isFlipped ? [...b].reverse().map((row) => [...row].reverse()) : b;
  }, [chess, isFlipped]);

  const getSquareName = (row: number, col: number): Square => {
    if (isFlipped) {
      return `${FILES[7 - col]}${RANKS[7 - row]}` as Square;
    }
    return `${FILES[col]}${RANKS[row]}` as Square;
  };

  const kingInCheckSquare = useMemo(() => {
    if (!gameState.isCheck) return null;
    const turn = gameState.turn;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return getSquareName(row, col);
        }
      }
    }
    return null;
  }, [gameState.isCheck, gameState.turn, board]);

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((piece, colIndex) => {
              const square = getSquareName(rowIndex, colIndex);
              const isSelected = selectedSquare === square;
              const isLegalMove = legalMoves.includes(square);
              const isLastMoveFrom = gameState.lastMove?.from === square;
              const isLastMoveTo = gameState.lastMove?.to === square;
              const isLastMove = isLastMoveFrom || isLastMoveTo;
              const isCheck = kingInCheckSquare === square;
              const isHint =
                hintMove?.from === square || hintMove?.to === square;

              return (
                <ChessSquare
                  key={`${rowIndex}-${colIndex}`}
                  square={square}
                  row={rowIndex}
                  col={colIndex}
                  piece={piece}
                  isSelected={isSelected}
                  isLegalMove={isLegalMove}
                  isLastMove={isLastMove}
                  isCheck={isCheck}
                  isHint={isHint}
                  onPress={selectSquare}
                  isFlipped={isFlipped}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderWidth: 2,
    borderColor: COLORS.surfaceLight,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedHighlight: {
    backgroundColor: COLORS.selectedSquare,
  },
  lastMoveHighlight: {
    backgroundColor: COLORS.lastMoveHighlight,
  },
  hintHighlight: {
    backgroundColor: COLORS.hintHighlight,
  },
  checkHighlight: {
    backgroundColor: COLORS.checkHighlight,
  },
  piece: {
    fontSize: SQUARE_SIZE * 0.75,
    textAlign: 'center',
    color: '#000',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  whitePiece: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
  },
  legalMoveIndicator: {
    position: 'absolute',
    width: SQUARE_SIZE * 0.3,
    height: SQUARE_SIZE * 0.3,
    borderRadius: SQUARE_SIZE * 0.15,
    backgroundColor: COLORS.legalMoveIndicator,
    opacity: 0.8,
  },
  captureIndicator: {
    position: 'absolute',
    width: SQUARE_SIZE * 0.9,
    height: SQUARE_SIZE * 0.9,
    borderRadius: SQUARE_SIZE * 0.45,
    borderWidth: SQUARE_SIZE * 0.08,
    borderColor: COLORS.captureIndicator,
    opacity: 0.8,
  },
  coordinateFile: {
    position: 'absolute',
    bottom: 1,
    right: 3,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.lightSquare,
  },
  coordinateRank: {
    position: 'absolute',
    top: 1,
    left: 3,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.lightSquare,
  },
  coordinateDark: {
    color: COLORS.darkSquare,
  },
});
