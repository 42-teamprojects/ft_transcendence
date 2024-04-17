import LocalMatch from "../../entities/LocalMatch.js";
import { tournamentStore } from "../../state/tournamentStore.js";
import { shuffleArray } from "../../utils/utils.js";

export default class Bracket extends HTMLElement {
	constructor() {
		super();
		this.tournamentDetails;
	}

	connectedCallback() {
		this.tournamentDetails = tournamentStore.getState();
		console.log(this.tournamentDetails);

		this.render();

		this.querySelector(".col:first-child")
			.querySelectorAll("c-match")
			.forEach((match, index) => {
				match.setAttribute("match-id", this.tournamentDetails.matches[index].id);
			});

		tournamentStore.setMatchWinner(0, this.tournamentDetails.players[0]);
	}

	disconnectedCallback() {}

	render() {
		let rounds = this.tournamentDetails.rounds; // Number of rounds is log2 of number of players
		let html = '<div class="brackets w-full">';

		for (let i = 0; i < rounds; i++) {
			let matches = Math.pow(2, rounds - i - 1); // Number of matches halves each round
			html += '<div class="col">';
			for (let j = 0; j < matches; j++) {
				html += `
                <c-match class="match"></c-match>
            `;
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
