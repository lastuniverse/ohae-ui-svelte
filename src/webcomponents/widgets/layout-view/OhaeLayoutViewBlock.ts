import { OhaeUI } from '../../OhaeUI';
import { OhaeLayoutView } from './OhaeLayoutView';

export class OhaeLayoutViewBlock extends OhaeLayoutView {
    constructor() {
        super();
    }

    protected override async render() {
        await super.render();
        // this.setAttribute('padding', '1px');
        this.shadowRoot!.innerHTML += `
            <style>
                :host {
                    /* padding: 1px; */
                    /* border: solid #733 1px; */
                    /* box-shadow: 2px 2px 2px rgba(0, 0, 0, .1); */
                }
            </style>
        `;
    }
}

OhaeUI.registerViewType('layout-block', OhaeLayoutViewBlock);
