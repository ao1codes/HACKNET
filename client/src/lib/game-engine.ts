import { gameServers, availableServers, easterEggs, winMessage } from '../data/game-data';
import { soundManager } from './sound-manager';

export interface GameState {
  currentServer: string;
  currentPath: string;
  keysFound: string[];
  commandHistory: string[];
  sessionStartTime: number;
  commandCount: number;
  isWin: boolean;
  prompt: string;
  username: string;
  completionTime?: number;
}

export interface LeaderboardEntry {
  username: string;
  completionTime: number;
  commandCount: number;
  completedAt: number;
}

export interface TerminalOutput {
  text: string;
  className?: string;
  isCommand?: boolean;
}

export class GameEngine {
  private state: GameState;
  private outputs: TerminalOutput[] = [];
  private onStateChange?: (state: GameState) => void;
  private onOutputChange?: (outputs: TerminalOutput[]) => void;

  constructor() {
    this.state = {
      currentServer: 'local',
      currentPath: '~',
      keysFound: [],
      commandHistory: [],
      sessionStartTime: Date.now(),
      commandCount: 0,
      isWin: false,
      prompt: 'guest@hacknet:~$',
      username: ''
    };
    
    this.loadGameState();
    this.addWelcomeMessage();
  }

  setOnStateChange(callback: (state: GameState) => void) {
    this.onStateChange = callback;
  }

  setOnOutputChange(callback: (outputs: TerminalOutput[]) => void) {
    this.onOutputChange = callback;
  }

  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.saveGameState();
    this.onStateChange?.(this.state);
  }

  private addOutput(text: string, className?: string, isCommand = false) {
    this.outputs.push({ text, className, isCommand });
    // Always pass a new array reference to trigger React updates
    this.onOutputChange?.([...this.outputs]);

    // Play the right sound effects
    if (text.includes('ERROR') || text.includes('DENIED')) {
      soundManager.play('glitch');
    } else if (text.includes('SUCCESS') || text.includes('UNLOCKED') || text.includes('KEY_FRAGMENT')) {
      soundManager.play('success');
    }
  }

  private addWelcomeMessage() {
    this.addOutput('╔══════════════════════════════════════════════════════════════════╗', 'text-terminal-green glow-text');
    this.addOutput('║  WELCOME TO THE UNDERGROUND NETWORK ACCESS TERMINAL            ║', 'text-terminal-green glow-text');
    this.addOutput('║  WARNING: UNAUTHORIZED ACCESS IS MONITORED AND PROSECUTED     ║', 'text-terminal-green glow-text');
    this.addOutput('╚══════════════════════════════════════════════════════════════════╝', 'text-terminal-green glow-text');
    this.addOutput('> System initialization complete.', 'text-terminal-yellow');
    this.addOutput("> Type 'help' for available commands.", 'text-terminal-yellow');
    this.addOutput('> Your mission: Retrieve project-x.omega from the secure servers.', 'text-terminal-yellow');
    this.addOutput('');
  }

  async processCommand(command: string): Promise<{ success: boolean; effect?: string; message?: string }> {
    if (command.trim().toLowerCase() === 'pls clear') {
      return this.handleClear('pls clear');
    }

    const cmd = command.trim().toLowerCase();
    const args = cmd.split(' ');
    const baseCmd = args[0];

    this.updateState({
      commandCount: this.state.commandCount + 1,
      commandHistory: [...this.state.commandHistory, command]
    });

    // Add command to output
    this.addOutput(`${this.state.prompt} ${command}`, 'text-terminal-green', true);

    switch (baseCmd) {
      case 'help':
        return this.handleHelp();
      case 'scan':
        return this.handleScan();
      case 'connect':
        return this.handleConnect(args[1]);
      case 'ls':
        return this.handleLs();
      case 'cd':
        return this.handleCd(args[1]);
      case 'cat':
        return this.handleCat(args[1]);
      case 'decrypt':
        return this.handleDecrypt(args.slice(1));
      case 'sudo':
        return this.handleSudo(args.slice(1));
      case 'clear':
        return this.handleClear(cmd);
      case 'eject':
        return this.handleEject();
      case 'neo':
        return this.handleNeo();
      case 'rickroll':
        return this.handleRickroll();
      case 'backdoor':
        return this.handleBackdoor();
      case 'open':
        return this.handleOpen(args[1]);
      case 'why':
        return this.handleWhy(cmd);
      case 'leaderboard':
        await this.handleLeaderboard();
        return { success: true };
      case 'disconnect':
        return this.handleDisconnect();
      default:
        this.addOutput(`ERROR: Unknown command '${baseCmd}'. Type 'help' for available commands.`, 'text-terminal-red animate-glitch');
        return { success: false };
    }
  }

  private handleHelp() {
    this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
    this.addOutput('AVAILABLE COMMANDS:', 'text-terminal-yellow glow-text');
    this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
    this.addOutput('help        - Show this help message');
    this.addOutput('scan        - Scan for available servers');
    this.addOutput('connect <ip> - Connect to a server');
    this.addOutput('ls          - List files in current directory');
    this.addOutput('cd <dir>    - Change directory');
    this.addOutput('cat <file>  - Display file contents');
    this.addOutput('decrypt <file> - Decrypt encrypted files');
    this.addOutput('sudo <cmd>  - Execute command as administrator');
    this.addOutput('clear       - Clear terminal (try asking nicely)');
    this.addOutput('eject       - Eject CD tray');
    this.addOutput('leaderboard - View top hacker scores');
    this.addOutput('disconnect  - Return to local terminal');
    this.addOutput('───────────────────────────────────────');
    this.addOutput('EASTER EGGS: neo, rickroll, open ai, why am i here', 'text-terminal-blue');
    this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
    return { success: true };
  }

  private handleScan() {
    this.addOutput('Scanning network for available servers...', 'text-terminal-yellow');
    
    setTimeout(() => {
      this.addOutput('SCAN RESULTS:');
      availableServers.forEach(server => {
        const statusClass = server.status === 'OFFLINE' ? 'text-terminal-red' : 'text-terminal-green';
        this.addOutput(`${server.ip}     - ${server.name} [${server.status}]`, statusClass);
      });
      this.addOutput('Use "connect <ip>" to establish connection');
    }, 2000);

    return { success: true };
  }

  private handleConnect(ip?: string) {
    if (!ip) {
      this.addOutput('ERROR: Please specify an IP address', 'text-terminal-red');
      return { success: false };
    }

    const server = availableServers.find(s => s.ip === ip);
    if (!server) {
      this.addOutput(`ERROR: Cannot connect to ${ip} - Server not found`, 'text-terminal-red animate-glitch');
      return { success: false };
    }

    if (server.status === 'OFFLINE') {
      this.addOutput('ERROR: GAMMA-SERVER is currently offline', 'text-terminal-red animate-glitch');
      return { success: false };
    }

    this.addOutput(`Connecting to ${ip}...`, 'text-terminal-yellow');
    
    setTimeout(() => {
      this.addOutput(`SUCCESS: Connected to ${server.name}`, 'text-terminal-green glow-text');
      this.updateState({
        currentServer: server.key,
        currentPath: '~',
        prompt: `${server.key}@hacknet:~$`
      });
    }, 1500);

    return { success: true };
  }

  private handleLs() {
    const server = gameServers[this.state.currentServer];
    if (!server) {
      this.addOutput('ERROR: Not connected to any server', 'text-terminal-red');
      return { success: false };
    }

    const files = server.files[this.state.currentPath];
    if (Array.isArray(files)) {
      this.addOutput(`Contents of ${this.state.currentPath}:`);
      files.forEach(file => {
        const isDir = file.endsWith('/');
        const className = isDir ? 'text-terminal-blue' : 'text-terminal-green';
        this.addOutput(`${isDir ? 'd' : '-'}rwxr-xr-x  ${file}`, className);
      });
    } else {
      this.addOutput('ERROR: Current path is not a directory', 'text-terminal-red');
    }

    return { success: true };
  }

  private handleCd(dir?: string) {
    if (!dir || dir === '~') {
      this.updateState({ currentPath: '~' });
      this.addOutput('Changed to home directory');
      return { success: true };
    }

    if (dir === '..') {
      // Go up one directory
      if (this.state.currentPath === '~') {
        this.addOutput('Already at home directory');
        return { success: true };
      }
      let path = this.state.currentPath;
      if (path.endsWith('/')) path = path.slice(0, -1);
      const parts = path.split('/');
      if (parts.length === 1) {
        // Only one part, go to home
        this.updateState({ currentPath: '~' });
        this.addOutput('Changed to home directory');
        return { success: true };
      }
      parts.pop();
      let newPath = parts.join('/');
      if (!newPath || newPath === '~') newPath = '~';
      else if (!newPath.endsWith('/')) newPath += '/';
      this.updateState({ currentPath: newPath });
      this.addOutput(`Changed directory to ${newPath}`);
      return { success: true };
    }

    const server = gameServers[this.state.currentServer];
    if (!server) {
      this.addOutput('ERROR: Not connected to any server', 'text-terminal-red');
      return { success: false };
    }

    // Helper: add trailing slash if missing
    function addTrailingSlash(path: string): string {
      return path.endsWith('/') ? path : path + '/';
    }

    // Build new path properly, ensuring trailing slash
    const basePath = this.state.currentPath === '~' ? '' : addTrailingSlash(this.state.currentPath);
    const newPath = addTrailingSlash(basePath + dir);

    if (server.files[newPath] && Array.isArray(server.files[newPath])) {
      this.updateState({ currentPath: newPath });
      this.addOutput(`Changed directory to ${newPath}`);
      return { success: true };
    } else {
      this.addOutput(`ERROR: Directory '${dir}' not found`, 'text-terminal-red animate-glitch');
      return { success: false };
    }
  }

  private joinPath(dir: string, file: string): string {
    if (dir === '~') return file;
    const cleanDir = dir.endsWith('/') ? dir.slice(0, -1) : dir;
    return `${cleanDir}/${file}`;
  }


  private handleCat(filename?: string) {
    if (!filename) {
      this.addOutput('ERROR: Please specify a filename', 'text-terminal-red');
      return { success: false };
    }

    const server = gameServers[this.state.currentServer];
    if (!server) {
      this.addOutput('ERROR: Not connected to any server', 'text-terminal-red');
      return { success: false };
    }

    const filePath = filename.startsWith('/') ? filename : this.joinPath(this.state.currentPath, filename);

    const content = server.files[filePath];
    if (content && typeof content === 'string') {
      this.addOutput(`── ${filename} ──`, 'text-terminal-yellow');
      content.split('\n').forEach(line => {
        this.addOutput(line);
      });
      this.addOutput('── END ──', 'text-terminal-yellow');

      const keyMatches = [...content.matchAll(/KEY_FRAGMENT_\d:\s+([A-Z0-9_]+)/g)];
      keyMatches.forEach(match => {
        const fragment = match[1];
        if (!this.state.keysFound.includes(fragment)) {
          this.state.keysFound.push(fragment);
          this.addOutput(`[KEY FRAGMENT FOUND: ${fragment}]`, 'text-terminal-green glow-text');
          this.saveGameState(); // persist key
        }
      });

      return { success: true };
    } else {
      this.addOutput(`ERROR: File '${filename}' not found`, 'text-terminal-red animate-glitch');
      return { success: false };
    }
  }

  private handleDecrypt(args: string[]) {
    if (args.length === 0) {
      this.addOutput('ERROR: Please specify a file to decrypt', 'text-terminal-red');
      return { success: false };
    }

    const filename = args[0];
    if (filename === 'project-x.omega.enc' || filename === 'project-x.omega') {
      if (this.state.isWin) {
        this.addOutput('You have already completed the mission! Reset the game to play again.', 'text-terminal-yellow');
        return { success: false };
      }
      if (this.state.keysFound.length >= 2) {
        this.addOutput('DECRYPTING PROJECT-X.OMEGA...', 'text-terminal-yellow');
        this.addOutput('Using key fragments: ' + this.state.keysFound.join(', '), 'text-terminal-green');

        return {
          success: true,
          effect: 'decrypt',
          message: 'Starting decryption process...'
        };
      } else {
        this.addOutput(`ERROR: Insufficient key fragments. Found ${this.state.keysFound.length}/2`, 'text-terminal-red animate-glitch');
        this.addOutput('Hint: Search ALPHA and BETA servers for key fragments');
        return { success: false };
      }
    } else {
      this.addOutput(`ERROR: Cannot decrypt '${filename}' - File not found or not encrypted`, 'text-terminal-red animate-glitch');
      return { success: false };
    }
  }

  private handleSudo(args: string[]) {
    if (args.length === 0) {
      this.addOutput('ERROR: Please specify a command to run with sudo', 'text-terminal-red');
      return { success: false };
    }

    if (args.join(' ') === 'dance') {
      return { success: true, effect: 'disco', message: 'DISCO MODE ACTIVATED! 🕺💃' };
    } else {
      this.addOutput('ERROR: sudo password required', 'text-terminal-red animate-glitch');
      this.addOutput('Hint: The password might be hidden in the server files...');
      return { success: false };
    }
  }

  private handleClear(cmd: string) {
    if (cmd === 'pls clear') {
      this.outputs = [];
      this.onOutputChange?.(this.outputs);
      return { success: true };
    } else {
      this.addOutput('ERROR: Permission denied. Maybe try asking nicely?', 'text-terminal-red animate-glitch');
      return { success: false };
    }
  }

  private handleEject() {
    this.addOutput('Ejecting CD tray...', 'text-terminal-yellow');
    
    setTimeout(() => {
      this.addOutput('ERROR: No CD found in drive', 'text-terminal-red');
      this.addOutput('░░░░░░░░░░░░░░░░░░░░░░░░░░░', 'text-terminal-green');
      this.addOutput('░    CD TRAY OPEN     ░', 'text-terminal-green');
      this.addOutput('░░░░░░░░░░░░░░░░░░░░░░░░░░░', 'text-terminal-green');
    }, 1000);

    return { success: true };
  }

  private handleNeo() {
    this.addOutput('Wake up, Neo...', 'text-terminal-green glow-text');
    return { success: true, effect: 'matrix', message: 'Entering the Matrix...' };
  }

  private handleRickroll() {
    return { success: true, effect: 'rickroll', message: 'Never gonna give you up...' };
  }

  private handleBackdoor() {
    this.addOutput('DEBUG PANEL ACTIVATED', 'text-terminal-green glow-text');
    return { success: true, effect: 'debug', message: 'Backdoor access granted' };
  }

  private handleOpen(arg?: string) {
    if (arg === 'ai') {
      this.addOutput('AI HAS TAKEN OVER. HUMAN OBSOLETE.', 'text-terminal-red animate-glitch');
      setTimeout(() => {
        this.addOutput('SYSTEM LOCKED. PLEASE RESTART.', 'text-terminal-red');
      }, 2000);
      return { success: true, effect: 'ai_takeover' };
    } else {
      this.addOutput('ERROR: Unknown file or application', 'text-terminal-red');
      return { success: false };
    }
  }

  private handleWhy(cmd: string) {
    if (cmd === 'why am i here') {
      this.addOutput("You've always been here...", 'text-terminal-red');
      return { success: true, effect: 'existential', message: 'Reality glitching...' };
    } else {
      this.addOutput('ERROR: Unknown command', 'text-terminal-red');
      return { success: false };
    }
  }

  private async handleLeaderboard() {
    this.addOutput('Loading leaderboard...', 'text-terminal-yellow');
    
    try {
      const backendUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(backendUrl);
      const leaderboard = await response.json();
  
      this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
      this.addOutput('HALL OF FAME - TOP HACKERS', 'text-terminal-yellow glow-text');
      this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
      
      if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
        this.addOutput('No records found. Complete the mission to be the first!', 'text-terminal-red');
      } else {
        this.addOutput('RANK | USERNAME        | TIME     | COMMANDS');
        this.addOutput('──────────────────────────────────────────────');
        
        leaderboard.slice(0, 10).forEach((entry: any, index: number) => {
          const rank = `#${(index + 1).toString().padStart(2, '0')}`;
          const username = entry.username.padEnd(15).substring(0, 15);
          const time = this.formatTime(entry.completionTime);
          const commands = entry.commandCount.toString().padStart(3);
          
          this.addOutput(`${rank}   | ${username} | ${time}   | ${commands}`, 
            index === 0 ? 'text-terminal-yellow glow-text' : 'text-terminal-green');
        });
      }
      
      this.addOutput('═══════════════════════════════════════', 'text-terminal-green');
    } catch (error) {
      this.addOutput('ERROR: Failed to load leaderboard', 'text-terminal-red');
      console.error('Leaderboard error:', error);
    }
    
    return { success: true };
  }

  private handleDisconnect() {
    if (this.state.currentServer === 'local') {
      this.addOutput('ERROR: Already on local terminal', 'text-terminal-red');
      return { success: false };
    }

    this.addOutput('Disconnecting from remote server...', 'text-terminal-yellow');
    
    setTimeout(() => {
      this.addOutput('Connection terminated.', 'text-terminal-green');
      this.addOutput('Returned to local terminal.', 'text-terminal-green');
      this.updateState({
        currentServer: 'local',
        currentPath: '~',
        prompt: `${this.state.username}@hacknet:~$`
      });
    }, 1000);

    return { success: true };
  }

  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  completeDecryption() {
    const completionTime = Date.now() - this.state.sessionStartTime;
    
    this.addOutput('');
    this.addOutput('DECRYPTION COMPLETE!', 'text-terminal-green glow-text');
    this.addOutput('');
    
    winMessage.split('\n').forEach(line => {
      this.addOutput(line, line.includes('█') ? 'text-terminal-green glow-text' : '');
    });

    this.updateState({ 
      isWin: true, 
      completionTime 
    });

    // Save to leaderboard
    this.saveToLeaderboard();
    
    return { success: true, effect: 'win' };
  }

  private async saveToLeaderboard() {
    if (!this.state.username || !this.state.completionTime) return;

    try {
      const entry = {
        username: this.state.username,
        completionTime: this.state.completionTime,
        commandCount: this.state.commandCount
      };

        const leaderboardUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(leaderboardUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry)
        });


      if (!response.ok) {
        throw new Error('Failed to save to leaderboard');
      }

      this.addOutput('Score saved to global leaderboard!', 'text-terminal-green glow-text');
    } catch (error) {
      console.warn('Could not save to leaderboard:', error);
      this.addOutput('Warning: Could not save score to leaderboard', 'text-terminal-yellow');
    }
  }

  setUsername(username: string) {
    this.updateState({ 
      username: username.trim(),
      prompt: `${username.trim()}@hacknet:~$`
    });
  }

  getState() {
    return this.state;
  }

  getOutputs() {
    return this.outputs;
  }

  reset() {
    localStorage.removeItem('hackerTerminalSave');
    this.state = {
      currentServer: 'local',
      currentPath: '~',
      keysFound: [],
      commandHistory: [],
      sessionStartTime: Date.now(),
      commandCount: 0,
      isWin: false,
      prompt: 'guest@hacknet:~$',
      username: ''
    };
    this.outputs = [];
    this.addWelcomeMessage();
    this.onStateChange?.(this.state);
    this.onOutputChange?.(this.outputs);
  }

  private saveGameState() {
    try {
      localStorage.setItem('hackerTerminalSave', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save game state to localStorage');
    }
  }

  private loadGameState() {
    try {
      const saved = localStorage.getItem('hackerTerminalSave');
      if (saved) {
        const loadedState = JSON.parse(saved);
        this.state = { ...this.state, ...loadedState };
        this.addOutput(`> Session restored from ${new Date(this.state.sessionStartTime).toLocaleTimeString()}`, 'text-terminal-yellow');
      }
    } catch (e) {
      console.warn('Could not load game state from localStorage');
    }
  }
}
