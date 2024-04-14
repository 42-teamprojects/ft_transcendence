export default class Gameplay extends HTMLElement {
    constructor() {
        super();
        const urlParams = new URLSearchParams(window.location.search);
        this.params = Object.fromEntries(urlParams.entries());
        
        console.log(this.params);
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <c-table id="table"
            theme="${this.params.theme}" player1="${this.params.player1}" player2="${this.params.player2}" paddle1="${this.params.paddle1}" paddle2="${this.params.paddle2}"></table>
        `;
    }
}

customElements.define('p-gameplay', Gameplay);