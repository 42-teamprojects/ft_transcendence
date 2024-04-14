export default class Addplayers extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
        this.playersNumber = parseInt(this.getAttribute("players-number")) || 4;
        this.currentPlayer = 1;
		this.backdrop;
		this.cancelButton;
		this.confirmButton;
	}
    
	attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute("opened")) {
            this.isOpen = true;
		} else {
            this.isOpen = false;
		}
        if (this.hasAttribute("players-number")) {
            this.playersNumber = parseInt(this.getAttribute("players-number"));
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
        this.confirmButton.textContent = 'Save and Continue';
        const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }
    
    #confirm() {
        const playerSetup = this.querySelector(`#player${this.currentPlayer}`);
        playerSetup.submitForm();
        playerSetup.addEventListener("player-ready", this.#playerReady.bind(this));
    }

    #playerReady() {
        if (this.currentPlayer < this.playersNumber) {
            this.currentPlayer++;
            this.renderPlayerSetup();
            if (this.currentPlayer === this.playersNumber) {
                this.confirmButton.textContent = 'Save and Confirm';
            }
        } else {
            this.hide();
            this.reset();
            this.confirmButton.textContent = 'Save and Continue';
            const confirmEvent = new Event("confirm");
            this.dispatchEvent(confirmEvent);
        }
    }

    reset() {
        this.currentPlayer = 1;
        this.renderPlayerSetup();
    }

    connectedCallback() {
        this.render();
        this.backdrop = this.querySelector("#backdrop");
        this.cancelButton = this.querySelector("#cancel-btn");
        this.confirmButton = this.querySelector("#confirm-btn");

        this.renderPlayerSetup();

        this.backdrop.addEventListener("click", this.#cancel.bind(this));
        this.cancelButton.addEventListener("click", this.#cancel.bind(this));
        this.confirmButton.addEventListener("click", this.#confirm.bind(this));
    }

    renderPlayerSetup() {
        const main = this.querySelector('main');
        main.innerHTML = `<c-player-setup id="player${this.currentPlayer}" player-id="${this.currentPlayer}" tournament="true"></c-player-setup>`;
    }

    render() {
        this.innerHTML = /*html*/`
        <div id="backdrop"></div>
            <div class="modal">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Add Players</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">Players can take turns</h2>
                </header>
                <main class="w-full">
                    <c-player-setup id="player1" player-id="1" tournament="true"></c-player-setup>
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
    }
}
