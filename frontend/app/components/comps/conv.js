export default class Conv extends HTMLElement {
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
            <c-conv-header img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" username="msodor" state="online"></c-conv-header>
        </div>
        `;
    }
}

