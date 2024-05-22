export default class Matchhistory extends HTMLElement {
    constructor() {
        super();
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
                    <h3>Jane</h3>
                    <h4 class="text-success">5</h4>
                </div>
            </div>
            <div class="match-history__state">
                <i class="fa fa-trophy text-success"></i>
            </div>
            <div class="match-history__player">
                <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" alt="" />
                <div class="match-history__player-details">
                    <h3>Jane</h3>
                    <h4 class="loser text-danger">3</h4>
                </div>
            </div>
        </div>
        `;
    }
}

