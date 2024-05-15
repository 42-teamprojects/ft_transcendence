import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";

export default class Oauth2 extends HTMLElement {
    constructor() {
        super();

        // get query search params
        const urlParams = new URLSearchParams(window.location.search);

        // get code from query search params
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        // get provider from pathname
        const provider = window.location.pathname.split('/')[3];

        this.callbackOAuth(provider, code, state);
    }
    
    connectedCallback() {
        this.render();
    }

    async callbackOAuth(provider, code, state) {
        try {
            const isGranted = await Authentication.instance.callbackOAuth(provider, code, state);
            if (isGranted) {
                Router.instance.navigate("/dashboard/home");
            }
        }
        catch (error) {
            console.error(error);
            Router.instance.navigate("/login");
        }
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="flex-col vh-full flex-col-center">
                <span class="loader"></span>
            </div>
        `;
    }
}

customElements.define('p-oauth2', Oauth2);