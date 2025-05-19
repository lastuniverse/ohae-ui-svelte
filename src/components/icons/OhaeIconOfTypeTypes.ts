import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export type IconTypeDefinition = {
    icon: string; // Например, 'fa-home', 'fas fa-user', 'fa fa-folder'
    color?: string; // Цвет по умолчанию для этого типа, например, '#FF0000'
};


export interface IOhaeIconOfTypeConfig extends IOhaeBaseComponentConfig {
    view: 'icon';
    types: Record<string, IconTypeDefinition>;
    size?: number;
    padding?: number;
    margin?: number;
    value?: string;
}