import Router from "../../router/router.js";

export default class Notfound extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <c-logo class="my-12 flex-col justify-center items-center"></c-logo>
            <div class="notfound flex-col justify-center items-center vh-50 gap-6">
                <h1 class="text-5xl">404</h1>
                <h2>Page not found</h2>
                <p class="text-stroke">Sorry, the page you are looking for does not exist.</p>
                <button is="c-button" class="btn-default mt-8" onclick="window.history.back()">Go back</button>
            </div>
        `;
    }
}

customElements.define("p-notfound", Notfound);
