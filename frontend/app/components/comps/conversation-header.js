export default class Conversationheader extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.usernameAtt = this.getAttribute("username") || "none";
        this.stateAtt = this.getAttribute("state") || "none";

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
                        <div class="conversation-header__status__dot online"></div>
                        <div class="conversation-header__status__text capitalize">${this.stateAtt}</div>
                    </div>
                </div>
            </div>
            <button is="c-button" class="btn-primary gap-3">
                <i class="fa-solid fa-gamepad text-xl"></i>
                play
            </button>
        </div>
        `;
    }
}

