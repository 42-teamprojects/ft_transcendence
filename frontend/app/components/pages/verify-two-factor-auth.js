import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { handleFormSubmitApi } from "../../utils/utils.js";
import { validateCode } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class VerifyTwoFactorAuth extends HTMLElement {
	constructor() {
		super();
        this.classList.add('full-page');

	}

	connectedCallback() {
        this.render();

        this.form = this.querySelector('form');

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
		e.preventDefault();

		await handleFormSubmitApi(
			this.form,
			Authentication.instance.verifyTwoFactorAuth.bind(Authentication.instance),
			(data) => validateCode(data['otp']),
			() => {
				Router.instance.navigate("/dashboard/home");
			}
		);
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Two-Factor Authentication</h1>
            <img src="/public/assets/icons/lock.svg" alt="Lock">
            <p>Enter a 6-digit code from your authenticator device</p>
            <form method="post">
				<div class="form-group">
    	            <input type="text" name="otp" class="input-field" placeholder="One-Time Password" maxlength="6" />
				</div>
				<button is="c-button" type="submit" class="btn-secondary">Verify</button>
            </form>
            <p>Have problems? <a is="c-link" href="/reset-2fa"> Request Reset</a>.</p>
        </div>
        `;
	}
}

customElements.define("p-verify-two-factor-auth", VerifyTwoFactorAuth);
