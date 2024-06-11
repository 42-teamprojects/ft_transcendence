import { useFormData } from "../../utils/useForm.js";
import Toast from "../comps/toast.js";
import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import LocalMatch from "../../entities/LocalMatch.js";

export default class Onevsone extends HTMLElement {
	constructor() {
		super();
		document.title = "1 v 1 | Blitzpong.";
		this.players = [];
		this.player1;
		this.player2;
		this.game;
	}

	connectedCallback() {
		this.render();
		this.player1 = this.querySelector("#player1");
		this.player2 = this.querySelector("#player2");
		this.game = this.querySelector("#game");

		this.player1.addEventListener("player-ready", this.playerReadyHandler.bind(this));
		this.player2.addEventListener("player-ready", this.playerReadyHandler.bind(this));

		this.game.addEventListener("submit", this.startGameHandler.bind(this));
	}

	playerReadyHandler = (e) => {
		this.players.push(e.detail.player);
		if (this.players.length === 2) {
			Toast.notify({ type: "success", message: "Players are ready, Choose a theme and start the game" });
		}
	};

	startGameHandler(e) {
		e.preventDefault();
		const selectedTheme = useFormData(e.target).getObject()["theme-option"];
		if (this.players.length < 2) {
			Toast.notify({ type: "error", message: "Please make sure all the players are ready" });
			return;
		}
		// Sort players by player id
		this.players.sort((a, b) => a.playerId - b.playerId);

		const p1 = this.players.find((p) => p.id === 1);
		const p2 = this.players.find((p) => p.id === 2);

		const localMatch = new LocalMatch(p1, p2);
		localMatch.setTheme(selectedTheme);

		matchState.setMatch(localMatch);

		Router.instance.navigate(`/local/1v1/game`);
	}

	render() {
		this.innerHTML = /*html*/ `
        <div class="flex-col-center my-10 gap-9">
            <c-logo href="/"></c-logo>
            <div>
                <h1 class="text-center mb-4">1 v 1 Pong Match</h1>
                <h3 class="text-center font-medium text-stroke">Customize Your Game</h3>
            </div>
            <div class="flex-col-center gap-9 w-full" style="max-width: 900px">
                <div class="flex justify-between w-full">
                    <c-player-setup id="player1" player-id="1"></c-player-setup>
                    <div class="vertical-line"></div>
                    <c-player-setup id="player2" player-id="2"></c-player-setup>
                </div>
                <form id="game" class="w-full flex-col-center mt-8">
                    <div class="tables w-full">
                        <h2 class="mb-6 text-center">Choose a table theme</h2>
                        <div class="flex w-full justify-between gap-2">
                            <c-table-theme type="classic"></c-table-theme>
                            <c-table-theme type="standard" checked></c-table-theme>
                            <c-table-theme type="football"></c-table-theme>
                        </div>
                    </div>
                    <button is="c-button" type="submit" class="btn-primary mt-9">Start game</button>
                </form>
            </div>
        </div>
        `;
	}

	disconnectedCallback() {
		this.players = [];
		this.player1.removeEventListener("player-ready", this.playerReadyHandler);
		this.player2.removeEventListener("player-ready", this.playerReadyHandler);
		this.game.removeEventListener("submit", this.startGameHandler);
	}
}

customElements.define("p-one-vs-one", Onevsone);
