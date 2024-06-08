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
				// console.log("data i got from socket : ", matchData);
				if (matchData.type === "game_started") {
					console.log("game started");
					this.is_ready = true;
					// matchData.player_1_paddle = matchData.data.player_1_paddle;
				}
				if (matchData.type === "player_left") {
					console.log("player left the match");
					//SET THE PLAYER AS WINNER

					this.playerLeft = true;
					Toast.notify({ type: "warning", message: "Opponent left the match" });
                	matchState.closeMatchConnection();
                	Router.instance.navigate('/dashboard/home');
				}

				this.setState({ game: matchData });
			},
			{
				onOpen: () => {
					console.log("user connected");
				}
			}
		);
	}

	setupMatchMaking() {
		if (!this.matchMakingId) {
			throw new Error("Match id not provided");
		}

		if (this.matchMakingSocket.sockets[this.matchMakingId]) return;

		this.matchMakingSocket.setupWebSocket(
			this.matchMakingId,
			// On message callback
			async (event) => {
				console.log("matchy matchy");
				const gameSessionId = JSON.parse(event.data);
				const sessionId = gameSessionId.data.game_session_id;
				await this.getGameSession(sessionId);
			},
			{
				// shouldCloseOnTimeout: true,
				// should timeout when game finishes
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
			console.log("game session", gameSession);
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
		});
	}
}

export const matchState = new MatchState();
