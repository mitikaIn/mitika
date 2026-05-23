<template>
  <li
    class="bg-base-200 rounded-field flex h-full w-full flex-row items-center gap-2 p-2 shadow-md"
  >
    <Cover
      :book="book"
      class="rounded-field h-16 w-16"
    />
    <button
      class="btn btn-ghost flex h-full w-0 grow flex-col items-start gap-2 text-start"
      @click="$emit('open')"
    >
      <span class="line-clamp-2 w-full font-bold break-words">
        {{ book.name }}
      </span>
      <span class="line-clamp-2 w-full break-words italic">
        {{ book.authors.length == 0 ? "Unknown" : book.authors.join(", ") }}
      </span>
    </button>
    <Dropdown
      buttonClasses="btn-ghost"
      dropdownClasses="dropdown-end"
    >
      <template #button>
        <PhDotsThreeVertical class="size-6" />
      </template>
      <template #content>
        <ul class="menu bg-base-300 rounded-field w-64 shadow-md">
          <li>
            <NuxtLink @click="$emit('open')">
              {{ $t("Open") }}
            </NuxtLink>
          </li>
          <li>
            <button @click="$emit('edit')">
              {{ $t("Edit") }}
            </button>
          </li>
          <li>
            <button @click="$emit('remove')">
              {{ $t("Remove") }}
            </button>
          </li>
        </ul>
      </template>
    </Dropdown>
  </li>
</template>
<script setup lang="ts">
import { PhDotsThreeVertical } from "@phosphor-icons/vue";
import { type Book } from "@/models";

defineEmits<{ open: []; edit: []; remove: [] }>();

defineProps<{ book: Book }>();
</script>
