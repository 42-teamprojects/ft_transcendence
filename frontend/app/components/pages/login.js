import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { useFormData } from "../../utils/useForm.js";
import { handleInputError, removeErrors } from "../../utils/utils.js";
import { validateRequire } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class Login extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (Authentication.instance.auth) {
			Router.instance.navigate("/dashboard/home");
			return;
		}
		this.render();

		this.form = this.querySelector("form");
		this.inputs = Array.from(this.querySelectorAll('input'));

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		this.inputs.forEach((input) => removeErrors.call(this, input.name));

		const user = useFormData(this.form).getObject();

		const errors = validateRequire(user, ["username", "password"]);

		if (Object.keys(errors).length > 0) {
			Object.keys(errors).forEach((key) => {
				handleInputError.call(this, key, errors[key]);
			});
			return;
		}

		try {
			await Authentication.instance.login(user.username, user.password);
			Router.instance.navigate("/dashboard/home");
		} catch (errors) {
			const errorsKeys = Object.keys(errors);
			if (errorsKeys.includes("detail")) {
				Toast.notify({ type: "error", message: errors.detail });
				return;
			} else if (this.inputs.some((input) => errorsKeys.includes(input.name))) {
				this.inputs.forEach((input) => handleInputError.call(this, input.name, errors[input.name]));
			} else {
				Toast.notify({ type: "error", message: "An error occurred, please try again later" });
			}
		}
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
                        <a is="c-link" href="/password/forgot">Forgot password?</a>
                    </span>
                </div>
                <button is="c-button" class="btn-secondary ">Login</button>
            </form>
            <p>Don't have an account? <a is="c-link" href="/register">Register here.</a></p>
            <div class="hr uppercase font-bold">
                <hr> <span> or </span> <hr>
            </div>
            <div class="social-login">
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/42.svg" alt="42"/> intra </button>
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/google.svg" alt="google"/> google </button>
            </div>
        </div>
        `;
	}
}

customElements.define("p-login", Login);
