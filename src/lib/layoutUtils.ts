import { onMount } from "svelte";
import { alignItemsMap, justifyContentMap, type ICalculatedLayoutStyles, type ILayoutSizeProps, type ILayoutStyleProps, type TFlexDirection } from "./OhaeViewOptions";

function formatSpacingValue(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    return String(value); // Позволяет передавать строки типа "1em", "5px 10px", и т.д.
}

function getDisplayValue(collapsed: boolean | undefined): string {
    return collapsed ? "none" : "flex";
}

export function calculateLayoutStyles(props: ILayoutStyleProps): ICalculatedLayoutStyles {
    const finalDisplay = getDisplayValue(props.collapsed);
    const finalFlexDirection = props.direction ?? "column";
    const isRowDirection = finalFlexDirection === "row" || finalFlexDirection === "row-reverse";

    const finalJustifyContent = justifyContentMap[props.align as keyof typeof justifyContentMap] || props.align || "flex-start";
    const finalAlignItems = alignItemsMap[props.valign as keyof typeof alignItemsMap] || props.valign || "stretch";

    const paddingStyle = formatSpacingValue(props.padding);
    const marginStyle = formatSpacingValue(props.margin);

    return {
        finalDisplay,
        finalFlexDirection,
        isRowDirection,
        finalJustifyContent,
        finalAlignItems,
        paddingStyle,
        marginStyle,
    };
}


/**
 * Определяет направление работы ресайзера ('row' или 'column').
 * Порядок приоритета:
 * 1. Явно переданный проп `explicitResizerDirection`.
 * 2. CSS-переменная `--resizer-parent-flex-direction` на родительском элементе.
 * 3. Вычисленный `flex-direction` родительского элемента.
 * @param host - Сам кастомный элемент <ohae-resizer>.
 * @param explicitPropDirection - Значение пропа explicitResizerDirection.
 * @returns Определенное направление ресайзера или null, если не удалось определить.
 */
export function determineResizerDirection(host: HTMLElement | undefined): TFlexDirection | null {
    if (!host) return null;

    if (host.parentElement) {
        const parentElement = host.parentElement;
        let parentFlexDirection: TFlexDirection | "" = "";

        const flexDirAttribute = parentElement.getAttribute('direction') as TFlexDirection | "";
        
        if (["row", "row-reverse", "column", "column-reverse"].includes(flexDirAttribute)) {
            parentFlexDirection = flexDirAttribute;
        } else {
            parentFlexDirection = getComputedStyle(parentElement).flexDirection as TFlexDirection;
        }

        if (parentFlexDirection === "column" || parentFlexDirection === "column-reverse") {
            return "row"; // Родитель - колонка, ресайзер - горизонтальный
        } else {
            return "column"; // Родитель - строка, ресайзер - вертикальный
        }
    }
    console.warn(">>>", 6, null);
    return null; // Не удалось определить
}

// export function asignLayoutProps(getShadowRoot: () => ShadowRoot | null, sizeProps: ILayoutSizeProps): void {
export function asignLayoutProps(getHost: () => HTMLElement | null, sizeProps: ILayoutSizeProps): void {
    onMount(() => {
    const host = getHost();
    if(!host) return;
    const style = host.style;

    // if(sizeProps.width) style.width = sizeProps.width.toString();
    // if(sizeProps.height) style.height = sizeProps.height.toString();
    if(sizeProps.maxWidth) style.maxWidth = sizeProps.maxWidth.toString()+'px';
    if(sizeProps.maxHeight) style.maxHeight = sizeProps.maxHeight.toString()+'px';
    if(sizeProps.minWidth) style.minWidth = sizeProps.minWidth.toString()+'px';
    if(sizeProps.minHeight) style.minHeight = sizeProps.minHeight.toString()+'px';

    
    if(sizeProps.flex) style.flexGrow = sizeProps.flex.toString();
    style.display = getDisplayValue(sizeProps.collapsed);
    
    if(sizeProps.overflow) style.overflow = sizeProps.overflow;
    if(sizeProps.overflowX) style.overflowX = sizeProps.overflowX;
    if(sizeProps.overflowY) style.overflowY = sizeProps.overflowY;
  });
}