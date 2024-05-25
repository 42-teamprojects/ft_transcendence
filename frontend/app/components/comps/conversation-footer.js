import { chatService } from "../../state/chatService.js";
import { getMatchUrl } from "../../utils/utils.js";
export default class Conversationfooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form.conversation-form");
        this.form.addEventListener("submit", (e) => {
            let chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/);
            e.preventDefault();
            const message = this.form.content.value;
            chatService.saveMessage(chatId, message);
            this.form.reset();
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation-footer">
            <form class="conversation-form" method="POST">
                <input class="input-field message" name="content" type="text" placeholder="Type a message" autocomplete="off">
                <button type="submit" class="btn-send">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
    }
}
