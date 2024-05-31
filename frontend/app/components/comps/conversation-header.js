import { UserStatus } from "../../entities/UserStatus.js";
import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { getMatchUrl } from "../../utils/utils.js";
export default class Conversationheader extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "null";
        this.usernameAtt = this.getAttribute("username") || "null";
        this.stateAtt = this.getAttribute("state") || "null";
        this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
    }

    connectedCallback() {
        this.render();

        this.deleteModal = this.querySelector("#delete-modal");

        this.deleteModal.addEventListener("confirm", async () => {
            try {
                await HttpClient.instance.delete(`chats/${this.chatId}/`);
                chatState.deleteChat(this.chatId);
                Router.instance.navigate("/dashboard/chat");
            } catch (error) {
                console.error(error);
            }
        })
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <c-modal id="delete-modal"></c-modal>
        <div class="chat-header conversation-header">
            <div class="flex-center gap-4">
                <a is="c-link" href="/dashboard/profile?username=${this.usernameAtt}">
                    <img class="message-card__img" src="${this.imgAtt}" alt="user">
                </a>
                <div class="flex-col gap-2">
                    <a is="c-link" href="/dashboard/profile?username=${this.usernameAtt}">
                        <div class="conversation-header__username" >${this.usernameAtt}</div>
                    </a>
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
                <button is="c-button" class="btn-primary w-0" onclick="document.querySelector('#delete-modal').open()">
                    <i class="fa-regular fa-trash-can text-2xl"></i>
                </button>
            </div> 
        </div>
        `;
    }
}

