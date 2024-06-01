export default class Loader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="flex-col-center vh-full">
                <span class="loader"></span>
            </div>
        `;
    }
}

