export default class Showplayers extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
        this.playersNumber;
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
        this.confirmButton.textContent = 'Save and Continue';
        const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }
    
    #confirm() {
    }

    connectedCallback() {
        this.render();

        this.parentElement.players.forEach(player => {
            const playerSetup = document.createElement("c-player-setup");
            playerSetup.setAttribute("player-id", player.playerId);
            playerSetup.setAttribute("tournament", "true");
            playerSetup.setAttribute("showcase", "");
            this.querySelector("main").appendChild(playerSetup);
        });

        this.backdrop = this.querySelector("#backdrop");
        this.cancelButton = this.querySelector("#cancel-btn");
        this.confirmButton = this.querySelector("#confirm-btn");
        this.backdrop.addEventListener("click", this.#cancel.bind(this));
        this.cancelButton.addEventListener("click", this.#cancel.bind(this));
        // this.confirmButton.addEventListener("click", this.#confirm.bind(this));
    }

    render() {
        this.innerHTML = /*html*/`
        <div id="backdrop"></div>
            <div class="modal">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Registred Players</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">${this.playersNumber} Players</h2>
                </header>
                <main class="w-full flex-center gap-4">
                </main>
                <section class="actions">
                    <button id="cancel-btn" class="btn-default text-secondary w-full" tooltip="All data will be deleted!" flow="up">Cancel</button>
                    <button id="confirm-btn" class="btn-secondary w-full">Okay</button>
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
