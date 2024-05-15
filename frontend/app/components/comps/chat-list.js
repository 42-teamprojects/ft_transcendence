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
                <img src="/public/assets/icons/plus.svg" alt="add" class="chat-list__add" />
            </div>
            <div class="chat-list__search">
                <input type="text" class="input-field w-90 mt-6" style="border: none;" placeholder="Search Messages" />
            </div>
        </div>
        `;
    }
}

