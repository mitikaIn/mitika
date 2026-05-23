<template>
  <button
    :class="buttonClasses"
    class="btn"
    :popovertarget="popoverId"
    :style="`anchor-name:--anchor-${popoverId}`"
  >
    <slot name="button"></slot>
  </button>
  <div
    :class="dropdownClasses"
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
  buttonClasses: string;
  dropdownClasses: string;
}>();

const popoverId = useId();
</script>
