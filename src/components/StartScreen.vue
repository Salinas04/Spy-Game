<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import locationsData from '../i18n/locations.js';
import LanguageSwitcher from './LanguageSwitcher.vue';

const emit = defineEmits(['startGame']);
const { t, locale } = useI18n();

const playerCount = ref(3); // Default minimum player count
const minPlayers = 3;
const maxPlayers = 10;

// Multiple spies option
const multipleSpies = ref(false); // Default to single spy

// Category selection
const selectedCategories = ref(['all']); // Array of selected category ids
const categories = computed(() => [
  { id: 'all', name: t('allCategories') },
  ...locationsData[locale.value].categories
]);

// Handle category selection
const toggleCategory = (categoryId) => {
  // If 'all' is selected, deselect all other categories
  if (categoryId === 'all') {
    selectedCategories.value = selectedCategories.value.includes('all') ? [] : ['all'];
    return;
  }

  // If a specific category is selected, remove 'all' from selection
  if (selectedCategories.value.includes('all')) {
    selectedCategories.value = selectedCategories.value.filter(id => id !== 'all');
  }

  // Toggle the selected category
  if (selectedCategories.value.includes(categoryId)) {
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
  } else {
    selectedCategories.value.push(categoryId);
  }

  // If no categories are selected, select 'all'
  if (selectedCategories.value.length === 0) {
    selectedCategories.value = ['all'];
  }
};

const startGame = () => {
  emit('startGame', {
    playerCount: playerCount.value,
    categoryIds: selectedCategories.value,
    multipleSpies: multipleSpies.value
  });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-dark-gray text-white p-2 sm:p-4">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-yellow">{{ t('gameTitle') }}</h1>

    <div class="bg-dark-gray/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md border border-steel-gray">
      <transition name="fade-down" appear>
        <h2 class="text-2xl font-semibold mb-6 text-center text-mustard">{{ t('gameSetup') }}</h2>
      </transition>

      <transition name="fade-right" appear>
        <div class="mb-6">
          <label for="playerCount" class="block text-lg mb-2">{{ t('playerCount') }}</label>
          <div class="flex items-center">
            <button 
              @click="playerCount > minPlayers ? playerCount-- : null" 
              class="bg-yellow hover:bg-mustard text-black px-4 py-2 rounded-l-lg transition-all"
              :disabled="playerCount <= minPlayers"
            >
              -
            </button>
            <transition name="scale" mode="out-in">
              <span :key="playerCount" class="bg-black text-yellow px-6 py-2 text-xl font-bold">{{ playerCount }}</span>
            </transition>
            <button 
              @click="playerCount < maxPlayers ? playerCount++ : null" 
              class="bg-yellow hover:bg-mustard text-black px-4 py-2 rounded-r-lg transition-all"
              :disabled="playerCount >= maxPlayers"
            >
              +
            </button>
          </div>
          <p class="text-sm mt-2 text-steel-gray">{{ t('minMax', { min: minPlayers, max: maxPlayers }) }}</p>
        </div>
      </transition>

      <transition name="fade-right" appear>
        <div class="mb-6">
          <label class="block text-lg mb-2">{{ t('multipleSpies') }}</label>
          <div class="flex items-center">
            <input 
              type="checkbox"
              id="multipleSpies"
              v-model="multipleSpies"
              class="mr-2 h-5 w-5 accent-yellow"
            />
            <label for="multipleSpies" class="cursor-pointer hover:text-yellow transition-colors">
              {{ multipleSpies ? t('yes') : t('no') }}
            </label>
          </div>
          <p class="text-sm mt-2 text-steel-gray">{{ t('multipleSpiesHelp') }}</p>
        </div>
      </transition>

      <transition name="fade-left" appear>
        <div class="mb-6">
          <label class="block text-lg mb-2">{{ t('categories') }}</label>
          <div class="bg-black/70 rounded-lg p-4 border border-steel-gray max-h-60 overflow-y-auto">
            <transition-group name="list" tag="div">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="flex items-center mb-2 last:mb-0 transition-all duration-300"
              >
                <input 
                  type="checkbox"
                  :id="'category-' + category.id"
                  :checked="selectedCategories.includes(category.id)"
                  @change="toggleCategory(category.id)"
                  class="mr-2 h-5 w-5 accent-yellow"
                />
                <label :for="'category-' + category.id" class="cursor-pointer hover:text-yellow transition-colors">
                  {{ category.name }}
                </label>
              </div>
            </transition-group>
          </div>
          <p class="text-sm mt-2 text-steel-gray">{{ t('categoryHelp') }}</p>
        </div>
      </transition>

      <transition name="fade-up" appear>
        <div>
          <button
            @click="startGame"
            class="w-full bg-yellow hover:bg-mustard text-black py-3 px-6 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {{ t('startGame') }}
          </button>

          <!-- Language Switcher (mobile only) -->
          <div class="sm:hidden mt-4 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </transition>
    </div>

    <transition name="fade" appear>
      <div class="mt-8 text-center text-steel-gray max-w-md">
        <h3 class="text-xl font-semibold mb-2 text-mustard">{{ t('howToPlay') }}</h3>
        <transition-group name="list" tag="div" class="transition-all duration-300">
          <p class="mb-2" key="1">{{ t('howToPlaySteps.1') }}</p>
          <p class="mb-2" key="2">{{ t('howToPlaySteps.2') }}</p>
          <p class="mb-2" key="3">{{ t('howToPlaySteps.3') }}</p>
          <p class="mb-2" key="4">{{ t('howToPlaySteps.4') }}</p>
        </transition-group>
      </div>
    </transition>
  </div>
</template>
