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


// const AceThemeMap = {
//     'monokai': 'ace/theme/monokai',
//     'tomorrow_night_eighties': 'ace/theme/tomorrow_night_eighties',
//     'github': 'ace/theme/github',
//     'solarized_dark': 'ace/theme/solarized_dark',
//     'solarized_light': 'ace/theme/solarized_light'
// }


// const AceModesMap = {
//     'javascript': 'ace/mode/javascript',
//     'typescript': 'ace/mode/typescript',
//     'python': 'ace/mode/python',
//     'java': 'ace/mode/java',
//     'c_cpp': 'ace/mode/c_cpp',
//     'html': 'ace/mode/html',
//     'css': 'ace/mode/css',
//     'json': 'ace/mode/json',
//     // Add more modes as needed
// }
