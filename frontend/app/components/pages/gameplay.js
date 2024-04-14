export default class Gameplay extends HTMLElement {
    constructor() {
        super();
        const urlParams = new URLSearchParams(window.location.search);
        this.params = Object.fromEntries(urlParams.entries());
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <c-table id="table"></table>
        `;
    }
}

customElements.define('p-gameplay', Gameplay);