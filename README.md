# 🕹️ ao1codes' HACKNET

A retro terminal-based hacker simulation game built with React and TypeScript. Navigate through fake servers, execute commands, find hidden files, and uncover secret messages in this authentic CRT-styled terminal experience.

## Features

- **Authentic Terminal Experience** - Green-on-black CRT styling with retro fonts
- **Multi-Server Exploration** - Connect to different servers (ALPHA, BETA, GAMMA)
- **File System Simulation** - Navigate directories, read files, find hidden content
- **Easter Eggs & Effects** - Matrix rain, rickroll, disco mode, and more surprises
- **Global Leaderboard** - Compete with other players for fastest completion times
- **Sound Effects** - Retro terminal sounds and background audio
- **Persistent Game State** - Your progress is automatically saved
- **Responsive Design** - Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ao1codes/HACKNET
cd hacknet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variabless:
```bash
# Create a .env file with your database URL and VITE API URL
DATABASE_URL=your_database_url_here
VITE_API_URL=your_vite_api_url_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8081`

## How to Play

1. **Start the Game** - Type `help` to see available commands
2. **Scan for Servers** - Use `scan` to discover available servers
3. **Connect to Servers** - Use `connect <ip>` to access different servers
4. **Explore File Systems** - Navigate with `cd`, list files with `ls`, read with `cat`
5. **Find Key Fragments** - Search for hidden files and collect encryption keys
6. **Decrypt the Final File** - Use your collected keys to unlock the secret
7. **Complete the Mission** - Uncover the hidden message to win!

### Essential Commands
- `help` - Show all available commands
- `scan` - Discover available servers
- `connect <ip>` - Connect to a server
- `ls` - List files in current directory
- `cd <directory>` - Change directory
- `cat <filename>` - Read file contents
- `decrypt <filename>` - Decrypt encrypted files
- `clear` - Clear the terminal screen

### Easter Eggs 
Try these secret commands for fun effects:
- `neo` - Matrix rain effect
- `rickroll` - You know what this does
- `sudo dance` - Disco party mode
- `open ai` - AI takes over
- `eject` - CD tray animation

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query
- **Routing**: Wouter
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS with custom retro themes

## Leaderboard

The game features a global leaderboard that tracks completion times. Try to beat other players' records!

---