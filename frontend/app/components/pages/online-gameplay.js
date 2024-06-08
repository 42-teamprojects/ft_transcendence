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
        // this.unsubscribe = matchState.subscribe(() => {
            // console.log("matchstate : ", this.match);

            // if (matchState.playerLeft) {
            
            // }
        //     this.render();
        // })
        // document.addEventListener('click', () => {
        //     matchState.closeMatchConnection(this.match_id);
        //     Router.instance.navigate('/dashboard/home');
        // });
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
