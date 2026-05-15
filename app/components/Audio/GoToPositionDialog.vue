<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Jump to position')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <div class="flex flex-row gap-2">
        <input
          v-model="hours"
          class="input basis-2/4"
          :max="maxHours"
          min="0"
          :placeholder="$t('HH')"
          type="number"
        />
        <input
          v-model="minutes"
          class="input basis-1/4"
          max="60"
          min="0"
          :placeholder="$t('MM')"
          type="number"
        />
        <input
          v-model="seconds"
          class="input basis-1/4"
          max="60"
          min="0"
          :placeholder="$t('SS')"
          type="number"
        />
      </div>
      <label class="label">
        <input
          v-model="pause"
          class="checkbox"
          type="checkbox"
        />
        {{ $t("Pause on jumping") }}
      </label>
      <button
        class="btn btn-primary"
        @click="onClick"
      >
        {{ $t("Go to") }}
      </button>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { type AudioPosition } from "@/models/audio";

const emit = defineEmits<{ change: [position: AudioPosition, play: boolean] }>();

const { position, duration } = defineProps<{
  position: AudioPosition;
  duration: number;
}>();

const hours = ref(0);
const minutes = ref(0);
const pause = ref(false);
const seconds = ref(0);

const dialog = useTemplateRef("dialog");

const maxHours = computed(() => Math.floor(duration / 3600));

function toggle() {
  let [delta] = position;
  hours.value = Math.floor(delta / 3600);
  delta = delta % 3600;
  minutes.value = Math.floor(delta / 60);
  delta = delta % 60;
  seconds.value = Math.floor(delta);
  dialog.value!.toggle();
}

function onClick() {
  dialog.value!.hide();
  const value = Math.max(
    Math.min(hours.value * 3600 + minutes.value * 60 + seconds.value, duration),
    0,
  );
  emit("change", [value], !pause.value);
}

defineExpose({ toggle });
</script>
