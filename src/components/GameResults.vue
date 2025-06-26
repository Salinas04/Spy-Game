<script setup>
import { useI18n } from 'vue-i18n';

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
          <button 
            @click="startNewGame" 
            class="w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {{ t('playAgain') }}
          </button>

          <button 
            @click="goToMainMenu" 
            class="w-full bg-steel-gray hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-base font-medium transition-all"
          >
            {{ t('returnToMainMenu') }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>
