import { chatState } from "../../state/chatState.js";

export default class Chat extends HTMLElement {
	constructor() {
		super();
		document.title = "Chat | Blitzpong";
		this.isEmpty = window.location.href.match(/\/chat\/?$/);
	}

	async connectedCallback() {
        try {
            await chatState.getChats();
            this.render();
        } catch (error) {
            console.log(error)
        }
    }

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `

        <div class='chat-page'>
            <c-chat-list></c-chat-list>
            <c-conversation></c-conversation>
            ${!this.isEmpty ? 
            /*html*/ `<c-chat-match-history></c-chat-match-history>` 
            : ""}
        </div>
        `;
	}
}

customElements.define("p-chat", Chat);
