export default {
  // App title
  gameTitle: 'El Juego del Espía',
  
  // StartScreen.vue
  gameSetup: 'Configuración del Juego',
  playerCount: 'Número de Jugadores:',
  minMax: 'Mínimo: {min}, Máximo: {max}',
  categories: 'Categorías:',
  categoryHelp: 'Selecciona una o más categorías. Si seleccionas "Todas las Categorías", se ignorarán las demás selecciones.',
  startGame: 'Comenzar Juego',
  howToPlay: 'Cómo Jugar:',
  howToPlaySteps: {
    1: '1. Cada jugador recibirá un rol: espía o jugador regular.',
    2: '2. Los jugadores regulares conocerán la ubicación secreta.',
    3: '3. El espía debe descubrir la ubicación sin revelar su identidad.',
    4: '4. Los jugadores regulares deben identificar al espía.'
  },
  allCategories: 'Todas las Categorías',
  
  // RoleAssignment.vue
  player: 'Jugador {number}',
  prepareRole: 'Prepárate para ver tu rol. Asegúrate que nadie más pueda ver la pantalla.',
  viewRole: 'Ver mi Rol',
  yourRole: 'Tu Rol:',
  spy: 'ESPÍA',
  regularPlayer: 'JUGADOR REGULAR',
  location: 'Ubicación:',
  spyObjective: 'Eres el espía. Tu objetivo es descubrir la ubicación secreta sin revelar tu identidad.',
  regularObjective: 'Conoces la ubicación. Tu objetivo es identificar al espía sin revelar demasiada información sobre la ubicación.',
  nextPlayer: 'Siguiente Jugador',
  startGameButton: 'Comenzar Juego',
  
  // GamePlay.vue
  gameMenu: 'Menú del Juego',
  continueGame: 'Continuar Jugando',
  endGameReturnMenu: 'Terminar Juego y Volver al Menú Principal',
  timer: 'Temporizador',
  pauseTimer: 'Pausar Temporizador',
  resumeTimer: 'Reanudar Temporizador',
  endGame: 'Finalizar Juego',
  gameDiscussion: 'Discutan y descubran quién es el espía antes de que se acabe el tiempo.',
  gameFinished: 'Juego finalizado',
  
  // GameResults.vue
  gameOver: 'Fin del Juego',
  spyWins: '¡El Espía Gana!',
  playersWin: '¡Los Jugadores Ganan!',
  theSpyWas: 'El Espía era:',
  playAgain: 'Jugar de Nuevo',
  
  // Categories
  categories_list: {
    lugares_publicos: 'Lugares Públicos',
    entretenimiento: 'Entretenimiento',
    transporte: 'Transporte',
    comercio: 'Comercio',
    vacaciones: 'Vacaciones'
  }
};