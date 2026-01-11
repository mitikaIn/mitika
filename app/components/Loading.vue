<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-4">
    <span class="loading loading-spinner loading-lg"></span>
    <p v-if="text" class="text-sm text-base-content/70">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
}

defineProps<Props>();
</script>
