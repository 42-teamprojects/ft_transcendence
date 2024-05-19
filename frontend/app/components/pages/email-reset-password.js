import { validateEmail } from '../../utils/validations.js';
import Toast from '../comps/toast.js';
import Authentication from '../../auth/authentication.js';

export default class Emailresetpassword extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();

        this.form = this.querySelector('form');

        this.button = this.form.querySelector('button')

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = e.target.email.value;
            const errors = validateEmail(email);
            if (errors.length > 0) {
                Toast.notify({type: 'error', message: errors[0]});
                return;
            }

            try {
                this.button.setAttribute('processing', 'true')
                await Authentication.instance.resetPasswordEmail(email);
                this.button.setAttribute('processing', 'false')
                Toast.notify({type: 'success', message: "We sent an email to your inbox"})
            }
            catch (error) {
                this.button.setAttribute('processing', 'false')
                console.log(error)
                Toast.notify({type: 'success', message: error.detail})
            }
        });
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
                <button is="c-button" id="verify" class="btn-secondary">Request Password Reset</button>
            </form>
            <p>Forgot your email? <a is="c-link" href="/"> Ydek feh</a>.</p>
        </div>
        `;
    }
}

customElements.define('p-email-reset-password', Emailresetpassword);