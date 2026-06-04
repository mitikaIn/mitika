<template>
  <Dialog
    classes="w-[90vw] max-w-2xl"
    ref="dialog"
  >
    <div class="flex h-[75vh] flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Notes')"
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
        :placeholder="$t('Search notes…')"
      />
      <ol
        v-auto-animate
        class="list peer h-0 grow overflow-y-scroll"
      >
        <NotesDialogRow
          v-for="note in filteredNotes"
          :note="note"
          @change="(name: string, description: string) => onChange(note, name, description)"
          @open="onOpen(note)"
          @remove="onRemove(note)"
        />
      </ol>
      <Placeholder
        class="hidden h-full peer-empty:flex"
        :description="$t(search ? 'No matching note exists.' : 'Add a note to display it here.')"
        :title="$t('No note found')"
        :type="PlaceholderType.Info"
      />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { PlaceholderType } from "@/components/Placeholder.vue";
import { useDatabase } from "@/database";
import { collatePosition } from "@/models/item";
import { type Note } from "@/models/object";

const { notes } = defineProps<{ notes: Note[] }>();

const emit = defineEmits<{ open: [note: Note]; refresh: [] }>();

const search = ref("");

const dialog = useTemplateRef("dialog");

const filteredNotes = computed(() =>
  notes.filter((note) => note.name.toLowerCase().includes(search.value.toLowerCase())),
);

async function onChange(note: Note, name: string, description: string) {
  note.name = name;
  note.description = description;
  const database = await useDatabase();
  await database.putObject(toRaw(note));
  emit("refresh");
}

async function onOpen(note: Note) {
  emit("open", note);
  dialog.value!.hide();
}

async function onRemove(note: Note) {
  const database = await useDatabase();
  await database.delObject(toRaw(note));
  emit("refresh");
}

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
