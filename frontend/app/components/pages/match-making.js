import { config } from "../../config.js";
import Router from "../../router/router.js";
import { userState } from "../../state/userState.js";
import { matchState } from "../../state/matchState.js";

export default class Matchmaking extends HTMLElement {
    constructor() {
        super();
        this.user = userState.state.user;
        this.opponent = {username: "Searching...", avatar: "/storage/avatars/default.png"};
    }
    
    connectedCallback() {
        this.user = userState.state.user;
        this.render();
 
        this.unsubscribe = matchState.subscribe(async () => {
            this.matchData = matchState.state.match;
            this.opponent = await  userState.fetchUserById(this.matchData.opponent);
            console.log("opponent", this.opponent);
            console.log("test", this.matchData);
            this.render();
            this.text = document.querySelector('.starting');
            let countdown = 3;
            let intervalId = setInterval(() => {
                this.text.textContent = `Starting in ${countdown}...`;
                countdown--;
                
                if (countdown < 0) {
                    Router.instance.navigate('/dashboard/home');
                    clearInterval(intervalId);
                }
            }, 1000);
            let btn = this.querySelector('.btn-primary');
            btn.addEventListener('click', () => {
                //go back to the home page]
                matchState.closeConnection('matchId');
                Router.instance.navigate('/dashboard/home');
            });
        });
        let btn = this.querySelector('.btn-primary');
        btn.addEventListener('click', () => {
            //go back to the home page]
            Router.instance.navigate('/dashboard/home');
            matchState.closeConnection('matchId');
            this.unsubscribe();
        });
        // console.log(this.user);
        matchState.setup('matchId');
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="match-making-container flex-col  flex-center gap-40">
                <h1 class="starting">${(this.opponent.username == "Searching...") ? "Searching..." : "Starting in 3..."}</h1>
                <div class="flex flex-center gap-30">
                    <div class="flex flex-col gap-5">
                        <div class="img-box">
                            <img src="${config.backend_domain}${this.user.avatar}" alt="player1" class="player-img">
                        </div>
                        <h2 class="text-secondary text-3xl">${this.user.username}</h2>
                    </div>
                    <h1 class="text-6xl font-black spacing-10">VS</h1>
                    <div class="flex flex-col gap-5">
                        <div class="img-box">
                            <img src="${config.backend_domain}${this.opponent.avatar}" alt="player1" class="player-img">
                        </div>
                        <h2 class="text-primary text-3xl">${this.opponent.username}</h2>
                    </div>
                </div>
                <button class="btn-primary">quit match</button>
            </div>
        `;
    }
}

customElements.define('p-matchmaking', Matchmaking);