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

    disconnectedCallback() { }

    render() {
        this.innerHTML = /*html*/`
        <div class="qualifications">
        <div class="flex-col-center my-10 gap-9">
            <div class="mb-8">
                <h1 class="text-center mb-4">Tournament brackets</h1>
                <h3 class="text-center font-medium text-stroke">1st Round</h3>
            </div>
            <div class="flex-col-center gap-9 w-full" style="max-width: 90%">
                <div class="flex-col-center gap-4" >
                    <c-bracket></c-bracket>
                </div>
                <form id="game" class="w-full flex-col-center mt-8">
                    <button is="c-button" type="submit" class="btn-primary mt-9">Start 1st Game</button>
                </form>
            </div>
        </div>
        </div>
        `;
    }
}

customElements.define('p-qualification', Qualifications);