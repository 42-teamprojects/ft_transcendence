import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { handleFormSubmitApi, handleInputError, removeErrors } from "../../utils/utils.js";
import { validateRegister } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class SignUp extends HTMLElement {
	constructor() {
		super();
        this.classList.add('full-page');
		document.title = "Sign up | Blitzpong.";
	}

	connectedCallback() {
		this.render();

		this.form = this.querySelector("form");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		const formValidations = (data) => {
			return validateRegister(data);
		};

		await handleFormSubmitApi(
			this.form,
			Authentication.instance.register.bind(Authentication.instance),
			formValidations,
			() => {
				Router.instance.navigate("/email-verification");
				Toast.notify({
					type: "success",
					message: "Account created successfully, Please verify your email. check spam",
				});
			},
		);
	}

	disconnectedCallback() {
		this.form.removeEventListener("submit", this.handleSubmit);
	}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Sign up</h1>
            <form>
                <div class="form-group">
                    <input type="text" name="full_name" id="full_name" class="input-field" placeholder="Full name"/>
                </div>
                <div class="form-group">
                    <input type="text" name="username" id="username" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="email" name="email" id="email" class="input-field" placeholder="Email"/>
                </div>
                <div class="form-group">
                    <input type="password" name="password" id="password" class="input-field" placeholder="Password" />
                </div>
                <div class="form-group">
                    <input type="password" name="confirm_password" class="input-field" placeholder="Confirm password" />
                </div>
                <button is="c-button" type="submit" class="btn-secondary ">Sign up</button>
            </form>
            <p>Already signed up? <a is="c-link" href="/login">Log in here.</a></p>
        </div>
            `;
	}
}

customElements.define("p-signup", SignUp);
