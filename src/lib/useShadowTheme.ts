import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const themeStore: Writable<string> = writable('/themes/theme-default-light.css'); // Пример значения

export function useShadowTheme(getShadowRoot: () => ShadowRoot | null): void {
  onMount(() => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return console.warn('[useShadowTheme] ShadowRoot is not available on mount.');

    
    const linkElement = addSleelsheet(shadowRoot, 'theme');

    const unsubscribeFromUpdates = themeStore.subscribe(newThemePath => {
      if (linkElement && linkElement.href !== newThemePath) {
        linkElement.href = newThemePath;
      }
    });

    return () => {
      unsubscribeFromUpdates();
    };
  });
}


export function useFontAwesome(getShadowRoot: () => ShadowRoot | null): void {
  onMount(() => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return console.warn('[useShadowTheme] ShadowRoot is not available on mount.');
    
    const linkElement = addSleelsheet(shadowRoot, 'fontawesome');
    linkElement.href = '/fontawesome-free-6.7.2-web/css/all.min.css';
  });
}

function addSleelsheet(shadowRoot: ShadowRoot, attributeName: string): HTMLLinkElement{
    let existingLink = shadowRoot.querySelector(`link[rel="stylesheet"][data-managed-${attributeName}="true"]`);

    if (existingLink) return existingLink as HTMLLinkElement;
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.setAttribute(`data-managed-${attributeName}`, 'true');

    let unsubscribeFromInitial: (() => void) | null = null; // Объявляем заранее
    unsubscribeFromInitial = themeStore.subscribe(initialThemePath => {
      if (linkElement) {
        linkElement.href = initialThemePath;
      }
      if (unsubscribeFromInitial) { // Проверяем, что функция была присвоена
        unsubscribeFromInitial(); // Теперь это безопасно
        unsubscribeFromInitial = null; // Очищаем, чтобы не вызвать дважды случайно
      }
    });

    shadowRoot.appendChild(linkElement);
    shadowRoot.host.classList.add('host');
    return linkElement
}
