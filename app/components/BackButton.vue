<template>
  <button
    class="btn btn-ghost"
    @click="back"
  >
    <PhArrowLeft class="size-6 rtl:hidden" />
    <PhArrowRight class="size-6 ltr:hidden" />
  </button>
</template>
<script setup lang="ts">
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue";
import { INITIAL_HISTORY_LENGTH } from "@/keys";

const initialHistoryLength = inject(INITIAL_HISTORY_LENGTH);
const router = useRouter();

async function back() {
  if (window.history.length - initialHistoryLength >= 1) return router.back();

  const path = router.currentRoute.value.path;
  if (path == "/") return;

  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const parent = cleanPath.substring(0, cleanPath.lastIndexOf("/")) || "/";

  await navigateTo(parent);
}

defineExpose({ back });
</script>
