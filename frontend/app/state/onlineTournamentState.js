import HttpClient from "../http/httpClient.js";
import State from "./state.js";
import Toast from "../components/comps/toast.js";
import { userState } from "./userState.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import { config } from "../config.js";
import { notificationState } from "./notificationState.js";

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
				} else if (recieved.data.type === "TOURNAMENT_FULL") { 
					Toast.notify({
						type: "info",
						message: /*html*/ `<p>${recieved.data.message}</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/tournaments/qualifications/${tournamentId}" class="mt-2">View brackets</a>`,
					});
				} else if (recieved.data.type === "TOURNAMENT_UPDATE") {
					Toast.notify({
						type: "info",
						message: recieved.data.message,
					});
					await this.getMatches(recieved.data.tournament_id);
					await this.getMyInProgressMatch();
				} else {
					Toast.notify({ message: recieved.data.message, type: "info" });
				}
				await this.getNotStartedTournaments();
				await this.getInProgressTournaments();
			},
		);
	}

	async start_match(tournamentId, matchId = null) {
		Toast.notify({
			type: "info",
			message: /*html*/ `<p>Tournament match started, join now!!!</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/tournaments/qualifications/${tournamentId}" class="mt-2">Join match</a>`,
		});
		this.getMyInProgressMatch();
	}

	async createTournament(type) {
		try {
			const tournament = await this.httpClient.post("tournaments/", {
				type,
			});
			notificationState.sendNotification({
				type: "TOURNAMENT_UPDATE",
				data: {
					type: "TOURNAMENT_CREATED",
					message: "New tournament created"
				},
			}, false, false);
			this.setState({
				tournaments: [...this.state.tournaments, tournament],
			});
		}
		catch (error) {
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
			await this.httpClient.post(`tournaments/${id}/start/`);
			await this.getInProgressTournaments();
			this.state = {
				tournaments: this.state.tournaments.filter(tournament => tournament.id !== id),
			};
		}
		catch (error) {
			Toast.notify({ message: error.detail, type: "error" })
		}
	}

	async joinTournament(id) {
		try {
			await this.httpClient.post(`tournaments/${id}/join/`);
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
			await this.httpClient.post(`tournaments/${id}/leave/`);
			await this.getNotStartedTournaments();
			this.webSocketManager.closeConnection(this.socketId);
		}
		catch (error) {
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
			return null;
		}
	}
	
	async getMyPastTournaments() {
		try {
			const myTournaments = await this.httpClient.get(`tournaments/my_past_tournaments/`)
			return myTournaments;
		} catch (error) {
			return [];
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
