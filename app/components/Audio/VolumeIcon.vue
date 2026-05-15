<template>
  <PhSpeakerX
    v-if="volume == 0"
    class="size-6"
  />
  <PhSpeakerNone
    v-else-if="volume <= 0.25"
    class="size-6"
  />
  <PhSpeakerLow
    v-else-if="volume <= 0.5"
    class="size-6"
  />
  <PhSpeakerHigh
    v-else
    class="size-6"
  />
</template>
<script setup lang="ts">
import { PhSpeakerHigh, PhSpeakerLow, PhSpeakerNone, PhSpeakerX } from "@phosphor-icons/vue";

defineProps<{ volume: number }>();
</script>
