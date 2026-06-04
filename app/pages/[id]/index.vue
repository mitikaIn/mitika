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
        <MenuItem :label="$t('Focus mode')">
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
        dropdownClasses="dropdown-end"
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
        v-if="audio && !pdf"
        :alt="$t('Cover image of {name}', { name: book.name })"
        class="h-0 grow object-scale-down"
        :src="coverUrl || FALLBACK_COVER_URL"
      />
      <AudioPlayer
        v-if="audio"
        :audio="audio"
        :focus="book.focus"
        @close="onCloseItem(audio)"
        @metadata="onMetadata"
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
      :openItemIds="openItemIds"
      @open="onOpenItem"
      @close="onCloseItem"
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
import { useLogging } from "@/logging";
import { type Book, type Item, ItemType } from "@/models";
import { type Audio } from "@/models/audio";
import { type Pdf } from "@/models/pdf";
import { useStorage, ResourceType } from "@/storages";

const FALLBACK_COVER_URL = "/logo.webp";

const database = await useDatabase();
const { t } = useI18n();
const { f, debug } = useLogging("open");
const route = useRoute();
const storage = await useStorage();

const book = ref(await database.getBook(route.params.id as string));
const items = ref(await database.getItems(book.value.id));
const audio = ref<Audio | null>(null);
const pdf = ref<Pdf | null>(null);
const cover = ref<Blob | null>(null);

const itemsDialog = useTemplateRef("itemsDialog");
const sourcesDialog = useTemplateRef("sourcesDialog");

const coverUrl = computed<string | null>((oldCoverUrl) => {
  if (oldCoverUrl) URL.revokeObjectURL(oldCoverUrl);
  if (cover.value) return URL.createObjectURL(cover.value);
  return null;
});

const openItemIds = computed<Set<string>>(() => {
  const ids = new Set();
  if (audio.value) ids.add(audio.value.id);
  if (pdf.value) ids.add(pdf.value.id);
  return ids;
});

async function onCloseItem(item: Item) {
  if (item.type == ItemType.Audio) {
    book.value.lastAudioId = null;
    audio.value = null;
  } else if (item.type == ItemType.Pdf) {
    book.value.lastPdfId = null;
    pdf.value = null;
  } else {
    throw new Error(`unknown item type ${item.type}`);
  }

  await database.putBook(toRaw(book.value));
}

async function onMetadata(name: string | null, authors: string[], itemCover: Blob | null) {
  if (name && book.value.temporaryName) {
    debug(`changing book name to ${name}`);
    book.value.name = name;
    book.value.temporaryName = false;
  }

  if (book.value.temporaryAuthors) {
    const newAuthors = Array.from(new Set(authors).difference(new Set(book.value.authors)));
    if (newAuthors.length != 0) {
      debug(`adding new authors ${newAuthors}`);
      book.value.authors.push(...newAuthors);
    }
  }

  if (!cover.value && itemCover) {
    debug(`changing book cover`);
    await storage.write({ parentId: book.value.id, type: ResourceType.BookCover }, itemCover);
    cover.value = itemCover;
  }

  await database.putBook(toRaw(book.value));
}

async function onOpenItem(item: Item) {
  if (item.type == ItemType.Audio) {
    book.value.lastAudioId = item.id;
    audio.value = item;
  } else if (item.type == ItemType.Pdf) {
    book.value.lastPdfId = item.id;
    pdf.value = item;
  } else {
    throw new Error(`unknown item type ${item.type}`);
  }

  await database.putBook(toRaw(book.value));
}

provide(SOURCES_DIALOG, sourcesDialog);

onMounted(async () => {
  if (book.value.openingFirstTime) {
    const firstAudio = items.value.find((item) => item.type == ItemType.Audio);
    if (firstAudio) book.value.lastAudioId = firstAudio.id;

    const firstPdf = items.value.find((item) => item.type == ItemType.Pdf);
    if (firstPdf) book.value.lastPdfId = firstPdf.id;

    book.value.openingFirstTime = false;
  }
  book.value.lastOpened = new Date();

  if (book.value.lastAudioId)
    audio.value = items.value.find((item) => book.value.lastAudioId == item.id);

  if (book.value.lastPdfId) pdf.value = items.value.find((item) => book.value.lastPdfId == item.id);

  cover.value = await storage.read({ parentId: book.value.id, type: ResourceType.BookCover });
  if (!cover.value) {
    for (const item of items.value) {
      const itemCover = await storage.read({ parentId: item.id, type: ResourceType.ItemCover });
      if (itemCover) {
        await storage.write({ parentId: book.value.id, type: ResourceType.BookCover }, itemCover);
        cover.value = itemCover;
        break;
      }
    }
  }

  await database.putBook(toRaw(book.value));
});

onUnmounted(async () => {
  if (coverUrl.value) URL.revokeObjectURL(coverUrl.value);
});

useHead({
  title: t("{name} by {authors}", {
    name: book.value.name,
    authors: book.value.authors.length != 0 ? book.value.authors.join(", ") : "unknown",
  }),
});
</script>
