<template>
  <MenuItem
    :label="mark ? $t('Remove mark') : $t('Mark')"
    @click="onClick"
  >
    <PhBookmarkSimple
      :weight="mark == null ? 'regular' : 'fill'"
      class="size-6"
    />
  </MenuItem>
</template>
<script setup lang="ts">
import { PhBookmarkSimple } from "@phosphor-icons/vue";
import { FORMAT_POSITION } from "@/keys";
import { useDatabase } from "@/database";
import { type Item, collatePosition } from "@/models/item";
import { type Mark, newMark } from "@/models/object";

const emit = defineEmits<{ refresh: [] }>();

const { item, marks } = defineProps<{ item: Item; marks: Mark[] }>();

const formatPosition = inject(FORMAT_POSITION);

const database = await useDatabase();
const { t } = useI18n();

const mark = computed(() =>
  marks.find((mark) => collatePosition(mark.position, item.position) == 0),
);

async function onClick() {
  if (mark.value) {
    await database.delObject(toRaw(mark.value));
  } else {
    const mark = newMark(
      item.id,
      toRaw(item.position),
      t("On {position}", { position: formatPosition!(item.position) }),
    );
    await database.putObject(mark);
  }
  emit("refresh");
}
</script>
