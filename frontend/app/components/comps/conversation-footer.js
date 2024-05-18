import { chatService } from "../../state/chatService.js";

export default class Conversationfooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form.conversation-form");
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = this.form.message.value;
            chatService.addMessage({ message, sender: "them" });
            this.form.reset();
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation-footer">
            <form class="conversation-form">
                <input class="input-field message" name="message" type="text" placeholder="Type a message" autocomplete="off">
                <button type="submit" class="btn-send">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
    }
}

