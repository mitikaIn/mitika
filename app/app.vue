<template>
  <div
    class="flex min-h-dvh flex-col"
    :data-theme="theme"
  >
    <NuxtPage class="grow" />
  </div>
</template>
<script setup lang="ts">
import { Constants } from "@/constants";
import { useDatabase } from "@/database";
import { useLogging } from "@/logging";
import { Key, Theme } from "@/models/settings";

const { f, debug, error } = useLogging("app");

const database = await useDatabase();

const mql = window.matchMedia("(prefers-color-scheme: dark)");

const darkModeTheme = ref(await database.getProperty(Key.ThemeDark, Theme.Dark));
const lightModeTheme = ref(await database.getProperty(Key.ThemeLight, Theme.Light));
const themeMode = ref(Key.ThemeLight);

const theme = computed(() => {
  if (themeMode.value == Key.ThemeDark) return darkModeTheme.value;
  else if (themeMode.value == Key.ThemeLight) return lightModeTheme.value;
  else throw new Error(`Unknown themeMode: ${themeMode}`);
});

function applyTheme(themeMode: Key.ThemeDark | Key.ThemeLight, theme: Theme) {
  if (themeMode == Key.ThemeDark) darkModeTheme.value = theme;
  else if (themeMode == Key.ThemeLight) lightModeTheme.value = theme;
  else throw new Error(`Unknown themeMode: ${themeMode}`);
}

function onChange() {
  if (mql.matches) themeMode.value = Key.ThemeDark;
  else themeMode.value = Key.ThemeLight;
  debug(f`prefers-color-scheme changed to ${themeMode.value}`);
}

provide("applyTheme", applyTheme);

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${Constants.NAME}` : Constants.NAME;
  },
});

useRuntimeHook("app:error", (err) => {
  error(err);
});

onMounted(() => {
  mql.addEventListener("change", onChange);
  onChange();
});

onUnmounted(() => {
  mql.removeEventListener("change", onChange);
});
</script>
