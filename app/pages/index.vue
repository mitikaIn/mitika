<template>
  <div class="flex flex-col gap-8 p-4">
    <header class="flex flex-row items-center gap-4">
      <button
        class="btn btn-ghost justify-self-start"
        @click="onAdd"
      >
        <PhFolderPlus class="size-6" />
      </button>
      <div class="flex grow flex-row items-center gap-4">
        <div class="flex basis-2/3 flex-row items-center">
          <label class="input flex max-w-xl flex-row items-center gap-2">
            <PhMagnifyingGlass class="text-base-content/50 size-6" />
            <input
              v-model.trim="search"
              class="w-full"
              :placeholder="$t('Search by name, authors, tags…')"
              type="text"
            />
          </label>
        </div>
        <Menu
          :btnSize="4"
          class="basis-1/3 justify-end gap-4"
          dropdownClass="dropdown-end"
          :gap="4"
        >
          <MenuItem
            :label="$t('View')"
            @click="viewDialog!.toggle()"
          >
            <PhEye class="size-6" />
          </MenuItem>
          <MenuItem
            :label="$t('Sort')"
            @click="sortDialog!.toggle()"
          >
            <PhFunnelSimple class="size-6" />
          </MenuItem>
          <MenuItem
            :label="$t('Tags')"
            @click="tagsDialog!.toggle()"
          >
            <PhFunnel class="size-6" />
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
      </div>
    </header>
    <main class="h-0 grow overflow-scroll">
      <BooksGrid
        :books="books"
        :search="search"
        :selectedTags="selectedTags"
        :sortType="sortType"
        :viewType="viewType"
        @add="onAdd"
        @open="onOpen"
        @edit="onEdit"
        @remove="onRemove"
      />
    </main>
    <BooksSortDialog
      ref="sortDialog"
      v-model="sortType"
    />
    <BooksTagsDialog
      ref="tagsDialog"
      :books="books"
      v-model="selectedTags"
    />
    <BooksViewDialog
      ref="viewDialog"
      v-model="viewType"
    />
    <MessageDialog ref="messageDialog" />
    <SourcesDialog ref="sourcesDialog" />
  </div>
</template>
<script lang="ts" setup>
import { ButtonType } from "@/components/MessageDialog.vue";
import { useDatabase } from "@/database";
import { useLogging } from "@/logging";
import { type Book, ITEM_TYPES_MAP, newBook, newItem } from "@/models";
import { BooksSortType, BooksViewType, Key } from "@/models/settings";
import { useStorage, ResourceType } from "@/storages";
import { splitBaseName, toTitleCase } from "@/utils";
import {
  PhFolderPlus,
  PhMagnifyingGlass,
  PhEye,
  PhFunnelSimple,
  PhFunnel,
  PhGear,
  PhPulse,
  PhQuestion,
} from "@phosphor-icons/vue";

const database = await useDatabase();
const { f, debug } = useLogging("home");
const { t } = useI18n();
const storage = await useStorage();

const books = ref(await database.getBooks());
const search = ref("");
const selectedTags = ref(new Set<string>());
const sortType = ref(await database.getProperty(Key.BooksSort, BooksSortType.RecentFirst));
const viewType = ref(await database.getProperty(Key.BooksView, BooksViewType.Card));

const messageDialog = useTemplateRef("messageDialog");
const sortDialog = useTemplateRef("sortDialog");
const sourcesDialog = useTemplateRef("sourcesDialog");
const tagsDialog = useTemplateRef("tagsDialog");
const viewDialog = useTemplateRef("viewDialog");

watch(sortType, (newSortType) => database.setProperty(Key.BooksSort, newSortType));
watch(viewType, (newViewType) => database.setProperty(Key.BooksView, newViewType));

async function refreshBooks() {
  const newBooks = await database.getBooks();
  books.value = newBooks;
}

async function onAdd() {
  const files = await sourcesDialog.value!.chooseFiles(true, [
    {
      name: t("Book"),
      types: [...ITEM_TYPES_MAP.keys()],
    },
  ]);
  if (files.length == 0) return;

  const book = newBook(toTitleCase(splitBaseName(files[0]!.name).name));
  await database.putBook(book);
  const items = [];
  for (const file of files) {
    const name = toTitleCase(splitBaseName(file.name).name);
    const item = newItem(book.id, name, file);
    items.push(item);
  }
  await database.updateItems(book.id, items, [], []);

  await refreshBooks();

  await navigateTo(`/${book.id}`);
}

async function onOpen(book: Book) {
  await navigateTo(`/${book.id}`);
}

async function onEdit(book: Book) {
  await navigateTo(`/${book.id}/edit`);
}

async function onRemove(book: Book) {
  const title = t("Remove {name}?", { name: book.name });
  const message = t(
    "Removing a book clears its bookmarks, notes etc. However the book's files are not deleted.",
  );
  const buttons = [
    { action: "cancel", label: t("Cancel"), type: ButtonType.Normal },
    { action: "remove", label: t("Remove"), type: ButtonType.Destructive },
  ];
  messageDialog.value!.show(title, message, buttons, async (action: string) => {
    if (action == "remove") {
      debug(`removing book ${book.id} (${book.name})`);

      const items = await database.getItems(book.id);
      for (const item of items) {
        debug(`removing item ${item.id} (${item.name})`);
        await storage.remove({ parentId: item.id, type: ResourceType.ItemAll });
        await sourcesDialog.value!.dropFile(toRaw(item).file);
      }

      debug("removing resources");
      await storage.remove({ parentId: book.id, type: ResourceType.BookAll });

      await database.delBook(book);

      await refreshBooks();
    }
  });
}
</script>
