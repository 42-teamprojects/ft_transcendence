export default class Gameplay extends HTMLElement {
    constructor() {
        super();
        const urlParams = new URLSearchParams(window.location.search);
        this.params = Object.fromEntries(urlParams.entries());
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <pre>
                ${this.params.player1}
                ${this.params.paddle1}
                ${this.params.player2}
                ${this.params.paddle2}
                ${this.params.theme}
            </pre>
        `;
    }
}
