<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Tags')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <ol class="peer flex flex-row flex-wrap gap-2 empty:hidden">
        <li v-for="tag of tags">
          <input
            v-model="selectedTags"
            :aria-label="tag"
            class="btn"
            type="checkbox"
            :value="tag"
          />
        </li>
      </ol>
      <button
        class="btn btn-secondary flex w-min peer-empty:hidden"
        @click="selectedTags.clear()"
      >
        {{ $t("Clear") }}
      </button>
      <Placeholder
        class="hidden peer-empty:flex"
        :description="$t('No tags found in any books.')"
        :title="$t('No tags found')"
        :type="PlaceholderType.Info"
      />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { PlaceholderType } from "@/components/Placeholder.vue";
import { type Book } from "@/models";

const selectedTags = defineModel<Set<string>>({ default: new Set() });

const { books } = defineProps<{
  books: Book[];
}>();

const dialog = useTemplateRef("dialog");

const tags = computed(() => {
  const tags = new Set<string>();
  for (const book of books) for (const tag of book.tags) tags.add(tag);
  return tags;
});

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
