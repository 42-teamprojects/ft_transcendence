import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import { tournamentState } from "../../state/tournamentState.js";
import Toast from "../comps/toast.js";

export default class Tournamentgame extends HTMLElement {
    constructor() {
        super();
        document.title = "Tournament Gameplay | Blitzpong.";

        this.match = matchState.state.match
        if (this.match === null) {
            Toast.notify({ type: "warning", message: "Please setup your game" })
            Router.instance.navigate('/local/tournament')
            return;
        }
        // console.log(this.match)
    }

    connectedCallback() {
        if (this.match === null) return;
        
        this.render();
        this.cTable = this.querySelector('c-table');
        this.cTable.addEventListener('game-over', this.handleGameOver.bind(this));
    }

    handleGameOver(e) {
        const { winner } = e.detail;
        matchState.setWinner(winner);
        tournamentState.finishMatch(winner.id);

        const modal = document.createElement('c-gameover-modal');
        modal.setAttribute('tournament', true);
        modal.setAttribute('player', winner.alias);

        this.appendChild(modal);
        setTimeout(() => {
            this.querySelector('c-gameover-modal').open();
        }, 100);
    
    }

    disconnectedCallback() {
        // this.cTable.removeEventListener('game-over', this.handleGameOver.bind(this));
    }

    render() {
        this.innerHTML = /*html*/`
            <c-table id="table"></c-table>
        `;
    }
}

customElements.define('p-tournamentgame', Tournamentgame);