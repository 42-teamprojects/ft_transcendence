import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class SignUp extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (Authentication.instance.auth) {
            Router.instance.navigate("/dashboard/home");
            return;
        }
		this.render();

        const form = this.querySelector("form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            const data = {
                full_name: formData.get("full_name"),
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
                password2: formData.get("password2"),
            };

            if (data.password !== data.password2) {
                Toast.notify({type: "error", message: "Passwords do not match."});
                return;
            }

            try {
                await Authentication.instance.register(data);
                Router.instance.navigate("/login");
            } catch (error) {
                if (error.detail) {
                    Toast.notify({type: "error", message: error.detail });
                    return;
                }
            }
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Sign up</h1>
            <form>
                <div class="form-group">
                    <input type="text" name="full_name" class="input-field" placeholder="Full name"/>
                </div>
                <div class="form-group">
                    <input type="text" name="username" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="email" name="email" class="input-field" placeholder="Email"/>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="input-field" placeholder="Password" />
                </div>
                <div class="form-group">
                    <input type="password" name="password2" class="input-field" placeholder="Confirm password" />
                </div>
                <button is="c-button" class="btn-secondary ">Sign up</button>
            </form>
            <p>Already signed up? <a is="c-link" href="/login">Log in here.</a></p>
        </div>
            `;
    }
}

customElements.define("p-signup", SignUp);