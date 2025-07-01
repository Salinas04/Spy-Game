<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Tooltip from './Tooltip.vue';

const emit = defineEmits(['gameOver', 'returnToMainMenu']);
const props = defineProps({
  gameSettings: {
    type: Object,
    required: true
  }
});

const { t, locale } = useI18n();

// Game state
const gamePhase = ref('roleAssignment'); // 'roleAssignment', 'night', 'day', 'discussion', 'voting', 'results'
const currentRound = ref(1);
const players = ref([]);
const currentPlayerIndex = ref(0);
const showRole = ref(false);
const nightActions = ref({
  assassin: null,
  doctor: null,
  seer: null,
  witch: null,
  cupid: null
});
const dayEvents = ref([]);
const votingResults = ref([]);
const gameResult = ref(null);
const eliminatedPlayers = ref([]);
const revealedRoles = ref({});
// Night phase state
const currentNightRole = ref(''); // 'assassin', 'doctor', 'seer', etc.
const nightRoleSequence = ref([]); // Array of roles to process in sequence
const showSeerResult = ref(false); // Whether to show the seer's result
const isPreNightPhase = ref(false); // Whether we're in the pre-night announcement phase
const preNightTimer = ref(10); // 10-second timer for pre-night announcement

// Speech synthesis
const isSpeechEnabled = ref(true);
const synth = window.speechSynthesis;
const speakingNow = ref(false);
const voicesLoaded = ref(false);
const voices = ref([]);
const isMobile = ref(false);

// Check if device is mobile and detect Safari
onMounted(() => {
  // Simple mobile detection
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Safari detection (both mobile and desktop)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // iOS and Safari require user interaction before speech synthesis can work
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) || isSafari) {
    // We'll initialize speech synthesis on first user interaction
    if (isMobile.value) {
      document.addEventListener('touchstart', initSpeechSynthesis, { once: true });
    }
    // Also initialize on click for Safari (both mobile and desktop)
    document.addEventListener('click', initSpeechSynthesis, { once: true });
  } else {
    // For non-iOS/Safari devices, initialize immediately
    initSpeechSynthesis();
  }
});

// Initialize speech synthesis
const initSpeechSynthesis = () => {
  // Check if voices are already loaded
  const availableVoices = synth.getVoices();
  if (availableVoices.length > 0) {
    voices.value = availableVoices;
    voicesLoaded.value = true;
  }

  // Add event listener for when voices are loaded
  synth.onvoiceschanged = () => {
    voices.value = synth.getVoices();
    voicesLoaded.value = true;
  };

  // On iOS, we need to speak something to initialize the speech synthesis
  if (isMobile.value && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Speak an empty string to initialize
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0; // Mute it
    synth.speak(utterance);
  }
};

// Narrate text using a specific voice
const narrar = (text, voz) => {
  if (!isSpeechEnabled.value || !synth) return;

  // Cancel any ongoing speech
  synth.cancel();

  // Create a new speech utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set language based on current i18n locale
  const langCode = locale.value === 'es' ? 'es-ES' : 'en-US';
  utterance.lang = langCode;

  // Voice selection logic
  if (voz) {
    // Use provided voice if available
    utterance.voice = voz;
  } else if (voicesLoaded.value && voices.value.length > 0) {
    // Try to find a suitable voice based on device and language
    let selectedVoice = null;

    // First priority: Google voice in the correct language
    selectedVoice = voices.value.find(v => 
      v.name.includes("Google") && 
      v.lang.startsWith(langCode.split('-')[0])
    );

    // Second priority: Any voice in the correct language
    if (!selectedVoice) {
      selectedVoice = voices.value.find(v => 
        v.lang.startsWith(langCode.split('-')[0])
      );
    }

    // Use the selected voice if found
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  // Modify voice characteristics - adjusted for better mobile compatibility
  utterance.pitch = 0.5;  // Deeper voice (0.1 to 2)
  utterance.rate = 0.8;   // Slower (0.1 to 10)
  utterance.volume = 1.0; // Full volume (0 to 1)

  // Set speaking state
  speakingNow.value = true;

  // Add event listener for when speech ends
  utterance.onend = () => {
    speakingNow.value = false;
  };

  // Add error handler
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    speakingNow.value = false;
  };

  // Speak the text
  synth.speak(utterance);
};

// Speak text using speech synthesis
const speakText = (text) => {
  // For mobile devices, we might need to initialize speech synthesis first
  if (isMobile.value && !voicesLoaded.value) {
    // Try to initialize speech synthesis
    initSpeechSynthesis();

    // If still not loaded, use default voice
    narrar(text, null);
    return;
  }

  // For non-mobile or if voices are loaded
  if (voicesLoaded.value) {
    // Get language code based on current locale
    const langCode = locale.value === 'es' ? 'es-ES' : 'en-US';

    // Try to find a Google voice in the correct language (same logic as in narrar function)
    let selectedVoice = voices.value.find(v => 
      v.name.includes("Google") && 
      v.lang.startsWith(langCode.split('-')[0])
    );

    // If no Google voice found, try any voice in the correct language
    if (!selectedVoice) {
      selectedVoice = voices.value.find(v => 
        v.lang.startsWith(langCode.split('-')[0])
      );
    }

    // Use the selected voice if found, otherwise let narrar function handle fallbacks
    narrar(text, selectedVoice);
  } else {
    // If voices not loaded, use default voice
    narrar(text, null);
  }
};

// Toggle speech
const toggleSpeech = () => {
  // This is a good opportunity to initialize speech synthesis on mobile
  if (isMobile.value && !voicesLoaded.value) {
    initSpeechSynthesis();
  }

  isSpeechEnabled.value = !isSpeechEnabled.value;

  if (!isSpeechEnabled.value) {
    // Cancel any ongoing speech
    synth.cancel();
    speakingNow.value = false;
  } else if (isMobile.value) {
    // On mobile, when enabling speech, speak a silent utterance to initialize
    // This helps with iOS requiring user interaction
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    synth.speak(utterance);
  }
};

// Initialize players
onMounted(() => {
  initializePlayers();
});

// Methods
const initializePlayers = () => {
  players.value = [];

  // Create player objects
  for (let i = 0; i < props.gameSettings.playerCount; i++) {
    players.value.push({
      id: i,
      name: props.gameSettings.playerNames[i],
      role: null,
      isAlive: true,
      votedFor: null,
      isRevealed: false
    });
  }

  // Assign roles
  assignRoles();
};

const assignRoles = () => {
  // Create an array of available roles
  const availableRoles = [];

  // Add one assassin
  availableRoles.push('assassin');

  // Add optional roles if enabled
  if (props.gameSettings.roles.doctor) availableRoles.push('doctor');
  if (props.gameSettings.roles.seer) availableRoles.push('seer');
  if (props.gameSettings.roles.cupid) availableRoles.push('cupid');
  if (props.gameSettings.roles.witch) availableRoles.push('witch');

  // Fill the rest with villagers
  const villagersCount = props.gameSettings.playerCount - availableRoles.length;
  for (let i = 0; i < villagersCount; i++) {
    availableRoles.push('villager');
  }

  // Shuffle the roles
  for (let i = availableRoles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableRoles[i], availableRoles[j]] = [availableRoles[j], availableRoles[i]];
  }

  // Assign roles to players
  for (let i = 0; i < players.value.length; i++) {
    players.value[i].role = availableRoles[i];
  }
};

// Role assignment phase
const viewRole = () => {
  showRole.value = true;
};

const nextPlayer = () => {
  showRole.value = false;
  currentPlayerIndex.value++;

  // If all players have seen their roles, move to night phase
  if (currentPlayerIndex.value >= players.value.length) {
    startNightPhase();
  }
};

// Night phase
const startNightPhase = () => {
  gamePhase.value = 'night';
  showSeerResult.value = false;
  isPreNightPhase.value = true;
  preNightTimer.value = 10;

  // Reset night actions
  nightActions.value = {
    assassin: null,
    doctor: null,
    seer: null,
    witch: null,
    cupid: null
  };

  // Determine the sequence of roles for this night
  nightRoleSequence.value = ['assassin']; // Assassin always goes first

  // Add other roles if they exist and are alive
  if (doctorPlayers.value.length > 0) nightRoleSequence.value.push('doctor');
  if (seerPlayers.value.length > 0) nightRoleSequence.value.push('seer');
  // Add other roles as needed (witch, cupid, etc.)

  // Use the speakText function to ensure consistent voice selection
  speakText(t('preNightAnnouncement'));

  // Start the 10-second timer
  const timerInterval = setInterval(() => {
    preNightTimer.value--;

    if (preNightTimer.value <= 0) {
      clearInterval(timerInterval);
      isPreNightPhase.value = false;

      // Set the first role
      currentNightRole.value = nightRoleSequence.value[0];

      // Speak the narrator text for the first role using the speakText function
      setTimeout(() => {
        speakText(t('narratorAssassin'));
      }, 500);
    }
  }, 1000);
};

const performNightAction = (role, targetId) => {
  nightActions.value[role] = targetId;

  // Special handling for seer to show result immediately
  if (role === 'seer') {
    // Store the revealed role
    revealedRoles.value[targetId] = players.value[targetId].role;
    // Show the result
    showSeerResult.value = true;

    // Speak the seer result using the speakText function
    speakText(t('narratorSeerResult'));

    return; // Don't advance yet, wait for user to acknowledge
  }

  // Advance to next role or end night phase
  advanceNightPhase();
};

const advanceNightPhase = () => {
  // Find the current role's index in the sequence
  const currentIndex = nightRoleSequence.value.indexOf(currentNightRole.value);

  // Handle seer result case
  if (showSeerResult.value) {
    showSeerResult.value = false; // Reset for next time

    // Check if seer is the last role
    if (currentIndex === nightRoleSequence.value.length - 1) {
      // All roles have acted, process the night's events
      processDayEvents();
    } else {
      // Move to the next role
      currentNightRole.value = nightRoleSequence.value[currentIndex + 1];

      // Speak the narrator text for the next role
      // Use the speakText function to ensure consistent voice selection
      if (currentNightRole.value === 'doctor') {
        speakText(t('narratorDoctor'));
      } else if (currentNightRole.value === 'seer') {
        speakText(t('narratorSeer'));
      }
    }
    return;
  }

  // Move to the next role if there is one
  if (currentIndex < nightRoleSequence.value.length - 1) {
    currentNightRole.value = nightRoleSequence.value[currentIndex + 1];

    // Speak the narrator text for the next role using the speakText function
    if (currentNightRole.value === 'doctor') {
      speakText(t('narratorDoctor'));
    } else if (currentNightRole.value === 'seer') {
      speakText(t('narratorSeer'));
    }
  } else {
    // All roles have acted, process the night's events
    processDayEvents();
  }
};

// This function is no longer used as we now use nightRoleSequence

// Process night actions and generate day events
const processDayEvents = () => {
  dayEvents.value = [];

  // Process assassin's action
  const killedPlayerId = nightActions.value.assassin;
  let playerSaved = false;

  // Process doctor's action
  if (nightActions.value.doctor === killedPlayerId) {
    playerSaved = true;
    dayEvents.value.push({
      type: 'saved',
      playerId: killedPlayerId
    });
  }

  // If player wasn't saved, mark them as eliminated
  if (!playerSaved && killedPlayerId !== null) {
    const player = players.value.find(p => p.id === killedPlayerId);
    player.isAlive = false;
    eliminatedPlayers.value.push(killedPlayerId);

    dayEvents.value.push({
      type: 'killed',
      playerId: killedPlayerId
    });
  }

  // Process seer's action
  if (nightActions.value.seer !== null) {
    const seerId = players.value.findIndex(p => p.role === 'seer' && p.isAlive);
    if (seerId !== -1) {
      const targetId = nightActions.value.seer;
      revealedRoles.value[targetId] = players.value[targetId].role;

      dayEvents.value.push({
        type: 'revealed',
        playerId: targetId,
        seerId: seerId
      });
    }
  }

  // Move to day phase
  startDayPhase();
};

// Day phase
const startDayPhase = () => {
  gamePhase.value = 'day';

  // Check win conditions
  if (checkWinConditions()) {
    gamePhase.value = 'results';
    return;
  }

  // Reset voting
  players.value.forEach(player => {
    player.votedFor = null;
  });
  votingResults.value = [];

  // Make the narrator announce the player who has been eliminated by the assassin
  const killedEvents = dayEvents.value.filter(e => e.type === 'killed');
  if (killedEvents.length > 0) {
    // Get the killed player's name
    const killedPlayerId = killedEvents[0].playerId;
    const killedPlayerName = players.value.find(p => p.id === killedPlayerId).name;

    // Narrate the assassination event using the speakText function
    speakText(t('playerKilled', { player: killedPlayerName }));
  }
};

const startDiscussion = () => {
  gamePhase.value = 'discussion';
};

const startVoting = () => {
  gamePhase.value = 'voting';
};

const vote = (voterId, targetId) => {
  // Record the vote
  players.value[voterId].votedFor = targetId;

  // Check if all living players have voted
  const allVoted = players.value.every(p => !p.isAlive || p.votedFor !== null);

  if (allVoted) {
    processVotes();
  }
};

const processVotes = () => {
  // Count votes for each player
  const voteCount = {};
  players.value.forEach(player => {
    if (player.isAlive && player.votedFor !== null) {
      voteCount[player.votedFor] = (voteCount[player.votedFor] || 0) + 1;
    }
  });

  // Find the player with the most votes
  let maxVotes = 0;
  let eliminatedPlayerId = null;

  Object.entries(voteCount).forEach(([playerId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      eliminatedPlayerId = parseInt(playerId);
    }
  });

  // Store voting results
  votingResults.value = {
    eliminatedPlayerId,
    votes: voteCount
  };

  // Move to voting results phase
  gamePhase.value = 'votingResults';
};

const continueAfterVoting = () => {
  // Eliminate the player with the most votes
  if (votingResults.value.eliminatedPlayerId !== null) {
    players.value[votingResults.value.eliminatedPlayerId].isAlive = false;
    eliminatedPlayers.value.push(votingResults.value.eliminatedPlayerId);
  }

  // Check win conditions
  if (checkWinConditions()) {
    gamePhase.value = 'results';
  } else {
    // Start next round
    currentRound.value++;
    startNightPhase();
  }
};

// Win conditions
const checkWinConditions = () => {
  const aliveAssassins = players.value.filter(p => p.isAlive && p.role === 'assassin').length;
  const aliveVillagers = players.value.filter(p => p.isAlive && p.role !== 'assassin').length;

  // Assassins win if they equal or outnumber the villagers
  if (aliveAssassins >= aliveVillagers) {
    gameResult.value = 'assassins';
    return true;
  }

  // Villagers win if all assassins are eliminated
  if (aliveAssassins === 0) {
    gameResult.value = 'villagers';
    return true;
  }

  return false;
};

// Computed properties
const currentPlayer = computed(() => {
  if (currentPlayerIndex.value < players.value.length) {
    return players.value[currentPlayerIndex.value];
  }
  return null;
});

const alivePlayers = computed(() => {
  return players.value.filter(p => p.isAlive);
});

const assassinPlayers = computed(() => {
  return players.value.filter(p => p.role === 'assassin' && p.isAlive);
});

const doctorPlayers = computed(() => {
  return players.value.filter(p => p.role === 'doctor' && p.isAlive);
});

const seerPlayers = computed(() => {
  return players.value.filter(p => p.role === 'seer' && p.isAlive);
});

// Game control
const returnToMainMenu = () => {
  emit('returnToMainMenu');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A2E] p-2 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-white">{{ t('townGame') }}</h1>

    <!-- Improved Speech Controls with Tooltip -->
    <div class="fixed bottom-4 right-4 z-50">
      <div class="flex flex-col items-center">
        <!-- Speech toggle button with improved feedback and tooltip -->
        <Tooltip :text="t('narratorControlsHelp')" position="left" :delay="500">
          <button 
            @click="toggleSpeech" 
            class="bg-[#2A2A3F] hover:bg-[#35364A] text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative"
            :class="{ 
              'bg-[#4B61FF]': isSpeechEnabled,
              'hover:bg-[#3A51DF]': isSpeechEnabled
            }"
            aria-label="Toggle narrator voice"
          >
            <!-- Speech icon with animation -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="isSpeechEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>

            <!-- Speaking indicator (animated waves when speaking) -->
            <div v-if="speakingNow" class="absolute -top-1 -right-1 h-4 w-4">
              <span class="absolute inline-flex h-full w-full rounded-full bg-[#4B61FF] opacity-75 animate-ping-slow"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-[#4B61FF]"></span>
            </div>
          </button>
        </Tooltip>

        <!-- Status label with improved visibility -->
        <div class="mt-2 px-3 py-1 bg-[#2A2A3F]/90 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-md">
          {{ isSpeechEnabled ? (speakingNow ? 'Narrando...' : 'Narrador ON') : 'Narrador OFF' }}
        </div>
      </div>
    </div>

    <div class="bg-[#1A1A2E]/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-[#2A2A3F]">
      <!-- Role Assignment Phase -->
      <transition name="fade" mode="out-in">
        <div>
          <div v-if="gamePhase === 'roleAssignment'" class="text-center" key="role-assignment">
            <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('roleAssignment') }}</h2>

            <transition name="fade" mode="out-in">
              <div>
                <div v-if="!showRole" class="mb-6" key="prepare-role">
                  <p class="text-[#A0A0B8] mb-4">{{ t('prepareRole') }}</p>
                  <h3 v-if="currentPlayer" class="text-xl font-bold text-white mb-2">{{ currentPlayer.name }}</h3>
                  <button
                      @click="viewRole"
                      class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    {{ t('viewRole') }}
                  </button>
                </div>

                <div v-else class="mb-6" key="show-role">
                  <h3 class="text-xl font-semibold mb-2 text-white">{{ t('yourRole') }}</h3>
                  <div v-if="currentPlayer" class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                    <p class="text-2xl font-bold mb-2" :class="{ 'text-[#FF4E4E]': currentPlayer.role === 'assassin', 'text-white': currentPlayer.role !== 'assassin' }">
                      {{ t(`${currentPlayer.role}Role`) }}
                    </p>
                    <p class="text-[#A0A0B8] text-sm">{{ t(`${currentPlayer.role}Description`) }}</p>
                  </div>
                  <button
                      @click="nextPlayer"
                      class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    {{ currentPlayerIndex < players.length - 1 ? t('nextPlayer') : t('startNight') }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Night Phase - Improved for mobile -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'night'" class="text-center" key="night-phase">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-semibold text-white">{{ t('nightPhase') }}</h2>
                <div class="bg-[#2A2A3F]/70 text-[#A0A0B8] text-xs font-medium px-2 py-1 rounded">
                  {{ t('round') }} {{ currentRound }}
                </div>
              </div>

              <!-- Narrator with improved visuals -->
              <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6 relative overflow-hidden">
                <!-- Night sky background effect -->
                <div class="absolute inset-0 bg-gradient-to-b from-[#121232]/50 to-transparent opacity-50"></div>

                <!-- Moon icon for night phase -->
                <div class="absolute top-3 right-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#A0A0B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>

                <p class="text-[#A0A0B8] text-lg italic relative z-10">{{ t('nightDescription') }}</p>

                <transition name="fade" mode="out-in">
                  <div v-if="isPreNightPhase" :key="'pre-night'" class="text-center relative z-10">
                    <p class="text-white text-2xl mt-4 mb-6 font-bold">{{ t('preNightAnnouncement') }}</p>
                    <div class="flex justify-center items-center">
                      <div class="bg-gradient-to-r from-[#4B61FF] to-[#6879FF] text-white text-3xl font-bold w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                        <span class="relative z-10">{{ preNightTimer }}</span>
                        <!-- Circular progress indicator -->
                        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="46" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.2)" 
                            stroke-width="8"
                          />
                          <circle 
                            cx="50" cy="50" r="46" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.8)" 
                            stroke-width="8"
                            stroke-dasharray="289.02652413026095"
                            :stroke-dashoffset="289.02652413026095 * (1 - preNightTimer / 10)"
                            transform="rotate(-90 50 50)"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div v-else class="mt-4 relative z-10 bg-[#1A1A2E]/70 p-3 rounded-lg border border-[#35364A]" :key="currentNightRole + (showSeerResult ? '-result' : '')">
                    <div class="flex items-center">
                      <!-- Role icon -->
                      <div class="flex-shrink-0 mr-3">
                        <div 
                          class="w-10 h-10 rounded-full flex items-center justify-center"
                          :class="{
                            'bg-[#FF4E4E]/20': currentNightRole === 'assassin',
                            'bg-[#4B61FF]/20': currentNightRole !== 'assassin'
                          }"
                        >
                          <svg v-if="currentNightRole === 'assassin'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF4E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                          <svg v-else-if="currentNightRole === 'doctor'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <svg v-else-if="currentNightRole === 'seer'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>

                      <!-- Narrator text -->
                      <p class="text-white text-lg font-medium text-left">
                        <span v-if="currentNightRole === 'assassin'">{{ t('narratorAssassin') }}</span>
                        <span v-else-if="currentNightRole === 'doctor'">{{ t('narratorDoctor') }}</span>
                        <span v-else-if="currentNightRole === 'seer' && !showSeerResult">{{ t('narratorSeer') }}</span>
                        <span v-else-if="currentNightRole === 'seer' && showSeerResult">{{ t('narratorSeerResult') }}</span>
                      </p>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Night Role Actions - Improved for mobile -->
              <transition name="slide-fade" mode="out-in">
                <!-- Pre-Night Phase - Hide role actions -->
                <div v-if="isPreNightPhase" key="pre-night-actions" class="mb-6">
                  <!-- No role actions during pre-night phase -->
                </div>

                <!-- Assassin Action -->
                <div v-else-if="currentNightRole === 'assassin'" class="mb-6" key="assassin-action">
                  <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                    <h3 class="text-xl font-semibold mb-3 text-[#FF4E4E] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {{ t('assassinTurn') }}
                    </h3>
                    <p class="text-[#A0A0B8] mb-4">{{ t('assassinPrompt') }}</p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`assassin-target-${player.id}`"
                      @click="performNightAction('assassin', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#FF4E4E]/20 text-white py-3 px-4 rounded-lg transition-all text-base border border-[#35364A] flex items-center justify-between"
                      :class="{ 
                        'bg-[#FF4E4E]/20 border-[#FF4E4E] shadow-[0_0_0_1px_rgba(255,78,78,0.5)]': nightActions.assassin === player.id,
                        'opacity-50': player.role === 'assassin'
                      }"
                      :disabled="player.role === 'assassin'"
                    >
                      <span>{{ player.name }}</span>
                      <div v-if="nightActions.assassin === player.id" class="w-6 h-6 rounded-full bg-[#FF4E4E] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Doctor Action -->
                <div v-else-if="currentNightRole === 'doctor'" class="mb-6" key="doctor-action">
                  <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                    <h3 class="text-xl font-semibold mb-3 text-[#4B61FF] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {{ t('doctorTurn') }}
                    </h3>
                    <p class="text-[#A0A0B8] mb-4">{{ t('doctorPrompt') }}</p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`doctor-target-${player.id}`"
                      @click="performNightAction('doctor', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-3 px-4 rounded-lg transition-all text-base border border-[#35364A] flex items-center justify-between"
                      :class="{ 'bg-[#4B61FF]/20 border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]': nightActions.doctor === player.id }"
                    >
                      <span>{{ player.name }}</span>
                      <div v-if="nightActions.doctor === player.id" class="w-6 h-6 rounded-full bg-[#4B61FF] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Seer Action -->
                <div v-else-if="currentNightRole === 'seer' && !showSeerResult" class="mb-6" key="seer-action">
                  <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                    <h3 class="text-xl font-semibold mb-3 text-[#4B61FF] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ t('seerTurn') }}
                    </h3>
                    <p class="text-[#A0A0B8] mb-4">{{ t('seerPrompt') }}</p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`seer-target-${player.id}`"
                      @click="performNightAction('seer', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-3 px-4 rounded-lg transition-all text-base border border-[#35364A] flex items-center justify-between"
                      :class="{ 
                        'bg-[#4B61FF]/20 border-[#4B61FF] shadow-[0_0_0_1px_rgba(75,97,255,0.5)]': nightActions.seer === player.id,
                        'opacity-50': player.role === 'seer'
                      }"
                      :disabled="player.role === 'seer'"
                    >
                      <span>{{ player.name }}</span>
                      <div v-if="nightActions.seer === player.id" class="w-6 h-6 rounded-full bg-[#4B61FF] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Seer Result -->
                <div v-else-if="currentNightRole === 'seer' && showSeerResult" class="mb-6" key="seer-result">
                  <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6">
                    <h3 class="text-xl font-semibold mb-3 text-[#4B61FF] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ t('seerInfo') }}
                    </h3>

                    <div class="bg-[#1A1A2E]/70 p-4 rounded-lg border border-[#35364A] mb-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 mr-3">
                          <div 
                            class="w-10 h-10 rounded-full flex items-center justify-center"
                            :class="{
                              'bg-[#FF4E4E]/20': players[nightActions.seer].role === 'assassin',
                              'bg-[#4B61FF]/20': players[nightActions.seer].role !== 'assassin'
                            }"
                          >
                            <svg v-if="players[nightActions.seer].role === 'assassin'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF4E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p class="text-white font-medium">
                            {{ t('seerReveal', { 
                              player: players[nightActions.seer].name, 
                              role: t(`${players[nightActions.seer].role}Role`) 
                            }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    @click="advanceNightPhase" 
                    class="bg-gradient-to-r from-[#4B61FF] to-[#6879FF] text-white py-4 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg w-full active:scale-[0.98] active:shadow-inner"
                  >
                    {{ t('continue') }}
                  </button>
                </div>
              </transition>
            </div>
          </transition>

          <!-- Day Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'day'" class="text-center" key="day-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('dayPhase') }}</h2>
              <p class="text-[#A0A0B8] mb-4">{{ t('dayDescription') }}</p>

              <!-- Day Events - Only show assassination events -->
              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2 text-white">{{ t('nightEvents') }}</h3>

                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                  <transition-group name="list" tag="div">
                    <div v-for="(event, index) in dayEvents.filter(e => e.type === 'killed')" :key="`event-${index}`" class="mb-2 last:mb-0">
                      <p class="text-[#FF4E4E]">
                        {{ t('playerKilled', { player: players[event.playerId].name }) }}
                      </p>
                    </div>

                    <p v-if="dayEvents.filter(e => e.type === 'killed').length === 0" key="peaceful" class="text-[#A0A0B8]">
                      {{ t('peacefulNight') }}
                    </p>
                  </transition-group>
                </div>
              </div>

              <button
                  @click="startDiscussion"
                  class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                {{ t('startDiscussion') }}
              </button>
            </div>
          </transition>

          <!-- Discussion Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'discussion'" class="text-center" key="discussion-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('discussionPhase') }}</h2>
              <p class="text-[#A0A0B8] mb-4">{{ t('discussionDescription') }}</p>

              <!-- Alive Players -->
              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2 text-white">{{ t('alivePlayers') }}</h3>

                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                  <transition-group name="list" tag="div">
                    <div v-for="player in alivePlayers" :key="`alive-${player.id}`" class="mb-2 last:mb-0">
                      <p class="text-white">{{ player.name }}</p>
                    </div>
                  </transition-group>
                </div>
              </div>

              <button
                  @click="startVoting"
                  class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                {{ t('startVoting') }}
              </button>
            </div>
          </transition>

          <!-- Voting Phase - Improved for mobile -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'voting'" class="text-center" key="voting-phase">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-semibold text-white">{{ t('votingPhase') }}</h2>
                <div class="bg-[#2A2A3F]/70 text-[#A0A0B8] text-xs font-medium px-2 py-1 rounded">
                  {{ t('round') }} {{ currentRound }}
                </div>
              </div>

              <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-[#A0A0B8] text-left">{{ t('votingDescription') }}</p>
                </div>

                <!-- Voting progress indicator -->
                <div class="bg-[#1A1A2E]/70 p-3 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-[#A0A0B8]">{{ t('votingProgress') }}</span>
                    <span class="text-sm font-medium text-white">
                      {{ alivePlayers.filter(p => p.votedFor !== null).length }} / {{ alivePlayers.length }}
                    </span>
                  </div>
                  <div class="w-full bg-[#2A2A3F] rounded-full h-2.5 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-[#4B61FF] to-[#6879FF] h-2.5 rounded-full transition-all duration-500"
                      :style="{width: `${(alivePlayers.filter(p => p.votedFor !== null).length / alivePlayers.length) * 100}%`}"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Voting for each player - Enhanced for mobile -->
              <div class="space-y-6">
                <div v-for="voter in alivePlayers" :key="`voter-${voter.id}`" class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6 relative">
                  <!-- Voter info with status indicator -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-3">
                        <span class="text-[#4B61FF] font-bold">{{ voter.id + 1 }}</span>
                      </div>
                      <h3 class="text-xl font-semibold text-white">{{ voter.name }}</h3>
                    </div>

                    <!-- Voting status -->
                    <div 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="voter.votedFor !== null ? 'bg-[#4B61FF]/20 text-[#4B61FF]' : 'bg-[#2A2A3F] text-[#A0A0B8]'"
                    >
                      {{ voter.votedFor !== null ? t('voted') : t('voting') }}
                    </div>
                  </div>

                  <!-- Target selection with improved layout -->
                  <div v-if="voter.votedFor === null">
                    <p class="text-sm text-[#A0A0B8] mb-3 text-left">{{ t('selectTarget') }}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        v-for="target in alivePlayers"
                        :key="`vote-${voter.id}-${target.id}`"
                        @click="vote(voter.id, target.id)"
                        class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-3 px-4 rounded-lg transition-all text-base border border-[#35364A] flex items-center justify-between"
                        :class="{ 
                          'opacity-50 cursor-not-allowed': voter.id === target.id,
                          'hover:border-[#4B61FF]/50': voter.id !== target.id
                        }"
                        :disabled="voter.id === target.id"
                      >
                        <div class="flex items-center">
                          <div class="w-6 h-6 rounded-full bg-[#2A2A3F] flex items-center justify-center mr-2 border border-[#35364A]">
                            <span class="text-xs text-[#A0A0B8]">{{ target.id + 1 }}</span>
                          </div>
                          <span>{{ target.name }}</span>
                        </div>

                        <svg v-if="voter.id !== target.id" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#4B61FF] opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Already voted display -->
                  <div v-else class="bg-[#1A1A2E]/70 p-3 rounded-lg flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-6 h-6 rounded-full bg-[#4B61FF]/20 flex items-center justify-center mr-2">
                        <span class="text-xs text-[#4B61FF]">{{ players[voter.votedFor].id + 1 }}</span>
                      </div>
                      <span class="text-white">{{ t('votedFor', { target: players[voter.votedFor].name }) }}</span>
                    </div>

                    <div class="w-6 h-6 rounded-full bg-[#4B61FF] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Voting Results Phase - Improved for mobile -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'votingResults'" class="text-center" key="voting-results-phase">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-semibold text-white">{{ t('votingResultsPhase') }}</h2>
                <div class="bg-[#2A2A3F]/70 text-[#A0A0B8] text-xs font-medium px-2 py-1 rounded">
                  {{ t('round') }} {{ currentRound }}
                </div>
              </div>

              <!-- Voting Results Description -->
              <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p class="text-[#A0A0B8] text-left">{{ t('votingResultsDescription') }}</p>
                </div>
              </div>

              <!-- Voting Results - Enhanced for mobile -->
              <div class="mb-6">
                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6">
                  <h4 class="text-lg font-semibold mb-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#4B61FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    {{ t('votingResults') }}
                  </h4>

                  <!-- Vote count bars -->
                  <div class="space-y-4">
                    <div v-for="player in alivePlayers" :key="`vote-result-${player.id}`" class="relative">
                      <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center">
                          <div class="w-6 h-6 rounded-full bg-[#2A2A3F] flex items-center justify-center mr-2 border border-[#35364A]">
                            <span class="text-xs text-[#A0A0B8]">{{ player.id + 1 }}</span>
                          </div>
                          <span class="text-white font-medium">{{ player.name }}</span>
                        </div>
                        <span 
                          class="text-sm font-bold px-2 py-0.5 rounded"
                          :class="votingResults.eliminatedPlayerId === player.id ? 'bg-[#FF4E4E]/20 text-[#FF4E4E]' : 'bg-[#4B61FF]/20 text-[#4B61FF]'"
                        >
                          {{ votingResults.votes[player.id] || 0 }} {{ t('votesReceived') }}
                        </span>
                      </div>

                      <!-- Vote progress bar -->
                      <div class="w-full bg-[#2A2A3F] rounded-full h-2.5 overflow-hidden">
                        <div 
                          class="h-2.5 rounded-full transition-all duration-700"
                          :class="votingResults.eliminatedPlayerId === player.id ? 'bg-[#FF4E4E]' : 'bg-[#4B61FF]'"
                          :style="{
                            width: `${((votingResults.votes[player.id] || 0) / Math.max(...Object.values(votingResults.votes), 1)) * 100}%`
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Eliminated player announcement -->
                  <transition name="fade">
                    <div v-if="votingResults.eliminatedPlayerId !== null" class="mt-6 pt-4 border-t border-[#35364A] bg-[#1A1A2E]/70 p-4 rounded-lg">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF4E4E]/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF4E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p class="text-[#FF4E4E] font-bold text-lg">
                          {{ t('playerEliminated', { player: players[votingResults.eliminatedPlayerId].name }) }}
                        </p>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Continue button - Enhanced for mobile -->
              <button
                @click="continueAfterVoting"
                class="bg-gradient-to-r from-[#4B61FF] to-[#6879FF] text-white py-4 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg w-full active:scale-[0.98] active:shadow-inner"
              >
                <div class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  {{ t('continueToNextRound') }}
                </div>
              </button>
            </div>
          </transition>

          <!-- Results Phase - Improved for mobile -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'results'" class="text-center" key="results-phase">
              <div class="flex items-center justify-center mb-6">
                <div class="bg-[#2A2A3F]/70 px-3 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#A0A0B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h2 class="text-2xl font-semibold text-white">{{ t('gameOver') }}</h2>
                </div>
              </div>

              <!-- Winner announcement with animation -->
              <div class="mb-8">
                <div 
                  class="p-6 rounded-lg border-2 mb-6 relative overflow-hidden animate-pulse-slow"
                  :class="{ 
                    'bg-[#FF4E4E]/10 border-[#FF4E4E]': gameResult === 'assassins', 
                    'bg-[#4B61FF]/10 border-[#4B61FF]': gameResult === 'villagers' 
                  }"
                >
                  <!-- Background pattern -->
                  <div class="absolute inset-0 opacity-10">
                    <div v-if="gameResult === 'assassins'" class="absolute inset-0 pattern-assassins"></div>
                    <div v-else class="absolute inset-0 pattern-villagers"></div>
                  </div>

                  <!-- Trophy icon -->
                  <div class="flex justify-center mb-4">
                    <div 
                      class="w-16 h-16 rounded-full flex items-center justify-center"
                      :class="{ 
                        'bg-[#FF4E4E]/20': gameResult === 'assassins', 
                        'bg-[#4B61FF]/20': gameResult === 'villagers' 
                      }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        :class="{ 
                          'text-[#FF4E4E]': gameResult === 'assassins', 
                          'text-[#4B61FF]': gameResult === 'villagers' 
                        }"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-3xl font-bold relative z-10" 
                    :class="{ 
                      'text-[#FF4E4E]': gameResult === 'assassins', 
                      'text-[#4B61FF]': gameResult === 'villagers' 
                    }"
                  >
                    {{ gameResult === 'assassins' ? t('assassinsWin') : t('villagersWin') }}
                  </h3>
                </div>

                <!-- Player roles with improved layout -->
                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A]">
                  <h4 class="text-lg font-semibold mb-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#A0A0B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {{ t('playerRoles') }}
                  </h4>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div 
                      v-for="player in players" 
                      :key="`result-${player.id}`" 
                      class="bg-[#1A1A2E]/70 p-3 rounded-lg border border-[#35364A] flex items-center justify-between"
                      :class="{ 
                        'border-[#FF4E4E]/50': player.role === 'assassin' && !player.isAlive,
                        'border-[#4B61FF]/50': player.role !== 'assassin' && !player.isAlive
                      }"
                    >
                      <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          :class="{ 
                            'bg-[#FF4E4E]/20': player.role === 'assassin', 
                            'bg-[#4B61FF]/20': player.role !== 'assassin' 
                          }"
                        >
                          <span class="font-bold"
                            :class="{ 
                              'text-[#FF4E4E]': player.role === 'assassin', 
                              'text-[#4B61FF]': player.role !== 'assassin' 
                            }"
                          >
                            {{ player.id + 1 }}
                          </span>
                        </div>
                        <div class="text-left">
                          <div class="text-white font-medium">{{ player.name }}</div>
                          <div class="text-xs"
                            :class="{ 
                              'text-[#FF4E4E]': player.role === 'assassin', 
                              'text-[#4B61FF]': player.role !== 'assassin' 
                            }"
                          >
                            {{ t(`${player.role}Role`) }}
                          </div>
                        </div>
                      </div>

                      <!-- Status indicator -->
                      <div class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="player.isAlive ? 'bg-[#4B61FF]/20 text-[#4B61FF]' : 'bg-[#FF4E4E]/20 text-[#FF4E4E]'"
                      >
                        {{ player.isAlive ? t('survived') : t('eliminated') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Return to main menu button - Enhanced for mobile -->
              <button
                @click="returnToMainMenu"
                class="bg-gradient-to-r from-[#4B61FF] to-[#6879FF] text-white py-4 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg w-full active:scale-[0.98] active:shadow-inner"
              >
                <div class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {{ t('returnToMainMenu') }}
                </div>
              </button>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* List transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Scale transition */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

/* Custom animation for slow pulsing effect */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Background patterns */
.pattern-assassins {
  background-image: radial-gradient(#FF4E4E 1px, transparent 1px);
  background-size: 20px 20px;
}

.pattern-villagers {
  background-image: radial-gradient(#4B61FF 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
