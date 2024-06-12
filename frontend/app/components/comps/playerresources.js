import { notificationState } from "../../state/notificationState.js";
import { userState } from "../../state/userState.js";

export default class Playerresources extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = userState.subscribe(() => {
            if (!userState.state.user) return;
            this.querySelector(".streak-count").textContent = userState.state.user.user_stats.current_win_streak;
        });
        this.unsub = notificationState.subscribe(() => {
            this.querySelector(".notifications-count").textContent = notificationState.state.notifications.filter(n => !n.read).length;
        });
    }

    disconnectedCallback() {
        this.unsubscribe();
        this.unsub();
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center gap-12">
            <div class="dropdown-wrapper">
                <div class="dropdown-button">
                    <div class="flex-center gap-2 resource-count text-xs font-medium text-secondary">
                        <i class="fa-solid fa-bell text-3xl"></i>
                        <h3 class="notifications-count">${notificationState.state.notifications.filter(n => !n.read).length}</h3>
                    </div>
                </div>
                <c-notification-dropdown></c-notification-dropdown>
            </div>
            <div class="flex-center gap-2 resource-count text-xs font-medium text-highlight" tooltip="Current streak" flow="down">
                <img src="/public/assets/icons/streak.svg" alt="streak"/>
                <h3 class="streak-count">${userState.state.user.user_stats.current_win_streak}</h3>
            </div>
            </div>
        `;
    }
}

