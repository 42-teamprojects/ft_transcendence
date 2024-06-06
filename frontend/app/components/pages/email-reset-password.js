import { validateEmail } from '../../utils/validations.js';
import Toast from '../comps/toast.js';
import Authentication from '../../auth/authentication.js';
import { handleFormSubmitApi } from '../../utils/utils.js';
import Router from '../../router/router.js';

export default class Emailresetpassword extends HTMLElement {
    constructor() {
        super();
        this.classList.add('full-page');

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
			Authentication.instance.resetPasswordEmail.bind(Authentication.instance),
			(data) => validateEmail(data['email']),
			() => {
                Toast.notify({type: 'success', message: "We sent an email to your inbox"})
                Router.instance.navigate("/login");
			}
		);
	}

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Password Reset Request</h1>
            <img src="/public/assets/icons/ok.svg" alt="email verification">
            <form method="post" class="mt-8">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" name="email" class="input-field" placeholder="Enter your Email" />
                </div>
                <button is="c-button" type="submit" class="btn-secondary">Request Password Reset</button>
            </form>
            <p>Forgot your email? <a is="c-link" href="/register"> Ydek feh</a>.</p>
        </div>
        `;
    }
}

customElements.define('p-email-reset-password', Emailresetpassword);