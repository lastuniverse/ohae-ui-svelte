import type { EventHandlers, IOhaeViewOptions } from "./OhaeViewOptions";
import { OhaeBaseView } from "./widgets/base_view/OhaeBaseView";

export class OhaeUI {
    private static PREFIX: string = 'ohae-';
    public  static readonly ROOT_STATE_NAME: string = 'root';
    private static viewTypes: Record<string, CustomElementConstructor> = {};
    private static viewList: Record<string, HTMLElement> = {};

    private parent: HTMLElement;
    public readonly view: Promise<HTMLElement | Text | (HTMLElement | Text)[] | null>;

    constructor(data: IOhaeViewOptions | string | (IOhaeViewOptions | string)[], parent: HTMLElement | string | null = null) {
        if (typeof parent === 'string') {
            this.parent = document.getElementById(parent) || document.body;
        } else {
            this.parent = parent || document.body;
        }
        this.view = OhaeUI.createView(data, this.parent);
    }

    static registerViewType(typeName: string, typeClass: CustomElementConstructor, options?: ElementDefinitionOptions) {
        OhaeUI.viewTypes[typeName] = typeClass;
        customElements.define(OhaeUI.getName(typeName), typeClass, options);
    }

    static getViewClassByType(typeName: string = 'layout'): CustomElementConstructor | undefined {
        return OhaeUI.viewTypes[typeName];
    }

    static getViewById(viewId: string): HTMLElement | undefined {
        return OhaeUI.viewList[viewId];
    }

    static isRegistered(typeName: string): boolean {
        return !!OhaeUI.viewTypes[typeName];
    }

    static getName(typeName: string): string {
        const list = typeName.split(/:/);
        if (list.length === 1) {
            return OhaeUI.viewTypes[typeName] ? OhaeUI.PREFIX + typeName : typeName;
        } else {
            return list[1];
        }
    }

    static getPrefixedId(id: string | number): string {
        return OhaeUI.PREFIX + id.toString();
    }

    static storeView(viewId: string, viewInstance: HTMLElement) {
        if (!viewId) return;
        OhaeUI.viewList[viewId] = viewInstance;
    }

    static async createView(data: IOhaeViewOptions | string | (IOhaeViewOptions | string)[], parent: HTMLElement): Promise<HTMLElement | (HTMLElement | Text)[] | Text | null> {
        if (!data) return null;

        if (typeof data === 'string') {
            return this.createHtmlBlock(data, parent);
        }

        if (Array.isArray(data)) {
            const fragments: (HTMLElement | Text)[] = [];
            for (const item of data) {
                const fragment = await OhaeUI.createView(item, parent);
                if (fragment) {
                    if (Array.isArray(fragment)) {
                        fragments.push(...fragment);
                    } else {
                        fragments.push(fragment);
                    }
                }

            }
            return fragments;
        }

        if (typeof data === 'object') {
            return await OhaeUI.createElement(data, parent);
        }
        return null;
    }

    private static createHtmlBlock(text: string, parent: HTMLElement): HTMLElement | Text | null {
        // const fragment = document.createTextNode(text);
        const fragment = document.createElement('span');
        parent.appendChild(fragment);
        fragment.innerHTML = text;
        return fragment;
        // parent.innerHTML += text;
        // return null;
    }

    public static async createElement(options: IOhaeViewOptions, parent?: HTMLElement): Promise<HTMLElement> {

        const viewType = options.view ?? 'layout';
        const viewName = OhaeUI.getName(viewType);
        const viewItem = document.createElement(viewName);
        OhaeUI.storeView(options.id, viewItem);

        if (viewItem instanceof OhaeBaseView) {
            viewItem.setAttribute('parentdirection', parent?.getAttribute('direction') ?? 'rows');
            await this.initOhaeHtmlElement(viewItem, options);
        } else {
            this.initStandartHtmlElement(viewItem, options);
        }
        parent?.appendChild(viewItem);

        this.applyListeners(viewItem, options.on);
        return viewItem;
    }

    private static async initOhaeHtmlElement(viewItem: OhaeBaseView, options: IOhaeViewOptions): Promise<void> {
        viewItem.setAttribute('direction', options.rows ? 'rows' : 'cols');
        const body = options.rows ?? options.cols ?? options.body;
        if (body) {
            await OhaeUI.createView(body, viewItem);
        }
        viewItem.init(options);
    }

    private static initStandartHtmlElement(viewItem: HTMLElement, options: IOhaeViewOptions) {
        Object.entries(options).forEach(([key, value]) => {
            if (key === 'id') {
                viewItem.setAttribute(key, this.getPrefixedId(value));
            } else if (typeof value != 'object' && value !== undefined) {
                (viewItem as OhaeBaseView).setAttribute(key, value.toString());
            }
        });
    }

    private static async applyListeners(element: HTMLElement, listeners?: EventHandlers): Promise<void> {
        if (!listeners) return;
        if (element instanceof OhaeBaseView) await element.onReady;
        Object.entries(listeners).forEach(([key, callback]) => {
            element.addEventListener(key, (event: Event) => {
                callback.call(element, event);
            });
        });
    }



}
