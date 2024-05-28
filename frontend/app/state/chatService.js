import ChatApiService from "../api/chat/chatApiService.js";
import Service from "./service.js";
import { userService } from "./userService.js";

class ChatService extends Service {
	constructor() {
		super({
			chats: [],
            messages: [],
        });
		this.user = {};
		this.chatApiService = new ChatApiService();
	}

	getFriend(chat) {
		if (chat.user1.username !== this.user.username)
			return chat.user1;
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
		}
		catch (error) {
			console.error(error);
		}
	}

	async getChatMessages(chatId) {
		try {
			let messages = await this.chatApiService.getChatMessages(chatId);
			messages = messages.reverse();
			this.setState({ messages });
		}
		catch (error) {
			console.error(error);
		}
	}

	async saveMessage(chatId, message) {
		try {
			await this.chatApiService.saveMessage(chatId, message);
		}
		catch (error) {
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
