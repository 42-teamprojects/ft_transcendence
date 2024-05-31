import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js";

class UserState extends State {
	constructor() {
		super({ 
			user: {},
			token_verified_at: null,
		});
		this.httpClient = HttpClient.instance;
		this.notificationSocket = new WebSocketManager(config.websocket_url);
		this.socketId = null;
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

	setup() {
		//check if the socket is already open
		if (this.notificationSocket.sockets[this.socketId]) return;

		//setup the websocket connection
		this.notificationSocket.setupWebSocket(
			this.socketId,

			//on message callback
			(event) => {
				const message = JSON.parse(event.data);	
				console.log(message);
				// console.log(this.state.user.id, message.sender_id);
				// if (message.sender_id !== this.state.user.id) return;

					alert("you got message from " + message.sender_name + " : " + message.message);
				// console.log(message);
			}
		)

		//setup the focus listener
		this.focusListener = async () => {
			if (this.notificationSocket.sockets[this.socketId]) return;
			this.setup();
		}

		window.removeEventListener('focus', this.focusListener);
		window.addEventListener('focus', this.focusListener);
	}

	isVerified() {
        return this.state.user.provider === 'fortytwo' ? true : this.state.user.is_verified;
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
			token_verified_at: null
		});
	}
}

export const userState = new UserState();
