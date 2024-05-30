import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import { tournamentState } from "../../state/tournamentState.js";
import Toast from "../comps/toast.js";

export default class Qualifications extends HTMLElement {
	constructor() {
		super();
		document.title = "Qualifications | Blitzpong.";
		this.tournamentDetails;
		this.qualificationNames = {
			32: "Round of 32",
			16: "Round of 16",
			8: "Quarter-final",
			4: "Semi-final",
			2: "Final",
		};
	}

	connectedCallback() {
		this.tournamentDetails = tournamentState.state;
		if (!this.tournamentDetails.playersNumber || this.tournamentDetails.playersNumber === 0) {
			Toast.notify({ type: "error", message: "Please make sure all the players are registred" });
			Router.instance.navigate("/local/tournament");
			return;
		}
		this.update();
		this.unsubscribe = tournamentState.subscribe(() => {
			this.tournamentDetails = tournamentState.state;
			this.update();
		});
	}

	update() {
		this.render();
		const form = this.querySelector("#game");
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			if (e.submitter.id === "start-match") {
				const currentMatch = tournamentState.startNextMatch();
				matchState.setMatch(currentMatch);
				Router.instance.navigate("/local/tournament/game");
			}
			else if (e.submitter.id === "end-tournament") {
				tournamentState.reset();
				Router.instance.navigate("/local/tournament");
			}
		});
		
	}

	disconnectedCallback() {}

	render() {
		const currentMatch = this.tournamentDetails.currentMatch;
		let formButton = `<button is="c-button" type="submit" id="start-match" class="btn-primary mt-9">Start Match ${currentMatch ? currentMatch.id + 2 : 1}</button>`
		if (this.tournamentDetails.currentRound >= this.tournamentDetails.rounds.length) {
			formButton = `<button is="c-button" type="submit" id="end-tournament" class="btn-primary mt-9">End Tournament</button>`
		}

		this.innerHTML = /*html*/ `
		<div class="flex-col-center my-10 gap-10 w-full">
			<c-logo href="/"></c-logo>
            <div class="">
                <h1 class="text-center mb-4">Tournament brackets</h1>
                <h3 class="text-center font-medium text-stroke spacing-">${this.getQualificationName()}</h3>
            </div>
            <div class="w-full" style="max-width: 1300px">
                <c-bracket class="w-full"></c-bracket>
            </div>
            <form id="game" class="w-full flex-col-center">
			    ${formButton}
            </form>
        </div>
        `;
	}

	getQualificationName() {
        let currentRound = this.tournamentDetails.currentRound;
        if (currentRound >= this.tournamentDetails.rounds.length) {
            return "Tournament completed";
        }
        const currentRoundMatches = this.tournamentDetails.rounds[currentRound].flat()
		return this.qualificationNames[
			currentRoundMatches.length * 2
		];
	}
}

customElements.define("p-qualification", Qualifications);
