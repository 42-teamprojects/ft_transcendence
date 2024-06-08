import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import Toast from "../comps/toast.js";
export default class Onlinegameplay extends HTMLElement {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.match_id = this.params.get('id');
        this.player_1_id = this.params.get("player_1");
        this.player_2_id = this.params.get("player_2");

        matchState.matchSetup(this.match_id);
    }

    connectedCallback() {
        this.render();
        // this.unsubscribe = matchState.subscribe(() => {
            // console.log("matchstate : ", this.match);

            if (matchState.playerLeft) {
                Toast.notify({ type: "warning", message: "Opponent left the match" });
                matchState.closeMatchConnection(this.match_id);
                Router.instance.navigate('/dashboard/home');
            }
        //     this.render();
        // })
        // document.addEventListener('click', () => {
        //     matchState.closeMatchConnection(this.match_id);
        //     Router.instance.navigate('/dashboard/home');
        // });
    }

    disconnectedCallback() {
        // this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
        <c-online-pong-table match_id="${this.match_id}" player1= ${this.player_1_id} player2=${this.player_2_id} id="table"></c-online-pong-table>
        `;
    }
}

customElements.define('p-onlinegameplay', Onlinegameplay);
