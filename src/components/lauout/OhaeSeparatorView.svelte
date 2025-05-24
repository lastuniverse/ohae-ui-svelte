<svelte:options customElement={{ tag: "ohae-separator" }} />

<script lang="ts">
    import { determineResizerDirection } from "../../lib/layoutUtils";
    import { initOhae } from "../../lib/ohaeUtils";
    import type { TFlexDirection } from "./OhaeLayoutTypes";
    import type { IOhaeSeparatorConfig } from "./OhaeSeparatorTypes";

    export const resizeDeny: boolean = true;

    initOhae($host(), {
        modifyAppendChild: true,
        loadFontsAwesome: false,
        loadOhaeTheme: true,
    });

    let { 
        size = 1,
        className = undefined
    }: IOhaeSeparatorConfig = $props();

    let direction = $derived(
        determineResizerDirection($host()),
    ) as TFlexDirection;

</script>

<div
    class="slot default {className}"
    class:cols={direction === "column"}
    class:rows={direction === "row"}
    style:width={direction === "column" ? size + "px" : "100%"}
    style:min-width={direction === "column" ? size + "px" : undefined}
    style:max-width={direction === "column" ? size + "px" : undefined}
    style:height={direction === "row" ? size + "px" : "100%"}
    style:min-height={direction === "row" ? size + "px" : undefined}
    style:max-height={direction === "row" ? size + "px" : undefined}
    role="separator"
>
    <slot></slot>
</div>

<style>
    :host,
    .default {
        box-sizing: border-box;
        border: none;
        padding: 0;
        margin: 0;
    }

    :host {
        padding: 0px;
    }

    .default {
        display: flex;
        position: relative;
        user-select: none;
        background-color: #000;
    }
</style>
