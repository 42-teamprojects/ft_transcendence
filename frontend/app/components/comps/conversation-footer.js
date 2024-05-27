import { chatService } from "../../state/chatService.js";
import { getMatchUrl } from "../../utils/utils.js";
export default class Conversationfooter extends HTMLElement {
    constructor() {
        super();
        this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/);
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form.conversation-form");
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = this.form.content.value;
            this.sendMessage(message);
            this.form.reset();
        });
        this.setupWebSocket();
    }

    setupWebSocket(callback) {
        const socketUrl = `ws://localhost:8000/ws/chat/${this.chatId}/`;
        console.log(socketUrl);
        this.chatSocket = new WebSocket(socketUrl);
    
        this.chatSocket.onopen = (e) => {
          console.log("Connection established");
          if (callback) callback();
        };

        this.chatSocket.onmessage = (e) => {
            // console.log("Message received: ");
            const data = JSON.parse(e.data);
            if (data.message) {
                console.log('Message:', data.message);
                chatService.saveMessage(this.chatId, data.message);
            }
        };
    
        this.chatSocket.onerror = (e) => {
          console.error("WebSocket error: ", e);
        };
    
        this.chatSocket.onclose = (e) => {
          console.log("WebSocket closed: ", e);
        };
    }
    
      sendMessage(message) {
        if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
          this.chatSocket.send(JSON.stringify({
            'message': message
          }));
        } else {
          console.error("WebSocket is not open. Unable to send message.");
        }
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
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
