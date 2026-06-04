import SourcesDialog from "@/components/Sources/Dialog.vue";
import { type Position } from "@/models";
import { Key, Theme } from "@/models/settings";
import type { InjectionKey } from "vue";

export type ApplyThemeFn = (themeMode: Key.ThemeDark | Key.ThemeLight, theme: Theme) => void;
export const APPLY_THEME = Symbol() as InjectionKey<ApplyThemeFn>;

export type FormatPositionFn = (position: Position) => string;
export const FORMAT_POSITION = Symbol() as InjectionKey<FormatPositionFn>;

export const INITIAL_HISTORY_LENGTH = Symbol() as InjectionKey<number>;

export const SOURCES_DIALOG = Symbol() as InjectionKey<typeof SourcesDialog>;
