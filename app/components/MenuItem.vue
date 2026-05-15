<template>
  <li v-if="!inDropdown || !disabled">
    <button
      :class="{ 'btn btn-ghost': !inDropdown }"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <template v-if="!inDropdown">
        <slot />
      </template>
      <span v-else>{{ label }}</span>
    </button>
  </li>
</template>
<script setup lang="ts">
defineEmits<{
  click: [];
}>();

defineProps<{
  disabled?: boolean;
  label?: string;
  inDropdown?: boolean;
}>();
</script>
