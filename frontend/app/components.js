import Playersetup from "./components/comps/player-setup.js";
import Onevsone from "./components/pages/one-vs-one.js";
import Tabletheme from "./components/comps/table-theme.js";
import Paddlecard from "./components/comps/paddle-card.js";
import Table from "./components/comps/table.js";
import Gameplay from "./components/pages/gameplay.js";
import Card from "./components/comps/card.js";
import Local from "./components/pages/local.js";
import Toast from "./components/comps/toast.js";
import Logo from "./components/comps/logo.js";
import Landing from "./components/pages/landing.js";
import Modal from "./components/comps/modal.js";
import Button from "./components/comps/button.js";
import Components from "./components/pages/components.js";
import { routerComponents } from "./router/router.js";

// Define the components of the layouts and their tagname
export const layoutComponents = [
];

// Define the components of the app and their tagname
export const components = [
  ...layoutComponents, // IMPORTANT: Keep this line
  ...routerComponents, // IMPORTANT: Keep this line
	{ tagName: 'p-components', component: Components },
	{ tagName: 'c-button', component: Button, extends: "button"},
	{ tagName: 'c-modal', component: Modal },
	{ tagName: 'p-landing', component: Landing },
	{ tagName: 'c-logo', component: Logo },
	{ tagName: 'c-toast', component: Toast },
	{ tagName: 'p-local', component: Local },
	{ tagName: 'c-card', component: Card },
	{ tagName: 'p-gameplay', component: Gameplay },
	{ tagName: 'c-table', component: Table },
	{ tagName: 'c-paddle-card', component: Paddlecard },
	{ tagName: 'c-table-theme', component: Tabletheme },
	{ tagName: 'p-one-vs-one', component: Onevsone },
	{ tagName: 'c-player-setup', component: Playersetup },
];
