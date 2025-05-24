## есть вот такие компоненты собранные на технологии webcomponents

#### OhaeBaseView.ts
```
import { Primitive } from 'node_modules/ohae_state/dist/types/index.js';
import { OhaeUI } from '../../OhaeUI.ts';
import { AlignValues, EventHandler, EventHandlers, IOhaeViewOptions, LayoutDirection } from '../../OhaeViewOptions.ts';
import { StateConnector } from '../../state/StateConnector.ts';
import { Color } from '../../utils/Color.ts';
import { SizeNumber } from '../../utils/SizeNumber.ts';


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
		@import url("./assets/fontawesome-free-6.7.2-web/css/all.min.css");
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
		this.initState();
		this.initAttributes();
		this._initDataReadyResolve(true);
	}

	protected initState(){
		const stateData = this.initData?.stated;
		const state = StateConnector.getState(this)
		if(state && stateData){
			console.log(0, state, stateData)
			Object.entries(stateData).forEach(([attribute, statePath]) => {
				console.log(1, attribute, statePath)

				const value = state.getValue(statePath as string) as Primitive;
				console.log(2, value)
				if(value!==null && value!==undefined){
					this.initData[attribute] = value;
					// this.applyAttribute(attribute, value.toString());
				}

			});
		}
	}
	protected initAttributes(){
		Object.entries(this.initData ?? {}).forEach(([key, value]) => {
			if (key === 'id') {
				this.setAttribute(key, OhaeUI.getPrefixedId(value));
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
		// if(name === 'flex') console.log('>>>', 'update attribute', 3, 'flex', value);
		if (!(name in this)) return;
		(this as any)[name] = value;
		const typedValue = (this as any)[name];
		// if(name === 'flex') console.log('>>>', 'update attribute', 4, 'flex', typedValue);

		const stateData = this.initData?.stated?.[name];
		// if(name === 'flex') console.log('>>>', 'update attribute', 5, 'stated', this.initData?.stated);
		if(!stateData) return;
		// if(name === 'flex') console.log('>>>', 'update attribute', 6, 'flex', typedValue);

		const state = StateConnector.getState(this)
		// if(name === 'flex') console.log('>>>', 'update attribute', 7, 'stated', stateData, typedValue, this.initData?.stated, state);

		state?.setValue(stateData as string, typedValue);
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

OhaeUI.registerViewType('base', OhaeBaseView);
```

#### OhaeLayoutView.ts
```
import { OhaeUI } from '../../OhaeUI';
import { OhaeBaseView } from '../base_view/OhaeBaseView';

export class OhaeLayoutView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
        'collapsed',
        'direction',
        'overflow',
        'overflowX',
        'overflowY',
    ];
	protected static readonly STYLES: string = `
        <style>
            :host {
                border-radius: 3px;
                display: flex;
                overflow: auto;
                box-sizing: border-box;
                padding: 0px;
                margin: 0px;
                flex-grow: 1;
            }
            /* :host(:not([backgroundColor])) { */
            :host([backgroundColor]) {
                background-color:  var(--host-bg, #333);
                box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
                color: var(--host-color, #ddd);
            }
            :host([direction="rows"]) {
                flex-direction: column;
            }
            :host([direction="cols"]) {
                flex-direction: row;
            }
            :host([collapsed]) {
                display: none;
            }
            ::slotted(*) {
                flex: 1;  /* Все элементы слота будут равномерно растянуты */
                min-width: 0; /* Позволяет элементам сужаться */
            }
        </style>
	`;

    private resizeObserver: ResizeObserver;

    constructor() {
        super();
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeLayoutView.ATTRIBUTES);
        this.resizeObserver.observe(this);
    }

    protected override disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.disconnect();
    }

    private handleResize() {
        // Логика для обработки изменения размеров
    }

    public show() {
        this.collapsed = false;
    }

    public hide() {
        this.collapsed = true;
    }

    get overflow(): string | null {
        return this.getAttribute('overflow');
    }
    set overflow(value: string | null) {
        if (value === null) return;
        this.setAttribute('overflow', value);
        this.style.overflow = value;
    }

    get overflowX(): string | null {
        return this.getAttribute('overflowX');
    }
    set overflowX(value: string | null) {
        if (value === null) return;
        this.setAttribute('overflowX', value);
        this.style.overflowX = value;
    }

    get overflowY(): string | null {
        return this.getAttribute('overflowY');
    }
    set overflowY(value: string | null) {
        if (value === null) return;
        this.setAttribute('overflowY', value);
        this.style.overflowY = value;
    }

    get collapsed(): boolean {
		return this.getAttribute('collapsed') === 'true';
	};
	set collapsed(value: boolean | string | null) {
        this.setBooleanAttribute('collapsed', value);
    }
}

OhaeUI.registerViewType('layout', OhaeLayoutView);


declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        collapsed?: boolean | string;
        direction?: LayoutDirection;
        overflow?: string;
        overflowX?: string;
        overflowY?: string;
    }
}
```

#### OhaeResizerView.ts
```
import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseView } from "../base_view/OhaeBaseView";

interface IElement {
    element: HTMLElement;
    initialSize: number;
    minSize: number;
    maxSize: number;
    newSize: number;
}

export class OhaeResizerView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [

    ];
    protected static readonly STYLES: string = `
        <style>
            :host {
                display: block;
                padding: 0px;
                margin: 1px;
            }
            :host([direction="cols"]) {
                /* background: url("data:image/gif;base64,R0lGODlhAwAdAIABAJWr7f///yH5BAEAAAEALAAAAAADAB0AAAIQRBynaaje0pORrWnhrbi3AgA7") no-repeat center center; */
                cursor: e-resize;
            }
            :host([direction="rows"]) {
                /* background:  url("data:image/gif;base64,R0lGODlhHQADAIABAJWr7f///yH5BAEAAAEALAAAAAAdAAMAAAINRIynyesBo5y0tuswKgA7") no-repeat center center; */
                cursor: n-resize;
            }

            :host([direction="cols"]:hover) .overlay2{
                transform: scaleX(7);
            }
            :host([direction="rows"]:hover) .overlay2{
                transform: scaleY(7);
            }

            :host([direction="cols"]:active) .overlay2{
                transform: scaleX(4);
            }
            :host([direction="rows"]:active) .overlay2{
                transform: scaleY(4);
            }

            :host([direction="cols"]) .overlay2{
                transform: scaleX(4);
            }
            :host([direction="rows"]) .overlay2{
                transform: scaleY(4);
            }

            .container {
                position: relative;
                width: inherit;
                height: 100%;
                border: none;
                padding: 0px;
                margin: 0px;
            }
            .overlay1, .overlay2 {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .overlay1 {
                background-color: #222;
            }

            :host([direction="cols"]) .overlay1{
                background: url("data:image/gif;base64,R0lGODlhAwAdAIABAJWr7f///yH5BAEAAAEALAAAAAADAB0AAAIQRBynaaje0pORrWnhrbi3AgA7") no-repeat center center;
            }
            :host([direction="rows"]) .overlay1{
                background:  url("data:image/gif;base64,R0lGODlhHQADAIABAJWr7f///yH5BAEAAAEALAAAAAAdAAMAAAINRIynyesBo5y0tuswKgA7") no-repeat center center;
            }


            :host(:hover) .overlay1{
                background-color: #191919; /* #415e9c60;*/
            }

            :host(:active) .overlay1{
                /* Эффект при нажатии */
                background-color: #555;
            }

            .overlay2 {
                background: transparent;
            }
            .overlay2_ {
                background:  rgba(255, 0, 0, 0.5);
            }
        </style>
	`;
	protected static readonly HTML: string = `
		<slot><div class="container">
            <div class="overlay1"></div>
            <div class="overlay2"></div>
        </div></slot>
	`;
    private startX: number = 0;
    private startY: number = 0;
    private beforeElements: IElement[] = [];
    private afterElements: IElement[] = [];
    private currentDragDelta: number = 0;

    static get observedAttributes() {
        return [...super.ATTRIBUTES, ...this.ATTRIBUTES];
    }

    protected override async createCallback() {
        await super.createCallback()
        this.setAttribute('direction', this.isRows() ? 'rows' : 'cols');
        this.applyDirrection();
        this.addEventListener('mousedown', this.handleMouseDown as EventListener);
    }

    protected override disconnectedCallback() {
        this.removeEventListener('mousedown', this.handleMouseDown);
    }

    protected applyDirrection() {
        // if (!this.isConnected) return;
        if (this.isRows()) {
            this.style.height = '2px';
            this.style.minHeight = '2px';
            this.style.maxHeight = '2px';
        } else {
            this.style.width = '2px';
            this.style.minWidth = '2px';
            this.style.maxWidth = '2px';
        }
    }

    private isRows(): boolean {
        const container = this.parentElement as HTMLElement;
        return container.getAttribute('direction') === 'rows';
    }

    private storeElements(): void {
        const container = this.parentElement as HTMLElement;
        if (!container) return;

        const elements = Array.from(container.children) as HTMLElement[];

        this.beforeElements = [];
        this.afterElements = [];

        let isBefore = true;
        elements.forEach(element => {
            if (element === this) {
                isBefore = false;
                return;
            }

            const size = this.isRows() ? element.offsetHeight : element.offsetWidth;
            const minSize = parseFloat(getComputedStyle(element)[this.isRows() ? 'minHeight' : 'minWidth']) || 0;
            const maxSize = parseFloat(getComputedStyle(element)[this.isRows() ? 'maxHeight' : 'maxWidth']) || Infinity;
            const data = { element, initialSize: size, minSize, maxSize, newSize: size } as IElement;

            if (isBefore) {
                this.beforeElements.unshift(data);
            } else {
                this.afterElements.push(data);
            }
        });
    }

    private decreaseSizeRecursive(items: IElement[], deltaToDistribute: number) {
        const item = items.shift();
        if (!item) {
            this.currentDragDelta -= deltaToDistribute;
            return;
        }
        const actualDecrease = Math.min(deltaToDistribute, item.initialSize - item.minSize);
        item.newSize = item.initialSize - actualDecrease;
        if (actualDecrease <= deltaToDistribute) {
            this.decreaseSizeRecursive(items, deltaToDistribute - actualDecrease);
        } else {
            this.currentDragDelta -= deltaToDistribute;
        }
    }

    private increaseSizeRecursive(items: IElement[], deltaToDistribute: number) {
        const item = items.shift();
        if (!item) {
            this.currentDragDelta -= deltaToDistribute;
            return;
        }
        const actualIncrease = Math.min(deltaToDistribute, item.maxSize - item.initialSize);
        item.newSize = item.initialSize + actualIncrease;
        if (actualIncrease <= deltaToDistribute) {
            this.increaseSizeRecursive(items, deltaToDistribute - actualIncrease);
        } else {
            this.currentDragDelta -= deltaToDistribute;
        }
    }

    private applyNewSizes() {
        const allAffectedElements = [...this.beforeElements, ...this.afterElements];
        allAffectedElements.forEach((item, i) => {
            if(item.element instanceof OhaeBaseView){
                item.element.flex = item.newSize;
            }else{
                item.element.style.flexGrow = `${item.newSize}`;
            }

        });
    }


    private handleMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        this.startX = event.clientX;
        this.startY = event.clientY;

        this.storeElements()

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    };

    private handleMouseMove = (event: MouseEvent) => {
        const container = this.parentElement as HTMLElement;
        if (!container) return;

        let delta = this.isRows() ? event.clientY - this.startY : event.clientX - this.startX;
        this.currentDragDelta = Math.abs(delta);

        if (delta < 0) {
            this.decreaseSizeRecursive([...this.beforeElements], this.currentDragDelta);
            this.increaseSizeRecursive([...this.afterElements], this.currentDragDelta);
            this.decreaseSizeRecursive([...this.beforeElements], this.currentDragDelta);
        } else {
            this.decreaseSizeRecursive([...this.afterElements], this.currentDragDelta);
            this.increaseSizeRecursive([...this.beforeElements], this.currentDragDelta);
            this.decreaseSizeRecursive([...this.afterElements], this.currentDragDelta);
        }

        this.applyNewSizes();
    };

    private handleMouseUp = () => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };
}

OhaeUI.registerViewType('resizer', OhaeResizerView);
```

## и вот эти же компоненты переделанные под svelte версии 5.28

### типы для json конфига UI

#### OhaeComponetTypes.ts
```
import type { IOhaeIconOfTypeConfig } from "./icons/OhaeIconOfTypeTypes";
import type { IOhaeLayoutConfig } from "./lauout/OhaeLayoutTypes";
import type { IOhaeResizerConfig } from "./lauout/OhaeResizerTypes";
import type { IOhaeSeparatorConfig } from "./lauout/OhaeSeparatorTypes";
import type { IOhaeTabConfig as IOhaeTabsConfig, IOhaeTabItemConfig } from "./tabs/OhaeTabsTypes";

export interface IOhaeBaseComponentConfig {
    id?: string;
    view?: string; // Имя тега (например, 'layout', 'resizer', 'div')
    className?: string;
    customStyle?: string;
    color?: string;
    backgroundColor?: string;
    body?: UiNodeChildConfig;
}

export type IUiNodeConfig =
  | IOhaeLayoutConfig
  | IOhaeIconOfTypeConfig
  | IOhaeSeparatorConfig
  | IOhaeResizerConfig
  | IOhaeTabsConfig
  | IOhaeTabItemConfig
  | IOhaeBaseComponentConfig; // Общий тип для простых элементов вроде 'div' или как fallback

export type UiNodeConfig =
  | string
  | number
  | IUiNodeConfig

// Для дочерних элементов, которые могут быть строками/числами
export type UiNodeChildConfig = UiNodeConfig | UiNodeConfig[];

```

#### OhaeLayoutTypes.ts
```
import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export const flexDirectionContentMap = {
    row: "row", column: "column", "row-reverse": "row-reverse", "column-reverse": "column-reverse",
    inherit: "inherit", initial: "initial", unset: "unset",
}

export const overflowContentMap = {
    auto: "auto", hidden: "hidden", scroll: "scroll", visible: "visible",
    inherit: "inherit", initial: "initial", unset: "unset",
}

export const justifyContentMap = {
    left: "flex-start", center: "center", right: "flex-end", start: "flex-start",
    end: "flex-end", "flex-start": "flex-start", "flex-end": "flex-end",
    stretch: "stretch", "space-between": "space-between", "space-around": "space-around",
    "space-evenly": "space-evenly",
};

export const alignItemsMap = {
    top: "flex-start", middle: "center", bottom: "flex-end", start: "flex-start",
    center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline",
    "flex-start": "flex-start", "flex-end": "flex-end",
};


export type TFlexDirection = keyof typeof flexDirectionContentMap;
export type TOverflow = keyof typeof overflowContentMap;
export type TJustifyContent = keyof typeof justifyContentMap;
export type TAlignItems = keyof typeof alignItemsMap;


export interface IOhaeLayoutConfig extends ILayoutStyleProps, ILayoutSizeProps, IOhaeBaseComponentConfig{
    view: 'layout';
}

export interface ILayoutSizeProps{
    flex?: number;
    overflow?: TOverflow;
    overflowX?: TOverflow;
    overflowY?: TOverflow;
    width?: number | string;
    height?: number | string;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    collapsed?: boolean;
}

export interface ILayoutStyleProps {
    align?: TJustifyContent;
    valign?: TAlignItems;
    collapsed?: boolean;
    direction?: TFlexDirection;
    backgroundColor?: string
    padding?: number;
    margin?: number;
}

export interface ICalculatedLayoutStyles {
    finalDisplay: string;
    finalFlexDirection: TFlexDirection
    finalJustifyContent: string;
    isRowDirection: boolean;
    finalAlignItems: string;
    paddingStyle?: string;
    marginStyle?: string;
}
```

#### OhaeResizerTypes.ts
```
import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export interface IOhaeResizerConfig extends IOhaeBaseComponentConfig {
    view: 'resizer';
}
```

#### OhaeTabsTypes.ts
```
import type { IOhaeBaseComponentConfig } from "../OhaeComponetTypes";

export type TabButtonSide = "top" | "bottom" | "left" | "right";

export interface IOhaeTabConfig extends IOhaeBaseComponentConfig {
    view: 'tabs';
    tabsSide?: TabButtonSide;
    tabButtonBackground?: string;
	allowHideAll?: string,
}

export interface IOhaeTabItemConfig extends IOhaeBaseComponentConfig {
    view: 'tab-item';
    icon?: string;
    header?: string;
    side?: TabButtonSide;
    current?: boolean;
}
```

### образец json конфига UI

#### mainViewConfig.ts
```
import type { UiNodeConfig } from "../components/OhaeComponetTypes";


export const mainViewConfig: IUiNodeConfig = {
    view: 'layout',
    width: '100%',
    height: '100vh',
    flex: 1,
    direction: 'row',
    overflow: 'hidden',
    className: 'body',
    body: [
      {
        view: 'layout',
        direction: 'column',
        overflow: 'auto',
        body: [
          {
            view: 'tabs',
            tabsSide: 'left',
            // allowHideAll: true,
            tabButtonBackground: "#3d3d3d",
            body: [
                {
                    view: 'tab-item',
                    icon: "fa-cube",
                    header: "ohae editor",
                    body: {view: "div", body: "11111"},
                },
                {
                    view: 'tab-item',
                    icon: "fa-code",
                    header: "code editor",
                    body: '22222',
                },
                {
                    view: 'tab-item',
                    icon: "fa-image",
                    header: "sprites",
                    // backgroundColor: '#556',
                    body: "33333",
                }
            ]
          },
          { view: 'separator' },
          {
            view: 'layout',
            direction: 'column',
            overflow: 'auto',
            // minHeight: 50,
            className: 'top',
            flex: 2,
            body: [
              { view: 'div', body: 'minHeight: 0' },
              { view: 'div', body: 'maxHeight: undefined' },
              { view: 'div', body: "111111111111111111111111" },
              { view: 'div', body: "222222222222222" },
              { view: 'div', body: "33333333333333" },
              { view: 'div', body: "444444444444" },
              { view: 'div', body: "555555555555" },
              { view: 'div', body: "66666666666" },
            ]
          },
          { view: 'resizer' },
          {
            view: 'layout',
            direction: 'column',
            overflow: 'auto',
            className: 'bottom',
            minHeight: 50, // Число будет преобразовано в 50px в layout
            body: [
              { view: 'div', body: 'minHeight: 50' },
              { view: 'div', body: 'maxHeight: undefined' }
            ]
          },
          { view: 'resizer' },
          {
            view: 'layout',
            id: 'tartet',
            direction: 'column',
            overflow: 'auto',
            className: 'top',
            flex: 1,
            minHeight: 100,
            maxHeight: 150,
            body: [
              { view: 'div', body: 'minHeight: 100' },
              { view: 'div', body: 'maxHeight: 150' }
            ]
          }
        ]
      },
      { view: 'resizer' },
      {
        view: 'layout',
        direction: 'row',
        overflow: 'auto',
        className: 'right',
        maxWidth: 50,
        minWidth: 50,
        body: [
          { view: 'div', body: 'minHeight: 0' },
          { view: 'div', body: 'maxHeight: undefined' }
        ]
      },
      {
        view: 'layout',
        direction: 'row',
        overflow: 'auto',
        className: 'right',
        body: [
          { view: 'div', body: 'minHeight: 0' },
          { view: 'div', body: 'maxHeight: undefined' }
        ]
      },
    ]
  };
```

### модуль инициализация UI из json конфига UI (оба варианта инициализируются одинаково)

#### jsonRenderer.ts
```
import type { IUiNodeConfig, UiNodeChildConfig, UiNodeConfig } from "../components/OhaeComponetTypes";

const tagsMap: Record<string, string> = {
  layout: 'ohae-layout',
  resizer: 'ohae-resizer',
  separator: 'ohae-separator',
  icon: 'ohae-icon-of-type',
  tabs: 'ohae-tabs',
  'tab-item': 'ohae-tab-item',
  'tab-button': 'ohae-tab-button',
};

export async function createUI(config: UiNodeConfig, parentElement: HTMLElement): Promise<HTMLElement|Text|null> {
  if (!config) {
    console.error("Invalid config:", config);
    return null;
  }
  return new Promise((resolve, reject) => {
    requestAnimationFrame(async () => {
      const slotContainer = parentElement.shadowRoot?.querySelector('.slot') as HTMLElement ?? parentElement.querySelector('.slot') as HTMLElement ?? parentElement;
      const element = createUiElement(config, slotContainer)
      if(element) {
        resolve(element)
      } else {
        reject(null);
        throw new Error(`Can'not create element for ${config}`);
      }
    });
  })
}

function createUiElement(config: UiNodeConfig, parentElement: HTMLElement): HTMLElement | Text | null {
  if (typeof config === 'object') {
    return renderElementFromJson(config, parentElement);
  } else {
    return renterElementFromText(config, parentElement);
  }
}

function renderElementFromJson(config: IUiNodeConfig, parentElement: HTMLElement): HTMLElement | null {
  if (!config.view) {
    console.error("Invalid config or missing view:", config);
    return null;
  }

  const tagName = tagsMap[config.view] ?? config.view;
  
  const element = document.createElement(tagName);
  if(!element) {
    console.error("Invalid config or missing view:", config);
    return null;
  }


  setPropsAndAttributes(element, config);
  parentElement.appendChild(element);
  

  if (config.body) {
    // const slotContainer = element.shadowRoot?.querySelector('.slot') as HTMLElement ?? element.querySelector('.slot') as HTMLElement ?? element;
    if (Array.isArray(config.body)) {
      (config.body as UiNodeConfig[]).forEach((configChild: UiNodeConfig) => {
        createUI(configChild, element);
      });
    } else {
      createUI(config.body, element);
    }
  }

  return element;
}


function renterElementFromText(text: string | number, parentElement: HTMLElement): Text | null {
  if (text.toString().length === 0) {
    console.error("Invalid ctreate Text element for empty string");
    return null;
  }
  const element = document.createTextNode(text.toString());
  parentElement.appendChild(element);
  return element;
}


function setPropsAndAttributes(element: HTMLElement, config: IUiNodeConfig) {
  for (const key in config) {
    if (!config.hasOwnProperty(key) || key === 'view' || key === 'body') continue;
    const value = (config as any)[key];

    if (key === 'className') {
      if(typeof value === 'string') value.split(' ').forEach(cls => element.classList.add(cls));
    }
    

    if (key === 'style') {
      if (typeof value === 'string') element.setAttribute('style', value);
    } else if (key in element) {
      (element as any)[key] = value;
    } else if (typeof value === 'object'){
        (element as any)[key] = value;
    } else if (typeof value === 'boolean'){
        if (value) element.setAttribute(camelToKebab(key), '');
    }else{
        element.setAttribute(camelToKebab(key), String(value));
    }
  }
}

// Функция для преобразования camelCase в kebab-case для атрибутов
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
```

### инициализация UI делается так

#### main.ts
```
import './app.css';
import { themeStore } from './lib/useShadowTheme';

// 1. Импортируйте ваши Svelte компоненты, чтобы они зарегистрировались как Custom Elements.
import './components/lauout/OhaeLayoutView.svelte';
import './components/lauout/OhaeResizerView.svelte';
import './components/lauout/OhaeSeparatorView.svelte';
import './components/icons/OhaeIconOfTypeView.svelte';
import './components/tabs/OhaeTabItemView.svelte';
import './components/tabs/OhaeTabItemButton.svelte';
import './components/tabs/OhaeTabsView.svelte';

// 2. Импортируйте вашу конфигурацию и функцию рендеринга
import { mainViewConfig } from './ui-configs/mainViewConfig.js';
import { createUI } from './lib/jsonRenderer';

// 3. Найдите целевой элемент в DOM
const appRootElement = document.getElementById('app');



(async ()=>{
  if (appRootElement) {
    // 4. Вызовите рендерер
    await createUI(mainViewConfig, appRootElement);
  } else {
    console.error("Root element #app not found!");
  }

  themeStore.set('/themes/theme-default-dark.css');
})();

```

### и уже переделанные компоненты и их библиотеки

#### OhaeLayoutView.svelte
```
<svelte:options customElement={{ tag: "ohae-layout" }} />

<script lang="ts">
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import { calculateLayoutStyles, asignLayoutProps } from "../../lib/layoutUtils";
    import type { IOhaeLayoutConfig, TFlexDirection } from "./OhaeLayoutTypes";

    let {
        flex = undefined,
        align = "left",
        valign = "stretch",
        collapsed = false,
        direction = "row" as TFlexDirection,
        overflow = "auto",
        overflowX = undefined,
        overflowY = undefined,
        width = undefined,
        height = undefined,
        maxWidth = undefined,
        maxHeight = undefined,
        minWidth = undefined,
        minHeight = undefined,
        padding = undefined,
        margin = undefined,
        className = undefined,
        customStyle = "", // Дополнительные пользовательские стили строкой
    }: IOhaeLayoutConfig = $props();

    const calculatedStyles = $derived(
        calculateLayoutStyles({
            align,
            valign,
            collapsed,
            direction,
            padding,
            margin,
        }),
    );

    asignLayoutProps(() => $host(), {
        flex,
        overflow,
        overflowX,
        overflowY,
        width,
        height,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        collapsed,
    });

    useShadowTheme(() => $host().shadowRoot);
</script>

<div
    class="slot {className}"
    style:flex-direction={calculatedStyles.finalFlexDirection}
    style:align-items={calculatedStyles.finalAlignItems}
    style:justify-content={calculatedStyles.finalJustifyContent}
    style:padding={calculatedStyles.paddingStyle}
    style:margin={calculatedStyles.marginStyle}
    style={customStyle}
>
    <slot></slot>
</div>

<style>
    :host,
    .slot {
        box-sizing: border-box;
        border: none;
        padding: 0;
        margin: 0;
    }

    :host {
        flex: 1 1 0;
        overflow: auto;
        border-radius: 3px;
        width: 100%;
    }

    .slot {
        display: flex;
        flex-direction: column;
        align-content: stretch;
        align-items: stretch;

        overflow: visible;
        width: 100%;
        height: 100%;
    }
</style>
```

#### useShadowTheme.ts
```
import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const themeStore: Writable<string> = writable('/themes/theme-default-light.css'); // Пример значения

export function useShadowTheme(getShadowRoot: () => ShadowRoot | null): void {
  let themeLinkElement: HTMLLinkElement | null = null;

  onMount(() => {
    const shadowRoot = getShadowRoot();

    if (!shadowRoot) {
      console.warn('[useShadowTheme] ShadowRoot is not available on mount.');
      return;
    }
    
    let existingLink = shadowRoot.querySelector('link[rel="stylesheet"][data-managed-theme="true"]');

    if (existingLink) {
      themeLinkElement = existingLink as HTMLLinkElement;
    } else {
      themeLinkElement = document.createElement('link');
      themeLinkElement.rel = 'stylesheet';
      themeLinkElement.setAttribute('data-managed-theme', 'true');

      let unsubscribeFromInitial: (() => void) | null = null; // Объявляем заранее
      unsubscribeFromInitial = themeStore.subscribe(initialThemePath => {
        if (themeLinkElement) {
            themeLinkElement.href = initialThemePath;
        }
        if (unsubscribeFromInitial) { // Проверяем, что функция была присвоена
          unsubscribeFromInitial(); // Теперь это безопасно
          unsubscribeFromInitial = null; // Очищаем, чтобы не вызвать дважды случайно
        }
      });

      shadowRoot.appendChild(themeLinkElement);
      shadowRoot.host.classList.add('host');
    }

    const unsubscribeFromUpdates = themeStore.subscribe(newThemePath => {
      if (themeLinkElement && themeLinkElement.href !== newThemePath) {
        themeLinkElement.href = newThemePath;
      }
    });

    return () => {
      unsubscribeFromUpdates();
    };
  });
}
```

#### layoutUtils.ts
```
import { onMount } from "svelte";
import { alignItemsMap, justifyContentMap, type ICalculatedLayoutStyles, type ILayoutSizeProps, type ILayoutStyleProps, type TFlexDirection } from "./OhaeViewOptions";

function formatSpacingValue(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    return String(value); // Позволяет передавать строки типа "1em", "5px 10px", и т.д.
}

function getDisplayValue(collapsed: boolean | undefined): string {
    return collapsed ? "none" : "flex";
}

export function calculateLayoutStyles(props: ILayoutStyleProps): ICalculatedLayoutStyles {
    const finalDisplay = getDisplayValue(props.collapsed);
    const finalFlexDirection = props.direction ?? "column";
    const isRowDirection = finalFlexDirection === "row" || finalFlexDirection === "row-reverse";

    const finalJustifyContent = justifyContentMap[props.align as keyof typeof justifyContentMap] || props.align || "flex-start";
    const finalAlignItems = alignItemsMap[props.valign as keyof typeof alignItemsMap] || props.valign || "stretch";

    const paddingStyle = formatSpacingValue(props.padding);
    const marginStyle = formatSpacingValue(props.margin);

    return {
        finalDisplay,
        finalFlexDirection,
        isRowDirection,
        finalJustifyContent,
        finalAlignItems,
        paddingStyle,
        marginStyle,
    };
}


export function determineResizerDirection(host: HTMLElement | undefined): TFlexDirection | null {
    if (!host) return null;

    if (host.parentElement) {
        const parentElement = host.parentElement;
        let parentFlexDirection: TFlexDirection | "" = "";

        const flexDirAttribute = parentElement.getAttribute('direction') as TFlexDirection | "";
        
        if (["row", "row-reverse", "column", "column-reverse"].includes(flexDirAttribute)) {
            parentFlexDirection = flexDirAttribute;
        } else {
            parentFlexDirection = getComputedStyle(parentElement).flexDirection as TFlexDirection;
        }

        if (parentFlexDirection === "column" || parentFlexDirection === "column-reverse") {
            return "row"; // Родитель - колонка, ресайзер - горизонтальный
        } else {
            return "column"; // Родитель - строка, ресайзер - вертикальный
        }
    }
    console.warn(">>>", 6, null);
    return null;
}

export function asignLayoutProps(getHost: () => HTMLElement | null, sizeProps: ILayoutSizeProps): void {
    onMount(() => {
    const host = getHost();
    if(!host) return;
    const style = host.style;

    // if(sizeProps.width) style.width = sizeProps.width.toString();
    // if(sizeProps.height) style.height = sizeProps.height.toString();
    if(sizeProps.maxWidth) style.maxWidth = sizeProps.maxWidth.toString()+'px';
    if(sizeProps.maxHeight) style.maxHeight = sizeProps.maxHeight.toString()+'px';
    if(sizeProps.minWidth) style.minWidth = sizeProps.minWidth.toString()+'px';
    if(sizeProps.minHeight) style.minHeight = sizeProps.minHeight.toString()+'px';

    
    if(sizeProps.flex) style.flexGrow = sizeProps.flex.toString();
    style.display = getDisplayValue(sizeProps.collapsed);
    
    if(sizeProps.overflow) style.overflow = sizeProps.overflow;
    if(sizeProps.overflowX) style.overflowX = sizeProps.overflowX;
    if(sizeProps.overflowY) style.overflowY = sizeProps.overflowY;
  });
}
```

#### Color.ts
```
type UnknowColor = string | { r: number; g: number; b: number; a?: number } | null;
interface IRgba {
    r: number;
    g: number;
    b: number;
    a: number
};

interface IHsla {
    h: number;
    s: number;
    l: number;
    a: number
};

export class Color implements IRgba {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(color: UnknowColor) {
        const rgba = Color.parse(color);
        this.r = rgba.r;
        this.g = rgba.g;
        this.b = rgba.b;
        this.a = rgba.a;
    }

    /** Парсинг цвета из строкового представления */
    static parse(color: UnknowColor): IRgba {
        if (!color) {
            return { r: 0, g: 0, b: 0, a: 1 };
        }

        if (typeof color !== 'string') {
            return { ...color, a: color.a ?? 1 };
        }

        color = color.trim().toLowerCase();

        // HEX #RGB, #RGBA, #RRGGBB, #RRGGBBAA
        let hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
        if (hexMatch) {
            let hex = hexMatch[1];

            if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
            if (hex.length === 4) hex = hex.split("").map(x => x + x).join("");

            if (hex.length === 6 || hex.length === 8) {
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
                return { r, g, b, a };
            }
        }

        // RGB(A)
        let rgbaMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/);
        if (rgbaMatch) {
            const r = Math.min(255, parseInt(rgbaMatch[1], 10));
            const g = Math.min(255, parseInt(rgbaMatch[2], 10));
            const b = Math.min(255, parseInt(rgbaMatch[3], 10));
            const a = rgbaMatch[4] !== undefined ? Math.min(1, parseFloat(rgbaMatch[4])) : 1;
            return { r, g, b, a };
        }

        // HSL(A)
        let hslaMatch = color.match(/^hsla?\(\s*(-?\d+)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/);
        if (hslaMatch) {
            let h = parseInt(hslaMatch[1], 10) % 360;
            if (h < 0) h += 360;
            let s = Math.min(1, parseInt(hslaMatch[2], 10) / 100);
            let l = Math.min(1, parseInt(hslaMatch[3], 10) / 100);
            let a = hslaMatch[4] !== undefined ? Math.min(1, parseFloat(hslaMatch[4])) : 1;

            const { r, g, b } = Color.hslToRgba(h, s, l, a);
            return { r, g, b, a };
        }

        throw new Error(`Неверный формат цвета: ${color}`);
    }

    getRgba(): IRgba {
        return { r: this.r, g: this.g, b: this.b, a: this.a }
    }

    /** Конвертация HSL → RGB */
    private static hslToRgba(h: number, s: number, l: number, a: number = 1): IRgba {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hueToRgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            h /= 360;

            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
    }

    /** Конвертация RGB → HSL */
    private toHSL(): IHsla {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s, l, a: this.a };
    }


    /** Возвращает цвет в формате HSL или HSLA */
    get hsl(): string {
        let { h, s, l, a } = this.toHSL();
        return `hsl(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)`;
    }

    get hsla(): string {
        let { h, s, l, a } = this.toHSL();
        return `hsla(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%, ${this.a.toFixed(2)})`;
    }

    /** Возвращает цвет в формате HEX */
    get hex(): string {
        const r = this.r.toString(16).padStart(2, "0");
        const g = this.g.toString(16).padStart(2, "0");
        const b = this.b.toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }

    /** Возвращает цвет в формате HEX */
    get hexa(): string {
        const r = this.r.toString(16).padStart(2, "0");
        const g = this.g.toString(16).padStart(2, "0");
        const b = this.b.toString(16).padStart(2, "0");
        const a = Math.round(this.a * 255).toString(16).padStart(2, "0");
        return `#${this.hex}${this.a < 1 ? a : ""}`;
    }

    /** Возвращает цвет в формате RGB или RGBA */
    get rgb(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    get rgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a.toFixed(2)})`;
    }

    get middle(): number {
        const middle = Math.round((this.r + this.g + this.b) / 3);
        return middle;
    }


    /** Изменение оттенка (Hue) */
    hue(degrees: number): Color {
        let hsla = this.toHSL();
        hsla.h = (hsla.h + degrees) % 360;
        if (hsla.h < 0) hsla.h += 360;

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение насыщенности (Saturation) */
    saturation(factor: number): Color {
        let hsla = this.toHSL();
        hsla.s = Math.max(0, Math.min(1, hsla.s * factor));

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (Brightness) */
    brightness(factor: number): Color {
        let hsla = this.toHSL();
        hsla.l = Math.max(0, Math.min(1, hsla.l * factor));

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (сдвиг цвета) */
    shift(factor: number): Color {
        let rgba = this.getRgba();
        rgba.r = (rgba.r + factor + 256) % 256;
        rgba.g = (rgba.g + factor + 256) % 256;
        rgba.b = (rgba.b + factor + 256) % 256;
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (сдвиг цвета) */
    mono(): Color {
        let rgba = this.getRgba();
        const middle = this.middle;
        rgba.r = middle;
        rgba.g = middle;
        rgba.b = middle;
        const color = new Color(rgba);
        return color;
    }

    opacity(opacity: number): Color {
        let rgba = this.getRgba();
        rgba.a = Math.min(1, Math.max(0, opacity));
        const color = new Color(rgba);
        return color;
    }


    contrast(factor: number): Color {
        let rgba = this.getRgba();
        let size = 255 * factor;
        if (this.middle >= 128) size = -size
        rgba.r = Math.min(255, Math.max(1, rgba.r + size));
        rgba.g = Math.min(255, Math.max(1, rgba.g + size));
        rgba.b = Math.min(255, Math.max(1, rgba.b + size));
        const color = new Color(rgba);
        return color;
    }

}
```

#### OhaeResizerView.svelte
```
<svelte:options customElement={{ tag: "ohae-resizer" }} />

<script lang="ts">
    import type { KeyboardEventHandler } from "svelte/elements";
    import { determineResizerDirection } from "../../lib/layoutUtils";
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import type { TFlexDirection } from "./OhaeLayoutTypes";
    import type { IOhaeResizerConfig } from "./OhaeResizerTypes";

    export const resizeDeny: boolean = true;

    let {
        className = undefined,
    }: IOhaeResizerConfig = $props();

    interface IElement {
        element: HTMLElement;
        initialSize: number;
        minSize: number;
        maxSize: number;
        newSize: number;
    }

    let isDragging = $state(false);
    let startX = 0;
    let startY = 0;
    let beforeElements: IElement[] = [];
    let afterElements: IElement[] = [];
    let currentDragDelta = 0; // Это Math.abs(mouseDelta)

    let direction = $derived(
        determineResizerDirection($host()),
    ) as TFlexDirection;
    let isRowDirection: boolean = $derived(direction === "row");

    useShadowTheme(() => $host().shadowRoot);

    function getElementSize(element: HTMLElement): number {
        return isRowDirection ? element.offsetHeight : element.offsetWidth;
    }

    function getElementMinSize(element: HTMLElement): number {
        const style = getComputedStyle(element);
        const layoutLike = element as any;
        return (
            parseFloat(
                isRowDirection
                    ? (layoutLike.minHeight ??
                          element.getAttribute("min-height") ??
                          style.minHeight)
                    : (layoutLike.minWidth ??
                          element.getAttribute("min-width") ??
                          style.minWidth),
            ) || 0
        );
    }

    function getElementMaxSize(element: HTMLElement): number {
        const style = getComputedStyle(element);
        const layoutLike = element as any;
        return (
            parseFloat(
                isRowDirection
                    ? (layoutLike.maxHeight ??
                          element.getAttribute("max-height") ??
                          style.maxHeight)
                    : (layoutLike.maxWidth ??
                          element.getAttribute("max-width") ??
                          style.maxWidth),
            ) || Infinity
        );
    }

    function getResizedElemens(): HTMLElement[] {
        const parentElement = $host().parentElement;
        if (!parentElement) return [];
        const parentSlot =
            parentElement.shadowRoot?.querySelector(".resizer") ??
            parentElement.querySelector(".resizer") ??
            parentElement;
        const children = Array.from(parentSlot.children) as HTMLElement[];
        return children.filter((item) => !!item);
    }

    function logElementsSizes(): void {
        return;
        console.log("===========================");
        const children = getResizedElemens();
        children.forEach((element) => {
            const flexSize = getElementSize(element);
            const size = isRowDirection
                ? element.offsetHeight
                : element.offsetWidth;
            console.log(element.tagName, "size", size, flexSize);
        });
        console.log("---------------------------");
    }

    function storeElements(): void {
        const selfElement = $host();
        if (!selfElement.parentElement) return;

        const children = getResizedElemens();
        beforeElements = [];
        afterElements = [];
        let isBefore = true;

        children.forEach((element) => {
            if (element === selfElement) {
                isBefore = false;
                return;
            }

            const isHTMLElement = element instanceof HTMLElement;
            const isVisible = getComputedStyle(element).display !== "none";
            const isResizeDeny = "resizeDeny" in element;
            const isNeedIgnore = !isHTMLElement || !isVisible || isResizeDeny;
            if (isNeedIgnore) return;

            const size = getElementSize(element);
            const minSize = getElementMinSize(element);
            const maxSize = getElementMaxSize(element);

            const data: IElement = {
                element,
                initialSize: size,
                minSize,
                maxSize,
                newSize: size,
            };
            if (isBefore) beforeElements.unshift(data);
            else afterElements.push(data);
        });
        logElementsSizes();
    }

    function decreaseSizeRecursive(
        items: IElement[],
        deltaToDistribute: number,
    ): void {
        const item = items.shift();
        if (!item) {
            currentDragDelta -= deltaToDistribute;
            return;
        }
        const canDecreaseBy = item.initialSize - item.minSize;
        const actualDecrease = Math.min(deltaToDistribute, canDecreaseBy);
        item.newSize = item.initialSize - actualDecrease;

        if (actualDecrease <= deltaToDistribute) {
            decreaseSizeRecursive(items, deltaToDistribute - actualDecrease);
        } else {
            currentDragDelta -= deltaToDistribute;
        }
    }

    function increaseSizeRecursive(
        items: IElement[],
        deltaToDistribute: number,
    ): void {
        const item = items.shift();
        if (!item) {
            currentDragDelta -= deltaToDistribute;
            return;
        }
        const canIncreaseBy = item.maxSize - item.initialSize;
        const actualIncrease = Math.min(deltaToDistribute, canIncreaseBy);
        item.newSize = item.initialSize + actualIncrease;

        if (actualIncrease <= deltaToDistribute) {
            increaseSizeRecursive(items, deltaToDistribute - actualIncrease);
        } else {
            currentDragDelta -= deltaToDistribute;
        }
    }

    function applyNewSizes(): void {
        const allAffectedElements = [...beforeElements, ...afterElements];
        allAffectedElements.forEach((item) => {
            item.element.style.flexGrow = `${item.newSize}`;
        });
    }

    function handleTouchDown(event: TouchEvent): void {
        isDragging = true;
        startX = event.touches[0]?.clientX ?? 0;
        startY = event.touches[0]?.clientY ?? 0;
        storeElements();

        window.addEventListener("touchmove", handleMouseMove);
        window.addEventListener("touchend", handleMouseUp);
    }

    function handleMouseDown(event: MouseEvent): void {
        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        storeElements();

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    function getMouseDelta(event: MouseEvent | TouchEvent): number {
        let clientX: number, clientY: number;

        if (event instanceof TouchEvent) {
            // Берём первый палец (обычно этого достаточно)
            clientX = event.touches[0]?.clientX ?? 0;
            clientY = event.touches[0]?.clientY ?? 0;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const mouseDelta = isRowDirection ? clientY - startY : clientX - startX;

        return mouseDelta;
    }

    function applyResize(delta: number): void {
        if (delta === 0) return;

        currentDragDelta = Math.abs(delta);

        beforeElements.forEach((el) => (el.newSize = el.initialSize));
        afterElements.forEach((el) => (el.newSize = el.initialSize));

        if (delta < 0) {
            decreaseSizeRecursive([...beforeElements], currentDragDelta);
            increaseSizeRecursive([...afterElements], currentDragDelta);
            decreaseSizeRecursive([...beforeElements], currentDragDelta); // Повторный вызов из оригинала
        } else if (delta > 0) {
            increaseSizeRecursive([...beforeElements], currentDragDelta);
            decreaseSizeRecursive([...afterElements], currentDragDelta);
            increaseSizeRecursive([...beforeElements], currentDragDelta); // Повторный вызов из оригинала
        }
        applyNewSizes();
    }

    function handleMouseMove(event: MouseEvent | TouchEvent): void {
        if (!isDragging) return;
        const mouseDelta = getMouseDelta(event);
        applyResize(mouseDelta);
    }

    function handleMouseUp(): void {
        if (!isDragging) return;
        isDragging = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
        logElementsSizes();
    }

    // --- NEW: Keyboard handling ---
    const KEYBOARD_STEP = 10; // pixels to move per key press

    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
        let delta = 0;
        let relevantKeyPress = false;

        if (isRowDirection) {
            // Vertical resizer
            if (event.key === "ArrowUp") {
                delta = -KEYBOARD_STEP;
                relevantKeyPress = true;
            } else if (event.key === "ArrowDown") {
                delta = KEYBOARD_STEP;
                relevantKeyPress = true;
            }
        } else {
            // Horizontal resizer (direction === "column")
            if (event.key === "ArrowLeft") {
                delta = -KEYBOARD_STEP;
                relevantKeyPress = true;
            } else if (event.key === "ArrowRight") {
                delta = KEYBOARD_STEP;
                relevantKeyPress = true;
            }
        }

        if (relevantKeyPress) {
            event.preventDefault(); // Prevent page scrolling

            // For keyboard, each press is a discrete operation, so we store elements each time.
            storeElements();

            // Apply the resize with the determined delta
            applyResize(delta);

            logElementsSizes(); // For debugging if needed
        }
    };
    // --- END NEW: Keyboard handling ---
</script>

<button
    type="button"
    class="slot resizer {className}"
    class:cols={direction === "column"}
    class:rows={direction === "row"}
    class:dragging={isDragging}
    style:width={direction === "column" ? "2px" : "100%"}
    style:min-width={direction === "column" ? "2px" : undefined}
    style:max-width={direction === "column" ? "2px" : undefined}
    style:height={direction === "row" ? "2px" : "100%"}
    style:min-height={direction === "row" ? "2px" : undefined}
    style:max-height={direction === "row" ? "2px" : undefined}
    tabindex="0"
    onmousedown={handleMouseDown}
    ontouchstart={handleTouchDown}
    onkeydown={handleKeyDown}
    aria-label="Resize panel"
>
    <span class="overlay"></span>
    <span class="interactive"></span>
</button>

<style>
    :host,
    .resizer {
        box-sizing: border-box;
        background-color: transparent;
        border: none;
        padding: 0;
        margin: 0;
    }

    :host {
        /* flex: 0 0 4px; */
        padding: 0px;
    }

    .resizer {
        /* margin: 1px; */
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative; /* Оверлеи будут absolutely positioned относительно этого div */
        user-select: none;
        touch-action: none;
    }

    .resizer:focus {
        outline: none; /* Полностью убирает стандартный outline */
    }

    .resizer.cols {
        cursor: col-resize;
    }

    .resizer.rows {
        cursor: row-resize;
    }

    .resizer.cols .overlay {
        background: url("data:image/gif;base64,R0lGODlhAwAdAIABAJWr7f///yH5BAEAAAEALAAAAAADAB0AAAIQRBynaaje0pORrWnhrbi3AgA7")
            no-repeat center center;
    }
    .resizer.rows .overlay {
        background: url("data:image/gif;base64,R0lGODlhHQADAIABAJWr7f///yH5BAEAAAEALAAAAAAdAAMAAAINRIynyesBo5y0tuswKgA7")
            no-repeat center center;
    }

    .resizer.cols .interactive {
        transform: scaleX(4);
    }
    .resizer.rows .interactive {
        transform: scaleY(4);
    }

    .resizer.cols:hover .interactive,
    .resizer.cols.dragging .interactive,
    .resizer.cols:active .interactive {
        transform: scaleX(4);
    }
    .resizer.rows:hover .interactive,
    .resizer.rows.dragging .interactive,
    .resizer.rows:active .interactive {
        transform: scaleY(4);
    }

    .overlay,
    .interactive {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .interactive {
        background: transparent;
    }
</style>
```

### а так же образец css с темой

#### theme-default-dark.css
```
@import url("../fontawesome-free-6.7.2-web/css/all.min.css");

* {
    box-sizing: border-box;
}

:root {
    --background: #222;
    --color: #ccc;
    --margin: 0px;
    --paddind: 5px;
    background-color: #222;
}

:root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    font-size: 12px;

    color-scheme: light dark;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

}



/* ===== scrollbars CSS ===== */
/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: rgb(65, 94, 156) rgba(0, 0, 0, 0.2);
}
/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 16px;
}
*::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}
*::-webkit-scrollbar-thumb {
    background-color: rgb(65, 94, 156);
    border-radius: 10px;
    border: 1px none rgba(0, 0, 0, 0.2);
}



/* ===== resizers CSS ===== */
.slot.resizer{
    background-color: #292929;
}

.slot.resizer:focus {
    background-color: rgb(65, 94, 156);
}
.slot.resizer:hover {
    background-color: #191919;
}

.slot.resizer:active,
.slot.resizer.dragging{
    background-color: #555;
}


/* ===== personal elements CSS ===== */
.body.host {
    background-color: transparent;
    color: #ccc;
}

.header.host {
    background-color: #181818;
    color: #ccc;
}

.footer.host {
    background-color: #181818;
    color: #ccc;
}

.top.host {
    background-color: #383030;
    color: #dcc;
}
.top.slot {
    margin: 0 0px 0px 0;
    padding: 5px;
}

.bottom.host {
    background-color: #303830;
    color: #cdc;
}

.bottom.slot {
    margin: 0px 0px 0 0;
    padding: 5px;
}


.right.host {
    background-color: #303038;
    color: #ccd;
}

.right.slot {
    margin: 0 0 0 0px;
    padding: 5px;
}
```

## я хочу по аналогии переделать следующий webcomponent в компонент svelte версии 5.28. Важно, там где возможно сохранить логику как она есть. внутреннее содержимое в виде babItem-ов инитится из jsonRenderer.ts путем appendChild. Если есть возможность для OhaeTabsView.svelte перехватывать вызов appendChild для того чтобы тут же добавлять TabButton - давай перехватим.

#### OhaeTabsView.ts
```
import { Color } from "../../utils/Color";
import { OhaeUI } from "../../OhaeUI";
import { IOhaeViewOptions } from "../../OhaeViewOptions";
import { OhaeBaseView } from "../base_view/OhaeBaseView";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeResizerView } from "../layout-view/OhaeResizerView";
import { OhaeTabItemButtonView } from "./OhaeTabItemButton";
import { OhaeTabItemView } from "./OhaeTabItemView";

type TabData = { tab: OhaeTabItemButtonView, view: OhaeTabItemView, index: number };

export class OhaeTabsView extends OhaeLayoutView {
    public static readonly ATTRIBUTES: string[] = [
        'tabsSide',
        'allowHideAll',
        'tabButtonBackground'
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            box-sizing: border-box;
            background-color:var(--host-bg, transparent);
            padding: 0px;
            margin: 0px;

            overflow: auto;
            height: auto;
            width: auto;

            /* flex-grow: 1; */
        }
        :host([tabsSide="top"]) {
            flex-direction: column;
        }		
        :host([tabsSide="bottom"]) {
            flex-direction: column-reverse;
        }		
        :host([tabsSide="left"]) {
            flex-direction: row;
        }		
        :host([tabsSide="right"]) {
            flex-direction: row-reverse;
        }		

        :host([backgroundColor]) {
            box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
            color: var(--host-color, #ddd);
        }

        .header {
            display: flex;
            height: 28px;
            /* background-color: #363c46; */
            color: #ссс;
            /* border-radius: 4px 4px 0 0; */
            justify-content: space-between;
            /* align-items: center; */
			padding: 0px 0px;
			margin: 0px 10px;
            cursor: pointer;
            font-weight: 500;
        }
        :host([tabsSide="top"]) .header{
            margin: -1px 10px;
        }

        :host([tabsSide="bottom"]) .header{
            margin: 1px 10px;
        }

        :host([tabsSide="left"]) .header, :host([tabsSide="right"]) .header{
            margin: 3px 0px;
            flex-direction: column;
            justify-content: flex-start;
            align-items: end;
        }
        :host([tabsSide="left"]) .header{
            margin: 3px 0px;
        }            
        :host([tabsSide="right"]) .header{
            margin: 3px 0px;
        }            

        .body {
            display: flex;
            flex-direction: column;
			border-radius: 3px;
            padding: 0px;

            overflow: auto;
            height: auto;
            width: auto;
            margin: 0px;
            flex-grow: 1;
        }
        .collapse {
            display: none;
        }
    </style>
    `;

    protected static readonly HTML = `
        <div class="header">
        </div>
        <div class="body">
            <slot></slot>
        </div>
    `;

    private currentTab: TabData | null = null;

    protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeTabsView.ATTRIBUTES);



        await this.initTabsFromChildren();
        this.tabsSide = this.tabsSide;

        if (this.allowHideAll) {
            this.hideAllTab();
        } else {
            const firstTab = this.firstElementChild as OhaeTabItemView;
            if (!firstTab) return;
            this.showTab(firstTab as OhaeTabItemView);
        }
        // const lastTab = this.lastElementChild as OhaeTabItemView;
        // if(!lastTab) return;
        // this.switchTab(firstTab, lastTab);

    }

    private async initTabsFromChildren(): Promise<void> {
        for (const child of this.items) {
            if (child instanceof OhaeTabItemView) {
                await this.initTab(child);
            }
        }
    }

    private async initTab(tabView: OhaeTabItemView, target?: OhaeTabItemView | number | string): Promise<OhaeTabItemButtonView | null> {
        if (!(tabView instanceof OhaeTabItemView)) return null;
        // console.log('button color', tabView.tabButtonBackground?.hex ?? this.tabButtonBackground?.hex);
        const headersContainer = this.shadowRoot!.querySelector('.header');
        return OhaeUI.createView({
            view: 'tab-button',
            flex: 1,
            side: this.tabsSide,
            backgroundColor: tabView.tabButtonBackground?.hex ?? this.tabButtonBackground?.hex,
            label: tabView.header,
            icon: tabView.icon,
            on: {
                click: (e: Event) => {
                    this.toggleTab(tabView);
                }
            }
        } as IOhaeViewOptions, headersContainer as OhaeTabItemView) as Promise<OhaeTabItemButtonView>;
    }

    private resolveTab(target: OhaeTabItemView | number | string): TabData | null {
        let view: OhaeTabItemView | null = null;
        if (target instanceof OhaeTabItemView) view = target;
        if (typeof target === 'number') view = this.items[target] as OhaeTabItemView;
        if (typeof target === 'string') view = this.items.find(tab => tab.id === target) as OhaeTabItemView ?? null;

        if (view === null) return null;

        const index = this.items.indexOf(view);
        if (index < 0) return null;

        return {
            index,
            view,
            tab: this.tabs[index]
        };
    }

    public getTab(target: OhaeTabItemView | number | string): TabData | null {
        const tabData = this.resolveTab(target);
        if (tabData === null) return null;
        return tabData;
    }

    public getCurrentTab(): TabData | null {
        return this.currentTab;
    }

    public removeTab(target: OhaeTabItemView | number | string): TabData | null {
        const tabData = this.resolveTab(target);
        if (tabData === null) return null;
        const headersContainer = this.shadowRoot!.querySelector('.header');

        if (!headersContainer) return null;

        this.removeChild(tabData.view);
        headersContainer?.removeChild(tabData.tab);
        return tabData;
    }


    public toggleTab(target: OhaeTabItemView | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;
        if (tabData.view.collapsed) {
            this.showTab(target);
        } else if (this.allowHideAll) {
            this.hideAllTab();
        }
    }
    public showTab(target: OhaeTabItemView | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;

        if (this.allowHideAll) {
            const parent = this.parentElement as OhaeBaseView;
            if (parent?.flex === 0) parent.flex = window.innerWidth;
        }

        this.hideAllTab();

        tabData.view.show();
        tabData.tab.current = true;
        this.currentTab = this.resolveTab(tabData.view);
    }

    public hideTab(target: OhaeTabItemView | number | string): void {
        const tabData = this.resolveTab(target);
        if (tabData === null) return;
        if (this.allowHideAll || tabData.view !== this.currentTab?.view) {
            tabData.view.hide();
            tabData.tab.current = false;
        }
        if (tabData.view === this.currentTab?.view) {
            this.currentTab = null;
        }
        return;
    }

    public hideAllTab(): void {
        if (this.allowHideAll) {
            const parent = this.parentElement as OhaeBaseView;
            if (parent) parent.flex = 0;
        }
        this.items.forEach(child => {
            const tabData = this.resolveTab(child);
            if (tabData === null) return;
            tabData.view.hide();
            tabData.tab.current = false;
        });
        this.currentTab = null;
    }

    public switchTab(source: OhaeTabItemView | number | string, target: OhaeTabItemView | number | string): TabData | null {
        this.shiftTab(source, target);
        this.shiftTab(target, this.firstElementChild as OhaeTabItemView);
        return this.currentTab;
    }

    public shiftTab(source: OhaeTabItemView | number | string, target: OhaeTabItemView | number | string): TabData | null {
        const headersContainer = this.shadowRoot!.querySelector('.header');
        if (!headersContainer) return null;

        const sourceTabData = this.resolveTab(source);
        const targetTabData = this.resolveTab(target);
        if (sourceTabData === null) return null;
        if (!sourceTabData || !targetTabData) return null;

        this.insertBefore(sourceTabData.view, targetTabData.view);
        headersContainer.insertBefore(sourceTabData.tab, targetTabData.tab);

        this.updateCurrentTab();

        return sourceTabData;
    }

    private updateCurrentTab() {
        if (this.currentTab) {
            this.currentTab = this.resolveTab(this.currentTab.view);
        }
    }

    // Getters/Setters
    get items(): OhaeTabItemView[] {
        const children = Array.from(this.children) as OhaeTabItemView[];
        return children;
    }

    get tabs(): OhaeTabItemButtonView[] {
        const headersContainer = this.shadowRoot!.querySelector('.header');
        if (!headersContainer) return [];

        const children = Array.from(headersContainer.children) as OhaeTabItemButtonView[];
        return children;
    }

    get tabsSide(): Side {
        const value = this.getAttribute('tabsSide');
        return OhaeTabItemButtonView.getSide(value);
    }
    set tabsSide(value: Side | null) {
        value = OhaeTabItemButtonView.getSide(value)
        this.setAttribute('tabsSide', value);
        this.tabs.forEach(tab => tab.side = value);
    }

    get allowHideAll(): boolean {
        return this.getAttribute('allowHideAll') === 'true';
    };
    set allowHideAll(value: boolean | string | null) {
        value = value === true || value === 'true';

        if (value) {
            this.setAttribute('allowHideAll', value.toString());
        } else {
            this.removeAttribute('allowHideAll');
        }
    }

    set tabButtonBackground(value: string | Color | null){
		if(!value) return;
		const color = typeof value === 'string' ? new Color(value) : value;
        // const color = new Color("#433");
        this.setAttribute('tabButtonBackground', color.hex)
	}

	get tabButtonBackground(): Color | null{
        const tabBgColor = this.getAttribute('tabButtonBackground');
        return tabBgColor ? new Color( tabBgColor) : null;
	}
}

OhaeUI.registerViewType('tabs', OhaeTabsView);

export type Side = 'top' | 'bottom' | 'left' | 'right';

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        allowHideAll?: string | boolean;
        tabsSide?: Side;
        tabButtonBackground?: string;
    }
}

```



