
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
                    <h1 id="title" class="text-3xl font-bold mb-2">Search for friends   </h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke spacing-2">find your friends or new ones</h2>
                </header>
                <form class="flex items-center gap-2 mt-6 mb-6">
                    <input type="text" class="input-field" placeholder="Search username, Email..." />
                    <button class="btn-secondary py-4" style="width: 0"><i class="fa fa-search"></i></button> 
                </form>
                <main>
                    <div class="flex-center flex-wrap" style="gap: 2rem 3rem;">
                        <c-usercard username="HassanOigag" status="offline" img="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper"></c-usercard>
                        <c-usercard username="YusufIsawi" status="online" img="https://api.dicebear.com/8.x/thumbs/svg?seed=Garfield"></c-usercard>
                        <c-usercard username="Jhonesnow" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=youssef"></c-usercard>
                        <c-usercard username="msodor" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad"></c-usercard>
                        <c-usercard username="hassssan" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hassan"></c-usercard>
                        <c-usercard username="hamzaaa" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza"></c-usercard>
                    </div>
                </main>
                <section class="actions mt-6">
                    <button id="cancel-btn" class="btn-default text-secondary w-full">Cancel</button>
                </section>
            </div>
        `;
    }
}

