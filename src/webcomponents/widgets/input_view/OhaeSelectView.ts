import { OhaeUI } from "../../OhaeUI";
import { SizeNumber } from "../../utils/SizeNumber";
import { OhaeBaseInputView } from "./OhaeBaseInputView";

export class OhaeSelectView extends OhaeBaseInputView {
    public static readonly ATTRIBUTES: string[] = [
		'multiple',
		'lines',
		'options', 
		'value'
    ];

    protected static readonly STYLES: string = `
    <style>
		:host {
			display: flex;
			width: 100%;
			padding: 0px;
			/* min-height: 26px; */
			margin: 0px;
			overflow: hidden;
		}

		.input-wrapper {
			margin: 3px 3px;
			display: flex;
			width: 100%;
		}
		.input-wrapper {
			flex-direction: row;
		}
		:host([reverse]) .input-wrapper {
			flex-direction: row-reverse;
		}

		.input-box {
			display: flex;
			--input-width: 200px;
			width: var(--input-width);
			min-width: var(--input-width);
			max-width: var(--input-width);
			padding: 0px;
			margin: 0px;
			justify-content: right;
		}

		.input-separator {
			display: flex;
			align-items: center;
			min-width: 10px;
			max-width: 10px;
			margin: 0px 5px;
			flex-basis: 10px;
			font-size: 8px;
			color: #ab6161;
		}

		.input-label {
			/* display: flex; */
			/* align-items: center; */
			padding: 0px;
			margin: 0px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
			
		:host([lines]) .input-label, :host([multiple]) .input-label{
			white-space: wrap;
		}

		option, option:default {
			color: #aaa;
		}

		option:checked, option:active:checked {
			background-color: #415e9c;
			color: #999;
		}

		select {
			color: #aab;
			outline: 0;
			background-color: #3d3d3d;
			/* box-shadow: inset 1px 1px 12px rgba(0, 0, 0, 0.2); */
			border: solid #282828 1px;
			border-radius: 3px;
			width: 100%;
			margin: 0px;
			padding: 0px 0px;
			/* appearance: none; */
			/* -webkit-appearance: none; */
			/* -moz-appearance: none; */
			height: auto;
		}

		select[size] {
			height: auto;
		}

		select:focus, select:active {
			border: solid #415e9c 1px;
			box-shadow: none;
		}

		select:disabled {
			background-color: #444;
			border: solid #383838 1px;
			color: #777;
			box-shadow: none;
		}
    </style>
	<link rel="stylesheet" href="./external.css">
    `;
	// <link rel="stylesheet" href="./external.css">
	// <link rel="stylesheet" href="./index.input.css">

    protected static readonly HTML: string = `
        <div class="input-wrapper">
            <div class="input-box">
                <select class="input"></select>
            </div>
            <div class="input-separator"></div>
            <label class="input-label"></label>
        </div>
    `;

	protected override async createCallback() {
        await super.createCallback();
		this.setOptions(this.initData.options);
		this.applyAttributes(OhaeSelectView.ATTRIBUTES);
    }

	static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    protected get inputView(): HTMLInputElement {
		return this.shadowRoot?.querySelector('select') as any as HTMLInputElement;
	}

    protected get selectView(): HTMLSelectElement {
		return this.shadowRoot?.querySelector('select') as HTMLSelectElement;
	}

    public setOptions(list: SelectOptions = []) {
		// console.log('select options', list);
        const select = this.shadowRoot?.querySelector('select') as HTMLSelectElement;
        list.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.value.toString();
            option.label = item.label;
            option.selected = item.selected || false;
            select.appendChild(option);
			// console.log('select options item', item, option, select);
        });
    }

    public setValues(list: string[] | string) {
		// console.log('setValues', 0, list);
        if (!Array.isArray(list)) list = list.toString().split(',');
		// console.log('setValues', 1, list);
        list = list.map((item) => item.toString());
		// console.log('setValues', 2, list);
		if(!this.selectView) return;
        for (const option of this.selectView.options) {
			// console.log('setValues', 3, option);
			const options = list.includes(option.value);
			// console.log('setValues', 4, options);
            option.selected = list.includes(option.value);
        }
    }

    public getValues(): string[] {
        const selected: string[] = [];
        for (const option of this.selectView.options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        return selected;
    }

	get value(): any {
		return this.getValues();
	}
	set value(value: string | number | boolean | string[]) {
		if (Array.isArray(value)) {
			this.setValues(value);
		} else {
			this.setValues(value.toString().split(','));
		}
	}

	get multiple(): boolean {
		return this.getAttribute('multiple') === "true";
	}
	set multiple(value: boolean | string | number | null) {
		const isTrueNumberAsString = typeof value === 'string' && parseFloat(value) > 0;
		const isTrueNumber = typeof value === 'number' && value > 0;
		const isEnable = value === true || value === "true" || isTrueNumber || isTrueNumberAsString;
		this.setBooleanAttribute('multiple', isEnable);
		this.setBooleanAttribute('multiple', isEnable, this.selectView);
		// const view = this.selectView;
		// if (isEnable) {
		// 	view?.setAttribute('multiple', isEnable.toString());
		// } else {
		// 	view?.removeAttribute('multiple');
		// }

		if(isTrueNumber || isTrueNumberAsString){
			this.lines = value;
		}
	}

	get lines(): number | null {
		const value = this.getAttribute('lines');
		if(value === null) return null;
		const number = new SizeNumber(value);
		return number.toNumber();
	}
	set lines(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseNumberValue(value);
		const view = this.selectView;
		this.setAttribute('lines', parsedValue);
		view?.setAttribute('size', parsedValue);
		// view?.setAttribute('lines', parsedValue);
	}

	get options(): { value: string, label: string, selected?: boolean }[] {
		return Array.from(this.selectView.options).map(option => ({
			value: option.value,
			label: option.label,
			selected: option.selected
		}));
	}
	set options(value: { value: string, label: string, selected?: boolean }[]| null) {
		if (value === null) return;
		this.setOptions(value);
	}
}

OhaeUI.registerViewType('select', OhaeSelectView);

type SelectOptions = { value: string | number, label: string, selected?: boolean }[];
// Array<{value: string | number; label: string}>

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
		multiple?: boolean | string | number;
		lines?: string | number;
		options?: SelectOptions;
		value?: boolean | string | number;
    }
}
