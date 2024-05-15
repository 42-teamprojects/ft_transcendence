export default class Chat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <h1>chat</h1>
        `;
    }
}

customElements.define('p-chat', Chat);