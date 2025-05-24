<!-- <svelte:options customElement={{ tag: "ohae-layout", shadow: "none" }} /> -->
<!-- <svelte:options customElement={{ tag: "ohae-layout", shadow: "open" }} /> -->
<svelte:options customElement={{ tag: "ohae-layout" }} />

<script lang="ts">
    import { asignLayoutProps, calculateLayoutStyles } from "../../lib/layoutUtils";
    import type { IOhaeLayoutConfig, TFlexDirection } from "./OhaeLayoutTypes";
    import { initOhae } from "../../lib/ohaeUtils";

    initOhae($host(), {
        modifyAppendChild: true,
        loadOhaeTheme: true,
        loadFontsAwesome: false,
    });
        
    let {
        flex = undefined,
        align = "left",
        valign = "stretch",
        collapsed = false,
        direction = "row" as TFlexDirection,
        overflow = "auto",
        overflowX = undefined,
        overflowY = undefined,
        width = undefined,
        height = undefined,
        maxWidth = undefined,
        maxHeight = undefined,
        minWidth = undefined,
        minHeight = undefined,
        padding = undefined,
        margin = undefined,
        className = undefined,
        backgroundColor = undefined,
        customStyle = "", // Дополнительные пользовательские стили строкой
    }: IOhaeLayoutConfig = $props();

    $effect(() => {
        asignLayoutProps(()=>$host(), {
            flex,
            overflow,
            overflowX,
            overflowY,
            width,
            height,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
            collapsed,
        });
    });

    const calculatedStyles = $derived(
        calculateLayoutStyles({
            align,
            valign,
            collapsed,
            direction,
            padding,
            margin,
        }),
    );

</script>

<div
    class="slot default {className}"
    style:flex-direction={calculatedStyles.finalFlexDirection}
    style:align-items={calculatedStyles.finalAlignItems}
    style:justify-content={calculatedStyles.finalJustifyContent}
    style:padding={calculatedStyles.paddingStyle}
    style:margin={calculatedStyles.marginStyle}
    style:background-color={backgroundColor}
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
        /* border: 1px solid red; */
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
