import Authentication from "../../auth/authentication.js";
import AuthGuard from "../../guards/authGuard.js";
import Router from "../../router/router.js";
import { useFormData } from "../../utils/useForm.js";
import { handleInputError, removeErrors } from "../../utils/utils.js";
import { validateRegister } from "../../utils/validations.js";
import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";


export default class EmailVerification extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form");
        this.input = this.form.querySelector("input");
        this.verify = this.querySelector("#verify");
        this.verify.addEventListener("click", this.handleSubmit.bind(this));
        this.input.addEventListener("input", this.handleChange.bind(this));
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
		try {
            this.verify.setAttribute("processing", "true");
			await Authentication.instance.verifyEmail({
                otp: code,
			});
            this.verify.setAttribute("processing", "false");
            Router.instance.navigate("/dashboard/home");
		} catch (error) {
            this.verify.setAttribute("processing", "false");
            Toast.notify({ type: "error", message: error.detail })
		}

      
    }
    
    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Email Verification</h1>
            <img src="/public/assets/icons/ok.svg" alt="email verification">
            <p>Enter the 6-digit code sent to your email</p>
            <form method="post">
            <div class="form-group">
                <input type="text" name="code" class="input-field" placeholder="Verification code" maxlength="6" />
                <p>Didn't get the email? <a is="c-link" href=""> Resend</a>.</p>
            </div>
            <button is="c-button" id="verify" class="btn-secondary" disabled>Verify</button>
            </form>
            <p>Too lazy to verify it? <a is="c-link" href="/dashboard/home"> Do it later</a>.</p>
        </div>
        `;
    }
}

customElements.define('p-email-verification', EmailVerification);