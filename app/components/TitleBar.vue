<template>
  <div class="flex flex-col justify-center text-center">
    <div
      v-if="title"
      class="flex flex-row"
    >
      <h1 class="w-0 grow truncate font-bold">
        {{ title }}
      </h1>
    </div>
    <div
      v-if="subtitle"
      class="flex flex-row"
    >
      <span class="w-0 grow truncate italic">
        {{ subtitle }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>
