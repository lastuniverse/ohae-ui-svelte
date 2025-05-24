import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseView } from "../base_view/OhaeBaseView";
import { IOhaeViewOptions } from "../../OhaeViewOptions";
import { Color } from "../../utils/Color";

export class OhaeIconSelectView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
        'name',
        'value',
        'icon',
        'color',
        'options'
    ];

    protected static readonly STYLES: string = `
        <style>
            :host {
                display: inline-flex;
                align-items: center;
                height: 24px;
                background: transparent !important;
                position: relative;
                min-width: 100px;
            }
            .container {
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;
                gap: 6px;
            }
            .icon{
                border: none;
                font-size: 16px;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .icon:not(.fa) {
                display: none;
            }

            select {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: inherit;
                font-family: inherit;
                font-size: 100%;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                cursor: pointer;
            }
            select::-ms-expand {
                display: none;
            }
            select option {
                background: var(--host-bg, #333);
                color: var(--host-color, #aaa);
            }
        </style>
    ` + this.FONT_AVESOME;

    protected static readonly HTML: string = `
    <slot>
        <div class="container">
            <label class="icon" for="select"></label>
            <select class="select" id="select"></select>
        </div>
    </slot>
    `;

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    protected get inputView(): HTMLInputElement {
		return this.shadowRoot?.querySelector('select') as any as HTMLInputElement;
	}

    protected get selectView(): HTMLSelectElement {
		return this.shadowRoot?.querySelector('select') as HTMLSelectElement;
	}

    protected get iconView(): HTMLElement {
		return this.shadowRoot?.querySelector('.icon') as HTMLElement;
	}

    protected override async createCallback() {
        await super.createCallback();
        this.setOptions(this.initData.options);
        this.applyAttributes(OhaeIconSelectView.ATTRIBUTES);
        // this.updateOptions();
        this.updateIcon();
        this.selectView.addEventListener('change', () => this.handleChange());

    }

    private handleChange() {
        const selectView = this.selectView;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { 
                value: selectView.value,
                selectedIndex: selectView.selectedIndex 
            },
            bubbles: true,
            composed: true
        }));
    }

    private updateOptions() {
        this.selectView.innerHTML = '';
        this.setOptions(this.options || []);
    }

    public setOptions(list: SelectOptions = []) {
        const select = this.shadowRoot?.querySelector('select') as HTMLSelectElement;
        list.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.value.toString();
            option.label = item.label;
            // option.textContent = item.label;
            option.selected = item.selected || false;
            select.appendChild(option);
        });
    }

    public setValues(list: string[] | string) {
        if (!Array.isArray(list)) list = list.toString().split(',');
        list = list.map((item) => item.toString());
        const selectView = this.selectView;
		if(!selectView) return;
        for (const option of selectView.options) {
			const options = list.includes(option.value);
            option.selected = list.includes(option.value);
        }
    }

    public getValues(): string[] {
        const selected: string[] = [];
        const selectView = this.selectView;
        for (const option of selectView.options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        return selected;
    }

    private updateIcon() {
        const iconView = this.iconView;
        if (!iconView) return;
        iconView.className = 'icon' + (this.icon ? ` fa ${this.icon}` : '');
        iconView.style.color = this.color?.rgba ?? "#fff";
    }

    get name(): string {
        return this.getAttribute('name') || '';
    }
    set name(value: string) {
        this.setAttribute('name', value);
        const selectView = this.selectView;
        if(!selectView) return
        selectView.name = value;
    }

    get value(): string {
        return this.getValues()?.[0];
    }
    set value(value: string) {
        this.setValues(value);
    }

    get icon(): string | null{
        return this.getAttribute('icon');
    }
    set icon(value: string) {
        if(value){
            this.setAttribute('icon', value);
        } else{
            this.removeAttribute('icon');
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

    get options(): Array<{value: string; label: string}> {
		return Array.from(this.selectView.options).map(option => ({
			value: option.value,
			label: option.label,
			selected: option.selected
		}));
    }
    set options(value: Array<{value: string; label: string, selected?: boolean}>) {
		if (value === null) return;
		this.setOptions(value);
  		// this.updateOptions();

    }
}

OhaeUI.registerViewType('icon-select', OhaeIconSelectView);

type SelectOptions = { value: string | number, label: string, selected?: boolean }[];

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        icon?: string;
		color?: string;
        options?: SelectOptions;
    }
}
