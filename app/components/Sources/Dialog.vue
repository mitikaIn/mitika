<template>
  <OriginalDialog
    ref="dialog"
    @cancel="onCancel"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <button class="btn invisible">
          <PhX class="size-6" />
        </button>
        <TitleBar
          class="grow"
          :subtitle="$t('Choose the source of the file.')"
          :title="$t('Sources')"
        />
        <button
          class="btn btn-ghost"
          @click="onCancel"
        >
          <PhX class="size-6" />
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <button
          class="btn"
          @click="onClick(local.SOURCE_ID)"
        >
          <PhUpload class="size-6" />
          {{ $t("Local") }}
        </button>
        <button
          class="btn"
          @click="onClick('gdrive')"
        >
          <PhGoogleDriveLogo class="size-6" />
          {{ $t("Google Drive") }}
        </button>
      </div>
    </div>
  </OriginalDialog>
</template>
<script lang="ts">
import { type Filter } from "@/components/Sources/common";

export { type Filter };
</script>
<script setup lang="ts">
import { PhX, PhGoogleDriveLogo, PhUpload } from "@phosphor-icons/vue";
import OriginalDialog from "@/components/Dialog.vue";
import * as local from "@/components/Sources/local";
import { type File } from "@/models";

interface ChooseFilesRequest {
  filters: Filter[];
  multiple: boolean;
  promise: Promise<File[]>;
  resolve: (files: File[]) => void;
  reject: (error: Error) => void;
}

let chooseFilesRequest: ChooseFilesRequest | null = null;

const dialog = useTemplateRef("dialog");

function onCancel() {
  if (!chooseFilesRequest) throw new Error("dialog is active but no request found");

  chooseFilesRequest.resolve([]);
  chooseFilesRequest = null;
  dialog.value!.hide();
}

async function onClick(sourceId: string) {
  if (!chooseFilesRequest) throw new Error("dialog is active but no request found");

  if (sourceId == local.SOURCE_ID) {
    try {
      const files = await local.chooseFiles(
        chooseFilesRequest.multiple,
        chooseFilesRequest.filters,
      );
      chooseFilesRequest.resolve(files);
    } catch (error) {
      chooseFilesRequest.reject(error as Error);
    }
  } else {
    chooseFilesRequest.reject(new Error(`unknown sourceId ${sourceId}`));
  }

  chooseFilesRequest = null;
  dialog.value!.hide();
}

async function chooseFiles(multiple: boolean, filters: Filter[]): Promise<File[]> {
  if (chooseFilesRequest) throw new Error("a request is already pending");

  chooseFilesRequest = { filters, multiple, ...Promise.withResolvers() };
  dialog.value!.show();
  return chooseFilesRequest.promise;
}

async function dropFile(file: File) {
  if (file.sourceId == local.SOURCE_ID) return local.dropFile(file as local.LocalFile);
  else throw new Error(`unknown sourceId ${file.sourceId}`);
}

async function readFile(file: File): Promise<Blob> {
  if (file.sourceId == local.SOURCE_ID) return local.readFile(file as local.LocalFile);
  else throw new Error(`unknown sourceId ${file.sourceId}`);
}

defineExpose({ chooseFiles, dropFile, readFile });
</script>
