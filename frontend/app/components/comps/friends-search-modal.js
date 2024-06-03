import HttpClient from "../../http/httpClient.js";
import { UserStatus } from "../../entities/enums.js";
import Toast from "./toast.js";
import { config } from "../../config.js";

export default class Chatsearchmodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
		this.httpClient = HttpClient.instance;
	}

	connectedCallback() {
		this.render();
		const backdrop = this.querySelector("#backdrop");
		const cancelButton = this.querySelector("#cancel-btn");
		this.searchFriends = this.querySelector("#search-friends");
		this.friendsResult = this.querySelector(".friends-result");

		this.searchFriends.addEventListener("submit", this.handleSearch.bind(this));
		backdrop.addEventListener("click", this.hide.bind(this));
		cancelButton.addEventListener("click", this.#cancel.bind(this));
	}

	async handleSearch(e) {
		e.preventDefault();
        
		const keyword = this.searchFriends.keyword.value;
        // check if keyword only have characters and numbers and @ and . only
        if (!/^[a-zA-Z0-9@.]*$/.test(keyword)) {
            Toast.notify({ type: "error", message: "Invalid search keyword" });
            return;
        }
		if (!keyword || keyword.trim() === "") return;
		try {
			const result = await this.httpClient.get(`users/search/${keyword}`);
            if (result.length === 0) {
                Toast.notify({ type: "info", message: "No user found" });
                return;
            }

			this.searchFriends.reset();
			this.friendsResult.innerHTML = result
				.map(
					(user) =>
						/*html*/`<c-usercard user-id="${user.id}" username="${user.username}" status="${user.status}" img="${config.backend_domain}${user.avatar}"></c-usercard>`
				)
				.join("");
		} catch (error) {
			console.error(error);
			Toast.notify({ type: "error", message: "An error occurred while searching for friends" });
		}
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
		this.friendsResult.innerHTML = "";
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
                    <h1 id="title" class="text-3xl font-bold mb-2">Search for friends   </h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke spacing-2">find your friends or new ones</h2>
                </header>
                <form class="flex items-center gap-2 mt-6 mb-6" id="search-friends">
                    <input type="text" class="input-field" name="keyword" placeholder="Search username, Email..." />
                    <button class="btn-secondary py-4 w-0">
                        <i class="fa fa-search"></i>
                    </button> 
                </form>
                <main>
                    <div class="flex-center flex-wrap friends-result" style="gap: 2rem 3rem;">
                    </div>
                </main>
            </div>
        `;
	}
}
