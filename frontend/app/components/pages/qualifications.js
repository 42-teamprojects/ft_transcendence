import Router from "../../router/router.js";
import { tournamentStore } from "../../state/tournamentStore.js";
import Toast from "../comps/toast.js";

export default class Qualifications extends HTMLElement {
    constructor() {
        super();
        document.title = "Qualifications | Blitzpong.";
        this.tournamentDetails;
    }

    connectedCallback() {
        this.tournamentDetails = tournamentStore.getState()
        if (!this.tournamentDetails.playersNumber
            || this.tournamentDetails.playersNumber === 0) {
            Toast.notify({ type: "error", message: "Please make sure all the players are registred" });
            Router.instance.navigate('/local/tournament');
            return;
        }
        this.render();
    }

    disconnectedCallback() {
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="">
            <c-bracket></c-bracket>
        </div>
        `;
    }
}

customElements.define('p-qualification', Qualifications);