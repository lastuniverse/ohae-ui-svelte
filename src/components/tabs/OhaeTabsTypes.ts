import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export type TabButtonSide = "top" | "bottom" | "left" | "right";

export interface IOhaeTabConfig extends IOhaeBaseComponentConfig {
    view: 'tabs';
    tabsSide?: TabButtonSide;
    tabButtonBackground?: string;
    // size?: number;
}

export interface IOhaeTabItemConfig extends IOhaeBaseComponentConfig {
    view: 'tab-item';
    icon?: string;
    header?: string;
    // size?: number;
}