export default class Login extends HTMLElement {
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
            <h1>Log in</h1>
            <div>
                <input type="text" class="input-field" placeholder="Username or email"/>
                <input type="password" class="input-field" placeholder="Password" /> 
                <a class="small" href="/password/forgot">FORGOT?</a>
                <button is="c-button" class="btn-secondary ">Login</button>
            </div>
            <p>Don't have an account? <a href="/sign-up">Sign up here.</a></p>
            <div class="hr">
                <hr> <span> OR </span> <hr>
            </div>
            <div class="social-login">
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/42.svg" alt="42"/> INTRA </button>
                <button is="c-button" class="btn-default"> <img src="/public/assets/icons/google.svg" alt="google"/> GOOGLE </button>
            </div>
        </div>


        `;
    }
}

customElements.define('p-login', Login);
