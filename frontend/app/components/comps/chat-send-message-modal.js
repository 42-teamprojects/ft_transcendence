export default class Chatsendmessagemodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
	}

	connectedCallback() {
		this.render();
		const backdrop = this.querySelector("#backdrop");
		const cancelButton = this.querySelector("#cancel-btn");
		// const confirmButton = this.querySelector('#confirm-btn');
		backdrop.addEventListener("click", this.hide.bind(this));
		cancelButton.addEventListener("click", this.#cancel.bind(this));
		// confirmButton.addEventListener('click', this.#confirm.bind(this));
	}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("opened")) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}
	}

	static get observedAttributes() {
		return ["opened"];
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
                    <h1 id="title" class="text-3xl font-bold mb-2">Chat with yelaissa</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke spacing-2">Send a message to start chatting</h2>
                </header>
                <main class="p-1">
                    <form class="flex items-center gap-2 mt-6">
                        <input class="input-field" name="content" type="text" placeholder="Type a message" autocomplete="off">
                        <button type="submit" class="btn-send">
                            <img src="public/assets/icons/send.svg" alt="send">
                        </button>
                    </form>
                </main>
            </div>
        `;
	}
}
