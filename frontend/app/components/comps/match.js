import { tournamentStore } from "../../state/tournamentStore.js";

export default class Match extends HTMLElement {
    constructor() {
        super();
        this.matchId = parseInt(this.getAttribute("match-id")) || undefined;
        this.winnerId = parseInt(this.getAttribute("winner-id")) || undefined;
        this.match = null;
        this.player1Name = "";
        this.player2Name = "";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "match-id") {
            this.matchId = parseInt(newValue);
            this.render();
        }
        if (name === "winner-id") {
            this.winnerId = parseInt(newValue);
            this.render();
        }
    }

    static get observedAttributes() {
        return ["match-id", "winner-id"];
    }

    connectedCallback() {
        this.match = tournamentStore.getState().matches.find(match => match.id === this.matchId);
        console.log(tournamentStore.getState().matches, this.match, this.matchId)
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.findPlayersNames();

        this.innerHTML = /*html*/`
            <div class="player ${this.winnerId && this.winnerId === this.match.winner.id && 'winner'}">${this.player1Name}</div>
            <div class="player ${this.winnerId && this.winnerId === this.player2Id && 'winner'}">${this.player2Name}</div>
        `;
    }

    findPlayersNames() {
        if (this.match) {
            this.player1Name = this.match.player1.alias ? this.match.player1.alias : 'Unknown Player';
        }
        if (this.match) {
            this.player2Name = this.match.player2.alias ? this.match.player2.alias : 'Unknown Player';
        }
    }
}
