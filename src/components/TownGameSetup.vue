<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['startGame', 'returnToMainMenu']);
const { t } = useI18n();

// Game setup state
const playerCount = ref(5); // Default to 5 players
const playerNames = ref(Array(playerCount.value).fill('').map((_, i) => `${t('player', { number: i + 1 })}`));
const minPlayers = 4; // Minimum players needed for the game
const maxPlayers = 15; // Maximum players allowed

// Role configuration
const roles = ref({
  villager: true, // Always enabled
  assassin: true, // Always enabled
  doctor: true,
  seer: true,
  // Optional roles can be added here
  cupid: false,
  witch: false
});

// Computed properties
const canStartGame = computed(() => {
  return playerCount.value >= minPlayers;
});

const availableRoles = computed(() => {
  const result = [];

  // Add required roles
  if (roles.value.assassin) result.push('assassin');
  if (roles.value.doctor) result.push('doctor');
  if (roles.value.seer) result.push('seer');

  // Add optional roles
  if (roles.value.cupid) result.push('cupid');
  if (roles.value.witch) result.push('witch');

  // Fill the rest with villagers
  const villagersCount = playerCount.value - result.length;
  for (let i = 0; i < villagersCount; i++) {
    result.push('villager');
  }

  return result;
});

// Methods
const updatePlayerCount = (count) => {
  const newCount = Math.max(minPlayers, Math.min(maxPlayers, count));
  playerCount.value = newCount;

  // Adjust player names array
  if (newCount > playerNames.value.length) {
    // Add new players
    for (let i = playerNames.value.length; i < newCount; i++) {
      playerNames.value.push(`${t('player', { number: i + 1 })}`);
    }
  } else if (newCount < playerNames.value.length) {
    // Remove excess players
    playerNames.value = playerNames.value.slice(0, newCount);
  }
};

const updatePlayerName = (index, name) => {
  if (name.trim()) {
    playerNames.value[index] = name;
  }
};

const toggleRole = (role) => {
  // Don't allow disabling villager or assassin
  if (role === 'villager' || role === 'assassin') return;

  roles.value[role] = !roles.value[role];
};

const startGame = () => {
  if (canStartGame.value) {
    emit('startGame', {
      playerCount: playerCount.value,
      playerNames: playerNames.value,
      roles: roles.value
    });
  }
};

const goToMainMenu = () => {
  emit('returnToMainMenu');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A2E] p-2 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-white">{{ t('townGame') }}</h1>

    <div class="bg-[#1A1A2E]/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-[#2A2A3F]">
      <transition name="fade-down" appear>
        <h2 class="text-2xl font-semibold mb-6 text-center text-white">{{ t('gameSetup') }}</h2>
      </transition>

      <!-- Player Count - Improved for mobile -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-lg text-white">{{ t('playerCount') }}</label>
            <span class="text-sm text-[#A0A0B8]">{{ t('minMax', { min: minPlayers, max: maxPlayers }) }}</span>
          </div>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
            <!-- Current Value Display with larger touch target -->
            <div class="flex justify-center items-center mb-4">
              <transition name="scale" mode="out-in">
                <span :key="playerCount" class="text-5xl font-bold text-white">{{ playerCount }}</span>
              </transition>
            </div>

            <!-- Quick Adjustment Buttons - Larger for better touch targets -->
            <div class="flex items-center justify-between mb-4">
              <button 
                @click="updatePlayerCount(playerCount - 1)" 
                class="bg-[#4B61FF] hover:bg-[#6879FF] text-white w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md active:shadow-inner active:transform active:scale-95"
                :disabled="playerCount <= minPlayers"
                :class="{'opacity-50': playerCount <= minPlayers}"
                aria-label="Decrease player count"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" />
                </svg>
              </button>

              <div class="flex flex-col items-center">
                <div class="text-sm text-[#A0A0B8] mb-1">{{ t('playerCount') }}</div>
                <div class="text-4xl font-bold text-white">{{ playerCount }}</div>
              </div>

              <button 
                @click="updatePlayerCount(playerCount + 1)" 
                class="bg-[#4B61FF] hover:bg-[#6879FF] text-white w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md active:shadow-inner active:transform active:scale-95"
                :disabled="playerCount >= maxPlayers"
                :class="{'opacity-50': playerCount >= maxPlayers}"
                aria-label="Increase player count"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <!-- Slider for adjusting player count - Enhanced for touch -->
            <div>
              <input 
                type="range" 
                v-model.number="playerCount" 
                :min="minPlayers" 
                :max="maxPlayers" 
                step="1"
                @input="updatePlayerCount(playerCount)"
                class="w-full h-3 bg-[#2A2A3F] rounded-lg appearance-none cursor-pointer accent-[#4B61FF]"
              />
              <div class="flex justify-between text-xs text-[#A0A0B8] mt-2">
                <span>{{ minPlayers }}</span>
                <span>{{ Math.floor((minPlayers + maxPlayers) / 2) }}</span>
                <span>{{ maxPlayers }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Player Names - Enhanced for mobile -->
      <transition name="fade-left" appear>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">{{ t('playerSetup') }}</h3>
            <span class="text-sm text-[#A0A0B8] bg-[#2A2A3F]/70 px-2 py-1 rounded-md">{{ playerCount }} {{ t('player', { number: '' }) }}s</span>
          </div>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4 max-h-[40vh] overflow-y-auto">
            <div v-for="(name, index) in playerNames" :key="`player-${index}`" class="mb-4 last:mb-0 relative">
              <div class="flex items-center justify-between mb-1">
                <label :for="`player-name-${index}`" class="text-sm font-medium text-[#A0A0B8]">
                  {{ t('player', { number: index + 1 }) }}
                </label>
                <span class="text-xs text-[#A0A0B8] opacity-70">{{ index + 1 }}/{{ playerCount }}</span>
              </div>

              <div class="relative">
                <input 
                  :id="`player-name-${index}`"
                  type="text"
                  v-model="playerNames[index]"
                  @change="updatePlayerName(index, playerNames[index])"
                  class="w-full bg-[#2A2A3F]/70 border border-[#35364A] rounded-lg px-4 py-3 text-white text-lg focus:border-[#4B61FF] focus:outline-none focus:ring-2 focus:ring-[#4B61FF]/30"
                  :placeholder="`${t('player', { number: index + 1 })}`"
                  autocomplete="off"
                  inputmode="text"
                />

                <!-- Clear button for mobile -->
                <button 
                  v-if="playerNames[index].length > 0"
                  @click="playerNames[index] = ''"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#A0A0B8] hover:text-white p-1 rounded-full"
                  type="button"
                  aria-label="Clear input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Role Selection - Optimized for touch -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-white">{{ t('roleSetup') }}</h3>
            <span class="text-sm text-[#A0A0B8] bg-[#2A2A3F]/70 px-2 py-1 rounded-md">
              {{ Object.values(roles).filter(Boolean).length }} {{ t('roles') }}
            </span>
          </div>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
            <!-- Required Roles (disabled) -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-[#A0A0B8] mb-3 px-1">{{ t('requiredRoles') }}</h4>

              <div class="grid grid-cols-1 gap-3">
                <!-- Villager Role Card -->
                <div class="bg-[#2A2A3F]/70 rounded-lg p-3 border border-[#35364A] opacity-80">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-6 h-6 rounded-md bg-[#4B61FF]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4B61FF]" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-villager" class="text-white font-medium">{{ t('villagerRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('villagerDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>

                <!-- Assassin Role Card -->
                <div class="bg-[#2A2A3F]/70 rounded-lg p-3 border border-[#35364A] opacity-80">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-6 h-6 rounded-md bg-[#FF4E4E]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#FF4E4E]" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-assassin" class="text-white font-medium">{{ t('assassinRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('assassinDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Optional Roles -->
            <div>
              <h4 class="text-sm font-semibold text-[#A0A0B8] mb-3 px-1">{{ t('optionalRoles') }}</h4>

              <div class="grid grid-cols-1 gap-3">
                <!-- Doctor Role Card -->
                <div 
                  class="bg-[#2A2A3F]/70 rounded-lg p-3 border transition-all"
                  :class="roles.doctor ? 'border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]' : 'border-[#35364A] hover:border-[#4B61FF]/50'"
                  @click="toggleRole('doctor')"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div 
                        class="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                        :class="roles.doctor ? 'bg-[#4B61FF]' : 'bg-[#2A2A3F] border border-[#4B61FF]/50'"
                      >
                        <svg v-if="roles.doctor" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-doctor" class="text-white font-medium">{{ t('doctorRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('doctorDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>

                <!-- Seer Role Card -->
                <div 
                  class="bg-[#2A2A3F]/70 rounded-lg p-3 border transition-all"
                  :class="roles.seer ? 'border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]' : 'border-[#35364A] hover:border-[#4B61FF]/50'"
                  @click="toggleRole('seer')"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div 
                        class="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                        :class="roles.seer ? 'bg-[#4B61FF]' : 'bg-[#2A2A3F] border border-[#4B61FF]/50'"
                      >
                        <svg v-if="roles.seer" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-seer" class="text-white font-medium">{{ t('seerRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('seerDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>

                <!-- Cupid Role Card -->
                <div 
                  class="bg-[#2A2A3F]/70 rounded-lg p-3 border transition-all"
                  :class="roles.cupid ? 'border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]' : 'border-[#35364A] hover:border-[#4B61FF]/50'"
                  @click="toggleRole('cupid')"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div 
                        class="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                        :class="roles.cupid ? 'bg-[#4B61FF]' : 'bg-[#2A2A3F] border border-[#4B61FF]/50'"
                      >
                        <svg v-if="roles.cupid" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-cupid" class="text-white font-medium">{{ t('cupidRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('cupidDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>

                <!-- Witch Role Card -->
                <div 
                  class="bg-[#2A2A3F]/70 rounded-lg p-3 border transition-all"
                  :class="roles.witch ? 'border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]' : 'border-[#35364A] hover:border-[#4B61FF]/50'"
                  @click="toggleRole('witch')"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div 
                        class="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                        :class="roles.witch ? 'bg-[#4B61FF]' : 'bg-[#2A2A3F] border border-[#4B61FF]/50'"
                      >
                        <svg v-if="roles.witch" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label for="role-witch" class="text-white font-medium">{{ t('witchRole') }}</label>
                      <p class="text-xs text-[#A0A0B8] mt-1">{{ t('witchDescription').split('.')[0] }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Game Instructions - Improved for mobile -->
      <transition name="fade-left" appear>
        <div class="mb-6">
          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-white">{{ t('howToPlay') }}</h3>
              <div class="bg-[#4B61FF]/20 text-[#4B61FF] text-xs font-medium px-2 py-1 rounded">
                {{ t('townGame') }}
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-[#4B61FF] text-xs font-bold">1</span>
                </div>
                <p class="text-sm text-[#A0A0B8]">{{ t('townGameHowToPlay1') }}</p>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-[#4B61FF] text-xs font-bold">2</span>
                </div>
                <p class="text-sm text-[#A0A0B8]">{{ t('townGameHowToPlay2') }}</p>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-[#4B61FF] text-xs font-bold">3</span>
                </div>
                <p class="text-sm text-[#A0A0B8]">{{ t('townGameHowToPlay3') }}</p>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-[#4B61FF] text-xs font-bold">4</span>
                </div>
                <p class="text-sm text-[#A0A0B8]">{{ t('townGameHowToPlay4') }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Start Game Button - Enhanced for mobile -->
      <transition name="fade-up" appear>
        <div>
          <button
            @click="startGame"
            class="w-full bg-gradient-to-r from-[#4B61FF] to-[#6879FF] text-white py-5 sm:py-4 px-6 rounded-lg text-xl font-bold transition-all shadow-md hover:shadow-lg mb-5 sm:mb-4 relative overflow-hidden active:scale-[0.98] active:shadow-inner"
            :disabled="!canStartGame"
            :class="{'opacity-70 cursor-not-allowed': !canStartGame}"
          >
            <div class="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('startGame') }}
            </div>

            <!-- Pulsing effect for ready state -->
            <div v-if="canStartGame" class="absolute inset-0 bg-white opacity-0 pointer-events-none animate-pulse-subtle"></div>
          </button>

          <button
            @click="goToMainMenu"
            class="w-full bg-[#35364A] hover:bg-[#35364A]/80 text-white py-3 px-4 rounded-lg text-base font-medium transition-all active:bg-[#2A2A3F]"
          >
            {{ t('returnToMainMenu') }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Custom animation for subtle pulsing effect */
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 0.15;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
