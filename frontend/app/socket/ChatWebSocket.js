import { config } from "../config.js";
import WebSocketClient from "./WebSocketClient.js";

class ChatWebSocket extends WebSocketClient {
    constructor(chatId) {
        super(config.chat_websocket_url + chatId + '/');
    }

    // Send messages to the server
    send(messageObject) {
        super.send(messageObject);
    }

    // Recieve messages from the server
    onChatMessage(callback) {
        this.onMessage((event) => {
            const message = JSON.parse(event.data);
            if (message.sender && message.content) {
                callback(message);
            }
        });
    }
}

export default ChatWebSocket;