<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top', // top, right, bottom, left
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  delay: {
    type: Number,
    default: 0 // Delay in ms before showing the tooltip
  }
});

const isVisible = ref(false);
const tooltipRef = ref(null);
const showTimeout = ref(null);

const showTooltip = () => {
  if (props.delay > 0) {
    showTimeout.value = setTimeout(() => {
      isVisible.value = true;
    }, props.delay);
  } else {
    isVisible.value = true;
  }
};

const hideTooltip = () => {
  if (showTimeout.value) {
    clearTimeout(showTimeout.value);
  }
  isVisible.value = false;
};

// Position classes based on the position prop
const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1',
  right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-1',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1',
  left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-1'
};

// Arrow classes based on the position prop
const arrowClasses = {
  top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-[var(--color-background-soft)] border-r-transparent border-b-transparent border-l-transparent',
  right: 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-t-transparent border-r-[var(--color-background-soft)] border-b-transparent border-l-transparent',
  bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-t-transparent border-r-transparent border-b-[var(--color-background-soft)] border-l-transparent',
  left: 'right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-t-transparent border-r-transparent border-b-transparent border-l-[var(--color-background-soft)]'
};

// Clean up any timeouts when component is unmounted
onBeforeUnmount(() => {
  if (showTimeout.value) {
    clearTimeout(showTimeout.value);
  }
});
</script>

<template>
  <div class="tooltip-container relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip" @focusin="showTooltip" @focusout="hideTooltip">
    <slot></slot>
    <transition name="tooltip-fade">
      <div 
        v-if="isVisible" 
        ref="tooltipRef"
        class="tooltip absolute z-50 px-3 py-2 text-sm font-medium text-white bg-[var(--color-background-soft)]/90 backdrop-blur-sm rounded shadow-lg whitespace-nowrap pointer-events-none"
        :class="positionClasses[position]"
      >
        {{ text }}
        <div class="tooltip-arrow absolute w-0 h-0 border-4" :class="arrowClasses[position]"></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>