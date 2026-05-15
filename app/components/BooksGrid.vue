<template>
  <ol
    v-auto-animate
    class="peer grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] place-items-center gap-4"
  >
    <template v-if="viewType == BooksViewType.Card">
      <BooksGridCard
        v-for="book in sortedBooks"
        :book="book"
        @edit="$emit('edit', book)"
        @open="$emit('open', book)"
        @remove="$emit('remove', book)"
      />
    </template>
    <template v-else-if="viewType == BooksViewType.Row">
      <BooksGridRow
        v-for="book in sortedBooks"
        :book="book"
        @edit="$emit('edit', book)"
        @open="$emit('open', book)"
        @remove="$emit('remove', book)"
      />
    </template>
    <AssertNotReached
      v-else
      :message="`unknown viewType ${viewType}`"
    />
  </ol>
  <Placeholder
    class="hidden h-full peer-empty:flex"
    :description="
      books.length == 0 ? $t('Add a few books to open them here.') : $t('Try changing the filters.')
    "
    :label="$t('Add new book')"
    :title="books.length == 0 ? $t('Library is empty') : $t('No such book')"
    :type="PlaceholderType.Info"
    @click="$emit('add')"
  />
</template>
<script setup lang="ts">
import { PlaceholderType } from "@/components/Placeholder.vue";
import { type Book } from "@/models";
import { BooksSortType, BooksViewType } from "@/models/settings";

defineEmits<{
  add: [];
  open: [book: Book];
  edit: [book: Book];
  remove: [book: Book];
}>();

const { books, viewType, search, sortType, selectedTags } = defineProps<{
  books: Book[];
  search: string;
  sortType: BooksSortType;
  selectedTags: Set<string>;
  viewType: BooksViewType;
}>();

function filterBook(book: Book): boolean {
  if (selectedTags.size == 0) return true;
  return toRaw(book.tags).intersection(selectedTags).size != 0;
}

function searchBook(book: Book): boolean {
  const needle = search.toLocaleLowerCase();

  if (book.name.toLocaleLowerCase().includes(needle)) return true;

  if (book.authors.find((author) => author.toLocaleLowerCase().includes(needle))) return true;

  for (const tag of book.tags) if (tag.toLocaleLowerCase().includes(needle)) return true;

  return false;
}

function sortBook(a: Book, b: Book): number {
  if (sortType == BooksSortType.Alphabetical) return a.name.localeCompare(b.name);
  if (sortType == BooksSortType.RecentFirst)
    return (b.lastOpened > a.lastOpened ? 1 : 0) - (b.lastOpened < a.lastOpened ? 1 : 0);
  if (sortType == BooksSortType.RecentLast)
    return (a.lastOpened > b.lastOpened ? 1 : 0) - (a.lastOpened < b.lastOpened ? 1 : 0);
  if (sortType == BooksSortType.ReverseAlphabetical) return b.name.localeCompare(a.name);
  return 0;
}

const filteredBooks = computed(() => books.filter((book) => filterBook(book)));
const searchedBooks = computed(() => filteredBooks.value.filter((book) => searchBook(book)));
const sortedBooks = computed(() => searchedBooks.value.toSorted((a, b) => sortBook(a, b)));
</script>
