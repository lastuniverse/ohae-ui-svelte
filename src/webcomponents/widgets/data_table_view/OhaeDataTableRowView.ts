import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeDataTableBodyView } from "./OhaeDataTableBodyView";
import { DataTableColumn } from "./OhaeDataTableHeadView";

export interface DataTableRow {
    id: string | number;
	[key: string]: any; // Для поддержки дополнительных атрибутов
}

export class OhaeDataTableRowView extends OhaeLayoutView {
	static readonly ATTRIBUTES = [
		'row-data',
		'columns',
		'rowHeight',
	];

	protected static readonly STYLES = `
		<style>
		:host {
			--row-height-default: 24px;
			display: flex;
			flex-direction: row;
			position: relative;
			box-sizing: border-box;
			overflow: hidden;
			height: var(--row-height, var(--row-height-default));
			line-height: var(--row-height, var(--row-height-default));
			margin: 0;
			padding: 0;
			color: var(--host-color, #333);
		}

		.row-container {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			overflow: hidden;
			width: 100%;
			margin: 0;
			padding: 0;
			height: var(--row-height, var(--row-height-default));
		}

		.row-cell {
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: 0;
			margin: 0;
			padding: 0 5px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			/* border-right: 1px solid var(--host-border, #eee); */
			box-sizing: border-box;
			height: var(--row-height, var(--row-height-default));
			display: flex;
			align-items: center;
			font-weight: 100;
			font-size: smaller;
		}

		.row-cell.fixed-width {
			flex: 0 0 auto;
		}

		.input, .component  {
			/* font-weight: 100; */
			padding: 0;
			width: 100%;
			height: 100%;
			border: none;
			outline: none;
			background: transparent;
			box-sizing: border-box;
			min-width: 0;
			line-height: var(--row-height, var(--row-height-default));
		}

		.input {
			margin: 0 0 1px 1px;
			font-size: 100%;
		}

		.component {
			font-size: 120%;
			margin: 0;
		}

		</style>
		<link rel="stylesheet" href="./external.css">
	`;

	protected static readonly HTML: string = `<div class="row-container"></div>`;

	private _rowView?: HTMLDivElement;
	private columns: DataTableColumn[] = [];
	private rowData: DataTableRow = { id: Date.now().toString() };
	private isEditing = false;
	
	static get observedAttributes() {
		return [...super.observedAttributes, ...this.ATTRIBUTES];
	}

	protected override async createCallback() {
		this.markAsInitDataReady();
        await super.createCallback();
		this.addEventListener('dragstart', this.handleDragStart as EventListener);
		this.addEventListener('dragend', this.handleDragEnd as EventListener);
    }

	private updateEnableDragging(): void {
		this.draggable = this.enableDragging;
		this.removeEventListener('dragstart', this.handleDragStart as EventListener);
		this.removeEventListener('dragend', this.handleDragEnd as EventListener);
		if(this.enableDragging){
			this.addEventListener('dragstart', this.handleDragStart as EventListener);
			this.addEventListener('dragend', this.handleDragEnd as EventListener);
		}
	}

	

	private handleDragStart(event: DragEvent) {
		event.stopPropagation();
		// this.style.opacity = '0.7';
		this.style.backgroundColor = "#1d314d"; // TODO цвет для селекта строки
		this.style.color = "#e96a00"; // TODO цвет для селекта строки
		const datatable = this.parentElement as OhaeDataTableBodyView;
		if (datatable) {
			datatable.draggedSection = this;
		}

		// Создаем прозрачную картинку 1x1
        const emptyImage = new Image();
        emptyImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==';
        event.dataTransfer?.setDragImage(emptyImage, 0, 0);
	}
	
	private handleDragEnd() {
		this.style.opacity = '';
		this.style.backgroundColor = '';
		this.style.color = "var(--host-color, #333)"; // TODO цвет для селекта строки
	}

	protected get rowView(): HTMLDivElement {
		this._rowView = this._rowView ?? this.shadowRoot?.querySelector('div.row-container') as HTMLDivElement;
		return this._rowView;
	}

	public async setData(columns: DataTableColumn[], data: DataTableRow): Promise<void> {
		this.columns = columns;
		this.rowData = data;
		await this.renderRow();
	}

	public getData(): DataTableRow {
		return { ...this.rowData };
	}

	private async renderRow() {
		this.innerHTML = '';
		for (const columnData of this.columns) {
			await this.renderCell(columnData);
		}
	}
	private async renderCell(columnData: DataTableColumn): Promise<void> {
		const rowCell = document.createElement('div');
		rowCell.className = 'row-cell';
		if (columnData.width) {
			const width = this.parseSizeValue(columnData.width);
			rowCell.classList.add('fixed-width');
			rowCell.style.width = width;
		}
		rowCell.style.textAlign = columnData.align || 'left';

		if (columnData.componentOptions) {
			await this.renderComponentCell(rowCell, columnData, this.rowData);
		} else if (columnData.editable) {
			this.renderEditableCell(rowCell, columnData, this.rowData);
		} else {
			rowCell.textContent = this.rowData[columnData.id] ?? '';
		}

		this.rowView.appendChild(rowCell);
	}

	private async renderComponentCell(cell: HTMLDivElement, col: DataTableColumn, data: any) {
		const componentWrapper = document.createElement('div');
		componentWrapper.style.display = 'contents';

		// Связываем изменения компонента с данными
		const options = { ...col.componentOptions! };
		const self = this;
		const callback = function (this: HTMLElement, e: Event) {
			const target = e.target as HTMLInputElement;
			const oldValue = data[col.id];
			const newValue = data[col.id] = target.value;
			if (newValue !== oldValue) {
				self.dispatchCellEvent('cell-update', col.id, data, newValue, oldValue);
			}
			// col.componentOptions!.on?.[e.type]?.call(this, e);
		};
		options.on = {
			change: callback,
			//input: callback
		};

		// Создаем кастомный компонент
		const component = await OhaeUI.createView(options, componentWrapper) as HTMLElement;
		if (component) {
			component.setAttribute?.('value', data[col.id]);
			component.classList.add('component');
			cell.appendChild(componentWrapper);
		}
	}

	private renderEditableCell(cell: HTMLDivElement, col: DataTableColumn, data: any) {
		cell.textContent = data[col.id] ?? '';
		cell.style.cursor = 'pointer';

		cell.addEventListener('dblclick', () => {
			if (this.isEditing) return;
			this.startEditing(cell, col, data);
		});
	}

	private startEditing(cell: HTMLDivElement, col: DataTableColumn, item: any) {
		this.isEditing = true;
		const oldValue = item[col.id];

		// Создаем input
		const input = document.createElement('input');
		input.type = col.inputType || 'text';
		input.value = oldValue;
		input.classList.add('input');

		// Полностью очищаем ячейку и добавляем input
		while (cell.firstChild) cell.removeChild(cell.firstChild);

		const width = cell.offsetWidth;
		cell.style.width = `${width}px`;
		cell.style.minWidth = `${width}px`;
		cell.style.maxWidth = `${width}px`;
		cell.appendChild(input);

		input.focus();
		// Обработчики событий
		const finishEdit = (e?: Event) => {
			cell.style.width = '';
			cell.style.minWidth = '';
			cell.style.maxWidth = '';

			if (e) e.preventDefault();

			// Удаляем обработчики перед изменением содержимого
			input.removeEventListener('blur', finishEdit);
			input.removeEventListener('keydown', handleKeyDown);

			const newValue = input.value;
			while (cell.firstChild) cell.removeChild(cell.firstChild);
			cell.textContent = newValue; // Используем textContent вместо innerHTML
			item[col.id] = newValue;
			this.isEditing = false;
			if (newValue !== oldValue) {
				this.dispatchCellEvent('cell-update', col.id, item, newValue, oldValue);
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') finishEdit(e);
		};

		input.addEventListener('blur', finishEdit);
		input.addEventListener('keydown', handleKeyDown);
	}

	private dispatchCellEvent(eventName: string, columnId: string, data: any, newValue: any, oldlValue: any) {
		const detail = {
			column: columnId,
			newValue,
			oldlValue,
			data,
			rowData: this.rowData,
		};
		const event = new CustomEvent(eventName, {
			bubbles: true, // Событие всплывает до родительских элементов
			composed: true, // Событие пересекает границы Shadow DOM
			detail,
		});

		this.dispatchEvent(event);
	}

	get enableDragging(): boolean {
		return this.getAttribute('enableDragging') === 'true';
	}
	set enableDragging(value: boolean | string | null) {
		this.setBooleanAttribute('enableDragging', value);
		this.updateEnableDragging();
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

OhaeUI.registerViewType('datatable-row', OhaeDataTableRowView);


declare module "../../OhaeViewOptions" {
	interface IOhaeViewOptions {
		rowHeight?: string | number;
		enableDragging?: string | boolean;
	}
}