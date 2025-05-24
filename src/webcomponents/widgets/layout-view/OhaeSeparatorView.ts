import { OhaeUI } from '../../OhaeUI';
import { SizeNumber } from '../../utils/SizeNumber';
import { OhaeLayoutView } from './OhaeLayoutView';

export class OhaeSeparatorView extends OhaeLayoutView {
	public static readonly ATTRIBUTES: string[] = [
		// 'direction',
		'size',
		'padding',
		'margin',
		'backgroundColor'
	];
	
	protected static readonly STYLES: string = `
        <style>
            :host {
                display: block;
                margin: 1px;
				padding: 0px;
                background-color: #222;
			}
        </style>
	`;

	static get observedAttributes() {
		return [...this.ATTRIBUTES];
	}

	protected override async createCallback() {
		await super.createCallback();
		this.setAttribute('direction', this.isRows() ? 'rows' : 'cols');
		this.applyAttributes(OhaeLayoutView.ATTRIBUTES);
		this.applyDirrection();
	}

	protected applyDirrection() {
		if (!this.isConnected) return;
		// console.log(this.isRows());
		if (this.isRows()) {
			// this.style.width = '100%';
			this.style.height = this.size;
			this.style.minHeight = this.size;
			this.style.maxHeight = this.size;
		} else {
			this.style.width = this.size;
			this.style.minWidth = this.size;
			this.style.maxWidth = this.size;
			// this.style.height = '100%';
		}
	}

	private isRows(): boolean {
		const container = this.parentElement as HTMLElement;
		return container.getAttribute('direction') === 'rows';
	}

	get size(): string {
		return this.getAttribute('size') ?? '1px';
	}
	set size(value: string | number | null) {
		if (value === null) return;
		const number = new SizeNumber(value);
		const parsedValue = number.toString();
		this.setAttribute('size', parsedValue);
		this.applyDirrection();
	}
}

OhaeUI.registerViewType('separator', OhaeSeparatorView);
