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
import { APPLY_THEME, INITIAL_HISTORY_LENGTH } from "@/keys";

const { f, debug, error } = useLogging("app");
const database = await useDatabase();

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const darkModeTheme = ref(await database.getProperty(Key.ThemeDark, Theme.Dark));
const lightModeTheme = ref(await database.getProperty(Key.ThemeLight, Theme.Light));
const themeMode = ref(Key.ThemeLight);

const theme = computed(() => {
  if (themeMode.value == Key.ThemeDark) return darkModeTheme.value;
  else if (themeMode.value == Key.ThemeLight) return lightModeTheme.value;
  else throw new Error(`unknown themeMode ${themeMode}`);
});

function applyTheme(themeMode: Key.ThemeDark | Key.ThemeLight, theme: Theme) {
  if (themeMode == Key.ThemeDark) darkModeTheme.value = theme;
  else if (themeMode == Key.ThemeLight) lightModeTheme.value = theme;
  else throw new Error(`unknown themeMode ${themeMode}`);
}

function onChange() {
  if (prefersDark.matches) themeMode.value = Key.ThemeDark;
  else themeMode.value = Key.ThemeLight;
  debug(f`prefers-color-scheme changed to ${themeMode.value}`);
}

provide(APPLY_THEME, applyTheme);
provide(INITIAL_HISTORY_LENGTH, window.history.length);

onMounted(() => {
  prefersDark.addEventListener("change", onChange);
  onChange();
});

onUnmounted(() => {
  prefersDark.removeEventListener("change", onChange);
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${Constants.NAME}` : Constants.NAME;
  },
});

useRuntimeHook("app:error", (err) => {
  error(err);
});
</script>
