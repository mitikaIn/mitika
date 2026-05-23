<template>
  <Dialog
    ref="dialog"
    classes="w-[90vw] max-w-2xl"
  >
    <div class="flex h-[75vh] flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :subtitle="$t(`Choose a theme for ${mode} mode`)"
          :title="$t(mode == 'dark' ? `Dark mode theme` : 'Light mode theme')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <div
        class="grid h-0 grow grid-cols-[repeat(auto-fill,minmax(160px,1fr))] place-items-center gap-4 overflow-scroll"
      >
        <label
          v-for="entry in Object.entries(Theme)"
          class="flex flex-col gap-2"
        >
          <span
            class="bg-base-200 rounded-field flex flex-row gap-2 p-2"
            :data-theme="entry[1]"
          >
            <span class="btn btn-primary">A</span>
            <span class="btn btn-secondary">B</span>
            <span class="btn">C</span>
          </span>
          <span class="flex flex-row gap-2">
            <input
              v-model="theme"
              class="radio"
              type="radio"
              :value="entry[1]"
            />
            {{ entry[0] }}
          </span>
        </label>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { Theme } from "@/models/settings";

const theme = defineModel<Theme>();

defineProps<{ mode: "dark" | "light" }>();

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
