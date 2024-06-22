import { onlineTournamentState } from "../../state/onlineTournamentState.js";

export default class Onlinebrackets extends HTMLElement {
    constructor() {
		super();
        this.tournamentState = onlineTournamentState;
        this.tournamentId = +this.getAttribute("tournament-id") || undefined;
	}
    
	async connectedCallback() {
        this.tournamentState = onlineTournamentState;
		this.innerHTML = /*html*/ `<div class="flex-col-center vh-50"><span class="loader"></span></div>`;
		this.tournament = this.tournamentState.state.inProgressTournaments.find((t) => t.id === this.tournamentId) || this.tournamentState.state.FinishedTournaments.find((t) => t.id === this.tournamentId);
		this.render();

		let matches = this.tournamentState.state.matches;
		let matchElements = Array.from(this.querySelectorAll(`.col c-online-tournament-match`));
		matches.forEach((match, index) => {
			matchElements[index]?.setAttribute("match-id", match.id);
		});

		this.unsubscribe = this.tournamentState.subscribe(() => {
			let matches = this.tournamentState.state.matches;
			let matchElements = Array.from(this.querySelectorAll(`.col c-online-tournament-match`));
			matches.forEach((match, index) => {
				matchElements[index]?.setAttribute("match-id", match.id);
			});
		});
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

	render() {
		let rounds = this.tournament.total_rounds; // Number of rounds is log2 of number of players
		let html = '<div class="brackets">';

		for (let i = 0; i < rounds; i++) {
			let matches = Math.pow(2, rounds - i - 1); // Number of matches halves each round
			html += `<div class="col">`;
			for (let j = 0; j < matches; j++) {
				html += `
                    <c-online-tournament-match class="match"></c-online-tournament-match>`;
				if (j % 2 === 0 && j < matches - 1) {
					// Only add match spacer if it's not the last match in the round
					html += '<div class="match-spacer pipe"></div>';
				}
				if (j % 2 === 1 && j < matches - 1) {
					// Add group spacer after every two matches, except for the last two
					html += '<div class="group-spacer"></div>';
				}
			}
			html += "</div>";
		}

		html += "</div>";
		this.innerHTML = html;
	}
}

