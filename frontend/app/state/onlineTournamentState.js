import HttpClient from "../http/httpClient.js";
import State from "./state.js";
import Toast from "../components/comps/toast.js";

class OnlineTournamentState extends State {
	constructor() {
		super({
			matches: [],
            tournaments: [],
			inProgressTournaments: [],
			FinishedTournaments: [],
            rounds: [],
		});
		this.httpClient = HttpClient.instance;
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

	async getNotStartedTournament() {
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

	async getInProgressTournament() {
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

	async getFinishedTournament() {
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
			// this.setState({
			// 	tournaments : this.state.tournaments.map(t => t.id === id ? tournament : t),
			// });
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
			this.getInProgressTournament();
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
			this.getNotStartedTournament();
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
	
	reset() {
		this.setState({
			matches: [],
            tournament: {},
            rounds: [],
		});
	}
}

export const onlineTournamentState = new OnlineTournamentState();
