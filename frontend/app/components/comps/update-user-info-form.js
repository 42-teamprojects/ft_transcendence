import Authentication from "../../auth/authentication.js";
import { userState } from "../../state/userState.js";
import { handleFormSubmitApi } from "../../utils/utils.js";
import { validateEmail, validateFullName, validateRequire, validateUsername } from "../../utils/validations.js";
import Toast from "./toast.js";
import { useFormData } from "../../utils/useForm.js";

export default class Updateuserinfoform extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();

		this.form = this.querySelector("form#update-user-info");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		if (this.user.provider !== null) {
			this.form.email.remove();
		}

		const validations = (data) => {
			const errors = {
				...validateRequire(data),
				...validateEmail(data["email"]),
				...validateFullName(data["full_name"]),
				...validateUsername(data["username"]),
			};
			if (this.user.provider !== null) {
				delete errors.email
			}
			return errors;
		}

		await handleFormSubmitApi(
			this.form,
			Authentication.instance.changeUserData.bind(Authentication.instance),
			validations,
			(data) => {
				userState.setState({ user: {...this.user, ...data} });
				Toast.notify({ type: "success", message: "Changes saved successfully" });
			},
		);
	}

	disconnectedCallback() {}

	render() {
		this.user = userState.state.user;
		if (!this.user) return;
		this.innerHTML = /*html*/ `
        <form id="update-user-info" class="settings-form">
            <div class="form-group-inline">
                <label for="username">Username</label>
                <div className="form-group"> 
                    <input type="text" id="username" name="username" class="input-field" placeholder="Username" value="${this.user.username}"/>
                </div>
            </div>
            <div class="form-group-inline">
                <label for="full_name">Full Name</label>
                <div className="form-group">
                    <input type="text" id="full_name" name="full_name" class="input-field" placeholder="Full Name" value="${this.user.full_name}"/>
                </div>
            </div>
			<div class="form-group-inline">
                <label for="email">Email</label>
                <div className="form-group">
                    <input type="text" id="email" name="email" class="input-field" placeholder="Email" value="${this.user.email}" ${this.user.provider !== null ? 'disabled' : ''}/>
					${this.user.is_verified ? "" : /*html*/`
						<span class="input-error text-xs ml-3 text-danger">Your email is not verified. <a is="c-link" href="/resend-verification-email" class="underline font-bold text-danger">Verify Now.</a></span>
					`}
                </div>
            </div>
            <div class="form-group-inline">
                <label></label>
                <button is="c-button" class="btn-secondary" type="submit">Save changes</button>
			</div>
        </form>
        `;
	}
}
