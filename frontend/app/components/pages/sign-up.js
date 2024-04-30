export default class SignUp extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Sign up</h1>
            <form>
                <div class="form-group">
                    <input type="text" class="input-field" placeholder="Full name"/>
                </div>
                <div class="form-group">
                    <input type="text" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="email" class="input-field" placeholder="Email"/>
                </div>
                <div class="form-group">
                    <input type="password" class="input-field" placeholder="Password" />
                </div>
                <div class="form-group">
                    <input type="password" class="input-field" placeholder="Confirm password" />
                </div>
                <button is="c-button" class="btn-secondary ">Sign up</button>
            </form>
            <p>Already signed up? <a is="c-link" href="/login">Log in here.</a></p>
            </div>
            `;
            // <div class="hr uppercase font-bold">
            //     <hr> <span> or </span> <hr>
            // </div>
            // <div class="social-login">
            //     <button is="c-button" class="btn-default"> <img src="/public/assets/icons/42.svg" alt="42"/> intra </button>
            //     <button is="c-button" class="btn-default"> <img src="/public/assets/icons/google.svg" alt="google"/> google </button>
            // </div>
    }
}

customElements.define("p-signup", SignUp);