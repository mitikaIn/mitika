<template>
  <button
    :class="buttonClassName"
    class="btn"
    :popovertarget="popoverId"
    :style="`anchor-name:--anchor-${popoverId}`"
  >
    <slot name="button"></slot>
  </button>
  <div
    :class="dropdownClassName"
    class="dropdown"
    :id="popoverId"
    popover
    :style="`position-anchor:--anchor-${popoverId}`"
  >
    <slot name="content"></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  buttonClassName: string;
  dropdownClassName: string;
}>();

const popoverId = useId();
</script>
