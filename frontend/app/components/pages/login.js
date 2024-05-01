import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class Login extends HTMLElement {
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
                username: formData.get("username"),
                password: formData.get("password"),
            };
            
            try {
                await Authentication.instance.login(data.username, data.password);
                Router.instance.navigate("/dashboard/home");
            } catch (error) {
                if (error.detail) {
                    Toast.notify({type: "error", message: error.detail });
                    return;
                }
                if (error["username"]) {
                    const usernameInput = this.querySelector("input[name='username']");
                    usernameInput.classList.add("error");
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("input-error", "text-xs", "ml-3", "text-danger");
                    errorSpan.textContent = error["username"];
                    usernameInput.insertAdjacentElement("afterend", errorSpan);
                }
                if (error["password"]) {
                    const passwordInput = this.querySelector("input[name='password']");
                    passwordInput.classList.add("error");
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("input-error", "text-xs", "ml-3", "text-danger");
                    errorSpan.textContent = error["password"];
                    passwordInput.insertAdjacentElement("afterend", errorSpan);
                }
            }
        });
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="form-container">
            <h1>Log in</h1>
            <form>
                <div class="form-group">
                    <input type="text" name="username" class="input-field" placeholder="Username"/>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="input-field" placeholder="Password" />
                    <span class="text-xs mr-1 text-right">
                        <a is="c-link" href="/password/forgot">Forgot password?</a>
                    </span>
                </div>
                <button is="c-button" class="btn-secondary ">Login</button>
            </form>
            <p>Don't have an account? <a is="c-link" href="/register">Register here.</a></p>
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

customElements.define("p-login", Login);
