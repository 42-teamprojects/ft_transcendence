export default class Chatlist extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="chat-list">
            <div class="chat-list__header">
                <span class="chat-list__title">Messages</span>
            </div>
            <div class="chat-list__search">
                <input type="text" class="input-field   " placeholder="Search" />
            </div>
        </div>
        `;
    }
}

