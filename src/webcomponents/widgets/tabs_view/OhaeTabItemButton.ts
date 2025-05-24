import { Color } from "../../utils/Color";
import { OhaeButtonView } from "../input_view/OhaeButtonView";

export type Side = 'top' | 'bottom' | 'left' | 'right';

export class OhaeTabItemButtonView extends OhaeButtonView {
    public static readonly ATTRIBUTES: string[] = [
		'side',
		'icon',
		'current',
		'backgroundColor',
	];
	protected static readonly STYLES: string = `
		<style>
			:host {
				display: flex;
				width: 100%;
				max-height: 26px;
				min-height: 26px;
				padding: 0px;
				margin: 0px;
			}			

			.button {
				display: flex;
				align-items: center;
	
				background-color: var(--button-bg, #333);
				color: var(--button-color, #ddd);
				width: 100%;
				min-width: 20px;
				gap: 1px; /* Отступ между иконкой и текстом */
			}

			:host([side="top"]) .button {
				border-radius: 6px 6px 0 0;
				border: solid var(--button-border, #222) 1px;
				box-shadow: inset 0 -3px 3px rgba(0, 0, 0, 0.1);
				border-bottom: 0px;
			}
			:host([side="bottom"]) .button {
				border-radius: 0 0 6px 6px;
				border: solid var(--button-border, #222) 1px;
				box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
				border-top: 0px;
			}
			:host([side="left"]) .button {
				border-radius: 6px 0 0 6px;
				border: solid var(--button-border, #222) 1px;
				box-shadow: inset -2px 0 2px rgba(0, 0, 0, 0.1);
				border-right: 0px;
			}				
			:host([side="right"]) .button {
				border-radius: 0 6px 6px 0;
				border: solid var(--button-border, #222) 1px;
				box-shadow: inset 2px 0 2px rgba(0, 0, 0, 0.1);
				border-left: 0px;
			}

			:host([current]) .button {
				background-color: var(--button-bg-active, #444);
			}
			:host([side="top"][current]) .button {
				border-bottom: 1px solid #415e9c;
			}
			:host([side="bottom"][current]) .button {
				border-top: 1px solid #415e9c;
			}

			:host([side="left"][current]) .button {
				border-right: 1px solid #415e9c;
			}				
			:host([side="right"][current]) .button {
				border-left: 1px solid #415e9c;
			}
				
			.button:active {
				background-color: var(--button-bg-active, #444);
			}
			:host([side="top"]) .button:active {
				transform: translateY(4px);
				height: calc(100% - 4px);
			}
			:host([side="bottom"]) .button:active {
				height: calc(100% - 4px);
			}
			:host([side="left"]) .button:active {
				transform: translateX(8px);
				width: calc(100% - 8px);
			}
			:host([side="right"]) .button:active {
				white-space: nowrap;
				width: calc(100% - 8px);
			}

			.button:hover {
				background-color: var(--button-bg-hover, #3b3b3b);
			}

			.button:disabled,
			.button[disabled] {
				background-color: var(--button-bg-disabled, #282828);
			}


			.icon-wrapper {
				display: flex;
				/* flex-shrink: 0; */
				position: relative;
				justify-content: center;
				align-items: center;
				width: 16px;
				height: 20px;
			}

			.icon {
				font-size: 14px; /* Размер иконки, подстрой по желанию */
				justify-content: flex-start;
				align-items: flex-start;			
			}

			.label {
				flex-grow: 1;
				min-width: 0;
				width: auto;
				text-align: center;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			:host([side="left"]) .label {
				display: none;
			}
			:host([side="right"]) .label {
				display: none;
			}
		</style>
	` + this.FONT_AVESOME;
	protected static readonly HTML: string = `
		<button class='button'>
			<span class='icon-wrapper'>
				<span class='icon fa fa-check'></span>
			</span>
			<span class='label'>button</span>
		</button>
	`;

	protected override async createCallback() {
		this.markAsInitDataReady();
        await super.createCallback();
        this.applyAttributes(OhaeTabItemButtonView.ATTRIBUTES);

		// const icon = document.createElement('span');
		// icon.classList.add('fa', 'fa-check');
		// this.innerHTML = ''; // На всякий случай очистим контент
		// this.appendChild(icon);

		// const fontAwesomeScript = document.querySelector('script');
		// console.log('tick', fontAwesomeScript)

		
		//   const id = setInterval(() => {
		// 	console.log('setInterval');
		// 	const fontAwesomeFont = document.querySelector('#fa-v5-font-face');
		// 	const fontAwesomeMain = document.querySelector('#fa-main');
		// 	if (fontAwesomeScript && fontAwesomeFont && fontAwesomeMain) {
		// 		this.shadowRoot!.appendChild(fontAwesomeScript.cloneNode());
		// 		this.shadowRoot!.appendChild(fontAwesomeFont.cloneNode());
		// 		this.shadowRoot!.appendChild(fontAwesomeMain.cloneNode());
		// 	  clearInterval(id);
		// 	//   this.label = "qwe"
		// 	console.log('tick')

		// 	}
		//   }, 200);
	}

	static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

	public static getSide(value: string | null): Side {
		value = value ?? 'top';
		const sideValue = ['top', 'bottom', 'left', 'right'].includes(value) ? value : 'top';
		return sideValue as Side;
	}

	get icon(): string {
        return this.getAttribute('icon') ?? 'fa fa-plus';
    }
    set icon(value: string) {
		const icon = this.shadowRoot?.querySelector('.icon') as HTMLElement;
		const stringValue = (value ?? '').toString();
		this.setAttribute('icon', stringValue);
		if(icon) icon.className = `icon fa ${stringValue}`;
    }

	get label(): string {
        return this.getAttribute('label') ?? '';
    }
    set label(value: string | number | null) {
		const label = this.shadowRoot?.querySelector('.button')?.querySelector('.label') as HTMLElement;
		// console.log('button', 1, this)
		// console.log('button', 2, this.shadowRoot)
		// console.log('button', 3, this.shadowRoot?.querySelector('.button'))
		// console.log('label', label)
		const stringValue = (value ?? '').toString();
		this.setAttribute('label', stringValue);
		if(label) label.innerHTML = stringValue;
    }

	get side(): Side {
		const value = this.getAttribute('side');
        return  OhaeTabItemButtonView.getSide(value);
    }
    set side(value: Side | null) {
		value = OhaeTabItemButtonView.getSide(value)
		this.setAttribute('side', value);
    }

	get current(): boolean { 
		return this.getAttribute('current') === 'true';
	}
    set current(value: boolean | string | null) {
		value = value === true || value === 'true';
        if (value) {
            this.setAttribute('current', 'true');
        } else {
            this.removeAttribute('current');
        }
	}
	set backgroundColor(value: string | Color | null){
		if(!value) return;
		const color = typeof value === 'string' ? new Color(value) : value;
		this.style.setProperty("--button-bg", color.brightness(0.7).hex);
		this.style.setProperty("--button-bg-hover", color.brightness(0.9).hex);
		this.style.setProperty("--button-bg-active", color.hex);
		this.style.setProperty("--button-color", color.shift(128).hex);
		this.style.setProperty("--button-border", color.brightness(0.4).hex);
	}

	get backgroundColor(): Color {
		return new Color(this.getAttribute('backgroundColor')??"#333");
	}	
}
customElements.define('ohae-tab-button', OhaeTabItemButtonView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
		side?: Side;
		icon?: string;
		current?: string | boolean;
		backgroundColor?: string;
    }
}

