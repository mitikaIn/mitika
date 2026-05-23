<template>
  <li
    v-if="!editing"
    class="list-row items-center"
  >
    <PhMusicNotes
      v-if="item.type == ItemType.Audio"
      class="size-6"
    />
    <PhFileText
      v-else-if="item.type == ItemType.Pdf"
      class="size-6"
    />
    <AssertNotReached
      v-else
      :message="`Unknown item: ${item}`"
    />
    <p class="list-col-grow font-semibold">
      {{ item.name }}
    </p>
    <div class="list-col-wrap col-start-1 col-end-4 flex flex-col gap-2">
      <p class="italic">
        {{ item.file.name }}
      </p>
      <Menu
        :btnSize="4"
        class="justify-end gap-2"
        dropdownClasses="dropdown-end"
        :gap="2"
      >
        <MenuItem
          :disabled="position == 0"
          :label="$t('Move up')"
          @click="$emit('move', position, position - 1)"
        >
          <PhCaretUp class="size-6" />
        </MenuItem>
        <MenuItem
          :disabled="position == length - 1"
          :label="$t('Move down')"
          @click="$emit('move', position, position + 1)"
        >
          <PhCaretDown class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Edit')"
          @click="editing = true"
        >
          <PhPencilSimple class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Remove')"
          @click="$emit('remove')"
        >
          <PhTrashSimple class="size-6" />
        </MenuItem>
      </Menu>
    </div>
  </li>
  <li
    v-else
    class="list-row items-center"
  >
    <input
      v-model.trim="name"
      class="input list-col-grow col-start-1 col-end-4 w-full"
      @keyup.enter="onSaveClick"
      @keyup.esc="onCancelClick"
    />
    <div class="list-col-wrap col-start-1 col-end-4 flex flex-row justify-end gap-2">
      <button
        class="btn btn-ghost"
        :disabled="name.length == 0"
        @click="onSaveClick"
      >
        <PhCheck class="size-6" />
      </button>
      <button
        class="btn btn-ghost"
        @click="onCancelClick"
      >
        <PhX class="size-6" />
      </button>
    </div>
  </li>
</template>
<script setup lang="ts">
import {
  PhFileText,
  PhMusicNotes,
  PhPencilSimple,
  PhTrashSimple,
  PhCaretUp,
  PhCaretDown,
  PhCheck,
  PhX,
} from "@phosphor-icons/vue";
import { type Item, ItemType } from "@/models";

const emit = defineEmits<{
  change: [name: string];
  move: [src: number, dst: number];
  remove: [];
}>();

const { item } = defineProps<{
  position: number;
  length: number;
  item: Item;
}>();

const editing = ref(false);
const name = ref(item.name);

function onCancelClick() {
  name.value = item.name;
  editing.value = false;
}

function onSaveClick() {
  emit("change", name.value);
  editing.value = false;
}
</script>
