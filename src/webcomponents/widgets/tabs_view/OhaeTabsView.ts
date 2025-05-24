import { Color } from "../../utils/Color";
import { OhaeUI } from "../../OhaeUI";
import { type IOhaeViewOptions } from "../../OhaeViewOptions";
import { OhaeBaseView } from "../base_view/OhaeBaseView";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeTabItemButtonView } from "./OhaeTabItemButton";
import { OhaeTabItemViewOld } from "./OhaeTabItemView";

type TabData = { tab: OhaeTabItemButtonView, view: OhaeTabItemViewOld, index: number };

export class OhaeTabsView extends OhaeLayoutView {
    public static readonly ATTRIBUTES: string[] = [
        'tabsSide',
        'tabsHeight',
        'tabsWidth',
        'allowHideAll',
        'tabButtonBackground'
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            box-sizing: border-box;
            background-color:var(--host-bg, transparent);
            padding: 0px;
            margin: 0px;

            overflow: auto;
            height: auto;
            width: auto;

            /* flex-grow: 1; */
        }
        :host([tabsSide="top"]) {
            flex-direction: column;
        }		
        :host([tabsSide="bottom"]) {
            flex-direction: column-reverse;
        }		
        :host([tabsSide="left"]) {
            flex-direction: row;
        }		
        :host([tabsSide="right"]) {
            flex-direction: row-reverse;
        }		

        :host([backgroundColor]) {
            box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
            color: var(--host-color, #ddd);
        }

        .header {
            display: flex;
            height: 28px;
            /* background-color: #363c46; */
            color: #ссс;
            /* border-radius: 4px 4px 0 0; */
            justify-content: space-between;
            /* align-items: center; */
			padding: 0px 0px;
			margin: 0px 10px;
            cursor: pointer;
            font-weight: 500;
        }
        :host([tabsSide="top"]) .header{
            margin: -1px 10px;
        }

        :host([tabsSide="bottom"]) .header{
            margin: 1px 10px;
        }

        :host([tabsSide="left"]) .header, :host([tabsSide="right"]) .header{
            margin: 3px 0px;
            flex-direction: column;
            justify-content: flex-start;
            align-items: end;
        }
        :host([tabsSide="left"]) .header{
            margin: 3px 0px;
        }            
        :host([tabsSide="right"]) .header{
            margin: 3px 0px;
        }            

        .body {
            display: flex;
            flex-direction: column;
			border-radius: 3px;
            padding: 0px;

            overflow: auto;
            height: auto;
            width: auto;
            margin: 0px;
            flex-grow: 1;
        }
        .collapse {
            display: none;
        }
    </style>
    `;

    protected static readonly HTML = `
        <div class="header">
        </div>
        <div class="body">
            <slot></slot>
        </div>
    `;

    private currentTab: TabData | null = null;

    protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeTabsView.ATTRIBUTES);



        await this.initTabsFromChildren();
        this.tabsSide = this.tabsSide;

        if (this.allowHideAll) {
            this.hideAllTab();
        } else {
            const firstTab = this.firstElementChild as OhaeTabItemViewOld;
            if (!firstTab) return;
            this.showTab(firstTab as OhaeTabItemViewOld);
        }
        // const lastTab = this.lastElementChild as OhaeTabItemView;
        // if(!lastTab) return;
        // this.switchTab(firstTab, lastTab);

    }

    private async initTabsFromChildren(): Promise<void> {
        for (const child of this.items) {
            if (child instanceof OhaeTabItemViewOld) {
                await this.initTab(child);
            }
        }
    }

    private async initTab(tabView: OhaeTabItemViewOld, target?: OhaeTabItemViewOld | number | string): Promise<OhaeTabItemButtonView | null> {
        if (!(tabView instanceof OhaeTabItemViewOld)) return null;
        // console.log('button color', tabView.tabButtonBackground?.hex ?? this.tabButtonBackground?.hex);
        const headersContainer = this.shadowRoot!.querySelector('.header');
        return OhaeUI.createView({
            view: 'tab-button',
            flex: 1,
            side: this.tabsSide,
            backgroundColor: tabView.tabButtonBackground?.hex ?? this.tabButtonBackground?.hex,
            // minWidth: 300,//this.tabsWidth,
            // minHeight: 29, //this.tabsHeight,
            label: tabView.header,
            icon: tabView.icon,
            on: {
                click: (e: Event) => {
                    this.toggleTab(tabView);
                }
            }
        } as IOhaeViewOptions, headersContainer as OhaeTabItemViewOld) as Promise<OhaeTabItemButtonView>;
    }

    private resolveTab(target: OhaeTabItemViewOld | number | string): TabData | null {
        let view: OhaeTabItemViewOld | null = null;
        if (target instanceof OhaeTabItemViewOld) view = target;
        if (typeof target === 'number') view = this.items[target] as OhaeTabItemViewOld;
        if (typeof target === 'string') view = this.items.find(tab => tab.id === target) as OhaeTabItemViewOld ?? null;

        if (view === null) return null;

        const index = this.items.indexOf(view);
        if (index < 0) return null;

        return {
            index,
            view,
            tab: this.tabs[index]
        };
    }

    public getTab(target: OhaeTabItemViewOld | number | string): TabData | null {
        const tabData = this.resolveTab(target);
        if (tabData === null) return null;
        return tabData;
    }

    public getCurrentTab(): TabData | null {
        return this.currentTab;
    }

    public removeTab(target: OhaeTabItemViewOld | number | string): TabData | null {
        const tabData = this.resolveTab(target);
        if (tabData === null) return null;
        const headersContainer = this.shadowRoot!.querySelector('.header');

        if (!headersContainer) return null;

        this.removeChild(tabData.view);
        headersContainer?.removeChild(tabData.tab);
        return tabData;
    }


    public toggleTab(target: OhaeTabItemViewOld | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;
        if (tabData.view.collapsed) {
            this.showTab(target);
        } else if (this.allowHideAll) {
            this.hideAllTab();
        }
    }
    public showTab(target: OhaeTabItemViewOld | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;

        if (this.allowHideAll) {
            const parent = this.parentElement as OhaeBaseView;
            if (parent?.flex === 0) parent.flex = window.innerWidth;
        }

        this.hideAllTab();

        tabData.view.show();
        tabData.tab.current = true;
        this.currentTab = this.resolveTab(tabData.view);
    }

    public hideTab(target: OhaeTabItemViewOld | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;
        if (this.allowHideAll || tabData.view !== this.currentTab?.view) {
            tabData.view.hide();
            tabData.tab.current = false;
        }
        if (tabData.view === this.currentTab?.view) {
            this.currentTab = null;
        }
        return;
    }

    public hideAllTab(): void {
        if (this.allowHideAll) {
            const parent = this.parentElement as OhaeBaseView;
            if (parent) parent.flex = 0;
        }
        this.items.forEach(child => {
            const tabData = this.resolveTab(child);
            if (tabData === null) return;
            tabData.view.hide();
            tabData.tab.current = false;
        });
        this.currentTab = null;
    }

    public switchTab(source: OhaeTabItemViewOld | number | string, target: OhaeTabItemViewOld | number | string): TabData | null {
        this.shiftTab(source, target);
        this.shiftTab(target, this.firstElementChild as OhaeTabItemViewOld);
        return this.currentTab;
    }

    public shiftTab(source: OhaeTabItemViewOld | number | string, target: OhaeTabItemViewOld | number | string): TabData | null {
        const headersContainer = this.shadowRoot!.querySelector('.header');
        if (!headersContainer) return null;

        const sourceTabData = this.resolveTab(source);
        const targetTabData = this.resolveTab(target);
        if (sourceTabData === null) return null;
        if (!sourceTabData || !targetTabData) return null;

        this.insertBefore(sourceTabData.view, targetTabData.view);
        headersContainer.insertBefore(sourceTabData.tab, targetTabData.tab);

        this.updateCurrentTab();

        return sourceTabData;
    }

    private updateCurrentTab() {
        if (this.currentTab) {
            this.currentTab = this.resolveTab(this.currentTab.view);
        }
    }

    // Getters/Setters
    get items(): OhaeTabItemViewOld[] {
        const children = Array.from(this.children) as OhaeTabItemViewOld[];
        return children;
    }

    get tabs(): OhaeTabItemButtonView[] {
        const headersContainer = this.shadowRoot!.querySelector('.header');
        if (!headersContainer) return [];

        const children = Array.from(headersContainer.children) as OhaeTabItemButtonView[];
        return children;
    }

    get tabsSide(): Side {
        const value = this.getAttribute('tabsSide');
        return OhaeTabItemButtonView.getSide(value);
    }
    set tabsSide(value: Side | null) {
        value = OhaeTabItemButtonView.getSide(value)
        this.setAttribute('tabsSide', value);
        this.tabs.forEach(tab => tab.side = value);
    }


    get tabsHeight(): string | null {
        return this.getAttribute('tabsHeight');
    }
    set tabsHeight(value: string | number | null) {
        if (value === null) return;
        const parsedValue = this.parseSizeValue(value);
        this.setAttribute('tabsHeight', parsedValue);
    }

    get tabsWidth(): string | null {
        return this.getAttribute('tabsWidth');
    }
    set tabsWidth(value: string | number | null) {
        if (value === null) return;
        const parsedValue = this.parseSizeValue(value);
        this.setAttribute('tabsWidth', parsedValue);
    }

    get allowHideAll(): boolean {
        return this.getAttribute('allowHideAll') === 'true';
    };
    set allowHideAll(value: boolean | string | null) {
        value = value === true || value === 'true';

        if (value) {
            this.setAttribute('allowHideAll', value.toString());
        } else {
            this.removeAttribute('allowHideAll');
        }
    }

    set tabButtonBackground(value: string | Color | null){
		if(!value) return;
		const color = typeof value === 'string' ? new Color(value) : value;
        // const color = new Color("#433");
        this.setAttribute('tabButtonBackground', color.hex)
	}

	get tabButtonBackground(): Color | null{
        const tabBgColor = this.getAttribute('tabButtonBackground');
        return tabBgColor ? new Color( tabBgColor) : null;
	}
}

customElements.define('ohae-tabs-old', OhaeTabsView);

export type Side = 'top' | 'bottom' | 'left' | 'right';

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        allowHideAll?: string | boolean;
        tabsSide?: Side;
        tabsHeight?: string | number;
        tabsWidth?: string | number;
        tabButtonBackground?: string;
    }
}
