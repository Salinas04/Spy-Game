<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  spyOption: {
    type: String,
    required: true
  },
  spyCount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['gameOver', 'returnToMenu']);
const { t } = useI18n();

// Game state
const timer = ref(480); // 8 minutes (480 seconds)
const timerInterval = ref(null);
const showMenu = ref(false); // Controls visibility of the game menu
const isPaused = ref(false); // Controls whether the timer is paused

// Methods
const endGame = () => {
  clearInterval(timerInterval.value);
  emit('gameOver', { message: t('gameFinished') });
};

// Menu functions
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const returnToMenu = () => {
  clearInterval(timerInterval.value);
  emit('returnToMenu');
};

// Timer functions
const startTimer = () => {
  timerInterval.value = setInterval(() => {
    if (timer.value > 0 && !isPaused.value) {
      timer.value--;
    } else if (timer.value === 0) {
      // Time's up, end the game
      endGame();
    }
  }, 1000);
};

const togglePauseTimer = () => {
  isPaused.value = !isPaused.value;
};

// Format time as MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Start the timer when component is mounted
startTimer();
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-dark-gray text-white p-2 sm:p-4">
    <!-- Menu Button (always visible) -->
    <div class="absolute top-2 right-2 sm:top-4 sm:right-4">
      <button 
        @click="toggleMenu" 
        class="bg-yellow hover:bg-mustard text-black p-2 rounded-full shadow-md transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Game Menu (conditionally visible) -->
    <transition name="fade" appear>
      <div v-if="showMenu" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
        <transition name="slide-up" appear>
          <div class="bg-dark-gray p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-steel-gray">
            <h2 class="text-2xl font-bold mb-6 text-center text-yellow">{{ t('gameMenu') }}</h2>

            <button 
              @click="toggleMenu" 
              class="w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg mb-4"
            >
              {{ t('continueGame') }}
            </button>

            <button 
              @click="returnToMenu" 
              class="w-full bg-dark-gray hover:bg-steel-gray border border-steel-gray text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              {{ t('endGameReturnMenu') }}
            </button>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Game Content -->
    <div class="bg-dark-gray/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-steel-gray">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-yellow">{{ t('timer') }}</h2>
        <div class="bg-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-lg sm:text-xl font-bold text-yellow border border-yellow overflow-hidden">
          <transition name="scale" mode="out-in">
            <span :key="timer" class="inline-block">{{ formatTime(timer) }}</span>
          </transition>
        </div>
      </div>


      <div class="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button 
          @click="togglePauseTimer" 
          class="bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {{ isPaused ? t('resumeTimer') : t('pauseTimer') }}
        </button>

        <button 
          @click="endGame" 
          class="bg-dark-gray hover:bg-steel-gray border border-steel-gray text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {{ t('endGame') }}
        </button>
      </div>

      <div class="mt-6 text-center">
        <p class="text-steel-gray">{{ t('gameDiscussion') }}</p>
        <p v-if="spyOption === 'random'" class="mt-2 text-yellow font-semibold">
          {{ t('spyCount', { count: spyCount }) }}
        </p>
      </div>
    </div>
  </div>
</template>
