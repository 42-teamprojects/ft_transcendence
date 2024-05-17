export default class Conversationfooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.form = this.querySelector("form.conversation-form");
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Message sent");
        });

    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation-footer">
            <form class="conversation-form">
                <input class="input-field message" type="text" placeholder="Type a message">
                <button type="submit" class="btn-send">
                    <img src="public/assets/icons/send.svg" alt="send">
                </button>
            </form>
        </div>
        `;
    }
}

