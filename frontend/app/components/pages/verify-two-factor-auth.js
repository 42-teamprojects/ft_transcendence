import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class VerifyTwoFactorAuth extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.form = this.querySelector("form");
		this.input = this.form.querySelector("input");
		this.verify = this.querySelector("#verify");
		this.input.addEventListener("keyup", this.handleChange.bind(this));
		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	handleChange(e) {
		const code = e.target.value;
		if (code.length === 6) {
			this.verify.disabled = false;
		} else {
			this.verify.disabled = true;
		}
	}

	async handleSubmit(e) {
		e.preventDefault();
		const code = this.input.value;
		if (code.length !== 6) {
			Toast.notify({ type: "error", message: "Please enter a valid OTP" });
			return;
		}
		try {
            this.verify.setAttribute("processing", "true");
			await Authentication.instance.verifyTwoFactorAuth(code);
            this.verify.setAttribute("processing", "false");
            Router.instance.navigate("/dashboard/home");
		} catch (error) {
            this.verify.setAttribute("processing", "false");
            Toast.notify({ type: "error", message: error.detail })
		}
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Two-Factor Authentication</h1>
            <img src="/public/assets/icons/lock.svg" alt="Lock">
            <p>Enter a 6-digit code from your authenticator device</p>
            <form method="post">
                <input type="text" name="otp" class="input-field" placeholder="One-Time Password" maxlength="6" />
            <button is="c-button" id="verify" class="btn-secondary" disabled>Verify</button>
            </form>
            <p>Have problems? <a is="c-link" href="/"> Request Reset</a>.</p>
        </div>
        `;
	}
}

customElements.define("p-verify-two-factor-auth", VerifyTwoFactorAuth);
