<template>
  <dialog
    class="modal @container"
    ref="dialog"
  >
    <div
      :class="classes"
      class="modal-box"
    >
      <slot />
    </div>
  </dialog>
</template>
<script setup lang="ts">
const { classes = "" } = defineProps<{
  classes?: string;
}>();

const dialog = useTemplateRef("dialog");

function hide() {
  dialog.value!.close();
}

function isShown(): boolean {
  return dialog.value!.open;
}

function show() {
  dialog.value!.showModal();
}

function toggle() {
  if (isShown()) hide();
  else show();
}

defineExpose({
  hide,
  isShown,
  show,
  toggle,
});
</script>
