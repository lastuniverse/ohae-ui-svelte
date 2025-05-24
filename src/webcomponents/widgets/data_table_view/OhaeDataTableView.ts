import "./OhaeDataTableBodyView";
import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeDataTableBodyView } from "./OhaeDataTableBodyView";
import { OhaeDataTableHeadView } from "./OhaeDataTableHeadView";
import { DataTableRow } from "./OhaeDataTableRowView";
import { Color } from "../../utils/Color";
import { IOhaeViewOptions } from "../../OhaeViewOptions";

export interface DataTableColumn {
	id: string;
	header: string;
	width?: number | string;
	rowHeight?: number | string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	editable?: boolean;
	inputType?: string; // Исправлено: inpuType -> inputType
	componentOptions?: IOhaeViewOptions;
}


export class OhaeDataTableView extends OhaeLayoutView {
	static readonly ATTRIBUTES = [
		// 'columns',
		// 'data',
		'striped',
		'hover',
		'rowHeight',
		'enableSorting',
		'enableDragging'
	];

	protected static readonly STYLES = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
                box-sizing: border-box;
			}
            .table-header, .body-container {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .header-cell {
                padding: 0 5px;
                border-bottom: 1px solid var(--host-border, #eee);
                border-right: 1px solid var(--host-border, #eee);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .header-cell {
                background-color: var(--host-head-bg, #222);
                color: var(--host-head-color, #fff);
                font-weight: 500;
                position: sticky;
                top: 0;
            }
        </style>
		<link rel="stylesheet" href="./external.css">
    `;

	protected static readonly HTML: string = `
		<div class="table-container">
			<ohae-datatable-head class="header-container"></ohae-datatable-head>
			<ohae-datatable-body class="body-container"></ohae-datatable-body>
		</div>
    `;

	private _tableView?: HTMLDivElement;
	private _headView?: OhaeDataTableHeadView;
	private _bodyView?: OhaeDataTableBodyView;

	protected override async createCallback() {
		await super.createCallback();
		this.applyAttributes(OhaeDataTableView.ATTRIBUTES);
		this.updateData(this.initData.data ?? [], this.initData.columns ?? []);
		this.udateEnableRowSorting();		
	}

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.ATTRIBUTES];
	}

	protected get tableView(): HTMLDivElement {
		this._tableView = this._tableView ?? this.shadowRoot?.querySelector('div.table-container') as HTMLDivElement;
		return this._tableView;
	}
	protected get headView(): OhaeDataTableHeadView {
		if (this._headView instanceof OhaeDataTableHeadView) return this._headView;
		this._headView = this._headView ?? this.shadowRoot?.querySelector('ohae-datatable-head') as OhaeDataTableHeadView;
		return this._headView;
	}
	protected get bodyView(): OhaeDataTableBodyView {
		this._bodyView = this._bodyView ?? this.shadowRoot?.querySelector('ohae-datatable-body') as OhaeDataTableBodyView;
		return this._bodyView;
	}

	private udateEnableRowSorting(): void {
		this.headView.removeEventListener('sort', this.handleSort as EventListener);
		if(this.enableSorting){
			this.headView.addEventListener('sort', this.handleSort as EventListener);
		}
	}

	private handleSort = (event: CustomEvent) => {
		this.bodyView?.sortData(event.detail.columnId);
	}

	protected async renderTable() {
		this.headView.renderHeader();
		this.bodyView.renderTable();
	}

	public updateData(newData?: any[]|null, newColumns?: DataTableColumn[]) {
		this.headView.updateData(newColumns);
		this.bodyView.updateData(newData, newColumns);

	}

	protected dispatchRowEvent(eventName: string, data: any) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail: data,
			bubbles: true,
			composed: true
		}));
	}

	get striped(): boolean {
		return this.getAttribute('striped') === 'true';
	}
	set striped(value: boolean | string | null) {
		this.setBooleanAttribute('striped', value);
		this.setBooleanAttribute('striped', value, this.bodyView);
	}

	get enableSorting(): boolean {
		return this.getAttribute('enableSorting') === 'true';
	}
	set enableSorting(value: boolean | string | null) {
		this.setBooleanAttribute('enableSorting', value);
		this.udateEnableRowSorting();
	}

	get enableDragging(): boolean {
		return this.getAttribute('enableDragging') === 'true';
	}
	set enableDragging(value: boolean | string | null) {
		this.setBooleanAttribute('enableDragging', value);
		this.setBooleanAttribute('enableDragging', value, this.bodyView);
	}


	get hover(): boolean {
		return this.getAttribute('hover') === 'true';
	}
	set hover(value: boolean) {
		this.setBooleanAttribute('hover', value);
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

		this.style.setProperty("--host-color", color.contrast(0.55).mono().hex);
		this.style.setProperty("--host-border", color.brightness(0.8).hex);

		this.style.setProperty("--host-head-bg", color.brightness(0.8).mono().hex);
		this.style.setProperty("--host-head-color", color.contrast(0.5).mono().hex);

		this.style.setProperty("--host-bg", color.hex);
		this.style.setProperty("--host-hover-bg", color.brightness(1.3).hex);

		this.style.setProperty("--host-striped-bg", color.brightness(0.92).hex);
		this.style.setProperty("--host-striped-hover_bg", color.brightness(1.3).hex);
	}

	get rowHeight(): string | null {
		return this.getAttribute('rowHeight');
	}
	set rowHeight(value: string | number | null) {
		if (value === null) return;
		const parsedValue = this.parseSizeValue(value);
		this.setAttribute('rowHeight', parsedValue);
		this.style.setProperty("--row-height", parsedValue);
	}
}

OhaeUI.registerViewType('datatable', OhaeDataTableView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
		data?: DataTableRow[];
		columns?: DataTableColumn[];
		rowHeight?: string | number;
		hover?: string | boolean;
		striped?: string | boolean;
		enableSorting?: string | boolean;
		enableDragging?: string | boolean;
    }
}
