import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import Toast from "../comps/toast.js";
export default class Onlinegameplay extends HTMLElement {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.match_id = this.params.get('id');
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
        <c-online-pong-table match_id="${this.match_id}" id="table"></c-online-pong-table>
        `;
    }
}

customElements.define('p-onlinegameplay', Onlinegameplay);
