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

      <!-- Player Count -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-lg text-white">{{ t('playerCount') }}</label>
            <span class="text-sm text-[#A0A0B8]">{{ t('minMax', { min: minPlayers, max: maxPlayers }) }}</span>
          </div>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
            <!-- Current Value Display -->
            <div class="flex justify-center items-center mb-4">
              <transition name="scale" mode="out-in">
                <span :key="playerCount" class="text-4xl font-bold text-white">{{ playerCount }}</span>
              </transition>
            </div>

            <!-- Slider for adjusting player count -->
            <div class="mb-4">
              <input 
                type="range" 
                v-model.number="playerCount" 
                :min="minPlayers" 
                :max="maxPlayers" 
                step="1"
                @input="updatePlayerCount(playerCount)"
                class="w-full h-2 bg-[#2A2A3F] rounded-lg appearance-none cursor-pointer accent-[#4B61FF]"
              />
              <div class="flex justify-between text-xs text-[#A0A0B8] mt-1">
                <span>{{ minPlayers }}</span>
                <span>{{ Math.floor((minPlayers + maxPlayers) / 2) }}</span>
                <span>{{ maxPlayers }}</span>
              </div>
            </div>

            <!-- Quick Adjustment Buttons -->
            <div class="flex items-center justify-between">
              <button 
                @click="updatePlayerCount(playerCount - 1)" 
                class="bg-[#4B61FF] hover:bg-[#6879FF] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                :disabled="playerCount <= minPlayers"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <button 
                @click="updatePlayerCount(playerCount + 1)" 
                class="bg-[#4B61FF] hover:bg-[#6879FF] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                :disabled="playerCount >= maxPlayers"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Player Names -->
      <transition name="fade-left" appear>
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4 text-white">{{ t('playerSetup') }}</h3>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4 max-h-60 overflow-y-auto">
            <div v-for="(name, index) in playerNames" :key="`player-${index}`" class="mb-3 last:mb-0">
              <label :for="`player-name-${index}`" class="block text-sm mb-1 text-[#A0A0B8]">{{ t('player', { number: index + 1 }) }}</label>
              <input 
                :id="`player-name-${index}`"
                type="text"
                v-model="playerNames[index]"
                @change="updatePlayerName(index, playerNames[index])"
                class="w-full bg-[#2A2A3F]/70 border border-[#35364A] rounded-lg px-3 py-2 text-white focus:border-[#4B61FF] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </transition>

      <!-- Role Selection -->
      <transition name="fade-right" appear>
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4 text-white">{{ t('roleSetup') }}</h3>

          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
            <div class="grid grid-cols-2 gap-3">
              <!-- Required Roles (disabled) -->
              <div class="col-span-2 mb-2">
                <h4 class="text-sm font-semibold text-[#A0A0B8] mb-2">{{ t('requiredRoles') }}</h4>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-villager" 
                  checked 
                  disabled 
                  class="mr-2 accent-[#4B61FF]"
                />
                <label for="role-villager" class="text-white">{{ t('villagerRole') }}</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-assassin" 
                  checked 
                  disabled 
                  class="mr-2 accent-[#FF4E4E]"
                />
                <label for="role-assassin" class="text-white">{{ t('assassinRole') }}</label>
              </div>

              <!-- Optional Roles -->
              <div class="col-span-2 mt-4 mb-2">
                <h4 class="text-sm font-semibold text-[#A0A0B8] mb-2">{{ t('optionalRoles') }}</h4>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-doctor" 
                  v-model="roles.doctor"
                  @change="toggleRole('doctor')"
                  class="mr-2 accent-[#4B61FF]"
                />
                <label for="role-doctor" class="text-white">{{ t('doctorRole') }}</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-seer" 
                  v-model="roles.seer"
                  @change="toggleRole('seer')"
                  class="mr-2 accent-[#4B61FF]"
                />
                <label for="role-seer" class="text-white">{{ t('seerRole') }}</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-cupid" 
                  v-model="roles.cupid"
                  @change="toggleRole('cupid')"
                  class="mr-2 accent-[#4B61FF]"
                />
                <label for="role-cupid" class="text-white">{{ t('cupidRole') }}</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-witch" 
                  v-model="roles.witch"
                  @change="toggleRole('witch')"
                  class="mr-2 accent-[#4B61FF]"
                />
                <label for="role-witch" class="text-white">{{ t('witchRole') }}</label>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Game Instructions -->
      <transition name="fade-left" appear>
        <div class="mb-6">
          <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A]">
            <h3 class="text-lg font-semibold mb-2 text-white">{{ t('howToPlay') }}</h3>
            <ul class="text-sm text-[#A0A0B8] space-y-2">
              <li>{{ t('townGameHowToPlay1') }}</li>
              <li>{{ t('townGameHowToPlay2') }}</li>
              <li>{{ t('townGameHowToPlay3') }}</li>
              <li>{{ t('townGameHowToPlay4') }}</li>
            </ul>
          </div>
        </div>
      </transition>

      <!-- Start Game Button -->
      <transition name="fade-up" appear>
        <div>
          <button
            @click="startGame"
            class="w-full bg-[#4B61FF] hover:bg-[#6879FF] text-white py-4 sm:py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg mb-4 sm:mb-3"
            :disabled="!canStartGame"
          >
            {{ t('startGame') }}
          </button>

          <button
            @click="goToMainMenu"
            class="w-full bg-[#35364A] hover:bg-[#35364A]/80 text-white py-3 sm:py-2 px-4 rounded-lg text-base font-medium transition-all"
          >
            {{ t('returnToMainMenu') }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>