import State from "./state.js";

class MatchState extends State {
	constructor() {
		super({
            match: null,
        });
	}

	setMatch(match) {
		this.setState({ match });
	}

	setWinner(winner) {
		const newMatch = this.state.match;
		newMatch.winner = winner;
		this.setMatch(newMatch);
	}

	reset() {
		this.setState({ 
			match: null,
		});
	}
}

export const matchState = new MatchState();
