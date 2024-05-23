export default class Matchhistory extends HTMLElement {
    constructor() {
        super();
        this.player1 = this.getAttribute('me');
        this.player2 = this.getAttribute('them');
        this.score1 = this.getAttribute('my-score');
        this.score2 = this.getAttribute('their-score');
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="match-history__wrapper">
            <div class="match-history__player">
                <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef" alt="" />
                <div class="match-history__player-details">
                    <h3>${this.player1}</h3>
                    <h4 class="text-success">${this.score1}</h4>
                </div>
            </div>
            <div class="match-history__state ${this.isWinner ? 'isWinner' : 'isLoser'}">
                <i class="fa fa-times text-danger"></i>
                <i class="fa fa-check text-success"></i>
            </div>
            <div class="match-history__player">
                <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" alt="" />
                <div class="match-history__player-details">
                    <h3>${this.player2}</h3>
                    <h4 class="text-danger">${this.score2}</h4>
                </div>
            </div>
        </div>
        `;
    }
}

