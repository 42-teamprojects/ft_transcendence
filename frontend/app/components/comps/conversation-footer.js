export default class Conversationfooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation-footer">
            <input class="input-field message" type="text" placeholder="Type a message">
            <button class="btn-send">
                <img src="public/assets/icons/send.svg" alt="send">
            </button>
        </div>

        `;
    }
}

