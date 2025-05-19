<svelte:options customElement={{ tag: "ohae-separator" }} />

<script lang="ts">
    import { determineResizerDirection } from "../../lib/layoutUtils";
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import type { TFlexDirection } from "./OhaeLayoutTypes";
    import type { IOhaeSeparatorConfig } from "./OhaeSeparatorTypes";

    export const resizeDeny: boolean = true;
    let { 
        size = 1,
        className = undefined
    }: IOhaeSeparatorConfig = $props();

    let direction = $derived(
        determineResizerDirection($host()),
    ) as TFlexDirection;

    useShadowTheme(() => $host().shadowRoot);
</script>

<div
    class="slot separator {className}"
    class:cols={direction === "column"}
    class:rows={direction === "row"}
    style:width={direction === "column" ? size + "px" : "100%"}
    style:min-width={direction === "column" ? size + "px" : undefined}
    style:max-width={direction === "column" ? size + "px" : undefined}
    style:height={direction === "row" ? size + "px" : "100%"}
    style:min-height={direction === "row" ? size + "px" : undefined}
    style:max-height={direction === "row" ? size + "px" : undefined}
    role="separator"
></div>

<style>
    :host,
    .separator {
        box-sizing: border-box;
        border: none;
        padding: 0;
        margin: 0;
    }

    :host {
        padding: 0px;
    }

    .separator {
        display: flex;
        position: relative;
        user-select: none;
        background-color: #000;
    }
</style>
