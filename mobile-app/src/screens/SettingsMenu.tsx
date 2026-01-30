import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Color } from 'chess.js';
import { useGame } from '../context/GameContext';
import { COLORS, DIFFICULTY_LEVELS, PIECE_UNICODE } from '../constants/theme';

export default function SettingsMenu() {
  const { startGame } = useGame();
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  const canStart = selectedColor !== null && selectedDifficulty !== null;

  const handleStart = () => {
    if (canStart) {
      startGame(selectedColor!, selectedDifficulty!);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>{PIECE_UNICODE['N']}</Text>
          <Text style={styles.title}>Chess Mobile</Text>
          <Text style={styles.titleIcon}>{PIECE_UNICODE['n']}</Text>
        </View>
        <Text style={styles.subtitle}>Play against AI</Text>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your color</Text>
          <View style={styles.colorButtons}>
            <TouchableOpacity
              style={[
                styles.colorButton,
                selectedColor === 'w' && styles.colorButtonSelected,
              ]}
              onPress={() => setSelectedColor('w')}
            >
              <Text style={styles.colorPiece}>{PIECE_UNICODE['K']}</Text>
              <Text style={styles.colorText}>White</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorButton,
                selectedColor === 'b' && styles.colorButtonSelected,
              ]}
              onPress={() => setSelectedColor('b')}
            >
              <Text style={styles.colorPieceBlack}>{PIECE_UNICODE['k']}</Text>
              <Text style={styles.colorText}>Black</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select difficulty</Text>
          <View style={styles.difficultyButtons}>
            {DIFFICULTY_LEVELS.map((diff) => (
              <TouchableOpacity
                key={diff.level}
                style={[
                  styles.difficultyButton,
                  selectedDifficulty === diff.level &&
                    styles.difficultyButtonSelected,
                ]}
                onPress={() => setSelectedDifficulty(diff.level)}
              >
                <Text
                  style={[
                    styles.difficultyLevel,
                    selectedDifficulty === diff.level &&
                      styles.difficultyTextSelected,
                  ]}
                >
                  {diff.level}
                </Text>
                <Text
                  style={[
                    styles.difficultyName,
                    selectedDifficulty === diff.level &&
                      styles.difficultyTextSelected,
                  ]}
                >
                  {diff.name}
                </Text>
                <Text
                  style={[
                    styles.difficultyElo,
                    selectedDifficulty === diff.level &&
                      styles.difficultyTextSelected,
                  ]}
                >
                  ~{diff.elo} ELO
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <Ionicons
            name="play"
            size={24}
            color={canStart ? COLORS.textPrimary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.startButtonText,
              !canStart && styles.startButtonTextDisabled,
            ]}
          >
            Start Game
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  titleIcon: {
    fontSize: 40,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: COLORS.surfaceLight,
  },
  colorPiece: {
    fontSize: 48,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorPieceBlack: {
    fontSize: 48,
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  difficultyButtons: {
    gap: 8,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  difficultyButtonSelected: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: COLORS.surfaceLight,
  },
  difficultyLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    width: 32,
  },
  difficultyName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  difficultyElo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  difficultyTextSelected: {
    color: COLORS.buttonPrimary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonPrimary,
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 32,
  },
  startButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  startButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});
