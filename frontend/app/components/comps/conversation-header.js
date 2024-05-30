import { UserStatus } from "../../entities/UserStatus.js";
export default class Conversationheader extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "null";
        this.usernameAtt = this.getAttribute("username") || "null";
        this.stateAtt = this.getAttribute("state") || "null";

    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="chat-header conversation-header">
            <div class="flex-center gap-4">
                <img class="message-card__img" src="${this.imgAtt}" alt="user">
                <div class="flex-col gap-2">
                    <div class="conversation-header__username" >${this.usernameAtt}</div>
                    <div class="conversation-header__status gap-2">
                        <div class="conversation-header__status__dot ${UserStatus[this.stateAtt].toLowerCase()}"></div>
                        <div class="conversation-header__status__text capitalize">${UserStatus[this.stateAtt]}</div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button is="c-button" class="btn-secondary gap-3">
                    <i class="fa-solid fa-gamepad text-xl"></i>
                    play
                </button>
                <button is="c-button" class="btn-primary w-0">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div> 
        </div>
        `;
    }
}

