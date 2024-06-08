import { validateConfirmPassword, validateEmail, validateRequire } from '../../utils/validations.js';
import Toast from '../comps/toast.js';
import Authentication from '../../auth/authentication.js';
import Router from '../../router/router.js';
import { handleFormSubmitApi } from '../../utils/utils.js';

export default class Resetpassword extends HTMLElement {
    constructor() {
        super();
        this.classList.add('full-page');
        let params = new URL(document.location).searchParams;
        this.uid = params.get("uid");
        this.token = params.get("token");
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
			Authentication.instance.resetPassword.bind(Authentication.instance),
			(data) => {
                return {...validateRequire(data), ...validateConfirmPassword(data['password'], data['confirm_password'])}
            },
			() => {
                Toast.notify({type: 'success', message: "Password reset successfully. You can now login with your new password"})
                Router.instance.navigate("/login");
			}
		);
	}

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Reset Password</h1>
            <form method="post" class="mt-8">
                <div class="form-group">
                    <input type="hidden" name="uid" value="${this.uid}" />
                    <input type="hidden" name="token" value="${this.token}" />
                    <input type="password" name="password" class="input-field" placeholder="New Password" />
                    <input type="password" name="confirm_password" class="input-field" placeholder="Confirm Password" />
                </div>
                <button is="c-button" type="submit" id="verify" class="btn-secondary">Reset Password</button>
            </form>
        </div>
        `;
    }
}


customElements.define('p-reset-password', Resetpassword);