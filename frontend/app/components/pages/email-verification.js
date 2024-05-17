export default class Emailverification extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form");
        this.input = this.form.querySelector("input");
        this.verify = this.querySelector("#verify")
        this.input.addEventListener("keyup", this.handleChange.bind(this));
        this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    handleChange(e) {
        const code = e.target.value;
        if (code.length === 6) {
            this.verify.disabled = false;
            this.verify.click();
            this.input.value = "";
        } else {
            this.verify.disabled = true;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const code = this.input.value;
        console.log(code);
        /* Verify the code, by calling the api /api/auth/verify-email/  
        with a post request (the same as i did in login you can find the code at authenticaion.js file)
        with the code in the body of the request then wait for the response 
        and if the response is successful navigate to the dashboard 
        and show a success message using 
        Toast.notify({ type: "success", message: "Email verified successfuly" }); 
        otherwise show an error message using Toast.notify({ type: "error", message: "Invalid code" }); */
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Email Verification</h1>
            <img src="/public/assets/icons/ok.svg" alt="email verification">
            <p>Enter the 6-digit code sent to your email</p>
            <form method="post">
            <div class="form-group">
                <input type="text" name="code" class="input-field" placeholder="Verification code" maxlength="6" />
                <p>Didn't get the email? <a is="c-link" href=""> Resend</a>.</p>
            </div>
            <button is="c-button" id="verify" class="btn-secondary" disabled>Verify</button>
            </form>
            <p>Too lazy to verify it? <a is="c-link" href="/dashboard/home"> Do it later</a>.</p>
        </div>
        `;
    }
}

customElements.define('p-email-verification', Emailverification);