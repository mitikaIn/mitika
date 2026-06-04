<template>
  <li class="list-row items-center">
    <PhMusicNotes
      v-if="item.type == ItemType.Audio"
      class="size-6"
    />
    <PhFileText
      v-else-if="item.type == ItemType.Pdf"
      class="size-6"
    />
    <AssertNotReached
      v-else
      :message="`Unknown item: ${item}`"
    />
    <p class="list-col-grow font-semibold">
      {{ item.name }}
    </p>
    <p class="list-col-wrap col-start-1 col-end-4 italic">
      {{ item.file.name }}
    </p>
    <button
      v-if="open"
      class="btn btn-ghost"
      @click="$emit('close')"
    >
      <PhX class="size-6" />
    </button>
    <button
      v-else
      class="btn btn-ghost"
      @click="$emit('open')"
    >
      <PhPlay
        v-if="item.type == ItemType.Audio"
        class="size-6"
      />
      <PhBookOpen
        v-else-if="item.type == ItemType.Pdf"
        class="size-6"
      />
      <AssertNotReached
        v-else
        :message="`Unknown item: ${item}`"
      />
    </button>
  </li>
</template>
<script setup lang="ts">
import { PhX, PhFileText, PhMusicNotes, PhPlay, PhBookOpen } from "@phosphor-icons/vue";
import { type Item, ItemType } from "@/models";

defineEmits<{ open: []; close: [] }>();

defineProps<{ item: Item; open: boolean }>();
</script>
