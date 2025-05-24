    export function tryAppendChild<T extends Node>(node: T, hostNode: HTMLElement, slotName?: string): T {
        if ('appendChildToSlot' in hostNode && typeof (hostNode as any).appendChildToSlot === 'function') {
            return (hostNode as any).appendChildToSlot(node, slotName) as T;
        } else {
            return hostNode.appendChild(node);
        }
    }

    export function appendChildToSlot<T extends Node>(node: T, hostNode: HTMLElement, slotName?: string): T {
        const slot = getSlot(hostNode, slotName);
        if(!slot) throw new Error(`Can not find slot '${slotName}'`);
        const child = slot.appendChild(node);
        return child as T;
    }

    export function getSlot(hostNode: HTMLElement, slotName?: string): Element | null{
        const slotClassName = getSlotSelector(slotName);
        let slot = hostNode.shadowRoot?.querySelector(slotClassName) ?? 
            hostNode.querySelector(slotClassName) ?? 
            (!!slotName ? hostNode : null);
        return slot;
    }

    export function getSlotSelector(slotName: string = 'default'): string {
        return '.slot.' + slotName;
    }