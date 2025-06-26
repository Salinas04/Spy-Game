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
          <button 
            @click="revealRole" 
            class="w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {{ t('viewRole') }}
          </button>
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

              <button 
                @click="nextPlayer" 
                class="w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                {{ isLastPlayer() ? t('startGameButton') : t('nextPlayer') }}
              </button>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>
