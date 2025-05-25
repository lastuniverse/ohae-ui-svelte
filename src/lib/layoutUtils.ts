import { alignItemsMap, justifyContentMap, type ICalculatedLayoutStyles, type ILayoutSizeProps, type ILayoutStyleProps, type TFlexDirection } from "../components/lauout/OhaeLayoutTypes";

export function formatSpacingValue(value: number | string | undefined): string | undefined {
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
    return null;
}

// function $host<El extends HTMLElement = HTMLElement>(): El
type THost = <El extends HTMLElement = HTMLElement>() => El;



export function asignLayoutProps(getHost: THost, options: ILayoutSizeProps): void {
    const host = getHost();
    if(!host) return;
    const style = host.style;

    // if(sizeProps.width) style.width = sizeProps.width.toString();
    // if(sizeProps.height) style.height = sizeProps.height.toString();
    if(options.maxWidth!==undefined) style.maxWidth = options.maxWidth.toString()+'px';
    if(options.maxHeight!==undefined) style.maxHeight = options.maxHeight.toString()+'px';
    if(options.minWidth!==undefined) style.minWidth = options.minWidth.toString()+'px';
    if(options.minHeight!==undefined) style.minHeight = options.minHeight.toString()+'px';

    if(options.flex!==undefined) style.flexGrow = options.flex.toString();
    style.display = getDisplayValue(options.collapsed);

    if(options.overflow!==undefined) style.overflow = options.overflow.toString();
    if(options.overflowX!==undefined) style.overflowX = options.overflowX.toString();
    if(options.overflowY!==undefined) style.overflowY = options.overflowY.toString();
}