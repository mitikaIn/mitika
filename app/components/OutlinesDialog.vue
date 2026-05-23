<template>
  <Dialog
    ref="dialog"
    classes="w-[90vw] max-w-2xl"
  >
    <div class="flex h-[75vh] flex-col gap-4">
      <div class="flex flex-row gap-4">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          subtitle=""
          :title="$t('Outlines')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <input
        v-model="search"
        class="input w-full"
        :placeholder="$t('Search outlines…')"
      />
      <ol
        v-auto-animate
        class="menu peer h-0 w-full grow flex-col flex-nowrap overflow-y-scroll"
      >
        <OutlinesDialogRow
          v-for="outline in outlines"
          :key="outline.id"
          :outline="outline"
          :search="search"
          @open="onOpen"
        />
      </ol>
      <Placeholder
        class="hidden h-full peer-empty:flex"
        :description="$t(search ? 'No matching outline exists.' : 'No outlines found.')"
        :title="$t('No outlines found')"
        :type="PlaceholderType.Info"
      />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { PlaceholderType } from "@/components/Placeholder.vue";
import { type Outline } from "@/components/OutlinesDialogRow.vue";

const emit = defineEmits<{ open: [outline: Outline] }>();

defineProps<{ outlines: Outline[] }>();

const search = ref("");

const dialog = useTemplateRef("dialog");

function onOpen(outline: Outline) {
  emit("open", outline);
  dialog.value!.hide();
}

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
