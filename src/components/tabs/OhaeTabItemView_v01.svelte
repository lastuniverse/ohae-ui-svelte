<svelte:options customElement={{ tag: "ohae-tab-item" }} />

<script lang="ts">
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import { calculateLayoutStyles } from "../../lib/layoutUtils";
    import { Color } from "../../lib/Color";
    import type { IOhaeLayoutConfig, TFlexDirection } from "../lauout/OhaeLayoutTypes";

    export type Side = 'top' | 'bottom' | 'left' | 'right';



    // Props mirroring OhaeLayoutView & specific to TabItem
    let {
        // Layout props
        flex = 1, // Tab items usually grow to fill space
        align = "stretch", // Default for content within a tab
        valign = "stretch", // Default for content within a tab
        direction = "column" as TFlexDirection, // Content usually stacks vertically
        overflow = "auto",
        overflowX = undefined,
        overflowY = undefined,
        width = "100%",
        height = "100%",
        maxWidth = undefined,
        maxHeight = undefined,
        minWidth = undefined,
        minHeight = undefined,
        padding = 5, // Default padding for tab content
        margin = 0,
        backgroundColor = undefined, // Optional background for the tab item itself
        className = undefined,
        customStyle = "",

        // OhaeTabItemView specific props, set by jsonRenderer or parent
        id = undefined, // Should be set by jsonRenderer if provided in config
        header = "",
        tabIcon = "fa-window-maximize", // Default icon for the tab button if not specified
        active = false, // Controls visibility (maps to 'collapsed')
        tabButtonBackground = undefined, // Optional specific background for its button in OhaeTabsView
    }: IOhaeLayoutConfig & {
        // Merging ILayoutProps with specific props
        header?: string;
        tabIcon?: string;
        active?: boolean;
        tabButtonBackground?: string;
        id?: string;
    } = $props();

    useShadowTheme(() => $host().shadowRoot);

    // Use 'active' to determine 'collapsed' state for layout calculations
    const collapsed = $derived(!active);

    const calculatedLayoutStyles = $derived(
        calculateLayoutStyles({
            align,
            valign,
            collapsed,
            direction,
            padding,
            margin,
        }),
    );

    // asignLayoutProps(() => $host(), {
    //     flex,
    //     overflow,
    //     overflowX,
    //     overflowY,
    //     width,
    //     height,
    //     maxWidth,
    //     maxHeight,
    //     minWidth,
    //     minHeight,
    //     collapsed,
    // });

    // Handle backgroundColor for the tab item's host element (like OhaeBaseView)
    $effect(() => {
        const host = $host();
        if (!host || !backgroundColor) {
            if (host) {
                // Clear if backgroundColor is removed
                host.style.removeProperty("--host-bg");
                host.style.removeProperty("--host-color");
                host.style.removeProperty("--host-hr-color");
                host.style.removeProperty("--host-hover-bg");
                host.style.removeProperty("--host-active-bg");
                host.style.removeProperty("--host-border");
                host.style.removeProperty("--host-head-bg");
                host.style.removeProperty("--host-head-color");
                host.style.boxShadow = "";
            }
            return;
        }
        const color = new Color(backgroundColor);
        host.style.setProperty("--host-bg", color.hex);
        host.style.setProperty("--host-color", color.contrast(0.5).mono().hex);
        host.style.setProperty(
            "--host-hr-color",
            color.contrast(0.2).mono().hex,
        );
        host.style.setProperty("--host-hover-bg", color.brightness(1.1).hex);
        host.style.setProperty("--host-active-bg", color.brightness(1.2).hex);
        host.style.setProperty("--host-border", color.brightness(0.8).hex);
        host.style.setProperty(
            "--host-head-bg",
            color.brightness(0.5).mono().hex,
        );
        host.style.setProperty(
            "--host-head-color",
            color.contrast(0.5).mono().hex,
        );
        host.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, .1)";
    });
</script>

<!-- The content of the tab item is placed in the slot -->
<!-- Styling and layout of this div is controlled by calculatedLayoutStyles -->
<div
    class="slot {className}"
    style:flex-direction={calculatedLayoutStyles.finalFlexDirection}
    style:align-items={calculatedLayoutStyles.finalAlignItems}
    style:justify-content={calculatedLayoutStyles.finalJustifyContent}
    style:padding={calculatedLayoutStyles.paddingStyle}
    style:margin={calculatedLayoutStyles.marginStyle}
    style={customStyle}
>
    <slot></slot>
</div>

<style>
    :host {
        /* display: flex; /* Managed by asignLayoutProps via 'collapsed' */
        box-sizing: border-box;
        border: none; /* Default, can be styled by theme or customStyle */
        border-radius: 3px; /* Consistent with OhaeBaseView */
        /* Other layout properties (width, height, flex, overflow) are set by asignLayoutProps */
    }

    /* Styles for when backgroundColor is applied, mimicking OhaeBaseView */
    :host([style*="--host-bg"]) {
        /* Check if --host-bg is set */
        /* background-color: var(--host-bg); Already set directly on host */
        /* color: var(--host-color); Already set directly on host */
        /* box-shadow: 2px 2px 2px rgba(0, 0, 0, .1); Already set directly on host */
    }

    .slot {
        /* display: flex; /* Managed by calculatedLayoutStyles via 'collapsed' */
        /* flex-direction, align-items, justify-content are set by calculatedLayoutStyles */
        overflow: visible; /* Content within slot should control its own overflow typically */
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
</style>
