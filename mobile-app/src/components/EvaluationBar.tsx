import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 32, 400);
const BAR_HEIGHT = BOARD_SIZE;
const BAR_WIDTH = 24;

export default function EvaluationBar() {
  const { evaluation, playerColor } = useGame();

  // Convert centipawn score to percentage (max ±1000 cp = 10 pawns)
  const maxScore = 1000;
  const clampedScore = Math.max(-maxScore, Math.min(maxScore, evaluation.score));

  // Calculate white's portion of the bar (0-100%)
  let whitePercentage = ((clampedScore + maxScore) / (2 * maxScore)) * 100;

  // Flip for black perspective
  if (playerColor === 'b') {
    whitePercentage = 100 - whitePercentage;
  }

  // Format evaluation text
  const formatEvaluation = () => {
    if (evaluation.isMate) {
      return evaluation.score > 0 ? 'M+' : 'M-';
    }
    const pawns = (evaluation.score / 100).toFixed(1);
    return evaluation.score > 0 ? `+${pawns}` : pawns;
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Black portion (top when white perspective) */}
        <View
          style={[
            styles.blackPortion,
            { height: `${100 - whitePercentage}%` },
          ]}
        />
        {/* White portion (bottom when white perspective) */}
        <View
          style={[styles.whitePortion, { height: `${whitePercentage}%` }]}
        />
      </View>
      <Text style={styles.evalText}>{formatEvaluation()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginLeft: 8,
  },
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    backgroundColor: COLORS.evalBlack,
  },
  blackPortion: {
    width: '100%',
    backgroundColor: COLORS.evalBlack,
  },
  whitePortion: {
    width: '100%',
    backgroundColor: COLORS.evalWhite,
  },
  evalText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});
