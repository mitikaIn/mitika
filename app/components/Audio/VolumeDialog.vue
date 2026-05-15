<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Volume')"
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
              v-model="volume"
              class="radio"
              type="radio"
              :value="0"
            />
            {{ $t("Mute") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="volume"
              class="radio"
              type="radio"
              :value="0.25"
            />
            {{ $t("25%") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="volume"
              class="radio"
              type="radio"
              :value="0.5"
            />
            {{ $t("50%") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="volume"
              class="radio"
              type="radio"
              :value="0.75"
            />
            {{ $t("75%") }}
          </label>
        </li>
        <li>
          <label class="label">
            <input
              v-model="volume"
              class="radio"
              type="radio"
              :value="1"
            />
            {{ $t("100%") }}
          </label>
        </li>
      </ol>
      <div class="join w-full">
        <button
          class="join-item btn"
          :disabled="volume < STEP"
          @click="volume -= STEP"
        >
          <PhMinus class="size-6" />
        </button>
        <input
          class="join-item input w-[4rem] grow"
          :max="100"
          :min="0"
          :step="STEP * 100"
          :value="Math.floor(volume * 100)"
          @change="onChange"
        />
        <button
          class="join-item btn"
          :disabled="volume > 1 - STEP"
          @click="volume += STEP"
        >
          <PhPlus class="size-6" />
        </button>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX, PhMinus, PhPlus } from "@phosphor-icons/vue";

const volume = defineModel<number>({ default: 0 });

const STEP = 0.1;

const dialog = useTemplateRef("dialog");

function toggle() {
  dialog.value!.toggle();
}

function onChange(event: Event) {
  let newVolume = Number((event.target as HTMLInputElement).value) / 100;
  if (isNaN(newVolume)) {
    (event.target as HTMLInputElement).value = Math.floor(volume.value * 100).toString();
    return;
  }
  newVolume = Math.min(Math.max(newVolume, 0), 1);
  volume.value = newVolume;
  (event.target as HTMLInputElement).value = Math.floor(volume.value * 100).toString();
}

defineExpose({ toggle });
</script>
