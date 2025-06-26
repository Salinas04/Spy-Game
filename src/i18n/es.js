export default {
  // App title
  gameTitle: 'El Juego del Espía',

  // Common
  yes: 'Sí',
  no: 'No',

  // StartScreen.vue
  gameSetup: 'Configuración del Juego',
  playerCount: 'Número de Jugadores:',
  minMax: 'Mínimo: {min}, Máximo: {max}',
  multipleSpies: 'Espías Múltiples:',
  multipleSpiesHelp: 'Activa esta opción para tener un número aleatorio de espías. Siempre habrá al menos 2 jugadores que no sean espías.',
  categories: 'Categorías:',
  categoryHelp: 'Selecciona una o más categorías. Si seleccionas "Todas las Categorías", se ignorarán las demás selecciones.',
  expandCategories: 'Expandir',
  collapseCategories: 'Colapsar',
  startGame: 'Comenzar Juego',
  howToPlay: 'Cómo Jugar:',
  howToPlaySteps: {
    1: '1. Cada jugador recibirá un rol: espía o jugador regular.',
    2: '2. Los jugadores regulares conocerán la ubicación secreta.',
    3: '3. Los espías deben descubrir la ubicación sin revelar su identidad.',
    4: '4. Los jugadores regulares deben identificar a los espías.'
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
  spyObjective: 'Eres un espía. Tu objetivo es descubrir la ubicación secreta sin revelar tu identidad.',
  regularObjective: 'Conoces la ubicación. Tu objetivo es identificar a los espías sin revelar demasiada información sobre la ubicación.',
  nextPlayer: 'Siguiente Jugador',
  startGameButton: 'Comenzar Juego',
  word: 'Palabra:',

  // GamePlay.vue
  gameMenu: 'Menú del Juego',
  continueGame: 'Continuar Jugando',
  endGameReturnMenu: 'Terminar Juego y Volver al Menú Principal',
  timer: 'Temporizador',
  pauseTimer: 'Pausar Temporizador',
  resumeTimer: 'Reanudar Temporizador',
  endGame: 'Finalizar Juego',
  gameDiscussion: 'Discutan y descubran quiénes son los espías antes de que se acabe el tiempo.',
  gameFinished: 'Juego finalizado',

  // GameResults.vue
  gameOver: 'Fin del Juego',
  spyWins: '¡Los Espías Ganan!',
  playersWin: '¡Los Jugadores Ganan!',
  theSpyWas: 'El Espía era:',
  theSpiesWere: 'Los Espías eran:',
  playAgain: 'Jugar de Nuevo',

  // Categories
  categories_list: {
    lugares: 'Lugares',
    objetos: 'Objetos',
    profesiones: 'Profesiones',
    marcas: 'Marcas',
    comida: 'Comida',
    animales: 'Animales',
    peliculas: 'Películas',
    emociones: 'Emociones',
    naturaleza: 'Naturaleza',
    acciones: 'Acciones',
    entretenimiento: 'Entretenimiento',
    transporte: 'Transporte',
    comercio: 'Comercio',
    vacaciones: 'Vacaciones'
  }
};
