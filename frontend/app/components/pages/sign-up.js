export default class Signup extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="container">
            <h1>Sign up</h1>
            <div>
                <input type="text" class="input-field" placeholder="Full name"/>
                <input type="text" class="input-field" placeholder="Username"/>
                <input type="email" class="input-field" placeholder="Email"/>
                <input type="password" class="input-field" placeholder="Password" /> 
                <input type="password" class="input-field" placeholder="Confirm password" />
                <button is="c-button" class="btn-secondary ">Sign up</button>
            </div>
            <p>Already signed up? <a is="c-link" href="/login">Log in here.</a></p>
            <div class="hr uppercase font-bold">
                <hr> <span> or </span> <hr>
            </div>
            <div class="social-login">
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/42.svg" alt="42"/> intra </button>
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/google.svg" alt="google"/> google </button>
            </div>

        </div>

        `;
    }
}

customElements.define('p-signup', Signup);