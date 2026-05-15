<template>
  <div
    class="pointer-events-none fixed inset-0 z-50 flex h-full w-full items-end justify-center pb-12"
  >
    <!-- The Button (Always positioned, but visibility controlled by Vue state) -->
    <button
      :class="{
        'visible translate-y-0 opacity-100': isActive,
        'invisible translate-y-10 opacity-0': !isActive,
      }"
      class="btn btn-lg btn-accent /* Transition for smooth entry/exit */ /* Ensure the button itself is clickable */ pointer-events-auto shadow-2xl transition-all duration-500 ease-out"
      @click="handleClick"
    >
      Active Button
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

// State to control button visibility
const isActive = ref(false);

// Timer ID for the fade-out delay
let activityTimeout = null;

const INACTIVITY_DELAY_MS = 2000; // 2 seconds of inactivity before fade-out

/**
 * Shows the button and resets the fade-out timer.
 */
const showAndResetTimer = () => {
  if (activityTimeout) {
    clearTimeout(activityTimeout);
  }

  // 1. Show the button
  isActive.value = true;

  // 2. Set a new timer to hide the button after the delay
  activityTimeout = setTimeout(() => {
    isActive.value = false;
  }, INACTIVITY_DELAY_MS);
};

// --- Event Handlers ---

/**
 * Global Mouse Move Handler
 */
const handleMouseMove = () => {
  showAndResetTimer();
};

/**
 * Global Touch Start/Move Handler
 */
const handleTouchActivity = () => {
  showAndResetTimer();
};

// --- Lifecycle Hooks ---

onMounted(() => {
  // Attach listeners to the entire document body
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("touchstart", handleTouchActivity);
  document.addEventListener("touchmove", handleTouchActivity);

  // Optional: Initial run to show the button briefly when the page loads
  showAndResetTimer();
});

onUnmounted(() => {
  // Clean up listeners when the component is destroyed
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("touchstart", handleTouchActivity);
  document.removeEventListener("touchmove", handleTouchActivity);

  // Clear any pending timeout
  if (activityTimeout) {
    clearTimeout(activityTimeout);
  }
});

// --- Button Action ---
const handleClick = () => {
  alert("Button Clicked!");
  // Keep the button visible after interaction for a moment
  showAndResetTimer();
};
</script>
