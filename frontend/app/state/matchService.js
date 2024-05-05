import Service from "./service.js";

class MatchService extends Service {
	constructor() {
		super({
            match: null,
        });
	}

	setMatch(match) {
		this.setState({ match });
	}

	setWinner(winner) {
		const newMatch = this.getState().match;
		newMatch.winner = winner;
		this.setMatch(newMatch);
	}

	reset() {
		this.setState({ 
			match: null,
		});
	}
}

export const matchService = new MatchService();
