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
                this.details = /*html*/`<h3>${this.username}</h3><p class="text-stroke mt-2">Has sent you a message</p>`
                this.actions = /*html*/`<p class="btn-link text-secondary">View</p>`
                break;
            case 'TRN':
                this.icon = /*html*/`<div class="bg-warning w-12 h-12"><i class="fa-solid fa-trophy"></i></div>`
                this.details = /*html*/`<h3>Tournament</h3><p class="text-stroke mt-2">${this.tournamentDetail}</p>`
                this.actions = /*html*/`<p class="btn-link text-secondary">View</p>`
                break;
            case 'PRQ':
                this.icon = /*html*/`<div class="bg-primary w-12 h-12"><i class="fa-solid fa-gamepad"></i></div>`
                this.details = /*html*/`<h3>Play Request</h3><p class="text-stroke mt-2">You have a new play request from ${this.playRequestUser}</p>`
                this.actions = /*html*/`<p class="btn-link text-secondary">Accept</p> <p class="btn-link text-danger">Reject</p>`
                break;
            case 'FAL':
                this.icon = /*html*/`<img src="${this.userAvatar}" class="player-avatar" alt="" />`
                this.details = /*html*/`<h3>${this.username}</h3><p class="text-stroke mt-2">Has added you as a friend</p>`
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
            <div class="notification-details ">
                ${this.details}
            </div>
            </div>
            <div class="notification-actions flex gap-3">
                ${this.actions}
            </div>
        </div>
        `;
    }
}

