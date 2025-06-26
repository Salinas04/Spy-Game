export default {
  // App title
  gameTitle: 'El Juego del Espía',
  mainMenuTitle: 'Colección de Juegos',

  // Menu
  selectGame: 'Selecciona un Juego',
  spyGame: 'El Juego del Espía',
  wordGuessingGame: 'Juego de Adivinar Palabras',
  returnToMainMenu: 'Volver al Menú Principal',

  // Common
  yes: 'Sí',
  no: 'No',
  spyOptions: 'Opciones de Espías:',
  singleSpy: 'Un Solo Espía',
  randomSpies: 'Espías Múltiples Aleatorios',
  customSpies: 'Espías Personalizados',
  customSpiesCount: 'Número de Espías:',
  customSpiesHelp: 'Introduce el número de espías que deseas. Siempre habrá al menos 2 jugadores que no sean espías.',

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

  // WordGuessingSetup.vue
  maxWordsPerTeam: 'Máximo de Palabras por Equipo:',
  maxWordsHelp: 'Establece el número de palabras que cada equipo debe ingresar.',
  teamSetup: 'Configuración de Equipos',
  teamName: 'Nombre del Equipo {number}:',
  enterWordsForTeam: 'Ingresa Palabras para {team}',
  enterWord: 'Ingresa una palabra...',
  addWord: 'Añadir',
  wordsRemaining: '{count} palabras restantes',
  noWordsYet: 'Aún no hay palabras añadidas',
  previousTeam: 'Equipo Anterior',
  nextTeam: 'Siguiente Equipo',

  // WordGuessingGame.vue
  teamTurn: 'Turno de {team}',
  guessWordsFrom: 'Adivina palabras de {team}',
  startGuessing: 'Comenzar a Adivinar',
  wordToGuess: 'Palabra a Adivinar:',
  correctGuess: '¡Correcto!',
  incorrectGuess: 'Incorrecto',
  teamWins: '¡{team} Gana!',
  finalScores: 'Puntuaciones Finales:',

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
