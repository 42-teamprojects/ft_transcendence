import { validateConfirmPassword, validateEmail } from '../../utils/validations.js';
import Toast from '../comps/toast.js';
import Authentication from '../../auth/authentication.js';
import Router from '../../router/router.js';

export default class Resetpassword extends HTMLElement {
    constructor() {
        super();
        let params = new URL(document.location).searchParams;
        this.uid = params.get("uid");
        this.token = params.get("token");
    }

    connectedCallback() {
        this.render();

        this.form = this.querySelector('form');

        this.button = this.form.querySelector('button')

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const new_password = e.target.new_password.value;
            const confirm_password = e.target.confirm_password.value;
            const errors = validateConfirmPassword(new_password, confirm_password);
            if (errors.length > 0) {
                Toast.notify({type: 'error', message: errors[0]});
                return;
            }

            try {
                this.button.setAttribute('processing', 'true')
                await Authentication.instance.resetPassword(new_password, this.uid, this.token);
                this.button.setAttribute('processing', 'false')
                Toast.notify({type: 'success', message: "password reset successfully. You can now login with your new password"})
                Router.instance.navigate("/login");
            }
            catch (error) {
                this.button.setAttribute('processing', 'false')
                console.log(error)
                Toast.notify({type: 'error', message: error.detail})
            }
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Reset Password</h1>
            <form method="post" class="mt-8">
                <div class="form-group">
                    <input type="password" name="new_password" class="input-field" placeholder="New Password" />
                    <input type="password" name="confirm_password" class="input-field" placeholder="Confirm Password" />
                </div>
                <button is="c-button" id="verify" class="btn-secondary">Reset Password</button>
            </form>
        </div>
        `;
    }
}


customElements.define('p-reset-password', Resetpassword);