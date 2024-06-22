import State from "./state.js";
import { userState } from "./userState.js";
import HttpClient from "../http/httpClient.js";
import { chatState } from "./chatState.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import { config } from "../config.js";
import Router from "../router/router.js";
import { notificationState } from "./notificationState.js";
import Toast from "../components/comps/toast.js";

const socketTimeout = 60000 * 5; // 5 minute

class MessageState extends State {
	constructor() {
		super({
			messages: {},
			loading: true,
		});
		this.webSocketManager = new WebSocketManager(config.chat_websocket_url);
		this.httpClient = HttpClient.instance;
		this.messagesFetched = {};
	}

	// Sockets start
	async setup(chatId) {
		if (!chatId) {
			throw new Error("Chat id not provided");
		}

		// Get messages from the server if needed
		await this.getMessages(chatId);

		// If the socket is already open, don't open it again
		if (this.webSocketManager.sockets[chatId]) return;

		// Setup the WebSocket connection
		this.webSocketManager.setupWebSocket(
			chatId,
			// On message callback
			async (event) => {
				const message = JSON.parse(event.data); // Parse the message from the server
				this.appendMessage(chatId, message);

				// Update the chat card last message
				await this.updateCardLastMessage(chatId, message.content);
			},
			// Options
			{
				shouldCloseOnTimeout: true,
				timeoutDuration: socketTimeout,
				onErrorCallback: () => {
					this.messagesFetched[chatId] = false;
					Toast.notify("Failed to establish connection with the server. Please try again.", "error");
				}
			}
		);

		/* Setup the focus listener, 
		to reopen the WebSocket connection when the window gains focus,
		only when the chat is open and the user is logged in */
		this.focusListener = async () => {
			if (!userState.state.user || this.webSocketManager.sockets[chatId]) return;
			if (
				Router.instance.currentRouteStartsWith("/dashboard/chat") &&
				Router.instance.currentRouteEndsWith(chatId)
			) {
				this.messagesFetched[chatId] = false;
				this.setup(chatId);
			}
		};

		// Remove previous event listeners if exists
		window.removeEventListener("focus", this.focusListener);

		// Reopen the WebSocket connection when the window gains focus
		window.addEventListener("focus", this.focusListener);
	}

	async sendMessage(chatId, content) {
		if (!this.webSocketManager.sockets[chatId]) {
			await this.setup(chatId);
		}
		try {
			// Save message to the database
			await this.httpClient.post(`chats/${chatId}/messages/`, { content: content });
			// Send message to the WebSocket
			this.webSocketManager.send(chatId, {
				content: content,
				sender: userState.state.user.id,
			});

			// Send notification to the recipient
			const chat = await chatState.getChat(chatId);
			const friend = chatState.getFriend(chat);
			const notification = {
				type: "MSG",
				data: {
					chat_id: chatId,
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
					sender_avatar: userState.state.user.avatar,
					message: content,
				},
				recipient: friend.id,
			}
			notificationState.sendNotification(notification);
		} catch (error) {
			console.error(error);
		}
	}
	// Sockets end

	async getMessages(chatId) {
		if (!chatId) {
			throw new Error("Chat id not provided");
		}
		if (this.messagesFetched[chatId]) return this.state.messages[chatId];
		try {
			this.resetLoading();
			const messages = { ...this.state.messages };
			messages[chatId] = await this.httpClient.get(`chats/${chatId}/messages/`);
			if (!messages[chatId]) {
				messages[chatId] = [];
			}
			this.updateCardLastMessage(chatId, messages[chatId][0]?.content);
			this.setState({ messages, loading: false });
			this.messagesFetched[chatId] = true;
			return this.state.messages[chatId];
		} catch (error) {
			console.error(error);
		}
	}

	// mark message as read all messages to seen
	async markMessageAsRead(chatId) {
		if (!this.state.messages[chatId]) return;
		// console.log(chatState.state.chats);
		this.state.messages[chatId].forEach((message) => {
			if (!message.is_seen && message.sender !== userState.state.user.id) {
				message.is_seen = true;
			}
		})
		try {
			await this.httpClient.post(`chats/${chatId}/messages/mark_read/`);
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

	async updateCardLastMessage(chatId, messageContent) {
		const chat = await chatState.getChat(chatId);
		chat.last_message = messageContent;
		chat.last_message_time = new Date().toUTCString();
		chatState.replaceChat(chat);
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
