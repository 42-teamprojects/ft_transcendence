export default class Emailverif extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="form-container">
            <h1>Email Verification</h1>
            <img src="/public/assets/icons/ok.svg" alt="email verification">
            <p>Enter the 6-digit code sent to your email</p>
            <div class="input">
                <input type="text" placeholder="code" class="input-field" >
            </div>
            <div class="form-group">
                <button is="c-button" class="btn-secondary ">Verify</button>
            </div>
            <p>Too lazy to verify it? Do it later, <a href="#">Sign in</a>.</p>
        </div>
        `;
    }
}

customElements.define('p-emailverif', Emailverif);