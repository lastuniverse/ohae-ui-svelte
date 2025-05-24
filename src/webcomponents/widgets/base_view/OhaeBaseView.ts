import type { AlignValues, IOhaeViewOptions } from '../../OhaeViewOptions';
import { Color } from '../../utils/Color';
import { SizeNumber } from '../../utils/SizeNumber';


export class OhaeBaseView extends HTMLElement {
	public static readonly ATTRIBUTES: string[] = [
		'id',
		'align',
		'valign',
		'flex',
		'width',
		'height',
		'maxWidth',
		'maxHeight',
		'minWidth',
		'minHeight',
		'padding',
		'margin',
		'backgroundColor',
		'parentdirection',
	];

	protected static readonly STYLES: string = `<style>
		:host {
			border-radius: 3px;
			display: flex;
			box-sizing: border-box;
			padding: 0px;
			margin: 0px;
			flex: none;
		}
		:host([backgroundColor]) {
			box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
			background-color:  var(--host-bg, #333);
			color: var(--host-color, #aaa);
		}

		</style>`;

	protected static readonly FONT_AVESOME: string = `<style>
		/* @import url("./assets/fontawesome-free-6.7.2-web/css/all.min.css"); */
		@import url("./fontawesome-free-6.7.2-web/css/all.min.css");
	</style>`;
	
	protected static readonly HTML: string = `<slot></slot>`;

	protected static readonly JUSTIFY_VALUES_MAP: Record<AlignValues, string> = {
		'flex-start': 'left', 			// Элементы выравниваются по началу основной оси (по умолчанию).
		'flex-end': 'right', 			// Элементы выравниваются по концу основной оси.
		'center': 'center', 			// Элементы выравниваются по центру основной оси.
		'space-between': 'justify', 	// Элементы распределяются равномерно по основной оси, первый элемент прижимается к началу, последний — к концу, а остальные равномерно распределяются.
		'space-around': 'justify', 		// Элементы распределяются равномерно, но с равными промежутками вокруг каждого элемента.
		'space-evenly': 'justify', 		// Элементы распределяются равномерно, включая промежутки до первого и после последнего элемента.
		'start': 'left', 				// Элементы выравниваются по началу контейнера (по оси написания текста, обычно для текстов слева направо).
		'end': 'right', 				// Элементы выравниваются по концу контейнера (по оси написания текста, обычно для текстов справа налево).
		'none': 'left'
	}
	public readonly onReady: Promise<boolean>;
	private _readyResolve!: (value: boolean | PromiseLike<boolean>) => void;
	protected onInitDataReady!: Promise<boolean>;
	protected initData!: IOhaeViewOptions;
	private _initDataReadyResolve!: (value: boolean | PromiseLike<boolean>) => void;
	protected shadow!: ShadowRoot;


	constructor() {
		super();
		this.onReady = new Promise((resolve) => this._readyResolve = resolve);
		this.onInitDataReady = new Promise((resolve) => this._initDataReadyResolve = resolve);
		this.shadow = this.attachShadow({ mode: 'open' });
		this.createCallback();
	}

	static get observedAttributes(): string[] {
		return [...OhaeBaseView.ATTRIBUTES];
	}

	protected async connectedCallback() {
		// await this.createCallback();
		this.markAsReady();
	}

	protected async createCallback() {
		await this.onInitDataReady;
		await this.render();
		this.applyAttributes(OhaeBaseView.observedAttributes);
	}

	protected markAsReady() {
		this._readyResolve(true);
	}

	protected markAsInitDataReady() {
		this._initDataReadyResolve(true);
	}

	public init(options: IOhaeViewOptions) {
		this.initData = options;
		this.initAttributes();
		this._initDataReadyResolve(true);
	}


	protected initAttributes(){
		Object.entries(this.initData ?? {}).forEach(([key, value]) => {
			if (key === 'id') {
				this.setAttribute(key, 'ohae-'+value);
			} else if (typeof value != 'object' && value !== undefined) {
				if (value !== null) this.setAttribute(key, value.toString());
			}
		});
	}

	protected disconnectedCallback() {
	}

	protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue !== newValue) {
			this.applyAttribute(name, newValue);
		}
	}

	protected async render() {
		const staticThis = (this.constructor as typeof OhaeBaseView);
		this.shadowRoot!.innerHTML = staticThis.STYLES + staticThis.HTML;
	}

	public override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type, listener, options);
	}

	protected applyAttributes(attributes: string[]): void {
		attributes.forEach(name => {
			const value = this.getAttribute(name);
			if (value !== null) this.applyAttribute(name, value);
		});
	}

	protected applyAttribute(name: string, value: string): void {
		if (!(name in this)) return;
		(this as any)[name] = value;
	}

	protected waitForShadowRoot(hostElement: HTMLElement = this): Promise<ShadowRoot> {
		return new Promise((resolve) => {
			if (hostElement.shadowRoot) {
				return resolve(hostElement.shadowRoot);
			}

			const observer = new MutationObserver((_, obs) => {
				if (hostElement.shadowRoot) {
					obs.disconnect();
					resolve(hostElement.shadowRoot);
				}
			});

			observer.observe(hostElement, {
				childList: false,
				subtree: false,
				attributes: false,
				// Наблюдаем за изменениями, связанными с ShadowRoot
				characterData: false,
			});
		});
	};

	get flex(): number | null {
		const value = this.getAttribute('flex');
		if (!value) return null
		return parseFloat(value);
	}
	set flex(value: string | number | null) {
		// console.log('>>>', 'update property', 0, 'flex', value);
		if (value === null) return;
		// console.log('>>>', 'update property', 1, 'flex', value);
		if (value === 'none') {
			this.style.flexGrow = 'none';
			this.setAttribute('flex', 'none');
		} else if (typeof value === 'number') {
			this.style.flexGrow = value.toString();
			this.setAttribute('flex', value.toString());
		} else {
			this.style.flexGrow = value;
		}
	}

	get backgroundColor(): Color | null {
		const backgroundColor = this.getAttribute('backgroundColor');
		if (!backgroundColor) return null;
		return new Color(backgroundColor);
	}
	set backgroundColor(value: string | Color | null) {
		if (!value) return;

		const color = typeof value === 'string' ? new Color(value) : value;
		this.setAttribute('backgroundColor', color.hex);

		this.style.setProperty("--host-bg", color.hex);
		this.style.setProperty("--host-color", color.contrast(0.5).mono().hex);
		this.style.setProperty("--host-hr-color", color.contrast(0.2).mono().hex);

		this.style.setProperty("--host-hover-bg", color.brightness(1.1).hex);
		this.style.setProperty("--host-active-bg", color.brightness(1.2).hex);
		this.style.setProperty("--host-border", color.brightness(0.8).hex);
		this.style.setProperty("--host-head-bg", color.brightness(0.5).mono().hex);
		this.style.setProperty("--host-head-color", color.contrast(0.5).mono().hex);
	}

	get align(): string | null {
		return this.getAttribute('valign');
	}
	set align(value: string | null) {
		if (value === null) return;
		this.setAttribute('align', value);
		this.style.textAlign = OhaeBaseView.JUSTIFY_VALUES_MAP[value as AlignValues];
		this.style.justifyContent = value;
	}

	get valign(): string | null {
		return this.getAttribute('align');
	}
	set valign(value: string | null) {
		if (value === null) return;
		this.style.alignItems = value;
	}

	get margin(): string | null {
		return this.getAttribute('margin');
	}
	set margin(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('margin', parsedValue);
		this.style.margin = parsedValue;
	}

	get padding(): string | null {
		return this.getAttribute('padding');
	}
	set padding(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('padding', parsedValue);
		this.style.padding = parsedValue;
	}

	get height(): string | null {
		return this.getAttribute('height');
	}
	set height(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('height', parsedValue);
		this.style.height = parsedValue;
	}

	get minHeight(): string | null {
		return this.getAttribute('minHeight');
	}

	set minHeight(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('minHeight', parsedValue);
		this.style.minHeight = parsedValue;
	}

	get maxHeight(): string | null {
		return this.getAttribute('maxHeight');
	}
	set maxHeight(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('maxHeight', parsedValue);
		this.style.maxHeight = parsedValue;
	}

	get width(): string | null {
		return this.getAttribute('width');
	}
	set width(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('width', parsedValue);
		this.style.width = parsedValue;
	}

	get minWidth(): string | null {
		return this.getAttribute('minWidth');
	}
	set minWidth(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('minWidth', parsedValue);
		this.style.minWidth = parsedValue;
	}

	get maxWidth(): string | null {
		return this.getAttribute('maxWidth');
	}

	set maxWidth(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('maxWidth', parsedValue);
		this.style.maxWidth = parsedValue;
	}

	protected parseSizeValue(value: string | number): string {
		value = value.toString()
		const parsedNumber = parseFloat(value);
		if (typeof parsedNumber === 'number') {
			const number = new SizeNumber(value);
			return number.toString();
		} else {
			return value;
		}
	}

	protected parseNumberValue(value: string | number): string {
		const number = new SizeNumber(value);
		return number.toNumber().toString();
	}

	protected setBooleanAttribute(attributeName: string, value: boolean | string | null, target?: HTMLElement): boolean {
		value = value === true || value === 'true';
		target = target ?? this;
		if (value) {
			target.setAttribute(attributeName, value.toString());
		} else {
			target.removeAttribute(attributeName);
		}
		return value;
	}
}

customElements.define('ohae-base', OhaeBaseView);

