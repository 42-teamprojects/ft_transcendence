import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { messageState } from "../../state/messageState.js";
import { getMatchUrl } from "../../utils/utils.js";
import Toast from "./toast.js";

export default class Conversation extends HTMLElement {
	constructor() {
		super();
		this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
	}

	async connectedCallback() {
		this.innerHTML = /*html*/ `
            <div class="flex-col-center vh-full">
                <h1 class="text-xl font-medium">Loading conversation...</h1>
            </div>
            `;

		this.chat = await chatState.getChat(this.chatId);
		if (!this.chat) {
			Toast.notify({ message: "Chat not found", type: "error" })
			Router.instance.navigate("/dashboard/chat");
			return;
		};

		this.render();

		await messageState.setup(this.chatId);
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="conversation vh-full w-full">
            <c-conversation-header img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" username="${this.chat.friend.username}" state="${this.chat.friend.status}"></c-conversation-header>
            <c-conversation-body></c-conversation-body>
            <c-conversation-footer></c-conversation-footer>
        </div>
        `;
	}
}
