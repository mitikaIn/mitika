<template>
  <div
    :class="className"
    class="flex flex-col justify-center-safe"
  ></div>
</template>
<script setup lang="ts">
const { text } = defineProps<{
  text: string;
}>();

const COLORS = [
  "from-red-500 to-amber-500",
  "from-orange-500 to-yellow-500",
  "from-amber-500 to-lime-500",
  "from-yellow-500 to-green-500",
  "from-lime-500 to-emerald-500",
  "from-green-500 to-teal-500",
  "from-emerald-500 to-cyan-500",
  "from-teal-500 to-sky-500",
  "from-cyan-500 to-blue-500",
  "from-sky-500 to-indigo-500",
  "from-blue-500 to-violet-500",
  "from-indigo-500 to-purple-500",
  "from-violet-500 to-fuchsia-500",
  "from-purple-500 to-pink-500",
  "from-fuchsia-500 to-rose-500",
  "from-pink-500 to-red-500",
  "from-rose-500 to-orange-500",
];
const DIRECTIONS = [
  "bg-gradient-to-bl",
  "bg-gradient-to-br",
  "bg-gradient-to-tl",
  "bg-gradient-to-tr",
  "bg-radial",
];
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];

const seed = computed(() =>
  text.length == 0
    ? 0
    : PRIMES.reduce((prime, sum) => text.charCodeAt(prime % text.length) + sum, 0),
);

const className = computed(() => [
  COLORS[seed.value % COLORS.length],
  DIRECTIONS[seed.value % DIRECTIONS.length],
]);
</script>
