<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Tooltip from './Tooltip.vue';

const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['continueToGame']);
const { t } = useI18n();

const currentPlayerIndex = ref(0);
const showRole = ref(false);

const nextPlayer = () => {
  showRole.value = false;

  if (currentPlayerIndex.value < props.players.length - 1) {
    currentPlayerIndex.value++;
  } else {
    // All players have seen their roles, continue to game
    emit('continueToGame');
  }
};

const revealRole = () => {
  showRole.value = true;
};

const isLastPlayer = () => {
  return currentPlayerIndex.value === props.players.length - 1;
};

const currentPlayer = () => {
  return props.players[currentPlayerIndex.value];
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-dark-gray text-white p-2 sm:p-4">
    <div class="bg-dark-gray/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md text-center border border-steel-gray">
      <transition name="fade" mode="out-in">
        <div v-if="!showRole" key="prepare">
          <h2 class="text-2xl font-bold mb-6 text-yellow">{{ t('player', { number: currentPlayerIndex + 1 }) }}</h2>
          <p class="mb-8 text-lg">{{ t('prepareRole') }}</p>
          <Tooltip :text="t('viewRoleHelp')" position="bottom" :delay="500">
            <button 
              @click="revealRole" 
              class="group w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg relative overflow-hidden"
            >
              <span class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 transform transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ t('viewRole') }}
              </span>
            </button>
          </Tooltip>
        </div>

        <div v-else key="role">
          <h2 class="text-2xl font-bold mb-4 text-yellow">{{ t('player', { number: currentPlayerIndex + 1 }) }}</h2>

          <transition name="scale" appear>
            <div class="mb-6 p-4 rounded-lg border" 
                :class="currentPlayer().isSpy ? 'bg-black/70 border-yellow' : 'bg-black/70 border-steel-gray'">
              <h3 class="text-xl font-bold mb-2 text-mustard">{{ t('yourRole') }}</h3>
              <p class="text-2xl font-bold text-yellow" v-if="currentPlayer().isSpy">{{ t('spy') }}</p>
              <p class="text-2xl font-bold text-white" v-else>{{ t('regularPlayer') }}</p>

              <div v-if="!currentPlayer().isSpy" class="mt-4 pt-4 border-t border-steel-gray">
                <h3 class="text-xl font-bold mb-2 text-mustard">{{ t('word') }}</h3>
                <p class="text-2xl font-bold text-white">{{ location }}</p>
              </div>
            </div>
          </transition>

          <transition name="fade-up" appear>
            <div>
              <p class="mb-6 text-sm text-steel-gray" v-if="currentPlayer().isSpy">
                {{ t('spyObjective') }}
              </p>
              <p class="mb-6 text-sm text-steel-gray" v-else>
                {{ t('regularObjective') }}
              </p>

              <Tooltip :text="isLastPlayer() ? t('startGameHelp') : t('nextPlayerHelp')" position="bottom" :delay="500">
                <button 
                  @click="nextPlayer" 
                  class="group w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg relative overflow-hidden"
                >
                  <span class="flex items-center justify-center">
                    <svg v-if="isLastPlayer()" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 transform transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {{ isLastPlayer() ? t('startGameButton') : t('nextPlayer') }}
                  </span>
                </button>
              </Tooltip>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>
