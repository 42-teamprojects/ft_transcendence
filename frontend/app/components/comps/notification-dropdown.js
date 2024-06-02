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

		this.addEventListeners();
	}

	addEventListeners() {
		// this.dropdownButton.addEventListener("mouseleave", () => {
		// 	this.dropdownContent.classList.remove("show-dropdown");
		// });
		this.dropdownButton.addEventListener("mouseover", async () => {
			console.log(notificationState.state.notifications);
			await notificationState.getNotifications();
			notificationState.markAllAsRead();
			console.log(notificationState.state.notifications);
			this.instertNotifications();
			this.dropdownContent.classList.add("show-dropdown");
		});

		this.dropdownContent.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
		});
		this.dropdownContent.addEventListener("mouseleave", () => {
            setTimeout(() => {
                this.dropdownContent.classList.remove("show-dropdown");
            }, 500);
		});
	}

	disconnectedCallback() {}

	render() {

		this.innerHTML = /*html*/ `
            <div class="dropdown-content dropdown-notifications">
                <div class="dropdown__menu">
                    <div class="notification__header">
                        <h2>Notifications</h2>
                    </div>
                    <div class="notification__list flex-col" style="margin-top: -1rem">
                    </div> 
                    <div class="notification__footer flex-center">
                        <p class="btn-link text-primary">View all</p>
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
					<p>No new notifications</p>
				</div>
			`;
			return;
		}
		const notifications = unreadNotifications.slice(0, 4).map((notification) => {
			if (notification.type === "MSG") {
				return /*html*/ `
					<c-notification type="MSG" username="${notification.data.sender_name}" user-avatar="${config.backend_domain}${notification.data.sender_avatar}"></c-notification>
				`;
			} else if (notification.type === "TRN") {
				return /*html*/ `
					<c-notification type="TRN" tournament-detail="${notification.data.tournament_detail}"></c-notification>
				`;
			} else if (notification.type === "PRQ") {
				return /*html*/ `
					<c-notification type="PRQ" play-request-user="${notification.data.sender_name}"></c-notification>
				`;
			} else if (notification.type === "FAL") {
				return /*html*/ `
					<c-notification type="FAL" username="${notification.data.sender_name}" user-avatar="${config.backend_domain}${notification.data.sender_avatar}"></c-notification>
				`;
			}
		});
		notificationList.innerHTML = notifications.join("");
	}
}
