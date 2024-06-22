import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import Toast from "../comps/toast.js";

export default class Gameplay extends HTMLElement {
    constructor() {
        super();
        document.title = "Gameplay | Blitzpong.";

        this.match = matchState.state.match
        if (this.match === null) {
            Toast.notify({ type: "warning", message: "Please setup your game" })
            Router.instance.navigate('/local/1v1')
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
        const modal = document.createElement('c-gameover-modal');
        modal.setAttribute('player', winner.alias);
        this.appendChild(modal);
        setTimeout(() => {
            this.querySelector('c-gameover-modal').open();
        }, 100);
    }

    disconnectedCallback() {
        if(this.cTable) this.cTable.removeEventListener('game-over', this.handleGameOver.bind(this));
        matchState.reset();
    }

    render() {
        this.innerHTML = /*html*/`
            <c-table id="table"></c-table>
        `;
    }
}

customElements.define('p-gameplay', Gameplay);