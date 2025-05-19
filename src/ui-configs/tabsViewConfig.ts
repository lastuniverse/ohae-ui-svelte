import type { UiNodeConfig } from "../components/OhaeComponetTypes";

export const tabsViewConfig: UiNodeConfig = {
	view: 'tabs',
	tabsSide: 'left',
	// allowHideAll: true,
	tabButtonBackground: "#3d3d3d",
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
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-play", //fa-play-circle
		// 	header: "player",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-gamepad",
		// 	header: "game",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-pencil-square", //fa-sticky-note
		// 	header: "notes",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-refresh",
		// 	header: "????",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-share-alt", //fa-share-alt-square
		// 	header: "share",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-terminal",
		// 	header: "terminal",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-quote-left", // fa-language
		// 	header: "translates",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-cog",
		// 	header: "settings",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-user-circle",
		// 	header: "auth",
		// 	backgroundColor: '#556',
		// 	body: {},
		// },		
		// {
		// 	view: 'tab-item',
		// 	icon: "fa-paper-plane",
		// 	header: "chat",
		// 	backgroundColor: '#556',
		// 	body: {
		// 		// body: '<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-discussion="groupofragame" data-comments-limit="5" data-colorful="1" data-color="F646A4" data-dark="1"></script>'
		// 	},
		// },
	]
};