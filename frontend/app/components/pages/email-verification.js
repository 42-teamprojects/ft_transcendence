import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { handleFormSubmitApi } from "../../utils/utils.js";
import { validateCode } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class EmailVerification extends HTMLElement {
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
			Authentication.instance.verifyEmail.bind(Authentication.instance),
			(data) => validateCode(data['otp'], 6, "otp"),
			() => {
				Toast.notify({ type: "success", message: "Email verified successfully" });
				Router.instance.navigate("/dashboard/home");
			}
		);
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Email Verification</h1>
            <img src="/public/assets/icons/ok.svg" alt="email verification">
            <p>Enter the 6-digit code sent to your email</p>
            <form method="post">
            <div class="form-group">
                <input type="text" name="otp" class="input-field" placeholder="Verification code" maxlength="6" />
                <p>Didn't get the email? <a is="c-link" href="/resend-verification-email"> Resend</a>.</p>
            </div>
            <button is="c-button" type="submit" class="btn-secondary">Verify</button>
            </form>
            <p>Too lazy to verify it? <a is="c-link" href="/dashboard/home"> Do it later</a>.</p>
        </div>
        `;
	}
}

customElements.define("p-email-verification", EmailVerification);
