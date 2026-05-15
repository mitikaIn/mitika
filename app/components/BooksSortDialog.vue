<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Sort')"
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
              v-model="sortType"
              class="radio"
              type="radio"
              :value="BooksSortType.Alphabetical"
            />
            {{ $t("A-Z") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="sortType"
              class="radio"
              type="radio"
              :value="BooksSortType.ReverseAlphabetical"
            />
            {{ $t("Z-A") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="sortType"
              class="radio"
              type="radio"
              :value="BooksSortType.RecentFirst"
            />
            {{ $t("Recent first") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="sortType"
              class="radio"
              type="radio"
              :value="BooksSortType.RecentLast"
            />
            {{ $t("Recent last") }}
          </label>
        </li>
      </ol>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { BooksSortType } from "@/models/settings";

const sortType = defineModel<BooksSortType>();

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
