import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { COLORS } from '../constants/theme';

export default function ControlBar() {
  const { undoMove, requestHint, newGame, resetToMenu, gameState, isAIThinking } = useGame();

  const canUndo = gameState.moveHistory.length >= 2 && !isAIThinking;
  const canGetHint = !gameState.isGameOver && !isAIThinking;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canUndo && styles.buttonDisabled]}
        onPress={undoMove}
        disabled={!canUndo}
      >
        <Ionicons
          name="arrow-undo"
          size={20}
          color={canUndo ? COLORS.textPrimary : COLORS.textMuted}
        />
        <Text style={[styles.buttonText, !canUndo && styles.buttonTextDisabled]}>
          Undo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !canGetHint && styles.buttonDisabled]}
        onPress={requestHint}
        disabled={!canGetHint}
      >
        <Ionicons
          name="bulb-outline"
          size={20}
          color={canGetHint ? COLORS.warning : COLORS.textMuted}
        />
        <Text style={[styles.buttonText, !canGetHint && styles.buttonTextDisabled]}>
          Hint
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={newGame}>
        <Ionicons name="refresh" size={20} color={COLORS.success} />
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={resetToMenu}>
        <Ionicons name="home" size={20} color={COLORS.textSecondary} />
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginTop: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: 4,
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },
});
