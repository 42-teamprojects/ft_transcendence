import Router from '../../router/router.js';
import { matchState } from '../../state/matchState.js';

export default class Onlinegameovermodal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.player = '';
    }

    connectedCallback() {
        this.render();
        this.subtitle = this.querySelector('#subtitle');

        let countdown = 5;
        let intervalId = setInterval(() => {
            this.subtitle.textContent = `Back to brackets in ...${countdown}`;
            countdown--;

            if (countdown < 0) {
                Router.instance.navigate('/dashboard/home');
                clearInterval(intervalId);
            }
        }, 1000);
    }

    disconnectedCallback() {}

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
    render() {
        // const buttons = `
        // <section class="actions mt-6">
        //     <button id="cancel-btn" class="btn-default text-secondary w-full">Back to home</button>
        // </section>
        // `
        
        this.innerHTML = /*html*/`
        <div id="backdrop"></div>
        <div class="modal">
            <header class="text-center">
                <h1 id="title" class="text-3xl font-bold mb-2">${this.player} Won</h1>
                <h2 id="subtitle" class="text-xl font-normal text-stroke">${this.tournament ? "Back to brackets in ...5" : "Back to brackets in ...5"}</h2>
            </header>
        </div>
        `;
    }
}

