import ChatApiService from "../api/chat/chatApiService.js";
import ChatWebSocket from "../socket/ChatWebSocket.js";
import State from "./state.js";
import { userState } from "./userState.js";

class ChatState extends State {
	constructor() {
		super({
			chats: [],
		});
		this.user = {};
		this.chatApiService = new ChatApiService();
	}

	getFriend(chat) {
		if (chat.user1.username !== this.user.username) return chat.user1;
		return chat.user2;
	}

	async getChats() {
		try {
			this.user = await userState.getState().user;
			let chats = await this.chatApiService.getUserChats();
			chats = chats.map((chat) => {
				const friend = this.getFriend(chat);
				chat.friend = friend;
				return chat;
			});
			this.setState({ chats });
		} catch (error) {
			console.error(error);
		}
	}

	reset() {
		this.setState({
			chats: [],
		});
	}
}

export const chatState = new ChatState();
