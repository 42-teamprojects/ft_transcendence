import { config } from "../../config.js";
import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { notificationState } from "../../state/notificationState.js";

export default class Notificationdropdown extends HTMLElement {
	constructor() {
		super();
		this.httpClient = HttpClient.instance;
	}

	connectedCallback() {
		this.render();
		this.dropdownContent = this.querySelector(".dropdown-content");
		this.dropdownButton = this.parentElement.querySelector(".dropdown-button");
		this.unsubscribe = notificationState.subscribe(() => {
			this.instertNotifications();
		});
		this.addEventListeners();
	}

	addEventListeners() {
		this.dropdownButton.addEventListener("mouseover", async () => {
			await notificationState.getNotifications();
			this.instertNotifications();
			this.dropdownContent.classList.add("show-dropdown");
		});
		this.dropdownButton.addEventListener("click", async () => {
			await notificationState.getNotifications();
			this.instertNotifications();
			this.dropdownContent.classList.add("show-dropdown");
		});
		this.dropdownContent.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
		});
		this.querySelector("#cancel-btn").addEventListener("click", async () => {
			this.dropdownContent.classList.remove("show-dropdown");
		});

		this.querySelector(".mark-all-as-read").addEventListener("click", async () => {
			await notificationState.markAllAsRead();
		});
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

	render() {

		this.innerHTML = /*html*/ `
            <div class="dropdown-content dropdown-notifications">
                <div class="dropdown__menu">
                    <div class="notification__header flex justify-between">
                        <h2>Notifications</h2>
						<i id="cancel-btn" class="fa fa-times close-icon text-2xl cursor-pointer hover"></i>
                    </div>
                    <div class="notification__list flex-col" style="margin-top: -1rem">
                    </div> 
                    <div class="notification__footer flex-center">
                        <p class="btn-link text-primary mark-all-as-read">Mark all as read</p>
                    </div>
                </div>
            </div>
        `;
	}

	instertNotifications() {
		const notificationList = this.querySelector(".notification__list");
		notificationList.innerHTML = "";
		const unreadNotifications = notificationState.state.notifications.filter((n) => !n.read);

		if (unreadNotifications.length === 0) {
			notificationList.innerHTML = /*html*/ `
				<div class="notification__item flex-center">
					<p class="text-stroke">No new notifications</p>
				</div>
			`;
			return;
		}
		const notifications = unreadNotifications.slice(0, 4).map((notification) => {
			if (notification.type === "MSG") {
				return /*html*/ `
					<c-notification notification-id="${notification.id}" type="MSG" username="${notification.data.sender_name}" user-avatar="${config.backend_domain}${notification.data.sender_avatar}" chat-id="${notification.data.chat_id}"></c-notification>
				`;
			} else if (notification.type === "TRN") {
				return /*html*/ `
					<c-notification notification-id="${notification.id}" type="TRN" tournament-id="${notification.data.tournament_id}" message="${notification.data.message}"></c-notification>
				`;
			} else if (notification.type === "PRQ") {
				return /*html*/ `
					<c-notification notification-id="${notification.id}" type="PRQ" play-request-user="${notification.data.sender_name}"></c-notification>
				`;
			} else if (notification.type === "FAL") {
				return /*html*/ `
					<c-notification notification-id="${notification.id}" type="FAL" username="${notification.data.sender_name}" user-avatar="${config.backend_domain}${notification.data.sender_avatar}"></c-notification>
				`;
			}
		});
		notificationList.innerHTML = notifications.join("");
	}
}
