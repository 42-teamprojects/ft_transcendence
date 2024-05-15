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
        <c-chat-list></c-chat-list>
        `;
    }
}

customElements.define('p-chat', Chat);