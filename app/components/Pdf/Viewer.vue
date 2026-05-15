<template>
  <div class="flex flex-col gap-4">
    {{ pdf.name }}
    <button @click="$emit('close')">Close</button>
  </div>
</template>
<script setup lang="ts">
import { useLogger } from "@/logging";
import { type Pdf } from "@/models/pdf";

defineEmits<{ close: [] }>();

const { pdf } = defineProps<{ pdf: Pdf }>();

const { f, debug } = useLogger("pdfViewer");
</script>
