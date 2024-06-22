import HttpClient from "../http/httpClient.js";
import { messageState } from "./messageState.js";
import State from "./state.js";
import { userState } from "./userState.js";

class ChatState extends State {
	constructor() {
		super({
			chats: [],
			loading: true,
		});
		this.user = {};
		this.chatsFetched = false;
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
			this.setState({ loading: false});
			console.error(error);
		}
	}

	async getChats() {
		if (this.chatsFetched) return;
		try {
			this.resetLoading();
			this.user = userState.state.user;
			let chats = await this.httpClient.get('chats/');
			chats = chats.map((chat) => {
				chat.friend = this.getFriend(chat);
				return chat;
			});
			chats.forEach(async (chat) => {
				await messageState.getMessages(chat.id);
			});
			this.setState({ chats, loading: false});
			// console.log("Chats", chats)
			this.chatsFetched = true;
		} catch (error) {
			this.setState({ loading: false});
			console.error(error);
		}
	}

	async getChat(chatId, force = false) {
		// if the force flag is set to true, wait 1 second before fetching the chat
		if (force) await new Promise((resolve) => setTimeout(resolve, 100));
		try {
			let chat = this.state.chats.find((chat) => chat.id === parseInt(chatId));
			if (chat && !force)
				return chat;
			chat = await this.httpClient.get(`chats/${chatId}/`);
			chat.friend = this.getFriend(chat);
			return chat;
		} catch (error) {
			console.error(error);
		}
	}

	replaceChat(chat) {
		const chats = this.state.chats.filter((c) => c.id !== chat.id);
		chats.unshift(chat);
		this.setState({ chats });
	}

	deleteChat(chatId) {
		const chats = this.state.chats.filter((c) => c.id !== +chatId);
		this.setState({ chats });
	}

	resetLoading() {
		this.setState({ loading: true });
	}

	reset() {
		this.setState({
			chats: [],
			loading: true,
		});
		this.chatsFetched = false;
	}
}

export const chatState = new ChatState();
