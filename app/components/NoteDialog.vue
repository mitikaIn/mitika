<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :title="$t('Add a note')"
        />
        <button
          class="btn btn-ghost"
          @click="dialog!.hide()"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <input
        v-model="name"
        class="input w-full"
        :placeholder="$t('Name of the note')"
      />
      <textarea
        v-model="description"
        class="textarea w-full"
        :placeholder="$t('Description of the note')"
      />
      <button
        class="btn btn-primary"
        :disabled="name.length == 0"
        @click="onAddClick"
      >
        {{ $t("Add") }}
      </button>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { FORMAT_POSITION } from "@/keys";
import { useDatabase } from "@/database";
import { type Item } from "@/models/item";
import { newNote } from "@/models/object";

const { t } = useI18n();

const formatPosition = inject(FORMAT_POSITION);

const emit = defineEmits<{ refresh: [] }>();

const { item } = defineProps<{ item: Item }>();

const description = ref("");
const name = ref("");

const dialog = useTemplateRef("dialog");

async function onAddClick() {
  const database = await useDatabase();
  const note = newNote(item.id, toRaw(item.position), name.value, description.value);
  await database.putObject(note);
  dialog.value!.hide();
  emit("refresh");
}

function toggle() {
  name.value = t("On {position}", { position: formatPosition!(item.position) });
  description.value = t("{name} says…", { name: item.name });
  dialog.value!.toggle();
}

defineExpose({ toggle });
</script>
