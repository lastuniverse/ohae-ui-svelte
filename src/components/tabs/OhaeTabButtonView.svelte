<svelte:options customElement={{ tag: "ohae-tab-button" }} />

<script lang="ts">
    import type { IOhaeTabButtonConfig, TabButtonSide } from "./OhaeTabsTypes";
    import { assignColors, initOhae } from "../../lib/ohaeUtils";

    initOhae($host(), {
        modifyAppendChild: false,
        loadFontsAwesome: true,
        loadOhaeTheme: true,
    });

    let {
        label = "",
        icon = "fa-plus",
        side = "top" as TabButtonSide,
        current = false,
        disabled = false,
        backgroundColor = "#333333",
        // flex = undefined,
        // minWidth = undefined,
        // minHeight = 26,
        // width = undefined,
        // height = undefined,
        className = undefined,
        customStyle = "",
    }: IOhaeTabButtonConfig  = $props();


    $effect(() => {
        assignColors($host(), {
            "--button": "backgroundColor",
        });
    });
</script>

<button
    type="button"
    class="slot default button {className} {side}"
    class:current
    {disabled}
    style={customStyle}
    aria-pressed={current}
    aria-label={String(label) || "Tab button"}
    tabindex="0"
>
    <span class="icon-wrapper">
        <span class="icon fa {icon.startsWith('fa-') ? icon : 'fa-' + icon}"></span>
    </span>
    <span 
        class="label {side}"
    >
        {label}
    </span>
</button>

<style>
    :host {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        max-height: 26px;
        min-height: 26px;
        padding: 0px;
        margin: 0px;
        outline: none;
    }

    .button {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        background-color: var(--button-background, #333);
        color: var(--button-color, #ddd);
        width: 100%;
        min-width: 20px;
        gap: 1px;
        outline: none;
    }

    /* Side-specific styles from WC */
    .button.top {
        border-radius: 6px 6px 0 0;
        border: solid var(--button-border, #222) 1px;
        box-shadow: inset 0 -3px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 0px;
    }
    .button.bottom {
        border-radius: 0 0 6px 6px;
        border: solid var(--button-border, #222) 1px;
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
        border-top: 0px;
    }
    .button.left {
        border-radius: 6px 0 0 6px;
        border: solid var(--button-border, #222) 1px;
        box-shadow: inset -2px 0 2px rgba(0, 0, 0, 0.1);
        border-right: 0px;
    }
    .button.right {
        border-radius: 0 6px 6px 0;
        border: solid var(--button-border, #222) 1px;
        box-shadow: inset 2px 0 2px rgba(0, 0, 0, 0.1);
        border-left: 0px;
    }

    /* Current state */
    .button.current {
        background-color: var(--button-active, #444);
    }
    .button.top.current {
        border-bottom: 1px solid var(--highlight);
    }
    .button.bottom.current {
        border-top: 1px solid var(--highlight);
    }
    .button.left.current {
		border-right: 1px solid var(--highlight);
    }
    .button.right.current {
		border-left: 1px solid var(--highlight);
    }

    .button:focus {
        background-color: var(--button-focus);
    }
    .button:active {
        background-color: var(--button-active);
    }
    
    .button.top:active {
        transform: translateY(4px);
        height: calc(100% - 4px);
    }
    .button.bottom:active {
        height: calc(100% - 4px);
    }
    .button.left:active {
        transform: translateX(8px);
        width: calc(100% - 8px);
    }
    .button.right:active {
        white-space: nowrap;
        width: calc(100% - 8px);
    }    
    /* .button:active:not(:disabled) {
        background-color: var(--button-bg-active, #444);
    } */
    /* .button.top:active:not(:disabled) {
        transform: translateY(2px);
    }
    .button.left:active:not(:disabled) {
        transform: translateX(2px);
    }
    .button.right:active:not(:disabled) {
        transform: translateX(-2px);
    } */

    .button:hover {
        background-color: var(--button-hover);
    }
    /* .button:hover:not(:disabled) {
        background-color: var(--button-bg-hover, #3b3b3b);
    } */

    .button:disabled,
    .button[disabled] {
        background-color: var(--button-disabled);
        color: #666 !important;
        cursor: not-allowed;
        transform: none !important;
    }

    .icon-wrapper {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 20px;
    }
    .icon {
        font-size: 14px;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .label {
        flex-grow: 1;
        min-width: 0;
        width: auto;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .label.left,
    .label.right {
        display: none;   
    }
</style>
