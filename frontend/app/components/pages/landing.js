export default class Landing extends HTMLElement {
    constructor() {
        super();
        document.title = "Blitzpong.";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="flex-col-center vh-90">
                <c-logo class="mb-12"></c-logo>
                <h1 class="text-3xl text-center line-3 mb-8">Join the pong arena for endless <br/>gaming excitement!</h1>

                <div style="width: 350px">
                    <button is="c-button" class="btn-primary w-full mb-4" href="/local" >Play local</button>
                    <button is="c-button" class="btn-secondary w-full" href="/login">Log in and play online</button>
                </div>
            </div>
        `;
    }
}

customElements.define('p-landing', Landing);