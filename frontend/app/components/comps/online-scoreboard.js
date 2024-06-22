
import { config } from "../../config.js";
import { matchState } from "../../state/matchState.js";
import { userState } from "../../state/userState.js";

export default class Scoreboard extends HTMLElement {
    constructor() {
        super();
        this.user = userState.state.user;
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "score1") {
            this.score1 = newValue;
            this.render()
        }
        if (name === "score2") {
            this.score2 = newValue;
            this.render()
        }
        
	}
    
	static get observedAttributes() {
        return ["score1", "score2"];
	}
    
    async connectedCallback() {
        this.user = userState.state.user;
        this.match = matchState.state.match
        this.opponent = this.match.player1.id === this.user.id ? this.match.player2 : this.match.player1;
        this.render();
    }

    disconnectedCallback() {}

    async render() {
        this.user = userState.state.user;
        this.innerHTML = /*html*/`
        <div class="flex-center py-4 text-stroke">
            <p>
                <span><span class="font-bold">W</span> move up</span>,
                <span><span class="font-bold">S</span> move down</span>
            </p>
        </div>
        <div class="scoreboard">
            <div class="leftBox">
                <img src="${config.backend_domain}${this.user.id === this.match.player1.id ? this.user.avatar : this.opponent.avatar}" alt="Pong Logo" class="w-10 h-10" >
            </div>
            <div class="rightBox">
                <img src="${config.backend_domain}${this.user.id === this.match.player2.id ? this.user.avatar : this.opponent.avatar}" alt="Pong Logo" class="w-10 h-10" >
            </div>
            <div class="middleBox"></div>
            <div class="text text1">${this.user.id === this.match.player1.id ? this.user.username : this.opponent.username}</div>
            <div class="text text2">${this.user.id === this.match.player2.id ? this.user.username : this.opponent.username}</div>
            <div class="text text3">${this.score1 || 0}</div>    
            <div class="text text4">${this.score2 || 0}</div>
        </div>
        `;
    }
}
``