import { config } from "../config.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js";


class MatchState extends State {
	constructor() {
		super({
            match: null,
        });
		this.webSocketManager = new WebSocketManager(config.match_websocket_url);
	}

	setup(matchId) {
		if (!matchId) {
			throw new Error("Match id not provided");
		}

		if (this.webSocketManager.sockets[matchId]) return;

		this.webSocketManager.setupWebSocket(
			matchId,
			// On message callback
			async (event) => {
				const match = JSON.parse(event.data);
				this.setMatch(match);
			},
			{
				// shouldCloseOnTimeout: true,
				// should timeout when game finishes
			}
		);
	}

	sendGameUpdate(matchId, data) {
		this.webSocketManager.send(matchId, data);
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
