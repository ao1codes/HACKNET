import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useTerminalGame } from '@/hooks/use-terminal-game';
import { rickrollAscii } from '@/data/game-data';
import { soundManager } from '@/lib/sound-manager';

export default function TerminalInterface() {
  const {
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
    isVolumeEnabled
  } = useTerminalGame();

  const [inputValue, setInputValue] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  useEffect(() => {
    if (!isBooting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBooting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await processCommand(inputValue);
      setInputValue('');
    }
  };

  const handleHelp = async () => {
    await processCommand('help');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game?')) {
      resetGame();
    }
  };

  const handleVolumeToggle = () => {
    toggleVolume();
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput.trim());
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderBootScreen = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-2xl md:text-4xl glow-text mb-4 animate-pulse">INITIALIZING SYSTEM...</div>
        <div className="text-lg mb-8">
          <div className="animate-pulse">
            {'▓'.repeat(Math.floor(bootProgress / 10))}{'░'.repeat(10 - Math.floor(bootProgress / 10))} {bootProgress}%
          </div>
        </div>
        <div className="text-sm opacity-75 space-y-2">
          <div>Loading neural network protocols...</div>
          <div>Establishing quantum entanglement...</div>
          <div>Bypassing reality firewall...</div>
        </div>
      </div>
    </div>
  );

  const renderUsernameScreen = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-4">
        <div className="text-3xl md:text-4xl glow-text mb-8 animate-pulse">
          ACCESS TERMINAL
        </div>
        <div className="text-lg mb-6 text-terminal-yellow">
          IDENTITY VERIFICATION REQUIRED
        </div>
        <div className="text-sm mb-8 opacity-75">
          Enter your hacker alias to access the network
        </div>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-terminal-green">USERNAME:</span>
            <input
              ref={usernameRef}
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="bg-transparent border border-terminal-green px-3 py-1 text-terminal-green font-terminal focus:outline-none focus:ring-2 focus:ring-terminal-green"
              placeholder="anonymous"
              maxLength={20}
              autoFocus
              aria-label="Enter your hacker alias"
            />
          </div>
          <Button
            type="submit"
            disabled={!usernameInput.trim()}
            className="bg-terminal-green text-black px-6 py-2 font-pixel text-sm rounded hover:bg-opacity-80 transition-all disabled:opacity-50"
          >
            ACCESS GRANTED
          </Button>
        </form>
        <div className="mt-8 text-xs opacity-50">
          <div className="text-terminal-blue">
            Type 'leaderboard' to view top scores
          </div>
        </div>
      </div>
    </div>
  );


  // Matrix Rain Effect State & Logic
  const MATRIX_COLUMN_COUNT = 40;
  const MATRIX_CHARS = 20;
  const MATRIX_SPEED_RANGE = [2, 5]; // seconds
  const [matrixColumns, setMatrixColumns] = useState(() => {
    // Initialize columns with random positions and speeds
    return Array.from({ length: MATRIX_COLUMN_COUNT }, () => ({
      left: Math.random(),
      top: Math.random() * -1, // start above the screen
      speed: MATRIX_SPEED_RANGE[0] + Math.random() * (MATRIX_SPEED_RANGE[1] - MATRIX_SPEED_RANGE[0]),
      chars: Array.from({ length: MATRIX_CHARS }, () =>
        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      ),
    }));
  });

  // Animate columns
  useEffect(() => {
    if (!activeEffects.includes('matrix')) return;
    let running = true;
    let lastTime = performance.now();
    const animate = (now: number) => {
      if (!running) return;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setMatrixColumns(cols =>
        cols.map(col => {
          let newTop = col.top + delta / col.speed;
          if (newTop > 1.1) {
            // Reset column to top with new random values
            return {
              left: Math.random(),
              top: Math.random() * -0.2,
              speed: MATRIX_SPEED_RANGE[0] + Math.random() * (MATRIX_SPEED_RANGE[1] - MATRIX_SPEED_RANGE[0]),
              chars: Array.from({ length: MATRIX_CHARS }, () =>
                String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
              ),
            };
          }
          return { ...col, top: newTop };
        })
      );
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [activeEffects]);

  const renderMatrixEffect = useCallback(() => {
    if (!activeEffects.includes('matrix')) return null;
    return (
      <div className="matrix-rain active">
        {matrixColumns.map((col, i) => (
          <div
            key={i}
            className="matrix-column"
            style={{
              left: `${col.left * 100}%`,
              top: `${col.top * 100}%`,
              height: `calc(100vh / ${MATRIX_CHARS})`,
              transition: 'none',
            }}
          >
            {col.chars.map((char, j) => (
              <div key={j}>{char}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }, [activeEffects, matrixColumns]);

  const renderRickrollModal = () => {
    if (!activeEffects.includes('rickroll')) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
        <div className="rickroll-ascii text-terminal-green text-xs leading-tight">
          <div className="text-center mb-4 text-terminal-red glow-text">NEVER GONNA GIVE YOU UP!</div>
          <pre className="font-terminal whitespace-pre-wrap">
            {rickrollAscii}
          </pre>
          <div className="text-center mt-4">
            <Button
              onClick={() => closeEffect('rickroll')}
              className="bg-terminal-red text-white px-4 py-2 font-pixel text-xs rounded hover:bg-opacity-80"
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDebugPanel = () => {
    if (!activeEffects.includes('debug')) return null;

    return (
      <div className="fixed top-4 right-4 bg-black border border-terminal-green p-4 rounded text-xs z-50 max-w-xs">
        <div className="text-terminal-yellow mb-2">DEBUG PANEL</div>
        <div className="space-y-1 text-xs">
          <div>Session: <span className="text-terminal-green">{gameState.currentServer.toUpperCase()}</span></div>
          <div>Server: <span className="text-terminal-green">{gameState.currentServer.toUpperCase()}</span></div>
          <div>Keys Found: <span className="text-terminal-green">{gameState.keysFound.length}/2</span></div>
          <div>Commands: <span className="text-terminal-green">{gameState.commandCount}</span></div>
        </div>
        <Button
          onClick={() => closeEffect('debug')}
          className="mt-2 bg-terminal-red text-white px-2 py-1 text-xs rounded"
        >
          CLOSE
        </Button>
      </div>
    );
  };

  const renderWinScreen = () => {
    if (!activeEffects.includes('win')) return null;

    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-60">
        <div className="text-center max-w-4xl mx-4">
          <div className="text-4xl md:text-6xl glow-text mb-8 animate-pulse">
            ACCESS GRANTED
          </div>
          <div className="text-xl mb-4 text-terminal-yellow">
            PROJECT-X.OMEGA SUCCESSFULLY DECRYPTED
          </div>
          <div className="text-sm mb-8 max-w-md mx-auto leading-relaxed">
            <div className="border border-terminal-green p-4 bg-gray-900 bg-opacity-50">
              <div className="text-terminal-green glow-text mb-2">MISSION COMPLETE</div>
              <div className="text-left text-xs space-y-1">
                <div>The cake is a lie.</div>
                <div>Congratulations, you've mastered the art of fake hacking!</div>
                <div className="mt-2">
                  Time to complete: <span className="text-terminal-yellow">{getCompletionTime()}</span>
                </div>
                <div>
                  Commands used: <span className="text-terminal-yellow">{gameState.commandCount}</span>
                </div>
                <div className="mt-2">
                  You are now certified as a Level 1 Script Kiddie.
                </div>
              </div>
            </div>
          </div>
          <div className="space-x-4">
            <Button
              onClick={async () => await processCommand('leaderboard')}
              className="bg-terminal-blue text-white px-4 py-2 font-pixel text-sm rounded hover:bg-opacity-80 transition-all"
            >
              LEADERBOARD
            </Button>
            <Button
              onClick={resetGame}
              className="bg-terminal-green text-black px-6 py-3 font-pixel text-sm rounded hover:bg-opacity-80 transition-all"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isBooting) {
    return renderBootScreen();
  }

  if (needsUsername) {
    return renderUsernameScreen();
  }

  return (
    <div className={`h-screen flex flex-col crt-effect terminal-glow relative ${
      activeEffects.includes('disco') ? 'animate-disco' : ''
    }`}>
      {/* Scanlines Overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-10"></div>

      {/* Matrix Rain Effect */}
      {renderMatrixEffect()}

      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-50 border-b border-terminal-green border-opacity-30">
        <div className="flex items-center space-x-4">
          <div className="text-sm glow-text">SECURE TERMINAL v2.1.5</div>
          <div className="text-xs opacity-75">Session: {gameState.currentServer.toUpperCase()}</div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleHelp}
            className="bg-terminal-green text-black px-3 py-1 text-xs font-pixel rounded hover:bg-opacity-80 transition-all"
          >
            HELP
          </Button>
          <Button
            onClick={handleReset}
            className="bg-terminal-red text-white px-3 py-1 text-xs font-pixel rounded hover:bg-opacity-80 transition-all"
          >
            RESET
          </Button>
          <Button
            onClick={handleVolumeToggle}
            className={`px-3 py-1 text-xs font-pixel rounded hover:bg-opacity-80 transition-all ${
              isVolumeEnabled 
                ? 'bg-terminal-blue text-white' 
                : 'bg-terminal-red text-white'
            }`}
          >
            {isVolumeEnabled ? 'VOLUME' : 'MUTED'}
          </Button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-terminal text-sm leading-relaxed terminal-scrollbar"
      >
        <div className="space-y-1">
          {outputs.map((output, index) => (
            <div
              key={index}
              className={`${output.className || ''} ${
                output.text.includes('ERROR') || output.text.includes('DENIED')
                  ? 'animate-glitch'
                  : ''
              }`}
            >
              {output.text}
            </div>
          ))}
        </div>
      </div>

      {/* Command Input Area */}
      <div className="p-4 bg-gray-900 bg-opacity-30 border-t border-terminal-green border-opacity-30">
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-terminal-green glow-text mr-2">
            {gameState.prompt}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key.length === 1) {
                soundManager.play('typing');
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-terminal-green font-terminal terminal-input"
            placeholder="Enter command..."
            autoComplete="off"
            aria-label="Enter terminal command"
          />
          <span className="text-terminal-green animate-blink ml-1">▋</span>
        </form>
      </div>

      {/* Effects and Modals */}
      {renderRickrollModal()}
      {renderDebugPanel()}
      {renderWinScreen()}
    </div>
  );
}
