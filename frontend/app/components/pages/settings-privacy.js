export default class Settingsprivacy extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="home-content">
            <div class="flex-center gap-6" >
                <a is="c-link" href="/local/">
                    <c-card action='Play' title='Local Match' type="primary"></c-card>
                </a>
                <c-card action='Play' title='Online Match' type="secondary"></c-card>
            </div>
            <div class="flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-settings-nav></c-settings-nav>
            </div>
        </div>
        `;
        // <div class="home-content">
        //     <div class="flex-col gap-3">
        //         <h1>Settings</h1>
        //         <h2 class="text-stroke font-me">Privacy</h2>
        //     </div>
        //     <div class="flex-col-center gap-5">
        //         <c-playerresources></c-playerresources>
        //         <c-settings-nav></c-settings-nav>
        //     </div>
        // </div>
    }
}

customElements.define('p-settings-privacy', Settingsprivacy);