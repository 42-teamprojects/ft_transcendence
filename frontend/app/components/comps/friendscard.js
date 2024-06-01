export default class Friendscard extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
        if (!document.querySelector("c-friends-search-modal")) {
            this.searchModal = document.createElement("c-friends-search-modal");
            document.body.appendChild(this.searchModal);
        }
		this.render();
	}

	disconnectedCallback() {
        if (this.searchModal) this.searchModal.remove();
    }

	render() {
		this.innerHTML = /*html*/ `
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Friends</h1>
                <a is="c-link" href="/" class="uppercase font-extrabold spacing-1">view all</a>
            </div>
            <div class="grid grid-cols-4 grid-center gap-8">
                ${this.getUserCards()}
            </div>
            <button is="c-button" class="btn-secondary w-full" onclick="document.querySelector('c-friends-search-modal').open()">Find friends</button>
        </div>
        `;
	}

    getUserCards() {
        const userCards = []
        for (let i = 0; i < 6; i++) {
            userCards.push(/*html*/`
                <c-usercard username="Yusuf" status="OF" img="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper"></c-usercard>
            `)
        }

        userCards.push(/*html*/`
            <div class="flex-col-center w-full">
                <p class="font-bold text-stroke text-sm text-center">And 10+ more</p>
            </div>
        `)

        return userCards.join("");
    }
}
