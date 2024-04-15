import Router from "../../router/router.js";
import Toast from "../comps/toast.js";

export default class Gameplay extends HTMLElement {
    constructor() {
        super();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.size < 5) {
            Toast.notify({ type: "warning", message: "Please setup your game" })
            Router.instance.navigate('/local/1v1')
        }
        this.params = Object.fromEntries(urlParams.entries());
    }

    connectedCallback() {
        this.render();
        this.querySelector('c-table').addEventListener('game-over', (e) => {
            const { winner } = e.detail;
            const modal = document.createElement('c-gameover-modal');
            modal.setAttribute('player', winner);
            this.appendChild(modal);
            setTimeout(() => {
                this.querySelector('c-gameover-modal').open();
            }, 100);
        });
    }

    disconnectedCallback() { }

    render() {
        this.innerHTML = /*html*/`
        <c-table id="table"
            theme="${this.params.theme}"
            player1="${this.params.player1}"
            player2="${this.params.player2}"
            paddle1="${this.params.paddle1}"
            paddle2="${this.params.paddle2}">
        </c-table>
        `;
    }
}

customElements.define('p-gameplay', Gameplay);