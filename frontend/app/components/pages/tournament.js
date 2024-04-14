import { tournamentStore } from "../../state/tournamentStore.js";
import { useFormData } from "../../utils/useForm.js";
import Toast from "../comps/toast.js";

export default class Tournament extends HTMLElement {
	constructor() {
		super();
		document.title = "Tournament | Blitzpong.";
		this.addPlayersForm;
		this.modal;
        this._players = [];
	}

	connectedCallback() {
		this.render();
		this.addPlayersForm = this.querySelector("#add-players-form");
        
		this.addPlayersForm.addEventListener("submit", this.addPlayersHandler.bind(this));
	}

    addPlayersHandler(e) {
        e.preventDefault();
        
        const { playersNumber } = useFormData(e.target).getObject();
        if (playersNumber === "" || playersNumber === null || playersNumber === undefined) {
            Toast.notify({ type: "error", message: "Please select the number of players" });
            return;
        }
        this.modal = document.createElement("c-add-players");
        this.modal.setAttribute("players-number", playersNumber);
        this.appendChild(this.modal);

        this.modal.addEventListener("confirm", (e) => {
            const { players } = e.detail;
            this._players = 
            Toast.notify({ type: "success", message: `${this._players.length} players added` });
            this.modal.remove();
            this.addPlayersForm.querySelector(".btn-secondary").disabled = true;
            this.addPlayersForm.querySelector(".btn-secondary").textContent = "Players added";
        });

        this.modal.addEventListener("cancel", () => {
            this.modal.remove();
        });

        setTimeout(() => {
            this.modal.open();
        }, 100);
    }

	disconnectedCallback() {
        this.addPlayersForm.removeEventListener("submit", this.addPlayersHandler.bind(this));
    }

	render() {
		this.innerHTML = /*html*/ `
        <div class="flex-col-center my-10 gap-9">
            <div class="mb-8">
                <h1 class="text-center mb-4">Organize Local Tournament</h1>
                <h3 class="text-center font-medium text-stroke">Customize Your Tournament</h3>
            </div>
            <div class="flex-col-center gap-9 w-full" style="max-width: 900px">
                <form id="add-players-form" class="flex-col-center gap-4" style="width: 400px">
                    <div class="form-group w-full">
                        <label class="input-label">Number of Players</label>
                        <select class="select-field" name="playersNumber">
                            <option value="" disabled selected>Select an option</option>
                            <option value="4">4 Players</option>
                            <option value="8">8 Players</option>
                            <option value="16">16 Players</option>
                        </select>
                    </div>
                    <div class="flex w-full gap-4">
                        <button class="btn-default w-full text-secondary">Show players</button>
                        <button type="submit" class="btn-secondary w-full">Add players</button>
                    </div>
                </form>
                <form id="game" class="w-full flex-col-center mt-8">
                    <div class="tables w-full">
                        <h2 class="mb-6 text-center">Choose a table theme</h2>
                        <div class="flex w-full justify-between gap-2">
                            <c-table-theme type="classic"></c-table-theme>
                            <c-table-theme type="standard" checked></c-table-theme>
                            <c-table-theme type="football"></c-table-theme>
                        </div>
                    </div>
                    <button is="c-button" type="submit" class="btn-primary mt-9">Start tournament</button>
                </form>
            </div>
        </div>
        `;
	}

    get players() {
        return this._players;
    }
}

customElements.define("p-tournament", Tournament);
