export default class Components extends HTMLElement {
    constructor() {
        super();
        document.title = "Components";
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = /*html*/`
            <h1>components</h1>
            <button is="c-button" href="/" class="btn-primary mt-6">Get started</button>
            <button is="c-button" href="/" class="btn-secondary mt-6">Get started</button>
            <button is="c-button" href="/" class="btn-dark mt-6">Get started</button>
        `;
    }
}
