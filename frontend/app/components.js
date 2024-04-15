import Showplayers from "./components/comps/show-players.js";
import Gameovermodal from "./components/comps/gameover-modal.js";
import Scoreboard from "./components/comps/scoreboard.js";
import Addplayers from "./components/comps/add-players.js";
import Playersetup from "./components/comps/player-setup.js";
import Tabletheme from "./components/comps/table-theme.js";
import Paddlecard from "./components/comps/paddle-card.js";
import Table from "./components/comps/table.js";
import Card from "./components/comps/card.js";
import Toast from "./components/comps/toast.js";
import Logo from "./components/comps/logo.js";
import Modal from "./components/comps/modal.js";
import Button from "./components/comps/button.js";
import { routerComponents } from "./router/router.js";

// Define the components of the layouts and their tagname
export const layoutComponents = [
];

// Define the components of the app and their tagname
export const components = [
  ...layoutComponents, // IMPORTANT: Keep this line
  ...routerComponents, // IMPORTANT: Keep this line
	{ tagName: 'c-button', component: Button, extends: "button"},
	{ tagName: 'c-modal', component: Modal },
	{ tagName: 'c-logo', component: Logo },
	{ tagName: 'c-toast', component: Toast },
	{ tagName: 'c-card', component: Card },
	{ tagName: 'c-table', component: Table },
	{ tagName: 'c-paddle-card', component: Paddlecard },
	{ tagName: 'c-table-theme', component: Tabletheme },
	{ tagName: 'c-player-setup', component: Playersetup },
	{ tagName: 'c-add-players', component: Addplayers },
	{ tagName: 'c-scoreboard', component: Scoreboard },
	{ tagName: 'c-gameover-modal', component: Gameovermodal },
	{ tagName: 'c-show-players', component: Showplayers },
];
