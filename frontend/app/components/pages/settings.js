import { userState } from "../../state/userState.js";

export default class Settings extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();

		this.unsubscribe = userState.subscribe(() => {
            if (!userState.state.user) return;
			this.render();
		});
    }

    disconnectedCallback() {
		this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
        <c-blocked-list-modal></c-blocked-list-modal>
        <div class="dashboard-content">
            <main class="flex-col gap-16 mb-12">
                <div class="settings-header">
                    <h1 class="mb-2">Settings</h1>
                    <h3 class="font-normal text-stroke">Account, Email, username...</h3>
                </div>
                <section class="change-password">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Your Information</h2>
                        <h4 class="font-normal text-stroke line-3">Update your information</h4>
                    </div>
                    <c-update-user-info-form></c-update-user-in-form>
                </section>
                <section class="blocked-friends">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Blocked</h2>
                    </div>
                    <div class="flex-center justify-between">
                        <div>
                            <h3 class="font-normal mb-4">Blocked list</h3>
                            <p class="text-stroke">View your blocked friends list</p>
                        </div>
                        <button id="blocked-list" class="btn-secondary" onclick="document.querySelector('c-blocked-list-modal').open()">View list</button>
                    </div>
                </section>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-settings-nav></c-settings-nav>
            </div>
        </div>
        `;
    }
}

customElements.define('p-settings', Settings);