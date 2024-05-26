import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class ResendVerificationEmail extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.render();
        try {
            await Authentication.instance.resendVerificationEmail();
            Toast.notify({ type: "success", message: "We sent an email to your inbox" });
            Router.instance.navigate("/email-verification")
        } catch (error) {
            Toast.notify({ type: "error", message: error?.detail || "An error occurred, please try again later"});
            Router.instance.back();
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

customElements.define('p-resend-verification-email', ResendVerificationEmail);