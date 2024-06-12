import { UserStatus } from "../../entities/enums.js";
import { config } from "../../config.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { friendState } from "../../state/friendState.js";
import { userState } from "../../state/userState.js";
import { formatDate } from "../../utils/utils.js";
import Toast from "../comps/toast.js";
import { notificationState } from "../../state/notificationState.js";

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
    this.matchHistory = []
		if (this.user.username !== this.username) {
			this.innerHTML = /*html*/ `<c-loader></c-loader>`;
			const searchedUser = await userState.fetchUser(this.username);
			if (!searchedUser) {
				Toast.notify({ message: "User not found", type: "warning" });
				Router.instance.navigate("/dashboard/profile");
				return;
			}
			this.user = searchedUser;
			this.matchHistory = await userState.getUserMatchesHistory(this.user.id);
			this.isMine = false;
		}
		if (this.isMine) {
			this.innerHTML = /*html*/ `<c-loader></c-loader>`;
			await userState.fetchMe();
			this.user = userState.state.user;
			this.matchHistory = await userState.getMyMatchesHistory();
			this.isMine = true;
		}

		this.matchElements = this.matchHistory
			.map(
				(match) =>
					/*html*/ `<c-match-history me="${match.player1.username}" my-avatar=${match.player1.avatar} them="${
						match.player2.username
					}" their-avatar=${match.player2.avatar} my-score="${match.score1}" their-score="${
						match.score2
					}" tooltip="${formatDate(match.created_at)}" flow="right"></c-match-history>`
			)
			.join("");

		this.render();

		this.modal = document.querySelector("c-modal");

		this.unsubscribe = userState.subscribe(() => {
			this.user = userState.state.user;
			if (this.user) this.render();
			return;
		});
		this.unsubscribeFriends = friendState.subscribe(() => {
			this.getActions();
			this.addEventListeners();
		});
		this.unsubscribeNotification = notificationState.subscribe(async () => {
			this.user = await userState.fetchUser(this.username);
			if (!this.user) return;
			this.querySelector(".user-status-wrapper").innerHTML = this.insertUserStatus();
		});
		this.addEventListeners();
	}

	disconnectedCallback() {
		if (this.unsubscribe) this.unsubscribe();
		if (this.unsubscribeFriends) this.unsubscribeFriends();
		if (this.unsubscribeNotification) this.unsubscribeNotification();
	}

	render() {
		const avatar = this.user.avatar
			? config.backend_domain + this.user.avatar
			: `https://api.dicebear.com/8.x/thumbs/svg?seed=${this.user.username}`;
		this.innerHTML = /*html*/ `
        ${this.isMine ? /*html*/ `<c-upload-avatar-modal></c-upload-avatar-modal>` : ""}
        ${!this.isMine ? /*html*/ `<c-modal></c-modal>` : ""} 
        <div class="dashboard-content">
            <main>
                ${!this.isMine ? /*html*/ `<a is="c-link" href="/dashboard/profile" class="text-secondary btn-link"><i class="fa-solid fa-angle-left mr-2"></i> Back to my profile</a>` : "" }
                <section class="profile-info ${!this.isMine ? "mt-8" : ""}">
                    <div class="profile-image relative">
                        <img src="${avatar}" class="profile image object-cover skeleton">
                        ${this.isMine ? /*html*/ `
                        <div class="absolute bg-secondary p-2 rounded-full border-white cursor-pointer w-8 h-8 flex-center" style="top: 10px; right: 10px" onclick="document.querySelector('c-upload-avatar-modal').open()">
                            <i class="fa-solid fa-camera"></i>
                        </div>`: ""}
                    </div>
                    <div class="profile-user">
                        <div class="profile-user-names">
                            <h2>${this.user.full_name}</h2>
                            <h3 class="flex gap-4">
                                @${this.user.username}
                                <div class="user-status-wrapper flex gap-1">
                                    ${this.insertUserStatus()}
                                </div>
                            </h3>
                        </div>
                        <p>Joined ${formatDate(this.user?.date_joined)}</p>
                        <div class="profile-user-actions flex gap-6"></div>
                    </div>
                </section>
                <hr class="divider">
                <section class="profile-stats my-8">
                    <div class="settings-header mb-6">
                        <h2 class="mb-3">Statistics</h2>
                    </div>
                    <div class="statistics">
                        <c-statistics-card icon="<img src='/public/assets/icons/streak.svg'/>" number="${this.user.user_stats.current_win_streak}" text="Current Streak"></c-statistics-card>
                        <c-statistics-card icon="<img src='/public/assets/icons/streaks.svg'/>" number="${this.user.user_stats.longest_win_streak}" text="Longest Streak"></c-statistics-card>
                        <c-statistics-card icon="<i class='fa-solid fa-medal text-2xl text-success'></i>" number="${this.user.user_stats.matches_won}" text="Wins"></c-statistics-card>
                        <c-statistics-card icon="<i class='fa-solid fa-times text-2xl text-danger'></i>" number="${this.user.user_stats.matches_lost}" text="Losses"></c-statistics-card>
                        <c-statistics-card icon="<i class='fa-solid fa-trophy text-2xl text-success'></i>" number="${this.user.user_stats.tournaments_won}" text="Tournaments Won"></c-statistics-card>
                        <c-statistics-card icon="<i class='fa-solid fa-times text-2xl text-danger'></i>" number="${this.user.user_stats.tournaments_played - this.user.user_stats.tournaments_won}" text="Tournaments Lost"></c-statistics-card>
                    </div>
                </section>
                <section class="matches-history my-8">
                    <div class="settings-header mb-6">
                        <h2 class="mb-3">Matches history</h2>
                    </div>
                    <div class="matches flex-col gap-4">
                        ${this.matchElements}
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
		const chatFriend = this.querySelector("#chat-friend");
		if (chatFriend) {
			chatFriend.addEventListener("click", this.handleChatClick.bind(this));
		}

		const addFriend = this.querySelector("#add-friend");
		if (addFriend) {
			addFriend.addEventListener("click", async () => {
				const result = await friendState.addFriend(this.user.id);
				if (result) {
					Toast.notify({
						message: "Friend added successfuly",
						type: "success",
					});
				}
			});
		}
		const removeFriend = this.querySelector("#remove-friend");
		if (removeFriend) {
			this.removeFriendFunc = async () => {
				const result = await friendState.removeFriend(this.user.id);
				if (result) {
					Toast.notify({
						message: "Friend removed successfuly",
						type: "success",
					});
				}
				this.modal.removeEventListener("confirm", this.removeFriendFunc.bind(this));
			};

			removeFriend.addEventListener("click", () => {
				this.modal.addEventListener("confirm", this.removeFriendFunc.bind(this));
				this.modal.addEventListener("cancel", () => {
					// remove the event listener
					this.modal.removeEventListener("confirm", this.removeFriendFunc.bind(this));
				});
				this.modal.open();
			});
		}

		const blockFriend = this.querySelector("#block-friend");
		if (blockFriend) {
			this.blockFriendFunc = async () => {
				this.unsubscribeNotification();
				const result = await friendState.blockFriend(this.user.id);
				if (result) {
					Router.instance.navigate("/dashboard/profile");
					Toast.notify({
						message: "User blocked successfuly",
						type: "success",
					});
					this.modal.removeEventListener("confirm", this.removeFriendFunc.bind(this));
				}
			};

			blockFriend.addEventListener("click", () => {
				this.modal.addEventListener("confirm", this.blockFriendFunc.bind(this));
				this.modal.addEventListener("cancel", () => {
					this.modal.removeEventListener("confirm", this.blockFriendFunc.bind(this));
				});
				this.modal.open();
			});
		}
	}

	getActions() {
		const actions = this.querySelector(".profile-user-actions");
		if (!actions) return;
		actions.innerHTML = /*html*/ `
        ${this.isMine? /*html*/ `<a is="c-link" href="/dashboard/settings" class="text-secondary btn-link">Edit Profile</a>`: ""}
        ${!this.isMine && !friendState.alreadyFriends(this.user?.id) ? /*html*/ `<p id="add-friend" href="" class="text-secondary btn-link"><i class="fa-solid fa-plus mr-2"></i>Add friend</p>`: "" }
        ${!this.isMine ? /*html*/ `<p id="chat-friend" class="cursor-pointer text-secondary btn-link"><i class="fa-regular fa-comment mr-2"></i>Chat</p>` : "" }
        ${!this.isMine && friendState.alreadyFriends(this.user?.id) ? /*html*/ `<p id="remove-friend" href="" class="text-warning btn-link"><i class="fa-solid fa-minus mr-2"></i>Remove friend</p>` : "" }
        ${!this.isMine && friendState.alreadyFriends(this.user?.id) ? /*html*/ `<p id="block-friend" href="" class="text-danger btn-link"><i class="fa-solid fa-ban mr-2"></i>Block</p>` : "" }
        `;
	}

	async handleChatClick() {
		await chatState.getChats();
		// Check if the chat already exists
		const chat = chatState.state.chats.find((c) => c.friend.id === this.user.id);
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

	insertUserStatus() {
		if (this.isMine) this.user.status = "ON";
		return /*html*/ `
        <div class="user-status w-2 h-2 bg-${this.user.status === "OF" ? "default" : "success"} rounded-full" style="bottom: 10px; right: 30px"></div>
        <p class="text-md text-stroke">${UserStatus[this.user.status]}</p>
        `;
	}
}

customElements.define("p-profile", Profile);
