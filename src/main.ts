import './app.css';
import { themeStore } from './lib/useShadowTheme';

// 1. Импортируйте ваши Svelte компоненты, чтобы они зарегистрировались как Custom Elements.
import './components/lauout/OhaeLayoutView.svelte';
import './components/lauout/OhaeResizerView.svelte';
import './components/lauout/OhaeSeparatorView.svelte';
import './components/icons/OhaeIconOfTypeView.svelte';
import './components/tabs/OhaeTabsView.svelte';
import './components/tabs/OhaeTabItemView.svelte';
import './components/tabs/OhaeTabButtonView.svelte';


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

  themeStore.set('/themes/theme-default-dark.css');
})();
