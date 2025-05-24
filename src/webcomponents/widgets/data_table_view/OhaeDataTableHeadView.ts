import { OhaeUI } from "../../OhaeUI";
import { IOhaeViewOptions } from "../../OhaeViewOptions";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";

export interface DataTableColumn {
    id: string;
    header: string;
    width?: number | string;
    rowHeight?: number | string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    editable?: boolean;
    inputType?: string;
    componentOptions?: IOhaeViewOptions;
}

export class OhaeDataTableHeadView extends OhaeLayoutView {
    static readonly ATTRIBUTES = [
		'columns',
		'sort-column',
		'sort-dir',
	];

    protected static readonly STYLES = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
                box-sizing: border-box;
            }

			.header-container {
				display: flex;
				flex-direction: row;
				align-items: center;
				overflow-x: hidden;
				white-space: nowrap;
				padding: 0;
				margin: 0;
				background-color: var(--host-head-bg, #222);
				color: var(--host-head-color, #fff);
				font-weight: 500;
				border-bottom: 1px solid var(--host-border, #eee);
				position: sticky;
				top: 0;
				box-sizing: border-box;
				min-width: 100%;
				user-select: none;
				font-weight: 600;
				font-size: smaller;
			}

			.header-cell {
				flex: 1 1 0; /* Занимает оставшееся пространство */
				padding: 0 5px;
				border-right: 1px solid var(--host-border, #eee);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				position: relative;
				box-sizing: border-box;
				min-width: 0; /* важно, чтобы текст обрезался */
				cursor: default;
			}

			/* Ячейки с фиксированной шириной */
			.header-cell[data-fixed-width] {
				flex: 0 0 auto;
				min-width: var(--cell-width);
				width: var(--cell-width);
				max-width: var(--cell-width);
			}
        </style>
		<link rel="stylesheet" href="./external.css">
    `;

    protected static readonly HTML: string = `<div class="header-container"></div>`;

	private _rowView?: HTMLDivElement;
    private columns: DataTableColumn[] = [];
    
    protected override async createCallback() {
		this.markAsInitDataReady();
        await super.createCallback();
		this.applyAttributes(OhaeDataTableHeadView.ATTRIBUTES);
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

	protected get rowView(): HTMLDivElement {
		this._rowView = this._rowView ?? this.shadowRoot?.querySelector('div.header-container') as HTMLDivElement;
		return this._rowView;
	}
	
    public updateData(columns?: DataTableColumn[]) {
		if(!columns) return;
        this.columns = columns;
        this.renderHeader();
    }

	protected override async render() {
		await super.render();
		this.renderHeader();
	}
    public renderHeader() {
		this.rowView.innerHTML = '';
		this.columns.forEach(columnData => {
			this.renderCell(columnData);
		});		
    }
    private renderCell(columnData: DataTableColumn) {
			const headerCell = document.createElement('div');
			headerCell.className = 'header-cell';
			
			if (columnData.width) {
				headerCell.setAttribute('data-fixed-width', 'true');
				const width = this.parseSizeValue(columnData.width ?? 'auto');
				headerCell.style.setProperty('--cell-width', width);
				headerCell.style.width = width;

			}

			headerCell.style.textAlign = columnData.align || 'left';
			headerCell.textContent = columnData.header;

			if (columnData.sortable) {
				headerCell.classList.add('sortable');
				headerCell.addEventListener('click', () => {
					this.dispatchEvent(new CustomEvent('sort', {
						detail: { columnId: columnData.id }
					}));
				});
			}
			this.rowView.appendChild(headerCell);
    }
}

OhaeUI.registerViewType('datatable-head', OhaeDataTableHeadView);

