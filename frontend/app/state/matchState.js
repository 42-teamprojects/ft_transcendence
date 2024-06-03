import { config } from "../config.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js";
import { userState } from "./userState.js";


class MatchState extends State {
	constructor() {
		super({
            match: null,
			game: null,
        });
		this.matchMakingSocket = new WebSocketManager(config.match_making_websocket_url);
		this.matchSocket = new WebSocketManager(config.match_websocket_url);
	}

	matchSetup(matchId)
	{
		if (!matchId) {
			throw new Error("Match id not provided");
		}

		this.matchSocket.setupWebSocket(
			matchId,
			// On message callback
			async (event) => {
				const matchData = JSON.parse(event.data);
				console.log(matchData);
				if (matchData.data === "start") {
					
					this.is_ready = true;
				}
				if (matchData.data === "player_left") {
					console.log("player left the match");
					matchData.playerLeft = true;
				}
				this.setState({ game: matchData });
			},
			{
				onOpen: () => {
					console.log("user connected");
					// this.matchSocket.send("user_id", userState.state.user.id);
				}
				// shouldCloseOnTimeout: true,
				// should timeout when game finishes
			}
		);
	}
	setupMatchMaking(matchId) {
		if (!matchId) {
			throw new Error("Match id not provided");
		}

		if (this.matchMakingSocket.sockets[matchId]) return;

		this.matchMakingSocket.setupWebSocket(
			matchId,
			// On message callback
			async (event) => {
				const matchData = JSON.parse(event.data);
				// console.log(matchData);
				// console.log(matchData.data.player1, matchData.data.player2);
				let opponent = (matchData.data.player1 !== userState.state.user.id) ? matchData.data.player1 : matchData.data.player2;
				matchData.opponent = opponent;
				// console.log("my id is ", userState.state.user.id);
				// console.log("my opponent is: ", opponent);
				// console.log("match data: ", matchData);
				this.setState({ match: matchData });
			},
			{
				// shouldCloseOnTimeout: true,
				// should timeout when game finishes
			}
		);
	}
	
	closeMatchConnection(matchId) {
		this.matchSocket.closeConnection(matchId);
	}

	closeMatchMakingConnection(matchId) {
		this.matchMakingSocket.closeConnection(matchId);
	}

	sendGameUpdate(matchId, data) {
		this.matchSocket.send(matchId, data);
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
