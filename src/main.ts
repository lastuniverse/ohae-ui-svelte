// src/main.ts
import './app.css';
import { themeStore } from './lib/useShadowTheme';

// 1. Импортируйте ваши Svelte компоненты, чтобы они зарегистрировались как Custom Elements.
// Этот импорт нужен только для того, чтобы код регистрации выполнился.
// Переменные можно не использовать, если только для регистрации.
import './components/lauout/OhaeLayoutView.svelte';
import './components/lauout/OhaeResizerView.svelte';
import './components/lauout/OhaeSeparatorView.svelte';
import './components/icons/OhaeIconOfTypeView.svelte';

// 2. Импортируйте вашу конфигурацию и функцию рендеринга
import { mainViewConfig } from './ui-configs/mainViewConfig.js';
import { createUI } from './lib/jsonRenderer';

// 3. Найдите целевой элемент в DOM
const appRootElement = document.getElementById('app');



(async ()=>{
  if (appRootElement) {
    // 4. Вызовите рендерер
    await createUI(mainViewConfig, appRootElement);
  } else {
    console.error("Root element #app not found!");
  }

  // Старый код монтирования Svelte приложения больше не нужен,
  // если вы полностью переходите на JSON-рендерер с Custom Elements.
  // import { mount } from 'svelte'
  // import App from './App.svelte'
  // const app = mount(App, {
  //   target: document.getElementById('app')!,
  // })
  // export default app;



  themeStore.set('/themes/theme-default-dark.css');
  // setTimeout(() => {
  //   themeStore.set('/themes/theme-default-light.css');
  // }, 5000);
})();
