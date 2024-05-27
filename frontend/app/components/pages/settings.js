export default class Settings extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="dashboard-content">
            <main class="flex-col gap-16 mb-12">
                <div class="settings-header">
                    <h1 class="mb-2">Settings</h1>
                    <h3 class="font-normal text-stroke">Account, Email, username...</h3>
                </div>
                <section class="change-password">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Your Information</h2>
                        <h4 class="font-normal text-stroke line-3">Update your information</h4>
                    </div>
                    <c-update-user-info-form></c-update-user-in-form>
                </section>
                <form class="settings-form hidden">
                    <div class="form-group-inline">
                        <label></label>
                        <button is="c-button" class="btn-primary">Delete my account</button>
                    </div>
                </form>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-settings-nav></c-settings-nav>
            </div>
        </div>
        `;
    }
}

customElements.define('p-settings', Settings);