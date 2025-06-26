<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import StartScreen from './components/StartScreen.vue';
import RoleAssignment from './components/RoleAssignment.vue';
import GamePlay from './components/GamePlay.vue';
import GameResults from './components/GameResults.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import locationsData from './i18n/locations.js';

// i18n
const { locale } = useI18n();

// Game state
const gamePhase = ref('start'); // 'start', 'roles', 'play', 'results'
const players = ref([]);
const selectedLocation = ref(null);
const gameResult = ref(null);
const selectedCategory = ref(null);

// Start a new game with the specified settings
const startGame = (gameSettings) => {
  // Reset game state
  players.value = [];
  gameResult.value = null;

  const playerCount = gameSettings.playerCount;
  const categoryIds = gameSettings.categoryIds;
  selectedCategory.value = categoryIds; // Now storing an array of category IDs

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
  let spyCount = 1; // Default to 1 spy

  if (gameSettings.spyOption === 'random') {
    // Randomly determine the number of spies between 1 and maxSpies
    spyCount = Math.floor(Math.random() * maxSpies) + 1;
  } else if (gameSettings.spyOption === 'custom') {
    // Use the custom spies count, but ensure it doesn't exceed maxSpies
    spyCount = Math.min(gameSettings.customSpiesCount, maxSpies);
  }
  // For 'single' option, spyCount remains 1

  // Assign the first spyCount indices as spies
  for (let i = 0; i < spyCount; i++) {
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

// Return to main menu
const returnToMenu = () => {
  gamePhase.value = 'start';
};

// Start a new game
const newGame = () => {
  gamePhase.value = 'start';
};
</script>

<template>
  <div class="app-container">
    <!-- Language Switcher (positioned differently on mobile vs desktop) -->
    <div class="hidden sm:block absolute top-4 left-4 z-50">
      <LanguageSwitcher />
    </div>

    <transition name="fade" mode="out-in" appear>
      <!-- Start Screen -->
      <StartScreen 
        v-if="gamePhase === 'start'" 
        @start-game="startGame" 
        key="start"
      />

      <!-- Role Assignment -->
      <RoleAssignment 
        v-else-if="gamePhase === 'roles'" 
        :players="players" 
        :location="selectedLocation" 
        @continue-to-game="continueToGame" 
        key="roles"
      />

      <!-- Game Play -->
      <GamePlay 
        v-else-if="gamePhase === 'play'" 
        :players="players" 
        :location="selectedLocation" 
        @game-over="handleGameOver"
        @returnToMenu="returnToMenu" 
        key="play"
      />

      <!-- Game Results -->
      <GameResults 
        v-else-if="gamePhase === 'results'" 
        :result="gameResult" 
        :location="selectedLocation" 
        :players="players" 
        @new-game="newGame" 
        key="results"
      />
    </transition>
    <!-- Footer -->
    <div class="absolute bottom-0 w-full py-2 text-center text-steel-gray text-sm bg-transparent">
      <p>&copy; 2025 Antonio Salinas</p>
    </div>
  </div>
</template>

<style>
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
