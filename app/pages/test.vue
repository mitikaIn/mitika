<template>
  <button @click="onClick">Switch</button>
  <Foo :item="item" />
</template>
<script setup lang="ts">
const a = { name: "A", position: [10] };
const b = { name: "B", position: [50] };

const item = ref(a);

function onClick() {
  console.log("Switching", item.value);
  if (item.value.name == a.name) {
    item.value = b;
  } else {
    item.value = a;
  }
}
</script>
