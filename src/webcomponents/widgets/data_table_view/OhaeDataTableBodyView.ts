import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { DataTableColumn } from "./OhaeDataTableHeadView";
import { DataTableRow, OhaeDataTableRowView } from "./OhaeDataTableRowView";

export class OhaeDataTableBodyView extends OhaeLayoutView {
	static readonly ATTRIBUTES = [
		'striped',
		'hover',
		'rowHeight',
		'enableDragging',
	];

	protected static readonly STYLES = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
                box-sizing: border-box;
            }
			.data-cell {
                padding: 0 5px;
                /* border-bottom: 1px solid var(--host-border, #eee);
                border-right: 1px solid var(--host-border, #eee); */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
				background-color: var(--host-bg, #222);
			}	
            .data-cell:hover {
                background-color: var(--host-hover-bg, rgba(0,0,0,0.1));

            }
			.striped {
				border-bottom: none;
				border-right: none;
			}
			.striped .data-cell:nth-child(even) {
                background-color: var(--host-striped-bg, rgba(0,0,0,0.1));
            }
            
			.striped .data-cell:nth-child(even):hover {
                background-color: var(--host-striped-hover_bg, rgba(0,0,0,0.1));
            }
        </style>
		<link rel="stylesheet" href="./external.css">
    `;

	protected static readonly HTML: string = `<div class="body-container"></div>`;

	public draggedSection: OhaeDataTableRowView | null = null;
	private _bodyView?: HTMLDivElement;

	protected columns: DataTableColumn[] = [];
	protected data: any[] = [];
	private currentSort: { column: string; dir: 'asc' | 'desc' } | null = null;

	protected override async createCallback() {
		this.markAsInitDataReady();
		await super.createCallback();
		this.applyAttributes(OhaeDataTableBodyView.ATTRIBUTES);
		this.updateEnableDragging();
	}

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.ATTRIBUTES];
	}

	protected get bodyView(): HTMLDivElement {
		this._bodyView = this._bodyView ?? this.shadowRoot?.querySelector('div.body-container') as HTMLDivElement;
		return this._bodyView;
	}

	private updateEnableDragging(): void {
		this.bodyView.removeEventListener('dragover', this.handleDragOver as EventListener);
		this.bodyView.removeEventListener('drop', this.handleDrop as EventListener);
		const enableDragging = this.enableDragging;
		if(enableDragging){
			this.bodyView.addEventListener('dragover', this.handleDragOver as EventListener);
			this.bodyView.addEventListener('drop', this.handleDrop as EventListener);
		}
		Array.from(this.bodyView.children).find(row => {
			if(row instanceof OhaeDataTableRowView) row.enableDragging = enableDragging
		});		
	}

	private handleDragOver(event: DragEvent) {
		event.preventDefault();
		const section = event.target as OhaeDataTableRowView;
		if (section && this.draggedSection && section !== this.draggedSection) {
			const rect = section.getBoundingClientRect();
			const isAfter = event.clientY > rect.top + rect.height / 2;
			const target = isAfter ? section.nextElementSibling : section.previousElementSibling;
			if(target === this.draggedSection) return
			if (isAfter) {
				section.after(this.draggedSection);
			} else {
				section.before(this.draggedSection);
			}
		}
	}

	private handleDrop(event: DragEvent) {
		event.preventDefault();
		this.draggedSection = null;
	}

	public async renderTable() {
		await this.onReady;
		this.bodyView.innerHTML = '';
		this.data.forEach(async item => {
			const row = new OhaeDataTableRowView();
			row.enableDragging = this.enableDragging;
			row.classList.add('data-cell');
			this.bodyView.appendChild(row);
			await row.setData(this.columns, item);
			row.addEventListener('click', () => this.dispatchRowEvent('row-click', item));
		});
	}

	public sortData(columnId: string) {
		if (!this.columns.find(c => c.id === columnId)?.sortable) return;

		const dir = this.currentSort?.column === columnId
			? (this.currentSort.dir === 'asc' ? 'desc' : 'asc')
			: 'asc';

		this.data.sort((a, b) => {
			const valA = a[columnId];
			const valB = b[columnId];

			if (typeof valA === 'number' && typeof valB === 'number') {
				return dir === 'asc' ? valA - valB : valB - valA;
			}
			return dir === 'asc'
				? String(valA).localeCompare(String(valB))
				: String(valB).localeCompare(String(valA));
		});

		this.currentSort = { column: columnId, dir };
		this.renderTable();
	}

	public getRow(id: number | string): OhaeDataTableRowView | undefined {
		return Array.from(this.bodyView.children).find(row => {
			return row instanceof OhaeDataTableRowView && row.dataset.id === String(id);
		}) as OhaeDataTableRowView | undefined;
	}

	protected dispatchRowEvent(eventName: string, data: any) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail: data,
			bubbles: true,
			composed: true
		}));
	}

	public updateData(newData?: any[]|null, newColumns?: DataTableColumn[]) {
		this.data = newData ?? this.data;
		this.columns = newColumns ?? this.columns;
		// console.log("renderTable", "!!!!")
		this.renderTable();
	}


	get striped(): boolean {
		return this.getAttribute('striped') === 'true';
	}
	set striped(value: boolean | string | null) {
		value = this.setBooleanAttribute('striped', value);
		if (value) {
			this.bodyView?.classList.add('striped');
		} else {
			this.bodyView?.classList.remove('striped');
		}
	}

	get enableDragging(): boolean {
		return this.getAttribute('enableDragging') === 'true';
	}
	set enableDragging(value: boolean | string | null) {
		this.setBooleanAttribute('enableSorting', value);
		this.updateEnableDragging();
	}

	get hover(): boolean {
		return this.getAttribute('hover') === 'true';
	}
	set hover(value: boolean) {
		this.setBooleanAttribute('hover', value);
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

OhaeUI.registerViewType('datatable-body', OhaeDataTableBodyView);


declare module "../../OhaeViewOptions" {
	interface IOhaeViewOptions {
		data?: DataTableRow[];
		columns?: DataTableColumn[];
		rowHeight?: string | number;
		hover?: string | boolean;
		striped?: string | boolean;
		enableDragging?: string | boolean;
	}
}



// public addRow(row: DataTableRow | OhaeDataTableRowView): number | string {
// 	const newRowView = row instanceof OhaeDataTableRowView ? row : new OhaeDataTableRowView();

// 	if (!(row instanceof OhaeDataTableRowView)) {
// 		const rowData = row as DataTableRow;
// 		if (!rowData.id) {
// 			rowData.id = Date.now().toString();
// 		}
// 		newRowView.setData(this.columns, rowData);
// 	}

// 	this.bodyView.appendChild(newRowView);
// 	this.data.push(newRowView.getData());
// 	newRowView.dataset.id = String(newRowView.getData().id);

// 	return newRowView.getData().id;
// }

// public removeRow(row: number | string | OhaeDataTableRowView): OhaeDataTableRowView | undefined {
// 	const rowView = row instanceof OhaeDataTableRowView
// 		? row
// 		: this.getRow(row);

// 	if (!rowView) return undefined;

// 	const rowData = rowView.getData();
// 	this.data = this.data.filter(item => item.id !== rowData.id);
// 	rowView.remove();

// 	return rowView;
// }


// public updateRow(id: number | string, data: Partial<DataTableRow>): void {
// 	const rowView = this.getRow(id);
// 	if (!rowView) return;

// 	const rowData = { ...rowView.getData(), ...data };
// 	rowView.setData(this.columns, rowData);

// 	const index = this.data.findIndex(item => item.id === id);
// 	if (index !== -1) this.data[index] = rowData;
// }

// public clear(): void {
// 	this.data = [];
// 	this.bodyView.innerHTML = '';
// }

// public findRow(predicate: (row: DataTableRow) => boolean): OhaeDataTableRowView | undefined {
// 	return this.getAllRows().find(rowView => predicate(rowView.getData()));
// }

// public moveRowUp(id: number | string): void {
// 	const rowView = this.getRow(id);
// 	if (!rowView) return;
// 	const prev = rowView.previousElementSibling as OhaeDataTableRowView;
// 	if (prev) this.insertRowBefore(rowView, prev);
// }

// public moveRowDown(id: number | string): void {
// 	const rowView = this.getRow(id);
// 	if (!rowView) return;
// 	const next = rowView.nextElementSibling?.nextElementSibling as OhaeDataTableRowView;
// 	this.insertRowBefore(rowView, next || null);
// }


// public rerenderRow(id: number | string): void {
// 	const rowView = this.getRow(id);
// 	if (rowView) rowView.setData(this.columns, rowView.getData());
// }

// public hasRow(id: number | string): boolean {
// 	return !!this.getRow(id);
// }

// protected getRowIndex(row: OhaeDataTableRowView): number {
// 	return Array.from(this.bodyView.children).indexOf(row);
// }

// public getCurrentData() {
// 	return this.data;
// }

// public getAllRows(): OhaeDataTableRowView[] {
// 	return Array.from(this.bodyView.children).filter(
// 		row => row instanceof OhaeDataTableRowView
// 	) as OhaeDataTableRowView[];
// }


// public insertRowBefore(
// 	source: number | string | DataTableRow | OhaeDataTableRowView,
// 	target: number | string | OhaeDataTableRowView
// ): number | string | undefined {
// 	const targetRowView = target instanceof OhaeDataTableRowView
// 		? target
// 		: this.getRow(target);

// 	if (!targetRowView) return undefined;

// 	let sourceRowView: OhaeDataTableRowView;

// 	if (source instanceof OhaeDataTableRowView) {
// 		sourceRowView = source;
// 	} else if (typeof source === 'object') {
// 		sourceRowView = new OhaeDataTableRowView();
// 		const rowData = source as DataTableRow;
// 		if (!rowData.id) {
// 			rowData.id = Date.now().toString();
// 		}
// 		sourceRowView.setData(this.columns, rowData);
// 		sourceRowView.dataset.id = String(rowData.id);
// 		// this.data.push(rowData); /*!!!!!!!*/
// 	} else {
// 		sourceRowView = this.getRow(source) as OhaeDataTableRowView;
// 		if (!sourceRowView) return undefined;

// 		this.data = this.data.filter(item => item.id !== sourceRowView.getData().id);
// 		sourceRowView.remove();
// 	}

// 	this.bodyView.insertBefore(sourceRowView, targetRowView);
// 	// this.data.splice(this.getRowIndex(targetRowView), 0, sourceRowView.getData()); /*!!!!!!!*/

// 	return sourceRowView.getData().id;
// }

// public getRow(id: number | string): OhaeDataTableRowView | undefined {
// 	return Array.from(this.bodyView.children).find(row => {
// 		return row instanceof OhaeDataTableRowView && row.dataset.id === String(id);
// 	}) as OhaeDataTableRowView | undefined;
// }
