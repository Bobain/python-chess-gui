import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import { COLORS, DIFFICULTY_LEVELS } from '../constants/theme';

export default function GameStatus() {
  const { gameState, evaluation, isAIThinking, difficulty } = useGame();

  const getStatusText = () => {
    if (gameState.isCheckmate) {
      return gameState.turn === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
    }
    if (gameState.isStalemate) {
      return 'Draw by stalemate';
    }
    if (gameState.isDraw) {
      return 'Draw';
    }
    if (isAIThinking) {
      return 'AI is thinking...';
    }
    if (gameState.isCheck) {
      return `${gameState.turn === 'w' ? 'White' : 'Black'} is in check!`;
    }
    return `${gameState.turn === 'w' ? 'White' : 'Black'} to move`;
  };

  const formatEvaluation = () => {
    if (evaluation.isMate) {
      return evaluation.score > 0 ? 'M+' : 'M-';
    }
    const pawns = (evaluation.score / 100).toFixed(1);
    return evaluation.score > 0 ? `+${pawns}` : pawns;
  };

  const difficultyName = DIFFICULTY_LEVELS.find((d) => d.level === difficulty)?.name || 'Unknown';

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={styles.evalText}>Eval: {formatEvaluation()}</Text>
      </View>
      <Text style={styles.difficultyText}>
        Difficulty: {difficultyName} (Level {difficulty})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  evalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  difficultyText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
