import LocalMatch from "../entities/LocalMatch.js";
import { shuffleArray } from "../utils/utils.js";
import State from "./state.js";

class TournamentState extends State {
	constructor() {
		super({
			roundsNumber: 0,
			players: [],
			theme: "",
			matches: [],
			rounds: [],
			currentRound: 0,
			currentMatch: null,
			playersNumber: 0,
			tournamentStarted: false,
			tournamentFinished: false,
			tournamentWinner: null,
		});
	}

	setTheme(theme) {
		this.setState({ theme });
	}

	setPlayersNumber(playersNumber) {
		this.setState({ playersNumber: parseInt(playersNumber) });
	}

	finishTournament(winner) {
		this.setState({ tournamentFinished: true, tournamentWinner: winner });
	}

	setPlayers(players) {
		this.setState({ players: players });
	}

	setRoundsNumber(roundsNumber) {
		this.setState({ roundsNumber });
	}

	setCurrentMatch(match) {
		match.isStarted = true;
		this.setState({ currentMatch: match });
	}

	setRounds(rounds) {
		this.setState({ rounds });
	}

	generateTournament() {
		this.setRoundsNumber(Math.log2(this.state.playersNumber));
		this.#generateAllMatches(this.state.players);
		this.setState({ tournamentStarted: true });
	}

	finishMatch(playerId) {
		if (this.state.tournamentFinished) {
			return;
		}
		const rounds = [...this.state.rounds];
		const currentRoundMatches = rounds[this.state.currentRound];
		let matchFound = false;

		// Find the match with the given player id
		for (let i = 0; i < currentRoundMatches.length; i++) {
			for (let j = 0; j < currentRoundMatches[i].length; j++) {
				const match = currentRoundMatches[i][j];
				if (match.player1 && match.player1.id === playerId) {
					match.winner = match.player1;
					if (this.state.currentRound < rounds.length - 1) {
						this.addWinnerToNextRound(match.winner, i, j);
					}
					match.isFinished = true;
					matchFound = true;
					break;
				} else if (match.player2 && match.player2.id === playerId) {
					match.winner = match.player2;
					if (this.state.currentRound < rounds.length - 1) {
						this.addWinnerToNextRound(match.winner, i, j);
					}
					match.isFinished = true;
					matchFound = true;
					break;
				}
			}
			if (matchFound) {
				break;
			}
		}

		if (!matchFound) {
			console.log(`Player with id ${playerId} is not in any match in the current round.`);
		}

		// when every matched is finished let move to the next round
		if (currentRoundMatches.flat().every((match) => match.isFinished)) {
			this.setState({ currentRound: this.state.currentRound + 1 });
		}

		this.setState({ rounds });

		if (this.state.currentRound === this.state.roundsNumber) {
			this.finishTournament(currentRoundMatches[0][0].winner);
		}
	}

	addWinnerToNextRound(winner, groupIndex, matchIndex) {
		let rounds = [...this.state.rounds];
		let nextRound = rounds[this.state.currentRound + 1];
		let nextGroupIndex = Math.floor(groupIndex / 2);
		let nextMatchIndex = groupIndex % 2; // Use the group index to determine the match index in the next round

		if (matchIndex === 0) {
			nextRound[nextGroupIndex][nextMatchIndex].player1 = winner;
		} else if (matchIndex === 1) {
			nextRound[nextGroupIndex][nextMatchIndex].player2 = winner;
		}

		this.setState({ rounds });
	}

	#getMatchPairs(players) {
		let pairs = [];
		for (let i = 0; i < players.length; i += 2) {
			pairs.push([players[i], players[i + 1]]);
		}
		return pairs;
	}

	#generateAllMatches(players) {
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
				match.setTheme(this.state.theme);
				group.push(match);
				if (group.length === 2 || j === totalMatches - 1) {
					matches.push(group);
					group = [];
				}
			}
			rounds.push(matches);
		}

		this.setRounds(rounds);
		this.setState({ matches: rounds.flat(2) });
	}

	startNextMatch() {
		if (this.state.tournamentFinished) {
			return null;
		}
		const rounds = [...this.state.rounds];
		const currentRoundMatches = rounds[this.state.currentRound];

		for (let group of currentRoundMatches) {
			for (let match of group) {
				if (!match.isStarted && !match.isFinished) {
					this.setCurrentMatch(match);
					return match;
				}
			}
		}

		console.warn("No match found to start.");
		return null;
	}

	reset() {
		LocalMatch.autoId = 0;
		this.setState({
			roundsNumber: 0,
			matches: [],
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


export const tournamentState = new TournamentState();
/* 
[

  [  # Round 1

    [ match1, match2 ],  # Group 1 in Round 1

    [ match3, match4 ]   # Group 2 in Round 1

  ],

  [  # Round 2

    [ match5, match6 ]  # Only one group in Round 2 because there are only 2 groups in Round 1 and always one group holds two matches, so the winner of the two matches in the same group will play against each other in the next round.
  
  ],

  [ # Round 3
      
      [ match7 ]  # Only one group in Round 3 because there is only one group in Round 2, and only one match in that group, so the winner of that match will be the winner of the tournament.
  ]

]
*/
