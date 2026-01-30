import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ChessBoard from '../components/ChessBoard';
import EvaluationBar from '../components/EvaluationBar';
import GameStatus from '../components/GameStatus';
import ControlBar from '../components/ControlBar';
import { COLORS } from '../constants/theme';

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status bar */}
        <GameStatus />

        {/* Board with evaluation bar */}
        <View style={styles.boardContainer}>
          <ChessBoard />
          <EvaluationBar />
        </View>

        {/* Control buttons */}
        <ControlBar />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  boardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
