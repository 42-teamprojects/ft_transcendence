import { config } from "../../config.js";
import Router from "../../router/router.js";
import { userState } from "../../state/userState.js";
import { matchState } from "../../state/matchState.js";


class ThreeDots extends HTMLElement {
    constructor() {
        super();
        this.color = this.getAttribute('color') || 'white';
        this.text = this.getAttribute('text') || '';
    }

    connectedCallback() {
        this.render();
        this.dots = this.querySelectorAll('.single-dot');
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.backgroundColor = `${this.color}`;
        }
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center align-end gap-5">
            ${this.text==="" ? '' : /*html*/`<h1>${this.text}</h1>` }
            <div class="dots">
                <div class="single-dot"></div>
                <div class="single-dot"></div>
                <div class="single-dot"></div>
            </div>    
        </div>
        `;
    }
}

customElements. define('c-three-dots', ThreeDots);
export default class Matchmaking extends HTMLElement {
    constructor() {
        super();
        this.user = userState.state.user;
        this.opponent = {username: "Searching...", avatar: "/storage/avatars/default.png"};
    }
    
    connectedCallback() {
        matchState.setupMatchMaking("matchMakingId");
        this.user = userState.state.user;
        this.render();
 
        this.unsubscribe = matchState.subscribe(async () => {
            this.matchData = matchState.state.match;
            console.log("match data", this.matchData);
            this.opponent = await  userState.fetchUserById(this.matchData.opponent);
            this.render();
            this.text = document.querySelector('.starting');
            let countdown = 3;
            let intervalId = setInterval(() => {    
                this.text.textContent = `Starting in ${countdown}...`;
                countdown--;
                    
                    if (countdown < 0) {
                        matchState.closeMatchMakingConnection();
                        Router.instance.navigate(`/online/1v1/game?id=${this.matchData.data.match_id}&player_1=${this.matchData.data.player1}&player_2=${this.matchData.data.player2}`);
                        clearInterval(intervalId);
                    }
            }, 1000);
            let btn = this.querySelector('.btn-primary');
            btn.disabled = true;
        });
        let btn = this.querySelector('.btn-primary');
        btn.addEventListener('click', () => {
            //go back to the home page]
            Router.instance.navigate('/dashboard/home');
            matchState.closeMatchMakingConnection('matchMakingId');
            this.unsubscribe();
        });
        // console.log(this.user);

    }

    disconnectedCallback() {
        this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
            <div class="match-making-container flex-col  flex-center gap-40">
                <h1 class="starting">${(this.opponent.username == "Searching...") ? /*html*/`<c-three-dots text="Searching for opponent" color="white"></c-three-dots>`: "Starting in 3..."}</h1>
                <div class="flex flex-center gap-30">
                    <div class="flex flex-col gap-5">
                        <div class="img-box player-border">
                            <img src="${config.backend_domain}${this.user.avatar}" alt="player1" class="player-img">
                        </div>
                        <h2 class="text-secondary text-3xl">${this.user.username}</h2>
                    </div>
                    <h1 class="text-6xl font-black spacing-10">VS</h1>
                    <div class="flex flex-col gap-5">
                        <div class="img-box ${this.opponent.username === "Searching..." ? 'loading' : 'player-border'}">
                            <img src="${config.backend_domain}${this.opponent.avatar}" alt="" class="player-img">
                        </div>
                        <h2 class="text-primary text-center text-3xl">${this.opponent.username === "Searching..." ? /*html*/`<c-three-dots text="" color="#D7524C"></c-three-dots>` : this.opponent.username }</h2>
                    </div>
                </div>
                <button class="btn-primary">quit match</button>
            </div>
        `;
    }
}

customElements.define('p-matchmaking', Matchmaking);