import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseView } from "../base_view/OhaeBaseView";
import { IOhaeViewOptions } from "../../OhaeViewOptions";
import { Color } from "../../utils/Color";

export class OhaeIconOfTypeView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
        'value',
        'color',
    ];

    protected static readonly STYLES: string = `
        <style>
            :host {
                display: inline-flex;
                width: 16px;
                height: 16px;
                margin: 0;
                padding: 0;
                cursor: pointer;
                background: transparent !important;
                align-items: center;
                justify-content: center;
            }
            .icon {
                font-size: 100%;
                transition: opacity 0.2s;
            }
            .icon:hover {
                opacity: 0.8;
            }
        </style>
    ` + this.FONT_AVESOME;

    // protected static readonly HTML: string = ``;
    protected static readonly HTML: string = `
        <slot><span id='icon' class='icon fa fa-question-circle'></span></slot>
    `;

    private iconElement?: HTMLElement;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    // protected async connectedCallback() {
	// 	await super.connectedCallback();
	// 	// this.markAsReady();
    // }

    protected override async createCallback() {
        await super.createCallback();
        // await this.waitForShadowRoot();
        this.applyAttributes(OhaeIconOfTypeView.ATTRIBUTES);
        this.iconElement = this.shadowRoot!.querySelector('span') as HTMLElement;
        this.updateIcon();
    }

    protected async render() {
		const staticThis = (this.constructor as typeof OhaeBaseView);
		this.shadowRoot!.innerHTML = staticThis.STYLES + staticThis.HTML;
	}

    private async getIcon(): Promise<IconOfTypeData | null> {
        if(!this.value) return null;
        const data = this.initData.types?.[this.value];
        if(!data) return null;
        
        return {
            ...data,
            color: new Color(data.color).hex
        };
    }

    private async updateIcon() {
        if (!this.iconElement) return;
        const data = await this.getIcon();
        this.iconElement.className = 'icon' +  (data ? ' fa ' + data.icon : '');
        this.iconElement.style.color = (data ? this.color?.rgba ?? data.color ?? "#ddd" : "#0000");
        // this.className = 'icon' +  (data ? ' fa ' + data.icon : '');
        // this.style.color = (data ? this.color?.rgba ?? data.color ?? "#ddd" : "#0000");
    }

    get color(): Color | null {
        const color = this.getAttribute('color');
        if (!color) return null;
        return new Color(color);
    }
    set color(value: string | Color | null) {
        if (!value) return;
        const color = typeof value === 'string' ? new Color(value) : value;
        this.setAttribute('color', color.hex);
        this.updateIcon();
    }

	get value(): string | null {
        return this.getAttribute('value');
    }
	set value(value: string | null) {
        if(value){
            this.setAttribute('value', value.toString());
        }else{
            this.removeAttribute('value')
        }
        this.updateIcon();
    }

}


OhaeUI.registerViewType('icon-of-type', OhaeIconOfTypeView);

type IconOfTypeData = Record<string, string>;
// Обновляем типы для OhaeViewOptions
declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        value?: string | number | boolean | undefined;
        color?: string;
        types?: Record<string, IconOfTypeData>;
    }
}