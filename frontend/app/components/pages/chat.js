import ChatApiService from "../../api/chat/chatApiService.js";
import Router from "../../router/router.js";
import { chatService } from "../../state/chatService.js";

export default class Chat extends HTMLElement {
    constructor() {
        super();
        document.title = 'Chat | Blitzpong';
        this.isEmpty = window.location.href.match(/\/chat\/?$/);
    }

    async connectedCallback() {
        try {
            await chatService.getChats();
            this.render();
        } catch (error) {
            Router.instance.back();
        }
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class=${this.isEmpty ? 'chat-page__empty' : 'chat-page'}>
            <c-chat-list></c-chat-list>
            <c-conversation username="msodor" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad"></c-conversation>
            <c-chat-match-history></c-chat-match-history>
        </div>
        `;
    }
}

customElements.define('p-chat', Chat);