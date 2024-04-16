import Store from "./store.js";

class TournamentStore extends Store {
	constructor() {
		super({
			players: [],
			theme: "",
			playersNumber: 0,
			tournamentStarted: false,
			tournamentFinished: false,
			tournamentWinner: null,
		});
	}

	addPlayer(player) {
		this.setState({ players: [...this.state.players, player] });
	}

	setTheme(theme) {
		this.setState({ theme });
	}

	setPlayersNumber(playersNumber) {
		this.setState({ playersNumber });
	}

	startTournament() {
		this.setState({ tournamentStarted: true });
	}

	finishTournament(winner) {
		this.setState({ tournamentFinished: true, tournamentWinner: winner });
	}

	setPlayers(players) {
		this.setState({ players: players });
	}

	reset() {
		this.setState({ players: [] });
	}
}

export const tournamentStore = new TournamentStore();
