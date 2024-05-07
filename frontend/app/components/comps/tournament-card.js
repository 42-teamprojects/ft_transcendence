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
                ${this.getFooterContent('join')}
            </div>
        </div>
        `;
    }

    getFooterContent(footer) {
        let footerContent;
        switch (footer) {
            case 'join':
            footerContent = /*html*/`
                <p class="tournament-card-footer-text">2 Left to join</p>
                <button is="c-button" class="tournament-card-join-btn btn-primary">Join</button>
            `;
            break;
            case 'waiting':
            footerContent = /*html*/`
                <p class="tournament-card-footer-text">Waiting for organizer to start</p>
            `;
            break;
            case 'start':
            footerContent = /*html*/`
                <p class="tournament-card-footer-text">Starting in 5 minutes</p>
            `;
            break;
            case 'inProgress':
            footerContent = /*html*/`
                <p class="tournament-card-footer-text">In progress</p>
            `;
            break;
            case 'ended':
            footerContent = /*html*/`
                <p class="tournament-card-footer-text">Ended</p>
            `;
            break;
            default:
            footerContent = '';
            break;
        }

        return footerContent;
    }
}