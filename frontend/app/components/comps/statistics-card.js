export default class Statisticscard extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.numberAtt = this.getAttribute("number") || "none";
		this.textAtt = this.getAttribute("text") || "none";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="statistics-card">
            <img src="${this.imgAtt}" alt="icon">
            <h3 class="stat-number">${this.numberAtt}</h3>
            <p class="stat-text">${this.textAtt}</p>
        </div>
        `;
    }
}

false