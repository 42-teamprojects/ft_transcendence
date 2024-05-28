import { userState } from "../../state/userState.js";
import Toast from "../comps/toast.js";

export default class Settingsprivacy extends HTMLElement {
	constructor() {
		super();
		document.title = "Settings | Privacy";
		this.user = userState.getState().user;
	}

	connectedCallback() {
		this.render();

		this.btnEnable2FA = this.querySelector("#enable-2fa");
		this.twoFactorModal = this.querySelector("c-enable-2fa-modal");
		this.btnEnable2FA.addEventListener("click", this.handle2FAEnable.bind(this));
	}

	handle2FAEnable() {
		if (!userState.isVerified()) {
			Toast.notify({ type: "warning", message: "You need to verify your email before enabling 2FA" });
			return;
		} else if (userState.isVerified() && !userState.is2FAEnabled() && this.twoFactorModal) {
			this.twoFactorModal.open();
		} else {
			Toast.notify({ type: "warning", message: "2FA is already enabled" });
		}
	}

	disconnectedCallback() {
        this.btnEnable2FA.removeEventListener("click", this.handle2FAEnable.bind(this));
    }

	render() {

        const changePasswordSection = /*html*/ `
        <section class="change-password">
            <div class="settings-header mb-9">
                <h2 class="mb-3">Change password</h2>
                <h4 class="font-normal text-stroke line-3">Must be at least 8 characters, include both lower and upper case <br /> letters and numbers</h4>
            </div>
            <c-change-password-form></c-change-password-form>
        </section>
        `

		this.innerHTML = /*html*/ `
        ${userState.isVerified() && !userState.is2FAEnabled() ? `<c-enable-2fa-modal></c-enable-2fa-modal>` : ""}
        <div class="dashboard-content">
            <main class="flex-col gap-16 mb-12">
                <div class="settings-header">
                    <h1 class="mb-3">Settings</h1>
                    <h3 class="font-normal text-stroke">Privacy, Password, 2FA...</h3>
                </div>
                ${!userState.isProvider() ? changePasswordSection : ""}
                <section class="two-factor-auth">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Two-factor authentication</h2>
                        <h4 class="font-normal text-stroke line-3">Enabling 2FA requires an OTP code for each login</h4>
                    </div>
                    <div class="enable-two-factor flex-center justify-between">
                        <div>
                            <h3 class="font-normal mb-4">Secure your account</h3>
                            <p class="text-stroke">Enable 2FA to add an extra layer of security</p>
                        </div>
                        <button id="enable-2fa" class="btn-secondary">Enable 2FA</button>
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

customElements.define("p-settings-privacy", Settingsprivacy);
