import LocalMatch from "../entities/LocalMatch.js";
import { shuffleArray } from "../utils/utils.js";
import Store from "./store.js";

class TournamentStore extends Store {
	constructor() {
		super({
			rounds: 0,
			players: [],
			theme: "",
			matches: [],
			currentMatch: null,
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
		this.setState({ playersNumber: parseInt(playersNumber) });
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

	setMatches(matches) {
		this.setState({ matches });
	}

	setMatchWinner(matchId, winner) {
		const matches = this.state.matches.map((match) => {
			if (match.id === matchId) {
				match.winner = winner;
			}
			return match;
		});
		this.setState({ matches });
	}

	setRounds(rounds) {
		this.setState({ rounds });
	}

	generateTournament() {
		this.setRounds(Math.log2(this.state.playersNumber));
		this.#generateMatches(this.state.players);
	}

	#getMatchPairs(players) {
		let pairs = [];
		for (let i = 0; i < players.length; i += 2) {
			pairs.push([players[i], players[i + 1]]);
		}
		return pairs;
	}

	#generateMatches(players) {
		shuffleArray(players);
		const pairs = this.#getMatchPairs(players);
		let matches = [];
		pairs.forEach((pair, index) => {
			const match = new LocalMatch(index, pair[0], pair[1]);
			matches.push(match);
		});
		this.setMatches(matches);
	}


	reset() {
		this.setState({
			rounds: 0,
			players: [],
			theme: "",
			matches: [],
			currentMatch: null,
			playersNumber: 0,
			tournamentStarted: false,
			tournamentFinished: false,
			tournamentWinner: null,
		 });
	}
}

export const tournamentStore = new TournamentStore();
