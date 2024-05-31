export default class Uploadavatarmodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
	}

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
		const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
		event.target.dispatchEvent(cancelEvent);
	}

	#confirm() {
		this.hide();
		const confirmEvent = new Event("confirm");
		this.dispatchEvent(confirmEvent);
	}

	connectedCallback() {
		this.render();

		const backdrop = this.querySelector("#backdrop");
		const cancelButton = this.querySelector("#cancel-btn");
		const confirmButton = this.querySelector("#confirm-btn");

		backdrop.addEventListener("click", this.#cancel.bind(this));
		cancelButton.addEventListener("click", this.#cancel.bind(this));
		confirmButton.addEventListener("click", this.#confirm.bind(this));
	}

	render() {
		this.innerHTML = /*html*/ `
                <div id="backdrop"></div>
                <div class="modal" class="flex-center">
                    <header class="text-center">
                        <h1 id="title" class="text-3xl font-bold mb-2">Upload your avatar</h1>
                        <h2 id="subtitle" class="text-xl font-normal text-stroke">Add a unique and nice picture</h2>
                    </header>
                    <main class="my-6">
                        <div class="flex-col-center gap-4">
                            <img id="avatar" src="/public/assets/icons/upload.svg" class="skeleton skeleton-circle" style="width: 150px; height: 150px" onclick="document.querySelector('#avatar-input').click()">
                            <form>
                                <input type="file" id="avatar-input" class="hidden" accept="image/*">
                            </form>
                            <button id="upload-btn" class="btn-primary" onclick="document.querySelector('#avatar-input').click()">Add avatar</button>
                        </div>
                    </main>
                    <section class="actions">
                        <button is="c-button" id="cancel-btn" class="btn-default text-secondary w-full">Cancel</button>
                        <button id="confirm-btn" class="btn-secondary w-full">Save</button>
                    </section>
                </div>
            `;
	}
}
