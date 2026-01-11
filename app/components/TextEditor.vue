<template>
  <div class="border rounded-box flex flex-col overflow-hidden border-base-content/20 bg-base-100">
    <div v-if="editable && editor" class="flex flex-wrap gap-1 border-b border-base-content/20 bg-base-200/50 p-2">
      <button
        class="join-item btn btn-xs btn-ghost"
        :class="{ 'bg-base-content/10': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <BoldIcon class="size-3" />
      </button>
      <button
        class="join-item btn btn-xs btn-ghost"
        :class="{ 'bg-base-content/10': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <ItalicIcon class="size-3" />
      </button>
      <button
        class="join-item btn btn-xs btn-ghost"
        :class="{ 'bg-base-content/10': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <StrikethroughIcon class="size-3" />
      </button>
      <div class="divider divider-horizontal mx-0"></div>
      <button
        class="join-item btn btn-xs btn-ghost"
        :class="{ 'bg-base-content/10': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <ListIcon class="size-3" />
      </button>
      <button
        class="join-item btn btn-xs btn-ghost"
        :class="{ 'bg-base-content/10': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <ListOrderedIcon class="size-3" />
      </button>
      <div class="divider divider-horizontal mx-0"></div>
      <button class="join-item btn btn-xs btn-ghost" @click="editor.chain().focus().undo().run()">
        <UndoIcon class="size-3" />
      </button>
      <button class="join-item btn btn-xs btn-ghost" @click="editor.chain().focus().redo().run()">
        <RedoIcon class="size-3" />
      </button>
    </div>
    <editor-content :editor="editor" class="prose max-w-none p-4 min-h-[100px] outline-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  UndoIcon,
  RedoIcon,
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  editable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable ?? true,
  extensions: [StarterKit],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, { emitUpdate: false })
  }
})

watch(() => props.editable, (newValue) => {
    editor.value?.setEditable(newValue ?? true);
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
/* Basic prose overrides if needed for editor content */
.ProseMirror {
    outline: none;
    min-height: 100px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
