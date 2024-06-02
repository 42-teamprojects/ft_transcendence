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
			if (!notificationState.state.notifications.length){
				await notificationState.getNotifications();
				console.log("fetching notifications");
			}
			notificationState.markAllAsRead();
			console.log(notificationState.state.notifications);
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
                       <c-notification type="MSG" username="Yusuf" user-avatar="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef"></c-notification>
                       <c-notification type="TRN" tournament-detail="Tournament is starting soon"></c-notification>
                       <c-notification type="PRQ" play-request-user="Yusuf"></c-notification>
                       <c-notification type="MSG" username="Yusuf" user-avatar="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef"></c-notification>
                       <c-notification type="FAL" username="Yusuf" user-avatar="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef"></c-notification>
                    </div> 
                    <div class="notification__footer flex-center">
                        <p class="btn-link text-primary">View all</p>
                    </div>
                </div>
            </div>
        `;
	}
}
