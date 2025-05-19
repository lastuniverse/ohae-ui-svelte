// src/jsonRenderer.ts

export type UiNodeConfig = IUiNodeConfig | string | number;

export interface IUiNodeConfig {
  view: string; // Имя тега (например, 'layout', 'resizer', 'div')
  body?: UiNodeConfig[] | UiNodeConfig; // Дочерние элементы или текстовое содержимое
  id?: string; // Опциональный ID для элемента
  // Плюс любые другие атрибуты/свойства, которые могут быть у элемента
  [key: string]: any;
}

const tagsMap: Record<string, string> = {
  layout: 'ohae-layout',
  resizer: 'ohae-resizer',
  separator: 'ohae-separator',
  icon: 'ohae-icon-of-type'
};

export async function createUI(config: UiNodeConfig, parentElement: HTMLElement): Promise<HTMLElement|Text|null> {
  if (!config) {
    console.error("Invalid config:", config);
    return null;
  }
  return new Promise((resolve, reject) => {
    requestAnimationFrame(async () => {
      const slotContainer = parentElement.shadowRoot?.querySelector('.slot') as HTMLElement ?? parentElement.querySelector('.slot') as HTMLElement ?? parentElement;
      const element = createUiElement(config, slotContainer)
      if(element) {
        resolve(element)
      } else {
        reject(null);
        throw new Error(`Can'not create element for ${config}`);
      }
    });
  })
}

function createUiElement(config: UiNodeConfig, parentElement: HTMLElement): HTMLElement | Text | null {
  if (typeof config === 'object') {
    return renderElementFromJson(config, parentElement);
  } else {
    return renterElementFromText(config, parentElement);
  }
}

function renderElementFromJson(config: IUiNodeConfig, parentElement: HTMLElement): HTMLElement | null {
  if (!config.view) {
    console.error("Invalid config or missing view:", config);
    return null;
  }

  const tagName = tagsMap[config.view] ?? config.view;
  
  const element = document.createElement(tagName);
  if(!element) {
    console.error("Invalid config or missing view:", config);
    return null;
  }


  setPropsAndAttributes(element, config);
  parentElement.appendChild(element);
  

  if (config.body) {
    // const slotContainer = element.shadowRoot?.querySelector('.slot') as HTMLElement ?? element.querySelector('.slot') as HTMLElement ?? element;
    if (Array.isArray(config.body)) {
      (config.body as UiNodeConfig[]).forEach((configChild: UiNodeConfig) => {
        createUI(configChild, element);
      });
    } else {
      createUI(config.body, element);
    }
  }

  return element;
}


function renterElementFromText(text: string | number, parentElement: HTMLElement): Text | null {
  if (text.toString().length === 0) {
    console.error("Invalid ctreate Text element for empty string");
    return null;
  }
  const element = document.createTextNode(text.toString());
  parentElement.appendChild(element);
  return element;
}


function setPropsAndAttributes(element: HTMLElement, config: IUiNodeConfig) {
  for (const key in config) {
    if (!config.hasOwnProperty(key) || key === 'view' || key === 'body') continue;
    const value = config[key];

    if (key === 'className') {
      if(typeof value === 'string') value.split(' ').forEach(cls => element.classList.add(cls));
    }
    

    if (key === 'style') {
      if (typeof value === 'string') element.setAttribute('style', value);
    } else if (key in element) {
      (element as any)[key] = value;
    } else if (typeof value === 'object'){
        (element as any)[key] = value;
    } else if (typeof value === 'boolean'){
        if (value) element.setAttribute(camelToKebab(key), '');
    }else{
        element.setAttribute(camelToKebab(key), String(value));
    }
  }
}

// Функция для преобразования camelCase в kebab-case для атрибутов
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}