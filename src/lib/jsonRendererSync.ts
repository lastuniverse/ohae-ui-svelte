export type UiNodeConfig = IUiNodeConfig | string | number;

export interface IUiNodeConfig {
  view: string; // Имя тега (например, 'layout', 'resizer', 'div')
  body?: UiNodeConfig[] | UiNodeConfig; // Дочерние элементы или текстовое содержимое
  id?: string; // Опциональный ID для элемента
  // Плюс любые другие атрибуты/свойства, которые могут быть у элемента
  [key: string]: any;
}

export function createUI(config: UiNodeConfig | string, parentElement: HTMLElement): HTMLElement | Text | null {
  if (!config) {
    console.error("Invalid config or missing view:", config);
    return null;
  }

  if (typeof config === 'string' || typeof config === 'number') return renterTextElement(config, parentElement);

  if (typeof config !== 'object') {
    console.error("Invalid config type:", config);
    return null;
  }

  if (Array.isArray(config)) {
    console.error("Config should be an object, not an array:", config);
    return null;
  }


  if (!config.view) {
    console.error("Invalid config or missing view:", config);
    return null;
  }

  // Определяем имя тега для создания
  // Custom Elements уже зарегистрированы как 'ohae-layout', 'ohae-resizer'
  const tagName = config.view === 'layout' ? 'ohae-layout'
    : config.view === 'resizer' ? 'ohae-resizer'
      : config.view; // Для 'div', 'span' и т.д.

  const element = document.createElement(tagName);

  // Устанавливаем атрибуты и свойства
  // for (const key in config) {
  //   if (config.hasOwnProperty(key) && key !== 'view' && key !== 'body') {
  //     const value = config[key];

  //     if (key === 'className') {
  //       // Для className используем element.className или element.classList.add
  //       if (typeof value === 'string') {
  //         element.className = value; // Перезаписывает существующие классы
  //         // Или для добавления: value.split(' ').forEach(cls => element.classList.add(cls));
  //       }
  //     } else if (key === 'style' && typeof value === 'string') {
  //       // Прямая установка строки style (менее предпочтительно, чем объект style)
  //       element.setAttribute('style', value);
  //     } else if (typeof value === 'boolean') {
  //       // Для булевых атрибутов: если true - установить, если false - не устанавливать
  //       if (value) {
  //         element.setAttribute(camelToKebab(key), '');
  //       }
  //     } else if (typeof value === 'object' && value !== null) {
  //       // Если значение - объект, пробуем установить его как свойство
  //       // Это полезно для сложных данных, которые Svelte-компоненты могут ожидать как пропсы
  //       try {
  //         (element as any)[key] = value;
  //       } catch (e) {
  //         console.warn(`Could not set property "${key}" on <${tagName}>:`, e);
  //         // Как fallback, можно попробовать установить как JSON-строку в атрибут, но это редко нужно
  //         // element.setAttribute(camelToKebab(key), JSON.stringify(value));
  //       }
  //     } else {
  //       // Для остальных (строки, числа) устанавливаем как атрибуты
  //       // Преобразуем camelCase пропсы (minHeight) в kebab-case атрибуты (min-height)
  //       element.setAttribute(camelToKebab(key), String(value));
  //     }
  //   }
  // }
  setPropsAndAttributes(element, config);


  renderInNextFrame(config, element, parentElement);

  const slotContainer = parentElement.shadowRoot?.querySelector('.slot') ?? parentElement.querySelector('.slot') ?? parentElement;
  slotContainer.appendChild(element);
  // parentElement.appendChild(element);

  return element;
}

function renderInNextFrame(config: UiNodeConfig, element: HTMLElement, parentElement: HTMLElement) {
  if (Array.isArray(config)) return;
  if (typeof config !== 'object') return;
  requestAnimationFrame(()=>{
    if (config.body) {
      if (typeof config.body === 'string') {
        element.textContent = config.body;
      } else if (Array.isArray(config.body)) {
        //   const slotElement = parentElement.querySelector("div.slot") ?? parentElement;
        console.log(">>>", parentElement.childNodes);

        config.body.forEach(childConfig => {
          createUI(childConfig, element); // Рекурсивный вызов
        });
      }
    }

  })

}


function renterTextElement(text: string | number, parentElement: HTMLElement): Text {
  const textNode = document.createTextNode(text.toString());
  parentElement.appendChild(textNode);
  return textNode;
}

function setPropsAndAttributes(element: HTMLElement, config: IUiNodeConfig) {
  // Устанавливаем атрибуты и свойства
  console.log(">>>", 1, config);
  for (const key in config) {
    if (config.hasOwnProperty(key) && key !== 'view' && key !== 'body') {
      const value = config[key];

      if (key === 'className') {
        // Для className используем element.className или element.classList.add
        if (typeof value === 'string') {
          // element.className = value; // Перезаписывает существующие классы
          value.split(' ').forEach(cls => element.classList.add(cls));
        }
      } else if (key === 'style' && typeof value === 'string') {
        // Прямая установка строки style (менее предпочтительно, чем объект style)
        element.setAttribute('style', value);
      } else if (typeof value === 'boolean') {
        // Для булевых атрибутов: если true - установить, если false - не устанавливать
        if (value) {
          element.setAttribute(camelToKebab(key), '');
        }
      // } else if (typeof value === 'object' && value !== null) {
      //   // Если значение - объект, пробуем установить его как свойство
      //   // Это полезно для сложных данных, которые Svelte-компоненты могут ожидать как пропсы
      //   try {
      //     (element as any)[key] = value;
      //   } catch (e) {
      //     // console.warn(`Could not set property "${key}" on <${tagName}>:`, e);
      //     // Как fallback, можно попробовать установить как JSON-строку в атрибут, но это редко нужно
      //     element.setAttribute(camelToKebab(key), JSON.stringify(value));
      //   }
      // } else if (key in element) {
      //   console.log("key", "props", key);
      //   // Если это свойство элемента, устанавливаем его
      //   (element as any)[key] = value;
      } else {
        // console.log("key", "props", key);
        console.log("key", "atribute", camelToKebab(key));
        // Если это не свойство элемента, пробуем установить как атрибут
        // Преобразуем camelCase пропсы (minHeight) в kebab-case атрибуты (min-height)
        (element as any)[key] = value;
        element.setAttribute(camelToKebab(key), String(value));
      }
    }
  }
}

// Функция для преобразования camelCase в kebab-case для атрибутов
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}