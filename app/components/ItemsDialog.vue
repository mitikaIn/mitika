<template>
  <Dialog
    className="w-[90vw] max-w-2xl"
    ref="dialog"
  >
    <div class="flex h-[75vh] flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Items')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <ol class="list h-0 grow overflow-scroll">
        <ItemsDialogRow
          v-for="item in items"
          :item="item"
          @click="onClick(item)"
        />
      </ol>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { type Item, ItemType } from "@/models";

const emit = defineEmits<{ open: [item: Item] }>();

defineProps<{ items: Item[] }>();

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

function onClick(item: Item) {
  dialog.value!.hide();
  emit("open", item);
}

defineExpose({ toggle });
</script>
