import ChatApiService from "../../api/chat/chatApiService.js";

export default class Chat extends HTMLElement {
    constructor() {
        super();
        this.chatService = new ChatApiService();
    }

    async connectedCallback() {
        this.render();
        const res = await this.chatService.getUserChats();
        // const messages = await this.chatService.getChatMessages(res.id);
        console.log(res);
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="chat-page">
            <c-chat-list></c-chat-list>
            <c-conversation username="msodor" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad"></c-conversation>
            <div class="match-history vh-full w-full">
                <c-match-history></c-match-history>
            </div>
        </div>
        `;
    }
}

customElements.define('p-chat', Chat);