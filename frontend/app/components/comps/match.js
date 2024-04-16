import { tournamentStore } from "../../state/tournamentStore.js";

export default class Match extends HTMLElement {
    constructor() {
        super();
        this.player1Id = this.getAttribute("player1-id") || undefined;
        this.player2Id = this.getAttribute("player2-id") || undefined;
        this.winnerId = this.getAttribute("winner-id") || undefined;
        this.players = [];
        this.player1Name = "";
        this.player2Name = "";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "player1-id") {
            this.player1Id = newValue;
            this.render();
        }
        if (name === "player2-id") {
            this.player2Id = newValue;
            this.render();
        }
        if (name === "winner-id") {
            this.winnerId = newValue;
            this.render();
        }
    }

    static get observedAttributes() {
        return ["player1-id", "player2-id", "winner-id"];
    }

    connectedCallback() {
        this.players = tournamentStore.getState().players;
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.findPlayersNames();

        this.innerHTML = /*html*/`
            <div class="player ${this.winnerId && this.winnerId === this.player1Id && 'winner'}">${this.player1Name}</div>
            <div class="player ${this.winnerId && this.winnerId === this.player2Id && 'winner'}">${this.player2Name}</div>
        `;
    }

    findPlayersNames() {
        if (this.players.length > 0 && this.player1Id) {
            const player1 = this.players.find(player => player.playerId === parseInt(this.player1Id));
            this.player1Name = player1 ? player1.alias : 'Unknown Player';
        }
        if (this.players.length > 0 && this.player2Id) {
            const player2 = this.players.find(player => player.playerId === parseInt(this.player1Id));
            this.player2Name = player2 ? player2.alias : 'Unknown Player';
        }
    }
}
