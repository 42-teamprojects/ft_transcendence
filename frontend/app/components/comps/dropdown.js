import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { notificationState } from "../../state/notificationState.js";
import { userState } from "../../state/userState.js";

export default class Dropdown extends HTMLElement {
	constructor() {
		super();
		this.httpClient = HttpClient.instance;
	}

	connectedCallback() {
		// Get the user id and username from the user card
		const userCard = this.parentElement.parentElement;
		this.userId = userCard.getAttribute("user-id");
		this.username = userCard.getAttribute("username");
		
		this.render();
		this.dropdownContent = this.querySelector(".dropdown-content");
		this.dropdownButton = this.parentElement.querySelector(".dropdown-button");

		this.addEventListeners();

		this.dropdownChat = this.querySelector("#dropdown-chat");

		this.dropdownChat.addEventListener("click", this.handleChatClick.bind(this));

		this.dropdownPlay = this.querySelector("#dropdown-play");

		this.dropdownPlay.addEventListener("click", this.handlePlayClick.bind(this));
	}

	async handleChatClick() {
		// Check if the chat already exists
		const chat = chatState.state.chats.find((c) => c.friend.id === parseInt(this.userId))
		// If the chat exists, navigate to the chat
		if (chat) {
			Router.instance.navigate(`/dashboard/chat/${chat.id}`);
			return;
		}
		// If the chat does not exist, open direct message modal to create a chat
		const searchModal = document.querySelector("c-friends-search-modal");
		const chatModal = document.createElement("c-chat-send-message-modal");
		chatModal.setAttribute("user-id", this.userId);
		chatModal.setAttribute("username", this.username);
		document.body.appendChild(chatModal);
		setTimeout(() => {
			chatModal.open();
			if (searchModal) {
				searchModal.hide();
			}
		}, 100);
	}

	handlePlayClick() {
		const inviteLink = `/online/1v1/private?p1=${userState.state.user.id}&p2=${this.userId}`
		Router.instance.navigate(inviteLink);
		const notification = {
			type: "PRQ",
			data: {
				link: inviteLink,
				sender_name: userState.state.user.username,
				sender_id: userState.state.user.id,
			},
			recipient: +this.userId,
		}
		notificationState.sendNotification(notification);
	}

	addEventListeners() {
		this.dropdownButton.addEventListener("mouseleave", () => {
			this.dropdownContent.classList.remove("show-dropdown");
		});
		this.dropdownButton.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
		});

		this.dropdownContent.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
			this.dropdownButton.classList.add("active");
		});
		this.dropdownContent.addEventListener("mouseleave", () => {
			this.dropdownButton.classList.remove("active");
			this.dropdownContent.classList.remove("show-dropdown");
		});
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
            <div class="dropdown-content">
                <ul class="dropdown__menu">
					<a is="c-link" href="/dashboard/profile?username=${this.username}">
						<li class="dropdown__item">
							<i class="fa-solid fa-user dropdown__icon"></i>
							<span class="dropdown__name">Profile</span>
						</li>
					</a>
				
					<li class="dropdown__item" id="dropdown-chat">
						<i class="fa-solid fa-comment dropdown__icon"></i>
						<span class="dropdown__name">Chat</span>
					</li>

					<li class="dropdown__item" id="dropdown-play">
						<i class="fa-solid fa-gamepad dropdown__icon"></i>
						<span class="dropdown__name">Play</span>
					</li>

                </ul>
            </div>
        `;
	}
}
