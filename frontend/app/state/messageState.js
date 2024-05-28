import ChatApiService from "../api/chat/chatApiService.js";
import ChatWebSocket from "../socket/ChatWebSocket.js";
import State from "./state.js";
import { userState } from "./userState.js";

class MessageState extends State {
	constructor() {
		super({
            messages: [],
        });
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
				// Update the chat card last message
				const chatCard = document.querySelector(`c-chat-card[chat-id="${chatId}"]`);
				chatCard.setAttribute("msg", data.content);
				chatCard.setAttribute("time", new Date().toUTCString());
			});
	
			this.chatSockets[chatId].connect();
		}

	}

	async sendMessage(chatId, message) {
		try {
            // Save message to the database
            await this.chatApiService.saveMessage(chatId, message);

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
			let messages = await this.chatApiService.getChatMessages(chatId);
			if (!messages) {
				messages = [];
			}
			this.setState({ messages });
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
		});
	}
}

export const messageState = new MessageState();
