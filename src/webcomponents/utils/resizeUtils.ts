import type { TFlexDirection } from "../../components/lauout/OhaeLayoutTypes";

interface IElement {
    element: HTMLElement;
    initialSize: number;
    minSize: number;
    maxSize: number;
    newSize: number;
}

export class Resizer {
    private startX = 0;
    private startY = 0;
    private beforeElements: IElement[] = [];
    private afterElements: IElement[] = [];
    private currentDragDelta = 0;
    private isRowDirection: boolean = false;
    private isDebugMode: boolean = false;

    private getHost!: () => HTMLElement;

    constructor(getHost: () => HTMLElement) {
        this.getHost = getHost;
    }

    public setDirrection(direction: TFlexDirection) {
        this.isRowDirection = direction === "row";
    }

    public setStartPosition(x: number = 0, y: number = 0) {
        this.startX = x;
        this.startY = y;
    }

    private getElementSize(element: HTMLElement): number {
        return this.isRowDirection ? element.offsetHeight : element.offsetWidth;
    }

    private getElementMinSize(element: HTMLElement): number {
        const style = getComputedStyle(element);
        const layoutLike = element as any;
        return (
            parseFloat(
                this.isRowDirection
                    ? (layoutLike.minHeight ??
                        element.getAttribute("min-height") ??
                        style.minHeight)
                    : (layoutLike.minWidth ??
                        element.getAttribute("min-width") ??
                        style.minWidth),
            ) || 0
        );
    }

    private getElementMaxSize(element: HTMLElement): number {
        const style = getComputedStyle(element);
        const layoutLike = element as any;
        return (
            parseFloat(
                this.isRowDirection
                    ? (layoutLike.maxHeight ??
                        element.getAttribute("max-height") ??
                        style.maxHeight)
                    : (layoutLike.maxWidth ??
                        element.getAttribute("max-width") ??
                        style.maxWidth),
            ) || Infinity
        );
    }

    private getResizedElemens(): HTMLElement[] {
        const parentElement = this.getHost().parentElement;
        if (!parentElement) return [];
        const parentSlot =
            parentElement.shadowRoot?.querySelector(".default") ??
            parentElement.querySelector(".default") ??
            parentElement;
        const children = Array.from(parentSlot.children) as HTMLElement[];
        return children.filter((item) => !!item);
    }

    public storeElements(): void {
        const selfElement = this.getHost();
        if (!selfElement || !selfElement.parentElement) return;

        const children = this.getResizedElemens();
        this.beforeElements = [];
        this.afterElements = [];
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

            const size = this.getElementSize(element);
            const minSize = this.getElementMinSize(element);
            const maxSize = this.getElementMaxSize(element);

            const data: IElement = {
                element,
                initialSize: size,
                minSize,
                maxSize,
                newSize: size,
            };
            if (isBefore) this.beforeElements.unshift(data);
            else this.afterElements.push(data);
        });
        this.logElementsSizes();
    }

    public logElementsSizes(): void {
        if (!this.isDebugMode) return
        console.log("===========================");
        const children = this.getResizedElemens();
        children.forEach((element) => {
            const flexSize = this.getElementSize(element);
            const size = this.isRowDirection
                ? element.offsetHeight
                : element.offsetWidth;
            console.log(element.tagName, "size", size, flexSize);
        });
        console.log("---------------------------");
    }

    private decreaseSizeRecursive(items: IElement[], deltaToDistribute: number): void {
        const item = items.shift();
        if (!item) {
            this.currentDragDelta -= deltaToDistribute;
            return;
        }
        const canDecreaseBy = item.initialSize - item.minSize;
        const actualDecrease = Math.min(deltaToDistribute, canDecreaseBy);
        item.newSize = item.initialSize - actualDecrease;

        if (actualDecrease <= deltaToDistribute) {
            this.decreaseSizeRecursive(items, deltaToDistribute - actualDecrease);
        } else {
            this.currentDragDelta -= deltaToDistribute;
        }
    }

    private increaseSizeRecursive(items: IElement[], deltaToDistribute: number): void {
        const item = items.shift();
        if (!item) {
            this.currentDragDelta -= deltaToDistribute;
            return;
        }
        const canIncreaseBy = item.maxSize - item.initialSize;
        const actualIncrease = Math.min(deltaToDistribute, canIncreaseBy);
        item.newSize = item.initialSize + actualIncrease;

        if (actualIncrease <= deltaToDistribute) {
            this.increaseSizeRecursive(items, deltaToDistribute - actualIncrease);
        } else {
            this.currentDragDelta -= deltaToDistribute;
        }
    }

    private applyNewSizes(): void {
        const allAffectedElements = [...this.beforeElements, ...this.afterElements];
        allAffectedElements.forEach((item) => {
            item.element.style.flexGrow = `${item.newSize}`;
        });
    }

    public getMouseDelta(event: MouseEvent | TouchEvent): number {
        let clientX = 0;
        let clientY = 0;

        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
            // Берём первый палец (обычно этого достаточно)
            clientX = event.touches[0]?.clientX ?? 0;
            clientY = event.touches[0]?.clientY ?? 0;
        } else if (typeof MouseEvent !== 'undefined' && event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const mouseDelta = this.isRowDirection ? clientY - this.startY : clientX - this.startX;

        return mouseDelta;
    }

    public applyResize(delta: number): void {
        if (delta === 0) return;

        this.currentDragDelta = Math.abs(delta);

        this.beforeElements.forEach((el) => (el.newSize = el.initialSize));
        this.afterElements.forEach((el) => (el.newSize = el.initialSize));

        if (delta < 0) {
            this.decreaseSizeRecursive([...this.beforeElements], this.currentDragDelta);
            this.increaseSizeRecursive([...this.afterElements], this.currentDragDelta);
            this.decreaseSizeRecursive([...this.beforeElements], this.currentDragDelta); // Повторный вызов из оригинала
        } else if (delta > 0) {
            this.increaseSizeRecursive([...this.beforeElements], this.currentDragDelta);
            this.decreaseSizeRecursive([...this.afterElements], this.currentDragDelta);
            this.increaseSizeRecursive([...this.beforeElements], this.currentDragDelta); // Повторный вызов из оригинала
        }
        this.applyNewSizes();
    }
}