<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Rate')"
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
              v-model="rate"
              class="radio"
              type="radio"
              :value="0.25"
            />
            {{ $t("0.25x") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="rate"
              class="radio"
              type="radio"
              :value="0.5"
            />
            {{ $t("0.5x") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="rate"
              class="radio"
              type="radio"
              :value="1"
            />
            {{ $t("Original") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="rate"
              class="radio"
              type="radio"
              :value="1.5"
            />
            {{ $t("1.5x") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="rate"
              class="radio"
              type="radio"
              :value="2"
            />
            {{ $t("2x") }}
          </label>
        </li>
      </ol>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
const rate = defineModel<number>();

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
