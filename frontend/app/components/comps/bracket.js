import { tournamentStore } from "../../state/tournamentStore.js";

export default class Bracket extends HTMLElement {
	constructor() {
		super();
		this.tournamentDetails;
	}

	connectedCallback() {
		this.update();
		this.unsubscribe = tournamentStore.subscribe(this.update.bind(this));
	}

	update() {
		this.tournamentDetails = tournamentStore.getState();
		console.log(this.tournamentDetails);

		this.render(this.tournamentDetails);

		let flattenedMatches = this.tournamentDetails.rounds.flat(2);
		let matchElements = this.querySelectorAll(`.col c-match`);

		flattenedMatches.forEach((match, index) => {
			matchElements[index].setAttribute("match-id", match.id);
		});
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

	render(tournamentDetails) {
		let rounds = tournamentDetails.roundsNumber; // Number of rounds is log2 of number of players
		let html = '<div class="brackets">';

		for (let i = 0; i < rounds; i++) {
			let matches = Math.pow(2, rounds - i - 1); // Number of matches halves each round
			html += `<div class="col">`;
			for (let j = 0; j < matches; j++) {
				html += `
				<c-match class="match"></c-match>`;
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
