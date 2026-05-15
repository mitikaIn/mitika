<template>
  <div
    v-auto-animate
    class="flex flex-col gap-8 p-4"
  >
    <header class="flex flex-row gap-4">
      <Menu
        :btnSize="4"
        class="basis-1/4 justify-start gap-2"
        expandDir="start"
        :gap="2"
      >
        <MenuItem
          :label="$t('Edit')"
          @click="navigateTo(`/${book.id}/edit`)"
        >
          <PhPencilSimple class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Items')"
          @click="itemsDialog!.toggle()"
        >
          <PhFolderOpen class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Focus mode')"
          @click="onFocusClick"
        >
          <PhLightning class="size-6" />
        </MenuItem>
      </Menu>
      <TitleBar
        class="basis-2/4"
        :subtitle="book.authors.join(', ')"
        :title="book.name"
      />
      <Menu
        :btnSize="4"
        class="basis-1/4 justify-end gap-2"
        dropdownClassName="dropdown-end"
        expandDir="start"
        :gap="2"
      >
        <MenuItem
          :label="$t('Home')"
          @click="navigateTo('/')"
        >
          <PhHouse class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Settings')"
          @click="navigateTo('/settings')"
        >
          <PhGear class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Logs')"
          @click="navigateTo('/logs')"
        >
          <PhPulse class="size-6" />
        </MenuItem>
        <MenuItem
          :label="$t('Help')"
          @click="navigateTo('/help')"
        >
          <PhQuestion class="size-6" />
        </MenuItem>
      </Menu>
    </header>
    <main
      v-auto-animate
      class="flex grow flex-col gap-4"
    >
      <PdfViewer
        v-if="pdf"
        class="grow"
        :pdf="pdf"
        @close="onCloseItem(pdf)"
      />
      <img
        v-if="coverUrl && audio && !pdf"
        :alt="$t('Cover image of {name}', { name: book.name })"
        class="h-0 grow object-scale-down"
        :src="coverUrl"
      />
      <AudioPlayer
        v-if="audio"
        :audio="audio"
        :focus="book.focus"
        @close="onCloseItem(audio)"
      />
      <Placeholder
        v-if="!audio && !pdf"
        class="grow"
        :description="$t('Open an item to play or view here.')"
        :label="$t('Open item')"
        :title="$t('Make your choice')"
        :type="PlaceholderType.Info"
        @click="itemsDialog!.toggle()"
      />
    </main>
    <ItemsDialog
      ref="itemsDialog"
      :items="items"
      @open="onOpenItem"
    />
    <SourcesDialog ref="sourcesDialog" />
  </div>
</template>
<script setup lang="ts">
import {
  PhHouse,
  PhLightning,
  PhFolderOpen,
  PhPencilSimple,
  PhGear,
  PhPulse,
  PhQuestion,
} from "@phosphor-icons/vue";
import { SOURCES_DIALOG } from "@/keys";
import { PlaceholderType } from "@/components/Placeholder.vue";
import { useDatabase } from "@/database";
import { useLogger } from "@/logging";
import { type Book, type Item, ItemType } from "@/models";
import { type Audio } from "@/models/audio";
import { type Pdf } from "@/models/pdf";
import { useStorage } from "@/storages";

const database = await useDatabase();
const { f, debug } = useLogger("open");
const route = useRoute();
const storage = await useStorage();

const cover = await storage.read(`/books/${route.params.id}/cover.png`);
let coverUrl: string = "/logo.webp";

const active = ref(true);
const book = ref(await database.getBook(route.params.id as string));
const items = ref(await database.getItems(book.value.id));

const sourcesDialog = useTemplateRef("sourcesDialog");

const audio = computed<Audio | null>(
  () =>
    items.value.find(
      (item) =>
        item.type == ItemType.Audio &&
        (book.value.openingFirstTime || book.value.lastAudioId == item.id),
    ) as Audio,
);
const pdf = computed<Pdf | null>(
  () =>
    items.value.find(
      (item) =>
        item.type == ItemType.Pdf &&
        (book.value.openingFirstTime || book.value.lastPdfId == item.id),
    ) as Pdf,
);

const itemsDialog = useTemplateRef("itemsDialog");

async function onCloseItem(item: Item) {
  if (item.type == ItemType.Audio) book.value.lastAudioId = null;
  else if (item.type == ItemType.Pdf) book.value.lastPdfId = null;
  else throw new Error(`Unknown item.type: ${item.type}`);
  await database.putBook(toRaw(book.value));
}

async function onOpenItem(item: Item) {
  if (item.type == ItemType.Audio) book.value.lastAudioId = item.id;
  else if (item.type == ItemType.Pdf) book.value.lastPdfId = item.id;
  else throw new Error(`Unknown item.type: ${item.type}`);
  await database.putBook(toRaw(book.value));
}

onUnmounted(async () => {
  if (cover) URL.revokeObjectURL(coverUrl);

  if (book.value.openingFirstTime) {
    book.value.openingFirstTime = false;
    book.value.lastAudioId = audio.value?.id || null;
    book.value.lastPdfId = pdf.value?.id || null;
    await database.putBook(toRaw(book.value));
  }
});

onMounted(async () => {
  if (cover) coverUrl = URL.createObjectURL(cover);
});

provide(SOURCES_DIALOG, sourcesDialog);
</script>
