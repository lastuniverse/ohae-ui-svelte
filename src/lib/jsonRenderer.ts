import type { IUiNodeConfig, UiNodeConfig } from "../components/OhaeComponetTypes";
import type { HTMLOhaeElement } from "./ohaeUtils";

const tagsMap: Record<string, string> = {
  layout: 'ohae-layout',
  resizer: 'ohae-resizer',
  separator: 'ohae-separator',
  icon: 'ohae-icon-of-type',
  tabs: 'ohae-tabs',
  'tab-item': 'ohae-tab-item',
  // 'tab-item': 'ohae-layout',
  'tab-button': 'ohae-tab-button',
  'ace-editor': 'ohae-ace-editor',
};

export async function createUI(config: UiNodeConfig, parentElement: HTMLElement): Promise<HTMLElement|Text|null> {
  if (!config) {
    console.error("Invalid config:", config);
    return null;
  }
  return new Promise((resolve, reject) => {
    requestAnimationFrame(async () => {
      const slotContainer = parentElement;//.shadowRoot?.querySelector('.slot') as HTMLElement ?? parentElement.querySelector('.slot') as HTMLElement ?? parentElement;
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
    return renderElementFromText(config, parentElement);
  }
}

function renderElementFromJson(config: IUiNodeConfig, parentElement: HTMLElement | HTMLOhaeElement): HTMLElement | null {
  const tagName = tagsMap[config.view ?? "template"] ?? config.view ?? "div";
  
  const element = document.createElement(tagName);
  if(!element) {
    console.error("Invalid config or missing view:", config);
    return null;
  }


  setPropsAndAttributes(element, config);

  parentElement.appendChild(element);

  if (config.body) {
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


function renderElementFromText(text: string | number, parentElement: HTMLElement | HTMLOhaeElement): Text | null {
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
    const value = (config as any)[key];

    if (key === 'className') {
      if(typeof value === 'string') value.split(' ').forEach(cls => element.classList.add(cls));
    }
    

    if (key === 'style') {
      if (typeof value === 'string') element.setAttribute('style', value);
    } else if (key in element) {
      (element as any)[key] = value;
      element.setAttribute(camelToKebab(key), String(value));
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
