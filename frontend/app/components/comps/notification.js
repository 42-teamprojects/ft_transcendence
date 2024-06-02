export default class Notification extends HTMLElement {
    constructor() {
        super();
        this.type = this.getAttribute('type') || 'default';
        this.username = this.getAttribute('username') || null;
        this.userAvatar = this.getAttribute('user-avatar') || null;
        if ((this.type === 'FAL' && !this.username && !this.userAvatar) || (this.type === 'MSG' && !this.username && !this.userAvatar)) {
            throw new Error('username and user-avatar is required for type FAL and MSG');
        }
        this.tournamentDetail = this.getAttribute('tournament-detail') || null;
        if (this.type === 'TRN' && !this.tournamentDetail) {
            throw new Error('tournament-detail is required for type TRN');
        }
        this.playRequestUser = this.getAttribute('play-request-user') || null;
        if (this.type === 'PRQ' && !this.playRequestUser) {
            throw new Error('play-request-user is required for type PRQ');
        }
    }

    connectedCallback() {
        // "MSG" : "Message",
        // "TRN" : "Tournament",
        // "PRQ" : "Play Request",
        // "FAL" : "Friend Alert",

        switch (this.type) {
            case 'MSG':
                this.icon = /*html*/`<img src="${this.userAvatar}" class="player-avatar" alt="" />`
                this.detailsTitle = this.username
                this.detailsSubtitle = 'Has sent you a message'
                this.actions = /*html*/`<p class="btn-link text-secondary">View</p>`
                break;
            case 'TRN':
                this.icon = /*html*/`<div class="bg-secondary w-10 h-10 flex-col-center rounded-full"><i class="fa-solid fa-trophy"></i></div>`
                this.detailsTitle = 'Tournament'
                this.detailsSubtitle = this.tournamentDetail
                this.actions = /*html*/`<p class="btn-link text-secondary">View</p>`
                break;
            case 'PRQ':
                this.icon = /*html*/`<div class="bg-primary w-10 h-10 flex-col-center rounded-full"><i class="fa-solid fa-gamepad"></i></div>`
                this.detailsTitle = 'Play Request'
                this.detailsSubtitle = `from ${this.playRequestUser}`
                this.actions = /*html*/`<p class="btn-link text-secondary">Accept</p> <p class="btn-link text-danger">Reject</p>`
                break;
            case 'FAL':
                this.icon = /*html*/`<img src="${this.userAvatar}" class="player-avatar" alt="" />`
                this.detailsTitle = this.username
                this.detailsSubtitle = 'Has added you as a friend'
                this.actions = /*html*/`<p class="btn-link text-secondary">View</p>`
                break;
            default:
                throw new Error('Invalid notification type');
                break;
        }

        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="notification flex justify-between py-5">
            <div class="flex gap-4">
            <div class="notification-icon">
                ${this.icon} 
            </div>
            <div class="notification-details flex-col gap-2">
                <h3>${this.detailsTitle}</h3>
                <p class="text-stroke">${this.detailsSubtitle}</p>
            </div>
            </div>
            <div class="notification-actions flex gap-3">
                ${this.actions}
            </div>
        </div>
        `;
    }
}

