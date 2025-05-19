<svelte:options customElement={{ tag: "ohae-icon-of-type" }} />

<script lang="ts">
    import { asignLayoutProps, calculateLayoutStyles } from "../../lib/layoutUtils";
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import type { IconTypeDefinition, IOhaeIconOfTypeConfig } from "./OhaeIconOfTypeTypes";

    // Тип для данных иконки, передаваемых через пропс `types`


    let {
        size = 12,
        padding = undefined,
        margin = undefined,
        className = undefined,
        value = undefined,
        types = {},
        color = undefined,
    }: IOhaeIconOfTypeConfig = $props();

    const iconDefinition = $derived(types?.[value??""]);

    const calculatedStyles = $derived(
        calculateLayoutStyles({
            align: "center",
            valign: "center",
            padding,
            margin,
        }),
    );

    asignLayoutProps(() => $host(), {
        maxWidth: size,
        maxHeight: size,
        minWidth: size,
        minHeight: size,
    });

    useShadowTheme(() => $host().shadowRoot);

    function getIconClasses(iconData?: IconTypeDefinition) {
        let icon =
            iconData?.icon.trim().split(/\s+/)[0] ?? "fa-question-circle";
        const parts = icon.split("-");
        let prefix = parts[0] ?? "fa";
        return `${prefix} ${icon}`;
    }
    const iconClasses = $derived(getIconClasses(iconDefinition));
    const finalColor = $derived(iconDefinition?.color ?? color ?? "#f00");
</script>

<div
    class="slot icon-container {className}"
    style:align-items={calculatedStyles.finalAlignItems}
    style:vertical-align={calculatedStyles.finalAlignItems}
    style:justify-content={calculatedStyles.finalJustifyContent}
    style:padding={calculatedStyles.paddingStyle}
    style:margin={calculatedStyles.marginStyle}
>
    <span
        class="{iconClasses} icon-fa-style"
        style:color={finalColor}
        style:font-size={size + "px"}
    ></span>
</div>

<style>
    .icon-container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        cursor: pointer;
        background: transparent !important;
        align-items: center;
        justify-content: center;
    }
    .icon-container:hover .icon-fa-style {
        opacity: 0.8;
    }

    .icon-fa-style {
        /* Базовый класс для <i> тега */
        transition: opacity 0.2s;
    }
</style>
