<svelte:options customElement={{ tag: "ohae-tabs" }} />

<script lang="ts">
    import type { IOhaeTabsConfig, TabButtonSide, TabDataItem } from "./OhaeTabsTypes";
    import { assignColors, initOhae } from "../../lib/ohaeUtils";
    import { appendChildToSlot } from "../../lib/slotsUtils";
    import OhaeTabItemView from "./OhaeTabItemView.svelte";

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
        tabsSide = "top" as TabButtonSide,
        bodyBgColor = undefined,
        tabsBgColor = undefined,
        className = undefined,
    }: IOhaeTabsConfig = $props();

    $effect(() => {
        assignColors($host(), {
            "--host": "bodyBgColor",
            // "--head": "tabsBgColor",
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
        node.backgroundColor = node.backgroundColor ?? tabsBgColor;
        tabsData.push({
            id,
            header: node.header || "unamed",
            icon: node.icon || "fa-play",
            backgroundColor: node.backgroundColor,
            tabItemElement: node,
        });
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

        let scrollAmount = 0;
        // Для большинства мышей deltaY отвечает за вертикальную прокрутку колеса.
        // deltaX используется для горизонтальной прокрутки (например, на тачпадах или спец. мышах).
        // Мы хотим, чтобы вертикальное колесо прокручивало горизонтальные табы,
        // и вертикальное колесо прокручивало вертикальные табы.

        if (tabsSide === "top" || tabsSide === "bottom") {
            // Горизонтальная прокрутка табов
            // Если есть deltaX (например, тачпад или мышь с горизонтальным колесом), используем его.
            // Иначе, используем deltaY (стандартное колесо мыши).
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                scrollAmount = event.deltaX;
            } else {
                scrollAmount = event.deltaY;
            }
            headerElement.scrollLeft += scrollAmount;
        } else { // tabsSide === "left" || tabsSide === "right"
            // Вертикальная прокрутка табов
            // Здесь обычно deltaY является основным, но deltaX тоже может влиять (например, на тачпадах)
            // Для простоты используем deltaY, т.к. headerElement.scrollTop ожидает вертикальный сдвиг.
            scrollAmount = event.deltaY;
            // Если хотите, чтобы горизонтальный скролл тачпада тоже влиял:
            // if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            //     scrollAmount = event.deltaX; // Это может быть нелогично для вертикальных табов, но возможно для тачпадов
            // }
            headerElement.scrollTop += scrollAmount;
        }
    }    
</script>

<div 
    class="slot header {className}" 
    role="presentation"
    onwheel={(e:MouseEvent)=>{}}
>
<!-- <div
    class="slot header {className || ''}"
    role="tablist"
    aria-label="Список вкладок"
    onwheel={handleHeaderWheel}
> -->
    {#each tabsData as item, index (item.id)}
        <ohae-tab-button
            label={item.header}
            icon={item.icon}
            side={tabsSide}
            current={index === activeTabIndex}
            backgroundColor={item.backgroundColor}
            onclick={() => showTab(index)}
            onkeydown={(e: KeyboardEvent) => {}}
            aria-controls={item.id}
            id={`btn-${item.id}`}
            role="tab"
            aria-selected={index === activeTabIndex}
            tabindex={index === 0}
        ></ohae-tab-button>
        <!-- tabindex={index === activeTabIndex ? 0 : -1} -->
    {/each}
</div>
<div class="slot default body {className}" role="presentation">
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
        height: 28px;
        justify-content: space-between;
        padding: 0px 0px;
        /* margin: 0px 10px; */
        margin: 0px 0px;
        cursor: pointer;
        font-weight: 500;
    }
    .header::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }

    :host {
        display: flex;
        box-sizing: border-box;
        background-color: var(--host-background, transparent);
        padding: 0px;
        margin: 0px;
        overflow: auto;
        height: auto;
        width: auto;
        flex-grow: 1;
    }
    :host([tabs-side="top"]) {
        flex-direction: column;
    }
    :host([tabs-side="bottom"]) {
        flex-direction: column-reverse;
    }
    :host([tabs-side="left"]) {
        flex-direction: row;
    }
    :host([tabs-side="right"]) {
        flex-direction: row-reverse;
    }
    :host([tabs-side="top"]) .header {
        margin: -1px 10px;
    }
    :host([tabs-side="bottom"]) .header {
        margin: 1px 10px;
    }
    :host([tabs-side="left"]) .header,
    :host([tabs-side="right"]) .header {
        margin: 3px 0px;
        flex-direction: column;
        justify-content: flex-end;
        align-items: start;
    }
</style>
