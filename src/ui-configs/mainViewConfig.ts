import type { IUiNodeConfig } from "../lib/jsonRenderer";

export const mainViewConfig: IUiNodeConfig = {
    view: 'layout',
    width: '100%',
    height: '100vh',
    flex: 1, // Svelte обработает число для flex
    direction: 'row',
    overflow: 'hidden',
    className: 'body',
    body: [
      {
        view: 'layout',
        direction: 'column',
        overflow: 'auto',
        // minWidth: 50,
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
          // {
          //   view: 'layout',
          //   direction: 'column',
          //   overflow: 'auto',
          //   className: 'bottom', // Это имя класса, а не позиция
          //   minHeight: 25,
          //   maxHeight: 75,
          //   // style: "border: 1px solid orange; padding: 5px; margin-right: 5px; margin-left: 5px;",
          //   body: [
          //     { view: 'div', body: 'minHeight: 25' },
          //     { view: 'div', body: 'maxHeight: 75' }
          //   ]
          // },
          // { view: 'resizer' },          
          {
            view: 'layout',
            direction: 'column',
            overflow: 'auto',
            // minHeight: 50,
            className: 'top',
            flex: 2,
            // style: "border: 1px solid red;",
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
          { view: 'resizer' }, // Предположим, что resizer не принимает дочерние элементы
          {
            view: 'layout',
            direction: 'column',
            overflow: 'auto',
            className: 'bottom', // Это имя класса, а не позиция
            minHeight: 50, // Число будет преобразовано в 50px в layout
            // style: "border: 1px solid orange; padding: 5px; margin-right: 5px; margin-left: 5px;",
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
            className: 'top', // Это имя класса
            flex: 1,
            minHeight: 100, // Можно и строку с единицами
            maxHeight: 150,
            // style: "border: 1px solid purple; padding: 5px; margin-left: 5px;",
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
        className: 'right', // Это имя класса
        // minWidth: 50,
        // style: "border: 1px solid red; padding: 5px; margin-top: 5px;",
        body: [
          { view: 'div', body: 'minHeight: 0' },
          { view: 'div', body: 'maxHeight: undefined' }
        ]
      }
    ]
  };