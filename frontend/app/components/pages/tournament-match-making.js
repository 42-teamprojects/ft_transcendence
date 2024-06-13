import { config } from "../../config.js";
import Router from "../../router/router.js";
import { userState } from "../../state/userState.js";
import { matchState } from "../../state/matchState.js";

export default class Privatematchmaking extends HTMLElement {
    constructor() {
        super();
        this.user = userState.state.user;
        this.opponent = {username: "Waiting...", avatar: null};
        this.params = new URLSearchParams(window.location.search);
        this.tournamentId = this.params.get('tournamentId');
        this.matchId = this.params.get('matchId');
    }
    
    connectedCallback() {
        matchState.setupMatchMaking(null, null, this.matchId);
        this.user = userState.state.user;
        this.render();
 
        this.unsubscribe = matchState.subscribe(async () => {
            this.matchData = matchState.state.match;
            this.gameSession = matchState.state.session;
            this.opponent = matchState.getOpponent(this.matchData)
            this.render();
            this.text = document.querySelector('.starting');
            let countdown = 3;
            let intervalId = setInterval(() => {    
                this.text.textContent = `Starting in ${countdown}...`;
                countdown--;
                    
                    if (countdown < 0) {
                        matchState.closeMatchMakingConnection();
                        Router.instance.navigate(`/online/1v1/game?id=${matchState.state.session.id}`);
                        clearInterval(intervalId);
                    }
            }, 1000);
            // let btn = this.querySelector('.btn-primary');
            // btn.disabled = true;
        });
        // let btn = this.querySelector('.btn-primary');
        // btn.addEventListener('click', () => {
        //     matchState.closeMatchMakingConnection();
        //     Router.instance.navigate('/dashboard/home');
        // });
        // console.log(this.user);

    }

    disconnectedCallback() {
        this.unsubscribe();
        matchState.closeMatchMakingConnection();
    }

    render() {
        this.innerHTML = /*html*/`
            <div class="match-making-container flex-col  flex-center gap-40">
                <h1 class="starting">${(this.opponent.username == "Waiting...") ? /*html*/`<c-three-dots text="Waiting for opponent" color="white"></c-three-dots>`: "Starting in 3..."}</h1>
                <div class="flex flex-center gap-30">
                    <div class="flex flex-col gap-5">
                        <div class="img-box player-border">
                            <img src="${config.backend_domain}${this.user.avatar}" alt="player1" class="player-img">
                        </div>
                        <h2 class="text-secondary text-3xl">${this.user.username}</h2>
                    </div>
                    <h1 class="text-6xl font-black spacing-10">VS</h1>
                    <div class="flex flex-col gap-5">
                        <div class="img-box ${this.opponent.username === "Waiting..." ? 'loading' : 'player-border'}">
                            ${this.opponent.avatar ? `<img src="${config.backend_domain}${this.opponent.avatar}" alt="" class="player-img">` : ''}
                        </div>
                        <h2 class="text-primary text-center text-3xl">${this.opponent.username === "Waiting..." ? /*html*/`<c-three-dots text="" color="#D7524C"></c-three-dots>` : this.opponent.username }</h2>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('p-privatematchmaking', Privatematchmaking);