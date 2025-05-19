import type { IUiNodeConfig } from "../lib/jsonRenderer";

export const bodyViewConfig: IUiNodeConfig = {
    view: 'layout',
    flex: 1,
    direction: 'row',
    overflow: 'hidden',
    className: 'body',
    body: [
        {
            view: 'layout',
            direction: 'column',
            overflow: 'auto',
            body: [
                // {
                //   view: 'layout',
                //   direction: 'column',
                //   overflow: 'auto',
                //   // minHeight: 30,
                //   className: 'top',
                //   flex: 1,
                //   // style: "border: 1px solid red;",
                //   body: [
                //     { view: 'div', body: 'minHeight: 0' },
                //     { view: 'div', body: 'maxHeight: undefined' },
                //     { view: 'div', body: "111111111111111111111111&nbsp; 222222222222222&nbsp; 33333333333333&nbsp; 444444444444&nbsp; 555555555555&nbsp; 66666666666" },
                //   ]
                // },
                // { view: 'resizer' }, // Предположим, что resizer не принимает дочерние элементы
                {
                    view: 'layout',
                    direction: 'column',
                    overflow: 'auto',
                    className: 'bottom',
                    minHeight: 25,
                    maxHeight: 800,
                    body: [
                        { view: 'div', body: 'minHeight: 25' },
                        { view: 'div', body: 'maxHeight: 75' },
                        {
                            view: 'icon', value: 'test1', color: "#ddd",
                            types: {
                                test1: { icon: "fa-question-circle", color: "#8f8" },
                                test2: { icon: "fa-folder-tree", color: "#f88" },
                                test3: { icon: "fa-folder-tree", color: "#88f" }
                            }
                        }
                    ]
                },
                { view: 'resizer' },
                {
                    view: 'layout',
                    direction: 'column',
                    overflow: 'auto',
                    // minHeight: 50,
                    className: 'top',
                    flex: 2,
                    body: [
                        { view: 'div', body: 'minHeight: 0' },
                        { view: 'div', body: 'maxHeight: undefined' },
                        { view: 'div', body: "111111111111111111111111" },
                        { view: 'div', body: "222222222222222" },
                        { view: 'div', body: "33333333333333" },
                        { view: 'div', body: "444444444444" },
                        { view: 'div', body: "555555555555" },
                        { view: 'div', body: "66666666666" },
                    ]
                },
                { view: 'separator' },
                {
                    view: 'layout',
                    direction: 'column',
                    overflow: 'auto',
                    className: 'bottom',
                    minHeight: 50, // Число будет преобразовано в 50px в layout
                    body: [
                        { view: 'div', body: 'minHeight: 50' },
                        { view: 'div', body: 'maxHeight: undefined' }
                    ]
                },
                { view: 'resizer' },
                {
                    view: 'layout',
                    id: 'tartet',
                    direction: 'column',
                    overflow: 'auto',
                    className: 'top',
                    flex: 1,
                    minHeight: 100,
                    maxHeight: 800,
                    body: [
                        { view: 'div', body: 'minHeight: 100' },
                        { view: 'div', body: 'maxHeight: 150' }
                    ]
                }
            ]
        },
        { view: 'resizer' },
        {
            view: 'layout',
            direction: 'row',
            overflow: 'auto',
            className: 'right',
            maxWidth: 50,
            minWidth: 50,
            body: [
                { view: 'div', body: 'minHeight: 0' },
                { view: 'div', body: 'maxHeight: undefined' }
            ]
        },
        { view: 'separator', size: 1 },
        {
            view: 'layout',
            direction: 'row',
            overflow: 'auto',
            className: 'right',
            body: [
                { view: 'div', body: 'minHeight: 0' },
                { view: 'div', body: 'maxHeight: undefined' }
            ]
        }
    ]
};