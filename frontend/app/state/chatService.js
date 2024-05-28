import ChatApiService from "../api/chat/chatApiService.js";
import ChatWebSocket from "../socket/ChatWebSocket.js";
import Service from "./service.js";
import { userService } from "./userService.js";

class ChatService extends Service {
	constructor() {
		super({
			chats: [],
			messages: [],
		});
		this.user = {};
		this.chatSockets = {
			// chatId: ChatWebSocket
		};
		this.chatApiService = new ChatApiService();
	}

	// Sockets start

	setupWebSocket(chatId) {
		if (!chatId) {
			throw new Error("Chat id not found");
		}

		if (!this.chatSockets[chatId]) {
			this.chatSockets[chatId] = new ChatWebSocket(chatId);

			this.chatSockets[chatId].onOpen(() => {
				console.log("WebSocket connection opened.");
			});
	
			this.chatSockets[chatId].onClose(() => {
				console.log("WebSocket connection closed.");
				delete this.chatSockets[chatId];
			});
	
			this.chatSockets[chatId].onError((error) => {
				console.error("WebSocket error:", error);
			});
	
			this.chatSockets[chatId].onChatMessage((data) => {
				this.appendMessage(data);
			});
	
			this.chatSockets[chatId].connect();
		}

	}

	async sendMessage(chatId, message) {
		try {
			await this.saveMessage(chatId, message);
			this.chatSockets[chatId].send({
				content: message,
				sender: this.user.id,
			});
		} catch (error) {
			console.error(error);
		}
	}

	// Sockets end

	getFriend(chat) {
		if (chat.user1.username !== this.user.username) return chat.user1;
		return chat.user2;
	}

	async getChats() {
		try {
			this.user = await userService.getState().user;
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

	async getChatMessages(chatId) {
		try {
			let messages = await this.chatApiService.getChatMessages(chatId);
			this.setState({ messages });
		} catch (error) {
			console.error(error);
		}
	}

	async saveMessage(chatId, message) {
		try {
			await this.chatApiService.saveMessage(chatId, message);
		} catch (error) {
			console.error(error);
		}
	}

	// {content: string, sender: id}
	appendMessage(messageObject) {
		const messages = this.getState().messages;
		messages.unshift(messageObject);
		this.setState({ messages });
	}

	reset() {
		this.setState({
			messages: [],
			chats: [],
		});
	}
}

export const chatService = new ChatService();
