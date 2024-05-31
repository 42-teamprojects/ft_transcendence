import { config } from "../../config.js";
import { userState } from "../../state/userState.js";
import { formatDate } from "../../utils/utils.js";

export default class Profile extends HTMLElement {
    constructor() {
        super();
        this.user = userState.state.user;
        document.title = `${this.user.username} | Blitzpong.`;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        const avatar = this.user.avatar ? config.backend_domain + this.user.avatar : `https://api.dicebear.com/8.x/thumbs/svg?seed=${this.user.username}`;
        this.innerHTML = /*html*/`
        <c-upload-avatar-modal></c-upload-avatar-modal>
        <div class="dashboard-content">
            <main>
                <section class="profile-info">
                    <div class="profile-image relative">
                        <img src="${avatar}" alt="profile image">
                        <div class="absolute bg-secondary p-2 rounded-full border-white cursor-pointer w-8 h-8 flex-center" style="top: 10px; right: 10px" onclick="document.querySelector('c-upload-avatar-modal').open()">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <div class="profile-user">
                        <div class="profile-user-names">
                            <h2>${this.user.full_name}</h2>
                            <h3>@${this.user.username}</h3>
                        </div>
                        <p>Joined ${formatDate(this.user?.date_joined)}</p>
                        <div class="profile-user-actions">
                            <a is="c-link" href="/dashboard/settings" class="text-secondary font-bold uppercase text-sm spacing-1">Edit Profile</a>
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
    }
}

customElements.define('p-profile', Profile);