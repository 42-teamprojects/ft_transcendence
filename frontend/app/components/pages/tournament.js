import Router from "../../router/router.js";
import { tournamentState } from "../../state/tournamentState.js";
import { useFormData } from "../../utils/useForm.js";
import Toast from "../comps/toast.js";

/* Player:
    - playerId
    - alias
    - paddle    
*/

export default class Tournament extends HTMLElement {
	constructor() {
		super();
		document.title = "Tournament | Blitzpong.";
        this.game;
		this.addPlayersForm;
		this.addPlayersModal;
		this.showPlayersModal;
        this.playersNumber;
        this._players = [];
	}

	connectedCallback() {
        tournamentState.reset();
		this.render();
		this.addPlayersForm = this.querySelector("#add-players-form");
        this.addPlayersForm.querySelector("#show-players").disabled = true;
        this.game = this.querySelector("#game");
        
		this.addPlayersForm.addEventListener("submit", this.onAddPlayersSubmit.bind(this));
        this.game.addEventListener('submit', this.startTournamentHandler.bind(this));
    }

    startTournamentHandler(e) {
        e.preventDefault();
        if (this._players.length < this.playersNumber) {
            Toast.notify({ type: "error", message: "Please make sure all the players are registred" });
            return;
        }

        tournamentState.setPlayers(this._players);
        tournamentState.setTheme(useFormData(e.target).getObject()["theme-option"]);
        tournamentState.setPlayersNumber(this.playersNumber);
        tournamentState.generateTournament();
        
        Router.instance.navigate(`/local/tournament/qualifications`);
    }

    onAddPlayersSubmit(e) {
        e.preventDefault();
        if (e.submitter.id === "add-players" && this._players.length === 0) {
            this.addPlayersHandler(e);
        }
        else if (e.submitter.id === "show-players" && this._players.length > 0) {
            this.showPlayersHandler(e);
        }
    }

    addPlayersHandler(e) {        
        const { playersNumber } = useFormData(e.target).getObject();
        if (playersNumber === "" || playersNumber === null || playersNumber === undefined) {
            Toast.notify({ type: "error", message: "Please select the number of players" });
            return;
        }
        this.playersNumber = playersNumber;

        this.addPlayersModal = document.createElement("c-add-players");
        this.addPlayersModal.setAttribute("players-number", playersNumber);
        this.appendChild(this.addPlayersModal);

        this.addPlayersModal.addEventListener("confirm", (e) => {
            this._players = e.detail.players;
            Toast.notify({ type: "success", message: `${this._players.length} players added` });
            
            this.addPlayersModal.remove();

            const addPlayersBtn = this.addPlayersForm.querySelector("#add-players");
            const showPlayersBtn = this.addPlayersForm.querySelector("#show-players");
            addPlayersBtn.disabled = true;
            showPlayersBtn.disabled = false;
            addPlayersBtn.textContent = "Players added";
        });

        this.addPlayersModal.addEventListener("cancel", () => {
            this.addPlayersModal.remove();
        });

        setTimeout(() => {
            this.addPlayersModal.open();
        }, 100);
    }

    showPlayersHandler(e) {
        this.showPlayersModal = document.createElement("c-show-players");
        this.showPlayersModal.setAttribute("players-number", this._players.length);
        this.appendChild(this.showPlayersModal);

        this.showPlayersModal.addEventListener("cancel", () => {
            this.showPlayersModal.remove();
        });

        setTimeout(() => {
            this.showPlayersModal.open();
        }, 100);
    
    }


	disconnectedCallback() {
        this.addPlayersForm.removeEventListener("submit", this.addPlayersHandler.bind(this));
    }

	render() {
		this.innerHTML = /*html*/ `
        <div class="flex-col-center my-10 gap-9">
            <c-logo href="/"></c-logo>
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
                        <button type="submit" id="show-players" class="btn-default w-full text-secondary">Show players</button>
                        <button type="submit" id="add-players" class="btn-secondary w-full">Add players</button>
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
