<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

// Sound effects
/*
 * Note: The sound file is a placeholder. Replace it with an actual sound file:
 * - timer.mp3: A sound that plays when the timer ends
 * 
 * Place the sound file in the public/sounds directory.
 */
const timerSound = new Audio('/sounds/timer.mp3');

// Helper function to play sounds with error handling
const playSound = (sound) => {
  sound.play().catch(error => {
    console.error(`Error playing sound:`, error);
  });
};

const props = defineProps({
  gameSettings: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['gameOver', 'returnToMainMenu']);
const { t } = useI18n();

// Game state
const teamNames = ref(props.gameSettings.teamNames);
const teamScores = ref([0, 0]);
const currentTeamIndex = ref(0); // Team currently guessing
const opposingTeamIndex = computed(() => (currentTeamIndex.value === 0) ? 1 : 0);
const currentWord = ref('');
const guessedWords = ref({
  0: [], // Words guessed by team 1 (from team 2's list)
  1: []  // Words guessed by team 2 (from team 1's list)
});
const remainingWords = ref({
  0: [...props.gameSettings.teamWords[1]], // Team 1 guesses words from team 2
  1: [...props.gameSettings.teamWords[0]]  // Team 2 guesses words from team 1
});

// Timer state
const timerActive = ref(false);
const timerStarted = ref(false);
const timeRemaining = ref(60); // 60 seconds per turn
const timerInterval = ref(null);

// Computed properties
const currentTeamName = computed(() => teamNames.value[currentTeamIndex.value]);
const opposingTeamName = computed(() => teamNames.value[opposingTeamIndex.value]);
const isGameOver = computed(() => {
  // Game is over when one team has guessed all words from the opposing team
  return remainingWords.value[0].length === 0 || remainingWords.value[1].length === 0;
});
const winningTeamIndex = computed(() => {
  if (!isGameOver.value) return null;

  // If both teams have guessed all words, the team with the higher score wins
  if (remainingWords.value[0].length === 0 && remainingWords.value[1].length === 0) {
    return teamScores.value[0] >= teamScores.value[1] ? 0 : 1;
  }

  // Otherwise, the team that guessed all words first wins
  if (remainingWords.value[0].length === 0) {
    return 0; // Team 1 won
  } else {
    return 1; // Team 2 won
  }
});
const winningTeamName = computed(() => {
  if (winningTeamIndex.value === null) return '';
  return teamNames.value[winningTeamIndex.value];
});

// Methods
const startTimer = () => {
  if (timerActive.value) return;

  timerActive.value = true;

  // Only reset the timer if it's the first time starting
  if (!timerStarted.value) {
    timerStarted.value = true;
    timeRemaining.value = 60;
  }

  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      // Play timer sound when time's up
      playSound(timerSound);

      // Time's up, switch teams
      endTurn(false);
    }
  }, 1000);
};

const pauseTimer = () => {
  if (!timerActive.value) return;

  timerActive.value = false;
  clearInterval(timerInterval.value);
};

const resetTimer = () => {
  pauseTimer();
  timeRemaining.value = 60;
  // Don't set timerStarted to false, keep it as true
  // Start the timer again immediately
  startTimer();
};

const getRandomWord = () => {
  if (remainingWords.value[currentTeamIndex.value].length === 0) {
    return '';
  }

  const randomIndex = Math.floor(Math.random() * remainingWords.value[currentTeamIndex.value].length);
  currentWord.value = remainingWords.value[currentTeamIndex.value][randomIndex];
};

const handleCorrectGuess = () => {
  // Add to guessed words
  guessedWords.value[currentTeamIndex.value].push(currentWord.value);

  // Remove from remaining words
  const wordIndex = remainingWords.value[currentTeamIndex.value].indexOf(currentWord.value);
  if (wordIndex !== -1) {
    remainingWords.value[currentTeamIndex.value].splice(wordIndex, 1);
  }

  // Increment score
  teamScores.value[currentTeamIndex.value]++;

  // Check if game is over
  if (isGameOver.value) {
    endGame();
    return;
  }

  // Get a new word
  getRandomWord();
};


const endTurn = (wasCorrect) => {
  pauseTimer();

  if (!wasCorrect) {
    // Switch to the other team
    currentTeamIndex.value = opposingTeamIndex.value;

    // Get a new word for the new team
    getRandomWord();
  }

  resetTimer();
};

const endGame = () => {
  pauseTimer();

  emit('gameOver', {
    winningTeamIndex: winningTeamIndex.value,
    winningTeamName: winningTeamName.value,
    teamScores: teamScores.value
  });
};

const returnToMainMenu = () => {
  pauseTimer();
  emit('returnToMainMenu');
};

// Initialize the game
onMounted(() => {
  getRandomWord();
});

// Clean up
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-background-soft)] p-3 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-8 text-center text-[var(--color-heading)]">{{ t('wordGuessingGame') }}</h1>

    <div class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-[98%] sm:max-w-md border border-[var(--color-border)]">
      <!-- Game Over Screen -->
      <div v-if="isGameOver" class="text-center">
        <h2 class="text-3xl font-semibold mb-8 text-center text-[var(--color-heading)]">{{ t('gameOver') }}</h2>

        <div class="mb-8">
          <p class="text-2xl mb-6 font-bold">{{ t('teamWins', { team: winningTeamName }) }}</p>

          <div class="bg-[var(--color-background-soft)]/70 p-6 rounded-xl border-2 border-[var(--color-border)] mb-6 shadow-md">
            <h3 class="text-xl font-semibold mb-4 text-[var(--color-heading)]">{{ t('finalScores') }}</h3>
            <div v-for="(score, index) in teamScores" :key="`score-${index}`" class="mb-3 last:mb-0 text-lg">
              <p>{{ teamNames[index] }}: <span class="font-bold text-[var(--color-text-highlight)] text-xl">{{ score }}</span></p>
            </div>
          </div>
        </div>

        <button
          @click="returnToMainMenu"
          class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-5 sm:py-4 px-6 rounded-xl text-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ t('returnToMainMenu') }}
        </button>
      </div>

      <!-- Active Game Screen -->
      <div v-else>
        <!-- Team Scores -->
        <div class="flex justify-between mb-8">
          <div 
            v-for="(score, index) in teamScores" 
            :key="`team-${index}`"
            class="text-center p-3 sm:p-4 rounded-xl w-[48%] shadow-md transition-all duration-300"
            :class="{ 
              'bg-[var(--color-button-primary)]/20 border-2 border-[var(--color-button-primary)] scale-105 transform': index === currentTeamIndex,
              'bg-[var(--color-background-soft)]/70 border border-[var(--color-border)]': index !== currentTeamIndex
            }"
          >
            <p class="font-semibold text-base sm:text-lg mb-1">{{ teamNames[index] }}</p>
            <p class="text-2xl sm:text-3xl font-bold" :class="{ 'text-[var(--color-button-primary)]': index === currentTeamIndex }">{{ score }}</p>
          </div>
        </div>

        <!-- Current Team's Turn -->
        <div class="mb-6 text-center">
          <h2 class="text-xl font-semibold mb-2 text-[var(--color-heading)]">
            {{ t('teamTurn', { team: currentTeamName }) }}
          </h2>
          <p class="text-sm text-[var(--color-text-secondary)]">
            {{ t('guessWordsFrom', { team: opposingTeamName }) }}
          </p>
        </div>

        <!-- Timer -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-semibold text-[var(--color-heading)]">{{ t('timer') }}</h3>
            <div class="text-2xl font-mono font-bold px-3 py-1 rounded-lg" 
              :class="{ 
                'text-[var(--color-button-primary-hover)] bg-[var(--color-button-primary-hover)]/10': timeRemaining < 10,
                'text-[var(--color-button-primary)]': timeRemaining >= 10
              }">
              {{ timeRemaining }}s
            </div>
          </div>

          <div class="w-full bg-[var(--color-background-soft)]/50 rounded-full h-3 mb-5">
            <div 
              class="bg-[var(--color-button-primary)] h-3 rounded-full transition-all duration-1000" 
              :style="{ width: `${(timeRemaining / 60) * 100}%` }"
              :class="{ 'bg-[var(--color-button-primary-hover)]': timeRemaining < 10 }"
            ></div>
          </div>

          <div class="flex justify-center space-x-3 sm:space-x-4">
            <button 
              v-if="!timerStarted"
              @click="startTimer"
              class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-lg font-semibold w-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('startGuessing') }}
            </button>
            <template v-else>
              <div class="flex justify-center space-x-3 sm:space-x-4 w-full">
                <button 
                  v-if="timerActive"
                  @click="pauseTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-base font-medium w-1/2 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ t('pauseTimer') }}
                </button>
                <button 
                  v-else
                  @click="startTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-base font-medium w-1/2 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ t('resumeTimer') }}
                </button>
                <button 
                  @click="resetTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-base font-medium w-1/2 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ t('restartTimer') }}
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Current Word -->
        <div v-if="timerStarted" class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-[var(--color-heading)]">{{ t('wordToGuess') }}</h3>
          <div class="bg-[var(--color-background-soft)]/70 p-6 sm:p-8 rounded-xl border-2 border-[var(--color-button-primary)] text-center shadow-lg transform transition-all duration-300 hover:scale-105">
            <p class="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-highlight)]">{{ currentWord }}</p>
          </div>
        </div>

        <!-- Guessing Controls -->
        <div v-if="timerStarted" class="mb-8 flex flex-col space-y-3">
          <button 
            @click="handleCorrectGuess"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-5 sm:py-4 px-6 rounded-xl text-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            :disabled="!timerActive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ t('correctGuess') }}
          </button>

        </div>

        <!-- Return to Main Menu -->
        <button
          @click="returnToMainMenu"
          class="w-full bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] py-4 sm:py-3 px-5 rounded-xl text-lg font-medium transition-all mt-4 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ t('returnToMainMenu') }}
        </button>
      </div>
    </div>
  </div>
</template>
