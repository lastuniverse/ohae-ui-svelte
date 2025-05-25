<!-- <svelte:options customElement={{ tag: "ohae-resizer", shadow: "open" }} /> -->
<svelte:options customElement={{ tag: "ohae-resizer" }} />

<script lang="ts">
    import type { KeyboardEventHandler } from "svelte/elements";
    import { determineResizerDirection } from "../../lib/layoutUtils";
    import type { TFlexDirection } from "./OhaeLayoutTypes";
    import type { IOhaeResizerConfig } from "./OhaeResizerTypes";
    import { initOhae } from "../../lib/ohaeUtils";
    import { Resizer } from "../../webcomponents/utils/resizeUtils";

    export const resizeDeny: boolean = true;
    initOhae($host(), {
        modifyAppendChild: true,
        loadFontsAwesome: false,
        loadOhaeTheme: true,
    });

    let {
        className = undefined,
    }: IOhaeResizerConfig = $props();

    let isDragging = $state(false);
    let direction = $derived( determineResizerDirection($host()) ) as TFlexDirection;
    let isRowDirection: boolean = $derived(direction === "row");

    let resizer = new Resizer(()=>$host());

    $effect(()=>{
        resizer.setDirrection(direction);
    })

    function handleTouchDown(event: TouchEvent): void {
        isDragging = true;
        resizer.setStartPosition(
            event.touches[0]?.clientX ?? 0,
            event.touches[0]?.clientY ?? 0
        );
        resizer.storeElements();

        window.addEventListener("touchmove", handleMouseMove);
        window.addEventListener("touchend", handleMouseUp);
    }

    function handleMouseDown(event: MouseEvent): void {
        event.preventDefault();
        isDragging = true;
        resizer.setStartPosition(
            event.clientX,
            event.clientY
        );
        resizer.storeElements();

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent | TouchEvent): void {
        if (!isDragging) return;
        const mouseDelta = resizer.getMouseDelta(event);
        resizer.applyResize(mouseDelta);
    }

    function handleMouseUp(): void {
        if (!isDragging) return;
        isDragging = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
        resizer.logElementsSizes();
    }

    const KEYBOARD_STEP = 10;

    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
        let delta = 0;
        let relevantKeyPress = false;
        $host()

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
            event.preventDefault();
            resizer.storeElements();
            resizer.applyResize(delta);
            resizer.logElementsSizes();
        }
    };
</script>

<button
    type="button"
    class="slot default resizer {className}"
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
    .default {
        box-sizing: border-box;
        /* background-color: transparent; */
        border: none;
        padding: 0px;
        margin: 0px;
    }

    :host {
        /* flex: 0 0 4px; */
        padding: 1px;
    }

    .default {
        /* margin: 1px; */
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative; /* Оверлеи будут absolutely positioned относительно этого div */
        user-select: none;
        touch-action: none;
        background-color: #000;
    }

    .default:focus {
        outline: none;
    }

    .default.cols {
        cursor: col-resize;
    }

    .default.rows {
        cursor: row-resize;
    }

    .default.cols .overlay {
        background: url("data:image/gif;base64,R0lGODlhAwAdAIABAJWr7f///yH5BAEAAAEALAAAAAADAB0AAAIQRBynaaje0pORrWnhrbi3AgA7")
            no-repeat center center;
    }
    .default.rows .overlay {
        background: url("data:image/gif;base64,R0lGODlhHQADAIABAJWr7f///yH5BAEAAAEALAAAAAAdAAMAAAINRIynyesBo5y0tuswKgA7")
            no-repeat center center;
    }

    .default.cols .interactive {
        transform: scaleX(4);
    }
    .default.rows .interactive {
        transform: scaleY(4);
    }

    .default.cols:hover .interactive,
    .default.cols.dragging .interactive,
    .default.cols:active .interactive {
        transform: scaleX(4);
    }
    .default.rows:hover .interactive,
    .default.rows.dragging .interactive,
    .default.rows:active .interactive {
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
