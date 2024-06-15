import { config } from "../../config.js";
import { notificationState } from "../../state/notificationState.js";

export default class Notification extends HTMLElement {
    constructor() {
        super();
        this.id = +this.getAttribute('notification-id') || null;
        this.type = this.getAttribute('type') || 'default';
        this.username = this.getAttribute('username') || null;
        this.userAvatar = this.getAttribute('user-avatar') || null;
        this.chatId = this.getAttribute('chat-id') || null;
        if (!this.id) {
            throw new Error('notification-id is required');
        }
        if (this.type === 'MSG' && !this.chatId) {
            throw new Error('chat-id is required for type MSG');
        }
        if ((this.type === 'FAL' && !this.username && !this.userAvatar) || (this.type === 'MSG' && !this.username && !this.userAvatar)) {
            throw new Error('username and user-avatar is required for type FAL and MSG');
        }
        this.tournamentId = this.getAttribute('tournament-id') || null;
        this.tournamentMessage = this.getAttribute('message') || null;
        if (this.type === 'TRN' && !this.tournamentId && !this.tournamentMessage) {
            throw new Error('tournament-id and message is required for type TRN');
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
                this.actions = /*html*/`<a is="c-link" href="/dashboard/chat/${this.chatId}" class="btn-link text-secondary">View</a>`
                break;
            case 'TRN':
                this.icon = /*html*/`<div class="bg-secondary w-10 h-10 flex-col-center rounded-full"><i class="fa-solid fa-trophy"></i></div>`
                this.detailsTitle = 'Tournament'
                this.detailsSubtitle = this.tournamentMessage
                this.actions = /*html*/`<a is="c-link" href="/dashboard/tournaments/qualifications/${this.tournamentId}" class="btn-link text-secondary">View</a>`
                break;
            case 'PRQ':
                this.icon = /*html*/`<div class="bg-primary w-10 h-10 flex-col-center rounded-full"><i class="fa-solid fa-gamepad"></i></div>`
                this.detailsTitle = 'Play Request'
                this.detailsSubtitle = `from ${this.playRequestUser}`
                this.actions = /*html*/`<a is="c-link" class="btn-link text-secondary">Accept</a> <a is="c-link" class="btn-link text-danger">Reject</a>`
                break;
            case 'FAL':
                this.icon = /*html*/`<img src="${this.userAvatar}" class="player-avatar" alt="" />`
                this.detailsTitle = this.username
                this.detailsSubtitle = 'Has added you as a friend'
                this.actions = /*html*/`<a is="c-link" href="/dashboard/profile?username=${this.username}" class="btn-link text-secondary">View</a>`
                break;
            default:
                throw new Error('Invalid notification type');
                break;
        }

        this.render();

        this.querySelector('a').addEventListener('click', async (e) => {
            e.preventDefault();
            await notificationState.markAsRead(+this.id);
        });
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

