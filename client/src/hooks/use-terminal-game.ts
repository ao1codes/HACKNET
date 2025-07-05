import { useState, useEffect, useCallback } from 'react';
import { GameEngine, GameState, TerminalOutput } from '../lib/game-engine';
import { soundManager } from '../lib/sound-manager';

export function useTerminalGame() {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
  const [outputs, setOutputs] = useState<TerminalOutput[]>(gameEngine.getOutputs());
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [needsUsername, setNeedsUsername] = useState(true);
  const [volumeEnabled, setVolumeEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    gameEngine.setOnStateChange(setGameState);
    gameEngine.setOnOutputChange(setOutputs);

    // Boot sequence
    const bootInterval = setInterval(() => {
      setBootProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setIsBooting(false);
            soundManager.play('startup');
          }, 500);
        }
        return newProgress;
      });
    }, 300);

    return () => {
      clearInterval(bootInterval);
    };
  }, [gameEngine]);

  const handleEffect = useCallback((effect: string, message?: string) => {
    setActiveEffects(prev => [...prev, effect]);

    switch (effect) {
      case 'matrix':
        setTimeout(() => {
          setActiveEffects(prev => prev.filter(e => e !== 'matrix'));
        }, 10000);
        break;

      case 'disco':
        setTimeout(() => {
          setActiveEffects(prev => prev.filter(e => e !== 'disco'));
        }, 5000);
        break;

      case 'rickroll':
        soundManager.play('rickroll');
        break;

      case 'decrypt':
        // da decryption progress
        setTimeout(() => {
          gameEngine.completeDecryption();
        }, 5000);
        break;

      case 'win':
        setTimeout(() => {
          setActiveEffects(prev => [...prev, 'win']);
        }, 1000);
        break;

      default:
        setTimeout(() => {
          setActiveEffects(prev => prev.filter(e => e !== effect));
        }, 3000);
    }
  }, [gameEngine]);

  const processCommand = useCallback(async (command: string) => {
    const result = await gameEngine.processCommand(command);

    if (result.effect) {
      handleEffect(result.effect, result.message);
    }

    return result;
  }, [gameEngine, handleEffect]);

  const closeEffect = useCallback((effect: string) => {
    setActiveEffects(prev => prev.filter(e => e !== effect));
    if (effect === 'rickroll') {
      soundManager.stop('rickroll');
    }
  }, []);

  const toggleVolume = useCallback(() => {
    const newVolumeState = !volumeEnabled;
    soundManager.setEnabled(newVolumeState);
    setVolumeEnabled(newVolumeState);
    return newVolumeState;
  }, [volumeEnabled]);

  const setUsername = useCallback((username: string) => {
    gameEngine.setUsername(username);
    setNeedsUsername(false);
  }, [gameEngine]);

  const resetGame = useCallback(() => {
    gameEngine.reset();
    setActiveEffects([]);
    setNeedsUsername(true);
  }, [gameEngine]);

  const getCompletionTime = useCallback(() => {
    const completionTime = Math.floor((Date.now() - gameState.sessionStartTime) / 1000);
    const minutes = Math.floor(completionTime / 60);
    const seconds = completionTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [gameState.sessionStartTime]);

  return {
    gameState,
    outputs,
    isBooting,
    bootProgress,
    activeEffects,
    needsUsername,
    processCommand,
    closeEffect,
    toggleVolume,
    resetGame,
    getCompletionTime,
    setUsername,
    isVolumeEnabled: volumeEnabled
  };
}
