import OhaeTabItemView from "./OhaeTabItemView.svelte";
import type { ILayoutSizeProps, ILayoutStyleProps, IOhaeLayoutConfig } from "../lauout/OhaeLayoutTypes";
import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export const TabFlexDirectionContentMap = {
    top: "column",
    bottom: "column-reverse",
    left: "row",
    right: "row-reverse",
    
}

// export type TabButtonSide = "top" | "bottom" | "left" | "right";
export type TabButtonSide = keyof typeof TabFlexDirectionContentMap;

export interface TabDataItem {
    id: string;
    header?: string;
    icon?: string;
    tabItemElement: OhaeTabItemView;
    backgroundColor?: string;
};

export interface IOhaeTabsConfig extends IOhaeBaseComponentConfig {
    view: 'tabs';
    tabsSide?: TabButtonSide;
    bodyBgColor?: string;
    tabsBgColor?: string;
}

export interface IOhaeTabItemConfig extends ILayoutStyleProps, ILayoutSizeProps, IOhaeBaseComponentConfig {
    view: 'tab-item';
    icon: string;
    header: string;
    // side?: TabButtonSide;
    // current?: boolean;
}

export interface IOhaeTabButtonConfig extends ILayoutStyleProps, ILayoutSizeProps, IOhaeBaseComponentConfig {
    view: 'tab-button';
    label: string;
    icon: string;
    side?: TabButtonSide;
    current?: boolean;
    disabled?: boolean;
}

// {
//     label?: string | number;
//     icon?: string;
//     side?: TabButtonSide;
//     current?: boolean;
//     disabled?: boolean;
//     backgroundColor?: string;
//     flex?: number | "none" | string;
//     minWidth?: number | string;
//     minHeight?: number | string;
//     width?: number | string;
//     height?: number | string;
//     className?: string;
//     customStyle?: string;
// }


// ILayoutProps & {
//         // Merging ILayoutProps with specific props
//         header?: string;
//         tabIcon?: string;
//         active?: boolean;
//         tabButtonBackground?: string;
//         id?: string;
//     }