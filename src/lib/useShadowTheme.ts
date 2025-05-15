// src/lib/useShadowTheme.ts
import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';

// Глобальная реактивная переменная
export const themeStore: Writable<string> = writable('/themes/theme-default-light.css'); // Пример значения

export function useShadowTheme(getShadowRoot: () => ShadowRoot | null): void {
  let themeLinkElement: HTMLLinkElement | null = null;

  onMount(() => {
    const shadowRoot = getShadowRoot();

    if (!shadowRoot) {
      console.warn('[useShadowTheme] ShadowRoot is not available on mount.');
      return;
    }
    
    let existingLink = shadowRoot.querySelector('link[rel="stylesheet"][data-managed-theme="true"]');

    if (existingLink) {
      themeLinkElement = existingLink as HTMLLinkElement;
    } else {
      themeLinkElement = document.createElement('link');
      themeLinkElement.rel = 'stylesheet';
      themeLinkElement.setAttribute('data-managed-theme', 'true');

      // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
      let unsubscribeFromInitial: (() => void) | null = null; // Объявляем заранее
      unsubscribeFromInitial = themeStore.subscribe(initialThemePath => {
        if (themeLinkElement) {
            themeLinkElement.href = initialThemePath;
        }
        if (unsubscribeFromInitial) { // Проверяем, что функция была присвоена
          unsubscribeFromInitial(); // Теперь это безопасно
          unsubscribeFromInitial = null; // Очищаем, чтобы не вызвать дважды случайно
        }
      });
      // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

      shadowRoot.appendChild(themeLinkElement);
      shadowRoot.host.classList.add('host');
    }

    // Основная подписка на последующие изменения
    const unsubscribeFromUpdates = themeStore.subscribe(newThemePath => {
      if (themeLinkElement && themeLinkElement.href !== newThemePath) {
        themeLinkElement.href = newThemePath;
      }
    });

    return () => {
      unsubscribeFromUpdates();
      // Если unsubscribeFromInitial все еще существует (например, компонент размонтировался до первого emit'а),
      // также отписываемся. Но это маловероятно, так как subscribe обычно эмитит сразу текущее значение.
      // if (unsubscribeFromInitial) {
      //   unsubscribeFromInitial();
      // }
    };
  });
}