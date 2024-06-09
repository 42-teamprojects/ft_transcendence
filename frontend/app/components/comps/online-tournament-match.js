import { config } from "../../config.js";
import { onlineTournamentState } from "../../state/onlineTournamentState.js";
import { userState } from "../../state/userState.js";

export default class Onlinetournamentmatch extends HTMLElement {
    constructor() {
        super();
        this.matchId = parseInt(this.getAttribute("match-id")) || undefined;
        this.match = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "match-id") {
            this.matchId = parseInt(newValue);
            this.render();
        }
    }

    static get observedAttributes() {
        return ["match-id"];
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = onlineTournamentState.subscribe(this.render.bind(this));
    }
    
    disconnectedCallback() {
        this.unsubscribe();
    }
    
    render() {
        this.findMatch();
        this.innerHTML = [this.match?.player1, this.match?.player2]
            .map((player, i) => /*html*/`
            <div class="player ${this.match?.winner === player?.id ? 'winner' : ''}">
                <div class="flex gap-3 ${player?.id === userState.state.user.id ? 'font-bold' : ''}">
                    ${player ? `<img class="player-avatar" src="${config.backend_domain}${player?.avatar}" alt="avatar" class="avatar" />` : ""}
                    ${player?.username || ""}
                </div>
            </div>
            `).join('');
    }

    findMatch() {
        this.match = onlineTournamentState.state.matches.find(match => match.id === this.matchId);
    }
}

