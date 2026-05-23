<template>
  <template v-if="search.length == 0">
    <li v-auto-animate>
      <button
        v-if="outline.children.length == 0"
        class="flex flex-row flex-wrap gap-2"
        @click="$emit('open', outline)"
      >
        <span>
          {{ outline.name }}
        </span>
        <span class="italic">
          {{ formatPosition!(outline.position) }}
        </span>
      </button>
      <details v-else>
        <summary>
          {{ outline.name }}
        </summary>
        <ul>
          <OutlinesDialogRow
            v-for="childOutline of outline.children"
            :outline="childOutline"
            :search="search"
            @open="(outline) => $emit('open', outline)"
          />
        </ul>
      </details>
    </li>
  </template>
  <template v-else>
    <li
      v-if="matches"
      v-auto-animate
    >
      <button
        class="flex flex-row flex-wrap gap-2"
        @click="$emit('open', outline)"
      >
        <span>
          {{ outline.name }}
        </span>
        <span class="italic">
          {{ formatPosition!(outline.position) }}
        </span>
      </button>
    </li>
    <OutlinesDialogRow
      v-for="childOutline of outline.children"
      :outline="childOutline"
      :search="search"
      @open="(outline) => $emit('open', outline)"
    />
  </template>
</template>
<script lang="ts">
import { type Position } from "@/models";

export interface Outline {
  name: string;
  position: Position;
  children: Outline[];
}
</script>
<script setup lang="ts">
import { FORMAT_POSITION } from "@/keys";

defineEmits<{ open: [outline: Outline] }>();

const { outline, search } = defineProps<{ outline: Outline; search: string }>();

const formatPosition = inject(FORMAT_POSITION);

const matches = computed(() => {
  return outline.name.toLowerCase().includes(search.toLowerCase());
});
</script>
