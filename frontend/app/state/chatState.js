import HttpClient from "../http/httpClient.js";
import State from "./state.js";
import { userState } from "./userState.js";

class ChatState extends State {
	constructor() {
		super({
			chats: [],
			loading: true,
		});
		this.user = {};
		this.httpClient = HttpClient.instance;
	}

	getFriend(chat) {
		if (chat.user1.username !== this.user.username) return chat.user1;
		return chat.user2;
	}

	async createChat(friendId) {
		try {
			this.resetLoading();
			const chat = await this.httpClient.post('chats/', { "user2": friendId });
			chat.friend = chat.user2;
			this.setState({ chats: [chat, ...this.state.chats], loading: false});
			return chat;
		} catch (error) {
			console.error(error);
		}
	}

	async getChats() {
		try {
			this.user = userState.getState().user;
			let chats = await this.httpClient.get('chats/');
			chats = chats.map((chat) => {
				chat.friend = this.getFriend(chat);
				return chat;
			});
			this.setState({ chats, loading: false});
		} catch (error) {
			console.error(error);
		}
	}

	async getChat(chatId) {
		try {
			let chat = this.state.chats.find((chat) => chat.id === parseInt(chatId));
			if (chat) return chat;
			chat = await this.httpClient.get(`chats/${chatId}/`);
			chat.friend = this.getFriend(chat);
			return chat;
		} catch (error) {
			console.error(error);
		}
	}

	replaceChat(chat) {
		const chats = this.state.chats.map((c) => {
			if (c.id === chat.id) {
				return chat;
			}
			return c;
		});
		this.setState({ chats });
	}

	resetLoading() {
		this.setState({ loading: true });
	}

	reset() {
		this.setState({
			chats: [],
		});
	}
}

export const chatState = new ChatState();
