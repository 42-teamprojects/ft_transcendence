import ChatWebSocket from "../../socket/ChatWebSocket.js";
import { chatService } from "../../state/chatService.js";
import { userService } from "../../state/userService.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationfooter extends HTMLElement {
	constructor() {
		super();
		this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/);
		this.user = userService.getState().user;
		this.chatSocket = null;
	}

	connectedCallback() {
		this.render();
		this.form = this.querySelector("form.conversation-form");
		this.form.addEventListener("submit", this.handleSubmit.bind(this));
		this.setupWebSocket();
	}

  async handleSubmit(e) {
			e.preventDefault();
			const message = this.form.content.value;
      if (!message || message.trim() === "") return;

			await this.sendMessage(message);
			this.form.reset();
		}

	setupWebSocket() {
		if (!this.chatSocket) {
			this.chatSocket = new ChatWebSocket(this.chatId);

			this.chatSocket.onOpen(() => {
				console.log("WebSocket connection opened.");
			});

			this.chatSocket.onClose(() => {
				console.log("WebSocket connection closed.");
			});

			this.chatSocket.onError((error) => {
				console.error("WebSocket error:", error);
			});

			this.chatSocket.onChatMessage((data) => {
        // Append message to the chatService state
				chatService.appendMessage(data);
			});

			this.chatSocket.connect();
		}
	}

	async sendMessage(message) {
    try {
      await chatService.saveMessage(this.chatId, message);
      this.chatSocket.send({
        content: message,
        sender: this.user.id,
      });
    }
    catch (error) {
      console.error(error);
    }
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="conversation-footer">
            <form class="conversation-form" method="POST">
                <input class="input-field message" name="content" type="text" placeholder="Type a message" autocomplete="off">
                <button type="submit" class="btn-send">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
	}
}
