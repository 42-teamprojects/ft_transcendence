import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";

export default class Dropdown extends HTMLElement {
	constructor() {
		super();
		this.httpClient = HttpClient.instance;
	}

	connectedCallback() {
		this.render();
		this.dropdownContent = this.querySelector(".dropdown-content");
		this.dropdownButton = this.parentElement.querySelector(".dropdown-button");

		this.addEventListeners();

		this.dropdownChat = this.querySelector("#dropdown-chat");

		this.dropdownChat.addEventListener("click", this.handleChatClick.bind(this));
	}

	async handleChatClick() {
		// Get the user id and username from the user card
		const userCard = this.parentElement.parentElement;
		const userId = userCard.getAttribute("user-id");
		const username = userCard.getAttribute("username");

		// Check if the chat already exists
		const chat = chatState.state.chats.find((c) => c.friend.id === parseInt(userId))
		// If the chat exists, navigate to the chat
		if (chat) {
			Router.instance.navigate(`/dashboard/chat/${chat.id}`);
			return;
		}
		// If the chat does not exist, open direct message modal to create a chat
		const searchModal = document.querySelector("c-chat-search-modal");
		const chatModal = document.createElement("c-chat-send-message-modal");
		chatModal.setAttribute("user-id", userId);
		chatModal.setAttribute("username", username);
		document.body.appendChild(chatModal);
		setTimeout(() => {
			chatModal.open();
			if (searchModal) {
				searchModal.hide();
			}
		}, 100);
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
					<li class="dropdown__item" id="dropdown-chat">
						<i class="fa-solid fa-comment dropdown__icon"></i>
						<span class="dropdown__name">Chat</span>
					</li>

					<li class="dropdown__item">
						<i class="fa-solid fa-gamepad dropdown__icon"></i>
						<span class="dropdown__name">Play</span>
					</li>

					<li class="dropdown__item">
						<i class="fa-solid fa-xmark dropdown__icon"></i>
						<span class="dropdown__name">Unfriend</span>
					</li>
                </ul>
            </div>
        `;
	}
}