import Router from "../../router/router.js";
import { onlineTournamentState } from "../../state/onlineTournamentState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl, isTimePast, startCountdown } from "../../utils/utils.js";
import Toast from "../comps/toast.js";

export default class OnlineQualifications extends HTMLElement {
	constructor() {
		super();
		document.title = "Qualifications | Blitzpong.";
		this.tournamentState = onlineTournamentState;
		this.tournamentId = +getMatchUrl(/^\/dashboard\/tournaments\/qualifications\/(\w+)\/?$/)
		if (!this.tournamentId) {
			Toast.notify({ message: "Invalid tournament id", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			throw new Error("Invalid tournament id");
		}
	}

	async connectedCallback() {
		this.tournamentState = onlineTournamentState;
		this.innerHTML = /*html*/ `<c-loader></c-loader>`;
		await this.tournamentState.getInProgressTournaments();
		await this.tournamentState.getFinishedTournaments();
		this.tournament = this.tournamentState.state.inProgressTournaments.find(tournament => tournament.id === this.tournamentId) 
							|| this.tournamentState.state.FinishedTournaments.find(tournament => tournament.id === this.tournamentId)
		if (!this.tournament) {
			Toast.notify({ message: "Tournament not found", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		if (this.tournament.participants.find(p => p.id === userState.state.user.id) === undefined) {
			Toast.notify({ message: "You are not a participant in this tournament", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		await this.tournamentState.getMatches(this.tournamentId);
		if (this.tournamentState.state.matches.length === 0) {
			Toast.notify({ message: "No matches found", type: "error" });
			Router.instance.navigate("/dashboard/tournaments");
			return;
		}
		this.start_time = new Date(this.tournament.start_time)
		this.render();
		this.timeRemaining = this.querySelector("#countdown")
		if (isTimePast(this.start_time)) return;
		this.countdown = startCountdown(this.start_time, (output) => {
            this.timeRemaining.innerHTML = output;
        },
        () => {
			setTimeout(() => {
				this.querySelector(".countdown-container").remove();
			}, 1000);
		}
        );
	}

	disconnectedCallback() {
		if (this.countdown) clearInterval(this.countdown);
	}

	render() {
		this.innerHTML = /*html*/ `
		<div class="flex-col-center my-10 gap-10 w-full">
            <div class="">
                <h1 class="text-center mb-4">Tournament brackets</h1>
                <h3 class="text-center font-medium text-stroke spacing-">Qualifications</h3>
            </div>
            <div class="w-full" style="max-width: 1300px">
                <c-online-brackets tournament-id="${this.tournamentId}" class="w-full"></c-online-brackets>
			</div>
			${!isTimePast(this.start_time) ? /*html*/`
			<div class="countdown-container w-full flex-col-center gap-5">
				<p class="text-stroke">Starting matches in</p>
				<h2 id="countdown">--:--</h2>
			</div>` : ''}
		</div>
		`;
	}
}

customElements.define("p-online-qualification", OnlineQualifications);
