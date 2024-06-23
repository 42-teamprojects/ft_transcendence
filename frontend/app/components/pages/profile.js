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
		this.isMine = userState.state.user.username === this.username;
		this.innerHTML = /*html*/ `<c-loader></c-loader>`;
		await this.fetchUserData();
		this.render();
		this.modal = document.querySelector("c-modal");
		this.setupSubscriptions();
		this.addEventListeners();
	}

	async fetchUserData() {
		if (this.isMine) {
			await userState.fetchMe();
			this.user = userState.state.user;
			this.matchHistory = await userState.getMyMatchesHistory();
		} else {
			this.user = await userState.fetchUser(this.username);
			if (!this.user) {
				Toast.notify({ message: "User not found", type: "warning" });
				Router.instance.navigate("/dashboard/profile");
				return;
			}
			this.matchHistory = await userState.getUserMatchesHistory(this.user.id);
		}
	}

	disconnectedCallback() {
		if (this.unsubscribe) this.unsubscribe();
		if (this.unsubscribeFriends) this.unsubscribeFriends();
		if (this.unsubscribeNotification) this.unsubscribeNotification();
	}

	render() {
		this.innerHTML = /*html*/ `
			${this.isMine ? `<c-upload-avatar-modal></c-upload-avatar-modal>` : ""}
			<c-modal></c-modal>
			<div class="dashboard-content">
				<main id="profile-content">
					${this.getProfileData()}
				</main>
				<div class="widgets flex-col-center gap-5">
					<c-playerresources></c-playerresources>
					<c-friendscard></c-friendscard>
				</div>
			</div>
		`;
	}

	getProfileData() {
		const avatar = this.user.avatar
			? config.backend_domain + this.user.avatar
			: `https://api.dicebear.com/8.x/thumbs/svg?seed=${this.user.username}`;
		return /*html*/`
		${!this.isMine ? `<a is="c-link" href="/dashboard/profile" class="text-secondary btn-link"><i class="fa-solid fa-angle-left mr-2"></i> Back to my profile</a>` : "" }
		${this.renderProfileInfo(avatar)}
		<hr class="divider">
		${this.renderProfileStats()}
		${this.renderMatchesHistory()}
		`
	}

	renderProfileInfo(avatar) {
		return /*html*/ `
			<section class="profile-info ${!this.isMine ? "mt-8" : ""}">
				<div class="profile-image relative">
					<img src="${avatar}" class="profile image object-cover skeleton">
					${this.isMine ? `<div class="absolute bg-secondary p-2 rounded-full border-white cursor-pointer w-8 h-8 flex-center" style="top: 10px; right: 10px" onclick="document.querySelector('c-upload-avatar-modal').open()"><i class="fa-solid fa-camera"></i></div>`: ""}
				</div>
				<div class="profile-user">
					<div class="profile-user-names">
						<h2>${this.user.full_name}</h2>
						<h3 class="flex gap-4">@${this.user.username}
							<div class="user-status-wrapper flex gap-1">${this.insertUserStatus()}</div>
						</h3>
					</div>
					<p>Joined ${formatDate(this.user?.date_joined)}</p>
					<div class="profile-user-actions flex gap-6">${this.getActions()}</div>
				</div>
			</section>
		`;
	}

	renderProfileStats() {
		const stats = this.user.user_stats;
		return /*html*/ `
			<section class="profile-stats my-8">
				<div class="settings-header mb-6">
					<h2 class="mb-3">Statistics</h2>
				</div>
				<div class="statistics">
					<c-statistics-card icon="<img src='/public/assets/icons/streak.svg'/>" number="${stats.current_win_streak}" text="Current Streak"></c-statistics-card>
					<c-statistics-card icon="<img src='/public/assets/icons/streaks.svg'/>" number="${stats.longest_win_streak}" text="Longest Streak"></c-statistics-card>
					<c-statistics-card icon="<i class='fa-solid fa-medal text-2xl text-success'></i>" number="${stats.matches_won}" text="Wins"></c-statistics-card>
					<c-statistics-card icon="<i class='fa-solid fa-times text-2xl text-danger'></i>" number="${stats.matches_lost}" text="Losses"></c-statistics-card>
					<c-statistics-card icon="<i class='fa-solid fa-trophy text-2xl text-success'></i>" number="${stats.tournaments_won}" text="Tournaments Won"></c-statistics-card>
					<c-statistics-card icon="<i class='fa-solid fa-times text-2xl text-danger'></i>" number="${stats.tournaments_played - stats.tournaments_won}" text="Tournaments Lost"></c-statistics-card>
				</div>
			</section>
		`;
	}

	renderMatchesHistory() {
		const matches = this.matchHistory.map((match) => {
			const me = [match.player1, match.player2].find(p => p.id === this.user.id);
			const them = [match.player1, match.player2].find(p => p.id !== this.user.id);
			const myScore = match.player1.id === this.user.id ? match.score1 : match.score2;
			const theirScore = match.player1.id !== this.user.id ? match.score1 : match.score2;
			if (me && them) {
				return /*html*/ `<c-match-history me="${me.username}" my-avatar=${me.avatar} them="${them.username}" their-avatar=${them.avatar} my-score="${myScore}" their-score="${theirScore}" tooltip="${formatDate(match.created_at)}" flow="right"></c-match-history>`;
			}
		}).join("");
		return /*html*/ `
			<section class="matches-history my-8">
				<div class="settings-header mb-6">
					<h2 class="mb-3">Matches history</h2>
				</div>
				<div class="matches flex-col gap-4">
					${matches}
				</div>
			</section>
		`;
	}

	addEventListeners() {
		this.addActionEventListeners("chat-friend", this.handleChatClick.bind(this));
		this.addActionEventListeners("add-friend", async () => {
			if (await friendState.addFriend(this.user.id)) {
				Toast.notify({ message: "Friend added successfully", type: "success" });
			}
		});
		this.addActionEventListeners("remove-friend", () => this.handleFriendAction(friendState.removeFriend.bind(friendState)));
		this.addActionEventListeners("block-friend", () => this.handleFriendAction(friendState.blockFriend.bind(friendState)));
	}

	addActionEventListeners(actionId, handler) {
		const actionElement = this.querySelector(`#${actionId}`);
		if (actionElement) actionElement.addEventListener("click", handler);
	}

	async handleFriendAction(action) {
		this.actionFunc = async () => {
			if (await action(this.user.id)) {
				Toast.notify({ message: "Action successful", type: "success" });
				this.modal.removeEventListener("confirm", this.actionFunc.bind(this));
				Router.instance.navigate("/dashboard/profile");
			}
		}
		this.modal.addEventListener("confirm", this.actionFunc.bind(this));
		
		this.modal.addEventListener("cancel", () => {
			this.modal.addEventListener("confirm", this.actionFunc.bind(this));
		});
		this.modal.open();
	}

	setupSubscriptions() {
		this.unsubscribe = userState.subscribe(() => {
			this.user = userState.state.user;
			if (this.user) {
				this.querySelector("#profile-content").innerHTML = this.getProfileData();
			}
		});
		this.unsubscribeFriends = friendState.subscribe(() => {
			if (this.querySelector(".profile-user-actions")) {
				this.querySelector(".profile-user-actions").innerHTML = this.getActions();
			}
			this.addEventListeners();
		});
		this.unsubscribeNotification = notificationState.subscribe(async () => {
			this.user = await userState.fetchUser(this.username);
			if (this.user) {
				this.querySelector(".user-status-wrapper").innerHTML = this.insertUserStatus();
			}
		});
	}

	getActions() {
		return /*html*/ `
			${this.isMine ? `<a is="c-link" href="/dashboard/settings" class="text-secondary btn-link">Edit Profile</a>` : ""}
			${!this.isMine && !friendState.alreadyFriends(this.user?.id) ? `<p id="add-friend" class="text-secondary btn-link"><i class="fa-solid fa-plus mr-2"></i>Add friend</p>` : "" }
			${!this.isMine ? `<p id="chat-friend" class="cursor-pointer text-secondary btn-link"><i class="fa-regular fa-comment mr-2"></i>Chat</p>` : "" }
			${!this.isMine && friendState.alreadyFriends(this.user?.id) ? `<p id="remove-friend" class="text-warning btn-link"><i class="fa-solid fa-minus mr-2"></i>Remove friend</p>` : "" }
			${!this.isMine && friendState.alreadyFriends(this.user?.id) ? `<p id="block-friend" class="text-danger btn-link"><i class="fa-solid fa-ban mr-2"></i>Block</p>` : "" }
		`;
	}

	async handleChatClick() {
		await chatState.getChats();
		const chat = chatState.state.chats.find((c) => c.friend.id === this.user.id);
		if (chat) {
			Router.instance.navigate(`/dashboard/chat/${chat.id}`);
		} else {
			const chatModal = document.createElement("c-chat-send-message-modal");
			chatModal.setAttribute("user-id", this.user.id);
			chatModal.setAttribute("username", this.user.username);
			document.body.appendChild(chatModal);
			setTimeout(() => {
				chatModal.open();
			}, 100);
		}
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
