import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseInputView } from "./OhaeBaseInputView";

export class OhaeInputView extends OhaeBaseInputView {
	public static readonly ATTRIBUTES: string[] = [
		// 'value',
		'type',
		'alt',
		'src',
		'pattern',
		'max',
		'min',
		'step',
		'minlength',
		'maxLength',
		'size',
		'placeholder',
		'accept',
		'checked',
	];
	// protected oldValue: any;

	protected override async createCallback() {
		await super.createCallback();
		this.applyAttributes(OhaeInputView.ATTRIBUTES);
		this.oldValue = this.value;
	}

	private get isCheckableValue(): boolean {
		const type = this.type;
		return type === 'checkbox' || type === 'radio';
	}

	private get isNumericValue(): boolean {
		const type = this.type;
		return type === 'number' || type === 'range';
	}
	
	// @BindState('ui.inputs.textValue')
	get value(): string | number | boolean {
		if (this.isCheckableValue) {
			return this.checked;
		} else if (this.isNumericValue) {
			return parseFloat(this.inputView?.value);
		} else {
			return this.inputView?.value;
		}
	}
	set value(value: string | number | boolean | null) {
		if (value === null) return;
		this.setAttribute('value', value.toString());
		const view = this.inputView;
		if (this.isCheckableValue) {
			this.checked = value === true || value === 'true';
		} else if (this.isNumericValue) {
			if (view) view.value = value.toString();
		} else {
			if (view) view.value = value.toString();
		}
	}
    // @Action('ui.actions.lastInput')
    // protected override modifyInputEvent(event: InputEvent) {
    //     const value = super.modifyInputEvent(event);
    //     return value;
    // }

    // // Автоматическая синхронизация при изменении состояния
    // async attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    //     super.attributeChangedCallback(name, oldVal, newVal);
    //     if (name === 'value') {
    //         const state = await StateConnector['statePromises'].get(this);
    //         state.setValue('ui.inputs.textValue', newVal);
    //     }
    // }



	get type(): string | null {
		return this.getAttribute('type');
	}
	set type(value: string | null) {
		if (value !== null) {
			this.setAttribute('type', value);
			this.inputView?.setAttribute('type', value);
		} else {
			this.removeAttribute('type');
			this.inputView?.removeAttribute('type');
		}
	}

	get pattern(): string | null {
		return this.getAttribute('pattern');
	}
	set pattern(value: string | null) {
		if (value !== null) {
			this.setAttribute('pattern', value);
			this.inputView?.setAttribute('pattern', value);
		} else {
			this.removeAttribute('pattern');
			this.inputView.removeAttribute('pattern');
		}
	}

	get placeholder(): string | null {
		return this.getAttribute('placeholder');
	}
	set placeholder(value: string | null) {
		if (value !== null) {
			this.setAttribute('placeholder', value);
			this.inputView?.setAttribute('placeholder', value);
		} else {
			this.removeAttribute('placeholder');
			this.inputView?.removeAttribute('placeholder');
		}
	}

	get min(): number | null {
		const min = this.getAttribute('min');
		return min ? parseFloat(min) : null;
	}
	set min(value: number | null) {
		if (value !== null) {
			this.setAttribute('min', value.toString());
			this.inputView?.setAttribute('min', value.toString());
		} else {
			this.removeAttribute('min');
			this.inputView?.removeAttribute('min');
		}
	}

	get max(): number | null {
		const max = this.getAttribute('max');
		return max ? parseFloat(max) : null;
	}
	set max(value: number | null) {
		if (value !== null) {
			this.setAttribute('max', value.toString());
			this.inputView?.setAttribute('max', value.toString());
		} else {
			this.removeAttribute('max');
			this.inputView?.removeAttribute('max');
		}
	}

	get step(): number | null {
		const step = this.getAttribute('step');
		return step ? parseFloat(step) : null;
	}
	set step(value: number | null) {
		if (value !== null) {
			this.setAttribute('step', value.toString());
			this.inputView?.setAttribute('step', value.toString());
		} else {
			this.removeAttribute('step');
			this.inputView?.removeAttribute('step');
		}
	}

	get minlength(): number | null {
		const minlength = this.getAttribute('minlength');
		return minlength ? parseFloat(minlength) : null;
	}
	set minlength(value: number | null) {
		if (value !== null) {
			this.setAttribute('minlength', value.toString());
			this.inputView?.setAttribute('minlength', value.toString());
		} else {
			this.removeAttribute('minlength');
			this.inputView?.removeAttribute('minlength');
		}
	}

	get maxLength(): number | null {
		const maxLength = this.getAttribute('maxLength');
		return maxLength ? parseFloat(maxLength) : null;
	}
	set maxLength(value: number | null) {
		if (value !== null) {
			this.setAttribute('maxLength', value.toString());
			this.inputView?.setAttribute('maxLength', value.toString());
		} else {
			this.removeAttribute('maxLength');
			this.inputView?.removeAttribute('maxLength');
		}
	}

	get size(): number | null {
		const size = this.getAttribute('size');
		return size ? parseFloat(size) : null;
	}
	set size(value: number | null) {
		if (value !== null) {
			this.setAttribute('size', value.toString());
			this.inputView?.setAttribute('size', value.toString());
		} else {
			this.removeAttribute('size');
			this.inputView?.removeAttribute('size');
		}
	}

	get alt(): string | null {
		return this.getAttribute('alt');
	}
	set alt(value: string | null) {
		if (value !== null) {
			this.setAttribute('alt', value);
			this.inputView?.setAttribute('alt', value);
		} else {
			this.removeAttribute('alt');
			this.inputView?.removeAttribute('alt');
		}
	}

	get src(): string | null {
		return this.getAttribute('src');
	}
	set src(value: string | null) {
		if (value !== null) {
			this.setAttribute('src', value);
			this.inputView?.setAttribute('src', value);
		} else {
			this.removeAttribute('src');
			this.inputView?.removeAttribute('src');
		}
	}

	get accept(): string | null {
		return this.getAttribute('accept');
	}
	set accept(value: string | null) {
		if (value !== null) {
			this.setAttribute('accept', value);
			this.inputView?.setAttribute('accept', value);
		} else {
			this.removeAttribute('accept');
			this.inputView?.removeAttribute('accept');
		}
	}

	get checked(): boolean {
		return this.inputView?.checked == true;
	}
	set checked(value: boolean | string | null) {
		value = this.setBooleanAttribute('checked', value);
		const view = this.inputView
		if (view) view.checked = value;
	}

}

OhaeUI.registerViewType('input', OhaeInputView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
		value?: string | number | boolean;
		type?: string;
		alt?: string;
		src?: string;
		pattern?: string;
		max?: string | number;
		min?: string | number;
		step?: string | number;
		minlength?: string | number;
		maxLength?: string | number;
		size?: string | number;
		placeholder?: string;
		accept?: string;
		checked?: string | boolean;
	}
}


