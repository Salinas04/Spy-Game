<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

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

    <!-- Speech toggle button - Enhanced for mobile -->
    <div class="absolute top-4 right-4 z-10">
      <button 
        @click="toggleSpeech" 
        class="bg-[#2A2A3F] hover:bg-[#35364A] text-white p-2 sm:p-2 rounded-full transition-all shadow-md active:shadow-inner"
        :class="{ 
          'bg-[#4B61FF]': isSpeechEnabled,
          'p-3': isMobile, // Larger touch target on mobile
          'active:bg-[#3A51DF]': isMobile // Visual feedback on mobile
        }"
        title="Toggle narrator voice"
        aria-label="Toggle narrator voice"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-6 sm:w-6" :class="{ 'h-7 w-7': isMobile }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="isSpeechEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      </button>
      <!-- Speaking indicator with enhanced visibility -->
      <div v-if="speakingNow" class="mt-2 bg-[#4B61FF]/30 p-1 sm:p-1 rounded-full flex items-center justify-center" :class="{ 'p-2': isMobile }">
        <div class="animate-pulse h-2 w-2 sm:h-2 sm:w-2 bg-[#4B61FF] rounded-full" :class="{ 'h-3 w-3': isMobile }"></div>
      </div>
      <!-- Mobile-specific indicator for speech status -->
      <div v-if="isMobile" class="mt-1 text-xs text-center text-[#A0A0B8]">
        {{ isSpeechEnabled ? 'Narrador ON' : 'Narrador OFF' }}
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

          <!-- Night Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'night'" class="text-center" key="night-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('nightPhase') }}</h2>

              <!-- Narrator -->
              <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-6">
                <p class="text-[#A0A0B8] text-lg italic">{{ t('nightDescription') }}</p>
                <transition name="fade" mode="out-in">
                  <div v-if="isPreNightPhase" :key="'pre-night'" class="text-center">
                    <p class="text-white text-2xl mt-4 mb-6 font-bold">{{ t('preNightAnnouncement') }}</p>
                    <div class="flex justify-center items-center">
                      <div class="bg-[#4B61FF] text-white text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center">
                        {{ preNightTimer }}
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-white text-lg mt-2 font-medium" :key="currentNightRole + (showSeerResult ? '-result' : '')">
                    <span v-if="currentNightRole === 'assassin'">{{ t('narratorAssassin') }}</span>
                    <span v-else-if="currentNightRole === 'doctor'">{{ t('narratorDoctor') }}</span>
                    <span v-else-if="currentNightRole === 'seer' && !showSeerResult">{{ t('narratorSeer') }}</span>
                    <span v-else-if="currentNightRole === 'seer' && showSeerResult">{{ t('narratorSeerResult') }}</span>
                  </p>
                </transition>
              </div>

              <!-- Night Role Actions -->
              <transition name="slide-fade" mode="out-in">
                <!-- Pre-Night Phase - Hide role actions -->
                <div v-if="isPreNightPhase" key="pre-night-actions" class="mb-6">
                  <!-- No role actions during pre-night phase -->
                </div>

                <!-- Assassin Action -->
                <div v-else-if="currentNightRole === 'assassin'" class="mb-6" key="assassin-action">
                  <h3 class="text-xl font-semibold mb-2 text-[#FF4E4E]">{{ t('assassinTurn') }}</h3>
                  <p class="text-[#A0A0B8] mb-4">{{ t('assassinPrompt') }}</p>

                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`assassin-target-${player.id}`"
                      @click="performNightAction('assassin', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#FF4E4E]/20 text-white py-2 px-3 rounded-lg transition-all text-sm border border-[#35364A]"
                      :class="{ 'bg-[#FF4E4E]/20 border-[#FF4E4E]': nightActions.assassin === player.id }"
                      :disabled="player.role === 'assassin'"
                    >
                      {{ player.name }}
                    </button>
                  </div>
                </div>

                <!-- Doctor Action -->
                <div v-else-if="currentNightRole === 'doctor'" class="mb-6" key="doctor-action">
                  <h3 class="text-xl font-semibold mb-2 text-[#4B61FF]">{{ t('doctorTurn') }}</h3>
                  <p class="text-[#A0A0B8] mb-4">{{ t('doctorPrompt') }}</p>

                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`doctor-target-${player.id}`"
                      @click="performNightAction('doctor', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-2 px-3 rounded-lg transition-all text-sm border border-[#35364A]"
                      :class="{ 'bg-[#4B61FF]/20 border-[#4B61FF]': nightActions.doctor === player.id }"
                    >
                      {{ player.name }}
                    </button>
                  </div>
                </div>

                <!-- Seer Action -->
                <div v-else-if="currentNightRole === 'seer' && !showSeerResult" class="mb-6" key="seer-action">
                  <h3 class="text-xl font-semibold mb-2 text-[#4B61FF]">{{ t('seerTurn') }}</h3>
                  <p class="text-[#A0A0B8] mb-4">{{ t('seerPrompt') }}</p>

                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="player in alivePlayers" 
                      :key="`seer-target-${player.id}`"
                      @click="performNightAction('seer', player.id)"
                      class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-2 px-3 rounded-lg transition-all text-sm border border-[#35364A]"
                      :class="{ 'bg-[#4B61FF]/20 border-[#4B61FF]': nightActions.seer === player.id }"
                      :disabled="player.role === 'seer'"
                    >
                      {{ player.name }}
                    </button>
                  </div>
                </div>

                <!-- Seer Result -->
                <div v-else-if="currentNightRole === 'seer' && showSeerResult" class="mb-6" key="seer-result">
                  <h3 class="text-xl font-semibold mb-2 text-[#4B61FF]">{{ t('seerInfo') }}</h3>

                  <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                    <p class="text-white">
                      {{ t('seerReveal', { 
                        player: players[nightActions.seer].name, 
                        role: t(`${players[nightActions.seer].role}Role`) 
                      }) }}
                    </p>
                  </div>

                  <button 
                    @click="advanceNightPhase" 
                    class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
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

          <!-- Voting Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'voting'" class="text-center" key="voting-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('votingPhase') }}</h2>
              <p class="text-[#A0A0B8] mb-4">{{ t('votingDescription') }}</p>

              <!-- Voting for each player -->
              <transition-group name="list" tag="div">
                <div v-for="voter in alivePlayers" :key="`voter-${voter.id}`" class="mb-6">
                  <h3 class="text-xl font-semibold mb-2 text-white">{{ voter.name }} {{ t('votes') }}</h3>

                  <div class="grid grid-cols-2 gap-2">
                    <button
                        v-for="target in alivePlayers"
                        :key="`vote-${voter.id}-${target.id}`"
                        @click="vote(voter.id, target.id)"
                        class="bg-[#2A2A3F] hover:bg-[#4B61FF]/20 text-white py-2 px-3 rounded-lg transition-all text-sm border border-[#35364A]"
                        :class="{ 'bg-[#4B61FF]/20 border-[#4B61FF]': voter.votedFor === target.id }"
                        :disabled="voter.id === target.id || voter.votedFor !== null"
                    >
                      {{ target.name }}
                    </button>
                  </div>
                </div>
              </transition-group>
            </div>
          </transition>

          <!-- Voting Results Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'votingResults'" class="text-center" key="voting-results-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('votingResultsPhase') }}</h2>
              <p class="text-[#A0A0B8] mb-4">{{ t('votingResultsDescription') }}</p>

              <!-- Voting Results -->
              <div class="mb-6">
                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                  <h4 class="text-lg font-semibold mb-4 text-white">{{ t('votingResults') }}</h4>

                  <transition-group name="list" tag="div">
                    <div v-for="player in alivePlayers" :key="`vote-result-${player.id}`" class="mb-3 last:mb-0 flex justify-between items-center">
                      <span class="text-white">{{ player.name }}</span>
                      <span class="text-[#4B61FF] font-bold">
                    {{ votingResults.votes[player.id] || 0 }} {{ t('votesReceived') }}
                  </span>
                    </div>
                  </transition-group>

                  <transition name="fade">
                    <div v-if="votingResults.eliminatedPlayerId !== null" class="mt-6 pt-4 border-t border-[#35364A]">
                      <p class="text-[#FF4E4E] font-bold">
                        {{ t('playerEliminated', { player: players[votingResults.eliminatedPlayerId].name }) }}
                      </p>
                    </div>
                  </transition>
                </div>
              </div>

              <button
                  @click="continueAfterVoting"
                  class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                {{ t('continueToNextRound') }}
              </button>
            </div>
          </transition>

          <!-- Results Phase -->
          <transition name="fade" mode="out-in">
            <div v-if="gamePhase === 'results'" class="text-center" key="results-phase">
              <h2 class="text-2xl font-semibold mb-6 text-white">{{ t('gameOver') }}</h2>

              <div class="mb-6">
                <h3 class="text-2xl font-bold mb-4" :class="{ 'text-[#FF4E4E]': gameResult === 'assassins', 'text-[#4B61FF]': gameResult === 'villagers' }">
                  {{ gameResult === 'assassins' ? t('assassinsWin') : t('villagersWin') }}
                </h3>

                <div class="bg-[#2A2A3F]/50 p-4 rounded-lg border border-[#35364A] mb-4">
                  <h4 class="text-lg font-semibold mb-2 text-white">{{ t('playerRoles') }}</h4>

                  <transition-group name="list" tag="div">
                    <div v-for="player in players" :key="`result-${player.id}`" class="mb-2 last:mb-0 flex justify-between">
                      <span class="text-white">{{ player.name }}</span>
                      <span :class="{ 'text-[#FF4E4E]': player.role === 'assassin', 'text-[#4B61FF]': player.role !== 'assassin' }">
                    {{ t(`${player.role}Role`) }}
                  </span>
                    </div>
                  </transition-group>
                </div>
              </div>

              <button
                  @click="returnToMainMenu"
                  class="bg-[#4B61FF] hover:bg-[#6879FF] text-white py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                {{ t('returnToMainMenu') }}
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
</style>
