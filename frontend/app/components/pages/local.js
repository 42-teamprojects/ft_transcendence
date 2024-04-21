export default class Local extends HTMLElement {
    constructor() {
        super();
        document.title = "Local | Blitzpong.";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() { }

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-col-center vh-90">
            <h1 style="margin-bottom: 5rem" class="text-center">What do you want to play?</h1>
            <div class="flex gap-4 options">

            <a is="c-link" href="/local/1v1">
                <c-card action='Play' title='1 v 1' type="primary"></c-card>
            </a>
            <a is="c-link" href="/local/tournament">
                <c-card action='Play' title='Tournament' type="secondary"></c-card>
            </a>
            </div>
        </div>
        `;
    }
}

customElements.define('p-local', Local);