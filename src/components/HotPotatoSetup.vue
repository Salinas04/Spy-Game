<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['startGame', 'returnToMainMenu']);
const { t } = useI18n();

const difficulty = ref('medium');
const selectedCategories = ref(['all']);

const allCategories = [
  'hp_everyday', 'hp_dark', 'hp_adult', 'hp_work', 'hp_absurd', 'hp_party', 'hp_popculture'
];

const difficulties = [
  { key: 'easy',   labelKey: 'hotPotatoDifficultyEasy',   descKey: 'hotPotatoDifficultyEasyDesc' },
  { key: 'medium', labelKey: 'hotPotatoDifficultyMedium', descKey: 'hotPotatoDifficultyMediumDesc' },
  { key: 'hard',   labelKey: 'hotPotatoDifficultyHard',   descKey: 'hotPotatoDifficultyHardDesc' },
];

const toggleCategory = (cat) => {
  if (cat === 'all') {
    selectedCategories.value = ['all'];
    return;
  }
  const withoutAll = selectedCategories.value.filter(c => c !== 'all');
  if (withoutAll.includes(cat)) {
    const next = withoutAll.filter(c => c !== cat);
    selectedCategories.value = next.length ? next : ['all'];
  } else {
    selectedCategories.value = [...withoutAll, cat];
  }
};

const isCatSelected = (cat) => selectedCategories.value.includes(cat);

const startGame = () => {
  emit('startGame', {
    difficulty: difficulty.value,
    categories: selectedCategories.value,
  });
};

const howToPlaySteps = [
  'hotPotatoHowToPlay1', 'hotPotatoHowToPlay2', 'hotPotatoHowToPlay3',
  'hotPotatoHowToPlay4', 'hotPotatoHowToPlay5'
];
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start px-4 py-6 pb-16">

    <!-- Header -->
    <div class="text-center mb-6">
      <div class="text-6xl mb-2">🥔</div>
      <h1 class="text-3xl font-bold text-[var(--color-heading)] drop-shadow-[0_0_10px_var(--color-heading)]">
        {{ t('hotPotatoSetupTitle') }}
      </h1>
      <p class="text-[var(--color-text-secondary)] mt-1 text-sm">{{ t('hotPotatoSetupSubtitle') }}</p>
    </div>

    <div class="w-full max-w-md space-y-5">

      <!-- Difficulty -->
      <section class="bg-[var(--color-background-soft)] rounded-xl p-4 border border-[var(--color-border)]">
        <h2 class="text-[var(--color-heading)] font-semibold mb-3">{{ t('hotPotatoDifficulty') }}</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="d in difficulties"
            :key="d.key"
            @click="difficulty = d.key"
            :class="[
              'flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all text-center',
              difficulty === d.key
                ? 'border-[var(--color-button-primary)] bg-[var(--color-button-primary)]/20 text-[var(--color-heading)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-button-primary)]/50'
            ]"
          >
            <span class="font-bold text-sm">{{ t(d.labelKey) }}</span>
            <span class="text-xs mt-0.5 opacity-70">{{ t(d.descKey) }}</span>
          </button>
        </div>
      </section>

      <!-- Categories -->
      <section class="bg-[var(--color-background-soft)] rounded-xl p-4 border border-[var(--color-border)]">
        <h2 class="text-[var(--color-heading)] font-semibold mb-3">{{ t('hotPotatoCategories') }}</h2>

        <!-- All button -->
        <button
          @click="toggleCategory('all')"
          :class="[
            'mb-3 w-full py-2 rounded-lg border-2 text-sm font-semibold transition-all',
            isCatSelected('all')
              ? 'border-[var(--color-button-primary)] bg-[var(--color-button-primary)]/20 text-[var(--color-heading)]'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-button-primary)]/50'
          ]"
        >
          🎲 {{ t('hotPotatoCategoriesRandom') }}
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="cat in allCategories"
            :key="cat"
            @click="toggleCategory(cat)"
            :class="[
              'py-2 px-3 rounded-lg border-2 text-sm transition-all text-left',
              isCatSelected(cat) && !isCatSelected('all')
                ? 'border-[var(--color-button-primary)] bg-[var(--color-button-primary)]/20 text-[var(--color-heading)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-button-primary)]/50'
            ]"
          >
            {{ t(cat) }}
          </button>
        </div>
      </section>

      <!-- How to play -->
      <section class="bg-[var(--color-background-soft)] rounded-xl p-4 border border-[var(--color-border)]">
        <h2 class="text-[var(--color-heading)] font-semibold mb-3">{{ t('hotPotatoHowToPlay') }}</h2>
        <ul class="space-y-2">
          <li
            v-for="step in howToPlaySteps"
            :key="step"
            class="text-sm text-[var(--color-text-secondary)] leading-relaxed"
          >
            {{ t(step) }}
          </li>
        </ul>
      </section>

      <!-- Start button -->
      <button
        @click="startGame"
        class="w-full py-4 rounded-xl text-xl font-bold bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-text)] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        🥔 {{ t('hotPotatoStartGame') }}
      </button>
    </div>
  </div>
</template>
