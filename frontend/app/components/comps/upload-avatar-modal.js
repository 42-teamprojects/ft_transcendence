import HttpClient from "../../http/httpClient.js";
import { userState } from "../../state/userState.js";

export default class Uploadavatarmodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
        this.httpClient = new HttpClient();
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

	async #confirm() {
		const fileInput = this.querySelector("#avatar-input");
		if (fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const formData = new FormData();
			formData.append("avatar", file);
			try {
                this.confirmButton.setAttribute("processing", "true");
				const response = await fetch("http://localhost:8000/api/users/avatar/", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                })
                const data = await response.json();

                // const data = await this.httpClient.post("users/avatar/", formData);
                this.confirmButton.setAttribute("processing", "false");
				if (data.avatar) {
                    const tmpUser = userState.state.user;
					userState.setState({
                        user: {
                            ...tmpUser,
							avatar: data.avatar,
						},
					});
				}
				this.hide();
			} catch (error) {
                this.confirmButton.setAttribute("processing", "false");
				console.error(error);
			}
		}
		// const confirmEvent = new Event("confirm");
		// this.dispatchEvent(confirmEvent);
	}

	connectedCallback() {
		this.render();

		this.backdrop = this.querySelector("#backdrop");
		this.cancelButton = this.querySelector("#cancel-btn");
		this.confirmButton = this.querySelector("#confirm-btn");
		this.fileInput = this.querySelector("#avatar-input");
		// get the form data and preview it in the img tag
		this.fileInput.addEventListener("change", (event) => {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				this.querySelector("#avatar").src = e.target.result;
			};
			reader.readAsDataURL(file);
		});

		this.backdrop.addEventListener("click", this.#cancel.bind(this));
		this.cancelButton.addEventListener("click", this.#cancel.bind(this));
		this.confirmButton.addEventListener("click", this.#confirm.bind(this));
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
                            <img id="avatar" src="/public/assets/icons/upload.svg" class="cursor-pointer rounded-full object-cover" style="width: 200px; height: 200px" onclick="document.querySelector('#avatar-input').click()">
                            <input type="file" name="avatar" id="avatar-input" class="hidden" accept="image/*">
                            <button class="btn-primary" onclick="document.querySelector('#avatar-input').click()">Add avatar</button>
                        </div>
                    </main>
                    <section class="actions">
                        <button is="c-button" id="cancel-btn" class="btn-default text-secondary w-full">Cancel</button>
                        <button is="c-button" id="confirm-btn" class="btn-secondary w-full">Save</button>
                    </section>
                </div>
            `;
	}
}
