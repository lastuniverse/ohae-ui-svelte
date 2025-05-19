<svelte:options customElement={{ tag: "ohae-tabs" }} />

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { useShadowTheme } from "../../lib/useShadowTheme";
    import { Color } from "../../lib/Color";
    import type { TabButtonSide } from "./OhaeTabItemButton.svelte"; // Assuming OhaeTabItemButtonView.svelte is in the same folder
    import type { TFlexDirection } from "../../lib/OhaeViewOptions";

    type TabInfo = {
        id: string;
        header: string;
        icon: string;
        tabButtonBackground?: string;
        element: HTMLElement; // The ohae-tab-item element itself
    };

    let {
        // Layout props for the TabsView host itself
        flex = 1,
        width = "100%",
        height = "100%",
        padding = 0,
        margin = 0,
        backgroundColor = undefined, // For the host element of TabsView
        overflow = "hidden", // Tabs view itself usually hidden overflow

        // OhaeTabsView specific props
        tabsSide = "top" as TabButtonSide,
        tabsHeight = "28px",
        tabsWidth = "auto", // e.g., "100px" for left/right side tabs header
        allowHideAll = false,
        tabButtonBackground: defaultTabButtonBackground = undefined, // Default for all tab buttons
        className = undefined, // For the host element
        customStyle = "", // For the host element
    }: {
        flex?: number | string;
        width?: string | number;
        height?: string | number;
        padding?: string | number;
        margin?: string | number;
        backgroundColor?: string;
        overflow?: string;
        tabsSide?: TabButtonSide;
        tabsHeight?: string | number;
        tabsWidth?: string | number;
        allowHideAll?: boolean;
        tabButtonBackground?: string;
        className?: string;
        customStyle?: string;
    } = $props();

    useShadowTheme(() => $host().shadowRoot);

    let tabItemsData = $state<TabInfo[]>([]);
    let activeTabId = $state<string | null>(null);
    let headerRef: HTMLElement | undefined = $state(); // For binding to the header div

    const hostFlexDirection = $derived((): TFlexDirection => {
        switch (tabsSide) {
            case "top":
                return "column";
            case "bottom":
                return "column-reverse";
            case "left":
                return "row";
            case "right":
                return "row-reverse";
            default:
                return "column";
        }
    });

    $effect(() => {
        const host = $host();
        if (!host) return;
        host.style.display = "flex";
        host.style.flexDirection = hostFlexDirection as any as string;
        host.style.overflow = overflow;
        host.style.width =
            typeof width === "number" ? `${width}px` : String(width);
        host.style.height =
            typeof height === "number" ? `${height}px` : String(height);
        host.style.padding =
            typeof padding === "number" ? `${padding}px` : String(padding);
        host.style.margin =
            typeof margin === "number" ? `${margin}px` : String(margin);
        if (flex !== undefined) host.style.flex = String(flex);

        if (className) {
            // Apply className to host
            className.split(" ").forEach((cls) => host.classList.add(cls));
        }
        if (customStyle) {
            // Apply customStyle to host
            host.style.cssText += customStyle;
        }

        // Handle backgroundColor for the TabsView host (like OhaeBaseView)
        if (!backgroundColor) {
            host.style.removeProperty("--host-bg");
            host.style.removeProperty("--host-color");
            // ... remove other vars ...
            host.style.boxShadow = "";
            return;
        }
        const color = new Color(backgroundColor);
        host.style.setProperty("--host-bg", color.hex);
        host.style.setProperty("--host-color", color.contrast(0.5).mono().hex);
        host.style.setProperty(
            "--host-hr-color",
            color.contrast(0.2).mono().hex,
        );
        // Add other vars as in OhaeBaseView if needed
        host.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, .1)";
    });

    function collectTabItems() {
        const host = $host();
        if (!host) return;
        const items: TabInfo[] = [];
        let newActiveTabId: string | null = null;
        let foundActiveByProp = false;

        Array.from(host.children).forEach((child, index) => {
            if (child.tagName.toLowerCase() === "ohae-tab-item") {
                const tabItemEl = child as HTMLElement & {
                    id: string;
                    header?: string;
                    tabIcon?: string;
                    active?: boolean;
                    tabButtonBackground?: string;
                };

                if (!tabItemEl.id)
                    tabItemEl.id = `ohae-tab-${Date.now()}-${index}`;

                items.push({
                    id: tabItemEl.id,
                    header: tabItemEl.header || `Tab ${index + 1}`,
                    icon: tabItemEl.tabIcon || "fa-window-maximize",
                    tabButtonBackground:
                        tabItemEl.tabButtonBackground ||
                        defaultTabButtonBackground,
                    element: tabItemEl,
                });

                if (tabItemEl.active && !foundActiveByProp) {
                    newActiveTabId = tabItemEl.id;
                    foundActiveByProp = true;
                }
            }
        });
        tabItemsData = items;

        if (foundActiveByProp) {
            setActiveTab(newActiveTabId, true);
        } else if (
            activeTabId &&
            items.some((item) => item.id === activeTabId)
        ) {
            // Keep current active tab if it still exists and no other tab is marked active
            setActiveTab(activeTabId, true); // Re-apply to ensure consistency
        } else if (!allowHideAll && items.length > 0) {
            setActiveTab(items[0].id, true);
        } else {
            setActiveTab(null, true); // All hidden or no tabs
        }
    }

    function setActiveTab(tabId: string | null, isInitialOrSilent = false) {
        activeTabId = tabId;
        tabItemsData.forEach((itemData) => {
            const isActive = itemData.id === tabId;
            if (
                itemData.element &&
                (itemData.element as any).active !== isActive
            ) {
                (itemData.element as any).active = isActive;
            }
        });
        // if (!isInitialOrSilent && host) {
        //   host.dispatchEvent(new CustomEvent('tabchange', { detail: { activeTabId: tabId } }));
        // }
    }

    function handleTabButtonClick(tabId: string) {
        if (activeTabId === tabId) {
            if (allowHideAll) setActiveTab(null);
        } else {
            setActiveTab(tabId);
        }
    }

    let observer: MutationObserver | null = null;
    onMount(() => {
        collectTabItems();

        observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    collectTabItems();
                    break;
                }
            }
        });
        observer.observe($host(), { childList: true });
    });

    onDestroy(() => {
        if (observer) observer.disconnect();
    });

    const dynamicHeaderStyles = $derived(() => {
        let s = "";
        if (tabsSide === "top" || tabsSide === "bottom") {
            s += `height: ${typeof tabsHeight === "number" ? tabsHeight + "px" : tabsHeight}; `;
            s += `flex-direction: row; `;
            s += `margin: ${tabsSide === "top" ? "0px 10px -1px 10px" : "-1px 10px 0px 10px"};`; // Adjusted margin for border overlap
        } else {
            // left or right
            s += `width: ${typeof tabsWidth === "number" ? tabsWidth + "px" : tabsWidth}; `;
            s += `flex-direction: column; `;
            s += `align-items: ${tabsSide === "left" ? "flex-start" : "flex-end"}; `; // WC had 'end' for both
            s += `margin: ${tabsSide === "left" ? "0px -1px 0px 3px" : "0px 3px 0px -1px"};`; // Adjusted margin
        }
        return s;
    });
</script>

<div
    bind:this={headerRef}
    class="tabs-header"
    style={dynamicHeaderStyles as any as string}
>
    {#each tabItemsData as tab (tab.id)}
        <ohae-tab-button
            label={tab.header}
            icon={tab.icon}
            side={tabsSide}
            current={tab.id === activeTabId}
            backgroundColor={tab.tabButtonBackground}
            on:click={() => handleTabButtonClick(tab.id)}
            flex={tabsSide === "left" || tabsSide === "right" ? "none" : 1}
        ></ohae-tab-button>
    {/each}
</div>

<div class="slot tabs-body-content-area">
    <!-- 
    Tab items (<ohae-tab-item>) are direct children of <ohae-tabs> in the light DOM.
    They are not re-rendered here; they exist in the <slot> and manage their own 
    visibility based on their 'active' prop, which this component controls.
  -->
    <!-- <slot></slot> -->
</div>

<style>
    :host {
        /* display, flex-direction, overflow, width, height, padding, margin, flex are set by $effect */
        box-sizing: border-box;
        /* background-color: var(--host-bg, transparent); /* Set by $effect if backgroundColor prop is present */
    }

    /* Style for when host has a specific background color set via prop */
    :host([style*="--host-bg"]) {
        /* A bit of a hack to check if --host-bg is set by the component */
        /* box-shadow: 2px 2px 2px rgba(0, 0, 0, .1); /* Set by $effect */
        /* color: var(--host-color, #ddd); /* Set by $effect */
    }

    .tabs-header {
        display: flex;
        color: #ccc; /* Default from WC */
        justify-content: flex-start;
        align-items: stretch;
        padding: 0px;
        flex-shrink: 0;
        gap: 2px; /* Small gap between tab buttons */
        box-sizing: border-box;
        position: relative; /* For z-index to ensure borders overlap correctly */
        z-index: 1;
    }

    .tabs-body-content-area {
        display: flex; /* Make it a flex container */
        flex-direction: column; /* Children inside usually stack */
        flex-grow: 1;
        padding: 0px; /* Default, can be overridden by host padding if desired */
        margin: 0px;
        overflow: auto; /* Body content can scroll */
        border-radius: 3px; /* Consistent with OhaeBaseView */
        box-sizing: border-box;
        position: relative; /* For z-index to ensure it's behind header borders */
        /* Apply background from host if set, or theme */
        background-color: var(
            --host-bg,
            var(--theme-default-body-bg, transparent)
        ); /* Example variable */
        color: var(--host-color, var(--theme-default-body-color, #ccc));
    }

    /* Slotted ohae-tab-item elements handle their own display based on 'active' prop.
     We just ensure they can fill the space if they are active. */
    ::slotted(ohae-tab-item) {
        /* Assuming ohae-tab-item sets its own width/height to 100% when active */
    }
</style>
