<template>
  <li
    v-auto-animate
    class="list-row"
  >
    <template v-if="state == State.Display">
      <p class="list-col-grow col-start-1 col-end-4 flex flex-row flex-wrap gap-2">
        <span class="font-semibold">
          {{ mark.name }}
        </span>
        <span class="italic">
          {{ `(${formatPosition!(mark.position)})` }}
        </span>
      </p>
      <Menu
        :btnSize="4"
        class="list-col-wrap col-start-1 col-end-4 justify-end gap-2"
        dropdownClasses="dropdown-end"
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
    </template>
    <template v-else-if="state == State.Edit">
      <input
        v-model.trim="name"
        class="list-col-grow input col-start-1 col-end-4 w-full"
        :placeholder="$t('Name of the mark')"
        @keyup.enter="onSaveClick"
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
          @click="state = State.Display"
        >
          <PhX class="size-6" />
        </button>
      </div>
    </template>
    <template v-else-if="state == State.Remove">
      <p class="list-col-grow self-center font-semibold">{{ $t("Remove mark?") }}</p>
      <p class="list-col-wrap col-start-1 col-end-4">{{ mark.name }}</p>
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
import { type Mark } from "@/models/object";

enum State {
  Display,
  Edit,
  Remove,
}

const formatPosition = inject(FORMAT_POSITION);

const emit = defineEmits<{ change: [name: string]; open: []; remove: [] }>();

const { mark } = defineProps<{ mark: Mark }>();

const state = ref(State.Display);
const name = ref(mark.name);

function onSaveClick() {
  emit("change", name.value);
  state.value = State.Display;
}

function onRemoveClick() {
  emit("remove");
  state.value = State.Display;
}
</script>
