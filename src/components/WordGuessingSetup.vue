<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['startGame', 'returnToMainMenu']);
const { t } = useI18n();

// Game setup state
const teamCount = ref(2); // Default to 2 teams
const teamNames = ref(['Team 1', 'Team 2']);
const maxWordsPerTeam = ref(50); // Default max words per team
const teamWords = ref({
  0: [], // Team 1 words
  1: []  // Team 2 words
});
const currentTeamIndex = ref(0); // Team currently entering words
const currentWord = ref('');
const hideWords = ref(false); // Whether to hide the words that are already added

// Computed properties
const currentTeamName = computed(() => teamNames.value[currentTeamIndex.value]);
const isCurrentTeamComplete = computed(() => 
  teamWords.value[currentTeamIndex.value].length >= maxWordsPerTeam.value
);
const areAllTeamsComplete = computed(() => {
  for (let i = 0; i < teamCount.value; i++) {
    if (teamWords.value[i].length < maxWordsPerTeam.value) {
      return false;
    }
  }
  return true;
});

// Methods
const updateTeamName = (index, name) => {
  if (name.trim()) {
    teamNames.value[index] = name;
  }
};

const addWord = () => {
  if (currentWord.value.trim() && !isCurrentTeamComplete.value) {
    // Add word to current team's list
    teamWords.value[currentTeamIndex.value].push(currentWord.value.trim());
    currentWord.value = '';

    // If current team is complete, move to next team
    if (isCurrentTeamComplete.value && currentTeamIndex.value < teamCount.value - 1) {
      currentTeamIndex.value++;
    }
  }
};

const removeWord = (teamIndex, wordIndex) => {
  teamWords.value[teamIndex].splice(wordIndex, 1);
};

const increaseMaxWords = () => {
  maxWordsPerTeam.value += 50;
};

const decreaseMaxWords = () => {
  if (maxWordsPerTeam.value > 50) {
    maxWordsPerTeam.value -= 50;

    // Trim words if needed
    for (let i = 0; i < teamCount.value; i++) {
      if (teamWords.value[i].length > maxWordsPerTeam.value) {
        teamWords.value[i] = teamWords.value[i].slice(0, maxWordsPerTeam.value);
      }
    }
  }
};

const increaseMaxWordsByOne = () => {
  maxWordsPerTeam.value += 1;
};

const decreaseMaxWordsByOne = () => {
  if (maxWordsPerTeam.value > 1) {
    maxWordsPerTeam.value -= 1;

    // Trim words if needed
    for (let i = 0; i < teamCount.value; i++) {
      if (teamWords.value[i].length > maxWordsPerTeam.value) {
        teamWords.value[i] = teamWords.value[i].slice(0, maxWordsPerTeam.value);
      }
    }
  }
};

const startGame = () => {
  if (areAllTeamsComplete.value) {
    emit('startGame', {
      teamNames: teamNames.value,
      teamWords: teamWords.value,
      maxWordsPerTeam: maxWordsPerTeam.value
    });
  }
};

const goToMainMenu = () => {
  emit('returnToMainMenu');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-background-soft)] p-3 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-8 text-center text-[var(--color-heading)]">{{ t('wordGuessingGame') }}</h1>

    <div class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-[98%] sm:max-w-md border border-[var(--color-border)]">
      <transition name="fade-down" appear>
        <h2 class="text-2xl font-semibold mb-6 text-center text-[var(--color-heading)]">{{ t('gameSetup') }}</h2>
      </transition>

      <!-- Max Words Per Team -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-lg">{{ t('maxWordsPerTeam') }}</label>
            <div class="relative group">
              <button class="text-[var(--color-text-secondary)] hover:text-[var(--color-button-primary)] transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </button>
              <div class="absolute right-0 top-6 w-48 bg-[var(--color-background-soft)] text-[var(--color-text)] text-sm p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {{ t('maxWordsHelp') }}
              </div>
            </div>
          </div>

          <div class="bg-[var(--color-background-soft)]/50 p-4 rounded-lg border border-[var(--color-border)] mb-4">
            <!-- Current Value Display -->
            <div class="flex justify-center items-center mb-4">
              <transition name="scale" mode="out-in">
                <span :key="maxWordsPerTeam" class="text-4xl font-bold text-[var(--color-heading)]">{{ maxWordsPerTeam }}</span>
              </transition>
            </div>

            <!-- Slider for adjusting words -->
            <div class="mb-4">
              <input 
                type="range" 
                v-model.number="maxWordsPerTeam" 
                min="1" 
                max="500" 
                step="1"
                class="w-full h-2 bg-[var(--color-background-soft)] rounded-lg appearance-none cursor-pointer accent-[var(--color-button-primary)]"
              />
              <div class="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
                <span>1</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            <!-- Quick Adjustment Buttons -->
            <div class="grid grid-cols-4 gap-2">
              <button 
                @click="maxWordsPerTeam = 10" 
                class="bg-[var(--color-background-soft)] hover:bg-[var(--color-button-primary)]/20 text-[var(--color-text)] px-2 py-1 rounded-lg transition-all text-sm border border-[var(--color-border)]"
                :class="{ 'bg-[var(--color-button-primary)]/20 border-[var(--color-button-primary)]': maxWordsPerTeam === 10 }"
              >
                10
              </button>
              <button 
                @click="maxWordsPerTeam = 50" 
                class="bg-[var(--color-background-soft)] hover:bg-[var(--color-button-primary)]/20 text-[var(--color-text)] px-2 py-1 rounded-lg transition-all text-sm border border-[var(--color-border)]"
                :class="{ 'bg-[var(--color-button-primary)]/20 border-[var(--color-button-primary)]': maxWordsPerTeam === 50 }"
              >
                50
              </button>
              <button 
                @click="maxWordsPerTeam = 100" 
                class="bg-[var(--color-background-soft)] hover:bg-[var(--color-button-primary)]/20 text-[var(--color-text)] px-2 py-1 rounded-lg transition-all text-sm border border-[var(--color-border)]"
                :class="{ 'bg-[var(--color-button-primary)]/20 border-[var(--color-button-primary)]': maxWordsPerTeam === 100 }"
              >
                100
              </button>
              <button 
                @click="maxWordsPerTeam = 200" 
                class="bg-[var(--color-background-soft)] hover:bg-[var(--color-button-primary)]/20 text-[var(--color-text)] px-2 py-1 rounded-lg transition-all text-sm border border-[var(--color-border)]"
                :class="{ 'bg-[var(--color-button-primary)]/20 border-[var(--color-button-primary)]': maxWordsPerTeam === 200 }"
              >
                200
              </button>
            </div>

            <!-- Fine-tuning Controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-3 sm:space-y-0">
              <div class="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <button 
                  @click="decreaseMaxWordsByOne" 
                  class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all"
                  :disabled="maxWordsPerTeam <= 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <button 
                  @click="decreaseMaxWords" 
                  class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] ml-2 px-4 sm:px-3 py-3 sm:py-2 rounded-lg transition-all text-base sm:text-sm font-medium"
                  :disabled="maxWordsPerTeam <= 50"
                >
                  -50
                </button>
              </div>
              <div class="flex items-center w-full sm:w-auto justify-center sm:justify-end">
                <button 
                  @click="increaseMaxWords" 
                  class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] px-4 sm:px-3 py-3 sm:py-2 rounded-lg transition-all text-base sm:text-sm font-medium"
                >
                  +50
                </button>
                <button 
                  @click="increaseMaxWordsByOne" 
                  class="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] ml-2 w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Team Setup -->
      <transition name="fade-left" appear>
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4 text-[var(--color-heading)]">{{ t('teamSetup') }}</h3>

          <!-- Team Names -->
          <div v-for="(name, index) in teamNames" :key="`team-${index}`" class="mb-4">
            <label :for="`team-name-${index}`" class="block text-lg mb-2">{{ t('teamName', { number: index + 1 }) }}</label>
            <input 
              :id="`team-name-${index}`"
              type="text"
              v-model="teamNames[index]"
              @change="updateTeamName(index, teamNames[index])"
              class="w-full bg-[var(--color-background-soft)]/70 border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-button-primary)] focus:outline-none"
            />
          </div>
        </div>
      </transition>

      <!-- Word Entry -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4 text-[var(--color-heading)]">
            {{ t('enterWordsForTeam', { team: currentTeamName }) }}
          </h3>

          <div class="flex flex-col sm:flex-row items-center mb-5 space-y-3 sm:space-y-0">
            <input 
              type="text"
              v-model="currentWord"
              @keyup.enter="addWord"
              :placeholder="t('enterWord')"
              class="w-full sm:flex-grow bg-[var(--color-background-soft)]/70 border border-[var(--color-border)] rounded-xl sm:rounded-l-xl sm:rounded-r-none px-4 py-4 sm:py-3 text-[var(--color-text)] text-lg focus:border-[var(--color-button-primary)] focus:outline-none"
              :disabled="isCurrentTeamComplete"
            />
            <button 
              @click="addWord"
              class="w-full sm:w-auto bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] px-5 py-4 sm:py-3 rounded-xl sm:rounded-l-none sm:rounded-r-xl transition-all font-medium text-lg"
              :disabled="!currentWord.trim() || isCurrentTeamComplete"
            >
              {{ t('addWord') }}
            </button>
          </div>

          <div class="flex justify-between items-center mb-4">
            <p class="text-base text-[var(--color-text-secondary)]">
              {{ t('wordsRemaining', { count: maxWordsPerTeam - teamWords[currentTeamIndex].length }) }}
            </p>
            <button 
              @click="hideWords = !hideWords" 
              class="text-base bg-[var(--color-background-soft)] hover:bg-[var(--color-button-primary)]/20 text-[var(--color-text)] px-4 py-2 rounded-xl transition-all border border-[var(--color-border)]"
            >
              {{ hideWords ? t('showWords') : t('hideWords') }}
            </button>
          </div>

          <!-- Words List -->
          <div class="bg-[var(--color-background-soft)]/70 rounded-xl p-5 border border-[var(--color-border)] max-h-[40vh] overflow-y-auto">
            <transition-group name="list" tag="div">
              <div 
                v-for="(word, wordIndex) in teamWords[currentTeamIndex]" 
                :key="word"
                class="flex justify-between items-center py-3 px-2 mb-2 last:mb-0 transition-all duration-300 border-b border-[var(--color-border)]/30 last:border-b-0"
              >
                <span class="text-lg">{{ hideWords ? '••••••••' : word }}</span>
                <button 
                  @click="removeWord(currentTeamIndex, wordIndex)"
                  class="text-[var(--color-button-primary-hover)] hover:text-[var(--color-text-highlight)] transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>
              <div v-if="teamWords[currentTeamIndex].length === 0" key="empty" class="text-[var(--color-text-secondary)] text-center py-4 text-lg">
                {{ t('noWordsYet') }}
              </div>
            </transition-group>
          </div>

          <!-- Team Navigation -->
          <div class="flex justify-between mt-6 space-x-3 sm:space-x-4" v-if="teamCount > 1">
            <button 
              @click="currentTeamIndex = Math.max(0, currentTeamIndex - 1)"
              class="flex-1 bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-base sm:text-lg font-medium flex items-center justify-center"
              :disabled="currentTeamIndex === 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ t('previousTeam') }}
            </button>
            <button 
              @click="currentTeamIndex = Math.min(teamCount - 1, currentTeamIndex + 1)"
              class="flex-1 bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] px-4 sm:px-5 py-4 sm:py-3 rounded-xl transition-all text-base sm:text-lg font-medium flex items-center justify-center"
              :disabled="currentTeamIndex === teamCount - 1"
            >
              {{ t('nextTeam') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </transition>

      <!-- Start Game Button -->
      <transition name="fade-up" appear>
        <div class="mt-8">
          <button
            @click="startGame"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-5 sm:py-4 px-6 rounded-xl text-xl font-bold transition-all shadow-md hover:shadow-lg mb-5 sm:mb-4 flex items-center justify-center"
            :disabled="!areAllTeamsComplete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t('startGame') }}
          </button>

          <button
            @click="goToMainMenu"
            class="w-full bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-button-text)] py-4 sm:py-3 px-5 rounded-xl text-lg font-medium transition-all flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t('returnToMainMenu') }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>
