import Countdownmodal from "./components/comps/countdown-modal.js";
import Threedots from "./components/comps/three-dots.js";
import Onlinegameovermodal from "./components/comps/online-gameover-modal.js";
import Onlinescoreboard from "./components/comps/online-scoreboard.js";
import Onlinepongtable from "./components/comps/online-pong-table.js";
import Onlinetournamentmatch from "./components/comps/online-tournament-match.js";
import Onlinebrackets from "./components/comps/online-brackets.js";
import Tournamentevent from "./components/comps/tournament-event.js";
import Tournamenteventscard from "./components/comps/tournament-events-card.js";
import Notification from "./components/comps/notification.js";
import Notificationdropdown from "./components/comps/notification-dropdown.js";
import Friendslistmodal from "./components/comps/friends-list-modal.js";
import Loader from "./components/comps/loader.js";
import Friendslist from "./components/comps/friends-list.js";
import Usercardloading from "./components/comps/usercard-loading.js";
import Uploadavatarmodal from "./components/comps/upload-avatar-modal.js";
import Statisticscard from "./components/comps/statistics-card.js";
import Chatlistitems from "./components/comps/chat-list-items.js";
import Chatsendmessagemodal from "./components/comps/chat-send-message-modal.js";
import Loadingchatcard from "./components/comps/loading-chat-card.js";
import Dropdown from "./components/comps/dropdown.js";
import Leaderboardtable from "./components/comps/leaderboard-table.js";
import Chatmatchhistory from "./components/comps/chat-match-history.js";
import Matchhistory from "./components/comps/match-history.js";
import Chatsearchmodal from "./components/comps/friends-search-modal.js";
import Updateuserinfoform from "./components/comps/update-user-info-form.js";
import Changepasswordform from "./components/comps/change-password-form.js";
import Enable2famodal from "./components/comps/enable-2fa-modal.js";
import Settingsnav from "./components/comps/settings-nav.js";
import Messagebubble from "./components/comps/message-bubble.js";
import Conversationbody from "./components/comps/conversation-body.js";
import Conversationfooter from "./components/comps/conversation-footer.js";
import Conversation from "./components/comps/conversation.js";
import Conversationheader from "./components/comps/conversation-header.js";
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
import BlockedListModal from "./components/comps/blocked-list-modal.js";

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
	{ tagName: 'c-conversation-header', component: Conversationheader },
	{ tagName: 'c-conversation', component: Conversation },
	{ tagName: 'c-conversation-footer', component: Conversationfooter },
	{ tagName: 'c-conversation-body', component: Conversationbody },
	{ tagName: 'c-message-bubble', component: Messagebubble },
	{ tagName: 'c-settings-nav', component: Settingsnav },
	{ tagName: 'c-enable-2fa-modal', component: Enable2famodal },
	{ tagName: 'c-change-password-form', component: Changepasswordform },
	{ tagName: 'c-update-user-info-form', component: Updateuserinfoform },
	{ tagName: 'c-match-history', component: Matchhistory },
	{ tagName: 'c-friends-search-modal', component: Chatsearchmodal },
	{ tagName: 'c-chat-match-history', component: Chatmatchhistory },
	{ tagName: 'c-leaderboard-table', component: Leaderboardtable },
	{ tagName: 'c-statistics-card', component: Statisticscard },
	{ tagName: 'c-dropdown', component: Dropdown },
	{ tagName: 'c-loading-chat-card', component: Loadingchatcard },
	{ tagName: 'c-chat-send-message-modal', component: Chatsendmessagemodal },
	{ tagName: 'c-chat-list-items', component: Chatlistitems },
	{ tagName: 'c-upload-avatar-modal', component: Uploadavatarmodal },
	{ tagName: 'c-usercard-loading', component: Usercardloading },
	{ tagName: 'c-friends-list', component: Friendslist },
	{ tagName: 'c-loader', component: Loader },
	{ tagName: 'c-blocked-list-modal', component: BlockedListModal },
	{ tagName: 'c-friends-list-modal', component: Friendslistmodal },
	{ tagName: 'c-notification-dropdown', component: Notificationdropdown },
	{ tagName: 'c-notification', component: Notification },
	{ tagName: 'c-online-pong-table', component: Onlinepongtable },
	{ tagName: 'c-tournament-events-card', component: Tournamenteventscard },
	{ tagName: 'c-tournament-event', component: Tournamentevent },
	{ tagName: 'c-online-brackets', component: Onlinebrackets },
	{ tagName: 'c-online-tournament-match', component: Onlinetournamentmatch },
	{ tagName: 'c-online-scoreboard', component: Onlinescoreboard },
	{ tagName: 'c-three-dots', component: Threedots },
	{ tagName: 'c-online-gameover-modal', component: Onlinegameovermodal },
	{ tagName: 'c-countdown-modal', component: Countdownmodal },
];
