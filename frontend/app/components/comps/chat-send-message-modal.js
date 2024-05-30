import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { messageState } from "../../state/messageState.js";

export default class Chatsendmessagemodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
        this.username = this.getAttribute("username") || "null";
        this.userId = this.getAttribute("user-id") || "null";
	}

	connectedCallback() {
		this.render();
		const backdrop = this.querySelector("#backdrop");
		const cancelButton = this.querySelector("#cancel-btn");
        this.form = this.querySelector("form");
        this.btnSubmit = this.querySelector("button.chat-btn");

        this.form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const content = this.form.content.value;
            if (!content || content.trim() === "") return;
            
            this.btnSubmit.setAttribute("processing", "true")
		    this.form.content.disabled = true;
            await this.openChat(content);
		    this.btnSubmit.setAttribute("processing", "false")
		    this.form.content.disabled = false;
            this.form.reset();
        });

		backdrop.addEventListener("click", this.hide.bind(this));
		cancelButton.addEventListener("click", this.#cancel.bind(this));
	}

    async openChat(content) {
        try {
            const chat = await chatState.createChat(this.userId);
            await messageState.sendMessage(chat.id, content);
            Router.instance.navigate(`/dashboard/chat/${chat.id}`);
            this.hide();
        } catch (error) {
            console.error(error);
        }
    }

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("opened")) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}

        if (name === "username") {
            this.username = newValue;
        }

        if (name === "user-id") {
            this.userId = newValue;
        }
	}

	static get observedAttributes() {
		return ["opened", "username", "user-id"];
	}

	open() {
		this.setAttribute("opened", "");
		this.isOpen = true;
	}

	hide() {
		if (this.hasAttribute("opened")) {
			this.removeAttribute("opened");
		}
		this.isOpen = false;
	}

	#cancel(event) {
		this.hide();
	}

	#confirm() {
		this.hide();
	}
	render() {
		this.innerHTML = /*html*/ `
            <div id="backdrop"></div>
            <div class="modal">
                <i id="cancel-btn" class="fa fa-times close-icon text-2xl cursor-pointer hover absolute" style="top: 1.25rem; right: 1.5rem"></i>
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Chat with ${this.username}</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke spacing-2">Send a message to start chatting</h2>
                </header>
                <main class="p-1">
                    <form class="flex items-center gap-2 mt-6">
                        <input class="input-field" name="content" type="text" placeholder="Type a message" autocomplete="off">
                        <button is="c-button" type="submit" class="chat-btn">
                            <img src="public/assets/icons/send.svg" alt="send">
                        </button>
                    </form>
                </main>
            </div>
        `;
	}
}
