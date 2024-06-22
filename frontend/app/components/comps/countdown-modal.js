import Router from "../../router/router.js";
import { chatState } from "../../state/chatState.js";
import { messageState } from "../../state/messageState.js";

export default class Countdownmodel extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
        this.countdown = 3;
	}

	connectedCallback() {
		this.render();
        this.subtitle = this.querySelector('#subtitle');
	}

	disconnectedCallback() {
        clearInterval(this.intervalId);
    }

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("opened")) {
			this.isOpen = true;
		} else {
			this.isOpen = false;
		}
	}

	static get observedAttributes() {
		return ["opened"];
	}

	open() {
		this.setAttribute("opened", "");
		this.isOpen = true;
        this.countdown = 3;
        this.intervalId = setInterval(() => {
            this.subtitle.textContent = `${this.countdown}`;
            this.countdown--;

            if (this.countdown < 0) {
                clearInterval(this.intervalId);
                setTimeout(() => {
                    this.subtitle.textContent = '3';
                }, 300);
                this.hide();
            }
        }, 1000);
	}

	hide() {
        if (this.hasAttribute("opened")) {
            this.removeAttribute("opened");
		}
		this.isOpen = false;
	}

	render() {
		this.innerHTML = /*html*/ `
            <div id="backdrop"></div>
            <div class="modal" style="background: none;">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-normal mb-2">Round starts in</h1>
                    <h2 id="subtitle" class="text-6xl font-bold spacing-2">3</h2>
                </header>
            </div>
        `;
	}
}
