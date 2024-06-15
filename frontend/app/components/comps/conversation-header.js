import { config } from "../../config.js";
import { UserStatus } from "../../entities/enums.js";
import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { notificationState } from "../../state/notificationState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";
export default class Conversationheader extends HTMLElement {
    constructor() {
        super();
        this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
    }

    async connectedCallback() {
        this.chat = await chatState.getChat(+this.chatId)
        this.friend = chatState.getFriend(this.chat);
        this.render();

        this.unsubscribe = notificationState.subscribe(async () => {
            this.chat = await chatState.getChat(+this.chatId, true)
            if (!this.chat) return;
            this.friend = chatState.getFriend(this.chat);
            this.querySelector(".conversation-header__status").innerHTML = /*html*/`
                <div class="conversation-header__status__dot ${UserStatus[this.friend.status].toLowerCase()}"></div>
                <div class="conversation-header__status__text capitalize">${UserStatus[this.friend.status]}</div>
            `;
        });

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

        this.inviteFriend = this.querySelector(".invite-friend");

        this.inviteFriend.addEventListener("click", () => {
            const inviteLink = `/online/1v1/private?p1=${userState.state.user.id}&p2=${this.friend.id}`
            Router.instance.navigate(inviteLink);
            const notification = {
				type: "PRQ",
				data: {
					link: inviteLink,
                    sender_name: userState.state.user.username,
                    sender_id: userState.state.user.id,
				},
				recipient: this.friend.id,
			}
			notificationState.sendNotification(notification);
        });
    }

    disconnectedCallback() {
        this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
        <c-modal id="delete-modal"></c-modal>
        <div class="chat-header conversation-header">
            <div class="flex-center gap-4">
                <a is="c-link" href="/dashboard/profile?username=${this.friend.username}" tooltip="View profile" flow="down">
                    <img class="message-card__img" src="${config.backend_domain}${this.friend.avatar}" alt="user">
                </a>
                <div class="flex-col gap-2">
                    <a is="c-link" href="/dashboard/profile?username=${this.friend.username}" tooltip="View profile" flow="right">
                        <div class="conversation-header__username" >${this.friend.username}</div>
                    </a>
                    <div class="conversation-header__status gap-2">
                        <div class="conversation-header__status__dot ${UserStatus[this.friend.status].toLowerCase()}"></div>
                        <div class="conversation-header__status__text capitalize">${UserStatus[this.friend.status]}</div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button is="c-button" class="btn-secondary gap-3 invite-friend">
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

