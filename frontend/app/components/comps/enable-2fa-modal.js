import Authentication from "../../auth/authentication.js";
import { config } from "../../config.js";
import { userState } from "../../state/userState.js";
import Toast from "./toast.js";

export default class Enable2famodal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
		this.authentication = Authentication.instance;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("opened")) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}
	}

	static get observedAttributes() {
		return ["opened"];
	}

	async open() {
		await this.init();
		setTimeout(() => {
			this.setAttribute("opened", "");
			this.isOpen = true;
		}, 100);
	}

	hide() {
		if (this.hasAttribute("opened")) {
			this.removeAttribute("opened");
		}
		this.isOpen = false;
	}

	#cancel(event) {
		this.hide();
		const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
		event.target.dispatchEvent(cancelEvent);
	}

	async #confirm() {
		const otp = this.otpInput.value;
		if (otp.length !== 6) {
			Toast.notify({ type: "error", message: "Invalid OTP" });
			return;
		}
		const response = await this.enable2fa(otp);
		if (!response) {
			return;
		}
		this.hide();
		const confirmEvent = new Event("confirm", { bubbles: true, composed: true });
		this.dispatchEvent(confirmEvent);
	}

	async init() {
		this.secret = await this.get2faSecret();
		this.render();
		this.backdrop = this.querySelector("#backdrop");
		this.cancelButton = this.querySelector("#cancel-btn");
		this.confirmButton = this.querySelector("#confirm-btn");
		this.secretKey = this.querySelector(".secret-key");
		this.otpInput = this.querySelector("input");

		this.secretKey.addEventListener("click", () => {
			navigator.clipboard.writeText(this.secret.secret_key);
			Toast.notify({ type: "success", message: "Secret key copied" });
		});
		this.backdrop.addEventListener("click", this.#cancel.bind(this));
		this.cancelButton.addEventListener("click", this.#cancel.bind(this));
		this.confirmButton.addEventListener("click", this.#confirm.bind(this));
	}

	render() {
		this.innerHTML = /*html*/ `
            <div id="backdrop"></div>
            <div class="modal" class="flex-center">
                <header class="text-center mb-2">
                    <h1 id="title" class="text-2xl font-bold mb-2">Enable Two-factor authentication</h1>
                    <h2 id="subtitle" class="text-lg font-normal text-stroke">Add an extra layer of security</h2>
                </header>
                <main class="flex-col-center gap-6 mb-4">
                    <img src="${config.backend_domain}${this.secret.qr_code}" alt="QR code" width="180" height="180" class="rounded-xl"/>
                    <div class="flex align-start gap-3">
                        <span class="bg-secondary px-3 py-2 rounded-full">1</span>
                        <div>
                            <p class="line-3 mb-2">Scan the QR code using any authentication app on your phone (e.g. Google Authenticator, Okta...) or enter the following code:</p>
                            <p class="secret-key font-bold cursor-pointer" tooltip="Click to copy" flow="up">${this.secret.secret_key}</p>
                        </div>
                    </div>
                    <div class="flex align-start gap-3">
                        <span class="bg-secondary px-3 py-2 rounded-full">2</span>
                        <div>
                            <p class="line-3 mb-3">Enter the 6 figure confirmation code shown on the app:</p>
                            <input type="text" class="input-field" placeholder="Enter OTP"/>
                        </div>
                    </div>
                </main>
                <section class="actions">
                    <button is="c-button" id="cancel-btn" class="btn-default text-secondary w-full">Cancel</button>
                    <button id="confirm-btn" class="btn-secondary w-full">Verify</button>
                </section>
            </div>
        `;
	}

	async get2faSecret() {
		try {
			const secret = await this.authentication.getTwoFactorAuthSecret();
			return secret;
		} catch (error) {
			console.error(error);
			Toast.notify({ type: "error", message: "Failed to get 2FA secret" });
		}
	}

	async enable2fa(otp) {
		try {
            const data = {
                otp: otp,
                secret_key: this.secret.secret_key
            }
			const response = await this.authentication.enableTwoFactorAuth(data);
			Toast.notify({ type: "success", message: "2FA enabled" });
			userState.setState({ user: {...userState.state.user, two_factor_enabled: true}});
			return response;
		} catch (error) {
			Toast.notify({ type: "error", message: error.detail });
		}
	}
}
