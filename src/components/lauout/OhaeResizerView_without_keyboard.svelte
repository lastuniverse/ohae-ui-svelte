<!-- <svelte:options customElement={{ tag: "ohae-resizer", shadow: "none" }} /> -->
<!-- <svelte:options customElement={{ tag: "ohae-resizer", shadow: "open" }} /> -->
<svelte:options customElement={{ tag: "ohae-resizer" }} />

<script lang="ts">
  import { determineResizerDirection, type TFlexDirection } from "../../lib/layoutUtils";
  import { useShadowTheme } from "../../lib/useShadowTheme";

  export const resizeDeny: boolean = true;

  let { 
    className = undefined,
  }: { 
    className?: string;
  } = $props();

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

  let direction = $derived(determineResizerDirection($host())) as TFlexDirection;
  let isRowDirection: boolean = $derived(direction === "row");

  useShadowTheme(() => $host().shadowRoot);

  function getElementSize(element: HTMLElement): number {
    return isRowDirection ? element.offsetHeight : element.offsetWidth;
  }

  function getElementMinSize(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const layoutLike = element as any;
    return parseFloat(isRowDirection ? layoutLike.minHeight ?? element.getAttribute("min-height") ?? style.minHeight  : layoutLike.minWidth ?? element.getAttribute("min-width") ?? style.minWidth) || 0;
  }

  function getElementMaxSize(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const layoutLike = element as any;
    return parseFloat(isRowDirection ? layoutLike.maxHeight ?? element.getAttribute("max-height") ?? style.maxHeight : layoutLike.maxWidth ?? element.getAttribute("max-width") ?? style.maxWidth) || Infinity;
  }

  function getResizedElemens(): HTMLElement[] {
    const parentElement = $host().parentElement;
    if (!parentElement) return [];
    const parentSlot =
      parentElement.shadowRoot?.querySelector(".resizer") ??
      parentElement.querySelector(".resizer") ??
      parentElement;    
    const children = Array.from(parentSlot.children) as HTMLElement[];
    return children.filter(item=>!!item);
  }

  function logElementsSizes(): void {
    return;
    console.log("===========================");
    const children = getResizedElemens();
    children.forEach((element) => {
      const flexSize = getElementSize(element);
      const size = isRowDirection ? element.offsetHeight : element.offsetWidth;
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
      const isResizeDeny = 'resizeDeny' in element;
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
    // if (!customElementRef) return;

    isDragging = true;
    startX = event.touches[0]?.clientX ?? 0;
    startY = event.touches[0]?.clientY ?? 0;
    storeElements();

    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
  }

  function handleMouseDown(event: MouseEvent): void {
    // if (!customElementRef) return;

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

  const mouseDelta = isRowDirection
    ? clientY - startY
    : clientX - startX;

  return mouseDelta;
}

  function handleMouseMove(event: MouseEvent | TouchEvent): void {
    if (!isDragging) return;

    let mouseDelta = getMouseDelta(event);

    currentDragDelta = Math.abs(mouseDelta);

    beforeElements.forEach((el) => (el.newSize = el.initialSize));
    afterElements.forEach((el) => (el.newSize = el.initialSize));

    if (mouseDelta < 0) {
      decreaseSizeRecursive([...beforeElements], currentDragDelta);
      increaseSizeRecursive([...afterElements], currentDragDelta);
      decreaseSizeRecursive([...beforeElements], currentDragDelta); // Повторный вызов из оригинала
    } else if (mouseDelta > 0) {
      increaseSizeRecursive([...beforeElements], currentDragDelta);
      decreaseSizeRecursive([...afterElements], currentDragDelta);
      increaseSizeRecursive([...beforeElements], currentDragDelta); // Повторный вызов из оригинала
    }
    applyNewSizes();
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
</script>

<button
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
  onmousedown={handleMouseDown}
  ontouchstart={handleTouchDown}
  aria-label="Resize panel"
  tabindex="-1"
>
  <div class="overlay"></div>
  <div class="interactive"></div>
</button>

<style>
  :host, .resizer {
    box-sizing: border-box;
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
