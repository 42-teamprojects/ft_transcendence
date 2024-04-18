import LocalMatch from "../entities/LocalMatch.js";
import { shuffleArray } from "../utils/utils.js";
import Store from "./store.js";

class TournamentStore extends Store {
	constructor() {
		super({
			roundsNumber: 0,
			players: [],
			theme: "",
			rounds: [],
			currentRound: 0, 
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

	setMatchWinner(matchId, winner) {
		const matches = this.state.matches.map((match) => {
			if (match.id === matchId) {
				match.winner = winner;
			}
			return match;
		});
		this.setState({ matches });
	}

	setRoundsNumber(roundsNumber) {
		this.setState({ roundsNumber });
	}

	setCurrentMatch(match) {
		this.setState({ currentMatch: match });
	}

	setRounds(rounds) {
		this.setState({ rounds });
	}

	generateTournament() {
		this.setRoundsNumber(Math.log2(this.state.playersNumber));
		this.#generateFirstRoundMatches(this.state.players);
	}

	#getMatchPairs(players) {
		let pairs = [];
		for (let i = 0; i < players.length; i += 2) {
			pairs.push([players[i], players[i + 1]]);
		}
		return pairs;
	}

	#generateFirstRoundMatches(players) {
		shuffleArray(players);
		const pairs = this.#getMatchPairs(players);
		let matches = [];
		pairs.forEach((pair) => {
			const match = new LocalMatch(pair[0], pair[1]);
			matches.push(match);
		});
		this.setRounds([matches]);
	}

	finishMatch(matchId, winnerId) {
        let rounds = [...this.state.rounds];
        let currentRoundMatches = rounds[this.state.currentRound];
        let match = currentRoundMatches.find(match => match.id === matchId);
        if (match) {
			match.winner = match.player1.id === winnerId ? match.player1 : match.player2;
            this.addWinnerToNextRound(match.winner);
        }
    }

    addWinnerToNextRound(winner) {
		let rounds = [...this.state.rounds];
		if (!rounds[this.state.currentRound + 1]) {
			rounds.push([]);
		}
		let nextRoundMatches = rounds[this.state.currentRound + 1];
		let match = nextRoundMatches.find(match => !match.player2);
		if (match) {
			match.player2 = winner;
		} else {
			nextRoundMatches.push(new LocalMatch(winner, null));
		}
		this.setState({rounds});
	
		// Check if all matches in the current round have a winner
		let currentRoundMatches = rounds[this.state.currentRound];
		if (currentRoundMatches.every(match => match.winner)) {
			// If all matches have a winner, increment currentRound
			this.setState({ currentRound: this.state.currentRound + 1 });
		}
	}

	reset() {
		this.setState({
			roundsNumber: 0,
			players: [],
			theme: "",
			rounds: [],
			currentRound: 0, 
			currentMatch: null,
			playersNumber: 0,
			tournamentStarted: false,
			tournamentFinished: false,
			tournamentWinner: null,
		 });
	}
}

export const tournamentStore = new TournamentStore();
