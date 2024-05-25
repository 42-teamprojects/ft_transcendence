import { userService } from "../../state/userService.js";
import { handleFormSubmitApi } from "../../utils/utils.js";
import { validateEmail, validateFullName, validateRequire, validateUsername } from "../../utils/validations.js";
import Toast from "./toast.js";

export default class Updateuserinfoform extends HTMLElement {
	constructor() {
		super();
		this.user = userService.getState().user;
	}

	connectedCallback() {
		this.render();

		this.form = this.querySelector("form#update-user-info");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

	handleSubmit(e) {
		e.preventDefault();

		handleFormSubmitApi(
			this.form,
			(data) => alert("Replace this with the actual api call\n" + JSON.stringify(data)), // Replace with the actual function api
			(data) => {
				return {
					...validateRequire(data),
					...validateEmail(data["email"]),
					...validateFullName(data["full_name"]),
					...validateUsername(data["username"]),
				};
			},
			() => {
				Toast.notify({ type: "success", message: "Changes saved successfully" });
			},
		);
	}

	disconnectedCallback() {}

	render() {
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
            ${this.user.provider === null ? /*html*/`
			<div class="form-group-inline">
                <label for="email">Email</label>
                <div className="form-group">
                    <input type="text" id="email" name="email" class="input-field" placeholder="Email" value="${this.user.email}"/>
					${this.user.is_verified ? "" : /*html*/`
						<span class="input-error text-xs ml-3 text-danger">Your email is not verified. <a is="c-link" href="" class="underline font-bold text-danger">Verify Now.</a></span>
					`}
                </div>
            </div>` : ""}
            <div class="form-group-inline">
                <label></label>
                <button is="c-button" class="btn-secondary" type="submit">Save changes</button>
            </div>
        </form>
        `;
	}
}
