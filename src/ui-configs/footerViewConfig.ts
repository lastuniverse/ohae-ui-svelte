import type { UiNodeConfig } from "../components/OhaeComponetTypes";

export const footerViewConfig: UiNodeConfig = {
    view: 'layout',
    direction: 'row',
    overflow: 'auto',
    className: 'footer',
    minHeight: 25,
    maxHeight: 25,
    body: [
        {view: 'icon', value: 'test1', color: "#ddd",
            types: {
                test1: { icon: "fa-question-circle", color: "#8f8" },
                test2: { icon: "fa-folder-tree", color: "#f88" },
                test3: { icon: "fa-folder-tree", color: "#88f" }
            }
        },
        { view: 'div', body: 'minHeight: 24' },
        { view: 'div', body: 'maxHeight: 24' },
    ]
};