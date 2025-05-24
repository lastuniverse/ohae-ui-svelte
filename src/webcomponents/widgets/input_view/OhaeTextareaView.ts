import { OhaeUI } from "../../OhaeUI";
import { OhaeBaseInputView } from "./OhaeBaseInputView";

export class OhaeTextareaView extends OhaeBaseInputView {
    public static readonly ATTRIBUTES: string[] = [
        'lines',
        'value',
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            width: 100%;
            padding: 0px;
            margin: 0px;
        }

        .input-wrapper {
            margin: 3px 3px;
            display: flex;
        }

        .input-box {
            display: flex;
            --input-width: 200px;
            width: var(--input-width);
            min-width: var(--input-width);
            max-width: var(--input-width);
            padding: 0px;
            margin: 0px;
            justify-content: right;
        }

        .input-separator {
            display: flex;
            align-items: center;
            min-width: 10px;
            max-width: 10px;
            margin: 0px 5px;
            flex-basis: 10px;
            font-size: 8px;
            color: #ab6161;
        }

        .input-label {
            display: flex;
            align-items: center;
            padding: 0px;
            margin: 0px;
            white-space: nowrap;
        }

   		:host([lines]) .input-label{
			white-space: wrap;
		}


        textarea {
            color: #aaa;
            outline: 0;
            background-color: #3d3d3d;
            /* box-shadow: inset 1px 1px 12px rgba(0, 0, 0, 0.2); */
            border: solid #282828 1px;
            border-radius: 3px;
            width: 100%;
            margin: 0px;
            padding: 0px 0px;
            height: auto;
            resize: vertical;
        }
		
		textarea[rows] {
			height: auto;
		}

        textarea:focus, textarea:active {
            border: solid #415e9c 1px;
            box-shadow: none;
        }

        textarea:read-only {
            background-color: #404343;
            border: solid #383838 1px;
            box-shadow: none;
            color: #777;
        }

        textarea:disabled {
            background-color: #444;
            border: solid #383838 1px;
            box-shadow: none;
            color: #777;
        }

        ::-webkit-resizer {
            background-color: #415e9c;
            border: 0;
            border-radius: 10px 2px 2px 2px;
            padding: 0;
            outline: 0;
            flex-basis: 100%;
        }
    </style>
	<link rel="stylesheet" href="./external.css">
    `;

    protected static readonly HTML: string = `
        <div class="input-wrapper">
            <div class="input-box">
                <textarea class="input"></textarea>
            </div>
            <div class="input-separator"></div>
            <label class="input-label"></label>
        </div>
    `;

    protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeTextareaView.ATTRIBUTES);
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

	protected get inputView(): HTMLInputElement {
		return this.shadowRoot?.querySelector('textarea') as any as HTMLInputElement;
	}

    protected get textareaView(): HTMLTextAreaElement {
        return this.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    }

    get value(): string {
        return this.textareaView?.value;
    }
    set value(value: string) {
		const view = this.inputView;
        if(view) this.textareaView.value = value;
    }

    get lines(): number | null {
        const value = this.getAttribute('lines');
        return value ? parseInt(value) : null;
    }
    set lines(value: number | null) {
        if (value !== null) {
            this.setAttribute('lines', value.toString());
            this.textareaView?.setAttribute('rows', value.toString());
        } else {
            this.removeAttribute('lines');
            this.textareaView?.removeAttribute('rows');
        }
    }
}

OhaeUI.registerViewType('textarea', OhaeTextareaView);