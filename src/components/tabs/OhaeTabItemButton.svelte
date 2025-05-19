<svelte:options customElement={{ tag: "ohae-tab-button" }} />

<script lang="ts">
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import { Color } from "../../lib/Color";

    export type TabButtonSide = "top" | "bottom" | "left" | "right";

    let {
        label = "",
        icon = "fa-plus",
        side = "top" as TabButtonSide,
        current = false,
        disabled = false,
        backgroundColor = "#333333", // Default hex color from WC
        flex = undefined,
        minWidth = undefined,
        minHeight = "26px", // Default from WC for top/bottom
        width = undefined, // Default width is auto/100% based on side
        height = undefined, // Default height is 26px for top/bottom, 100% for left/right
        className = undefined,
        customStyle = "",
    }: {
        label?: string | number;
        icon?: string;
        side?: TabButtonSide;
        current?: boolean;
        disabled?: boolean;
        backgroundColor?: string;
        flex?: number | "none" | string;
        minWidth?: number | string;
        minHeight?: number | string;
        width?: number | string;
        height?: number | string;
        className?: string;
        customStyle?: string;
    } = $props();

    useShadowTheme(() => $host().shadowRoot);

    $effect(() => {
        const host = $host();
        if (!host) return;
        const color = new Color(backgroundColor); // Assumes backgroundColor is a hex string
        host.style.setProperty("--button-bg", color.brightness(0.7).hex);
        host.style.setProperty("--button-bg-hover", color.brightness(0.9).hex);
        host.style.setProperty("--button-bg-active", color.hex);
        host.style.setProperty("--button-color", color.shift(128).hex); // Ensure Color.shift exists
        host.style.setProperty("--button-border", color.brightness(0.4).hex);

        // Apply flex, width, height to the host directly
        if (flex !== undefined) {
            host.style.flex = String(flex);
        } else {
            host.style.flex =
                side === "left" || side === "right" ? "none" : "1";
        }

        if (minWidth !== undefined)
            host.style.minWidth =
                typeof minWidth === "number" ? `${minWidth}px` : minWidth;
        if (minHeight !== undefined)
            host.style.minHeight =
                typeof minHeight === "number" ? `${minHeight}px` : minHeight;

        if (side === "left" || side === "right") {
            host.style.width =
                typeof width === "number" ? `${width}px` : (width ?? "auto");
            host.style.height =
                typeof height === "number" ? `${height}px` : (height ?? "100%");
            // For left/right, max-height might not be fixed like top/bottom
        } else {
            // top or bottom
            host.style.width =
                typeof width === "number" ? `${width}px` : (width ?? "100%");
            host.style.height =
                typeof height === "number" ? `${height}px` : (height ?? "26px");
            host.style.maxHeight = "26px"; // From WC
        }
    });

    const showLabel = $derived(!(side === "left" || side === "right"));
</script>

<button
    type="button"
    class="button {className}"
    class:current
    class:side-top={side === "top"}
    class:side-bottom={side === "bottom"}
    class:side-left={side === "left"}
    class:side-right={side === "right"}
    {disabled}
    style={customStyle}
    aria-pressed={current}
    aria-label={String(label) || "Tab button"}
    tabindex="0"
>
    {#if icon && icon !== "false" && icon !== "null"}
        <span class="icon-wrapper">
            <span class="icon fa {icon.startsWith('fa-') ? icon : 'fa-' + icon}"
            ></span>
        </span>
    {/if}
    {#if showLabel && label}
        <span class="label">{label}</span>
    {/if}
</button>

<style>
    /* Ensure FontAwesome is available, e.g., via useShadowTheme or direct import if needed */
    /* @import url("../../assets/fontawesome-free-6.7.2-web/css/all.min.css"); */

    :host {
        display: flex;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        /* flex, width, height, min/max are set by $effect */
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1px solid var(--button-border, #222);
        background-color: var(--button-bg, #333);
        color: var(--button-color, #ddd);
        width: 100%;
        height: 100%;
        gap: 5px;
        padding: 0 8px;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
    }

    /* Side-specific styles from WC */
    .button.side-top {
        border-radius: 6px 6px 0 0;
        box-shadow: inset 0 -3px 3px rgba(0, 0, 0, 0.1);
        border-bottom-width: 0;
    }
    .button.side-bottom {
        border-radius: 0 0 6px 6px;
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
        border-top-width: 0;
    }
    .button.side-left {
        border-radius: 6px 0 0 6px;
        box-shadow: inset -2px 0 2px rgba(0, 0, 0, 0.1);
        border-right-width: 0;
        /* flex-direction: column; /* If icon and label are stacked */
    }
    .button.side-right {
        border-radius: 0 6px 6px 0;
        box-shadow: inset 2px 0 2px rgba(0, 0, 0, 0.1);
        border-left-width: 0;
        /* flex-direction: column; */
    }

    /* Current state */
    .button.current {
        background-color: var(--button-bg-active, #444);
        position: relative; /* For pseudo-elements or z-index if needed */
    }
    .button.side-top.current {
        border-bottom: 1px solid var(--button-bg-active); /* Match active bg for seamless look */
    }
    .button.side-bottom.current {
        border-top: 1px solid var(--button-bg-active);
    }
    .button.side-left.current {
        border-right: 1px solid var(--button-bg-active);
    }
    .button.side-right.current {
        border-left: 1px solid var(--button-bg-active);
    }

    /* Active (pressed) state */
    .button:active:not(:disabled) {
        background-color: var(
            --button-bg-active,
            #444
        ); /* Can be same as current or slightly different */
    }
    .button.side-top:active:not(:disabled) {
        transform: translateY(2px);
    }
    .button.side-left:active:not(:disabled) {
        transform: translateX(2px);
    }
    /* For side-right and side-bottom, active transform might look odd, WC didn't always have symmetrical transforms */
    .button.side-right:active:not(:disabled) {
        transform: translateX(-2px);
    } /* Mirroring left */

    .button:hover:not(:disabled) {
        background-color: var(--button-bg-hover, #3b3b3b);
    }

    .button:disabled {
        background-color: var(
            --button-bg-disabled,
            #282828
        ) !important; /* Ensure override */
        color: #666 !important;
        cursor: not-allowed;
        transform: none !important; /* No active transform when disabled */
    }

    .icon-wrapper {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
    .icon {
        font-size: 1em; /* Or fixed like 14px */
    }
    .label {
        flex-grow: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
