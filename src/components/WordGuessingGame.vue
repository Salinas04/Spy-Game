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
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-background-soft)] p-2 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-[var(--color-heading)]">{{ t('wordGuessingGame') }}</h1>

    <div class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-[var(--color-border)]">
      <!-- Game Over Screen -->
      <div v-if="isGameOver" class="text-center">
        <h2 class="text-2xl font-semibold mb-6 text-center text-[var(--color-heading)]">{{ t('gameOver') }}</h2>

        <div class="mb-6">
          <p class="text-xl mb-4">{{ t('teamWins', { team: winningTeamName }) }}</p>

          <div class="bg-[var(--color-background-soft)]/70 p-4 rounded-lg border border-[var(--color-border)] mb-4">
            <h3 class="text-lg font-semibold mb-2 text-[var(--color-heading)]">{{ t('finalScores') }}</h3>
            <div v-for="(score, index) in teamScores" :key="`score-${index}`" class="mb-2 last:mb-0">
              <p>{{ teamNames[index] }}: <span class="font-bold text-[var(--color-text-highlight)]">{{ score }}</span></p>
            </div>
          </div>
        </div>

        <button
          @click="returnToMainMenu"
          class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {{ t('returnToMainMenu') }}
        </button>
      </div>

      <!-- Active Game Screen -->
      <div v-else>
        <!-- Team Scores -->
        <div class="flex justify-between mb-6">
          <div 
            v-for="(score, index) in teamScores" 
            :key="`team-${index}`"
            class="text-center p-2 sm:p-3 rounded-lg w-[48%] sm:w-auto"
            :class="{ 'bg-[var(--color-button-primary)]/20 border border-[var(--color-button-primary)]': index === currentTeamIndex }"
          >
            <p class="font-semibold text-sm sm:text-base">{{ teamNames[index] }}</p>
            <p class="text-xl sm:text-2xl font-bold">{{ score }}</p>
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
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-[var(--color-heading)]">{{ t('timer') }}</h3>
            <div class="text-xl font-mono font-bold" :class="{ 'text-[var(--color-button-primary-hover)]': timeRemaining < 10 }">
              {{ timeRemaining }}s
            </div>
          </div>

          <div class="w-full bg-[var(--color-background-soft)]/50 rounded-full h-2.5 mb-4">
            <div 
              class="bg-[var(--color-button-primary)] h-2.5 rounded-full transition-all duration-1000" 
              :style="{ width: `${(timeRemaining / 60) * 100}%` }"
              :class="{ 'bg-[var(--color-button-primary-hover)]': timeRemaining < 10 }"
            ></div>
          </div>

          <div class="flex justify-center space-x-2 sm:space-x-4">
            <button 
              v-if="!timerStarted"
              @click="startTimer"
              class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base font-medium sm:font-semibold w-full"
            >
              {{ t('startGuessing') }}
            </button>
            <template v-else>
              <div class="flex justify-center space-x-2 sm:space-x-4 w-full">
                <button 
                  v-if="timerActive"
                  @click="pauseTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base font-medium sm:font-semibold w-1/2"
                >
                  {{ t('pauseTimer') }}
                </button>
                <button 
                  v-else
                  @click="startTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base font-medium sm:font-semibold w-1/2"
                >
                  {{ t('resumeTimer') }}
                </button>
                <button 
                  @click="resetTimer"
                  class="bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base font-medium sm:font-semibold w-1/2"
                >
                  {{ t('restartTimer') }}
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Current Word -->
        <div v-if="timerStarted" class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-[var(--color-heading)]">{{ t('wordToGuess') }}</h3>
          <div class="bg-[var(--color-background-soft)]/70 p-4 sm:p-6 rounded-lg border-2 border-[var(--color-button-primary)] text-center shadow-md">
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-highlight)]">{{ currentWord }}</p>
          </div>
        </div>

        <!-- Guessing Controls -->
        <div v-if="timerStarted" class="mb-6 flex flex-col space-y-3">
          <button 
            @click="handleCorrectGuess"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 sm:py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
            :disabled="!timerActive"
          >
            {{ t('correctGuess') }}
          </button>

        </div>

        <!-- Return to Main Menu -->
        <button
          @click="returnToMainMenu"
          class="w-full bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] py-3 sm:py-2 px-4 rounded-lg text-base font-medium transition-all mt-2"
        >
          {{ t('returnToMainMenu') }}
        </button>
      </div>
    </div>
  </div>
</template>
