<template>
  <div class="@container flex flex-col gap-8 p-4">
    <header class="flex flex-row items-center gap-4">
      <BackButton />
      <TitleBar
        class="grow"
        :title="$t('Settings')"
      />
      <BackButton class="invisible" />
    </header>
    <main class="flex h-0 w-full max-w-2xl grow flex-col gap-4 overflow-scroll @2xl:self-center">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">{{ $t("Theme") }}</legend>
        <label
          class="fieldset-label"
          for="darkMode"
        >
          {{ $t("Dark mode") }}
        </label>
        <button
          class="btn w-64"
          id="darkMode"
          @click="darkModeDialog!.toggle()"
        >
          {{ themeToThemeName(darkModeTheme) }}
        </button>
        <label
          class="fieldset-label"
          for="lightMode"
        >
          {{ $t("Light mode") }}
        </label>
        <button
          class="btn w-64"
          id="lightMode"
          @click="lightModeDialog!.toggle()"
        >
          {{ themeToThemeName(lightModeTheme) }}
        </button>
      </fieldset>
    </main>
    <ThemeDialog
      v-model="darkModeTheme"
      ref="darkModeDialog"
      mode="dark"
    />
    <ThemeDialog
      v-model="lightModeTheme"
      ref="lightModeDialog"
      mode="light"
    />
  </div>
</template>
<script setup lang="ts">
import { useDatabase } from "@/database";
import { useLogging } from "@/logging";
import { Key, Theme } from "@/models/settings";
import { APPLY_THEME } from "@/keys";

const database = await useDatabase();
const { t } = useI18n();
const { f, debug } = useLogging("settings");

const applyTheme = inject("applyTheme")!;

const darkModeTheme = ref(await database.getProperty(Key.ThemeDark, Theme.Dark));
const lightModeTheme = ref(await database.getProperty(Key.ThemeLight, Theme.Light));

const darkModeDialog = useTemplateRef("darkModeDialog");
const lightModeDialog = useTemplateRef("lightModeDialog");

function themeToThemeName(theme: Theme): string {
  const entry = Object.entries(Theme).find(([, value]) => value == theme);
  if (!entry) throw new Error(`Unknown theme: ${theme}`);
  return entry[0];
}

watch(darkModeTheme, async (newTheme) => {
  await database.setProperty(Key.ThemeDark, newTheme);
  applyTheme(Key.ThemeDark, newTheme);
});

watch(lightModeTheme, async (newTheme) => {
  await database.setProperty(Key.ThemeLight, newTheme);
  applyTheme(Key.ThemeLight, newTheme);
});

useHead({ title: t("Settings") });
</script>
