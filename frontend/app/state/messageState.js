import ChatWebSocket from "../socket/ChatWebSocket.js";
import State from "./state.js";
import { userState } from "./userState.js";
import Authentication from "../auth/authentication.js";
import HttpClient from "../http/httpClient.js";
import { chatState } from "./chatState.js";

class MessageState extends State {
	constructor() {
		super({
            messages: [],
			loading: true
        });
        this.chatSockets = {
			// chatId: ChatWebSocket
		};
        this.httpClient = HttpClient.instance;
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
	
			this.chatSockets[chatId].onChatMessage(async (data) => {
				this.appendMessage(data);
				// Update the chat card last message
				const chat = await chatState.getChat(chatId);

				chat.last_message = data.content;
				chat.last_message_time = new Date().toUTCString();
				chatState.replaceChat(chat);
			});
	
			this.chatSockets[chatId].connect();
		}

	}

	async sendMessage(chatId, message) {
		try {
			// Save message to the database
			await this.httpClient.post(`chats/${chatId}/messages/`, { "content": message });
			
            // Send message to the WebSocket
			this.chatSockets[chatId].send({
				content: message,
				sender: userState.getState().user.id,
			});
		} catch (error) {
			console.error(error);
		}
	}

	// Sockets end

    async getMessages(chatId) {
		try {
			let messages = await this.httpClient.get(`chats/${chatId}/messages/`);
			if (!messages) {
				messages = [];
			}
			this.setState({ messages, loading: false});
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
			loading: true
		});
	}
}

export const messageState = new MessageState();
