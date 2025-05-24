// import { OhaeUI } from '../../OhaeUI';
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
customElements.define('ohae-layout-old', OhaeLayoutView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        collapsed?: boolean | string;
        direction?: LayoutDirection;
        overflow?: string;
        overflowX?: string;
        overflowY?: string;
    }
}
