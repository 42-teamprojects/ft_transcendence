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
			const messages = await this.chatApiService.getChatMessages(chatId);
			this.setState({ messages });
		}
		catch (error) {
			console.error(error);
		}
	}

	// {message: string, sender: me|them}
	addMessage(messageObject) {
		const messages = this.getState().messages;
		if (messageObject.message.startsWith("me:")) {
			messageObject.sender = "me";
			messageObject.message = messageObject.message.replace("me:", "");
		}
		// insert in front of the array
		messages.unshift(messageObject);
		this.setState({ messages });
	}

	reset() {
		this.setState({ 
			messages: [],
			friend: {},
		});
	}
}

export const chatService = new ChatService();
