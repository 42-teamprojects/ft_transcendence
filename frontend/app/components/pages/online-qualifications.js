import Router from "../../router/router.js";
import { onlineTournamentState } from "../../state/onlineTournamentState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";
import Toast from "../comps/toast.js";

export default class OnlineQualifications extends HTMLElement {
	constructor() {
		super();
		document.title = "Qualifications | Blitzpong.";
		this.tournamentState = onlineTournamentState;
		this.tournamentId = +getMatchUrl(/^\/dashboard\/tournaments\/qualifications\/(\w+)\/?$/)
		if (!this.tournamentId) {
			Toast.notify({ message: "Invalid tournament id", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			throw new Error("Invalid tournament id");
		}
	}

	async connectedCallback() {
		this.tournamentState = onlineTournamentState;
		this.innerHTML = /*html*/ `<c-loader></c-loader>`;
		await this.tournamentState.getInProgressTournaments();
		this.tournament = this.tournamentState.state.inProgressTournaments.find(tournament => tournament.id === this.tournamentId)
		if (!this.tournament) {
			Toast.notify({ message: "Tournament not found", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		if (this.tournament.participants.find(p => p.id === userState.state.user.id) === undefined) {
			Toast.notify({ message: "You are not a participant in this tournament", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		await this.tournamentState.getMatches(this.tournamentId);
		if (this.tournamentState.state.matches.length === 0) {
			Toast.notify({ message: "No matches found", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		this.render();
		// this.unsubscribe = tournamentState.subscribe(() => {
		// 	this.tournamentState = tournamentState.state;
		// 	this.update();
		// });
	}

	disconnectedCallback() {}

	render() {
		// const currentMatch = this.tournamentState.currentMatch;
		// let formButton = `<button is="c-button" type="submit" id="start-match" class="btn-primary mt-9">Start Match ${currentMatch ? currentMatch.id + 2 : 1}</button>`
		// if (this.tournamentState.currentRound >= this.tournamentState.rounds.length) {
		// 	formButton = `<button is="c-button" type="submit" id="end-tournament" class="btn-primary mt-9">End Tournament</button>`
		// }

		this.innerHTML = /*html*/ `
		<div class="flex-col-center my-10 gap-10 w-full">
            <div class="">
                <h1 class="text-center mb-4">Tournament brackets</h1>
                <h3 class="text-center font-medium text-stroke spacing-">Qualifications</h3>
            </div>
            <div class="w-full" style="max-width: 1300px">
                <c-online-brackets tournament-id="${this.tournamentId}" class="w-full"></c-online-brackets>
            </div>
		</div>
		`;
            // <form id="game" class="w-full flex-col-center">
			//     ${formButton}
            // </form>
	}
}

customElements.define("p-online-qualification", OnlineQualifications);
