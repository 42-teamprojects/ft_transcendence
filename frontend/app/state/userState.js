import Toast from "../components/comps/toast.js";
import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import { truncate } from "../utils/utils.js";
import { messageState } from "./messageState.js";
import State from "./state.js";

class UserState extends State {
	constructor() {
		super({
			user: {},
			token_verified_at: null,
		});
		this.httpClient = HttpClient.instance;
		// this.notificationSocket = new WebSocketManager(config.websocket_url);
		// this.socketId = null;
	}

	async fetchMe() {
		try {
			const response = await this.httpClient.get("users/me/");
			this.setState({ user: response });
			return response;
		} catch (error) {
			console.error(error);
		}
	}

	// setup() {
	// 	//check if the socket is already open
	// 	if (this.notificationSocket.sockets[this.socketId]) return;

	// 	//setup the websocket connection
	// 	this.notificationSocket.setupWebSocket(
	// 		this.socketId,

	// 		//on message callback
	// 		(event) => {
	// 			const message = JSON.parse(event.data);
	// 			console.log(message);
	// 			// console.log(this.state.user.id, message.sender_id);
	// 			// if (message.sender_id !== this.state.user.id) return;

	// 			// alert("you got message from " + message.sender_name + " : " + message.message);
	// 			if (!location.pathname.includes("/dashboard/chat"))
	// 				Toast.notify({
	// 					type: "info",
	// 					message: /*html*/ `you got message from <a is="c-link" href="/dashboard/chat/${
	// 						message.chat_id
	// 					}" class='font-bold text-secondary'>${message.sender_name}:</a><br/>${truncate(
	// 						message.message,
	// 						30
	// 					)}`,
	// 				});
	// 			messageState.updateCardLastMessage(message.chat_id, message.message);
	// 			console.log("after toast");
	// 		}
	// 	);

	// 	//setup the focus listener
	// 	this.focusListener = async () => {
	// 		if (this.notificationSocket.sockets[this.socketId]) return;
	// 		this.setup();
	// 	};

	// 	window.removeEventListener("focus", this.focusListener);
	// 	window.addEventListener("focus", this.focusListener);
	// }

	async fetchUser(username) {
		try {
			const result = await this.httpClient.get(`users/${username}/`);
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	updateUser(field, value) {
		const user = this.state.user;
		user[field] = value;
		this.setState({ user });
	}

	isVerified() {
		return this.state.user.provider === "fortytwo" ? true : this.state.user.is_verified;
	}

	isProvider() {
		return this.state.user.provider !== null;
	}

	is2FAEnabled() {
		return this.state.user.two_factor_enabled;
	}

	reset() {
		this.setState({
			user: {},
			token_verified_at: null,
		});
	}
}

export const userState = new UserState();
