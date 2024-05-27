export default class Tournamentcard extends HTMLElement {
	constructor() {
		super();
		this.type = this.getAttribute("type") || "notStarted";
		this.players = parseInt(this.getAttribute("players"));

		if (![4, 8, 16].includes(this.players)) {
			throw new Error("Invalid number of players");
		}
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	// waitingStart: All players joined, waiting for organizer to start
	// waitingPlayers: Waiting for players to join
	// start : All players joined, starting soon
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
			case "waitingStart":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">All joined</p>
            `;
				break;
			case "waitingPlayers":
				footerContent = /*html*/ `
            <p class="tournament-card-footer-text">3 Left to join</p>
            <button is="c-button" class="tournament-card-join-btn btn-primary">Join</button>
            `;
				break;
			case "start":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">Starting in 5 minutes</p>
            `;
				break;
			case "inProgress":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">In progress</p>
            `;
				break;
			case "notStarted":
				footerContent = /*html*/ `
                <p class="tournament-card-footer-text">Not Started</p>
                <button is="c-button" class="tournament-card-join-btn btn-secondary">Create</button> 
            `;
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
			case "waitingPlayers":
				subtitleContent = "Waiting for players to join";
				break;
			case "waitingStart":
				subtitleContent = "Waiting for organizer to start";
				break;
			case "start":
				subtitleContent = "All players joined, starting soon";
				break;
			case "notStarted":
				subtitleContent = "No organizer yet, be the first!";
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

		for (let i = 0; i < this.players && i < 4; i++) {
			let avatar = /*html*/ `
                <div class="player-avatar"></div>
            `;
			if (this.type !== "notStarted") {
				avatar = /*html*/ `
                <a is="c-link" href="/user/1" tooltip="User" flow="up">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                </a>
            `;
			}
			avatars.push(avatar);
		}

		if (this.players > 4) {
			avatars.push(/*html*/ `
                <div class="player-avatar players-remaining">
                    <p>${this.players - 4}+</p>
                </div>
            `);
		}

		return avatars;
	}
}
