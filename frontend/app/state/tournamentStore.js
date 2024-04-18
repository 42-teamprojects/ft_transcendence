import LocalMatch from "../entities/LocalMatch.js";
import LocalPlayer from "../entities/LocalPlayer.js";
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
		this.generateAllMatches(this.state.players);
	}

	#getMatchPairs(players) {
		let pairs = [];
		for (let i = 0; i < players.length; i += 2) {
			pairs.push([players[i], players[i + 1]]);
		}
		return pairs;
	}

	generateAllMatches(players) {
		shuffleArray(players);
		const pairs = this.#getMatchPairs(players);
		let rounds = [];
		let totalRounds = this.state.roundsNumber;

		// Generate all matches and groups
		for (let i = 0; i < totalRounds; i++) {
			let matches = [];
			let group = [];
			let totalMatches = Math.pow(2, totalRounds - i - 1);
			for (let j = 0; j < totalMatches; j++) {
				let match;
				if (i === 0) {
					// For the first round, fill the matches with players
					match = new LocalMatch(pairs[j][0], pairs[j][1]);
				} else {
					// For the next rounds, create matches without players
					match = new LocalMatch(null, null);
				}
				group.push(match);
				if (group.length === 2 || j === totalMatches - 1) {
					matches.push(group);
					group = [];
				}
			}
			rounds.push(matches);
		}

		this.setRounds(rounds);
	}

	finishMatch(matchId, winnerId) {
		let rounds = [...this.state.rounds];
		let currentRoundMatches = rounds[this.state.currentRound];
		let groupIndex, matchIndex;
		for (let i = 0; i < currentRoundMatches.length; i++) {
			for (let j = 0; j < currentRoundMatches[i].length; j++) {
				if (currentRoundMatches[i][j].id === matchId) {
					groupIndex = i;
					matchIndex = j;
					break;
				}
			}
		}
		let match = currentRoundMatches[groupIndex][matchIndex];
		if (match) {
			match.winner = match.player1.id === winnerId ? match.player1 : match.player2;
			this.addWinnerToNextRound(match.winner, groupIndex, matchIndex);
		}
	}
	
	addWinnerToNextRound(winner, groupIndex, matchIndex) {
		let rounds = [...this.state.rounds];
		let nextRound = rounds[this.state.currentRound + 1];
		let nextGroupIndex = Math.floor(groupIndex / 2);
		let nextMatchIndex = 0; // Always add the winners to the same match in the next round
	
		if (matchIndex === 0) {
			// If matchIndex is 0, add the winner to player1
			nextRound[nextGroupIndex][nextMatchIndex].player1 = winner;
		} else {
			// If matchIndex is 1, add the winner to player2
			nextRound[nextGroupIndex][nextMatchIndex].player2 = winner;
		}
	
		this.setState({ rounds });
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

const tournamentStore = new TournamentStore();

const players = [];

for (let i = 0; i < 8; i++) {
	players.push(new LocalPlayer(i, `Player ${i + 1}`, "basic"));
}

tournamentStore.setState({
	players: players,
	theme: "football",
	playersNumber: players.length,
});

tournamentStore.generateTournament();

// console.log(tournamentStore.getState().rounds[0][1][1])
tournamentStore.finishMatch(0, tournamentStore.getState().rounds[0][0][0].player1.id);
tournamentStore.finishMatch(1, tournamentStore.getState().rounds[0][1][0].player1.id);

console.log(tournamentStore.getState().rounds);

// rounds[round][group][match]
export { tournamentStore };
