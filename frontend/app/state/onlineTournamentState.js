import HttpClient from "../http/httpClient.js";
import State from "./state.js";

class OnlineTournamentState extends State {
	constructor() {
		super({
			matches: [],
            tournament: {},
            rounds: [],
		});
		this.httpClient = HttpClient.instance;
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
