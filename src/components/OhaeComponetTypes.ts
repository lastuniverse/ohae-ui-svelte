import type { IOhaeAceEditorConfig } from "./external/OhaeAceEditorTypes";
import type { IOhaeIconOfTypeConfig } from "./icons/OhaeIconOfTypeTypes";
import type { IOhaeLayoutConfig } from "./lauout/OhaeLayoutTypes";
import type { IOhaeResizerConfig } from "./lauout/OhaeResizerTypes";
import type { IOhaeSeparatorConfig } from "./lauout/OhaeSeparatorTypes";
import type { IOhaeTabsConfig as IOhaeTabsConfig, IOhaeTabItemConfig } from "./tabs/OhaeTabsTypes";

export interface IOhaeBaseComponentConfig {
    id?: string;
    view?: string; // Имя тега (например, 'layout', 'resizer', 'div')
    className?: string;
    customStyle?: string;
    color?: string;
    backgroundColor?: string;
    body?: UiNodeChildConfig;
}

export type IUiNodeConfig =
  | IOhaeLayoutConfig
  | IOhaeIconOfTypeConfig
  | IOhaeSeparatorConfig
  | IOhaeResizerConfig
  | IOhaeTabsConfig
  | IOhaeTabItemConfig
  | IOhaeAceEditorConfig
  | IOhaeBaseComponentConfig; // Общий тип для простых элементов вроде 'div' или как fallback

export type UiNodeConfig =
  | string
  | number
  | IUiNodeConfig

// Для дочерних элементов, которые могут быть строками/числами
export type UiNodeChildConfig = UiNodeConfig | UiNodeConfig[];
