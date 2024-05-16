import Conv from "./components/comps/conv.js";
import Convheader from "./components/comps/conv-header.js";
import Chatcard from "./components/comps/chat-card.js";
import Chatlist from "./components/comps/chat-list.js";
import Tournamentcard from "./components/comps/tournament-card.js";
import Logout from "./components/comps/logout.js";
import Taskcard from "./components/comps/taskcard.js";
import Playerresources from "./components/comps/playerresources.js";
import Dailyquestscard from "./components/comps/dailyquestscard.js";
import Friendscard from "./components/comps/friendscard.js";
import Usercard from "./components/comps/usercard.js";
import Sidebar from "./components/comps/sidebar.js";
import Sidebarwidget from "./components/comps/sidebar-link.js";
import Match from "./components/comps/match.js";
import Bracket from "./components/comps/bracket.js";
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
	{ tagName: 'c-bracket', component: Bracket },
	{ tagName: 'c-match', component: Match },
	{ tagName: 'c-sidebar-link', component: Sidebarwidget },
	{ tagName: 'c-sidebar', component: Sidebar },
	{ tagName: 'c-usercard', component: Usercard },
	{ tagName: 'c-friendscard', component: Friendscard },
	{ tagName: 'c-dailyquestscard', component: Dailyquestscard },
	{ tagName: 'c-playerresources', component: Playerresources },
	{ tagName: 'c-taskcard', component: Taskcard },
	{ tagName: 'c-logout', component: Logout },
	{ tagName: 'c-tournament-card', component: Tournamentcard },
	{ tagName: 'c-chat-list', component: Chatlist },
	{ tagName: 'c-chat-card', component: Chatcard },
	{ tagName: 'c-conv-header', component: Convheader },
	{ tagName: 'c-conv', component: Conv },
];
