export type AlignValues = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'none' ;
export type FlexAlignValues = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline' | 'none';

type OhaeEventHandler = (this: HTMLElement, ev: Event) => void;

// OhaeViewOptions

export interface  OhaeEvents {
    click?: OhaeEventHandler;
    change?: (this: HTMLElement, ev: Event) => void;
}

export type LayoutDirection = 'rows' | 'cols';

export interface IOhaeViewOptions {
    view?: string;
    backgroundColor?: string;
    block?: boolean | string;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
    padding?: string | number;
    margin?: string | number;
    flex?: string | number;
    align?: AlignValues;
    valign?: FlexAlignValues;
    body?: (IOhaeViewOptions | string)[] | IOhaeViewOptions | string;
    rows?: (IOhaeViewOptions | string)[];
    cols?: (IOhaeViewOptions | string)[];
    on?: Record<string, (this: HTMLElement, ev: Event) => void>;
    stated?: Record<string, keyof IOhaeViewOptions>;
    // stated?: Record<string, string>;
    
    // общее для input, select, textarea
    // name?: string;
    // separator?: string;
    // label?: string;
    // inputWidth?: string | number;
    // disabled?: string | boolean;
    // readonly?: string | boolean;
    // required?: string | boolean;
    // reverse?: string | boolean;

    // для input
    // value?: string | number | boolean;
    // type?: string;
    // alt?: string;
    // src?: string;
    // pattern?: string;
    // max?: string | number;
    // min?: string | number;
    // step?: string | number;
    // minlength?: string | number;
    // maxLength?: string | number;
    // size?: string | number;
    // placeholder?: string;
    // accept?: string;
    // checked?: string | boolean;

    // для select 
    // multiple?: string | boolean | number;
    // lines?: string | number;
    // options?: Array<{value: string; label: string}>;

    // для tabsView
    // allowHideAll?: string | boolean;
    // tabsSide?: Side;
    // tabsHeight?: string | number;
    // tabsWidth?: string | number;

    // для tabItemView
    // tabIcon?: string | number;
    // header?: string | number;
    // active?: string | boolean;

    // для DataTableView
    // columns?: DataTableColumn[];
    // data?: any[];
    // striped?: boolean;
    // hover?: boolean;

    [key: string]: any; // Для поддержки дополнительных атрибутов
}

export type EventHandlers = Record<string, EventHandler>;
export type EventHandler = (this: HTMLElement, ev: Event) => void;
