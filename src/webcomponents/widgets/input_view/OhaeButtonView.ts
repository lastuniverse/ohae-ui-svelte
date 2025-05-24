import { Color } from "../../utils/Color";
import { OhaeBaseView } from "../base_view/OhaeBaseView";

export class OhaeButtonView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
		'label'
	];
	protected static readonly STYLES: string = `
		<style>
			:host {
				display: flex;
				width: 100%;
				/* height: 26px; */
				max-height: 26px;
				min-height: 26px;
				padding: 0px;
				margin: 0px;
			}
			.button {
				border-radius: 3px;
				background-color: var(--button-bg, #3f4760);
				color: var(--button-color, #ddd);
				border: solid var(--button-border, #222) 1px;
				width: 100%;
				/* height: 100%; */
			}
			.button:hover {
				background-color: var(--button-bg-hover, #424a64);
			}
			.button:active {
				background-color: var(--button-bg-active, #4a5677);
				transform: translateY(1px);
			}
			.button:disabled,
			.button[disabled] {
				background-color: var(--button-bg-disabled, #363c46);
			}
			::slotted(*) {
                flex: 1;  /* Все элементы слота будут равномерно растянуты */
                min-width: 0; /* Позволяет элементам сужаться */
            }
		</style>
	`;
	protected static readonly HTML: string = `
		<button class='.button'><slot>button</slot></button>
	`;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

	protected override async createCallback() {
		await super.createCallback();
		this.applyAttributes(OhaeButtonView.ATTRIBUTES);
        this.setAttribute('flex', 'none');
    }

	set backgroundColor(value: string | Color | null){
		if(!value) return;
		const color = typeof value === 'string' ? new Color(value) : value;
		this.style.setProperty("--button-bg", color.hex);
		this.style.setProperty("--button-bg-hover", color.brightness(1.1).hex);
		this.style.setProperty("--button-bg-active", color.brightness(1.2).hex);
		this.style.setProperty("--button-color", color.shift(128).hex);
		this.style.setProperty("--button-border", color.brightness(0.5).hex);
	}

	get backgroundColor(): Color {
		return new Color(this.getAttribute('backgroundColor'));
	}

	get height(): string | null {
		return this.getAttribute('height');
	}
	set height(value: string | number | null) {
		if (value === null) return;
		value = !value ? '0px' : value.toString();
		this.setAttribute('height', value);
		this.style.height = value;
	}

	get label(): string {
        return this.getAttribute('label') ?? '';
    }
    set label(value: string | number | null) {
		if(value!==null){
			value.toString();
			this.setAttribute('label', value.toString());
            this.innerText = value.toString();
		} else {
			this.removeAttribute('label');
            this.innerText =  '';
		}
    }

	
}
customElements.define('ohae-button', OhaeButtonView);
