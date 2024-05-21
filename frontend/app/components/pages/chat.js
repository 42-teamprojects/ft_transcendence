import ChatApiService from "../../api/chat/chatApiService.js";

export default class Chat extends HTMLElement {
    constructor() {
        super();
        this.chatService = new ChatApiService();
    }

    async connectedCallback() {
        this.render();
        const res = await this.chatService.getUserChats();
        const messages = await this.chatService.getChatMessages(res[3].id);
        console.log(messages);
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="chat-page">
            <c-chat-list></c-chat-list>
            <c-conversation username="msodor" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad"></c-conversation>
            <div class="match-history vh-full w-full"></div>
        </div>
        `;
    }
}

customElements.define('p-chat', Chat);