export default class Messagebubble extends HTMLElement {
    constructor() {
        super();
        this.messageType = this.getAttribute('type') || '';
        this.message = this.getAttribute('message') || 'Hello this is me mouad do you remember last time I smashed you';
        this.imgAtt = this.getAttribute('img') || '';
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        ${this.messageType === 'in' ? /*html*/`
            <img src="${this.imgAtt}" alt="avatar" class="player-avatar">
        ` : ''}
        <div class="message-bubble ${this.messageType}">
            <p class="message-content">
                ${this.message}
            </p>
        </div>
        `;
    }
}

