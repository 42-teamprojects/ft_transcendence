export default class Addplayers extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
		this.playersNumber;
		this.currentPlayer = 1;
		this.backdrop;
		this.cancelButton;
		this.confirmButton;
		this._players = [];
		this.playersSetups = [];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("opened")) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}
		if (name === "players-number") {
			this.playersNumber = parseInt(newValue);
		}
	}

	static get observedAttributes() {
		return ["opened", "players-number"];
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
		this.reset();
		this.confirmButton.textContent = "Save and Continue";
		const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
		event.target.dispatchEvent(cancelEvent);
	}

	#confirm() {
		const playerSetup = this.querySelector(`#player${this.currentPlayer}`);
		playerSetup.submitForm();
	}

	#playerReady(e) {
		const playerSetup = this.querySelector(`#player${this.currentPlayer}`);
		playerSetup.classList.add("hidden");
		this._players.push(e.detail.player);

		if (this.currentPlayer < this.playersNumber) {
			this.currentPlayer++;
			const newPlayerSetup = this.querySelector(`#player${this.currentPlayer}`);
			newPlayerSetup.classList.remove("hidden");
			newPlayerSetup.querySelector('input[name="alias"]').focus();
			if (this.currentPlayer === this.playersNumber) {
				this.confirmButton.textContent = "Save";
			}
			this.querySelector("#subtitle").textContent = `Player ${this.currentPlayer} of ${this.playersNumber}`;
		} else {
			this.hide();
			this.reset();
			this.confirmButton.textContent = "Save and Continue";
			const confirmEvent = new CustomEvent("confirm", {
				bubbles: true,
				composed: true,
				detail: {
					players: this._players,
				},
			});
			this.dispatchEvent(confirmEvent);
		}
	}

	reset() {
		this.currentPlayer = 1;
		this.querySelector(`#player${this.currentPlayer}`).classList.remove("hidden");
	}

	connectedCallback() {
		this.render();
		this.backdrop = this.querySelector("#backdrop");
		this.cancelButton = this.querySelector("#cancel-btn");
		this.confirmButton = this.querySelector("#confirm-btn");

		for (let i = 1; i <= this.playersNumber; i++) {
			this.renderPlayerSetup(i);
		}

		if (this.playersSetups.length > 0) this.playersSetups[0].querySelector('input[name="alias"]').focus();

		this.backdrop.addEventListener("click", this.#cancel.bind(this));
		this.cancelButton.addEventListener("click", this.#cancel.bind(this));
		this.confirmButton.addEventListener("click", this.#confirm.bind(this));
	}

	renderPlayerSetup(playerId) {
		const playerSetup = document.createElement("c-player-setup");
		playerSetup.setAttribute("id", `player${playerId}`);
		playerSetup.setAttribute("player-id", playerId);
		playerSetup.setAttribute("tournament", "true");
		playerSetup.addEventListener("player-ready", this.#playerReady.bind(this));
		if (playerId !== this.currentPlayer) playerSetup.classList.add("hidden");
		this.querySelector("main").appendChild(playerSetup);
		this.playersSetups.push(playerSetup);
	}

	render() {
		this.innerHTML = /*html*/ `
        <div id="backdrop"></div>
            <div class="modal">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Add Players</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">Player ${this.currentPlayer} of ${this.playersNumber}</h2>
                </header>
                <main class="w-full">
                </main>
                <section class="actions">
                    <button id="cancel-btn" class="btn-default text-secondary w-full" tooltip="All data will be deleted!" flow="up">Cancel</button>
                    <button id="confirm-btn" class="btn-secondary w-full">Save and continue</button>
                </section>
            </div>
        `;
	}

	disconnectedCallback() {
		this.backdrop.removeEventListener("click", this.#cancel.bind(this));
		this.cancelButton.removeEventListener("click", this.#cancel.bind(this));
		this.confirmButton.removeEventListener("click", this.#confirm.bind(this));
		for (const playerSetup of this.playersSetups) {
			playerSetup.removeEventListener("player-ready", this.#playerReady.bind(this));
		}
	}

	get players() {
		return this._players;
	}
}
