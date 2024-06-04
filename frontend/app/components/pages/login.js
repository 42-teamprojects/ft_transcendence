import Authentication from "../../auth/authentication.js";
import { config } from "../../config.js";
import AuthGuard from "../../guards/authGuard.js";
import Router from "../../router/router.js";
import { useFormData } from "../../utils/useForm.js";
import { handleFormSubmitApi, handleInputError, removeErrors } from "../../utils/utils.js";
import { validateRequire } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class Login extends HTMLElement {
	constructor() {
		super();
        this.classList.add('full-page');
		document.title = "Login | Blitzpong.";
	}

	connectedCallback() {
		this.render();

		this.oauthBtns = this.querySelectorAll(".oauth-btn");

		this.oauthBtns.forEach((btn) => {
			btn.addEventListener("click", async (e) => {
				const provider = e.target.id;
				try {
					await Authentication.instance.continueWithOAuth(provider);
				} catch (error) {
					console.error(error);
					Toast.notify({ type: "error", message: "An error occurred, please try again later" });
				}
			});
		});

		this.form = this.querySelector("form");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		const formValidations = (data) => {
			return validateRequire(data, ["username", "password"]);
		};
		
		await handleFormSubmitApi(
			this.form,
			Authentication.instance.login.bind(Authentication.instance),
			formValidations,
			() => {
				Router.instance.navigate("/dashboard/home")
			},
			(errors) => {
				if (errors.status === 423) {
					Router.instance.navigate("/verify-2fa");
					Toast.notify({ type: "info", message: errors.detail });
					return false;
				}
				return true;
			}
		);
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Log in</h1>
            <form>
                <div class="form-group">
                    <input type="text" name="username" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="input-field" placeholder="Password" />
                    <span class="text-xs mr-1 text-right">
                        <a is="c-link" href="/forgot-password">Forgot password?</a>
                    </span>
                </div>
                <button is="c-button" type="submit" id="login" class="btn-secondary">Login</button>
            </form>
            <p>Don't have an account? <a is="c-link" href="/register">Register here.</a></p>
            <div class="hr uppercase font-bold">
                <hr> <span> or </span> <hr>
            </div>
            <div class="social-login">
                <button is="c-button" class="btn-default oauth-btn" id="fortytwo"> <img src="/public/assets/icons/42.svg" alt="42"/> intra </button>
                <button is="c-button" class="btn-default oauth-btn" id="google"> <img src="/public/assets/icons/google.svg" alt="google"/> google </button>
            </div>
        </div>
        `;
	}
}

customElements.define("p-login", Login);
