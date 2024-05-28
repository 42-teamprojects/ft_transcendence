import { chatState } from "../../state/chatState.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversation extends HTMLElement {
    constructor() {
        super();
        this.isEmpty = window.location.href.match(/\/chat\/?$/);
        this.chat = null
        if (!this.isEmpty) {
            this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/) || "none";
            if (this.chatId === "none") {
                throw new Error("Chat id not found");
            }
        }
    }

    async getChatMessages(chatId) {
        await chatState.getChatMessages(chatId);
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = chatState.subscribe(() => {
            this.chat = chatState.getState().chats.find((chat) => {
                return chat.id === parseInt(this.chatId);
            });
            this.render();
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation vh-full w-full">
            ${this.isEmpty || this.chat == null
            ? /*html*/`
                <div class="flex-center vh-full">
                <div class="flex-col-center gap-4">
                    <i class="fa-regular fa-comments text-6xl text-primary mb-5"></i>
                    <h1 class="text-xl font-medium">Select a conversation to start chatting</h1>
                    <h2 class="text-md font-normal text-stroke">Or find a friend and chat</h2>
                    <button class="btn-primary" onclick="document.querySelector('c-chat-search-modal').open()">Find friends</button>
                </div>
                </div>
            `     
            : /*html*/`
            <c-conversation-header img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" username="${this.chat.friend.username}" state="${this.chat.friend.status}"></c-conversation-header>
            <c-conversation-body></c-conversation-body>
            <c-conversation-footer></c-conversation-footer>
            `}
        </div>
        `;
    }
}

