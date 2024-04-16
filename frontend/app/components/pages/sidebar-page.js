export default class Sidebarpage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div><c-sidebar></c-sidebar></div>
        `;
    }
}

customElements.define('p-sidebarpage', Sidebarpage);