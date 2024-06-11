import LocalMatch from '../../entities/LocalMatch.js';
import Router from '../../router/router.js';
import { matchState } from '../../state/matchState.js';

export default class Gameovermodal extends HTMLElement {
    constructor() {
        super();
        this.player = '';
        this.tournament = this.getAttribute('tournament') || false;
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        if (!this.tournament) {
            const backdrop = this.querySelector('#backdrop');
            const cancelButton = this.querySelector('#cancel-btn');
            const confirmButton = this.querySelector('#confirm-btn');
            backdrop.addEventListener('click', this.hide.bind(this));
            cancelButton.addEventListener('click', this.#cancel.bind(this));
            confirmButton.addEventListener('click', this.#confirm.bind(this));
            return;
        }
    
        this.subtitle = this.querySelector('#subtitle');

        let countdown = 5;
        let intervalId = setInterval(() => {
            this.subtitle.textContent = `Back to brackets in ...${countdown}`;
            countdown--;

            if (countdown < 0) {
                matchState.reset();
                Router.instance.navigate(this.tournament ? '/local/tournament/qualifications' : '/dashboard/home');
                clearInterval(intervalId);
            }
        }, 1000);
    }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }

        if (name === 'tournament') {
            this.tournament = true;
        }
        if (name === 'player') {
            this.player = newValue;
            this.render();
        }

    }

    static get observedAttributes() {
        return ['opened', 'player', 'tournament'];
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
        matchState.reset();
        Router.instance.navigate('/local');
    }

    #confirm() {
        this.hide();
        Router.instance.navigate('/local/1v1');
    }

    render() {

        const buttons = `
        <section class="actions mt-6">
            <button id="cancel-btn" class="btn-default text-secondary w-full">Back to home</button>
            <button id="confirm-btn" class="btn-secondary w-full">Rematch</button>
        </section>
        `
        
        this.innerHTML = /*html*/`
        <div id="backdrop"></div>
        <div class="modal">
            <header class="text-center">
                <h1 id="title" class="text-3xl font-bold mb-2">${this.player} Won</h1>
                <h2 id="subtitle" class="text-xl font-normal text-stroke">${this.tournament ? "Back to brackets in ...5" : "What do you want to do next?"}</h2>
            </header>
            ${!this.tournament ? buttons : ''}
        </div>
        `;
    }
}
