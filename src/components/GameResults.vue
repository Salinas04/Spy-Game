<script setup>
import { useI18n } from 'vue-i18n';
import Tooltip from './Tooltip.vue';

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  players: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['newGame', 'returnToMainMenu']);
const { t } = useI18n();

const startNewGame = () => {
  emit('newGame');
};

const goToMainMenu = () => {
  emit('returnToMainMenu');
};

// Find all spy players
const spies = props.players.filter(player => player.isSpy);
const isSingleSpy = spies.length === 1;
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-dark-gray text-white p-2 sm:p-4">
    <div class="bg-dark-gray/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md text-center border border-steel-gray">
      <transition name="fade-down" appear>
        <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-yellow">{{ t('gameOver') }}</h2>
      </transition>

      <div class="mb-6 sm:mb-8">
        <transition name="scale" appear>
          <div class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" :class="result.spyWins ? 'text-yellow' : 'text-white'">
            {{ result.spyWins ? t('spyWins') : t('playersWin') }}
          </div>
        </transition>

        <transition name="fade" appear>
          <p class="text-base sm:text-lg mb-4 sm:mb-6">{{ result.message }}</p>
        </transition>

        <transition name="slide-right" appear>
          <div class="bg-black/70 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 border border-steel-gray">
            <h3 class="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-mustard">{{ t('location') }}:</h3>
            <p class="text-xl sm:text-2xl font-bold">{{ location }}</p>
          </div>
        </transition>

        <transition name="slide-left" appear>
          <div class="bg-black/70 p-3 sm:p-4 rounded-lg border border-yellow">
            <h3 class="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-mustard">
              {{ isSingleSpy ? t('theSpyWas') : t('theSpiesWere') }}
            </h3>
            <div v-if="isSingleSpy">
              <p class="text-xl sm:text-2xl font-bold text-yellow">
                {{ t('player', { number: props.players.indexOf(spies[0]) + 1 }) }}
              </p>
            </div>
            <div v-else>
              <p v-for="spy in spies" :key="spy.id" class="text-xl sm:text-2xl font-bold text-yellow mb-1 last:mb-0">
                {{ t('player', { number: props.players.indexOf(spy) + 1 }) }}
              </p>
            </div>
          </div>
        </transition>
      </div>

      <transition name="fade-up" appear>
        <div class="space-y-3">
          <Tooltip :text="t('playAgainHelp')" position="bottom" :delay="500">
            <button 
              @click="startNewGame" 
              class="group w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg relative overflow-hidden"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 transform transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ t('playAgain') }}
              </span>
            </button>
          </Tooltip>

          <Tooltip :text="t('returnToMainMenuHelp')" position="bottom" :delay="500">
            <button 
              @click="goToMainMenu" 
              class="group w-full bg-steel-gray hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-base font-medium transition-all"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {{ t('returnToMainMenu') }}
              </span>
            </button>
          </Tooltip>
        </div>
      </transition>
    </div>
  </div>
</template>
