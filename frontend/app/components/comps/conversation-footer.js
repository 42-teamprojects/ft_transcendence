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
            <form class="conversation-form" action="">
                <input class="input-field message" type="text" placeholder="Type a message">
                <button type="submit" class="btn-send">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
    }
}
