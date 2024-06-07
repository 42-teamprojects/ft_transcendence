import HttpClient from "../http/httpClient.js";
import State from "./state.js";
import Toast from "../components/comps/toast.js";
import { userState } from "./userState.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import { config } from "../config.js";

class OnlineTournamentState extends State {
	constructor() {
		super({
			matches: [],
            tournaments: [],
			inProgressTournaments: [],
			FinishedTournaments: [],
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
				const message = JSON.parse(event.data); // Parse the message from the server
				Toast.notify({ message: message.data, type: "info" });
				await this.getNotStartedTournaments();
				await this.getInProgressTournaments();
			},
			// Options
			// {}
		);
	}

	async createTournament(type) {
		try {
			const tournament = await this.httpClient.post("tournaments/", {
				type,
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
