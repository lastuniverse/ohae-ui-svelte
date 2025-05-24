import { Color } from "./Color";
import { appendChildToSlot, getSlot } from "./slotsUtils";
import { useFontAwesome, useShadowTheme } from "./useShadowTheme";

interface IOhaeIinitOptions {
    modifyAppendChild?: boolean;
    loadFontsAwesome?: boolean;
    loadOhaeTheme?: boolean;
};

const defaultOhaeIinitOptions = {
    modifyAppendChild: false,
    loadFontsAwesome: false,
    loadOhaeTheme: false,
};

export interface HTMLOhaeElement extends HTMLElement {
    appendChildOrig: <T extends Node>(node: T) => T
    appendChild: <T extends Node>(node: T, slotName?: string) => T
    getSlot: (slotName?: string) => Element | null
};

export function initOhae(hostNode: HTMLOhaeElement, options: IOhaeIinitOptions = {}) {
    options = { ...defaultOhaeIinitOptions, ...options };

    hostNode.getSlot = function(slotName?: string): Element | null {
        return getSlot(hostNode, slotName);
    }

    if(options.modifyAppendChild){
        hostNode.appendChildOrig = hostNode.appendChild;

        hostNode.appendChild = function<T extends Node>(node: T, slotName?: string): T{
            return appendChildToSlot(node, hostNode, slotName) as T;
        }
    }

    if(options.loadOhaeTheme){
        useShadowTheme(() => hostNode.shadowRoot);
    }

    if(options.loadFontsAwesome){
        useFontAwesome(() => hostNode.shadowRoot);
    }

}

export function assignColors(hostNode: HTMLOhaeElement, options: Record<string, string>) {
    const host = (hostNode as any);
    const style = host.style;
    Object.entries(options).forEach(([key, prop])=>{
        const value = host[prop];
        if(value){
            const bgColor = new Color(value);
            style.setProperty(`${key}-background`, bgColor.contrast(-0.05).hex);
            style.setProperty(`${key}-hover`, bgColor.contrast(0.05).hex);
            style.setProperty(`${key}-focus`, bgColor.contrast(0.15).hex);
            style.setProperty(`${key}-active`, bgColor.contrast(0.1).hex);            
            style.setProperty(`${key}-border`, bgColor.shift(-0.3).hex);
            style.setProperty(`${key}-disabled`, bgColor.mono().shift(-0.3).hex);
            style.setProperty(`${key}-color`, bgColor.contrast(0.5).hex);
        }
    });
}