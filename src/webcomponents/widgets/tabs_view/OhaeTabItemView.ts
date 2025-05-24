import { Color } from "../../utils/Color";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";

export class OhaeTabItemViewOld extends OhaeLayoutView {
    public static readonly ATTRIBUTES: string[] = [
        'tabIcon', 
        'header',
        'active',
        'tabButtonBackground',
    ];
    
 	protected static readonly ICON_CLOSE: string = '⬤';
    protected static readonly ICON_OPEN = 'fa-circle-o';

	protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeTabItemViewOld.ATTRIBUTES);
        this.hide();
        // this.updateHeader();
    }
	
	static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }
	
    // private updateHeader() {
    //     const icon = this.shadowRoot?.querySelector('.tab-icon');
    //     const text = this.shadowRoot?.querySelector('.tab-text');
    //     if(icon) icon.textContent = this.tabIcon;
    //     if(text) text.textContent = this.header;
    // }

    public show() {
        super.show();
    }

    public hide() {
        super.hide();
    }

    // Getters/Setters
    get active(): boolean { 
		return this.getAttribute('active') === 'true';
	}
    set active(value: boolean | string | null) {
		value = value === true || value === 'true';
        if (value) {
            this.setAttribute('active', 'true');
        } else {
            this.removeAttribute('active');
        }
	}

    get icon(): string { 
		return this.getAttribute('icon') ?? 'fa ' + OhaeTabItemViewOld.ICON_OPEN; 
	}
    set icon(value: string | null) { 
		value = value ?? ""; 
		this.setAttribute('icon', value);
		// this.updateHeader();
	}

    get header(): string {
        return this.getAttribute('header')  ?? '';
    }
    set header(value: string | null) {
        value = value ?? '';
		this.setAttribute('header', value);
		// this.updateHeader();
    }
    
    set tabButtonBackground(value: string | Color | null){
        if(!value) return;
        const color = typeof value === 'string' ? new Color(value) : value;
        this.setAttribute('tabButtonBackground', color.hex)
    }

    get tabButtonBackground(): Color | null{
        const tabBgColor = this.getAttribute('tabButtonBackground');
        return tabBgColor ? new Color( tabBgColor) : null;
    }
}

customElements.define('ohae-tab-item', OhaeTabItemViewOld);


declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        header?: string;
        tabIcon?: string;
        active?: string | boolean;
        tabButtonBackground?: string;
    }
}
