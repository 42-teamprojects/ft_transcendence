import { friendState } from "../../state/friendState.js";
import { config } from "../../config.js";

export default class Friendslistmodal extends HTMLElement {
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
		if (name === "title") {
			this.querySelector("#title").textContent = newValue;
		}
		if (name === "subtitle") {
			this.querySelector("#subtitle").textContent = newValue;
		}
	}

	static get observedAttributes() {
		return ["opened", "title", "subtitle"];
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

	async connectedCallback() {
		this.render();

    this.unsubscribe = friendState.subscribe(() => {
      this.querySelector(".friends-list").innerHTML = this.getFriendsList();
    });

    await friendState.getFriends();
		const backdrop = this.querySelector("#backdrop");
		const cancelButton = this.querySelector("#cancel-btn");

		backdrop.addEventListener("click", this.#cancel.bind(this));
		cancelButton.addEventListener("click", this.#cancel.bind(this));
	}

	render() {
		this.innerHTML = /*html*/ `
            <div id="backdrop"></div>
            <div class="modal" class="flex-center">
                <i id="cancel-btn" class="fa fa-times close-icon text-2xl cursor-pointer hover absolute" style="top: 1.25rem; right: 1.5rem"></i>
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Your friends list</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">You can view all your friends</h2>
                </header>
                <main class="mt-6" style="max-height: 300px; overflow-y: scroll">
                    <div class="friends-list flex-col-center w-full gap-5">
                        ${this.getFriendsList()}
                    </div>
                </main>
            </div>
        `;
	}

  getFriendsList() {
    return friendState.state.friends.map((friendshipObject) => {
      const friend = friendState.getFriend(friendshipObject);
      return /*html*/ `
        <div class="friends-item flex-center w-75 justify-between">
            <div class="flex-center gap-2">
                <img src="${config.backend_domain}${friend.avatar}" alt="${friend.username}" class="player-avatar">
                <div class="flex-col gap-1">
                    <h3>${friend.full_name}</h3>
                    <p class="text-stroke">${friend.username}</p>
                </div>
            </div>
            <a is="c-link" href="/dashboard/profile?username=${friend.username}" class="btn-link text-secondary">View profile</a>
        </div>
    `}).join("")
  }

  disconnectedCallback() {
    this.unsubscribe();
  }
}

