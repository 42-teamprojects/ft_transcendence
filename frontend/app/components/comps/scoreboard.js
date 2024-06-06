import { config } from "../../config.js";
import { userState } from "../../state/userState.js";

export default class Scoreboard extends HTMLElement {
    constructor() {
        super();
        // this.player1 = this.getAttribute("player1")
        // this.player2 = this.getAttribute("player2")
        this.score1 = this.getAttribute("score1")
        this.score2 = this.getAttribute("score2")
        //get paranms
        const params = new URLSearchParams(window.location.search);
        this.player_1_id = params.get("player_1");
        this.player_2_id = params.get("player_2");

        // console.log("opponent id = ", this.opponentId);
        this.opponent = {username: "", avatar: ""};

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
        // if (this.opponent.username !== "Searching...")
        // console.log("user id = ", this.user.id);
        // console.log("player 1 id = ", this.player_1_id);
        if (+this.player_1_id !== this.user.id)
            this.opponent = await userState.fetchUserById(this.player_1_id);
        else
            this.opponent = await userState.fetchUserById(this.player_2_id);
        this.user = userState.state.user;

        // console.log("opponent", this.opponent);
        this.render();
    }

    disconnectedCallback() {}

    async render() {
        this.user = userState.state.user;
        // console.log("user", this.user);
        // console.log("opponent", this.opponent);
        this.innerHTML = /*html*/`
        <div class="scoreboard">
            <div class="leftBox">
                <img src="${config.backend_domain}${this.user.id === +this.player_1_id ? this.user.avatar : this.opponent.avatar}" alt="Pong Logo" class="w-10 h-10" >
            </div>
            <div class="rightBox">
                <img src="${config.backend_domain}${this.user.id === +this.player_2_id ? this.user.avatar : this.opponent.avatar}" alt="Pong Logo" class="w-10 h-10" >
            </div>
            <div class="middleBox"></div>
            <div class="text text1">${this.user.id === +this.player_1_id ? this.user.username : this.opponent.username}</div>
            <div class="text text2">${this.user.id === +this.player_2_id ? this.user.username : this.opponent.username}</div>
            <div class="text text3">${this.score1}</div>    
            <div class="text text4">${this.score2}</div>
        </div>
        `;
    }
}
``