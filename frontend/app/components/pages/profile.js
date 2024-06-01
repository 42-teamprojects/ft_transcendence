import { config } from "../../config.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { friendState } from "../../state/friendState.js";
import { userState } from "../../state/userState.js";
import { formatDate } from "../../utils/utils.js";
import Toast from "../comps/toast.js";

export default class Profile extends HTMLElement {
    constructor() {
        super();
        this.search = new URLSearchParams(window.location.search);
        this.username = this.search.get("username") || userState.state.user.username;
        document.title = `${this.username} | Blitzpong.`;
    }

    async connectedCallback() {
        this.user = userState.state.user;
        this.isMine = true;
        if (this.user.username !== this.username) {
            this.innerHTML = /*html*/`<c-loader></c-loader>`;
            const searchedUser = await userState.fetchUser(this.username);
            if (!searchedUser) {
                Toast.notify({message: "User not found", type: "warning"});
                Router.instance.navigate("/dashboard/profile");
                return;
            }
            this.user = searchedUser;
            this.isMine = false;
        }
        this.render();
        this.unsubscribe = userState.subscribe(() => {
            this.user = userState.state.user;
            if (this.user) this.render();
            return;
        });
        this.unsubscribeFriends = friendState.subscribe(() => {
            this.getActions();
            this.addEventListeners();
        });
        this.addEventListeners();
    }

    disconnectedCallback() {
        if (this.unsubscribe) this.unsubscribe();
        if (this.unsubscribeFriends) this.unsubscribeFriends();
    }

    render() {
        const avatar = this.user.avatar ? config.backend_domain + this.user.avatar : `https://api.dicebear.com/8.x/thumbs/svg?seed=${this.user.username}`;
        this.innerHTML = /*html*/`
        ${this.isMine ? /*html*/`<c-upload-avatar-modal></c-upload-avatar-modal>` : ""}
        <div class="dashboard-content">
            <main>
                ${!this.isMine ? /*html*/`<a is="c-link" href="/dashboard/profile" class="text-secondary font-bold uppercase text-sm spacing-1"><i class="fa-solid fa-angle-left mr-2"></i> Back to my profile</a>` : ""}
                <section class="profile-info ${!this.isMine ? 'mt-8' : ''}">
                    <div class="profile-image relative">
                        <img src="${avatar}" class="profile image object-cover skeleton">
                        ${this.isMine ? /*html*/`
                        <div class="absolute bg-secondary p-2 rounded-full border-white cursor-pointer w-8 h-8 flex-center" style="top: 10px; right: 10px" onclick="document.querySelector('c-upload-avatar-modal').open()">
                            <i class="fa-solid fa-camera"></i>
                        </div>` : ""}
                    </div>
                    <div class="profile-user">
                        <div class="profile-user-names">
                            <h2>${this.user.full_name}</h2>
                            <h3>@${this.user.username}</h3>
                        </div>
                        <p>Joined ${formatDate(this.user?.date_joined)}</p>
                        <div class="profile-user-actions flex gap-6">
                        </div>
                    </div>
                </section>
                <hr class="divider">
                <section class="profile-bio">
                    <div class="settings-header mb-6">
                        <h2 class="mb-3">Statistics</h2>
                    </div>
                    <div class="statistics">
                        <c-statistics-card img="/public/assets/icons/camera.svg" number="10" text="Friends"></c-statistics-card>
                        <c-statistics-card img="/public/assets/icons/streak.svg" number="5" text="Streak"></c-statistics-card>
                        <c-statistics-card img="/public/assets/icons/bar9.svg" number="8" text="Wins"></c-statistics-card>
                        <c-statistics-card img="/public/assets/icons/camera.svg" number="3" text="Losses"></c-statistics-card>
                    </div>
                </section>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-friendscard></c-friendscard>
            </div>
        </div>
        `;

        this.getActions();
    }
    
    addEventListeners() {
        const addFriend = this.querySelector("#add-friend");
        if (addFriend) {
            addFriend.addEventListener("click", async () => {
                const result = await friendState.addFriend(this.user.id);
                if (result) {
                    Toast.notify({message: "Friend added successfuly", type: "success"});
                }
            });
        }
        const removeFriend = this.querySelector("#remove-friend");
        if (removeFriend) {
            removeFriend.addEventListener("click", async () => {
                const result = await friendState.removeFriend(this.user.id);
                if (result) {
                    Toast.notify({message: "Friend removed successfuly", type: "success"});
                }
            });
        }
        const chatFriend = this.querySelector("#chat-friend");
        if (chatFriend) {
            chatFriend.addEventListener("click", this.handleChatClick.bind(this));
        }
    }

    async handleChatClick() {
        await chatState.getChats();
		// Check if the chat already exists
		const chat = chatState.state.chats.find((c) => c.friend.id === this.user.id)
		// If the chat exists, navigate to the chat
		if (chat) {
			Router.instance.navigate(`/dashboard/chat/${chat.id}`);
			return;
		}
		// If the chat does not exist, open direct message modal to create a chat
		const searchModal = document.querySelector("c-friends-search-modal");
		const chatModal = document.createElement("c-chat-send-message-modal");
		chatModal.setAttribute("user-id", this.user.id);
		chatModal.setAttribute("username", this.user.username);
		document.body.appendChild(chatModal);
		setTimeout(() => {
			chatModal.open();
			if (searchModal) {
				searchModal.hide();
			}
		}, 100);
	}

    getActions() {
        const actions = this.querySelector(".profile-user-actions");
        if (!actions) return;
        actions.innerHTML = /*html*/`
        ${this.isMine ? /*html*/`<a is="c-link" href="/dashboard/settings" class="text-secondary font-bold uppercase text-sm spacing-1">Edit Profile</a>` : ""}
        ${!this.isMine && !friendState.alreadyFriends(this.user.id) ? /*html*/`<p id="add-friend" href="" class="cursor-pointer text-secondary font-bold uppercase text-sm spacing-1"><i class="fa-solid fa-plus mr-2"></i>Add friend</p>` : ""}
        ${!this.isMine ? /*html*/`<p id="chat-friend" class="cursor-pointer text-secondary font-bold uppercase text-sm spacing-1"><i class="fa-regular fa-comment mr-2"></i>Chat</p>` : ""}
        ${!this.isMine && friendState.alreadyFriends(this.user.id) ? /*html*/`<p id="remove-friend" href="" class="cursor-pointer text-danger font-bold uppercase text-sm spacing-1"><i class="fa-solid fa-minus mr-2"></i>Remove friend</p>` : ""}
        `
    }
}

customElements.define('p-profile', Profile);