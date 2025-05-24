import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeAccordionView } from "./OhaeAccordionView";

export class OhaeAccordionItemView extends OhaeLayoutView {
    public static readonly ATTRIBUTES: string[] = [
        'collapsed',
        'header',
        'openIcon',
        'closeIcon',
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            background-color: var(--host-bg, transparent);
            border-radius: 4px;
            padding: 0px;
            margin: 0px;
        }

        :host([backgroundColor]) {
            border: 1px solid var(--host-border, #404040);
            color: var(--host-color, #ddd);
        }

        .header {
            display: flex;
            align-items: center;
            height: 24px; /* 28px; */
            background-color: var(--host-bg, #404040);
            overflow: hidden;
            color: #ссс;
            border-radius: 4px 4px 0 0;
            justify-content: space-between;
            padding: 0px 10px;
            /*cursor: pointer;*/
            font-weight: 500;
            margin: 0;
        }

        :host([parentdirection="cols"]:not([collapsed])) {
            margin: 0 0 0 1px;
        }

        :host([collapsed]) .header {
            border-radius: 4px;
            margin: 0 0 1px 0 ;
        }

        :host([parentdirection="cols"][collapsed]) .header {
            flex-direction: column-reverse;
            justify-content: flex-start;
            align-items: center;
            padding: 4px 0;
            height: 100%;
            width: 24px; /* 28px; */
            margin: 0 0 0 1px;
            display: flex; /* --- */ /*???*/
        }

        :host([parentdirection="cols"]:not([collapsed])) .header {
            min-height: 24px;
        }

        .header-body {
			white-space: nowrap;
			height: auto;
			width: auto;
			/* cursor: default; */
			user-select: none;
			
		}

        :host([parentdirection="cols"]:not([collapsed])) .header-body,
		:host([parentdirection="rows"]) .header-body {
			overflow: hidden;
			text-overflow: ellipsis;
		}

		:host([parentdirection="cols"][collapsed]) .header-body {
			display:  flex;
			flex: 1;
			text-align: center;
			justify-content: center;
		}


        :host([parentdirection="cols"][collapsed]) .header-body {
            transform-origin: top left;
            transform:  translateY(50%) rotate(-90deg);
            display: flex;
            flex: 1; /* --- */
            width: 100%; /* --- */
            height: 24px; /* 28px; */ /* Высота теперь фиксированная, т.к. он повёрнут */
            align-items: flex-start;
            justify-content: center;
        }

        .body {
            background-color: var(--host-bg, #404040);
            display: flex;
            flex-direction: column;
            padding: 0px 5px 5px 5px;
            margin: 0 0 1px 0 ;
            border-radius: 0 0 4px 4px;
            height: 100%;
            user-select: none;
        }
        .collapse {
            display: none;
        }

        #icon-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 16px;
            height: 20px;
            flex-shrink: 0;
            position: relative;
        }
        #icon {
            font-size: 14px; 
        }
        .icon-move {
            cursor: grabbing; /* move; */
        }
    </style>
    ` + this.FONT_AVESOME;
    protected static readonly ICON_OPEN: string = 'fa-angle-right'; // fa-chevron-right
    protected static readonly ICON_CLOSE: string = 'fa-angle-down'; // fa-chevron-down
    protected static readonly ICON_MOVE: string = 'fa-ellipsis-h'; // fa-ellipsis-h

    protected static readonly HTML: string = `
        <div class="header">
            <span id='icon-wrapper'><span id='icon' class='icon fa ${this.ICON_CLOSE}'></span></span>
            <div class="header-body"></div>
            <span id='icon-wrapper'><span id='icon-move' class='icon-move fa ${this.ICON_MOVE}'></span></span>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    `;
    private iconElement?: HTMLElement;
    private moveIconElement?: HTMLElement;

    protected override async createCallback() {
        await super.createCallback();
        this.iconElement = this.shadowRoot?.querySelector('.icon') as HTMLElement;
        this.applyAttributes(OhaeAccordionItemView.ATTRIBUTES);
        this.backgroundColor = this.backgroundColor ?? "#444";

        const header = this.shadowRoot?.querySelector('.header') as HTMLElement;
        if (header) {
            header.addEventListener('click', this.toggleCollapse.bind(this) as EventListener);
        }

        this.moveIconElement = this.shadowRoot?.querySelector('#icon-move') as HTMLElement;
        
        this.updateIcon();
        this.updateEnableDragging();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    private updateEnableDragging(): void {
        this.moveIconElement?.removeEventListener('mousedown', this.handleDragIconStart as EventListener);
        this.moveIconElement?.removeEventListener('mouseup', this.handleDragIconEnd as EventListener);
        const enableDragging = true; //this.enableDragging;
        if(enableDragging){
            this.moveIconElement?.addEventListener('mousedown', this.handleDragIconStart as EventListener);
            this.moveIconElement?.addEventListener('mouseup', this.handleDragIconEnd as EventListener);
        }
    }

    private handleDragIconStart = (event: Event)=>{
        this.draggable = true;
        this.addEventListener('dragstart', this.handleDragStart as EventListener);
        this.addEventListener('dragend', this.handleDragEnd as EventListener);
    }

    private handleDragIconEnd = (event: Event)=>{
        this.draggable = false;
        this.removeEventListener('dragstart', this.handleDragStart as EventListener);
        this.removeEventListener('dragend', this.handleDragEnd as EventListener);
    }

    private handleDragStart(event: DragEvent) {
        event.stopPropagation();
        
        this.style.opacity = '0.4';

        // const accordion = this.closest('ohae-accordion-view') as OhaeAccordionView | null;
        const accordion = this.parentElement as OhaeAccordionView;
        if (accordion) {
            accordion.draggedSection = this;
        }

        // Создаем прозрачную картинку 1x1
        const emptyImage = new Image();
        emptyImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==';
        event.dataTransfer?.setDragImage(emptyImage, 0, 0);
    }
    
    private handleDragEnd() {
        this.draggable = false;
        this.style.opacity = '';
    }

    private toggleCollapse() {
        this.collapsed = !this.collapsed;

        // Генерация события section-toggle
        const event = new CustomEvent('section-toggle', {
            bubbles: true, // Событие всплывает до родительских элементов
            composed: true, // Событие пересекает границы Shadow DOM
            detail: { section: this, collapsed: this.collapsed },
        });
        this.dispatchEvent(event);
    }

    private updateIcon() {
        if (!this.iconElement) return;
        this.iconElement.className = `icon fa ${this.collapsed ? this.openIcon : this.closeIcon}`;
        //this.iconElement.style.color = (this.collapsed ? this.color?.rgba : this.color?.brightness(0.7).rgba) ?? "#fff";
    }

    get collapsed(): boolean {
        return this.getAttribute('collapsed') === 'true';
    };
    set collapsed(value: boolean | string | null) {
        value = this.setBooleanAttribute('collapsed', value);
        const body = this.shadowRoot?.querySelector('.body') as HTMLElement;
        if (value) {
            body?.classList.add('collapse');
        } else {
            body?.classList.remove('collapse');
        }
        this.updateIcon();
    }

    get header(): string {
        const headerBody = this.shadowRoot?.querySelector('.header-body') as HTMLElement;
        return headerBody?.innerText ?? '';
    }
    set header(value: string) {
        const headerBody = this.shadowRoot?.querySelector('.header-body') as HTMLElement;
        if (headerBody) {
            headerBody.innerText = value ?? '';
        }
    }

    get openIcon(): string {
        return this.getAttribute('openIcon') || OhaeAccordionItemView.ICON_OPEN;
    }
    set openIcon(value: string) {
        this.setAttribute('openIcon', value);
        this.updateIcon();
    }

    get closeIcon(): string {
        return this.getAttribute('closeIcon') || OhaeAccordionItemView.ICON_CLOSE;
    }
    set closeIcon(value: string) {
        this.setAttribute('closeIcon', value);
        this.updateIcon();
    }

}

OhaeUI.registerViewType('accordion-item', OhaeAccordionItemView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        collapsed?: string | boolean;
        header?: string;
        openIcon?: string;
        closeIcon?: string;
    }
}
