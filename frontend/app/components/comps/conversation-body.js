import { chatService } from "../../state/chatService.js";

export default class Conversationbody extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = chatService.subscribe(() => {
            this.render();
        });
    }

    disconnectedCallback() {}

    render() {
        const messages = chatService.getState().messages;
        this.innerHTML = /*html*/`
        <div class="conversation-body">
            ${messages.map((message) => /*html*/`
                <c-message-bubble type="${message.sender === 'me' ? 'out' : 'in'}" message="${message.message}"></c-message-bubble>
            `).join("")}
        </div>
        `;
    }
}
