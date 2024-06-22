import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import { userState } from "../../state/userState.js";
import Toast from "../comps/toast.js";
export default class Onlinegameplay extends HTMLElement {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.sessionId = this.params.get('id');
    }
    
    async connectedCallback() {
        this.match = matchState.state.match
        if (!this.match) {
            Router.instance.navigate('/dashboard/home');
            Toast.notify({ type: "error", message: "Action not allowed" }); 
            return;
        }
        matchState.matchSetup();

        this.render();
        this.handleGameOverFunc = this.handleGameOver.bind(this);
        this.querySelector('c-online-pong-table').addEventListener('game-over', this.handleGameOverFunc);

    }
    async handleGameOver(e) {
        const { winner } = e.detail;
        // console.log(winner);
        matchState.setWinner(winner);
        const modal = document.createElement('c-online-gameover-modal');
        //get winer name
        const match = matchState.state.match;
        const name = matchState.getOpponent(match).username;
        modal.setAttribute('player', +userState.state.user.id === +winner ? 'You' : name);
        this.appendChild(modal);
        setTimeout(() => {
            this.querySelector('c-online-gameover-modal').open();
        }, 100);
    }

    disconnectedCallback() {
        matchState.closeMatchConnection();
        this.removeEventListener('game-over', this.handleGameOverFunc);
    }

    render() {
        this.innerHTML = /*html*/`
        <c-online-pong-table match_id="${this.match.id}" player1= ${this.match.player1.id} player2=${this.match.player2.id} id="table"></c-online-pong-table>
        `;
    }
}

customElements.define('p-onlinegameplay', Onlinegameplay);
