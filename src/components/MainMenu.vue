<script setup>
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';
import { onMounted } from 'vue';

const emit = defineEmits(['selectGame']);
const { t } = useI18n();

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
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-[var(--color-heading)] relative z-10">{{ t('mainMenuTitle') }}</h1>

    <div class="bg-[var(--color-background-soft)]/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-[var(--color-border)] relative z-10">
      <transition name="fade-down" appear>
        <h2 class="text-2xl font-semibold mb-6 text-center text-[var(--color-heading)]">{{ t('selectGame') }}</h2>
      </transition>

      <transition name="fade-right" appear>
        <div class="mb-6 space-y-4">
          <button
            @click="selectGame('spy')"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <span>{{ t('spyGame') }}</span>
          </button>

          <button
            @click="selectGame('wordGuessing')"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <span>{{ t('wordGuessingGame') }}</span>
          </button>

          <button
            @click="selectGame('townGame')"
            class="w-full bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center mt-4"
          >
            <span>{{ t('townGame') }} (BETA)</span>
          </button>
        </div>
      </transition>

      <!-- Language Switcher (mobile only) -->
      <div class="sm:hidden mt-4 flex justify-center">
        <LanguageSwitcher />
      </div>
    </div>

    <!-- Language Switcher (desktop) -->
    <div class="hidden sm:block absolute top-4 left-4 z-50">
      <LanguageSwitcher />
    </div>
  </div>
</template>
