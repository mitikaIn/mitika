<template>
  <div class="@container flex flex-col gap-8 p-4">
    <header class="flex flex-row items-center gap-4">
      <button
        class="btn btn-ghost"
        @click="onBackClick"
      >
        <BackIcon />
      </button>
      <TitleBar
        class="grow"
        :title="book.name"
      />
      <button
        class="btn btn-primary"
        :disabled="items.length == 0"
        @click="onSaveClick"
      >
        {{ $t("Save") }}
      </button>
    </header>
    <main class="flex h-0 w-full max-w-3xl grow flex-col gap-4 overflow-scroll @3xl:self-center">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">{{ $t("General") }}</legend>
        <label
          class="fieldset-label"
          for="name"
        >
          {{ $t("Name") }}
        </label>
        <input
          v-model.trim="name"
          class="input w-full"
          id="name"
          :placeholder="$t('Name of the book')"
          type="text"
        />
        <label
          class="fieldset-label"
          for="authors"
        >
          {{ $t("Authors") }}
        </label>
        <input
          v-model.trim="authors"
          class="input w-full"
          id="authors"
          :placeholder="$t('Comma-separated authors of the book')"
          type="text"
        />
        <label
          class="fieldset-label"
          for="tags"
        >
          {{ $t("Tags") }}
        </label>
        <input
          v-model.trim="tags"
          class="input w-full"
          id="tags"
          :placeholder="$t('Comma-separate tags of the book')"
          type="text"
        />
        <label
          class="fieldset-label"
          for="cover"
        >
          {{ $t("Cover") }}
        </label>
        <img
          v-if="coverUrl"
          :alt="$t('Cover of the book')"
          class="m-auto h-32 object-scale-down"
          ref="img"
          :src="coverUrl"
        />
        <p v-else>
          {{ $t("Book does not have any cover stored.") }}
        </p>
        <div class="flex w-full flex-row gap-2">
          <input
            ref="fileInput"
            accept="image/png"
            class="file-input join-item"
            id="cover"
            type="file"
            @change="onCoverChange"
          />
          <button
            class="btn"
            :disabled="cover == null"
            @click="onClearClick"
          >
            {{ $t("Clear") }}
          </button>
        </div>
        <p>
          {{
            $t(
              "If you clear the current cover, then a new cover will be generated when you open the book.",
            )
          }}
        </p>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          {{ $t("Items") }}
        </legend>
        <ol
          v-auto-animate
          class="list"
        >
          <EditItemRow
            v-for="(item, i) of items"
            :key="item.id"
            :item="item"
            :position="i"
            :length="items.length"
            @change="(name: string) => onItemChange(item, name)"
            @move="(src: number, dst: number) => onItemMove(item, src, dst)"
            @remove="onItemRemove(item)"
          />
        </ol>
        <button
          class="btn"
          @click="onAddClick"
        >
          {{ $t("Add item") }}
        </button>
      </fieldset>
    </main>
    <MessageDialog ref="messageDialog" />
    <SourcesDialog ref="sourcesDialog" />
  </div>
</template>
<script setup lang="ts">
import { ButtonType } from "@/components/MessageDialog.vue";
import { Constants } from "@/constants";
import { useDatabase } from "@/database";
import { useLogger } from "@/logging";
import { ITEM_TYPES_MAP, type Item, ItemType, newItem } from "@/models";
import { useStorage } from "@/storages";
import { splitBaseName, toTitleCase } from "@/utils";

const database = await useDatabase();
const { t } = useI18n();
const { f, debug } = useLogger("edit");
const route = useRoute();
const router = useRouter();
const storage = await useStorage();

const book = await database.getBook(route.params.id as string);

const originalItems = ref(await database.getItems(book.id));
const items = ref([...originalItems.value]);
const name = ref(book.name);
const authors = ref(book.authors.join(","));
const tags = ref([...book.tags].join(","));
const cover = ref(await storage.read(`/books/${book.id}/cover.png`));

const img = useTemplateRef("img");
const fileInput = useTemplateRef("fileInput");
const messageDialog = useTemplateRef("messageDialog");
const sourcesDialog = useTemplateRef("sourcesDialog");

const coverUrl = computed<string | null>((oldCoverUrl) => {
  if (oldCoverUrl) URL.revokeObjectURL(oldCoverUrl);
  if (cover.value) return URL.createObjectURL(cover.value);
  return null;
});

function diffItems(
  newList: Item[],
  oldList: Item[],
): { newItems: Item[]; oldItems: Item[]; delItems: Item[] } {
  const newItems = [];
  const oldItems = [];
  const delItems = [];

  const map = new Map<string, { item: Item; membership: number }>();

  for (const item of newList) map.set(item.id, { item, membership: -1 });

  for (const item of oldList) {
    if (map.has(item.id)) map.set(item.id, { item, membership: 0 });
    else map.set(item.id, { item, membership: 1 });
  }

  for (const { item, membership } of map.values())
    if (membership == -1) newItems.push(item);
    else if (membership == 0) oldItems.push(item);
    else if (membership == 1) delItems.push(item);
    else throw new Error(`Unknown membership: ${membership}`);

  return { newItems, oldItems, delItems };
}

async function onAddClick() {
  const [file] = await sourcesDialog.value!.chooseFiles(false, [
    {
      name: t("Item"),
      types: [...ITEM_TYPES_MAP.keys()],
    },
  ]);
  if (!file) return;

  const name = toTitleCase(splitBaseName(file.name).name);
  const item = newItem(book.id, name, file);
  items.value.push(item);
}

function onBackClick() {
  router.back();
}

function onClearClick() {
  fileInput.value!.value = "";
  cover.value = null;
}

function onCoverChange() {
  cover.value = fileInput.value?.files?.[0] ?? null;
}

function onItemChange(item: Item, name: string) {
  item.name = name;
}

function onItemMove(item: Item, src: number, dst: number) {
  const normDst = Math.min(Math.max(dst, 0), items.value.length - 1);
  const [element] = items.value.splice(src, 1);
  items.value.splice(normDst, 0, element!);
}

async function onItemRemove(item: Item) {
  const title = t("Remove {name}?", { name: item.name });
  const message = t(
    "Removing an item clears its bookmarks, notes etc. However the item's file is not deleted.",
  );
  const buttons = [
    { action: "cancel", label: t("Cancel"), type: ButtonType.Normal },
    { action: "remove", label: t("Remove"), type: ButtonType.Destructive },
  ];
  await messageDialog.value!.show(title, message, buttons, async (action: string) => {
    if (action == "remove") {
      const idx = items.value.indexOf(item);
      items.value.splice(idx, 1);
    }
  });
}

async function onSaveClick() {
  let newList = [...items.value.map(toRaw)];
  let oldList = [...originalItems.value.map(toRaw)];

  for (let i = 0; i < newList.length; i++) {
    const item = newList[i]!;
    item.order = i;
  }

  const { newItems, oldItems, delItems } = diffItems(newList, oldList);

  await database.updateItems(book.id, newItems, oldItems, delItems);

  for (const item of delItems) {
    if (item.id == book.lastAudioId) book.lastAudioId = null;
    if (item.id == book.lastPdfId) book.lastPdfId = null;
    await sourcesDialog.value!.dropFile(toRaw(item).file);
  }

  book.name = name.value || newItems[0]!.name;
  book.authors = authors.value
    .split(",")
    .map((author) => author.trim())
    .filter((author) => author.length != 0);
  book.tags = new Set(
    tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length != 0),
  );

  await database.putBook(toRaw(book));

  if (cover.value) {
    const canvas = new OffscreenCanvas(img.value!.naturalWidth, img.value!.naturalHeight);
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img.value!, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    await storage.write(`/books/${book.id}/cover.png`, blob);
  } else {
    await storage.remove(`/books/${book.id}/cover.png`);
  }

  router.back();
}

useHead({ title: t("Editing {name}", { name: book.name }) });
</script>
