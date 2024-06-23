import { friendState } from "../../state/friendState.js";

export default class Friendscard extends HTMLElement {
	constructor() {
		super();
	}

	async connectedCallback() {
		this.render();
        this.friendsCardModalButton = this.querySelector(".friends-card-modal-button");
        this.friendsCardModalButton.addEventListener("click", () => {
            this.querySelector("c-friends-search-modal")?.open();
        });

        this.friendsListModalButton = this.querySelector(".friends-list-modal-button");
        this.friendsListModalButton.addEventListener("click", () => {
            this.querySelector("c-friends-list-modal")?.open();
        });

        // This should only run once
        await friendState.getFriends();
	}

	disconnectedCallback() {
        if (this.searchModal) this.searchModal.remove();
        friendState.reset();
    }

	render() {
		this.innerHTML = /*html*/ `
        <c-friends-list-modal></c-friends-list-modal>
        <c-friends-search-modal></c-friends-search-modal>
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Friends</h1>
                <p class="btn-link text-secondary friends-list-modal-button">View all</p>
            </div>
            <c-friends-list></c-friends-list>
            <button is="c-button" class="btn-secondary w-full friends-card-modal-button">Find friends</button>
        </div>
        `;
	}

    
}
