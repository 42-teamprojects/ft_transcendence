import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class Oauth2 extends HTMLElement {
    constructor(params) {
        super();
        const { provider } = params;
        this.provider = provider;
    }
    
    connectedCallback() {
        this.innerHTML = /*html*/`
            <div class="flex-col vh-full flex-col-center">
                <span class="loader"></span>
            </div>
        `;
        // get query search params
        const urlParams = new URLSearchParams(window.location.search);

        // get code from query search params
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
            Toast.notify({ type: "error", message: "An error occurred, please try again later" });
            Router.instance.navigate("/login");
            return;
        }

        this.callbackOAuth(this.provider, code, state);
    }

    async callbackOAuth(provider, code, state) {
        try {
            await Authentication.instance.callbackOAuth(provider, code, state);
            Router.instance.navigate("/dashboard/home");
        }
        catch (error) {
            console.error(error);
            if (error.status === 423) {
                Router.instance.navigate("/verify-2fa");
                Toast.notify({ type: "info", message: error.detail });
                return;
            }
            Toast.notify({ type: "error", message: "An error occurred, please try again later" });
            Router.instance.navigate("/login");
        }
    }

    disconnectedCallback() {}
}

customElements.define('p-oauth2', Oauth2);