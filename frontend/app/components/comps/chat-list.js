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
                <div class="chat-list__header__title">Chat</div>
                <div class="chat-list__header__search">
                    <input type="text" class="input-field   " placeholder="Search" />
                </div>
            </div>
        </div>
        `;
    }
}

