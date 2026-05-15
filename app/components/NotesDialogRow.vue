<template>
  <li
    v-auto-animate
    class="list-row"
  >
    <template v-if="state == State.Display">
      <p class="list-col-grow col-start-1 col-end-4 flex flex-row flex-wrap gap-2">
        <span class="font-semibold">
          {{ note.name }}
        </span>
        <span class="italic">
          {{ `(${formatPosition!(note.position)})` }}
        </span>
      </p>
      <div class="list-col-wrap col-start-1 col-end-4 flex flex-col gap-2">
        <textarea
          v-model="note.description"
          class="textarea max-h-[25vh] w-full"
          readonly="true"
        />
        <Menu
          :btnSize="4"
          class="justify-end gap-2"
          dropdownClassName="dropdown-end"
          :gap="2"
        >
          <MenuItem
            :label="$t('Open')"
            @click="$emit('open')"
          >
            <GoToIcon />
          </MenuItem>
          <MenuItem
            :label="$t('Edit')"
            @click="state = State.Edit"
          >
            <PhPencilSimple class="size-6" />
          </MenuItem>
          <MenuItem
            :label="$t('Removee')"
            @click="state = State.Remove"
          >
            <PhTrashSimple class="size-6" />
          </MenuItem>
        </Menu>
      </div>
    </template>
    <template v-else-if="state == State.Edit">
      <input
        v-model.trim="name"
        class="list-col-grow input col-start-1 col-end-4 w-full"
        :placeholder="$t('Name of the note')"
      />
      <div class="list-col-wrap col-start-1 col-end-4 flex flex-col gap-2">
        <textarea
          v-model.trim="description"
          class="list-col-wrap textarea col-start-1 col-end-4 max-h-[25vh] w-full"
          :placeholder="$t('Description of the note')"
        />
        <div class="flex flex-row justify-end gap-2">
          <button
            class="btn btn-ghost"
            :disabled="name.length == 0"
            @click="onSaveClick"
          >
            <PhCheck class="size-6" />
          </button>
          <button
            class="btn btn-ghost"
            @click="state = State.Display"
          >
            <PhX class="size-6" />
          </button>
        </div>
      </div>
    </template>
    <template v-else-if="state == State.Remove">
      <p class="list-col-grow self-center font-semibold">{{ $t("Remove note?") }}</p>
      <p class="list-col-wrap col-start-1 col-end-4">{{ note.name }}</p>
      <button
        class="btn btn-ghost"
        @click="state = State.Display"
      >
        <PhX class="size-6" />
      </button>
      <button
        class="btn btn-error"
        @click="onRemoveClick"
      >
        <PhCheck class="size-6" />
      </button>
    </template>
    <AssertNotReached
      v-else
      :message="`Unknown state: ${state}`"
    />
  </li>
</template>
<script setup lang="ts">
import { PhPencilSimple, PhTrashSimple, PhCheck, PhX } from "@phosphor-icons/vue";
import { FORMAT_POSITION } from "@/keys";
import { type Note } from "@/models/object";

const emit = defineEmits<{ change: [name: string, description: string]; open: []; remove: [] }>();

const { note } = defineProps<{ note: Note }>();

const formatPosition = inject(FORMAT_POSITION);

enum State {
  Display,
  Edit,
  Remove,
}

const description = ref(note.description);
const name = ref(note.name);
const state = ref(State.Display);

function onSaveClick() {
  emit("change", name.value, description.value);
  state.value = State.Display;
}

function onRemoveClick() {
  emit("remove");
  state.value = State.Display;
}
</script>
