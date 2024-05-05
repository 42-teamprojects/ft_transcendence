import Router from '../../router/router.js';
import { matchService } from '../../state/matchService.js';

export default class Gameovermodal extends HTMLElement {
    constructor() {
        super();
        this.player = '';
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        const backdrop = this.querySelector('#backdrop');
        const cancelButton = this.querySelector('#cancel-btn');
        const confirmButton = this.querySelector('#confirm-btn');
        
        backdrop.addEventListener('click', this.hide.bind(this));
        cancelButton.addEventListener('click', this.#cancel.bind(this));
        confirmButton.addEventListener('click', this.#confirm.bind(this));
    }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }

        if (name === 'player') {
            this.player = newValue;
            this.render();
        }
    }

    static get observedAttributes() {
        return ['opened', 'player'];
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
        matchService.reset();
        Router.instance.navigate('/local');
    }

    #confirm() {
        this.hide();
        matchService.getState().match.resetScore();
        Router.instance.reload();
    }

    render() {
        this.innerHTML = /*html*/`
        <div id="backdrop"></div>
        <div class="modal">
            <header class="text-center">
                <h1 id="title" class="text-3xl font-bold mb-2">${this.player} Won</h1>
                <h2 id="subtitle" class="text-xl font-normal text-stroke">What do you want to do next?</h2>
            </header>
            <main class="w-full">
            </main>
            <section class="actions">
                <button id="cancel-btn" class="btn-default text-secondary w-full">Back to home</button>
                <button id="confirm-btn" class="btn-secondary w-full">Rematch</button>
            </section>
        </div>
        `;
    }
}
