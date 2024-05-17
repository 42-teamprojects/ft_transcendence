export default class Conversation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation vh-full w-full">
            <c-conversation-header img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" username="msodor" state="online"></c-conversation-header>
            <c-conversation-body></c-conversation-body>
            <c-conversation-footer></c-conversation-footer>
        </div>
        `;
    }
}

