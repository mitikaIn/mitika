<template>
  <Dialog ref="dialog">
    <div class="flex flex-col gap-4">
      <TitleBar
        class="grow"
        :title="dialogTitle"
      />
      <p>
        {{ dialogMessage }}
      </p>
      <div class="modal-action">
        <button
          v-for="button of dialogButtons"
          :key="button.action"
          :class="{
            'btn-error': button.type == ButtonType.Destructive,
            'btn-primary': button.type == ButtonType.Suggested,
          }"
          class="btn"
          @click="onClick(button.action)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts">
export enum ButtonType {
  Destructive,
  Normal,
  Suggested,
}

export interface Button {
  action: string;
  label: string;
  type: ButtonType;
}

export type OnClickCallback = (action: string) => void;
</script>
<script setup lang="ts">
let dialogCallback: OnClickCallback | null;

const dialogButtons = ref<Button[]>([]);
const dialogMessage = ref("");
const dialogTitle = ref("");

const dialog = useTemplateRef("dialog");

function onClick(action: string) {
  hide();
  dialogCallback!(action);
}

function hide() {
  dialog.value!.hide();
}

function show(title: string, message: string, buttons: Button[], callback: OnClickCallback) {
  dialogTitle.value = title;
  dialogMessage.value = message;
  dialogButtons.value = buttons;
  dialogCallback = callback;
  dialog.value!.show();
}

defineExpose({
  hide,
  show,
});
</script>
