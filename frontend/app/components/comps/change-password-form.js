import Authentication from "../../auth/authentication.js";
import { handleFormSubmitApi } from "../../utils/utils.js";
import { validateConfirmPassword, validateRequire } from "../../utils/validations.js";
import Toast from "../comps/toast.js";

export default class Changepasswordform extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();

		this.form = this.querySelector("#change-password");

		this.form.addEventListener("submit", this.handleSubmit.bind(this));
	}

    async handleSubmit(e) {
        e.preventDefault();

        await handleFormSubmitApi(
            this.form,
            Authentication.instance.changePassword.bind(Authentication.instance),
            (data) => {
                return {
                    ...validateRequire(data),
                    ...validateConfirmPassword(data["new_password"], data["confirm_password"]),
                };
            },
            () => {
                Toast.notify({ type: "success", message: "Password changed successfully" });
            },
        );
    }

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <form id="change-password" class="settings-form">
            <div class="form-group-inline">
                <label for="current_password">Current password</label>
                <div className="form-group">
                    <input type="password" id="current_password" name="current_password" class="input-field" placeholder="Current password"/>
                </div>
            </div>
            <div class="form-group-inline">
                <label for="new_password">New password</label>
                <div className="form-group">
                    <input type="password" id="new_password" name="new_password" class="input-field" placeholder="New password"/>
                </div>
            </div>
            <div class="form-group-inline">
                <label for="confirm_password">Confirm password</label>
                <div className="form-group">
                    <input type="password" id="confirm_password" name="confirm_password" class="input-field" placeholder="Confirm password"/>
                </div>
            </div>
            <div class="form-group-inline">
                <label></label>
                <button is="c-button" class="btn-secondary" type="submit">Change password</button>
            </div>
        </form>
        `;
	}
}
