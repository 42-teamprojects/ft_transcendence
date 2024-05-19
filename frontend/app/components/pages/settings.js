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
            <main>
                <div class="settings-header">
                    <h1 class="mb-2">Settings</h1>
                    <h3 class="font-normal text-stroke">Account, Email, username...</h3>
                </div>
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