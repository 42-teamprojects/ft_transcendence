import ChatWebSocket from "../socket/ChatWebSocket.js";
import State from "./state.js";
import { userState } from "./userState.js";
import HttpClient from "../http/httpClient.js";
import { chatState } from "./chatState.js";

const socketTimeout = 60000 * 15; // 15 minute

class MessageState extends State {
	constructor() {
		super({
			messages: {},
			loading: true,
		});
		this.chatSockets = {
			// chatId: ChatWebSocket
		};
		this.httpClient = HttpClient.instance;
		this.messagesFetched = {};
		this.lastUseTimes = {};
	}

	// Sockets start

	async setupWebSocket(chatId) {
		if (!chatId) {
			throw new Error("Chat id not provided");
		}

		if (!this.chatSockets[chatId]) {
			this.chatSockets[chatId] = new ChatWebSocket(chatId);
			this.lastUseTimes[chatId] = Date.now();

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
				this.appendMessage(chatId, data);
				// Update the chat card last message
				const chat = await chatState.getChat(chatId);

				chat.last_message = data.content;
				chat.last_message_time = new Date().toUTCString();
				chatState.replaceChat(chat);

				this.lastUseTimes[chatId] = Date.now();
			});

			this.chatSockets[chatId].connect();
		}
		// Get messages from the server if needed
		await this.getMessages(chatId);

		// Remove previous event listeners
		window.removeEventListener("blur", this.blurListener);
		window.removeEventListener("focus", this.focusListener);

		// Close the WebSocket connection when the window loses focus
		this.blurListener = () => {
			if (!this.chatSockets[chatId]) return;
			this.timeoutId = setTimeout(() => {
				// Only close the connection if it hasn't been used for 5 minutes
                if (Date.now() - this.lastUseTimes[chatId] >= 5 * 60 * 1000) {
                    this.closeConnection(chatId);
                }
            }, 5 * 60 * 1000); // 5 minutes
		};
		window.addEventListener("blur", this.blurListener);

		// Reopen the WebSocket connection when the window gains focus
		this.focusListener = async () => {
			clearTimeout(this.timeoutId);
			if (this.chatSockets[chatId]) return;
			this.messagesFetched[chatId] = false;
			await this.setupWebSocket(chatId);
		};
		window.addEventListener("focus", this.focusListener);
	}

	async sendMessage(chatId, message) {
		if (!this.chatSockets[chatId]) {
            await this.setupWebSocket(chatId);
        }
		try {
			// Save message to the database
			await this.httpClient.post(`chats/${chatId}/messages/`, { content: message });

			// Send message to the WebSocket
			this.chatSockets[chatId].send({
				content: message,
				sender: userState.state.user.id,
			});
		} catch (error) {
			console.error(error);
		}
	}

	closeConnection(chatId) {
		if (this.chatSockets[chatId]) {
			this.chatSockets[chatId].close();
			delete this.chatSockets[chatId];
		}
	}

	closeUnusedConnections() {
		const now = Date.now();
		const timeout = socketTimeout;

		for (const chatId in this.chatSockets) {
			if (now - this.lastUseTimes[chatId] > timeout) {
				this.chatSockets[chatId].close();
				delete this.chatSockets[chatId];
				delete this.lastUseTimes[chatId];
			}
		}
	}

	// Sockets end

	async getMessages(chatId) {
		if (this.messagesFetched[chatId]) return;
		try {
			this.resetLoading();
			const messages = { ...this.state.messages };
			messages[chatId] = await this.httpClient.get(`chats/${chatId}/messages/`);
			if (!messages[chatId]) {
				messages[chatId] = [];
			}
			this.setState({ messages, loading: false });
			this.messagesFetched[chatId] = true;
		} catch (error) {
			console.error(error);
		}
	}

	// {content: string, sender: id}
	appendMessage(chatId, messageObject) {
		const messages = { ...this.state.messages };
		if (!messages[chatId]) {
			messages[chatId] = [];
		}
		messages[chatId].unshift(messageObject);
		this.setState({ messages });
	}

	resetLoading() {
		this.setState({ loading: true });
	}

	reset() {
		this.setState({
			messages: [],
			loading: true,
		});
		this.messagesFetched = {};
	}
}

export const messageState = new MessageState();

setInterval(() => messageState.closeUnusedConnections(), socketTimeout);
