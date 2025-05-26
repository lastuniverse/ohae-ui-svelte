import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";
import type { aceEditorExt as aceEditorExts } from "./aceEditorExt";
import type { aceEditorKeyBindings } from "./aceEditorKeyBindings";
import { aceEditorModes } from "./aceEditorModes";
import type { aceEditorThemes } from "./aceEditorThemes";
import type { aceEditorWorkers } from "./aceEditorWorkers";

export type TAceThemes = (typeof aceEditorThemes)[number];
export type TAceModes = (typeof aceEditorModes)[number];
export type TAceExts = (typeof aceEditorExts)[number];
export type TAceKeyBindings = (typeof aceEditorKeyBindings)[number];
export type TAceWorkers = (typeof aceEditorWorkers)[number];



export interface IOhaeAceEditorConfig  extends IOhaeBaseComponentConfig {
    view: 'ace-editor',
    aceUrl?: string,
    fileUrl?: string,
    mode?: TAceModes,
    theme?: TAceThemes,
    fontSize?: number,
    fontFamily?: string,
    tabSize?: number,
    initialContent?: string,
    // showGutter: boolean,
    // showLineNumbers: boolean,
    // showPrintMargin: boolean,
    // showFoldWidgets: boolean,
}
