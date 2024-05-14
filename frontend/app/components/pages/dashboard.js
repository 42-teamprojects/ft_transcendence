export default class Dashboard extends HTMLElement {
    constructor() {
        super();
        document.title = "Dashboard | Blitzpong.";
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
                <c-friendscard></c-friendscard>
            </div>
        </div>
        `;
        // <c-dailyquestscard></c-dailyquestscard>
    }
}

customElements.define('p-dashboard', Dashboard);