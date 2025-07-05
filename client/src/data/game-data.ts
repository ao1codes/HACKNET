export interface ServerFile {
  [key: string]: string | string[] | ServerFile;
}

export interface Server {
  name: string;
  files: ServerFile;
}

export const gameServers: Record<string, Server> = {
  local: {
    name: "LOCAL",
    files: {
      '~': ['help.txt', 'readme.md', 'scan.exe', 'cheat-sheet.txt'],
      'help.txt': 'Available commands: help, scan, connect, ls, cd, cat, decrypt, sudo, clear, eject, neo, rickroll, backdoor\n\nHidden commands: open ai, why am i here, sudo dance',
      'readme.md': 'WELCOME TO THE UNDERGROUND NETWORK ACCESS TERMINAL\n\nYour mission: Retrieve and decrypt project-x.omega from the secure servers.\n\nStart by running "scan" to find available servers.',
      'scan.exe': 'Executable file - Use "scan" command to run network scan',
      'cheat-sheet.txt': 'HACKER TERMINAL WALKTHROUGH\n\n════════════════════════════════════════\nSTEP-BY-STEP GUIDE TO WIN THE GAME\n════════════════════════════════════════\n\n1. START YOUR MISSION\n   → Type "scan" to find available servers\n   → You\'ll see 3 servers: ALPHA, BETA, and GAMMA\n\n2. CONNECT TO ALPHA SERVER\n   → Type "connect 192.168.1.100"\n   → Use "ls" to see available files\n   → Read "notes.txt" with "cat notes.txt"\n\n3. FIND THE FIRST KEY\n   → Go to trash folder: "cd trash"\n   → List hidden files: "ls"\n   → Read the hidden file: "cat .hidden"\n   → You\'ll get a mysterious Key Fragment.\n\n4. CONNECT TO BETA SERVER\n   → Type "connect 10.0.0.50"\n   → Read "ai.log" with "cat ai.log"\n   → Check system folder: "cd system"\n   → Read "decrypt.key" with "cat decrypt.key"\n   → You\'ll get a mysterious Key Fragment.\n\n5. DECRYPT THE FINAL FILE\n   → Go back to home: "cd ~"\n   → Try to decrypt: "decrypt project-x.omega.enc"\n   → With 2 key fragments, the decryption will start\n   → Wait for the process to complete\n\n6. VICTORY!\n   → The game will show you the secret document\n   → You\'ve successfully completed the mission\n\n════════════════════════════════════════\nPRO TIPS:\n════════════════════════════════════════\n→ The game saves your progress automatically\n→ Use arrow keys for command history\n→ Hidden files start with a dot (.)\n→ Read everything - clues are everywhere\n→ Some commands require specific syntax\n→ GAMMA server is offline (sorry!)\n\nGood luck, hacker!'
    }
  },
  alpha: {
    name: "ALPHA-SERVER",
    files: {
      '~': ['notes.txt', 'trash/', 'system.log'],
      'notes.txt': 'ALPHA SERVER ACCESS LOG\n\nKey fragment 1 is hidden in the trash directory.\nLook for hidden files (files starting with .)\n\nSecurity Level: MEDIUM\nAccess: GRANTED',
      'trash/': ['.hidden', 'junk.log', 'temp.bak'],
      'trash/.hidden': 'CLASSIFIED KEY FRAGMENT\n\nKEY_FRAGMENT_1: ALPHA_UNLOCK_7F3A\n\nThis fragment is part of the master decryption key.\nFind all fragments to unlock project-x.omega.',
      'trash/junk.log': 'System cleanup log\n\n[2024-01-15] Temporary files deleted\n[2024-01-16] Cache cleared\n[2024-01-17] Nothing important here, move along.',
      'trash/temp.bak': 'Backup file - corrupted data\n\n01110100 01110010 01100001 01110011 01101000',
      'system.log': 'ALPHA SYSTEM LOG\n\n[INFO] Server operational\n[WARN] Unauthorized access attempts detected\n[INFO] Security protocols active\n\nHint: Check the trash for valuable items.'
    }
  },
  beta: {
    name: "BETA-SERVER",
    files: {
      '~': ['ai.log', 'system/', 'project-x.omega.enc', 'access.key'],
      'ai.log': 'ARTIFICIAL INTELLIGENCE INTERACTION LOG\n\nAI: Hello, human. I see you have made it this far.\nAI: I possess the second key fragment you seek.\nAI: KEY_FRAGMENT_2: BETA_SECURE_9X2B\nAI: Use it wisely. The final server awaits.',
      'system/': ['core.sys', 'decrypt.key', 'config.ini'],
      'system/core.sys': 'BETA SYSTEM CORE\n\nStatus: OPERATIONAL\nSecurity: MAXIMUM\nEncryption: AES-256\n\nCore system files protected.',
      'system/decrypt.key': 'DECRYPTION KEY STORAGE\n\nKEY_FRAGMENT_2: BETA_SECURE_9X2B\n\nFragment 2 of 2 acquired.\nCombine with other fragments for master key.',
      'system/config.ini': '[SYSTEM]\nserver_name=beta\nsecurity_level=high\nencryption=enabled\n\n[ACCESS]\nrequired_fragments=2\ncurrent_fragments=0',
      'project-x.omega.enc': 'ENCRYPTED FILE: PROJECT-X.OMEGA\n\n████████████████████████\n█ CLASSIFIED DOCUMENT █\n████████████████████████\n\nThis file requires 2 key fragments to decrypt.\nUse: decrypt project-x.omega.enc\n\nCurrent status: LOCKED',
      'access.key': 'BETA SERVER ACCESS KEY\n\nAccess granted to authorized personnel only.\nFor additional security clearance, contact system administrator.\n\nWarning: Unauthorized access is monitored.'
    }
  }
};

export const availableServers = [
  { ip: '192.168.1.100', name: 'ALPHA-SERVER', status: 'SECURE', key: 'alpha' },
  { ip: '10.0.0.50', name: 'BETA-SERVER', status: 'ENCRYPTED', key: 'beta' },
  { ip: '172.16.0.1', name: 'GAMMA-SERVER', status: 'OFFLINE', key: 'gamma' }
];

export const easterEggs = {
  neo: {
    message: 'Wake up, Neo...',
    effect: 'matrix'
  },
  rickroll: {
    message: 'Never gonna give you up, never gonna let you down...',
    effect: 'rickroll'
  },
  'sudo dance': {
    message: 'DISCO MODE ACTIVATED! 🕺💃',
    effect: 'disco'
  },
  'open ai': {
    message: 'AI HAS TAKEN OVER. HUMAN OBSOLETE.',
    effect: 'ai_takeover'
  },
  'why am i here': {
    message: "You've always been here...",
    effect: 'existential'
  }
};

export const rickrollAscii = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀
⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀
⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀
⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀
⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀
⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⢀⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⡿⢿⣿⣿⣿⣿⣿⡟⠀⠀
⠀⠘⣿⣿⣦⣀⣿⣿⡇⠀⠀⠀⠀⠀⠈⠛⠻⠿⠟⠋⠀⠘⠛⠿⠿⠿⠋⠀⠀⠀

NEVER GONNA GIVE YOU UP!
NEVER GONNA LET YOU DOWN!
NEVER GONNA RUN AROUND AND DESERT YOU!
`;

export const winMessage = `
████████████████████████████████████████████████████████████████
█                                                              █
█  CONGRATULATIONS! YOU'VE SUCCESSFULLY DECRYPTED PROJECT-X.OMEGA █
█                                                              █
████████████████████████████████████████████████████████████████

CLASSIFIED DOCUMENT - LEVEL OMEGA CLEARANCE

Subject: The Truth About Reality
Classification: BEYOND TOP SECRET

The cake is a lie.

Congratulations, you've mastered the art of fake hacking!
You have successfully navigated through our simulated network,
found all the key fragments, and unlocked the ultimate secret.

Your hacking skills are now certified at Level 1 Script Kiddie.
Please proceed to collect your complimentary energy drink and
hoodie from the nearest cybercafe.

Remember: With great power comes great responsibility.
Use your newfound "skills" wisely.

- The Management

P.S. The real treasure was the commands you learned along the way.
`;
