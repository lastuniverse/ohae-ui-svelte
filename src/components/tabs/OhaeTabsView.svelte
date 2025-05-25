<svelte:options customElement={{ tag: "ohae-tabs" }} />

<script lang="ts">
    import type { IOhaeTabsConfig, TabButtonSide, TabDataItem } from "./OhaeTabsTypes";
    import { assignColors, initOhae } from "../../lib/ohaeUtils";
    import { appendChildToSlot } from "../../lib/slotsUtils";
    import OhaeTabItemView from "./OhaeTabItemView.svelte";
    import { Color } from "../../lib/Color";
    import { asignLayoutProps } from "../../lib/layoutUtils";

    type TOhaeTabItemView = HTMLElement & OhaeTabItemView;

    initOhae($host(), {
        modifyAppendChild: false,
        loadFontsAwesome: true,
        loadOhaeTheme: true,
    });

    export function appendChild<T extends Node>(node: T): T {
        if (!isOhaeTabItem(node))
            throw new Error("тут можно только ohae-tab-item");

        const child = appendChildToSlot(node, $host());
        initTab(child);
        showTab(activeTabIndex);
        return child as T;
    }

    let {
        flex = 1,
        collapsed = false,
        maxWidth = undefined,
        maxHeight = undefined,
        minWidth = undefined,
        minHeight = undefined,

        tabsSide = "top" as TabButtonSide,
        bodyBgColor = undefined,
        tabsBgColor = "#444",
        className = undefined,
    }: IOhaeTabsConfig = $props();

    $effect(() => {
        asignLayoutProps(()=>$host(), {
            flex,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
            collapsed,
        }); 
               
        assignColors($host(), {
            "--host": "bodyBgColor",
        });
    });

    let tabsData = $state<TabDataItem[]>([]);
    let activeTabIndex = $state<number>(0);
    function initTab(node?: Node) {
        if (!isOhaeTabItem(node)) return null;
        const id =
            node.getAttribute("id") ||
            `ohae-tab-item-${tabsData.length}-${Math.random().toString(36).substring(2, 9)}`;
        node.setAttribute("id", id);
        node.backgroundColor = node.backgroundColor ?? tabsBgColor; // Используем tabsBgColor как fallback
        tabsData.push({
            id,
            header: node.header || "unamed",
            icon: node.icon || "fa-play",
            // backgroundColor: node.backgroundColor,
            color: new Color(node.backgroundColor),
            tabItemElement: node,
        });
        // Если это первый добавленный таб, сделать его активным
        if (tabsData.length === 1 && activeTabIndex === 0) {
             // Инициализация начального состояния видимости
            showTab(0);
        }
    }

    function isOhaeTabItem(node?: Node): node is TOhaeTabItemView {
        if (!node) return false;
        return (node as HTMLElement).tagName?.toLowerCase() === "ohae-tab-item";
    }

    function showTab(indexToShow: number) {
        if (indexToShow < 0 || indexToShow >= tabsData.length) return;
        activeTabIndex = indexToShow;
        tabsData.forEach((item, index) => {
            item.tabItemElement.collapsed = activeTabIndex !== index;
        });
    }

    function handleHeaderWheel(event: WheelEvent) {
        const headerElement = event.currentTarget as HTMLElement;
        if (!headerElement) return;

        // Предотвращаем прокрутку всей страницы, если мы внутри хедера
        event.preventDefault();

        const scrollSpeed = 0.2;
        let scrollAmount = 0;
        // Для большинства мышей deltaY отвечает за вертикальную прокрутку колеса.
        // deltaX используется для горизонтальной прокрутки (например, на тачпадах или спец. мышах).
        // Мы хотим, чтобы вертикальное колесо прокручивало горизонтальные табы,
        // и вертикальное колесо прокручивало вертикальные табы.
        if (tabsSide === "top" || tabsSide === "bottom") {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                scrollAmount = event.deltaX*scrollSpeed;
            } else {
                scrollAmount = event.deltaY*scrollSpeed;
            }
            headerElement.scrollLeft += scrollAmount;
        } else { // tabsSide === "left" || tabsSide === "right"
            scrollAmount = event.deltaY*scrollSpeed;
  
            headerElement.scrollTop += scrollAmount;
        }
    }

    function handleTabsScroollWithKeyboard(e: KeyboardEvent, index: number){
        // Базовая навигация стрелками
        let newIndex = index;

        if (e.key === 'ArrowLeft') newIndex--;
        else if (e.key === 'ArrowRight') newIndex++;
        else if (e.key === 'ArrowUp') newIndex--;
        else if (e.key === 'ArrowDown') newIndex++;

        if (newIndex !== index && newIndex >= 0 && newIndex < tabsData.length) {
            e.preventDefault();
            showTab(newIndex);
            const nextButton = $host().shadowRoot?.getElementById(`btn-${tabsData[newIndex].id}`);
            nextButton?.focus();
        }
    }
</script>

<div
    class="slot header {className || ''}"
    role="tablist"
    aria-label="Список вкладок"
    onwheel={handleHeaderWheel}
>
    {#each tabsData as item, index (item.id)}
        <ohae-tab-button
            label={item.header}
            icon={item.icon}
            side={tabsSide}
            current={index === activeTabIndex}
            backgroundColor={item.color.shift(-0.05).hex}
            onclick={() => showTab(index)}
            onkeydown={(e: KeyboardEvent) => handleTabsScroollWithKeyboard(e, index)}
            aria-controls={item.id}
            id={`btn-${item.id}`}
            role="tab"
            aria-selected={index === activeTabIndex}
            tabindex={index === activeTabIndex ? 0 : -1}
        ></ohae-tab-button>
    {/each}
</div>
<div 
    class="slot default body {className || ''}" 
    role="presentation"
>
    <slot></slot>
</div>

<style>
    .default {
        display: flex;
        flex-direction: column;
        border-radius: 3px;
        overflow: auto;
        height: auto;
        width: auto;
        flex-grow: 1;
        padding: 0px;
        margin: 0px;
    }
    .header {
        display: flex;
        justify-content: space-between; /* flex-start Изменено с space-between для лучшего вида при скролле */
        padding: 0px;
        margin: 0px;
        cursor: pointer;
        font-weight: 500;
    }

    /* Стили для скрытия нативного скроллбара, но сохранения функциональности */
    .header {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
    }
    .header::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }

    :host {
        display: flex;
        box-sizing: border-box;
        border: none;
        border-radius: 3px;
        background-color: var(--host-background, transparent);
        padding: 0px;
        margin: 0px;
        flex: 1 1 0;
        /* width: 100%; */
        width: auto;
        height: auto;
        /* Важно! Чтобы :host не скроллился, а скроллились его части */
        overflow: hidden;
    }

    :host([tabs-side="top"]) {
        flex-direction: column;
    }
    :host([tabs-side="top"]) .header {
        height: 28px;
        margin: -1px 3px;
        overflow-x: auto;
        overflow-y: hidden;
        flex-wrap: nowrap;
    }

    :host([tabs-side="bottom"]) {
        flex-direction: column-reverse;
    }
    :host([tabs-side="bottom"]) .header {
        height: 28px;
        margin: 1px 3px;
        overflow-x: auto;
        overflow-y: hidden;
        flex-wrap: nowrap;
    }

    :host([tabs-side="left"]) {
        flex-direction: row;
    }
    :host([tabs-side="left"]) .header {
        margin: 3px 0px;
        flex-direction: column;

        justify-content: flex-start;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;
    }

    :host([tabs-side="right"]) {
        flex-direction: row-reverse;
    }
    :host([tabs-side="right"]) .header {
        margin: 3px 0px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .header,
    .header > ohae-tab-button {
        flex-shrink: 0;
        flex-basis: 30;
    }
</style>