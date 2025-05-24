import type { UiNodeConfig } from "../components/OhaeComponetTypes";

export const tabsViewConfig: UiNodeConfig = {
	view: 'tabs',
	tabsSide: 'left',
	// tabsSide: 'top',
	// tabsSide: 'right',
	// tabsSide: 'bottom',
	bodyBgColor: "#222",
	tabsBgColor: "#4d3d3d",
	className: "custom-tabs",
	body: [
		{
			view: 'tab-item',
			icon: "fa-cube",
			header: "ohae editor",
			body: {view: "div", body: "11111"},
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
			backgroundColor: "#3d3d4d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-gamepad",
			header: "game",
			backgroundColor: "#3d3d4d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-pencil-square", //fa-sticky-note
			header: "notes",
			backgroundColor: "#3d3d4d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-refresh",
			header: "????",
			backgroundColor: "#3d3d4d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-share-alt", //fa-share-alt-square
			header: "share",
			backgroundColor: "#3d3d4d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-terminal",
			header: "terminal",
			backgroundColor: "#3d4d3d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-quote-left", // fa-language
			header: "translates",
			backgroundColor: "#3d4d3d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-cog",
			header: "settings",
			backgroundColor: "#3d4d3d",
			body: {},
		},
		{
			view: 'tab-item',
			icon: "fa-user-circle",
			header: "auth",
			backgroundColor: "#3d4d3d",
			body: {},
		},		
		{
			view: 'tab-item',
			icon: "fa-paper-plane",
			header: "chat",
			backgroundColor: "#3d4d3d",
			body: {
				// body: '<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-discussion="groupofragame" data-comments-limit="5" data-colorful="1" data-color="F646A4" data-dark="1"></script>'
			},
		},
	]
};