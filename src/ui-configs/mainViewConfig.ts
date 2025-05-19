import type { IUiNodeConfig } from "../lib/jsonRenderer";
import { bodyViewConfig } from "./bodyViewConfig";
import { footerViewConfig } from "./footerViewConfig";
import { headerViewConfig } from "./headerViewConfig";

export const mainViewConfig: IUiNodeConfig = {
  view: 'layout',
  width: '100%',
  height: '100vh',
  flex: 1,
  direction: 'column',
  overflow: 'hidden',
  className: 'body',
  body: [
    headerViewConfig,
    bodyViewConfig,
    footerViewConfig,
  ]
};