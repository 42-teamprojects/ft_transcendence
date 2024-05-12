import Authentication from "../../auth/authentication.js";
import AuthGuard from "../../guards/authGuard.js";
import Router from "../../router/router.js";
import { useFormData } from "../../utils/useForm.js";
import { handleInputError, removeErrors } from "../../utils/utils.js";
import { validateRegister } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class SignUp extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// if ((new AuthGuard()).canActivate()) {
		// 	Router.instance.navigate("/dashboard/home");
		// 	return;
		// }
		this.render();
		this.registerBtn = this.querySelector("button.btn-secondary");
		this.form = this.querySelector("form");
		this.inputs = Array.from(this.querySelectorAll('input'));

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		this.inputs.forEach((input) => removeErrors.call(this, input.name));

		const user = useFormData(this.form).getObject();

		const errors = validateRegister(user);

		if (Object.keys(errors).length > 0) {
			Object.keys(errors).forEach((key) => {
				handleInputError.call(this, key, errors[key]);
			});
			return;
		}

		try {
			this.registerBtn.setAttribute("processing", "true");
			await Authentication.instance.register(user);
			this.registerBtn.setAttribute("processing", "false");
			Router.instance.navigate("/login");
			Toast.notify({
				type: "success",
				message: "Account created successfuly, Please verify your email. check spam",
			});
		} catch (errors) {
			this.registerBtn.setAttribute("processing", "false");
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

	disconnectedCallback() {
		this.querySelector("form").removeEventListener("submit", this.handleSubmit);
	}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Sign up</h1>
            <form>
                <div class="form-group">
                    <input type="text" name="full_name" class="input-field" placeholder="Full name"/>
                </div>
                <div class="form-group">
                    <input type="text" name="username" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="email" name="email" class="input-field" placeholder="Email"/>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="input-field" placeholder="Password" />
                </div>
                <div class="form-group">
                    <input type="password" name="confirm_password" class="input-field" placeholder="Confirm password" />
                </div>
                <button is="c-button" class="btn-secondary ">Sign up</button>
            </form>
            <p>Already signed up? <a is="c-link" href="/login">Log in here.</a></p>
        </div>
            `;
	}
}

customElements.define("p-signup", SignUp);
