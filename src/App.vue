<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import MainMenu from './components/MainMenu.vue';
import StartScreen from './components/StartScreen.vue';
import RoleAssignment from './components/RoleAssignment.vue';
import GamePlay from './components/GamePlay.vue';
import GameResults from './components/GameResults.vue';
import WordGuessingSetup from './components/WordGuessingSetup.vue';
import WordGuessingGame from './components/WordGuessingGame.vue';
import TownGameSetup from './components/TownGameSetup.vue';
import TownGame from './components/TownGame.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import locationsData from './i18n/locations.js';

// i18n
const { locale } = useI18n();

// App state
const selectedGame = ref(null); // 'spy' or 'wordGuessing' or 'townGame' or null (main menu)

// Function to update theme color meta tag
const updateThemeColor = (game) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    if (game === 'spy') {
      metaThemeColor.setAttribute('content', '#000000'); // Black for spy game
    } else if (game === 'wordGuessing') {
      metaThemeColor.setAttribute('content', '#FFF8E7'); // Light beige for word guessing game
    } else if (game === 'townGame') {
      metaThemeColor.setAttribute('content', '#121212'); // Dark theme for town game
    } else {
      metaThemeColor.setAttribute('content', '#1E1E2F'); // Dark blue for main menu
    }
  }
};

// Watch for changes in selectedGame and update theme color
watch(selectedGame, (newGame) => {
  updateThemeColor(newGame);
});

// Initialize theme color on component mount
onMounted(() => {
  updateThemeColor(selectedGame.value);
});

// Spy Game state
const gamePhase = ref('start'); // 'start', 'roles', 'play', 'results'
const players = ref([]);
const selectedLocation = ref(null);
const gameResult = ref(null);
const selectedCategory = ref(null);
const spyOption = ref('single');
const spyCount = ref(1);

// Word Guessing Game state
const wordGuessingPhase = ref('setup'); // 'setup', 'play', 'results'
const wordGuessingSettings = ref(null);
const wordGuessingResult = ref(null);

// Town Game state
const townGamePhase = ref('setup'); // 'setup', 'play', 'results'
const townGameSettings = ref(null);
const townGameResult = ref(null);

// Handle game selection from main menu
const handleSelectGame = (gameType) => {
  selectedGame.value = gameType;
  if (gameType === 'spy') {
    gamePhase.value = 'start';
  } else if (gameType === 'wordGuessing') {
    wordGuessingPhase.value = 'setup';
    wordGuessingSettings.value = null;
    wordGuessingResult.value = null;
  } else if (gameType === 'townGame') {
    townGamePhase.value = 'setup';
    townGameSettings.value = null;
    townGameResult.value = null;
  }
};

// Word Guessing Game handlers
const startWordGuessingGame = (settings) => {
  wordGuessingSettings.value = settings;
  wordGuessingPhase.value = 'play';
};

const handleWordGuessingGameOver = (result) => {
  wordGuessingResult.value = result;
  wordGuessingPhase.value = 'results';
};

// Town Game handlers
const startTownGame = (settings) => {
  townGameSettings.value = settings;
  townGamePhase.value = 'play';
};

const handleTownGameOver = (result) => {
  townGameResult.value = result;
  townGamePhase.value = 'results';
};

// Start a new game with the specified settings
const startGame = (gameSettings) => {
  // Reset game state
  players.value = [];
  gameResult.value = null;

  const playerCount = gameSettings.playerCount;
  const categoryIds = gameSettings.categoryIds;
  selectedCategory.value = categoryIds; // Now storing an array of category IDs

  // Store spy options
  spyOption.value = gameSettings.spyOption;

  // Create player objects
  for (let i = 0; i < playerCount; i++) {
    players.value.push({
      id: i,
      isSpy: false
    });
  }

  // Assign spies based on the selected spy option
  // Create an array of player indices and shuffle it
  const indices = Array.from({ length: playerCount }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]; // Swap elements
  }

  // Calculate the maximum number of spies (playerCount - 2) to ensure at least 2 non-spy players
  const maxSpies = playerCount - 2;
  let spiesCount = 1; // Default to 1 spy

  if (gameSettings.spyOption === 'random') {
    // Randomly determine the number of spies between 1 and maxSpies
    spiesCount = Math.floor(Math.random() * maxSpies) + 1;
  } else if (gameSettings.spyOption === 'custom') {
    // Use the custom spies count, but ensure it doesn't exceed maxSpies
    spiesCount = Math.min(gameSettings.customSpiesCount, maxSpies);
  }
  // For 'single' option, spiesCount remains 1

  // Store the spy count
  spyCount.value = spiesCount;

  // Assign the first spiesCount indices as spies
  for (let i = 0; i < spiesCount; i++) {
    players.value[indices[i]].isSpy = true;
  }

  // Get locations based on selected categories
  let availableLocations = [];

  // Get categories to use (all categories except 'all')
  const categoriesToUse = categoryIds.includes('all') 
    ? locationsData[locale.value].categories.map(cat => cat.id) 
    : categoryIds;

  // Combine locations from all selected categories
  categoriesToUse.forEach(categoryId => {
    // Skip the 'all' category as it's not a real category
    if (categoryId === 'all') return;

    const category = locationsData[locale.value].categories.find(cat => cat.id === categoryId);
    if (category) {
      availableLocations = availableLocations.concat(category.locations);
    }
  });

  // If no locations are available (shouldn't happen with our UI logic), use all locations
  if (availableLocations.length === 0) {
    availableLocations = locationsData.getAllLocations(locale.value);
  }

  // Randomly select a location from available locations
  selectedLocation.value = availableLocations[Math.floor(Math.random() * availableLocations.length)].name;

  // Move to role assignment phase
  gamePhase.value = 'roles';
};

// Continue to gameplay after roles have been assigned
const continueToGame = () => {
  gamePhase.value = 'play';
};

// Handle game over
const handleGameOver = (result) => {
  gameResult.value = result;
  gamePhase.value = 'results';
};

// Return to spy game menu
const returnToMenu = () => {
  gamePhase.value = 'start';
};

// Start a new spy game
const newGame = () => {
  gamePhase.value = 'start';
};

// Return to main menu
const returnToMainMenu = () => {
  selectedGame.value = null;
  gamePhase.value = 'start';
};
</script>

<template>
  <div class="app-container" :class="{ 'menu-theme': selectedGame === null, 'spy-theme': selectedGame === 'spy', 'word-guessing-theme': selectedGame === 'wordGuessing', 'town-game-theme': selectedGame === 'townGame' }">
    <!-- Top navigation bar with back button and language switcher -->
    <div class="fixed top-0 left-0 right-0 flex justify-between items-center p-3 z-50 bg-[var(--color-background)]/80 backdrop-blur-sm" v-if="selectedGame !== null">
      <button 
        @click="returnToMainMenu" 
        class="flex items-center justify-center p-2 rounded-full hover:bg-[var(--color-background-soft)] transition-all"
        aria-label="Return to main menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <LanguageSwitcher />
    </div>

    <!-- Add padding to content when nav bar is present -->
    <div :class="{ 'pt-14': selectedGame !== null }">
      <transition name="fade" mode="out-in" appear>
      <!-- Main Menu -->
      <MainMenu 
        v-if="selectedGame === null" 
        @selectGame="handleSelectGame" 
        key="main-menu"
      />

      <!-- Spy Game -->
      <template v-else-if="selectedGame === 'spy'">
        <!-- Start Screen -->
        <StartScreen 
          v-if="gamePhase === 'start'" 
          @start-game="startGame" 
          @returnToMainMenu="returnToMainMenu"
          key="spy-start"
        />

        <!-- Role Assignment -->
        <RoleAssignment 
          v-else-if="gamePhase === 'roles'" 
          :players="players" 
          :location="selectedLocation" 
          @continue-to-game="continueToGame" 
          key="spy-roles"
        />

        <!-- Game Play -->
        <GamePlay 
          v-else-if="gamePhase === 'play'" 
          :players="players" 
          :location="selectedLocation" 
          :spyOption="spyOption"
          :spyCount="spyCount"
          @game-over="handleGameOver"
          @returnToMenu="returnToMenu" 
          key="spy-play"
        />

        <!-- Game Results -->
        <GameResults 
          v-else-if="gamePhase === 'results'" 
          :result="gameResult" 
          :location="selectedLocation" 
          :players="players" 
          @new-game="newGame" 
          @returnToMainMenu="returnToMainMenu"
          key="spy-results"
        />
      </template>

      <!-- Word Guessing Game -->
      <template v-else-if="selectedGame === 'wordGuessing'">
        <!-- Setup Phase -->
        <WordGuessingSetup 
          v-if="wordGuessingPhase === 'setup'" 
          @startGame="startWordGuessingGame" 
          @returnToMainMenu="returnToMainMenu"
          key="word-guessing-setup"
        />

        <!-- Play Phase -->
        <WordGuessingGame 
          v-else-if="wordGuessingPhase === 'play' || wordGuessingPhase === 'results'" 
          :gameSettings="wordGuessingSettings" 
          @gameOver="handleWordGuessingGameOver"
          @returnToMainMenu="returnToMainMenu"
          key="word-guessing-play"
        />

        <!-- Results Phase (handled within the game component) -->
      </template>

      <!-- Town Game (El Pueblo Duerme) -->
      <template v-else-if="selectedGame === 'townGame'">
        <!-- Setup Phase -->
        <TownGameSetup 
          v-if="townGamePhase === 'setup'" 
          @startGame="startTownGame" 
          @returnToMainMenu="returnToMainMenu"
          key="town-game-setup"
        />

        <!-- Play Phase -->
        <TownGame 
          v-else-if="townGamePhase === 'play' || townGamePhase === 'results'" 
          :gameSettings="townGameSettings" 
          @gameOver="handleTownGameOver"
          @returnToMainMenu="returnToMainMenu"
          key="town-game-play"
        />

        <!-- Results Phase (handled within the game component) -->
      </template>
    </transition>
    <!-- Footer -->
    <div class="absolute bottom-0 w-full py-2 text-center text-steel-gray text-sm bg-transparent">
      <p>&copy; 2025 Antonio Salinas</p>
    </div>
  </div>
  </div>
</template>

<style>
/* Menu Theme - Modern, sobrio y limpio */
.menu-theme {
  --color-background: #1E1E2F; /* azul oscuro casi negro */
  --color-text: #FFFFFF; /* blanco */
  --color-text-secondary: #A0A0B8; /* gris claro azulado */
  --color-button-primary: #4B61FF; /* azul eléctrico */
  --color-button-primary-hover: #6879FF; /* azul más claro */
  --color-button-text: #FFFFFF; /* blanco */
  --color-border: #35364A; /* azul grisáceo oscuro */

  /* Update semantic colors */
  --color-heading: var(--color-text);
  --color-primary: var(--color-button-primary);
  --color-secondary: var(--color-button-primary-hover);
  --color-accent: var(--color-text-secondary);
  --color-background-soft: #2A2A3F; /* slightly lighter than background */
  --color-background-mute: #2A2A3F;
  --color-steel-gray: var(--color-text-secondary);
  --color-yellow: var(--color-button-primary);
  --color-mustard: var(--color-button-primary-hover);
}

/* Spy Game Theme - Original dark theme */
.spy-theme {
  --color-background: var(--color-black);
  --color-text: var(--color-white);
  --color-heading: var(--color-yellow);
  --color-primary: var(--color-yellow);
  --color-secondary: var(--color-mustard);
  --color-accent: var(--color-steel-gray);
  --color-background-soft: var(--color-dark-gray);
  --color-background-mute: var(--color-dark-gray);
  --color-button-primary: var(--color-yellow);
  --color-button-primary-hover: var(--color-mustard);
  --color-button-text: var(--color-black);
}

/* Word Guessing Theme - Alegre, energético y divertido */
.word-guessing-theme {
  --color-background: #FFF8E7; /* beige claro */
  --color-text: #3D405B; /* azul marino suave */
  --color-text-highlight: #F25F5C; /* rojo coral vibrante */
  --color-button-primary: #F4A261; /* naranja suave */
  --color-button-primary-hover: #E76F51; /* rojo anaranjado */
  --color-button-text: #FFFFFF; /* blanco */
  --color-border: #264653; /* azul petróleo oscuro */

  /* Update semantic colors */
  --color-heading: var(--color-text-highlight);
  --color-primary: var(--color-button-primary);
  --color-secondary: var(--color-button-primary-hover);
  --color-accent: var(--color-border);
  --color-background-soft: #F9F2E0; /* slightly darker than background */
  --color-background-mute: #F9F2E0;
  --color-steel-gray: #8D8FA1; /* muted version of text color */
  --color-yellow: var(--color-button-primary);
  --color-mustard: var(--color-button-primary-hover);
}

/* Town Game Theme - Misterioso, nocturno y envolvente */
.town-game-theme {
  --color-background: #121212; /* fondo oscuro */
  --color-text: #FFFFFF; /* texto blanco */
  --color-text-secondary: #A0A0B8; /* gris claro azulado */
  --color-button-primary: #4B61FF; /* azul eléctrico */
  --color-button-primary-hover: #6879FF; /* azul más claro */
  --color-button-text: #FFFFFF; /* blanco */
  --color-border: #35364A; /* azul grisáceo oscuro */
  --color-accent-red: #FF4E4E; /* rojo para el asesino */

  /* Update semantic colors */
  --color-heading: var(--color-text);
  --color-primary: var(--color-button-primary);
  --color-secondary: var(--color-button-primary-hover);
  --color-accent: var(--color-accent-red);
  --color-background-soft: #1A1A2E; /* slightly lighter than background */
  --color-background-mute: #2A2A3F;
  --color-steel-gray: var(--color-text-secondary);
  --color-yellow: var(--color-button-primary);
  --color-mustard: var(--color-button-primary-hover);
}

.app-container {
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color var(--transition-normal), color var(--transition-normal);
  overflow-x: hidden; /* Prevent horizontal scrolling on mobile */
  position: relative; /* For absolute positioning of footer */
  padding-bottom: 2rem; /* Space for footer */
  /* Safe area insets for iPhone notch */
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-left: env(safe-area-inset-left);
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
}
</style>
