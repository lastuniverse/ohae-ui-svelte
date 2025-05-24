import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseView } from "../base_view/OhaeBaseView";

export class OhaeBaseInputView extends OhaeBaseView {
	public static readonly ATTRIBUTES: string[] = [
		'value',		
		'name',
		'separator',
		'label',
		'inputWidth',
		'disabled',
		'readonly',
		'required',
		'reverse',
	];

	protected static readonly STYLES: string = `
	<style>
		:host {
			display: flex;
			min-height: 26px;
			max-height: 26px;
			padding: 0px;
			margin: 0px;
			overflow: hidden;
		}
		.input-wrapper {
			margin: 3px 3px;
			display: flex;
			width: 100%;
		}
		.input-box {
			display: flex;
			height: 100%;
			--input-width: 200px;
			width: var(--input-width);
			min-width: var(--input-width);
			max-width: var(--input-width);
			padding: 0px;
			margin: 0px;
			justify-content: right;
			align-items: center;
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
		input {
			color: #aab;
			outline: 0;
			background-color: #3d3d3d;
			/* box-shadow: inset 1px 1px 12px rgba(0, 0, 0, 0.2); */
			border: solid #282828 1px;
			border-radius: 3px;
			margin: 0px;
			padding: 0px 0px;
			width: 100%;
			height: 100%;
		}
		input:focus, input:active {
			border: solid rgb(65, 94, 156) 1px;
			box-shadow: none;
			/* outline: none; */ /* Убирает стандартное выделение */
		}
		input:disabled {
			background-color: #444;
			border: solid #383838 1px;
			color: #777;
			box-shadow: none;
		}

/*********** Baseline, reset styles ***********/
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  border: none;
  /* width: 90px; */
}

/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/******** Chrome, Safari, Opera and Edge Chromium styles ********/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: #415e9c;
  border-radius: 0.5rem;
  height: 0.3rem;
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -5.6px; /* Centers thumb on the track */
  background-color: rgb(170,170,170);
  border-radius: 0.5rem;
  height: 1rem;
  width: 1rem;
}

input[type="range"]:focus::-webkit-slider-thumb {
  outline: 0
}

/*********** Firefox styles ***********/
/* slider track */
input[type="range"]::-moz-range-track {
  background-color: #415e9c;
  border-radius: 0.5rem;
  height: 0.3rem;
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  background-color: #899fd2;
  border: none;
  border-radius: 0.5rem;
  height: 1rem;
  width: 1rem;
}

input[type="range"]:focus::-moz-range-thumb{
  outline: 0;
}

		/* Основной стиль контейнера */
		.input-container {
			display: inline-flex;
			position: relative;

			/* display: flex; */
			align-items: center;
			text-align: justify;
			flex: 1 0;
			padding: 0px;
			margin: 0px;

			justify-content: right;
			height: 100%;


		}

		/* Чекбокс скрываем */
		.input-container input[type="checkbox"], .input-container input[type="radio"] {
			display: none;
		}

		/* Стиль переключателя */
		.switch {
			display: none; /* По умолчанию скрыт */
			width: 50px;
			height: 20px;
			background: #3d3d3d;
			border-radius: 21px;
			position: relative;
			cursor: pointer;
			transition: background 0.3s;
			border: solid #282828 1px;
		}

		/* Ползунок */
		.switch::before {
			content: "";
			position: absolute;
			width: 15px;
			height: 15px;
			background: #aaa;
			border-radius: 50%;
			top: 50%;
			left: 3px;
			transform: translateY(-50%);
			transition: left 0.3s;
		}

		/* Активный переключатель */
		.input-container input[type="checkbox"]:checked + .switch {
			/* background: rgb(65, 94, 156) */
			background: rgb(65, 94, 156);
		}
		.input-container input[type="radio"]:checked + .switch {
			/* background:rgb(65, 94, 156);*/
			background: #3f4760;
		}

		.input-container input[type="checkbox"]:checked + .switch::before, .input-container input[type="radio"]:checked + .switch::before {
			left: 31px;
		}

		/* Когда input становится checkbox, показываем switch */
		.input-container input[type="checkbox"] + .switch, .input-container input[type="radio"] + .switch {
			display: inline-block;
		}
		
		.input-label {
			padding: 0px;
			margin: 0px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		:host(:not([reverse])) .input-label{
			/* justify-content: right; */
		}
		:host([reverse]) .input-label{
			/* justify-content: right; */
		}

		.input-wrapper {
			flex-direction: row;
		}
		:host([reverse]) .input-wrapper {
			flex-direction: row-reverse;
		}


	</style>
	<!--link rel="stylesheet" href="./external.css"-->
	<!--link rel="stylesheet" href="./index.input.css"-->
	`;

	// if (value === true) {
	// 	this.inputWrapperView.style.setProperty('flex-direction', 'row-reverse');
	// 	this.inputBoxView.style.setProperty('justify-content', 'left');
	// 	// this.labelView.style.setProperty('justify-content', 'right');
	// } else {
	// 	this.inputWrapperView.style.setProperty('flex-direction', 'row');
	// 	this.inputBoxView.style.setProperty('justify-content', 'right');
	// 	// this.labelView.style.setProperty('justify-content', 'left');
	// }


	protected static readonly HTML: string = `
		<div class="input-wrapper">
			<div class="input-box">
				<label class="input-container">
					<input class="input" />
					<span class="switch"></span>
				</label>				
			</div>
			<div class="input-separator"></div>
			<label class="input-label"></label>
		</div>
	`;
	protected oldValue: any;


	protected override async createCallback() {
		await super.createCallback();
		this.applyAttributes(OhaeBaseInputView.ATTRIBUTES);
		this.oldValue = this.value;
	}

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.ATTRIBUTES];
	}

	protected get inputWrapperView(): HTMLDivElement {
		return this.shadowRoot?.querySelector('.input-wrapper') as HTMLDivElement;
	}

	protected get inputBoxView(): HTMLDivElement {
		return this.shadowRoot?.querySelector('.input-box') as HTMLDivElement;
	}

	protected get inputView(): HTMLInputElement {
		return this.shadowRoot?.querySelector('input') as HTMLInputElement;
	}

	protected get separatorView(): HTMLDivElement {
		return this.shadowRoot?.querySelector('.input-separator') as HTMLDivElement;
	}

	protected get labelView(): HTMLLabelElement {
		return this.shadowRoot?.querySelector('.input-label') as HTMLLabelElement;
	}


	private static readonly inputListeners: string[] = ['change'];
	public override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void{
		if(OhaeBaseInputView.inputListeners.includes(type)){
			this.inputView.addEventListener(type, (e)=>{
				e.stopPropagation();
				this.modifyInputEvent(e as InputEvent);
			});
		}
		super.addEventListener(type, listener, options);
	}
	
	private modifyInputEvent(originalEvent: InputEvent): void {
		if(this.oldValue === this.value) return;
		const detail = {
			originalEvent,
			newValue: this.value,
			oldValue: this.oldValue,
		};
		const event = new CustomEvent(originalEvent.type, {
			bubbles: true, // Событие всплывает до родительских элементов
			composed: true, // Событие пересекает границы Shadow DOM
			detail,
		});

		this.dispatchEvent(event);
		if(originalEvent.type === 'change')	this.oldValue = this.value;
	}


	get value(): string | number | boolean {
		return this.inputView?.value;
	}
	set value(value: string | number | boolean | null) {
		if (value === null) return;
		this.setAttribute('value', value.toString());
		const view = this.inputView;
		if (view) view.value = value.toString();
	}

	get name(): string | null {
		return this.getAttribute('name');
	}
	set name(value: string | null) {
		if (value === null) {
			this.removeAttribute('name');
			this.inputView?.removeAttribute('name');
		} else {
			this.setAttribute('name', value);
			this.inputView?.setAttribute('name', value);
		}
	}

	get separator(): string {
		return this.separatorView?.innerText || '💥'; //'●';
	}
	set separator(value: string | null) {
		if (value === null) return;
		this.setAttribute('separator', value);

		const view = this.separatorView;
		if (view) view.innerText = value;
	}

	get label(): string | null {
		return this.getAttribute('label');
	}
	set label(value: string | null) {
		if (value === null) return;
		this.setAttribute('label', value);

		const view = this.labelView;
		if (view) view.innerText = value;
	}

	get inputWidth(): string | null {
		return this.getAttribute('inputWidth');
	}
	set inputWidth(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('inputWidth', parsedValue);
		this.inputBoxView?.style.setProperty('--input-width', parsedValue);
	}

	get disabled(): boolean {
		return this.getAttribute('disabled') === 'true';
	};
	set disabled(value: boolean | string | null) {
		this.setBooleanAttribute('disabled', value);
		this.setBooleanAttribute('disabled', value, this.inputView);
	}

	get readonly(): boolean {
		return this.getAttribute('readonly') === 'true';
	};
	set readonly(value: boolean | string | null) {
		value = this.setBooleanAttribute('readonly', value);
		const view = this.inputView;
		if ((view as any)?.readOnly) (view as any).readOnly = value;
	}

	get required(): boolean {
		return this.getAttribute('required') === 'true';
	};
	set required(value: boolean | string | null) {
		value = this.setBooleanAttribute('required', value);
		const view = this.separatorView;
		if (!view) return;
		view.innerText = value ? this.separator : '';
	}

	get reverse(): boolean {
		return this.getAttribute('reverse') === 'true';
	};
	set reverse(value: boolean | string | null) {
		value = this.setBooleanAttribute('reverse', value);
		if (!this.inputBoxView || !this.labelView || !this.inputWrapperView) return;
		// if (value === true) {
		// 	this.inputWrapperView.style.setProperty('flex-direction', 'row-reverse');
		// 	this.inputBoxView.style.setProperty('justify-content', 'left');
		// 	// this.labelView.style.setProperty('justify-content', 'right');
		// } else {
		// 	this.inputWrapperView.style.setProperty('flex-direction', 'row');
		// 	this.inputBoxView.style.setProperty('justify-content', 'right');
		// 	// this.labelView.style.setProperty('justify-content', 'left');
		// }
	}
}

OhaeUI.registerViewType('base-input', OhaeBaseInputView);


declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
		name?: string;
		separator?: string;
		label?: string;
		inputWidth?: string | number;
		disabled?: string | boolean;
		readonly?: string | boolean;
		required?: string | boolean;
		reverse?: string | boolean;
    }
}
