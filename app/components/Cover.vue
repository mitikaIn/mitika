<template>
  <div class="relative flex items-center justify-center overflow-hidden">
    <template v-if="coverUrl">
      <img
        alt=""
        class="rounded-field absolute z-0 h-full w-full blur"
        :src="coverUrl"
      />
      <img
        alt=""
        class="z-10 h-full w-full object-scale-down"
        :src="coverUrl"
      />
    </template>
    <Gradient
      v-else
      class="h-full w-full"
      :text="book.name"
    />
  </div>
</template>
<script setup lang="ts">
import { type Book } from "@/models";
import { useStorage } from "@/storages";

const storage = await useStorage();

const { book } = defineProps<{ book: Book }>();

const coverUrl = ref<string | null>();

onMounted(async () => {
  const cover = await storage.read(`/books/${book.id}/cover.png`);
  if (cover) coverUrl.value = URL.createObjectURL(cover);
});

onUnmounted(() => {
  if (coverUrl.value) URL.revokeObjectURL(coverUrl.value);
});
</script>
