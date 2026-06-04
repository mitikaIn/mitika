<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <PhXCircle
      v-if="type == PlaceholderType.Error"
      class="size-24"
    />
    <PhInfo
      v-else-if="type == PlaceholderType.Info"
      class="size-24"
    />
    <AssertNotReached
      v-else
      :message="`Unknown statusType: ${type}`"
    />
    <h1 class="text-center font-bold">
      {{ title }}
    </h1>
    <p class="text-center">
      {{ description }}
    </p>
    <button
      v-if="label"
      class="btn btn-primary"
      @click="$emit('click')"
    >
      {{ label }}
    </button>
  </div>
</template>
<script lang="ts">
export enum PlaceholderType {
  Error,
  Info,
}
</script>
<script setup lang="ts">
import { PhInfo, PhXCircle } from "@phosphor-icons/vue";

defineEmits<{
  click: [];
}>();

defineProps<{
  type: PlaceholderType;
  title: string;
  description: string;
  label?: string;
}>();
</script>
