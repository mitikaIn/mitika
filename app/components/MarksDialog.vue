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
          :title="$t('Marks')"
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
        :placeholder="$t('Search marks…')"
      />
      <ol
        v-auto-animate
        class="list peer h-0 grow overflow-y-scroll"
      >
        <MarksDialogRow
          v-for="mark in filteredMarks"
          :mark="mark"
          @change="(name: string) => onChange(mark, name)"
          @open="onOpen(mark)"
          @remove="onRemove(mark)"
        />
      </ol>
      <Placeholder
        class="hidden h-full peer-empty:flex"
        :description="$t(search ? 'No matching mark exists.' : 'Add a mark to display it here.')"
        :title="$t('No marks found')"
        :type="PlaceholderType.Info"
      />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { PlaceholderType } from "@/components/Placeholder.vue";
import { useDatabase } from "@/database";
import { type Item, collatePosition } from "@/models/item";
import { type Mark } from "@/models/object";

let database = null;

const emit = defineEmits<{ open: [mark: Mark]; refresh: [] }>();

const { marks } = defineProps<{ marks: Mark[] }>();

const search = ref("");

const dialog = useTemplateRef("dialog");

const filteredMarks = computed(() =>
  marks.filter((mark) => mark.name.toLowerCase().includes(search.value.toLowerCase())),
);

async function onChange(mark: Mark, name: string) {
  mark.name = name;
  await database!.putObject(toRaw(mark));
  emit("refresh");
}

async function onOpen(mark: Mark) {
  emit("open", mark);
  dialog.value!.hide();
}

async function onRemove(mark: Mark) {
  await database!.delObject(toRaw(mark));
  emit("refresh");
}

function toggle() {
  dialog.value!.toggle();
}

defineExpose({ toggle });

database = await useDatabase();
</script>
