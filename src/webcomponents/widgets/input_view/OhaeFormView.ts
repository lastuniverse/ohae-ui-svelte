import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";

export class OhaeFormView extends OhaeLayoutView {
	protected static readonly HTML: string = `
		<form><slot></slot></form>
	`;
}

OhaeUI.registerViewType('form', OhaeFormView);
