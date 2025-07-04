<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted } from 'vue';

const { locale } = useI18n();
const isOpen = ref(false);

const setLanguage = (lang) => {
  locale.value = lang;
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (!event.target.closest('.language-dropdown')) {
    isOpen.value = false;
  }
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="relative language-dropdown">
    <button 
      @click="toggleDropdown" 
      class="bg-dark-gray hover:bg-steel-gray text-white py-2 sm:py-1 px-4 sm:px-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg border border-steel-gray flex items-center overflow-hidden"
    >
      <transition 
        name="fade" 
        mode="out-in"
        enter-active-class="transition ease-out duration-300"
        leave-active-class="transition ease-in duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <span :key="locale">{{ locale === 'es' ? 'Español' : 'English' }}</span>
      </transition>
      <svg 
        class="w-4 h-4 ml-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <transition 
      name="dropdown"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="absolute mt-1 w-full sm:w-auto bg-dark-gray border border-steel-gray rounded-lg shadow-lg z-10"
      >
        <button 
          @click="setLanguage('en')" 
          class="block w-full text-left px-4 py-2 text-white hover:bg-steel-gray rounded-t-lg transition-colors duration-200"
          :class="{ 'bg-steel-gray': locale === 'en' }"
        >
          English
        </button>
        <button 
          @click="setLanguage('es')" 
          class="block w-full text-left px-4 py-2 text-white hover:bg-steel-gray rounded-b-lg transition-colors duration-200"
          :class="{ 'bg-steel-gray': locale === 'es' }"
        >
          Español
        </button>
      </div>
    </transition>
  </div>
</template>
