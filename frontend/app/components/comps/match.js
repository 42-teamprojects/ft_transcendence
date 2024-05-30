import { tournamentState } from "../../state/tournamentState.js";

export default class Match extends HTMLElement {
    constructor() {
        super();
        this.matchId = parseInt(this.getAttribute("match-id")) || undefined;
        this.match = null;
        this.player1 = null;
        this.player2 = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "match-id") {
            this.matchId = parseInt(newValue);
            this.update();
        }
    }

    static get observedAttributes() {
        return ["match-id"];
    }

    connectedCallback() {
        this.update();
        this.unsubscribe = tournamentState.subscribe(this.update.bind(this));
    }
    
    disconnectedCallback() {
        this.unsubscribe();
    }
    
    update() {
        this.findMatch();
        this.render();
    }
    
    render() {
        this.innerHTML = [this.match?.player1, this.match?.player2]
            .map((player, i) => /*html*/`
                <div class="player ${this.match?.winner?.equals(player) ? 'winner' : ''}">
                    ${player?.alias || ""}
                </div>
            `).join('');
        
        this.innerHTML += /*html*/`<span class="match-id">${this.matchId + 1}</span>`

    }
    
    findMatch() {
        const { matches } = tournamentState.state;
        const match = matches.find(match => match.id === this.matchId);
        this.match = match;
    }
}
