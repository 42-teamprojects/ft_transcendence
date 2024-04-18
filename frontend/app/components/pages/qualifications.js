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

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-col-center my-10 gap-14 w-full">
            <div class="">
                <h1 class="text-center mb-4">Tournament brackets</h1>
                <h3 class="text-center font-medium text-stroke">Round 1</h3>
            </div>
            <div class="w-full">
                <c-bracket class=full></c-bracket>
            </div>
            <form id="game" class="w-full flex-col-center">
                <button is="c-button" type="submit" class="btn-primary mt-9">Start 1st Game</button>
            </form>
        </div>
        `;
    }
}

customElements.define('p-qualification', Qualifications);