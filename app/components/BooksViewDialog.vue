<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('View')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <ol class="menu w-full">
        <li>
          <label class="label">
            <input
              v-model="viewType"
              class="radio"
              type="radio"
              :value="BooksViewType.Card"
            />
            {{ $t("Card") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="viewType"
              class="radio"
              type="radio"
              :value="BooksViewType.Row"
            />
            {{ $t("Row") }}
          </label>
        </li>
      </ol>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { BooksViewType } from "@/models/settings";

const viewType = defineModel<BooksViewType>();

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
