export default class Matchhistory extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'isWinner') {
            this.isWinner = newValue;
        }
        if (name === 'player1') {
            this.player1 = newValue;
        }
        if (name === 'player2') {
            this.player2 = newValue;
        }
        if (name === 'score1') {
            this.score1 = newValue;
        }
        if (name === 'score2') {
            this.score2 = newValue;
        }
    }

    static get observedAttributes() {
        return ['isWinner', 'player1', 'player2', 'score1', 'score2'];
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="match-history__wrapper">
            <div class="match-history__player">
                <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef" alt="" />
                <div class="match-history__player-details">
                    <h3>Jane</h3>
                    <h4 class="text-success">5</h4>
                </div>
            </div>
            <div class="match-history__state isLoser">
                <i class="fa fa-times text-danger"></i>
                <i class="fa fa-check text-success"></i>
            </div>
            <div class="match-history__player">
                <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" alt="" />
                <div class="match-history__player-details">
                    <h3>Jane</h3>
                    <h4 class="text-danger">3</h4>
                </div>
            </div>
        </div>
        `;
    }
}

