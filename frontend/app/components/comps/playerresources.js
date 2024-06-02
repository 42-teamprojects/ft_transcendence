import { userState } from "../../state/userState.js";

export default class Playerresources extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.user = userState.state.user;
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center gap-12">
            <div class="flex-center gap-2 resource-count text-xs font-medium text-secondary">
                <i class="fa-solid fa-bell text-3xl"></i>
                <h3>0</h3>
            </div>
            <div class="flex-center gap-2 resource-count text-xs font-medium text-highlight">
                <img src="/public/assets/icons/streak.svg" alt="streak"/>
                <h3>${this.user.user_stats.current_win_streak}</h3>
            </div>
            </div>
        `;
    }
}

