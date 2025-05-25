<!-- <svelte:options customElement={{ tag: "ohae-tab-item", shadow: "none" }} /> -->
<!-- <svelte:options customElement={{ tag: "ohae-tab-item", shadow: "open" }} /> -->
<svelte:options customElement={{ tag: "ohae-tab-item" }} />

<script lang="ts">
    import { calculateLayoutStyles } from "../../lib/layoutUtils";
    import type { TFlexDirection } from "../lauout/OhaeLayoutTypes";
    import { assignColors, initOhae } from "../../lib/ohaeUtils";
    import type { IOhaeTabItemConfig } from "./OhaeTabsTypes";

    initOhae($host(), {
        modifyAppendChild: true,
        loadOhaeTheme: true,
        loadFontsAwesome: false,
    });
        
    let {
        id = undefined,
        icon = 'fa-play',
        header = 'unamed',
        collapsed = true,
        align = "left",
        valign = "stretch",
        direction = "row" as TFlexDirection,
        padding = 5,
        margin = undefined,
        className = undefined,
        backgroundColor = "#444",
        customStyle = "", // Дополнительные пользовательские стили строкой
    }: IOhaeTabItemConfig = $props();

    const calculatedStyles = $derived(
        calculateLayoutStyles({
            align,
            valign,
            direction,
            padding,
            margin,
        }),
    );

    $effect(() => {
        $host().style.display = collapsed ? 'none' : 'flex';
        assignColors($host(), {
            "--body": "backgroundColor",
        });        
    });
</script>

<!-- style:background-color={backgroundColor} -->

<div
    class="slot default {className}"
    style:flex-direction={calculatedStyles.finalFlexDirection}
    style:align-items={calculatedStyles.finalAlignItems}
    style:justify-content={calculatedStyles.finalJustifyContent}
    style:padding={calculatedStyles.paddingStyle}
    style:margin={calculatedStyles.marginStyle}
    style={customStyle}
    role=""
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
        flex: 1 1 0;
        overflow: auto;
        border-radius: 3px;
        width: 100%;
        /* height: auto; */
        /* border: 1px solid red; */
        background-color: var(--body-background);
    }

    .default {
        display: flex;
        flex-direction: column;
        align-content: stretch;
        align-items: stretch;

        overflow: visible;
        width: 100%;
        height: 100%;
    }
</style>
