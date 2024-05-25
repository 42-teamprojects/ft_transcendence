import ChatApiService from "../../api/chat/chatApiService.js";

export default class Chat extends HTMLElement {
    constructor() {
        super();
        document.title = 'Chat | Blitzpong';
        this.chatService = new ChatApiService();
        this.isEmpty = window.location.href.match(/\/chat\/?$/);
    }

    async connectedCallback() {
        this.render();
        // const res = await this.chatService.getUserChats();
        // const messages = await this.chatService.getChatMessages(res[3].id);
        // console.log(messages);
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