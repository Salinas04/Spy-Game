<script setup>
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';
import { onMounted } from 'vue';

const emit = defineEmits(['selectGame']);
const { t } = useI18n();

// Motion presets for animations
const titleMotion = {
  initial: { opacity: 0, y: -150, scale: 0.7, rotate: -5 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      duration: 1.2
    }
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 3,
      ease: 'easeInOut'
    }
  }
};

const headingMotion = {
  initial: { opacity: 0, y: -80, scale: 0.8, rotateX: 45 },
  enter: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 12,
      delay: 300,
      duration: 1
    }
  }
};

const buttonContainerMotion = {
  initial: { opacity: 0, scale: 0.95 },
  enter: { 
    opacity: 1,
    scale: 1,
    transition: { 
      delayChildren: 400,
      staggerChildren: 200,
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

const buttonMotion = {
  initial: { opacity: 0, x: -80, y: 20, scale: 0.9, rotateY: -30 },
  enter: { 
    opacity: 1, 
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 12,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.05,
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { type: 'spring', stiffness: 500, damping: 15 }
  }
};

const languageSwitcherMotion = {
  initial: { opacity: 0, scale: 0.5, rotate: -15 },
  enter: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: { 
      type: 'spring', 
      stiffness: 200, 
      damping: 15,
      delay: 1000,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: { type: 'spring', stiffness: 500, damping: 10 }
  }
};

const selectGame = (gameType) => {
  emit('selectGame', gameType);
};

onMounted(() => {
  if (window.tsParticles) {
    window.tsParticles.load('particles-js', {
      fpsLimit: 60,
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: ["#4285f4", "#34a853", "#fbbc05", "#ea4335", "#8a2be2"]
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.5,
            sync: false
          }
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          bubble: {
            distance: 150,
            size: 6,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-background-soft)] p-2 sm:p-4 relative">
    <div id="particles-js" class="absolute inset-0 z-0"></div>

    <!-- Animated title with glow effect -->
    <h1 
      v-motion
      :initial="titleMotion.initial"
      :enter="titleMotion.enter"
      :visible="titleMotion.visible"
      class="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-10 text-center text-[var(--color-heading)] relative z-10"
    >
      <span class="drop-shadow-[0_0_8px_var(--color-heading)] inline-block">{{ t('mainMenuTitle') }}</span>
    </h1>

    <div class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm p-5 sm:p-7 rounded-xl shadow-xl w-full max-w-[95%] sm:max-w-md border border-[var(--color-border)] relative z-10">
      <h2 
        v-motion
        :initial="headingMotion.initial"
        :enter="headingMotion.enter"
        class="text-2xl font-semibold mb-8 text-center text-[var(--color-heading)]"
      >
        {{ t('selectGame') }}
      </h2>

      <div 
        v-motion
        :initial="buttonContainerMotion.initial"
        :enter="buttonContainerMotion.enter"
        class="mb-6 space-y-5"
      >
        <!-- Spy Game Button -->
        <button
          v-motion
          :initial="buttonMotion.initial"
          :enter="buttonMotion.enter"
          :hovered="buttonMotion.hover"
          @click="selectGame('spy')"
          class="game-button group w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-between"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="game-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {{ t('spyGame') }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Word Guessing Game Button -->
        <button
          v-motion
          :initial="buttonMotion.initial"
          :enter="buttonMotion.enter"
          :hovered="buttonMotion.hover"
          @click="selectGame('wordGuessing')"
          class="game-button group w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-between"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="game-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {{ t('wordGuessingGame') }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Town Game Button -->
        <button
          v-motion
          :initial="buttonMotion.initial"
          :enter="buttonMotion.enter"
          :hovered="buttonMotion.hover"
          @click="selectGame('townGame')"
          class="game-button group w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-between"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="game-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {{ t('townGame') }}
            <span class="ml-2 text-xs bg-[var(--color-button-text)]/20 px-2 py-0.5 rounded-full text-[var(--color-button-text)]">BETA</span>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Language Switcher (mobile only) -->
      <div
        class="sm:hidden mt-4 flex justify-center language-switcher-wrapper"
      >
        <LanguageSwitcher />
      </div>
    </div>

    <!-- Language Switcher (desktop) -->
    <div
      class="hidden sm:block absolute top-4 left-4 z-50 language-switcher-wrapper"
    >
      <LanguageSwitcher />
    </div>
  </div>
</template>

<style>
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

/* Enhanced arrow icon animation */
.arrow-icon {
  @apply h-5 w-5 transform transition-all duration-300;
}

.group:hover .arrow-icon {
  @apply translate-x-2 scale-125 text-yellow rotate-0;
}

/* Game icon animations */
.game-icon {
  @apply h-6 w-6 mr-3 transition-all duration-300;
}

.group:hover .game-icon {
  @apply scale-125 text-yellow rotate-6;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
}

/* Button background animation */
.game-button {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.game-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
  z-index: -1;
}

.game-button:hover::before {
  left: 100%;
}

/* Language switcher animations */
.language-switcher-wrapper {
  @apply transition-all duration-300 cursor-pointer;
  filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
}

.language-switcher-wrapper:hover {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  animation: pulse-glow 1.5s infinite alternate;
}

@keyframes pulse-glow {
  0% {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.7));
  }
}
</style>
