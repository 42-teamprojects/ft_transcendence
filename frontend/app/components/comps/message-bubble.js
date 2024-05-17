export default class Messagebubble extends HTMLElement {
    constructor() {
        super();
        this.messageType = this.getAttribute('type') || '';
        this.message = this.getAttribute('message') || '';
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="message-bubble ${this.messageType}">
            <div class="message-content">
                <p>Hello this is me mouad do you remember last time I smashed you</p>
            </div>
        </div>
        `;
    }
}

