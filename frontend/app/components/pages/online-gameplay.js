import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import Toast from "../comps/toast.js";
export default class Onlinegameplay extends HTMLElement {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.sessionId = this.params.get('id');
    }
    
    async connectedCallback() {
        this.match = matchState.state.match
        matchState.matchSetup();

        this.render();
        this.querySelector('c-online-pong-table').addEventListener('game-over', this.handleGameOver.bind(this));

    }
    handleGameOver(e) {
        const { winner } = e.detail;
        matchState.setWinner(winner);
        const modal = document.createElement('c-gameover-modal');
        modal.setAttribute('online', true);
        modal.setAttribute('player', winner.username);
        this.appendChild(modal);
        setTimeout(() => {
            this.querySelector('c-gameover-modal').open();
        }, 100);
    }

    disconnectedCallback() {
        matchState.closeMatchConnection();
    }

    render() {
        this.innerHTML = /*html*/`
        <c-online-pong-table match_id="${this.match.id}" player1= ${this.match.player1.id} player2=${this.match.player2.id} id="table"></c-online-pong-table>
        `;
    }
}

customElements.define('p-onlinegameplay', Onlinegameplay);
