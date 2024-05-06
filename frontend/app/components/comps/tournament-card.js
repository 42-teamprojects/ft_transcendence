export default class Tournamentcard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="tournament-card">
            <div class="tournament-card-header">
                <div class="tournament-card-header-text">
                    <div class="tournament-card-title">16-Players Tournament</div>
                    <div class="tournament-card-subtitle">Waiting for players to join</div>
                </div>
                <div class="tournament-card-players">
                    <a is="c-link" href="/user/1" tooltip="User" flow="up">
                        <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    </a>
                    <a is="c-link" href="/user/1" tooltip="User" flow="up">
                        <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    </a>
                    <a is="c-link" href="/user/1" tooltip="User" flow="up">
                        <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    </a>
                    <a is="c-link" href="/user/1" tooltip="User" flow="up">
                        <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    </a>
                    <div class="player-avatar players-remaining">
                        <p>12+</p>
                    </div>
                </div>
            </div>
            <div class="tournament-card-footer">
                <p class="tournament-card-footer-text">2 Left to join</p>
                <button is="c-button" class="tournament-card-join-btn btn-primary">Join</button>
            </div>
        </div>
        `;
    }

    getFooterContent() {
        const footerJoin = /*html*/`
            <p class="tournament-card-footer-text">2 Left to join</p>
            <button is="c-button" class="tournament-card-join-btn btn-primary">Join</button>
        `

        const footerWaiting = /*html*/`
            <p class="tournament-card-footer-text">Waiting for organizer to start</p>
        `

        const footerStart = /*html*/`
            <p class="tournament-card-footer-text">Starting in 5 minutes</p>
        `

        const footerInProgress = /*html*/`
            <p class="tournament-card-footer-text">In progress</p>
        `

        const footerEnded = /*html*/`
            <p class="tournament-card-footer-text">Ended</p>
        `
    }
}