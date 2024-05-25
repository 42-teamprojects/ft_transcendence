import { chatService } from "../../state/chatService.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversation extends HTMLElement {
    constructor() {
        super();
        this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/) || "none";
        if (this.chatId === "none") {
            throw new Error("Chat id not found");
        }
        this.chat = chatService.getState().chats.find((chat) => {
            return chat.id === parseInt(this.chatId);
        });;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation vh-full w-full">
            <c-conversation-header img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" username="${this.chat.friend.username}" state="${this.chat.friend.status}"></c-conversation-header>
            <c-conversation-body></c-conversation-body>
            <c-conversation-footer></c-conversation-footer>
        </div>
        `;
    }
}

