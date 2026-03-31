<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({ gameSettings: Object });
const emit  = defineEmits(['returnToMainMenu']);
const { t, locale } = useI18n();

// ─── Category data — temas respondibles con UNA PALABRA ─────────
const categoryTopics = {
  hp_everyday: {
    es: [
      'Cosas en un escritorio de oficina',
      'Objetos dentro de un bolso de mujer',
      'Cosas en el cajón del caos de la cocina',
      'Objetos en la mesilla de noche',
      'Cosas debajo del sofá',
      'Utensilios de cocina',
      'Lo que hay en la nevera de un soltero',
      'Cosas que siempre se pierden en casa',
      'Objetos en el baño',
      'Cosas en la guantera del coche',
      'Objetos en una mochila escolar',
      'Cosas que nunca tiras aunque no sirvan',
      'Lo que hay en el fondo de un bolso viejo',
      'Aparatos de cocina inútiles',
      'Herramientas de bricolaje',
      'Cosas en el botiquín de casa',
      'Objetos en una ferretería',
      'Marcas de electrodomésticos',
    ],
    en: [
      'Things on an office desk',
      'Objects inside a woman\'s purse',
      'Things in the kitchen junk drawer',
      'Objects on the bedside table',
      'Things under the sofa',
      'Kitchen utensils',
      'What\'s in a bachelor\'s fridge',
      'Things that always get lost at home',
      'Objects in the bathroom',
      'Things in a car glove compartment',
      'Objects in a school backpack',
      'Things you never throw away even though you should',
      'What\'s at the bottom of an old bag',
      'Useless kitchen gadgets',
      'DIY tools',
      'Things in a home first aid kit',
      'Things in a hardware store',
      'Household appliance brands',
    ],
  },

  hp_dark: {
    es: [
      'Cosas en un velatorio',
      'Enfermedades que dan mucho miedo',
      'Formas de morir en una peli de terror',
      'Cosas en una morgue',
      'Razones para ir al psicólogo',
      'Síntomas de estar muy mal',
      'Armas en una película de miedo',
      'Cosas en un cementerio',
      'Profesiones con más riesgo de muerte',
      'Cosas que hacen los zombis',
      'Tipos de veneno famoso',
      'Enfermedades que dan asco',
      'Supersticiones que traen mala suerte',
      'Cosas que salen en una autopsia',
      'Últimas palabras típicas de película',
      'Razones por las que te niegan el seguro de vida',
      'Objetos en un cuarto de torturas medieval',
      'Tipos de fantasma según las películas',
    ],
    en: [
      'Things at a funeral',
      'Diseases that are really scary',
      'Ways to die in a horror movie',
      'Things in a morgue',
      'Reasons to go to therapy',
      'Symptoms of being really unwell',
      'Weapons in a horror movie',
      'Things in a cemetery',
      'Most dangerous professions',
      'Things zombies do',
      'Famous types of poison',
      'Disgusting diseases',
      'Superstitions that bring bad luck',
      'Things found during an autopsy',
      'Typical last words in movies',
      'Reasons your life insurance gets denied',
      'Objects in a medieval torture chamber',
      'Types of ghost according to movies',
    ],
  },

  hp_adult: {
    es: [
      'Excusas para no tener sexo',
      'Cosas que escondes en casa',
      'Razones para pedir el divorcio',
      'Cosas en un hotel de paso',
      'Lo que buscas en Google a las 3am',
      'Razones para borrar el historial del móvil',
      'Cosas en el cajón de la mesilla de noche',
      'Excusas para no ir a casa de los suegros',
      'Razones por las que tu ex te bloqueó',
      'Tipos de juguete para adultos',
      'Marcas de condones',
      'Cosas que pasan en una despedida de soltero/a',
      'Razones para ir a terapia de pareja',
      'Partes del cuerpo en el reggaetón',
      'Excusas para no conocer a los padres de tu pareja',
      'Cosas que haces cuando tu pareja no está',
      'Razones por las que el vecino te mira raro',
      'Cosas que no le enseñas a nadie en el móvil',
    ],
    en: [
      'Excuses for not having sex',
      'Things you hide at home',
      'Reasons to get a divorce',
      'Things in a cheap hotel room',
      'What you Google at 3am',
      'Reasons to clear your phone history',
      'Things in the bedside drawer',
      'Excuses for not visiting your in-laws',
      'Reasons your ex blocked you',
      'Types of adult toys',
      'Condom brands',
      'Things that happen at a bachelor/bachelorette party',
      'Reasons to go to couples therapy',
      'Body parts mentioned in reggaeton',
      'Excuses not to meet your partner\'s parents',
      'Things you do when your partner is away',
      'Reasons your neighbor gives you weird looks',
      'Things on your phone you hide from everyone',
    ],
  },

  hp_work: {
    es: [
      'Excusas para llegar tarde al trabajo',
      'Cosas que robas de la oficina',
      'Razones para pedir la baja',
      'Excusas para no hacer horas extra',
      'Objetos en el escritorio del empleado más vago',
      'Razones para odiar los lunes',
      'Frases de jefe tóxico',
      'Excusas para no ir a la cena de empresa',
      'Cosas que haces para parecer ocupado',
      'Razones para pedir un aumento',
      'Cosas robadas de la nevera de la oficina',
      'Tipos de compañero de trabajo insoportable',
      'Excusas para no responder emails',
      'Razones para dimitir',
      'Objetos en una sala de reuniones',
      'Palabras de moda en el mundo corporativo',
      'Cosas que no se dicen en una entrevista',
      'Razones por las que te despiden',
    ],
    en: [
      'Excuses for being late to work',
      'Things you steal from the office',
      'Reasons to call in sick',
      'Excuses for not doing overtime',
      'Objects on the laziest employee\'s desk',
      'Reasons to hate Mondays',
      'Toxic boss catchphrases',
      'Excuses for skipping the office Christmas party',
      'Things you do to look busy',
      'Reasons to ask for a raise',
      'Things stolen from the office fridge',
      'Types of unbearable coworker',
      'Excuses for not replying to emails',
      'Reasons to quit',
      'Objects in a meeting room',
      'Corporate buzzwords',
      'Things you never say in a job interview',
      'Reasons you get fired',
    ],
  },

  hp_absurd: {
    es: [
      'Cosas en la mochila de un pingüino',
      'Mascotas de Satanás',
      'Superpoderes completamente inútiles',
      'Trabajos para un unicornio',
      'Cosas que haría un pirata en el súper',
      'Razones por las que los aliens no nos visitan',
      'Profesiones para un fantasma',
      'Cosas que haría un dinosaurio hoy en día',
      'Lo que compraría un zombie en Amazon',
      'Razones por las que Dios necesita vacaciones',
      'Cosas que haría un monstruo en IKEA',
      'Excusas de un vampiro para no salir de noche',
      'Tareas del hogar de Frankenstein',
      'Cosas que haría Voldemort en un día libre',
      'Razones por las que el hombre del saco tiene ansiedad',
      'Hobbies de un dragón jubilado',
      'Cosas en la lista de la compra de una bruja',
      'Razones por las que los zombis necesitan seguro médico',
    ],
    en: [
      'Things in a penguin\'s backpack',
      'Satan\'s pets',
      'Completely useless superpowers',
      'Jobs for a unicorn',
      'Things a pirate would do at the supermarket',
      'Reasons aliens don\'t visit us',
      'Professions for a ghost',
      'Things a dinosaur would do today',
      'Things a zombie would buy on Amazon',
      'Reasons God needs a vacation',
      'Things a monster would do at IKEA',
      'Excuses a vampire gives for not going out',
      'Household chores for Frankenstein',
      'Things Voldemort would do on a day off',
      'Reasons the Boogeyman has anxiety',
      'Hobbies of a retired dragon',
      'Things on a witch\'s shopping list',
      'Reasons zombies need health insurance',
    ],
  },

  hp_party: {
    es: [
      'Cosas que pierdes en una noche de fiesta',
      'Síntomas de resaca',
      'Excusas para no pagar tu ronda',
      'Lo que comes al llegar borracho a casa',
      'Cosas en el baño de una discoteca',
      'Excusas para seguir bebiendo',
      'Tipos de borracho en una fiesta',
      'Lo que hay en la nevera del piso de estudiantes',
      'Bebidas que no deberías mezclar',
      'Cosas que encuentras en el taxi de vuelta',
      'Razones para llamar a un taxi a las 5am',
      'Cosas que pasan en una boda de pueblo',
      'Razones para no recordar la noche anterior',
      'Lo que llevas en los bolsillos tras una noche de fiesta',
      'Tipos de resaca',
      'Cosas que haces en una fiesta sin conocer a nadie',
      'Excusas para no volver a casa',
      'Razones para no volver a beber nunca más',
    ],
    en: [
      'Things you lose on a night out',
      'Hangover symptoms',
      'Excuses for not paying your round',
      'What you eat when you get home drunk',
      'Things in a nightclub bathroom',
      'Excuses to keep drinking',
      'Types of drunk person at a party',
      'What\'s in a student house fridge',
      'Drinks you should never mix',
      'Things you find in the taxi home',
      'Reasons to call a taxi at 5am',
      'Things that happen at a countryside wedding',
      'Reasons you don\'t remember last night',
      'What\'s in your pockets after a night out',
      'Types of hangover',
      'Things you do at a party knowing no one',
      'Excuses for not going home',
      'Reasons to never drink again',
    ],
  },

  hp_popculture: {
    es: [
      'Cosas que haría Batman en su día libre',
      'Razones por las que los villanos de Marvel fallan',
      'Personajes de Disney que necesitan terapia',
      'Superpoderes inútiles de superhéroes',
      'Cosas en el castillo de un villano de Disney',
      'Razones por las que los personajes de terror no huyen',
      'Cosas que hace un influencer cuando no hay cámara',
      'Personajes de videojuego que dan miedo',
      'Razones por las que Darth Vader necesita terapia',
      'Cosas que haría Thanos en un día tranquilo',
      'Personajes de serie que merecían morir antes',
      'Razones por las que los zombis de Walking Dead siguen',
      'Cosas que compraría un villano en Amazon',
      'Series que se fueron de las manos',
      'Personajes de anime que dan vergüenza ajena',
      'Razones por las que Game of Thrones acabó así',
      'Hobbies de los Vengadores en su tiempo libre',
      'Cosas que haría Voldemort en Tinder',
    ],
    en: [
      'Things Batman does on his day off',
      'Reasons Marvel villains always fail',
      'Disney characters who need therapy',
      'Useless superpowers',
      'Things in a Disney villain\'s castle',
      'Reasons horror movie characters don\'t run',
      'Things an influencer does off camera',
      'Scary video game characters',
      'Reasons Darth Vader needs therapy',
      'Things Thanos does on a chill day',
      'TV characters who should have died sooner',
      'Reasons Walking Dead zombies keep going',
      'Things a movie villain buys on Amazon',
      'TV shows that went off the rails',
      'Cringeworthy anime characters',
      'Reasons Game of Thrones ended like that',
      'Avengers\' hobbies in their free time',
      'Things Voldemort would do on Tinder',
    ],
  },
};

const timerRanges = {
  easy:   { min: 90000,  max: 240000 },
  medium: { min: 40000,  max: 120000 },
  hard:   { min: 20000,  max: 60000  },
};

// ─── State ───────────────────────────────────────────────────────
const settings   = props.gameSettings;
const difficulty = settings.difficulty;

const round        = ref(1);
const currentTopic = ref('');
const phase        = ref('countdown'); // 'countdown' | 'playing' | 'exploded'
const countdown    = ref(3);           // 3 → 2 → 1 → 0 (GO!)
const shakeLevel   = ref(0);
const exploding    = ref(false);

let gameTimer      = null;
let shakeTimer     = null;
let countdownTimer = null;
let tickInterval   = null;

// ─── Available categories ────────────────────────────────────────
const availableCategories = computed(() => {
  const cats = settings.categories;
  if (cats.includes('all')) return Object.keys(categoryTopics);
  return cats;
});

const pickTopic = () => {
  const cats   = availableCategories.value;
  const cat    = cats[Math.floor(Math.random() * cats.length)];
  const lang   = locale.value === 'es' ? 'es' : 'en';
  const topics = categoryTopics[cat]?.[lang] ?? [];
  if (!topics.length) { currentTopic.value = cat; return; }
  currentTopic.value = topics[Math.floor(Math.random() * topics.length)];
};

// ─── Audio ───────────────────────────────────────────────────────
let audioCtx = null;
const getAudio = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};

const playTick = () => {
  try {
    const ctx    = getAudio();
    const bufLen = Math.floor(ctx.sampleRate * 0.018);
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const bpf  = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 1800;
    bpf.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018);
    src.connect(bpf); bpf.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
};

// Countdown beep: higher pitch for 3/2/1, triumphant for GO
const playBeep = (isGo = false) => {
  try {
    const ctx  = getAudio();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = isGo ? 880 : 660;
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isGo ? 0.45 : 0.18));
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (isGo ? 0.45 : 0.18));
    if (isGo) {
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.value = 1100;
      gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.5);
    }
  } catch (_) {}
};

const startTicking = () => {
  stopTicking();
  playTick();
  tickInterval = setInterval(playTick, 320);
};
const stopTicking = () => { if (tickInterval) clearInterval(tickInterval); tickInterval = null; };

const playExplosion = () => {
  try {
    const ctx        = getAudio();
    const bufferSize = ctx.sampleRate * 0.9;
    const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data       = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 350;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    source.start();
    const osc = ctx.createOscillator(); const gain2 = ctx.createGain();
    osc.connect(gain2); gain2.connect(ctx.destination);
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 0.7);
    gain2.gain.setValueAtTime(1.1, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.7);
  } catch (_) {}
};

// ─── Countdown ───────────────────────────────────────────────────
const goLabel = computed(() => locale.value === 'es' ? '¡YA!' : 'GO!');

const startCountdown = () => {
  phase.value    = 'countdown';
  countdown.value = 3;
  playBeep();

  const tick = () => {
    countdown.value--;
    if (countdown.value > 0) {
      playBeep();
      countdownTimer = setTimeout(tick, 1000);
    } else {
      // countdown === 0 → show GO!
      playBeep(true);
      countdownTimer = setTimeout(beginPlaying, 700);
    }
  };
  countdownTimer = setTimeout(tick, 1000);
};

const beginPlaying = () => {
  const range    = timerRanges[difficulty];
  const duration = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  shakeLevel.value = 0;
  exploding.value  = false;
  phase.value      = 'playing';
  scheduleNextShake();
  startTicking();
  gameTimer = setTimeout(triggerExplosion, duration);
};

// ─── Shake scheduler ─────────────────────────────────────────────
const scheduleNextShake = () => {
  const delay = 2000 + Math.random() * 5000;
  shakeTimer = setTimeout(() => {
    if (phase.value !== 'playing') return;
    const r = Math.random();
    if      (r < 0.45) shakeLevel.value = 0;
    else if (r < 0.70) shakeLevel.value = 1;
    else if (r < 0.88) shakeLevel.value = 2;
    else               shakeLevel.value = 3;
    scheduleNextShake();
  }, delay);
};

// ─── Round control ────────────────────────────────────────────────
const clearAllTimers = () => {
  if (gameTimer)      clearTimeout(gameTimer);
  if (shakeTimer)     clearTimeout(shakeTimer);
  if (countdownTimer) clearTimeout(countdownTimer);
  gameTimer = shakeTimer = countdownTimer = null;
};

const triggerExplosion = () => {
  clearAllTimers();
  stopTicking();
  playExplosion();
  exploding.value  = true;
  shakeLevel.value = 3;
  phase.value      = 'exploded';
};

const nextRound = () => {
  clearAllTimers();
  stopTicking();
  round.value++;
  pickTopic();
  startCountdown();
};

const playAgain = () => {
  clearAllTimers();
  stopTicking();
  round.value = 1;
  pickTopic();
  startCountdown();
};

// ─── Init ────────────────────────────────────────────────────────
pickTopic();
startCountdown();

onUnmounted(() => {
  clearAllTimers();
  stopTicking();
  if (audioCtx) { try { audioCtx.close(); } catch (_) {} }
});

// ─── Visual helpers ───────────────────────────────────────────────
const shakeClass = computed(() => {
  if (exploding.value)        return 'scale-0 opacity-0';
  if (shakeLevel.value === 3) return 'animate-[wiggle_0.12s_ease-in-out_infinite]';
  if (shakeLevel.value === 2) return 'animate-[wiggle_0.25s_ease-in-out_infinite]';
  if (shakeLevel.value === 1) return 'animate-[wiggle_0.5s_ease-in-out_infinite]';
  return '';
});

const glowColor = computed(() => {
  if (shakeLevel.value === 3) return 'rgba(239,68,68,0.75)';
  if (shakeLevel.value === 2) return 'rgba(249,115,22,0.65)';
  if (shakeLevel.value === 1) return 'rgba(251,146,60,0.5)';
  return 'rgba(255,179,71,0.35)';
});
const glowSpeed = computed(() => {
  if (shakeLevel.value === 3) return '0.6s';
  if (shakeLevel.value === 2) return '1s';
  if (shakeLevel.value === 1) return '1.6s';
  return '2.4s';
});

const countdownColor = computed(() => {
  if (countdown.value === 0) return '#4ade80'; // green for GO
  if (countdown.value === 1) return '#f97316'; // orange
  if (countdown.value === 2) return '#fbbf24'; // yellow
  return '#ffffff';                             // white for 3
});
</script>

<template>
  <div
    class="relative min-h-screen flex flex-col overflow-hidden transition-colors duration-500"
    :class="exploding ? 'bg-red-950' : 'bg-[var(--color-background)]'"
  >

    <!-- ── Animated background orbs ─────────────────────────────── -->
    <div v-if="!exploding" class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
    </div>

    <!-- Explosion flash -->
    <div
      v-if="exploding"
      class="absolute inset-0 pointer-events-none bg-red-500 animate-[flash_0.5s_ease-out_forwards] z-10"
    ></div>

    <!-- ── Top bar ────────────────────────────────────────────────── -->
    <div class="relative z-20 flex items-center justify-between px-4 pt-2 pb-2 border-b border-[var(--color-border)]/40">
      <span class="text-[var(--color-text-secondary)] text-sm font-medium">
        {{ t('hotPotatoRound') }} {{ round }}
      </span>
      <span class="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">
        {{ difficulty === 'easy' ? t('hotPotatoDifficultyEasy') : difficulty === 'medium' ? t('hotPotatoDifficultyMedium') : t('hotPotatoDifficultyHard') }}
      </span>
    </div>

    <!-- ── COUNTDOWN ─────────────────────────────────────────────── -->
    <div
      v-if="phase === 'countdown'"
      class="relative z-20 flex-1 flex flex-col items-center justify-center gap-6"
    >
      <!-- Big countdown number -->
      <div
        :key="countdown"
        class="flex items-center justify-center countdown-pop"
        :style="{ color: countdownColor }"
      >
        <span class="font-black leading-none" style="font-size: 9rem; filter: drop-shadow(0 0 30px currentColor);">
          {{ countdown === 0 ? goLabel : countdown }}
        </span>
      </div>
    </div>

    <!-- ── PLAYING ────────────────────────────────────────────────── -->
    <div v-else-if="phase === 'playing'" class="relative z-20 flex-1 flex flex-col items-center justify-center px-6 gap-12">

      <!-- Topic card -->
      <div class="w-full text-center">
        <p class="text-[var(--color-text-secondary)] text-xs font-bold tracking-widest uppercase mb-3">
          {{ t('hotPotatoTopic') }}
        </p>
        <div
          class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm rounded-3xl px-8 py-6 border border-[var(--color-border)] shadow-xl transition-all duration-500"
          :class="{ 'border-orange-500/60': shakeLevel >= 2 }"
        >
          <h2 class="text-2xl font-extrabold text-[var(--color-heading)] leading-snug">
            {{ currentTopic }}
          </h2>
        </div>
      </div>

      <!-- Potato -->
      <div class="animate-[float_2.8s_ease-in-out_infinite] flex items-center justify-center">
        <div class="relative flex items-center justify-center">
          <!-- Glow ring -->
          <div
            class="absolute rounded-full transition-all duration-700"
            :style="{
              width: '13rem', height: '13rem',
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
              animation: `glow-pulse ${glowSpeed} ease-in-out infinite alternate`,
            }"
          ></div>
          <!-- Emoji -->
          <div
            class="text-[9rem] select-none relative z-10 transition-all duration-200"
            :class="shakeClass"
            style="line-height: 1"
          >🥔</div>
        </div>
      </div>

    </div>

    <!-- ── EXPLODED ───────────────────────────────────────────────── -->
    <div v-else-if="phase === 'exploded'" class="relative z-20 flex-1 flex flex-col items-center justify-center px-6 gap-8">

      <div class="text-center">
        <div class="text-9xl mb-4 animate-[explosion-bounce_0.6s_cubic-bezier(0.36,0.07,0.19,0.97)]">💥</div>
        <h2 class="text-6xl font-black text-red-300 drop-shadow-[0_0_30px_rgba(252,165,165,0.9)] animate-[fade-in_0.4s_ease-out]">
          {{ t('hotPotatoExplosion') }}
        </h2>
      </div>

      <div class="flex flex-col gap-3 w-full max-w-xs">
        <button
          @click="nextRound"
          class="w-full py-4 rounded-2xl text-xl font-bold bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] transition-all shadow-lg active:scale-95"
        >
          {{ t('hotPotatoNextRound') }}
        </button>
        <button
          @click="playAgain"
          class="w-full py-3 rounded-2xl text-base font-semibold bg-[var(--color-background-soft)] hover:bg-[var(--color-background-mute)] text-[var(--color-text)] border border-[var(--color-border)] transition-all active:scale-95"
        >
          {{ t('hotPotatoPlayAgain') }}
        </button>
        <button
          @click="emit('returnToMainMenu')"
          class="w-full py-3 rounded-2xl text-base font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-all active:scale-95"
        >
          {{ t('returnToMainMenu') }}
        </button>
      </div>

    </div>

  </div>
</template>

<style scoped>
/* ── Background orbs ─────────────────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.45;
}
.orb-1 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, #ff6b2b, transparent);
  top: -100px; left: -100px;
  animation: drift-1 3.5s ease-in-out infinite alternate;
}
.orb-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, #ff3b3b, transparent);
  bottom: -40px; right: -80px;
  animation: drift-2 4s ease-in-out infinite alternate;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #ffb347, transparent);
  top: 40%; left: 50%;
  animation: drift-3 2.8s ease-in-out infinite alternate;
}
.orb-4 {
  width: 260px; height: 260px;
  background: radial-gradient(circle, #ff2255, transparent);
  top: 20%; right: -60px;
  animation: drift-4 3.2s ease-in-out infinite alternate;
}
@keyframes drift-1 {
  0%   { transform: translate(0px,   0px)   scale(1);    opacity: 0.35; }
  50%  { transform: translate(100px, 60px)  scale(1.35); opacity: 0.55; }
  100% { transform: translate(40px,  130px) scale(1.1);  opacity: 0.4;  }
}
@keyframes drift-2 {
  0%   { transform: translate(0px,    0px)   scale(1);    opacity: 0.4;  }
  50%  { transform: translate(-90px, -80px)  scale(1.3);  opacity: 0.6;  }
  100% { transform: translate(-30px, -150px) scale(0.9);  opacity: 0.35; }
}
@keyframes drift-3 {
  0%   { transform: translateX(-50%) translateY(0px)   scale(1);    opacity: 0.4;  }
  50%  { transform: translateX(-20%) translateY(-80px) scale(1.4);  opacity: 0.6;  }
  100% { transform: translateX(-70%) translateY(-30px) scale(0.85); opacity: 0.3;  }
}
@keyframes drift-4 {
  0%   { transform: translate(0px,   0px)  scale(1);    opacity: 0.3;  }
  50%  { transform: translate(-80px, 90px) scale(1.25); opacity: 0.55; }
  100% { transform: translate(-20px, 50px) scale(0.9);  opacity: 0.35; }
}

/* ── Countdown pop ───────────────────────────────────────────── */
@keyframes countdown-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.15);            }
  100% { transform: scale(1);   opacity: 1; }
}
.countdown-pop {
  animation: countdown-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* ── Potato float ────────────────────────────────────────────── */
@keyframes float {
  0%, 100% { transform: translateY(0px);   }
  50%       { transform: translateY(-18px); }
}

/* ── Potato shake ────────────────────────────────────────────── */
@keyframes wiggle {
  0%, 100% { transform: rotate(-4deg) scale(1);    }
  25%       { transform: rotate(4deg)  scale(1.07); }
  75%       { transform: rotate(-3deg) scale(0.96); }
}

/* ── Glow pulse ──────────────────────────────────────────────── */
@keyframes glow-pulse {
  0%   { transform: scale(0.85); opacity: 0.6; }
  100% { transform: scale(1.25); opacity: 1;   }
}

/* ── Explosion flash ─────────────────────────────────────────── */
@keyframes flash {
  0%   { opacity: 0.85; }
  100% { opacity: 0;    }
}

/* ── Explosion bounce ────────────────────────────────────────── */
@keyframes explosion-bounce {
  0%   { transform: scale(0.3) rotate(-10deg); opacity: 0; }
  60%  { transform: scale(1.3) rotate(5deg);   opacity: 1; }
  100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
}

/* ── BOOM fade in ────────────────────────────────────────────── */
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1);   }
}
</style>
