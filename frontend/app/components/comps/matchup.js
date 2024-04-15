export default class Matchup extends HTMLElement {
    constructor() {
        super();
        this.participant1 = this.getAttribute("participant1") || "TBA";  
        this.participant2 = this.getAttribute("participant2") || "TBA";
        this.winner = this.getAttribute("winner") || "N/A"  ;

    }

	attributeChangedCallback(name, oldValue, newValue) {
        if (name === "winner") {
            this.winner = newValue;
        }
        if (name === "participant1") {
            this.participant1 = newValue;
        }
        if (name === "participant2") {
            this.participant2 = newValue;
        }
    }

	static get observedAttributes() {
        return ["participant1", "participant2", "winner"];
	}
    
    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="participants">
                <div class="participant ${this.winner === this.participant1 && 'winner'}"><span>${this.participant1}</span></div>
                <div class="participant ${this.winner === this.participant2 && 'winner'}"><span>${this.participant2}</span></div>
            </div>
        `;
    }
}
