import HttpClient from "../http/httpClient.js";
import State from "./state.js";
import Toast from "../components/comps/toast.js";
import { userState } from "./userState.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import { config } from "../config.js";
import { notificationState } from "./notificationState.js";
import { matchState } from "./matchState.js";
import Router from "../router/router.js";

class OnlineTournamentState extends State {
	constructor() {
		super({
			matches: [],
            tournaments: [],
			inProgressTournaments: [],
			FinishedTournaments: [],
			inProgressMatch: null,
		});
		this.webSocketManager = new WebSocketManager(config.websocket_url);
		this.socketId = 'tournaments/';
		this.httpClient = HttpClient.instance;
	}
	
	// Sockets start
	async setup(tournamentId) {
		if (!tournamentId) {
			throw new Error("tournamentId not provided");
		}
		this.socketId = "tournaments/" + tournamentId;
        //check if the socket is already open
        if (this.webSocketManager.sockets[this.socketId]) return;

		// Setup the WebSocket connection
		this.webSocketManager.setupWebSocket(
			this.socketId,
			// On message callback
			async (event) => {
				const recieved = JSON.parse(event.data);
				if (recieved.data.type === "TOURNAMENT_STARTED") {
					await this.start_match(tournamentId)
				}
				Toast.notify({ message: recieved.data.message, type: "info" });
				await this.getNotStartedTournaments();
				await this.getInProgressTournaments();
			},
		);
	}

	async start_match(tournamentId, matchId = null) {
		await this.getMatches(tournamentId);
		let match = null;
		if (matchId) {
			match = this.state.matches.find(m => +m.id === +matchId);
		} else {
			match = this.state.matches.find(m => (m?.player1?.id === userState.state.user.id || m?.player2?.id === userState.state.user.id) && m.status === 'IP');
		}
		if (match) {
			Router.instance.navigate(`/online/tournament?tournamentId=${tournamentId}&matchId=${match.id}`);
		}
	}

	async createTournament(type) {
		try {
			const tournament = await this.httpClient.post("tournaments/", {
				type,
			});
			notificationState.notificationSocket.send(notificationState.socketId, {
				type: "TOURNAMENT_UPDATE",
				data: "New tournament created",
			});
			this.setState({
				tournaments: [...this.state.tournaments, tournament],
			});
		}
		catch (error) {
			console.log(error)
			Toast.notify({ message: error.detail, type: "error" })
		}
	
	}

	async getNotStartedTournaments() {
		try {
			const tournaments = await this.httpClient.get("tournaments/");
			this.setState({
				tournaments,
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	async getInProgressTournaments() {
		try {
			const inProgressTournaments = await this.httpClient.get("tournaments/in_progress/");
			this.setState({
				inProgressTournaments,
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	async getFinishedTournaments() {
		try {
			const FinishedTournaments = await this.httpClient.get("tournaments/finished/");
			this.setState({
				FinishedTournaments,
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	async getTournament(id, force = false) {
		try {
			let tournament = this.state.tournaments.find(tournament => tournament.id === id);
			if (!tournament || force) {
				tournament = await this.httpClient.get(`tournaments/${id}/`);
			}
			return tournament;
		}
		catch (error) {
			console.log(error);
		}
	}

	async getMatches(id) {
		try {
			const matches = await this.httpClient.get(`tournaments/${id}/matches/`);
			this.setState({
				matches,
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	async startTournament(id) {
		try {
			const result = await this.httpClient.post(`tournaments/${id}/start/`);
			await this.getInProgressTournaments();
			this.state = {
				tournaments: this.state.tournaments.filter(tournament => tournament.id !== id),
			};
		}
		catch (error) {
			console.log(error);
			Toast.notify({ message: error.detail, type: "error" })
		}
	}

	async joinTournament(id) {
		try {
			const result = await this.httpClient.post(`tournaments/${id}/join/`);
			await this.getNotStartedTournaments();
		}
		catch (error) {
			console.log(error);
			Toast.notify({ message: error.detail, type: "error" })
		}
	}

	async getUpcomingTournaments() {
		try {
			const tournaments = await this.httpClient.get("tournaments/upcoming_tournaments/");
			return tournaments;
		}
		catch (error) {
			console.log(error);
		}
	}

	async leaveTournament(id) {
		try {
			const result = await this.httpClient.post(`tournaments/${id}/leave/`);
			await this.getNotStartedTournaments();
		}
		catch (error) {
			console.log(error);
			Toast.notify({ message: error.detail, type: "error" })
		}
	}

	async getMyInProgressMatch() {
		try {
			const myTournaments = await this.httpClient.get(`tournaments/my_tournaments/`)
			if (myTournaments.length > 0) {
				const matches = await this.httpClient.get(`tournaments/${myTournaments[0].id}/matches/`)
				// find the match that im a player in and is status is IP
				const match = matches.find(m => (m?.player1?.id === userState.state.user.id || m?.player2?.id === userState.state.user.id) && m.status === 'IP');
				this.setState({
					inProgressMatch: match,
				});
				return match;
			}
			return null;
		} catch (error) {
			console.log(error)
		}
	}

	isTournamentTypeExists(type) {
		const { tournaments } = this.state;
		return tournaments.find(tournament => tournament.type === type);
	}
	
	isParticipant(tournament) {
		return tournament.participants.find(u => u.id === userState.state.user.id);
	}

	reset() {
		this.setState({
			matches: [],
            tournament: {},
		});
	}
}

export const onlineTournamentState = new OnlineTournamentState();
