export default class Settingsprivacy extends HTMLElement {
    constructor() {
        super();
        document.title = "Settings | Privacy";
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
                    <h1 class="mb-3">Settings</h1>
                    <h3 class="font-normal text-stroke">Privacy, Password, 2FA...</h3>
                </div>
                <section class="change-password">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Change password</h2>
                        <h4 class="font-normal text-stroke line-3">Must be at least 8 characters, include both lower and upper case <br /> letters and numbers</h4>
                    </div>
                    <form id="change-password" class="settings-form">
                        <div class="form-group-inline">
                            <label for="current-password">Current password</label>
                            <input type="password" id="current-password" name="current-password" class="input-field" placeholder="Current password"/>
                        </div>
                        <div class="form-group-inline">
                            <label for="new-password">New password</label>
                            <input type="password" id="new-password" name="new-password" class="input-field" placeholder="New password"/>
                        </div>
                        <div class="form-group-inline">
                            <label for="confirm-password">Confirm password</label>
                            <input type="password" id="confirm-password" name="confirm-password" class="input-field" placeholder="Confirm password"/>
                        </div>
                        <div class="form-group-inline">
                            <label></label>
                            <button class="btn-primary" type="submit">Change password</button>
                        </div>
                    </form>
                </section>
                <section class="two-factor-auth">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Two-factor authentication</h2>
                        <h4 class="font-normal text-stroke line-3">Enabling 2FA requires an OTP code for each login</h4>
                    </div>
                    <div class="enable-two-factor flex-center justify-between">
                        <div>
                            <h3 class="font-normal mb-4">Secure your account</h3>
                            <p class="text-stroke">Enable 2FA to add an extra layer of security</p>
                        </div>
                        <button class="btn-primary">Enable 2FA</button>
                    </div>
                </section>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-settings-nav></c-settings-nav>
            </div>
        </div>
        `;
    }
}

customElements.define('p-settings-privacy', Settingsprivacy);