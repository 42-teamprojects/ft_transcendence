export default class Matchhistory extends HTMLElement {
    constructor() {
        super();
        this.style.width = '100%';
        this.player1 = this.getAttribute('me');
        this.player2 = this.getAttribute('them');
        this.score1 = this.getAttribute('my-score');
        this.score2 = this.getAttribute('their-score');
        this.isWinner = this.score1 > this.score2;

        this.setAttribute('tooltip', '20-10-2024')
        this.setAttribute('flow', 'left')
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
                    <h4 class="${this.isWinner ? 'text-success' : 'text-danger'}">${this.score1}</h4>
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
                    <h4 class="${this.isWinner ? 'text-danger' : 'text-success'}">${this.score2}</h4>
                </div>
            </div>
        </div>
        `;
    }
}

