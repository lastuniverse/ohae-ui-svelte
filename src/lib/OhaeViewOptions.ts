export type TFlexDirection = keyof typeof flexDirectionContentMap;
export type TOverflow = keyof typeof overflowContentMap;
export type TJustifyContent = keyof typeof justifyContentMap;
export type TAlignItems = keyof typeof alignItemsMap;

export interface ILayoutProps extends ILayoutStyleProps, ILayoutSizeProps{
    className?: string;
    customStyle?: string;
    // [key: string]: any;
}

export interface ILayoutSizeProps{
    flex?: number;
    overflow?: TOverflow;
    overflowX?: TOverflow;
    overflowY?: TOverflow;
    width?: number | string;
    height?: number | string;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    collapsed?: boolean;
}

export interface ILayoutStyleProps {
    align?: TJustifyContent;
    valign?: TAlignItems;
    collapsed?: boolean;
    direction?: TFlexDirection;
    backgroundColor?: string
    padding?: number;
    margin?: number;
}

export interface ICalculatedLayoutStyles {
    finalDisplay: string;
    finalFlexDirection: TFlexDirection
    finalJustifyContent: string;
    isRowDirection: boolean;
    finalAlignItems: string;
    paddingStyle?: string;
    marginStyle?: string;
}

export const flexDirectionContentMap = {
    row: "row", column: "column", "row-reverse": "row-reverse", "column-reverse": "column-reverse",
    inherit: "inherit", initial: "initial", unset: "unset",
}

export const overflowContentMap = {
    auto: "auto", hidden: "hidden", scroll: "scroll", visible: "visible",
    inherit: "inherit", initial: "initial", unset: "unset",
}

export const justifyContentMap = {
    left: "flex-start", center: "center", right: "flex-end", start: "flex-start",
    end: "flex-end", "flex-start": "flex-start", "flex-end": "flex-end",
    stretch: "stretch", "space-between": "space-between", "space-around": "space-around",
    "space-evenly": "space-evenly",
};

export const alignItemsMap = {
    top: "flex-start", middle: "center", bottom: "flex-end", start: "flex-start",
    center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline",
    "flex-start": "flex-start", "flex-end": "flex-end",
};