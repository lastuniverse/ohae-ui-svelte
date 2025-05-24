import { OhaeUI } from "../OhaeUI";
import { OhaeBaseView } from "./base_view/OhaeBaseView";

export class OhaeFieldsetView extends OhaeBaseView {
    public static readonly ATTRIBUTES: string[] = [
        'pined',
        'collapsed',
        'header',
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 0px;
            margin: 0px;
            flex-grow: 1;
            /* flex: 1; */
        }

        :host([backgroundColor]) {
            color: var(--host-color, #aaa);
        }

        .header {
            display: flex;
            align-items: center;
            height: 28px;
            border: solid #222 1px;
            background-color: #363c46;
            color: #aaa;
            border-radius: 4px 4px 0 0;
            justify-content: space-between;
            padding: 0px 10px;
            font-weight: 500;
        }

        .header-body {
            display: flex;
            flex: 1;
            text-align: left;
            justify-content: center;
            height: auto;
            width: auto;
        }

        .header-icon {
            flex: 0;
            margin-left: 10px;
        }

        .body {
            display: flex;
            flex-direction: column;
            padding: 5px;
            background-color:  var(--host-bg, #333);
            box-shadow: 2px 2px 2px rgba(0, 0, 0, .1);
            color: var(--host-color, #aaa);
            border-radius: 0px 0px 3px 3px;

            */
            flex-wrap: wrap;
            flex: 1;
            border: solid #222 1px;
            border-top: none;
            overflow: auto;
            gap: 5px; /* Расстояние между элементами */
            */
        }

        .collapse {
            display: none;
            /* 
            opacity: 0;
            visibility: hidden;
            transition: opacity 2.5s ease, visibility 2.5s ease;
            */
        }
		::slotted(*) {
            /* flex: 1;  */ /* Все элементы слота будут равномерно растянуты */
            /* min-width: 0; */ /* Позволяет элементам сужаться */
        }
    </style>
    `;
    protected static readonly ICON_CLOSE: string = '⬤'; //▼ //▼◆■▲◄●▬◯◼ ⚫⦁
    protected static readonly ICON_OPEN = '⭘'; //◄ //►◄▼✚୦๏྾ᐤ᠅᪠᮰ᰞ᳁᳃‒⊕⊖⊗⊘⊙⊚    

    protected static readonly HTML: string = `
        <div class="header">
            <div class="header-body"></div>
            <div class="header-icon">${this.ICON_CLOSE}</div>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    `;

    protected override async connectedCallback() {
        await super.connectedCallback();
        this.applyAttributes(OhaeFieldsetView.ATTRIBUTES);

        const header = this.shadowRoot?.querySelector('.header') as HTMLElement;
        if (header) {
            header.addEventListener('click', this.collapse.bind(this));
        }

        this.updateIcon();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    collapse() {
        const value = this.collapsed;
        console.log('collapse', value, !value)
        this.collapsed = !value;
    }

    updateIcon() {
        const headerIcon = this.shadowRoot?.querySelector('.header-icon') as HTMLElement;
        if (!headerIcon) return;

        // if (this.pined) {
        //     headerIcon.innerText = this._inactionIcon;
        // } else 

        if (this.collapsed) {
            headerIcon.innerText = OhaeFieldsetView.ICON_OPEN;
        } else {
            headerIcon.innerText = OhaeFieldsetView.ICON_CLOSE;
        }
    }

    // get pined(): boolean {
    //     return this.getAttribute('pined') === 'true';
    // }
    // set pined(value:  boolean | string | null) {
    //     value = value === true || value === 'true';
    //     if (value) {
    //         this.setAttribute('pined', 'true');
    //     } else {
    //         this.removeAttribute('pined');
    //     }        
    //     this.updateIcon();
    // }

    get collapsed(): boolean {
        return this.getAttribute('collapsed') === 'true';
    }
    set collapsed(value: boolean | string | null) {
        value = value === true || value === 'true';
        const body = this.shadowRoot?.querySelector('.body') as HTMLElement;
        const header = this.shadowRoot?.querySelector('.header') as HTMLElement;
        console.log('collapsed', value)
        if (value) { // && !this.pined
            this.setAttribute('collapsed', 'true');
            body?.classList.add('collapse');
            header?.classList.add('header-collapse');
        } else {
            this.removeAttribute('collapsed');
            body?.classList.remove('collapse');
            header?.classList.remove('header-collapse');
        }
        this.updateIcon();
    }

    get header(): string {
        const headerBody = this.shadowRoot?.querySelector('.header-body') as HTMLElement;
        return headerBody?.innerText ?? '';
    }
    set header(value: string) {
        const headerBody = this.shadowRoot?.querySelector('.header-body') as HTMLElement;
        if (headerBody) {
            headerBody.innerText = value ?? '';
        }
    }
}

OhaeUI.registerViewType('fieldset', OhaeFieldsetView);
