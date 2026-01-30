import { useGame } from '../src/context/GameContext';
import SettingsMenu from '../src/screens/SettingsMenu';
import GameScreen from '../src/screens/GameScreen';

export default function App() {
  const { isGameStarted } = useGame();

  if (!isGameStarted) {
    return <SettingsMenu />;
  }

  return <GameScreen />;
}
