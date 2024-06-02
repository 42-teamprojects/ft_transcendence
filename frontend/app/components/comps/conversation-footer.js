import { messageState } from "../../state/messageState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationfooter extends HTMLElement {
	constructor() {
		super();
		this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
		this.user = userState.state.user;
	}

	async connectedCallback() {
		this.render();
		this.form = this.querySelector("form.conversation-form");
		this.btnSubmit = this.querySelector("button.chat-btn");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}
	
	async handleSubmit(e) {
		e.preventDefault();
		const message = this.form.content.value;
		if (!message || message.trim() === "") return;
		this.form.reset();
		
		this.btnSubmit.setAttribute("processing", "true")
		this.form.content.disabled = true;
		// Send message to the socket and server
		await messageState.sendMessage(this.chatId, message);
		this.btnSubmit.setAttribute("processing", "false")
		this.form.content.disabled = false;
		this.form.content.focus();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="conversation-footer">
            <form class="conversation-form" method="POST">
                <input class="input-field message" name="content" type="text" placeholder="Type a message" autocomplete="off">
                <button is="c-button" type="submit" class="chat-btn">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
	}
}
