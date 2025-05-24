import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseView } from "../base_view/OhaeBaseView";
import { IOhaeViewOptions } from "../../OhaeViewOptions";
import { Color } from "../../utils/Color";

export class OhaeIconCheckboxView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
        'name',
        'checked',
        'color',
        'openIcon',
        'closeIcon',
        'value'
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
                font-size: 80%;
                transition: opacity 0.2s;
            }
            .icon:hover {
                opacity: 0.8;
            }
        </style>
    ` + this.FONT_AVESOME;

    protected static readonly HTML: string = `
        <slot><span id='icon' class='icon fa fa-check'></span></slot>
    `;

    private iconElement?: HTMLElement;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    protected override async createCallback() {
        await super.createCallback();
        this.iconElement = this.shadowRoot?.querySelector('.icon') as HTMLElement;
        this.addEventListener('click', this.toggleCheck.bind(this));
        this.applyAttributes(OhaeIconCheckboxView.ATTRIBUTES);
        this.updateIcon();
    }

    private toggleCheck() {
        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true
        }));
    }

    private updateIcon() {
        if (!this.iconElement) return;
        this.iconElement.className = `icon fa ${this.checked ? this.openIcon : this.closeIcon}`;
        this.iconElement.style.color = (this.checked ? this.color?.rgba : this.color?.opacity(0.4).rgba) ?? "#fff";
    }

    // Properties
    get name(): string {
        return this.getAttribute('name') || '';
    }
    set name(value: string) {
        this.setAttribute('name', value);
    }

    get checked(): boolean {
        return this.getAttribute('checked') === 'true';
    }
	set checked(value: boolean | string | null) {
		value = value === true || value === 'true';
		if (value) {
			this.setAttribute('checked', value.toString());
		} else {
			this.removeAttribute('checked');
		}
        this.updateIcon();
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

    get openIcon(): string {
        return this.getAttribute('openIcon') || 'fa-check-square';
    }
    set openIcon(value: string) {
        this.setAttribute('openIcon', value);
        this.updateIcon();
    }

    get closeIcon(): string {
        return this.getAttribute('closeIcon') || 'fa-square';
    }
    set closeIcon(value: string) {
        this.setAttribute('closeIcon', value);
        this.updateIcon();
    }

	get value(): boolean {
        return this.checked;
    }
	set value(value: string | boolean | null) {
        this.checked = value;
	}

}


OhaeUI.registerViewType('icon-checkbox', OhaeIconCheckboxView);

// Обновляем типы для OhaeViewOptions
declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        openIcon?: string;
        closeIcon?: string;
        color?: string;
    }
}