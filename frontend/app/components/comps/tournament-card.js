import { config } from "../../config.js";
import { onlineTournamentState } from "../../state/onlineTournamentState.js";
import { userState } from "../../state/userState.js";

export default class Tournamentcard extends HTMLElement {
	constructor() {
		super();
		this.type = this.getAttribute("type") || "notStarted";
		this.players = parseInt(this.getAttribute("players"));
		this.tournamentId = this.getAttribute("tournament-id") || undefined;
		this.tournament = null;
		if (![4, 8, 16].includes(this.players)) {
			throw new Error("Invalid number of players");
		}
	}

	async connectedCallback() {
		this.innerHTML = /*html*/ `<div class="tournament-card flex-col-center"><span class="loader"></span></div>`;
		if (this.tournamentId) {
			this.tournament = await onlineTournamentState.getTournament(this.tournamentId);
			if (!this.tournament) {
				throw new Error("Tournament not found");
			}
			if (this.tournament.participants.length === this.players) {
				this.type = "waitingStart";
			}
		}
		this.render();
		this.addEventListeners();
	}

	addEventListeners() {
		const joinBtn = this.querySelector(".join-btn");
		const createBtn = this.querySelector(".create-btn");
		const startBtn = this.querySelector(".btn-start");
		const leaveBtn = this.querySelector(".leave-btn");

		joinBtn?.addEventListener("click", async () => {
			joinBtn?.setAttribute("processing", "true");
			await onlineTournamentState.joinTournament(this.tournament.id);
			joinBtn?.setAttribute("processing", "false");
		});
		createBtn?.addEventListener("click", async () => {
			createBtn?.setAttribute("processing", "true");
			await onlineTournamentState.createTournament(this.players);
			createBtn?.setAttribute("processing", "false");
		});
		startBtn?.addEventListener("click", async () => {
			startBtn?.setAttribute("processing", "true");
			await onlineTournamentState.startTournament(this.tournament.id);
			startBtn?.setAttribute("processing", "false");
		});
		leaveBtn?.addEventListener("click", async () => {
			leaveBtn?.setAttribute("processing", "true");
			await onlineTournamentState.leaveTournament(this.tournament.id);
			leaveBtn?.setAttribute("processing", "false");
		});
	}

	disconnectedCallback() {}

	// waitingPlayers: Waiting for players to join
	// waitingStart: All players joined, waiting for organizer to start
	// inProgress : In progress
	// notStarted : No organizer yet, be the first!

	render() {
		const avatars = this.prepareAvatars();

		this.innerHTML = /*html*/ `
        <div class="tournament-card">
            <div class="tournament-card-header">
                <div class="tournament-card-header-text">
                    <div class="tournament-card-title">${this.players}-Players</div>
                    <div class="tournament-card-subtitle">${this.getSubtitleContent(this.type)}</div>
                </div>
                <div class="tournament-card-players">
                    ${avatars.join("")}
                </div>
            </div>
            <div class="tournament-card-footer">
                ${this.getFooterContent(this.type)}
            </div>
        </div>
        `;
	}

	getFooterContent(footer) {
		let footerContent;
		switch (footer) {
			case "notStarted":
				footerContent = /*html*/ `
				<p class="tournament-card-footer-text">Not Started</p>
				<button is="c-button" class="create-btn btn-secondary">Create</button>`;
				break;
			case "waitingPlayers":
				footerContent = /*html*/ `
				<p class="tournament-card-footer-text">${+this.players - this.tournament.participants.length} Left to join</p>
				${
					!onlineTournamentState.isParticipant(this.tournament)
						? `<button is="c-button" class="join-btn btn-primary">Join</button>`
						: ""
				}
				${
					onlineTournamentState.isParticipant(this.tournament)
						? `<button is="c-button" class="leave-btn btn-secondary">Leave</button>`
						: ""
				}
				`;
				break;
			case "waitingStart":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">Starting in 10min</p>
				${
					this.tournament.organizer === userState.state.user.id
						? /*html*/ `<button is="c-button" class="btn-start btn-primary">Start</button>`
						: ""
				}
            `;
				break;
			case "inProgress":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">In progress</p>`;
				break;
			default:
				footerContent = "";
				break;
		}

		return footerContent;
	}

	getSubtitleContent(subtitle) {
		let subtitleContent;
		switch (subtitle) {
			case "notStarted":
				subtitleContent = "No organizer yet, be the first!";
				break;
			case "waitingPlayers":
				subtitleContent = "Waiting for players to join";
				break;
			case "waitingStart":
				subtitleContent = "All players joined, starting soon";
				break;
			case "inProgress":
				subtitleContent = "In progress";
				break;
			default:
				subtitleContent = "";
				break;
		}
		return subtitleContent;
	}

	prepareAvatars() {
		const avatars = [];
		const usernames = [];
		for (let i = 0; i < this.players; i++) {
			if (this.type !== "notStarted" && this.tournament?.participants[i] && i >= 4) {
				usernames.push(this.tournament?.participants[i].username);
			}
			if (i >= 4) continue;
			let avatar = /*html*/ `
				<div class="player-avatar"></div>
			`;
			if (this.type !== "notStarted" && this.tournament?.participants[i]) {
				const user = this.tournament?.participants[i];
				avatar = /*html*/ `
				<a is="c-link" class="relative" href="/dashboard/profile?username=${user.username}" tooltip="${
					user.username
				}" flow="up">
					<img class="player-avatar" src="${config.backend_domain}${user.avatar}" />
					${
						this.tournament.organizer === user.id
							? `<i class="fa-solid fa-star text-highlight text-sm absolute" style="bottom: 0; right: 0"></i>`
							: ""
					}
				</a>
				`;
			}
			avatars.push(avatar);
		}

		if (this.players > 4) {
			avatars.push(/*html*/ `
                <div class="player-avatar players-remaining" tooltip="${usernames.join(", ")}" flow="up">
                    <p>${this.players - 4}+</p>
                </div>
            `);
		}

		return avatars;
	}
}
