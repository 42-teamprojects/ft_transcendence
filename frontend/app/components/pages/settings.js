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
        <h1>settings</h1>
        `;
    }
}

customElements.define('p-settings', Settings);