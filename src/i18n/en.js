export default {
  // App title
  gameTitle: 'The Spy Game',

  // Common
  yes: 'Yes',
  no: 'No',

  // StartScreen.vue
  gameSetup: 'Game Setup',
  playerCount: 'Number of Players:',
  minMax: 'Minimum: {min}, Maximum: {max}',
  multipleSpies: 'Multiple Spies:',
  multipleSpiesHelp: 'Enable this option to have a random number of spies. There will always be at least 2 non-spy players.',
  categories: 'Categories:',
  categoryHelp: 'Select one or more categories. If you select "All Categories", other selections will be ignored.',
  expandCategories: 'Expand',
  collapseCategories: 'Collapse',
  startGame: 'Start Game',
  howToPlay: 'How to Play:',
  howToPlaySteps: {
    1: '1. Each player will receive a role: spy or regular player.',
    2: '2. Regular players will know the secret location.',
    3: '3. The spies must discover the location without revealing their identity.',
    4: '4. Regular players must identify the spies.'
  },
  allCategories: 'All Categories',

  // RoleAssignment.vue
  player: 'Player {number}',
  prepareRole: 'Get ready to see your role. Make sure no one else can see the screen.',
  viewRole: 'View My Role',
  yourRole: 'Your Role:',
  spy: 'SPY',
  regularPlayer: 'REGULAR PLAYER',
  location: 'Location:',
  spyObjective: 'You are a spy. Your objective is to discover the secret location without revealing your identity.',
  regularObjective: 'You know the location. Your objective is to identify the spies without revealing too much information about the location.',
  nextPlayer: 'Next Player',
  startGameButton: 'Start Game',

  // GamePlay.vue
  gameMenu: 'Game Menu',
  continueGame: 'Continue Playing',
  endGameReturnMenu: 'End Game and Return to Main Menu',
  timer: 'Timer',
  pauseTimer: 'Pause Timer',
  resumeTimer: 'Resume Timer',
  endGame: 'End Game',
  gameDiscussion: 'Discuss and discover who are the spies before time runs out.',
  gameFinished: 'Game finished',

  // GameResults.vue
  gameOver: 'Game Over',
  spyWins: 'The Spies Win!',
  playersWin: 'The Players Win!',
  theSpyWas: 'The Spy was:',
  theSpiesWere: 'The Spies were:',
  playAgain: 'Play Again',

  // Categories
  categories_list: {
    lugares: 'Places',
    objetos: 'Objects',
    profesiones: 'Professions',
    marcas: 'Brands',
    comida: 'Food',
    animales: 'Animals',
    peliculas: 'Movies',
    emociones: 'Emotions',
    naturaleza: 'Nature',
    acciones: 'Actions',
    entretenimiento: 'Entertainment',
    transporte: 'Transportation',
    comercio: 'Commerce',
    vacaciones: 'Vacation'
  }
};
