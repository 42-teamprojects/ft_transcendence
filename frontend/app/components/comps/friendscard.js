import { friendState } from "../../state/friendState.js";

export default class Friendscard extends HTMLElement {
	constructor() {
		super();
	}

	async connectedCallback() {
        if (!document.querySelector("c-friends-search-modal")) {
            this.searchModal = document.createElement("c-friends-search-modal");
            document.body.appendChild(this.searchModal);
        }
		this.render();
        // This should only run once
        await friendState.getFriends();
	}

	disconnectedCallback() {
        if (this.searchModal) this.searchModal.remove();
    }

	render() {
		this.innerHTML = /*html*/ `
        <c-friends-list-modal></c-friends-list-modal>
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Friends</h1>
                <p class="btn-link text-secondary" onclick="document.querySelector('c-friends-list-modal').open()">View all</p>
            </div>
            <c-friends-list></c-friends-list>
            <button is="c-button" class="btn-secondary w-full" onclick="document.querySelector('c-friends-search-modal').open()">Find friends</button>
        </div>
        `;
	}

    
}
