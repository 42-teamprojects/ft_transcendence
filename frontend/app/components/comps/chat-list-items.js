import { config } from "../../config.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";

export default class Chatlistitems extends HTMLElement {
    constructor() {
        super();
		this.router = Router.instance;
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = chatState.subscribe(() => {
			this.render();
		});

    }

    disconnectedCallback() {
        this.unsubscribe();
    }

    render() {
        const chatCards = chatState.state.chats.map((chat) => /*html*/ `        
        <c-chat-card chat-id="${chat.id}" username="${
				chat.friend.username
			}" img="${config.backend_domain}${chat.friend.avatar}" msg="${chat.last_message}" time="${
				chat.last_message_time
			}" active="${this.router.currentRouteEndsWith(chat.id.toString())}"></c-chat-card>
        `);

        this.innerHTML = /*html*/`
        ${
            chatState.state.loading
                ? /*html*/ `
          <c-loading-chat-card></c-loading-chat-card>
          <c-loading-chat-card></c-loading-chat-card>
          <c-loading-chat-card></c-loading-chat-card>
          <c-loading-chat-card></c-loading-chat-card>
        `
                : chatCards.join("")
        }
        `;
    }
}

