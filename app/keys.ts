import SourcesDialog from "@/components/Sources/Dialog.vue";
import { type Position } from "@/models";
import type { InjectionKey } from "vue";

export type FormatPositionFn = (position: Position) => string;
export const FORMAT_POSITION = Symbol() as InjectionKey<FormatPositionFn>;

export const SOURCES_DIALOG = Symbol() as InjectionKey<typeof SourcesDialog>;
