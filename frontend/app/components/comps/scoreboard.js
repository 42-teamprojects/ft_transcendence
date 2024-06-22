export default class Onlinescoreboard extends HTMLElement {
    constructor() {
        super();
        this.player1 = this.getAttribute("player1")
        this.player2 = this.getAttribute("player2")
        this.score1 = this.getAttribute("score1")
        this.score2 = this.getAttribute("score2")
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
    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {

        this.innerHTML = /*html*/`
        <div class="flex justify-between px-8 py-4 text-stroke">
            <p>
                <span><span class="font-bold">W</span> move up</span>,
                <span><span class="font-bold">S</span> move down</span>
            </p>
            <p>
                <span><span class="font-bold">&#8593;</span> move up</span>,
                <span><span class="font-bold">&#8595;</span> move down</span>
            </p>
        </div>
        <div class="scoreboard">
            <div class="middleBox"></div>
            <div class="leftBox"></div>
            <div class="rightBox"></div>
            <div class="middleBox"></div>
            <div class="text text1">${this.player1}</div>
            <div class="text text2">${this.player2}</div>
            <div class="text text3">${this.score1}</div>    
            <div class="text text4">${this.score2}</div>
        </div>
        `;
    }
}