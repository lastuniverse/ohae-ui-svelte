import type { UiNodeConfig } from "../components/OhaeComponetTypes";

export const tabsViewConfig: UiNodeConfig = {
	view: 'tabs',
	tabsSide: 'left',
	// tabsSide: 'top',
	// tabsSide: 'right',
	// tabsSide: 'bottom',
	bodyBgColor: "#333",
	tabsBgColor: "#505047",
	className: "custom-tabs",
	minWidth: 26,
	body: [
		{
			view: 'tab-item',
			icon: "fa-cube",
			header: "ohae editor",
			direction: 'column',
			body: [
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
				{view: "div", body: "11111"},
			],
		},
		{
			view: 'tab-item',
			icon: "fa-code",
			header: "code editor",
			body: '22222',
		},
		{
			view: 'tab-item',
			icon: "fa-image",
			header: "sprites",
			// backgroundColor: '#556',
			body: "33333",
		},
		{
			view: 'tab-item',
			icon: "fa-play", //fa-play-circle
			header: "player",
			backgroundColor: "#484857",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-gamepad",
			header: "game",
			backgroundColor: "#484857",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-pencil-square", //fa-sticky-note
			header: "notes",
			backgroundColor: "#484857",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-refresh",
			header: "????",
			backgroundColor: "#484857",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-share-alt", //fa-share-alt-square
			header: "share",
			backgroundColor: "#484857",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-terminal",
			header: "terminal",
			backgroundColor: "#485748",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-quote-left", // fa-language
			header: "translates",
			backgroundColor: "#485748",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-cog",
			header: "settings",
			backgroundColor: "#485748",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-user-circle",
			header: "auth",
			backgroundColor: "#485748",
			body: {},
		},		
		{
			view: 'tab-item',
			icon: "fa-paper-plane",
			header: "chat",
			backgroundColor: "#485748",
			body: {
				// body: '<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-discussion="groupofragame" data-comments-limit="5" data-colorful="1" data-color="F646A4" data-dark="1"></script>'
			},
		},
	]
};

export const tabsViewConfigTop: UiNodeConfig = {
	...tabsViewConfig,
	minHeight: 26,
	minWidth: undefined,
	tabsSide: 'top'
}