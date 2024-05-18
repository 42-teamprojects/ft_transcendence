export default class Settingsnav extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="widget-container card-border flex-col gap-4">
                <div class="title-bar flex justify-between items-center mb-3">
                    <h1>Settings</h1>
                </div>
                <div class="flex-col gap-8">
                    <a is="c-link" href="/settings" class="active-bg-color">
                        <div class="flex-col gap-3">
                            <h3>Account</h3>
                            <p class="text-stroke text-xs">Email, username...</p>
                        </div>
                    </a>
                    <a is="c-link" href="/settings/game" class="active-bg-color">
                        <div class="flex-col gap-3">
                            <h3>Game</h3>
                            <p class="text-stroke text-xs">Theme options, paddles...</p>
                        </div>
                    </a>
                    <a is="c-link" href="/settings/privacy" class="active-bg-color">
                        <div class="flex-col gap-3">
                            <h3>Privacy</h3>
                            <p class="text-stroke text-xs">Password, 2FA...</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }
}

