<template>
  <div
    v-auto-animate
    class="flex flex-col gap-4"
  >
    <audio
      class="hidden"
      :playbackRate="audio.rate"
      ref="audioEl"
      :src="url"
      :volume="audio.volume"
      @durationchange="onDurationChange"
      @error="onError"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeUpdate"
    />
    <div class="flex flex-col gap-2">
      <div
        v-if="!focus"
        class="flex flex-row justify-between"
      >
        <span>{{ formatPosition(audio.position) }}</span>
        <span>{{ formatPosition([duration]) }}</span>
      </div>
      <div class="relative grow">
        <button
          v-for="mark in marks"
          class="btn btn-circle btn-xs btn-soft absolute z-[1] cursor-pointer"
          :style="`left: ${(mark.position[0]! * 100) / duration}%`"
          @click="onSeek(mark.position as AudioPosition)"
        >
          ●
        </button>
        <button
          v-for="note in notes"
          class="btn btn-circle btn-xs btn-soft absolute z-[1] cursor-pointer"
          :style="`left: ${(note.position[0]! * 100) / duration}%`"
          @click="onSeek(note.position as AudioPosition)"
        >
          ■
        </button>
        <input
          class="range range-xs w-full"
          :max="duration"
          min="0"
          type="range"
          :value="audio.position[0]"
          @change="onPositionChange"
        />
      </div>
    </div>
    <div class="join flex flex-row justify-center gap-2">
      <button
        class="join-item btn btn-ghost"
        :disabled="audio.position[0] < 10"
        @click="onSeek([audio.position[0] - 10])"
      >
        {{ $t("-10s") }}
      </button>
      <button
        class="join-item btn btn-ghost"
        @click="onSkip(false)"
      >
        <PhSkipBack class="size-6 rtl:hidden" />
        <PhSkipForward class="size-6 ltr:hidden" />
      </button>
      <label class="join-item swap swap-rotate btn btn-ghost">
        <input
          v-model="playing"
          type="checkbox"
          @change="onPlayingChange"
        />
        <PhPause class="swap-on size-6" />
        <PhPlay class="swap-off size-6" />
      </label>
      <button
        class="join-item btn btn-ghost"
        @click="onSkip(true)"
      >
        <PhSkipForward class="size-6 rtl:hidden" />
        <PhSkipBack class="size-6 ltr:hidden" />
      </button>
      <button
        class="join-item btn btn-ghost"
        :disabled="duration - audio.position[0] < 10"
        @click="onSeek([audio.position[0] + 10])"
      >
        {{ $t("+10s") }}
      </button>
    </div>
    <Menu
      v-if="!focus"
      :btnSize="4"
      class="grow justify-center gap-2"
      dropdownClasses="dropdown-top"
      :gap="2"
    >
      <MenuItem
        :label="$t('Go to')"
        @click="goToDialog!.toggle()"
      >
        <PhTarget class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Outlines')"
        @click="outlinesDialog!.toggle()"
      >
        <PhListNumbers class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Rate')"
        @click="rateDialog!.toggle()"
      >
        <PhWatch class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Volume')"
        @click="volumeDialog!.toggle()"
      >
        <AudioVolumeIcon :volume="audio.volume" />
      </MenuItem>
      <MarkButton
        :item="audio"
        :marks="marks"
        @refresh="onRefreshMarks"
      />
      <MenuItem
        :label="$t('Add note')"
        @click="noteDialog!.toggle()"
      >
        <PhNote class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Marks')"
        @click="marksDialog!.toggle()"
      >
        <PhBookmarks class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Notes')"
        @click="notesDialog!.toggle()"
      >
        <PhNotepad class="size-6" />
      </MenuItem>
      <MenuItem
        :label="$t('Close')"
        @click="$emit('close')"
      >
        <PhX class="size-6" />
      </MenuItem>
    </Menu>
    <AudioRateDialog
      v-model="audio.rate"
      ref="rateDialog"
    />
    <AudioGoToPositionDialog
      :duration="duration"
      :position="[0]"
      :playing="playing"
      ref="goToDialog"
      @change="onSeek"
    />
    <AudioVolumeDialog
      v-model="audio.volume"
      ref="volumeDialog"
    />
    <MarksDialog
      :marks="marks"
      ref="marksDialog"
      @open="onOpen"
      @refresh="onRefreshMarks"
    />
    <NoteDialog
      :item="audio"
      ref="noteDialog"
      @refresh="onRefreshNotes"
    />
    <NotesDialog
      :notes="notes"
      ref="notesDialog"
      @open="onOpen"
      @refresh="onRefreshNotes"
    />
    <OutlinesDialog
      :outlines="outlines"
      ref="outlinesDialog"
      @open="onOpen"
    />
  </div>
</template>
<script setup lang="ts">
import {
  PhPlay,
  PhTarget,
  PhListNumbers,
  PhBookmarks,
  PhX,
  PhPause,
  PhSkipBack,
  PhWatch,
  PhNote,
  PhNotepad,
  PhSkipForward,
} from "@phosphor-icons/vue";
import { FORMAT_POSITION, SOURCES_DIALOG, type FormatPositionFn } from "@/keys";
import { useDatabase } from "@/database";
import { useLogging } from "@/logging";
import { type Audio, type AudioPosition } from "@/models/audio";
import { collatePosition } from "@/models/item";
import { type Mark, type Note, ObjectType } from "@/models/object";
import { getMetadata } from "@/components/Audio/parkhi";
import { type Outline } from "@/components/OutlinesDialogRow.vue";
import { toCover } from "@/utils";
import { useStorage, ResourceType } from "@/storages";

const emit = defineEmits<{
  close: [];
  metadata: [name: string | null, authors: string[], cover: Blob | null];
}>();

const { audio, focus } = defineProps<{ audio: Audio; focus: boolean }>();

const database = await useDatabase();
const { f, debug, error } = useLogging("audioPlayer");
const storage = await useStorage();

const PLACEHOLDER_AUDIO = "/placeholder.opus";
const SAVE_INTERVAL = 2000;

const duration = ref(1);
const marks = ref<Mark[]>([]);
const notes = ref<Note[]>([]);
const outlines = ref<Outline[]>([]);
const playing = ref(false);
const url = ref(PLACEHOLDER_AUDIO);

let saveIntervalId = 0;

const audioEl = useTemplateRef("audioEl");
const marksDialog = useTemplateRef("marksDialog");
const noteDialog = useTemplateRef("noteDialog");
const notesDialog = useTemplateRef("notesDialog");
const outlinesDialog = useTemplateRef("outlinesDialog");
const rateDialog = useTemplateRef("rateDialog");
const goToDialog = useTemplateRef("goToDialog");
const volumeDialog = useTemplateRef("volumeDialog");

const sourcesDialog = inject(SOURCES_DIALOG);

const hoursLength = computed(() => Math.floor(Math.log10(duration.value / 3600) + 1));

watch(
  () => audio,
  async (newAudio, oldAudio) => {
    if (oldAudio) await close(oldAudio);
    if (sourcesDialog.value) await open(newAudio);
  },
  { immediate: true },
);

function clearSaveInterval() {
  if (saveIntervalId != 0) {
    debug("clearing save timeout");
    clearInterval(saveIntervalId);
    saveIntervalId = 0;
  }
}

function onDurationChange() {
  debug(`found duration, restoring position`);
  duration.value = audioEl.value!.duration;
  audioEl.value!.currentTime = audio.position[0];
}

async function close(audio: Audio) {
  debug(f`closing audio ${audio}`);

  duration.value = 0;
  const oldUrl = url.value;
  url.value = PLACEHOLDER_AUDIO;
  URL.revokeObjectURL(oldUrl);

  clearSaveInterval();
}

async function open(audio: Audio) {
  debug(f`opening audio ${audio}`);

  const blob = await sourcesDialog.value!.readFile(audio.file);
  url.value = URL.createObjectURL(blob);

  if (audio.openingFirstTime) {
    debug(`obtaining metadata`);
    const metadata = await getMetadata(blob);

    if (audio.temporaryName) {
      if (metadata.name) {
        debug(`changing audio name to ${metadata.name}`);
        audio.name = metadata.name;
        audio.temporaryName = false;
      }
    }

    let cover = null;
    if (metadata.cover) {
      debug(`changing item cover`);
      cover = await toCover(metadata.cover);
      await storage.write({ parentId: audio.id, type: ResourceType.ItemCover }, cover);
    }

    audio.openingFirstTime = false;
    await database.putItem(toRaw(audio));

    const data = new Blob([JSON.stringify(metadata.outlines)]);
    await storage.write({ parentId: audio.id, type: ResourceType.ItemOutlines }, data);
    outlines.value = metadata.outlines;

    emit("metadata", metadata.name, metadata.authors, cover);
  } else {
    const data = await storage.read({ parentId: audio.id, type: ResourceType.ItemOutlines });
    outlines.value = JSON.parse(await data.text());
  }

  await onRefreshMarks();
  await onRefreshNotes();
}

function onError() {
  error(f`Failed to play audio: ${audioEl.value!.error}`);
}

async function onOpen(object: Mark | Note | Outline) {
  await onSeek(object.position as AudioPosition);
}

async function onSaveInterval() {
  await database.putItem(toRaw(audio));
}

function onPause() {
  playing.value = false;

  clearSaveInterval();
}

function onPlay() {
  playing.value = true;

  clearSaveInterval();
  saveIntervalId = setInterval(onSaveInterval, SAVE_INTERVAL);
}

function onPlayingChange() {
  if (playing.value) {
    audioEl.value!.play();
    clearSaveInterval();
    saveIntervalId = setTimeout(onSaveInterval, SAVE_INTERVAL);
  } else {
    audioEl.value!.pause();
    clearSaveInterval();
  }
}

async function onPositionChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  debug(`Changing to position: ${value}`);
  audioEl.value!.currentTime = value;
  await database.putItem(toRaw(audio));
}

function onTimeUpdate() {
  if (duration.value == 0) return;
  audio.position[0] = audioEl.value!.currentTime;
}

async function onRefreshMarks() {
  const unsorted = await database.getObjects<Mark>(audio.id, ObjectType.Mark);
  marks.value = unsorted.sort((a, b) => collatePosition(a.position, b.position));
}

async function onRefreshNotes() {
  const unsorted = await database.getObjects<Note>(audio.id, ObjectType.Note);
  notes.value = unsorted.sort((a, b) => collatePosition(a.position, b.position));
}

async function onSeek(position: AudioPosition, play: boolean | null = null) {
  debug(`Seeking to position ${position} with play ${play}`);
  const shouldPlay = play == null ? playing.value : play;
  audioEl.value!.pause();
  audioEl.value!.currentTime = position[0];
  audio.value!.position = position;
  if (shouldPlay) audioEl.value!.play();
  await database.putItem(toRaw(audio));
}

function onSkip(forward: boolean) {
  if (forward) {
    for (let i = 0; i < stops.value.length; i++) {
      const stop = stops.value[i]!;
      if (collatePosition(stop.position, audio.position) > 0) {
        onSeek(stop.position as AudioPosition);
        return;
      }
    }
  } else {
    for (let i = stops.value.length - 1; i > -1; i--) {
      const stop = stops.value[i]!;
      if (collatePosition(stop.position, audio.position) < 0) {
        onSeek(stop.position as AudioPosition);
        return;
      }
    }
  }
}

function formatPosition(position: AudioPosition): string {
  let [delta] = position;
  const hours = Math.floor(delta / 3600);
  delta = delta % 3600;
  const minutes = Math.floor(delta / 60);
  delta = delta % 60;
  const seconds = Math.floor(delta);

  const hoursStr = hours.toString().padStart(hoursLength.value, "0");
  const minsStr = minutes.toString().padStart(2, "0");
  const secsStr = seconds.toString().padStart(2, "0");

  return `${hoursStr}:${minsStr}:${secsStr}`;
}

onUnmounted(async () => {
  if (audio.value) await close(audio.value);
});

provide(FORMAT_POSITION, formatPosition as FormatPositionFn);
</script>
