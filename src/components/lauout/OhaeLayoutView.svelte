<!-- <svelte:options customElement={{ tag: "ohae-layout", shadow: "none" }} /> -->
<svelte:options customElement={{ tag: "ohae-layout" }} />

<script lang="ts">
  import { useShadowTheme } from "../../lib/useShadowTheme";
  import { calculateLayoutStyles, type TFlexDirection, type ILayoutStyleProps, type ILayoutProps, asignLayoutProps } from "../../lib/layoutUtils";
  
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
    customStyle = "", // Дополнительные пользовательские стили строкой
  }: ILayoutProps = $props();

  let container: HTMLDivElement;

  const calculatedStyles = $derived(calculateLayoutStyles({
    align,
    valign,
    collapsed,
    direction,
    padding,
    margin,
  }));

  asignLayoutProps(() => container?.getRootNode() as ShadowRoot | null, {
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

  useShadowTheme(() => container?.getRootNode() as ShadowRoot | null);
</script>

<!-- <link rel="stylesheet" data-managed-theme="true" href="/themes/theme-default-dark.css"> -->
<div
  bind:this={container}
  class="slot {className}"
  style:flex-direction={calculatedStyles.finalFlexDirection}
  style:align-items={calculatedStyles.finalAlignItems}
  style:justify-content={calculatedStyles.finalJustifyContent}
  style:padding={calculatedStyles.paddingStyle}
  style:margin={calculatedStyles.marginStyle}
  style="{customStyle}"
>
  <slot></slot>
</div>

<style>
  :host, .slot {
    box-sizing: border-box;
    border: none;
    padding: 0;
    margin: 0;
  }
  
  :host {
    /* display: contents; */
    /* display: flex; */
    flex: 1 1 0;
    overflow: auto;
    border-radius: 3px;
  }

  .slot {
    display: flex;
    flex-direction: column;
    align-content: stretch;
    align-items: stretch;

    overflow: visible;
    width: 100%;
    height: 100%;
  }


</style>