import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import Router from "../router/router.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js";
import Toast from "../components/comps/toast.js";
import { userState } from "./userState.js";

class MatchState extends State {
	constructor() {
		super({
            match: null,
			game: null,
			session: null,
        });
		this.matchMakingId = "match-making"
		this.matchMakingSocket = new WebSocketManager(config.websocket_url);
		this.matchSocket = new WebSocketManager(config.match_websocket_url);
		this.playerLeft = false;
	}

	matchSetup()
	{
		if (!this.state.session) return;
		const sessionId = this.state.session.id
		if (this.matchSocket.sockets[sessionId]) return;
		this.matchSocket.setupWebSocket(
			sessionId,
			// On message callback
			async (event) => {
				const matchData = JSON.parse(event.data);
				if (matchData.type === "game_started") {
					// console.log("game started");
					this.is_ready = true;
				}
				if (matchData.type === "player_left") {
					this.playerLeft = true;

					if (matchData.winner_id === undefined || matchData.winner_id === "null") {
						Toast.notify({ type: "warning", message: "Opponent left the match" });
					}
                	matchState.closeMatchConnection();
                	Router.instance.navigate('/dashboard/home');
				}
				if (matchData.type === "score_update") {
					// console.log("data i got from socket : ", matchData);	
				}
				this.setState({ game: matchData });
			}
		);
	}

	setupMatchMaking(p1 = null, p2 = null, matchId = null) {
		if (matchId) {
			this.matchMakingId = `tournament-match-making/${matchId}`;
		}
		else if (p1 && p2) {
			this.matchMakingId = `private-match-making/${p1}/${p2}`;
		} else {
			this.matchMakingId = `match-making`;
		}

		if (this.matchMakingSocket.sockets[this.matchMakingId]) return;

		this.matchMakingSocket.setupWebSocket(
			this.matchMakingId,
			// On message callback
			async (event) => {
				if (this.state.session) return;
				// Parse the event data once and use it throughout
				const eventData = JSON.parse(event.data);

				// if (eventData && eventData.data && eventData.data.game_session_id) {
				const sessionId = eventData.data.game_session_id;
				// console.log("session id", sessionId);
				await this.getGameSession(sessionId);
				// }
			}
		);
	}

	async getGameSession(sessionId) {
		if (!sessionId) {
			throw new Error("Session id not provided");
		}
		if (this.state.game || this.state.match) return
		try {
			const gameSession = await HttpClient.instance.get(`game/session/${sessionId}/`);
			this.setState({ match: gameSession.match, session: gameSession });
		} catch (error) {
			console.log(error);
		}
	}

	closeMatchConnection() {
		this.matchSocket.closeConnection(this.state.session.id);
	}

	closeMatchMakingConnection() {
		this.matchMakingSocket.closeConnection(this.matchMakingId);
	}

	sendGameUpdate(data) {
		this.matchSocket.send(this.state.session.id, data);
	}

	setMatch(match) {
		this.setState({ match });
	}

	setWinner(winner) {
		const newMatch = this.state.match;
		newMatch.winner = winner;
		this.setMatch(newMatch);
	}

	getOpponent(match) {
		const user = userState.state.user;
		return match.player1.id === user.id ? match.player2 : match.player1;
	}

	reset() {
		this.setState({ 
			match: null,
			game: null,
			session: null,
		});
	}
}

export const matchState = new MatchState();
