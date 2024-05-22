export default class Chatsearchmodal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        const backdrop = this.querySelector('#backdrop');
        const cancelButton = this.querySelector('#cancel-btn');
        // const confirmButton = this.querySelector('#confirm-btn');
        backdrop.addEventListener('click', this.hide.bind(this));
        cancelButton.addEventListener('click', this.#cancel.bind(this));
        // confirmButton.addEventListener('click', this.#confirm.bind(this));
    }

    disconnectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }

    static get observedAttributes() {
        return ['opened'];
    }

    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if (this.hasAttribute('opened')) {
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }

    #cancel(event) {
        this.hide();
    }

    #confirm() {
        this.hide();
    }
    render() {
        this.innerHTML = /*html*/`
            <div id="backdrop"></div>
            <div class="modal">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">Search</h1>
                </header>
                <input type="text" class="input-field" placeholder="Search Messages" />
                <section class="actions mt-6">
                    <button id="cancel-btn" class="btn-default text-secondary w-full">Cancel</button>
                </section>
            </div>
        `;
    }
}

